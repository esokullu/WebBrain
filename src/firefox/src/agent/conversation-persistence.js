export const SESSION_CONVERSATION_BUDGET_BYTES = 1_500_000;
export const SESSION_CONVERSATION_RETRY_BUDGET_BYTES = 450_000;

const DATA_URL_RE = /data:(?:image|application)\/[a-zA-Z0-9+.-]+(?:;[^,\s]*)?;base64,[A-Za-z0-9+/=\s]+/g;

function byteLength(value) {
  return new TextEncoder().encode(JSON.stringify(value)).byteLength;
}

function capText(value, maxChars, marker, state) {
  const sanitized = String(value || '').replace(DATA_URL_RE, () => {
    state.compacted = true;
    return '[embedded binary data omitted from session recovery]';
  });
  if (sanitized.length <= maxChars) return sanitized;
  state.compacted = true;
  return `${sanitized.slice(0, Math.max(0, maxChars - marker.length - 1))}\n${marker}`;
}

function attachmentPlaceholder(message, kind) {
  const handles = Array.isArray(message?.attachmentHandles) ? message.attachmentHandles : [];
  if (handles.length) {
    const ids = handles.map(handle => String(handle?.attachmentId || '')).filter(Boolean).slice(0, 8);
    return `[User ${kind} attachment bytes omitted from session recovery; durable attachment handle(s): ${ids.join(', ') || 'available in chat history'}.]`;
  }
  return `[${kind === 'image' ? 'Screenshot/image' : 'Document'} bytes omitted from session recovery.]`;
}

function sanitizeValue(value, state, depth = 0) {
  if (typeof value === 'string') return capText(value, 32_000, '[large value truncated for session recovery]', state);
  if (!value || typeof value !== 'object' || depth > 6) return value;
  if (Array.isArray(value)) return value.slice(0, 100).map(item => sanitizeValue(item, state, depth + 1));
  const out = {};
  for (const [key, child] of Object.entries(value).slice(0, 100)) {
    if (typeof child === 'string' && (/^(?:data|url)$/i.test(key)) && /^data:.*;base64,/i.test(child)) {
      state.compacted = true;
      out[key] = '[embedded binary data omitted from session recovery]';
    } else {
      out[key] = sanitizeValue(child, state, depth + 1);
    }
  }
  return out;
}

function sanitizeContent(message, state, caps) {
  if (message?.transientCompletionVerification === true) {
    state.compacted = true;
    return '[Completion verification screenshot omitted from persisted history.]';
  }
  const content = message?.content;
  if (typeof content === 'string') {
    const cap = message.role === 'tool' ? caps.toolChars : caps.textChars;
    return capText(content, cap, '[large content truncated for session recovery]', state);
  }
  if (!Array.isArray(content)) return sanitizeValue(content, state);
  return content.slice(0, 100).map(block => {
    if (block?.type === 'image_url' || block?.type === 'image') {
      state.compacted = true;
      return { type: 'text', text: attachmentPlaceholder(message, 'image') };
    }
    if (block?.type === 'document' || block?.source?.type === 'base64') {
      state.compacted = true;
      return { type: 'text', text: attachmentPlaceholder(message, 'document') };
    }
    return sanitizeValue(block, state);
  });
}

function sanitizeMessage(message, state, caps) {
  if (!message || typeof message !== 'object') return message;
  const out = { ...message, content: sanitizeContent(message, state, caps) };
  if (Array.isArray(message.tool_calls)) {
    out.tool_calls = message.tool_calls.slice(0, 50).map(call => ({
      ...call,
      function: call?.function ? {
        ...call.function,
        arguments: capText(call.function.arguments || '', caps.toolArgsChars, '[tool arguments truncated for session recovery]', state),
      } : call?.function,
    }));
  }
  if (Array.isArray(message.responseItems)) out.responseItems = sanitizeValue(message.responseItems, state);
  return out;
}

