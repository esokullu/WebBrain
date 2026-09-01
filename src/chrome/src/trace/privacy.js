/**
 * Privacy projection for durable trace records.
 *
 * The default trace tier is metadata-only. Keep the policy at the recorder
 * boundary so IndexedDB, the Traces UI, JSON exports, and OTLP exports all
 * start from the same safe event log. The lossless tier is an explicit opt-in
 * and intentionally bypasses these projections.
 */

const RUN_CONTENT_FIELDS = [
  'userMessage', 'finalContent', 'tabUrl', 'tabTitle', 'attachments',
];

const RESPONSE_METADATA_FIELDS = [
  'step', 'usage', 'latencyMs', 'model', 'phase', 'attempt', 'repair', 'empty',
  'finishReason', 'contentChars', 'toolCallCount', 'reasoningPresent',
  'reasoningChars', 'reasoningTokens', 'outputTokens', 'requestedMaxTokens',
  'recoveryAttempt',
];

const REQUEST_METADATA_FIELDS = [
  'step', 'providerClass', 'providerId', 'model', 'phase', 'attempt', 'repair',
  'messageCount', 'toolsCount', 'imageBlockCount', 'documentBlockCount',
  'runtimeMode',
];

const STREAMING_METADATA_FIELDS = [
  'step', 'status', 'protocol', 'reason', 'errorCode', 'textDeltaCount',
  'textChars', 'firstDeltaMs', 'durationMs', 'toolCallCount',
];

const STEP_METADATA_FIELDS = ['step', 'ok', 'status', 'code', 'durationMs', 'reason'];

const NOTE_METADATA_FIELDS = [
  'attempt', 'delayMs', 'code', 'status', 'progress', 'loaded', 'total',
  'context', 'visionRoute', 'phase', 'failureKind', 'reason', 'queryCount',
  'matchCount', 'multiSource', 'attempted', 'archiveDates', 'durationMs',
  'success', 'approved', 'outcome', 'verification', 'count',
  'adapter', 'revision', 'notesInjected', 'workflowSchema', 'job', 'template',
];

function pick(source, fields) {
  if (!source || typeof source !== 'object' || Array.isArray(source)) return {};
  const output = {};
  for (const field of fields) {
    if (source[field] !== undefined) output[field] = source[field];
  }
  return output;
}

function projectUsage(usage) {
  return pick(usage, [
    'prompt_tokens', 'completion_tokens', 'input_tokens', 'output_tokens',
    'cached_tokens', 'cost',
  ]);
}

function projectPromptProvenance(value) {
  return pick(value, [
    'systemPromptVariant', 'promptPolicyRevision', 'systemPromptChars',
    'messageChars', 'toolPolicyRevision', 'runtimeEnvelopeMode',
    'runtimeEnvelopeRequired', 'runtimeEnvelopeMatches',
    'systemPromptMatchesRuntime',
  ]);
}

function projectNoteExtra(value) {
  const output = pick(value, NOTE_METADATA_FIELDS);
  if (Array.isArray(output.archiveDates)) {
    output.archiveDates = output.archiveDates.slice(0, 3).map(item => String(item).slice(0, 20));
  }
  return output;
}

function projectToolResultMetadata(result) {
  if (result == null) return { resultStatus: 'unknown' };
  const failed = typeof result === 'object'
    && (result.success === false || Boolean(result.error));
  const output = { resultStatus: failed ? 'error' : 'success' };
  const errorCode = result && typeof result === 'object'
    ? (result.errorCode || result.code)
    : '';
  if (failed && errorCode != null && String(errorCode).trim()) {
    output.resultErrorCode = String(errorCode).trim().slice(0, 120);
  }
  return output;
}

export function projectTraceRun(run, { includeContent = false } = {}) {
  const projected = run && typeof run === 'object' ? { ...run } : {};
  if (!includeContent) {
    for (const field of RUN_CONTENT_FIELDS) delete projected[field];
  }
  return projected;
}

export function projectTraceEventData(kind, data, { includeContent = false } = {}) {
  if (includeContent || data == null) return data;
  const source = data && typeof data === 'object' && !Array.isArray(data) ? data : {};

  if (kind === 'llm_request') {
    const projected = pick(source, REQUEST_METADATA_FIELDS);
    if (source.promptProvenance && typeof source.promptProvenance === 'object') {
      projected.promptProvenance = projectPromptProvenance(source.promptProvenance);
    }
    if (source.localWikipediaRag && typeof source.localWikipediaRag === 'object') {
      projected.localWikipediaRag = pick(source.localWikipediaRag, [
        'status', 'attempted', 'matchCount', 'multiSource', 'archiveDates',
      ]);
    }
    return projected;
  }

  if (kind === 'llm_response') {
    const projected = pick(source, RESPONSE_METADATA_FIELDS);
    if (source.usage && typeof source.usage === 'object') projected.usage = projectUsage(source.usage);
    return projected;
  }

  if (kind === 'tool') {
    return {
      ...pick(source, ['step', 'name', 'latencyMs']),
      ...projectToolResultMetadata(source.result),
    };
  }
  if (kind === 'error') return pick(source, ['step', 'phase', 'code']);
  if (kind === 'streaming') return pick(source, STREAMING_METADATA_FIELDS);
  if (kind === 'note') {
    const projected = pick(source, ['step', 'note']);
    const extra = projectNoteExtra(source.extra);
    if (Object.keys(extra).length) projected.extra = extra;
    return projected;
  }
  if (kind === 'screenshot') return pick(source, ['step', 'caption']);
  if (kind === 'vision_sub_call') {
    return pick(source, [
      'step', 'context', 'visionRoute', 'captureId', 'fallbackReason', 'model',
      'baseUrl', 'latencyMs', 'errorCode', 'recoveryOutcome',
    ]);
  }
  if (kind === 'vision_route') {
    return pick(source, ['step', 'context', 'visionRoute', 'captureId', 'model', 'fallbackReason']);
  }
  if (kind === 'turn_start' || kind === 'turn_end' || kind === 'step_start' || kind === 'step_end') {
    return pick(source, STEP_METADATA_FIELDS);
  }
  if (kind === 'terminal_runtime') {
    return pick(source, ['step', 'status', 'toolName', 'callId', 'errorCode', 'durationMs', 'success']);
  }
  return {};
}
