/**
 * Pure trace → Markdown serializer for /export --traces.
 *
 * Consumes the trace store's per-run event log (trace/recorder.js) — an
 * append-only, compaction-immune record whose tool results are the RAW structured
 * values (pre-truncated by the recorder, never `_wrapUntrusted`-wrapped). That is
 * the right source for a tool chain; `this.conversations` is not (it is compacted,
 * enriched, and wrapped — see the closed PR #348 review).
 *
 * This renders the TOOL CHAIN: lifecycle metadata, privacy-safe visual-delivery
 * evidence, tool names, and errors — in order. Explicit lossless runs may also
 * render bounded request/response content. Screenshot pixels and vision
 * descriptions remain omitted; the complete metadata record is available in
 * the Traces page.
 *
 * Pure and browser-neutral → unit-tested in test/run.js without a DOM or IndexedDB.
 *
 * @param {Array<{run: object, events: Array}>} runsWithEvents  chronological runs,
 *   each with its ordered event list.
 */

import { isKnownKind } from '../trace/event-model.js';

const ARGS_LIMIT = 300;
const RESULT_LIMIT = 600;
const LOSSILESS_MESSAGE_PREVIEW_LIMIT = 2000;
const FOOTER = '_Screenshot pixels and vision descriptions are omitted here — see the Traces page for the complete record._';
const UNKNOWN_EVENTS_NOTE = (n) => `_Note: ${n} unknown event(s) skipped._`;

// Credential masking for the opt-in lossless tier. Exports of lossless runs
// contain real request content, so obvious secret shapes are masked before
// they reach a Markdown file — the same spirit as the strict-redaction path
// used elsewhere, kept pure and browser-neutral here.
const SECRET_PATTERNS = [
  /\bsk-[A-Za-z0-9_-]{8,}/g,
  /\bBearer\s+[A-Za-z0-9._~+/=-]{12,}/gi,
];
const SENSITIVE_TRACE_KEY = /(?:authorization|cookie|password|passwd|passphrase|passcode|pincode|(?:verification|confirmation|security|auth|email|twofactor|2fa|mfa|onetime|recovery)code|secret|credential|privatekey|apikey|token|accesskeyid|secretaccesskey)$/i;
const SENSITIVE_TRACE_KEY_EXACT = new Set(['code', 'pin', 'otp', 'cvv', 'cvc', 'ssn']);

function isSensitiveTraceKey(key) {
  const normalized = String(key || '').replace(/[^a-z0-9]/gi, '');
  return SENSITIVE_TRACE_KEY.test(normalized) || SENSITIVE_TRACE_KEY_EXACT.has(normalized);
}