function reduceToBudget(messages, maxBytes, state, preserveMessageIndices = []) {
  if (byteLength(messages) <= maxBytes) return messages;
  const out = messages.map(message => ({ ...message }));
  const preserved = new Set(
    Array.isArray(preserveMessageIndices)
      ? preserveMessageIndices.filter(index => Number.isInteger(index) && index >= 0 && index < out.length)
      : [],
  );
  let keepRecentFrom = Math.max(1, out.length - 14);
  for (let index = 1; index < keepRecentFrom && byteLength(out) > maxBytes; index++) {
    const message = out[index];
    // The agent supplies the active task binding's original user turn,
    // clarification questions, and answers. Keep those small authority-bearing
    // messages intact even when a long tool loop pushes them outside the
    // ordinary recent-message window; otherwise a worker restart can promote
    // only the latest answer fragment as a new task.
    if (!message || message.role === 'system' || preserved.has(index)) continue;
    state.compacted = true;
    out[index] = {
      role: message.role,
      ...(message.tool_call_id ? { tool_call_id: message.tool_call_id } : {}),
      // The collapsed text is gone, so this turn no longer carries any task
      // authority. Mark it app-owned or the agent's task binding would treat
      // the placeholder as the latest genuine user request after a restart.
      ...(message.role === 'user'
        ? { webbrainAppOwned: true, webbrainAppOwnedKind: 'session_recovery_placeholder' }
        : {}),
      content: '[Earlier message omitted from bounded session recovery snapshot.]',
    };
  }
  // A compacted assistant message loses its tool_calls, which orphans the
  // paired `tool` result messages that carry the same tool_call_id. Restoring
  // such a snapshot into the live conversation makes the next provider call
  // fail with "tool call ID not found", so drop every `tool` message whose id
  // is no longer referenced by any remaining assistant tool_calls.
  if (state.compacted) {
    const presentCallIds = new Set();
    for (const message of out) {
      if (message?.role !== 'assistant' || !Array.isArray(message.tool_calls)) continue;
      for (const call of message.tool_calls) {
        if (call && typeof call.id === 'string') presentCallIds.add(call.id);
      }
    }
    for (let index = out.length - 1; index >= 0; index--) {
      const message = out[index];
      if (message?.role === 'tool' && typeof message.tool_call_id === 'string' && !presentCallIds.has(message.tool_call_id)) {
        state.compacted = true;
        out.splice(index, 1);
      }
    }
    keepRecentFrom = Math.max(1, out.length - 14);
  }
  for (let index = keepRecentFrom; index < out.length && byteLength(out) > maxBytes; index++) {
    const message = out[index];
    if (!message || typeof message.content !== 'string' || message.content.length <= 4_000) continue;
    state.compacted = true;
    out[index] = { ...message, content: `${message.content.slice(0, 3_900)}\n[content truncated for session recovery]` };
  }
  // Signed provider state is opaque. If the snapshot is still oversized,
  // remove whole replay/tool pairs instead of truncating a signature.
  let droppedReplay = false;
  for (let index = 0; index < out.length && byteLength(out) > maxBytes; index++) {
    const message = out[index];
    if (!message?._reasoning_replay?.providerState) continue;
    const rest = { ...message };
    delete rest._reasoning_replay;
    delete rest.tool_calls;
    out[index] = typeof rest.content !== 'string' || !rest.content.trim()
      ? { ...rest, content: '[Provider reasoning omitted from session recovery.]' }
      : rest;
    state.compacted = true;
    droppedReplay = true;
  }
  if (droppedReplay) {
    const presentCallIds = new Set(out.flatMap(message => (
      message?.role === 'assistant' && Array.isArray(message.tool_calls)
        ? message.tool_calls.map(call => call?.id).filter(Boolean)
        : []
    )));
    for (let index = out.length - 1; index >= 0; index--) {
      const message = out[index];
      if (message?.role === 'tool' && !presentCallIds.has(message.tool_call_id)) out.splice(index, 1);
    }
  }
  return out;
}

export function serializeConversationForSession(messages, options = {}) {
  const maxBytes = Number.isFinite(options.maxBytes) ? Math.max(100_000, options.maxBytes) : SESSION_CONVERSATION_BUDGET_BYTES;
  const tight = maxBytes <= SESSION_CONVERSATION_RETRY_BUDGET_BYTES;
  const caps = tight
    ? { textChars: 16_000, toolChars: 8_000, toolArgsChars: 8_000 }
    : { textChars: 96_000, toolChars: 32_000, toolArgsChars: 24_000 };
  const state = { compacted: false };
  const sanitized = Array.isArray(messages) ? messages.map(message => sanitizeMessage(message, state, caps)) : [];
  const bounded = reduceToBudget(sanitized, maxBytes, state, options.preserveMessageIndices);
  return { messages: bounded, bytes: byteLength(bounded), compacted: state.compacted };
}

export function isSessionQuotaError(error) {
  const message = String(error?.message || error || '');
  return /quota|QUOTA_BYTES|bytes? exceeded|storage limit/i.test(message);
}
