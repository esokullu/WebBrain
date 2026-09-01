const COMPATIBILITY_PRESETS = new Set(['auto', 'openai', 'qwen', 'deepseek', 'openrouter', 'custom']);
const REASONING_EFFORTS = new Set(['auto', 'off', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max']);
const SYSTEM_PROMPT_ROLES = new Set(['auto', 'system', 'developer']);
const MAX_TOKEN_FIELDS = new Set(['auto', 'max_tokens', 'max_completion_tokens']);
const OPENROUTER_ROUTING_VARIANT_VALUES = new Set(['standard', 'nitro', 'exacto']);
const OPENROUTER_MODEL_VARIANT_SUFFIXES = /(?::(?:free|extended|thinking|online|nitro|floor|exacto))+$/i;
export const OPENROUTER_ROUTING_VARIANTS = Object.freeze(['standard', 'nitro', 'exacto']);
const STRUCTURED_OUTPUT_PROVIDER_NAMES = new Set([
  'azure-openai',
  'llamacpp',
  'lmstudio',
  'localai',
  'ollama',
  'openai',
  'openrouter',
  'sglang',
  'vllm',
]);
const LOCAL_OPENAI_COMPAT_PROVIDER_NAMES = new Set([
  'llamacpp',
  'lmstudio',
  'localai',
  'ollama',
  'sglang',
  'vllm',
]);

export const RESERVED_EXTRA_BODY_KEYS = new Set([
  'model',
  'messages',
  'input',
  'instructions',
  'tools',
  'tool_choice',
  'stream',
  'max_tokens',
  'max_completion_tokens',
  'max_output_tokens',
]);

const UNSAFE_OBJECT_KEYS = new Set(['__proto__', 'prototype', 'constructor']);

function clean(value) {
  return String(value || '').trim().toLowerCase();
}

export function openRouterRoutingVariant(config = {}) {
  const configured = clean(config.routingVariant);
  if (OPENROUTER_ROUTING_VARIANT_VALUES.has(configured)) return configured;
  const suffix = String(config.model || '').trim().match(/:(nitro|exacto)$/i);
  return suffix ? suffix[1].toLowerCase() : 'standard';
}

export function applyOpenRouterRoutingVariant(body, config = {}) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return body;
  if (clean(config.providerName) !== 'openrouter' || !Object.hasOwn(config, 'routingVariant')) return body;
  const variant = clean(config.routingVariant);
  if (!OPENROUTER_ROUTING_VARIANT_VALUES.has(variant)) return body;

  const next = { ...body };
  if (typeof next.model === 'string') {
    next.model = variant === 'exacto'
      ? `${next.model.replace(OPENROUTER_MODEL_VARIANT_SUFFIXES, '')}:exacto`
      : next.model.replace(/:(?:nitro|exacto)$/i, '');
  }

  const hasProviderPreferences = next.provider
    && typeof next.provider === 'object'
    && !Array.isArray(next.provider);
  if (variant !== 'nitro') {
    if (hasProviderPreferences && Object.hasOwn(next.provider, 'sort')) {
      const provider = { ...next.provider };
      delete provider.sort;
      if (Object.keys(provider).length) next.provider = provider;
      else delete next.provider;
    }
    return next;
  }

  next.provider = {
    ...(hasProviderPreferences ? next.provider : {}),
    sort: 'throughput',
  };
  return next;
}

/**
 * Normalize an OpenAI-compatible API base without rewriting provider-specific
 * paths. Bare origins such as LM Studio's http://127.0.0.1:1234 need /v1;
 * explicit paths such as /api/v1 or /compatible-mode/v1 are already complete.
 */
export function normalizeOpenAICompatibleBaseUrl(value) {
  const trimmed = String(value || '').trim().replace(/\/+$/, '');
  if (!trimmed) return '';
  try {
    const url = new URL(trimmed);
    // DeepSeek's OpenAI-compatible endpoint is rooted at the origin, unlike
    // most OpenAI-compatible servers whose API lives below /v1.
    if (url.hostname.toLowerCase() === 'api.deepseek.com' &&
        (url.protocol === 'http:' || url.protocol === 'https:') &&
        url.pathname === '/' && !url.search && !url.hash) {
      return trimmed;
    }
    if ((url.protocol === 'http:' || url.protocol === 'https:')
        && url.pathname === '/'
        && !url.search
        && !url.hash) {
      return `${trimmed}/v1`;
    }
  } catch { /* preserve validation behavior at the eventual request site */ }
  return trimmed;
}

export function openAiCompatiblePayloadError(payload, maxLength = 500) {
  const error = payload?.error;
  if (!error) return '';
  if (typeof error === 'object' && !Array.isArray(error) && Object.keys(error).length === 0) return '';
  const detail = typeof error === 'string'
    ? error
    : String(error.message || error.detail || JSON.stringify(error));
  return detail.slice(0, maxLength);
}

export function visionGenerationOptions(maxTokens = 800, {
  reasoningControl = true,
  providerConfig = null,
} = {}) {
  const extraBody = {};
  if (reasoningControl) {
    if (isDirectDeepSeekConfig(providerConfig || {})) {
      // DeepSeek does not use the local Qwen/LM Studio template controls. Its
      // native Chat Completions switch is a top-level `thinking` object.
      extraBody.thinking = { type: 'disabled' };
      return { maxTokens, temperature: 0, extraBody };
    }
    // LM Studio 0.4.8+ honors these fields for Chat Completions. They prevent
    // Qwen vision models from spending the entire output budget in a hidden
    // reasoning channel and leaving no caption for the browser agent.
    extraBody.reasoning_effort = 'none';
    extraBody.reasoning_tokens = 0;
    extraBody.chat_template_kwargs = { enable_thinking: false };
  }
  return { maxTokens, temperature: 0, extraBody };
}

export function unsupportedVisionGenerationControl(error) {
  const message = String(error?.message || error || '');
  return /reasoning_effort|reasoning_tokens|chat_template_kwargs|enable_thinking/i.test(message);
}

export function isDirectDeepSeekConfig(config = {}) {
  const providerName = clean(config.providerName);
  if (clean(config.category) === 'local' || LOCAL_OPENAI_COMPAT_PROVIDER_NAMES.has(providerName)) {
    return false;
  }
  if (providerName === 'deepseek') return true;
  try {
    if (new URL(config.baseUrl || '').hostname.toLowerCase() === 'api.deepseek.com') return true;
  } catch {}
  return normalizeProviderCompatibility(config).preset === 'deepseek';
}

export function isPlainObject(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function allowedValue(value, allowed, fallback = 'auto') {
  const normalized = clean(value);
  return allowed.has(normalized) ? normalized : fallback;
}

export function normalizeProviderCompatibility(config = {}) {
  const compat = isPlainObject(config.compat) ? config.compat : {};
  return {
    preset: allowedValue(compat.preset ?? config.compatibilityPreset, COMPATIBILITY_PRESETS),
    reasoningEffort: allowedValue(compat.reasoningEffort ?? config.reasoningEffort, REASONING_EFFORTS),
    systemPromptRole: allowedValue(compat.systemPromptRole ?? config.systemPromptRole, SYSTEM_PROMPT_ROLES),
    maxTokensField: allowedValue(compat.maxTokensField ?? config.maxTokensField, MAX_TOKEN_FIELDS),
  };
}

export function isOfficialOpenAIConfig(config = {}) {
  const providerName = clean(config.providerName);
  if (providerName && providerName !== 'openai') return false;
  try {
    const url = new URL(config.baseUrl || 'https://api.openai.com/v1');
    return url.protocol === 'https:'
      && url.hostname.toLowerCase() === 'api.openai.com'
      && url.pathname.replace(/\/+$/, '') === '/v1';
  } catch {
    return false;
  }
}

export function isOpenCodeZenConfig(config = {}) {
  try {
    const url = new URL(config.baseUrl || '');
    return url.protocol === 'https:'
      && url.hostname.toLowerCase() === 'opencode.ai'
      && url.pathname.replace(/\/+$/, '') === '/zen/v1';
  } catch {
    return false;
  }
}

export function shouldUseOpenAIResponsesApi(config = {}) {
  if (config.apiFormat === 'responses') return true;
  if (config.apiFormat === 'chat') return false;
  // OpenCode Zen: https://opencode.ai/zen/v1/responses for muse-spark, gpt-5.x, claude, gemini, grok
  // WebBrain's OpenCode Zen provider previously forced Chat Completions for all Zen models (404 for Responses models).
  const rawModel = String(config.model || '');
  const model = rawModel.replace(/^opencode\//i, '').trim().toLowerCase();
  if (isOpenCodeZenConfig(config)) {
    return /^(muse-spark|gpt-5|claude|gemini|grok)(?:$|[-_.\/])/.test(model);
  }
  if (!isOfficialOpenAIConfig(config)) return false;
  // GPT-5.6 needs Responses for reliable reasoning/tool replay. GPT-5 Pro,
  // GPT-5.2 Pro, GPT-5.4 Pro, and GPT-5.5 Pro are Responses-only. Proxies and
  // compatible providers keep their existing Chat Completions wire format even
  // when they reuse an OpenAI model id.
  return /^gpt-5\.6(?:$|-(?:sol|terra|luna)(?:$|-))/.test(model)
    || /^gpt-5(?:\.(?:2|4|5))?-pro(?:$|-\d{4}-\d{2}-\d{2}$)/.test(model);
}

/**
 * Whether a model id uses the newer OpenAI wire contract (max_completion_tokens,
 * no non-default temperature) — the gpt-5 line and the o-series. gpt-4.1 is
 * deliberately excluded: it accepts both parameter sets, so it stays on the
 * legacy contract and keeps explicit temperatures. OpenAI's Responses-only
 * Pro families also stay legacy when routed through a Chat Completions
 * provider: those routed endpoints advertise `max_tokens`, while direct
 * OpenAI calls are selected as Responses before this helper is consulted.
 * OpenRouter's routed allowlist is intentionally narrow: only GPT-5.6 Terra
 * variants use max_completion_tokens there; o-series, Pro, batch, and image
 * routes remain on max_tokens.
 */
export function isNewOpenAIContractModel(model) {
  const m = String(model || '').toLowerCase();
  if (/(?:^|\/)gpt-5(?:\.(?:2|4|5))?-pro(?:$|[-_.\/:])/.test(m)) return false;
  return /(?:^|\/)(?:gpt-5|o1|o3|o4)(?:$|[-_.\/])/.test(m);
}

export function isNewOpenAIContractConfig(config = {}) {
  const providerName = String(config.providerName || '').trim().toLowerCase();
  if (config.category === 'local' || providerName === 'lmstudio') return false;
  if (providerName === 'openrouter') {
    return /(?:^|\/)gpt-5\.6-terra(?:$|[-_.\/:])/.test(String(config.model || '').toLowerCase());
  }
  // Only OpenRouter is covered by the routed-model contract table. Other
  // compatible endpoints may use slash-prefixed ids with legacy fields.
  if (String(config.model || '').includes('/') && providerName !== 'openrouter') return false;
  return isNewOpenAIContractModel(config.model);
}

export function supportsOpenAIAskStreaming(config = {}) {
  if (!isOfficialOpenAIConfig(config)) return false;

  const model = clean(config.model);
  // Keep this as an explicit capability allowlist. In particular,
  // GPT-5.5 Pro does not support streaming even though it is Responses-only.
  if (/^gpt-5\.5-pro(?:$|-\d{4}-\d{2}-\d{2}$)/.test(model)) return false;
  if (shouldUseOpenAIResponsesApi(config)) return true;

  return [
    /^gpt-5\.5(?:$|-\d{4}-\d{2}-\d{2}$)/,
    /^gpt-5\.4(?:$|-\d{4}-\d{2}-\d{2}$|-(?:mini|nano)(?:$|-\d{4}-\d{2}-\d{2}$))/,
    /^gpt-5\.(?:1|2)(?:$|-\d{4}-\d{2}-\d{2}$)/,
    /^gpt-5(?:$|-\d{4}-\d{2}-\d{2}$|-(?:mini|nano)(?:$|-\d{4}-\d{2}-\d{2}$))/,
    /^gpt-5(?:\.(?:1|2|3))?-chat-latest$/,
    /^gpt-4\.1(?:$|-\d{4}-\d{2}-\d{2}$|-(?:mini|nano)(?:$|-\d{4}-\d{2}-\d{2}$))/,
    /^gpt-4o(?:$|-\d{4}-\d{2}-\d{2}$|-mini(?:$|-\d{4}-\d{2}-\d{2}$))/,
    /^gpt-4-turbo(?:$|-\d{4}-\d{2}-\d{2}$|-preview$)/,
    /^o1(?:$|-\d{4}-\d{2}-\d{2}$|-preview(?:$|-\d{4}-\d{2}-\d{2}$))/,
    /^o3(?:$|-\d{4}-\d{2}-\d{2}$|-mini(?:$|-\d{4}-\d{2}-\d{2}$))/,
    /^o4-mini(?:$|-\d{4}-\d{2}-\d{2}$)/,
    /^chatgpt-4o-latest$/,
    /^chat-latest$/,
  ].some(pattern => pattern.test(model));
}

export function detectedCompatibilityPreset(config = {}) {
  const providerName = clean(config.providerName);
  const model = clean(config.model);
  if (providerName === 'openrouter') return 'openrouter';
  if (providerName === 'deepseek' || model.includes('deepseek')) return 'deepseek';
  if (model.includes('qwen')) return 'qwen';
  if (isOfficialOpenAIConfig(config)) return 'openai';
  return 'standard';
}

export function effectiveCompatibilityPreset(config = {}) {
  const compat = normalizeProviderCompatibility(config);
  return compat.preset === 'auto' ? detectedCompatibilityPreset(config) : compat.preset;
}

export function mapProviderMessages(messages, config = {}) {
  if (!Array.isArray(messages)) return [];
  const { systemPromptRole } = normalizeProviderCompatibility(config);
  if (systemPromptRole !== 'developer') return messages;
  return messages.map((message) => {
    if (!message || message.role !== 'system') return message;
    return { ...message, role: 'developer' };
  });
}

export function configuredMaxTokensField(config = {}, fallback = 'max_tokens') {
  const { maxTokensField } = normalizeProviderCompatibility(config);
  return maxTokensField === 'auto' ? fallback : maxTokensField;
}

export function addConfiguredMaxTokens(body, value, config = {}, fallback = 'max_tokens') {
  body[configuredMaxTokensField(config, fallback)] = value;
  return body;
}

function safeClone(value) {
  if (Array.isArray(value)) return value.map((item) => safeClone(item));
  if (!isPlainObject(value)) return value;
  const clone = {};
  for (const [key, child] of Object.entries(value)) {
    if (UNSAFE_OBJECT_KEYS.has(key)) continue;
    clone[key] = safeClone(child);
  }
  return clone;
}

function deepMerge(target, source) {
  const merged = isPlainObject(target) ? safeClone(target) : {};
  if (!isPlainObject(source)) return merged;
  for (const [key, value] of Object.entries(source)) {
    if (UNSAFE_OBJECT_KEYS.has(key)) continue;
    if (isPlainObject(value)) {
      merged[key] = deepMerge(merged[key], value);
    } else {
      merged[key] = safeClone(value);
    }
  }
  return merged;
}

function safeExtraBody(source) {
  if (!isPlainObject(source)) return {};
  const filtered = {};
  for (const [key, value] of Object.entries(source)) {
    if (RESERVED_EXTRA_BODY_KEYS.has(key) || UNSAFE_OBJECT_KEYS.has(key)) continue;
    filtered[key] = safeClone(value);
  }
  return filtered;
}

function mappedReasoningEffort(effort, preset) {
  if (effort === 'off') return 'none';
  if (preset === 'openrouter') {
    // OpenRouter's public effort ladder tops out at high.
    if (effort === 'minimal') return 'low';
    if (effort === 'xhigh' || effort === 'max') return 'high';
  }
  // OpenAI documents `max` as a distinct effort above `xhigh` (GPT-5.6).
  // Pass it through unchanged for the OpenAI preset and any other preset that
  // does not define its own clamp above.
  return effort;
}

function mappedDeepSeekReasoningEffort(effort) {
  // DeepSeek's public ladder is low/high/max. Keep the shared UI ladder
  // expressive while translating values that DeepSeek only accepts for
  // compatibility (medium and xhigh both mean high in its API).
  if (effort === 'minimal') return 'low';
  if (effort === 'medium' || effort === 'xhigh') return 'high';
  return effort;
}

export function compatibilityRequestBody(config = {}) {
  const compat = normalizeProviderCompatibility(config);
  if (compat.reasoningEffort === 'auto') return {};

  const preset = effectiveCompatibilityPreset(config);
  const enabled = compat.reasoningEffort !== 'off';
  if (preset === 'qwen') {
    return {
      chat_template_kwargs: enabled
        ? { enable_thinking: true, preserve_thinking: true }
        : { enable_thinking: false },
    };
  }
  if (preset === 'deepseek') {
    if (!isDirectDeepSeekConfig(config)) {
      return { chat_template_kwargs: { thinking: enabled } };
    }
    if (!enabled) return { thinking: { type: 'disabled' } };
    return {
      thinking: { type: 'enabled' },
      reasoning_effort: mappedDeepSeekReasoningEffort(compat.reasoningEffort),
    };
  }
  if (preset === 'openrouter') {
    return enabled
      ? { reasoning: { effort: mappedReasoningEffort(compat.reasoningEffort, preset) } }
      : { reasoning: { enabled: false } };
  }
  if (preset === 'openai') {
    const effort = mappedReasoningEffort(compat.reasoningEffort, preset);
    return shouldUseOpenAIResponsesApi(config)
      ? { reasoning: { effort } }
      : { reasoning_effort: effort };
  }
  return {};
}

/**
 * Per-request controls for classifier/planner calls that need short,
 * machine-readable JSON instead of hidden reasoning or free-form prose.
 *
 * This maps protocol families, not individual model ids. Unknown endpoints
 * receive no non-standard fields and continue to rely on the planner prompt
 * plus local parsing. Callers can set includeResponseFormat:false for the
 * repair attempt so a server that rejects structured-output parameters still
 * gets one portable prompt-only retry.
 */
export function plannerRequestBody(config = {}, {
  schema = null,
  schemaName = 'webbrain_planner',
  includeResponseFormat = true,
  disableThinking = true,
} = {}) {
  const providerName = clean(config.providerName);
  const preset = effectiveCompatibilityPreset(config);
  const isLocalOpenAICompat = clean(config.category) === 'local'
    || LOCAL_OPENAI_COMPAT_PROVIDER_NAMES.has(providerName);
  const isDirectDeepSeek = isDirectDeepSeekConfig(config) && !isLocalOpenAICompat;
  const body = {};

  if (disableThinking) {
    if (preset === 'openrouter') {
      body.reasoning = { enabled: false };
    } else if (isDirectDeepSeek) {
      body.thinking = { type: 'disabled' };
    } else if ((preset === 'qwen' && isLocalOpenAICompat) || providerName === 'vllm' || providerName === 'sglang') {
      body.chat_template_kwargs = { enable_thinking: false };
    } else if (preset === 'openai' && shouldUseOpenAIResponsesApi(config)) {
      // Responses reasoning models may not accept a fully disabled mode. Keep
      // the classifier budget small without recreating a provider error.
      body.reasoning = { effort: 'minimal' };
    }
  }

  if (!includeResponseFormat) return body;
  if (isDirectDeepSeek) {
    // The direct DeepSeek API supports JSON Object mode, not JSON Schema.
    body.response_format = { type: 'json_object' };
    return body;
  }
  if (schema && STRUCTURED_OUTPUT_PROVIDER_NAMES.has(providerName)) {
    body.response_format = {
      type: 'json_schema',
      json_schema: {
        name: String(schemaName || 'webbrain_planner').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 64),
        strict: true,
        schema,
      },
    };
  }
  return body;
}

export function mergeProviderRequestBody(body, config = {}, perRequestExtraBody = undefined) {
  let extras = compatibilityRequestBody(config);
  extras = deepMerge(extras, safeExtraBody(config.extraBody));
  extras = deepMerge(extras, safeExtraBody(perRequestExtraBody));
  if (extras.chat_template_kwargs?.enable_thinking === false) {
    delete extras.chat_template_kwargs.preserve_thinking;
  }
  // Shallow-copy the body so untouched fields keep identity (Responses input
  // items must replay the exact same object references). Deep-merge only when
  // both sides have a plain object for the same key, so partial extras like
  // `{ reasoning: { summary } }` do not drop required nested fields.
  const result = isPlainObject(body) ? { ...body } : {};
  for (const [key, value] of Object.entries(extras)) {
    if (UNSAFE_OBJECT_KEYS.has(key)) continue;
    if (isPlainObject(value) && isPlainObject(result[key])) {
      result[key] = deepMerge(result[key], value);
    } else {
      result[key] = isPlainObject(value) || Array.isArray(value) ? safeClone(value) : value;
    }
  }
  // DeepSeek's disabled-thinking contract omits reasoning_effort entirely.
  // Per-call planner and vision overrides must clear an effort inherited from
  // the configured compatibility preset.
  if (isDirectDeepSeekConfig(config) && result.thinking?.type === 'disabled') {
    delete result.reasoning_effort;
  }
  return result;
}

export function validateProviderExtraBody(value) {
  if (!isPlainObject(value)) {
    return { ok: false, error: 'Custom request body must be a JSON object.' };
  }
  const reserved = Object.keys(value).filter((key) => RESERVED_EXTRA_BODY_KEYS.has(key));
  const unsafe = Object.keys(value).filter((key) => UNSAFE_OBJECT_KEYS.has(key));
  if (reserved.length) {
    return {
      ok: false,
      error: `Use the dedicated settings for reserved fields: ${reserved.join(', ')}.`,
      reserved,
    };
  }
  if (unsafe.length) {
    return { ok: false, error: `Unsafe object keys are not allowed: ${unsafe.join(', ')}.` };
  }
  return { ok: true, value };
}

export function parseProviderExtraBodyJson(raw) {
  const text = String(raw || '').trim();
  if (!text) return {};
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    throw new Error(`Custom request body is not valid JSON: ${error.message}`);
  }
  const validation = validateProviderExtraBody(parsed);
  if (!validation.ok) throw new Error(validation.error);
  return parsed;
}