function maskSecrets(text) {
  let out = String(text ?? '');
  for (const pattern of SECRET_PATTERNS) out = out.replace(pattern, '[redacted]');
  out = out
    .replace(/\bBearer\s+[^\s,;]+/gi, 'Bearer [redacted]')
    .replace(/((?:^|[^a-zA-Z0-9_])["']?(?:authorization|cookie|password|passwd|passphrase|passcode|pincode|(?:verification|confirmation|security|auth|email|twofactor|2fa|mfa|onetime|recovery)[_ -]?code|secret|credential|private[_ -]?key|api[_ -]?key|(?:access|refresh)[_ -]?token|client[_ -]?secret|token|access[_ -]?key[_ -]?id|secret[_ -]?access[_ -]?key|otp)["']?\s*[:=]\s*)(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[^\s,;}\]]+)/gi, '$1[redacted]')
    .replace(/([?&](?:api[_-]?key|access[_-]?token|token|key)=)[^&\s]+/gi, '$1[redacted]');
  return out;
}

function redactExportValue(value, key = '') {
  if (isSensitiveTraceKey(key)) return '[redacted]';
  if (typeof value === 'string') return maskSecrets(value);
  if (Array.isArray(value)) return value.map(item => redactExportValue(item));
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).map(([childKey, item]) => [childKey, redactExportValue(item, childKey)]));
}

export function sanitizeTraceExport(payload) {
  if (payload?.run?.lossless === true) return redactExportValue(payload);
  if (!Array.isArray(payload?.runs)) return payload;

  let changed = false;
  const runs = payload.runs.map((entry) => {
    if (entry?.run?.lossless !== true) return entry;
    changed = true;
    return redactExportValue(entry);
  });

  return changed ? { ...payload, runs } : payload;
}

// Lossless requests carry the full message/tool shape. Render a bounded,
// masked preview per message so the export stays readable without dumping
// every token of a 500 KB request.
function renderLosslessRequest(messages, tools) {
  if (messages?._truncated === true) {
    const total = Number(messages.length) || 0;
    const head = truncate(oneLine(maskSecrets(messages.head || '')), LOSSILESS_MESSAGE_PREVIEW_LIMIT);
    const toolNames = Array.isArray(messages.toolNames) ? messages.toolNames : [];
    const lines = [`request truncated (${humanSize(total)} total): ${head || '(head unavailable)'}`];
    if (toolNames.length) lines.push(`tools: ${toolNames.join(', ')}`);
    return `\n${lines.join('\n')}`;
  }
  const list = Array.isArray(messages) ? messages : [];
  if (!list.length) return ' (empty request log)';
  const lines = [];
  for (const message of list.slice(0, 12)) {
    const role = oneLine(message?.role || '?');
    const content = maskSecrets(
      typeof message?.content === 'string'
        ? message.content
        : (Array.isArray(message.content)
          ? message.content.map(block => block?.text || block?.image_url?.url || '').join(' ')
          : ''),
    );
    const body = content ? truncate(oneLine(content), LOSSILESS_MESSAGE_PREVIEW_LIMIT) : '(no text)';
    lines.push(`**${role}:** ${body}`);
  }
  if (list.length > 12) lines.push(`… +${list.length - 12} more message(s) omitted`);
  if (Array.isArray(tools) && tools.length) {
    lines.push(`tools: ${tools.map(tool => oneLine(tool?.function?.name || '?')).join(', ')}`);
  } else if (tools?._truncated === true && Array.isArray(tools.toolNames) && tools.toolNames.length) {
    lines.push(`tools: ${tools.toolNames.join(', ')}`);
  }
  return `\n${lines.join('\n')}`;
}

function oneLine(t) { return String(t ?? '').replace(/\s+/g, ' ').trim(); }
function humanSize(n) { return n >= 1024 ? `${(n / 1024).toFixed(1)}kb` : `${n}b`; }

function renderEmptyModelResponse(data) {
  const details = [
    `reason=${oneLine(data.emptyReason || 'unknown')}`,
    data.finishReason ? `finish=${oneLine(data.finishReason)}` : '',
    Number.isInteger(data.outputTokens) ? `output=${data.outputTokens} tokens` : '',
    Number.isInteger(data.reasoningTokens)
      ? `reasoning=${data.reasoningTokens} tokens`
      : (Number.isInteger(data.reasoningChars) && data.reasoningChars > 0
          ? `reasoning=${data.reasoningChars} chars`
          : (data.reasoningPresent === true ? 'reasoning=present' : '')),
    Number.isInteger(data.requestedMaxTokens) ? `limit=${data.requestedMaxTokens} tokens` : '',
    Number.isInteger(data.recoveryAttempt) ? `attempt=${data.recoveryAttempt}` : '',
    `${Number.isInteger(data.contentChars) ? data.contentChars : 0} visible chars`,
    `${Number.isInteger(data.toolCallCount) ? data.toolCallCount : 0} tool calls`,
  ].filter(Boolean).join(' · ');
  return `- 🧠 Empty model response: ${details}\n`;
}

function truncate(text, limit) {
  const s = String(text ?? '');
  if (s.length <= limit) return s;
  return `${s.slice(0, limit)}… +${humanSize(s.length - limit)} truncated`;
}

// Wrap text in a fenced code block that survives content which is ITSELF fenced.
// Planner responses usually arrive already wrapped in ```json … ```; naively
// re-fencing them produces ```\n```json\n…, which no Markdown renderer parses.
// So: unwrap a single enclosing fence (keeping its language hint), then choose a
// fence longer than any backtick run left inside, per CommonMark, so nothing can
// close the block early.
function fencedBlock(content) {
  let body = String(content ?? '').trim();
  let info = '';
  const wrapped = body.match(/^```([^\n]*)\n([\s\S]*?)\n```$/);
  if (wrapped) { info = wrapped[1].trim(); body = wrapped[2].trim(); }
  const longestRun = (body.match(/`+/g) || []).reduce((n, s) => Math.max(n, s.length), 0);
  const fence = '`'.repeat(Math.max(3, longestRun + 1));
  return `${fence}${info}\n${body}\n${fence}`;
}

// IndexedDB can retain values that JSON.stringify rejects (circular / bigint /
// sparse). Never throw mid-export — fall back to a readable marker.
function safeJsonStringify(value) {
  try {
    return JSON.stringify(value);
  } catch {
    try {
      return String(value);
    } catch {
      return '(unserializable)';
    }
  }
}

function stringifyArgs(args) {
  if (args == null) return '';
  const s = typeof args === 'string' ? args : safeJsonStringify(args);
  return truncate(oneLine(s), ARGS_LIMIT);
}

// A trace tool result is a RAW value: a structured object ({success,error,...}),
// a string, or the recorder's large-result marker { _truncated, length, head }.
function renderResult(result, resultStatus = '', resultErrorCode = '') {
  const explicitStatus = ['success', 'error', 'unknown'].includes(resultStatus);
  if (explicitStatus && result == null) {
    const code = resultErrorCode ? ` · code=${oneLine(resultErrorCode)}` : '';
    return {
      text: `(tool result redacted; ${resultStatus}${code})`,
      failed: resultStatus === 'error',
    };
  }
  if (result == null) return { text: '(missing tool result)', failed: true };
  if (typeof result === 'object' && result._truncated) {
    return {
      text: `${truncate(oneLine(String(result.head ?? '')), RESULT_LIMIT)}  [recorder-truncated, ${humanSize(result.length || 0)} total]`,
      failed: false,
    };
  }
  const failed = typeof result === 'object' ? (result.success === false || !!result.error) : false;
  const s = typeof result === 'string' ? result : safeJsonStringify(result);
  return { text: truncate(oneLine(s), RESULT_LIMIT), failed };
}

function renderStreaming(data) {
  const d = data || {};
  const details = [
    oneLine(d.protocol),
    oneLine(d.reason),
    d.errorCode ? `code ${oneLine(d.errorCode)}` : '',
    Number.isFinite(d.textDeltaCount) ? `${d.textDeltaCount} text delta${d.textDeltaCount === 1 ? '' : 's'}` : '',
    Number.isFinite(d.textChars) ? `${d.textChars} chars` : '',
    Number.isFinite(d.firstDeltaMs) ? `first delta ${d.firstDeltaMs} ms` : '',
    Number.isFinite(d.durationMs) ? `${d.durationMs} ms total` : '',
    Number.isFinite(d.toolCallCount) ? `${d.toolCallCount} tool call${d.toolCallCount === 1 ? '' : 's'}` : '',
  ].filter(Boolean);
  const message = oneLine(d.message);
  return `- 🌊 Ask stream ${oneLine(d.status || 'event')}${details.length ? ` · ${details.join(' · ')}` : ''}${message ? `: ${message}` : ''}\n`;
}

function renderAttachmentMetadata(attachments) {
  const items = (Array.isArray(attachments) ? attachments : []).map((attachment) => {
    const source = attachment?.source === 'slash_screenshot' ? 'slash screenshot' : 'user upload';
    const size = Number(attachment?.size) > 0 ? `, ${humanSize(Number(attachment.size))}` : '';
    return `${oneLine(attachment?.kind || 'file')} "${oneLine(attachment?.name || 'attachment')}" (${source}${size})`;
  });
  return items.join('; ');
}

function renderLocalWikipediaRag(value) {
  if (!value || typeof value !== 'object') return '';
  const label = value.multiSource === true ? 'offline RAG' : 'local Wikipedia RAG';
  if (value.attempted !== true) return ` · ${label} ${oneLine(value.status || 'skipped')}`;
  const matches = Math.max(0, Number(value.matchCount) || 0);
  const dates = (Array.isArray(value.archiveDates) ? value.archiveDates : [])
    .map(oneLine)
    .filter(Boolean)
    .slice(0, 3);
  return ` · ${label} ${oneLine(value.status || 'attempted')} · ${matches} match${matches === 1 ? '' : 'es'}${dates.length ? ` · archive ${dates.join(', ')}` : ''}`;
}

function exportedRunStatus(run, events = []) {
  const status = oneLine(run?.status || '');
  const sawLoopError = events.some(ev => ev?.kind === 'error' && ev?.data?.phase === 'loop');
  if (status === 'done' && sawLoopError) {
    return 'loop_stopped';
  }
  return status;
}

function renderRuntimeMetadata(run) {
  const config = run?.runtimeConfig && typeof run.runtimeConfig === 'object' && !Array.isArray(run.runtimeConfig)
    ? run.runtimeConfig
    : null;
  const mode = oneLine(run?.mode || config?.mode || '');
  if (!mode && !config) return '';
  const details = [mode ? `mode=${mode}` : '', config ? `config=${JSON.stringify(config)}` : '']
    .filter(Boolean)
    .join(' · ');
  return `- ⚙️ Runtime: \`${details}\`\n`;
}

function renderPromptProvenance(value) {
  if (!value || typeof value !== 'object') return '';
  const parts = [
    value.systemPromptVariant ? `prompt ${oneLine(value.systemPromptVariant)}` : '',
    Number.isInteger(value.promptPolicyRevision) ? `prompt policy r${value.promptPolicyRevision}` : '',
    Number.isFinite(value.systemPromptChars) ? `${value.systemPromptChars} system chars` : '',
    Number.isFinite(value.messageChars) ? `${value.messageChars} total message chars` : '',
    Number.isInteger(value.toolPolicyRevision) ? `tool policy r${value.toolPolicyRevision}` : '',
    value.runtimeEnvelopeMode
      ? `runtime envelope ${oneLine(value.runtimeEnvelopeMode)}`
      : (value.runtimeEnvelopeRequired === false ? 'runtime envelope not required' : 'runtime envelope missing'),
  ].filter(Boolean);
  if (value.runtimeEnvelopeMatches === true) parts.push('envelope aligned');
  else if (value.runtimeEnvelopeMatches === false) parts.push('envelope mismatch');
  if (value.systemPromptMatchesRuntime === true) parts.push('system mode aligned');
  else if (value.systemPromptMatchesRuntime === false) parts.push('system mode mismatch');
  return parts.length ? ` · ${parts.join(' · ')}` : '';
}

export function tracesToMarkdown(runsWithEvents, {
  title = 'WebBrain Conversation — tool chain',
  notes = [],
  exportedByWebBrainVersion = '',
} = {}) {
  const runs = Array.isArray(runsWithEvents) ? runsWithEvents : [];
  let md = `# ${title}\n\n`;
  const exportVersion = oneLine(exportedByWebBrainVersion);
  if (exportVersion) md += `_Exported with WebBrain v${exportVersion}_\n\n`;
  let turnCount = 0;
  let toolCount = 0;
  let unknownEventCount = 0;

  for (const entry of runs) {
    if (!entry || !entry.run) continue;
    turnCount += 1;
    const run = entry.run;
    const user = oneLine(run.userMessage || '');
    const recordedVersion = oneLine(run.webbrainVersion || '');
    const events = Array.isArray(entry.events) ? [...entry.events].sort((a, b) => (a?.seq || 0) - (b?.seq || 0)) : [];
    const meta = [
      recordedVersion ? `recorded with WebBrain v${recordedVersion}` : 'recorded WebBrain version unavailable',
      run.model,
      exportedRunStatus(run, events),
    ].filter(Boolean).join(' · ');
    md += `## Turn ${turnCount}${user ? ` — ${user}` : ''}\n`;
    if (meta) md += `_${meta}_\n`;
    md += renderRuntimeMetadata(run);
    const attachmentMetadata = renderAttachmentMetadata(run.attachments);
    if (attachmentMetadata) md += `- 📎 User attachments: ${attachmentMetadata}\n`;
    md += '\n';

    let lastAssistantContent = '';
    for (const ev of events) {
      const d = (ev && ev.data) || {};
      if (ev.kind === 'llm_request') {
        const media = [
          Number.isFinite(d.imageBlockCount) ? `${d.imageBlockCount} image block${d.imageBlockCount === 1 ? '' : 's'}` : '',
          Number.isFinite(d.documentBlockCount) ? `${d.documentBlockCount} document block${d.documentBlockCount === 1 ? '' : 's'}` : '',
        ].filter(Boolean).join(' · ');
        md += `- 🧠 Model request: ${Number(d.messageCount) || 0} messages · ${Number(d.toolsCount) || 0} tools${media ? ` · ${media}` : ''}${renderLocalWikipediaRag(d.localWikipediaRag)}${renderPromptProvenance(d.promptProvenance)}${d.lossless === true ? renderLosslessRequest(d.messages, d.tools) : ''}\n`;
      } else if (ev.kind === 'llm_response') {
        const content = String(d.content || '').trim();
        const declaredToolCallCount = Number.isInteger(d.toolCallCount) ? Math.max(0, d.toolCallCount) : 0;
        const recordedToolCallCount = Array.isArray(d.toolCalls) ? d.toolCalls.length : 0;
        const toolCallCount = Math.max(declaredToolCallCount, recordedToolCallCount);
        const hasToolCalls = toolCallCount > 0;
        if (!content) {
          if (!hasToolCalls && d.empty !== false) {
            md += renderEmptyModelResponse(d);
          } else if (hasToolCalls && recordedToolCallCount === 0) {
            md += `- 🧠 Model response contained ${toolCallCount} tool call(s); call details omitted by the active privacy mode.\n`;
          }
          continue;
        }
        // Plan-before-Act runs record the planner call with phase:'planner'; keep
        // it (derails often start in the plan) but label it and preserve its shape.
        if (d.phase === 'planner') {
          md += `**Planner:**\n${fencedBlock(content)}\n`;
        } else if (d.phase === 'read_scope') {
          md += `**Read scope:**\n${fencedBlock(content)}\n`;
        } else {
          md += `**WebBrain:** ${oneLine(content)}\n`;
          lastAssistantContent = content;
        }
      } else if (ev.kind === 'tool') {
        toolCount += 1;
        const { text, failed } = renderResult(d.result, d.resultStatus, d.resultErrorCode);
        md += `- 🔧 \`${d.name || 'tool'}\`(${stringifyArgs(d.args)}) → ${failed ? '✗ ' : ''}${text}\n`;
      } else if (ev.kind === 'streaming') {
        md += renderStreaming(d);
      } else if (ev.kind === 'error') {
        md += `- ⚠️ error${d.phase ? ` (${d.phase})` : ''}: ${oneLine(d.message || '')}\n`;
      } else if (ev.kind === 'screenshot') {
        md += `- 📷 Visual capture: ${oneLine(d.caption || 'viewport screenshot')}\n`;
      } else if (ev.kind === 'vision_sub_call') {
        const outcome = d.error ? `failed: ${oneLine(d.error)}` : 'succeeded';
        const details = [oneLine(d.context), oneLine(d.visionRoute), oneLine(d.model), oneLine(d.captureId), Number.isFinite(d.latencyMs) ? `${d.latencyMs} ms` : '']
          .filter(Boolean).join(' · ');
        md += `- 👁 Vision sub-call${details ? ` (${details})` : ''}: ${outcome}${d.errorCode ? ` · code=${oneLine(d.errorCode)}` : ''}${d.recoveryOutcome ? ` · recovery=${oneLine(d.recoveryOutcome)}` : ''}${d.fallbackReason ? ` · fallback=${oneLine(d.fallbackReason)}` : ''}\n`;
      } else if (ev.kind === 'vision_route') {
        const details = [oneLine(d.context), oneLine(d.visionRoute), oneLine(d.model), oneLine(d.captureId)]
          .filter(Boolean).join(' · ');
        md += `- 👁 Vision route${details ? `: ${details}` : ''}${d.fallbackReason ? ` · fallback=${oneLine(d.fallbackReason)}` : ''}\n`;
      } else if (ev.kind === 'note' && d.note === 'vision_status') {
        const status = d.extra || {};
        const progress = Number.isFinite(Number(status.progress)) ? `${Math.round(Number(status.progress))}%` : '';
        const bytes = Number(status.total) > 0
          ? `${Math.round(Number(status.loaded || 0) / 1024 / 1024)}/${Math.round(Number(status.total) / 1024 / 1024)} MB`
          : '';
        const details = [oneLine(status.context), oneLine(status.visionRoute), oneLine(status.status), progress, bytes]
          .filter(Boolean).join(' · ');
        md += `- 👁 Vision status${details ? `: ${details}` : ''}${status.error ? ` · error=${oneLine(status.error)}` : ''}\n`;
      } else if (ev.kind === 'note' && d.note === 'planner_attempt_failed') {
        const attempt = Number(d.extra?.attempt) || 1;
        const phase = oneLine(d.extra?.phase || 'planner');
        const failureKind = oneLine(d.extra?.failureKind || 'provider');
        md += `- ⚠️ ${phase} attempt ${attempt} failed · kind=${failureKind}\n`;
      } else if (ev.kind === 'note' && d.note === 'planner_failed_continue_act') {
        const attempts = Number(d.extra?.attempts) || 2;
        const reason = oneLine(d.extra?.reason || 'invalid_output');
        md += `- ⚠️ Planning failed after ${attempts} attempts · continued in Act mode · reason=${reason}\n`;
      } else if (ev.kind === 'note' && d.note === 'adapter_match') {
        const adapter = oneLine(d.extra?.adapter || 'unknown');
        const revision = Number(d.extra?.revision);
        const notes = d.extra?.notesInjected === true ? 'notes injected' : 'notes already active';
        md += `- 🧭 Adapter match: ${adapter}${Number.isInteger(revision) ? `@r${revision}` : ''} · ${notes}\n`;
      } else if (ev.kind === 'note' && d.note === 'adapter_context') {
        const adapter = oneLine(d.extra?.adapter || 'unknown');
        const revision = Number(d.extra?.revision);
        const job = oneLine(d.extra?.job || 'unknown');
        const template = oneLine(d.extra?.template || 'unknown');
        md += `- 🧭 Adapter workflow: ${adapter}${Number.isInteger(revision) ? `@r${revision}` : ''} · job=${job} · template=${template}\n`;
      } else if (ev.kind === 'note' && d.note === 'standalone_wikipedia_search_requested') {
        const queries = Math.max(1, Number(d.extra?.queryCount) || 1);
        md += `- 📚 On-device model requested local Wikipedia retrieval · ${queries} quer${queries === 1 ? 'y' : 'ies'}\n`;
      } else if (ev.kind === 'note' && d.note === 'standalone_wikipedia_rag') {
        md += `- 📚 ${renderLocalWikipediaRag(d.extra).replace(/^ · /, '')}\n`;
      } else if (ev.kind === 'note' && /screenshot|vision|attachment|visual/i.test(String(d.note || ''))) {
        md += `- ℹ️ ${oneLine(d.note)}\n`;
      } else if (!isKnownKind(ev.kind)) {
        // Unknown kinds are skipped (never rendered) but counted, so an
        // exporter from a newer build cannot silently lose events.
        unknownEventCount += 1;
      }
    }
    const finalContent = String(run.finalContent || '').trim();
    if (finalContent && oneLine(finalContent) !== oneLine(lastAssistantContent)) {
      md += `**Final:** ${oneLine(finalContent)}\n`;
    }
    md += '\n';
  }

  for (const note of Array.isArray(notes) ? notes : []) {
    const line = oneLine(note);
    if (line) md += `_Note: ${line}_\n`;
  }
  if (unknownEventCount > 0) md += `${UNKNOWN_EVENTS_NOTE(unknownEventCount)}\n`;
  md += `${FOOTER}\n`;
  return { markdown: md, turnCount, toolCount, unknownEventCount };
}
