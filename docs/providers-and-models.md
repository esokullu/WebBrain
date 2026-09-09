# Providers & Models

---

## Provider Interface (`providers/base.js`)

Every LLM provider implements the `BaseLLMProvider` interface:

```js
class BaseLLMProvider {
  async chat(messages, options)         // → { content, toolCalls, usage }
  async *chatStream(messages, options)  // → async generator yielding { type, content }
  get supportsTools()                   // → boolean
  get supportsAskStreaming()            // → boolean
  get supportsVision()                  // → boolean
  get promptTier()                      // → 'compact' | 'mid' | 'full'
  async testConnection()                // → { ok, error?, model? }
}
```

### Options

```js
{
  tools: [...],            // tool schemas
  temperature: 0.3,
  maxTokens: 4096,
  stream: false,           // use chatStream instead of chat
  extraBody: {},           // extra fields passed through to the API
}
```

---

## Built-in Providers

| Provider ID | Type | Category | Default Model | Vision |
|---|---|---|---|---|
| `webbrain_cloud` | `openai` | cloud | `webbrain-cloud 1.0` | Yes |
| `llamacpp` | `llamacpp` | local | (loaded model) | Auto metadata / override |
| `ollama` | `openai` | local | (loaded model) | Auto via `/api/show` / override |
| `lmstudio` | `openai` | local | (loaded model) | Auto metadata / override |
| `jan` | `openai` | local | (loaded model) | Yes (default on) |
| `vllm` | `openai` | local | (loaded model) | Yes (default on) |
| `sglang` | `openai` | local | (loaded model) | Yes (default on) |
| `localai` | `openai` | local | (loaded model) | Auto metadata / override |
| `gpt4all` | `openai` | local | (loaded model) | Yes (default on) |
| `local_openai_proxy` | `openai` | local | (required) | Off / manual toggle |
| `unsloth` | `openai` | local | (required) | Off / manual toggle |
| `webgpu` (Chromium) | `webgpu` | local | Seven shipped LFM2.5/Nanbeige/Bonsai presets; experimental custom HF ONNX repos | LFM2.5-VL presets |
| `azure_openai` | `azure_openai` | cloud | (deployment) | Manual toggle |
| `aws_bedrock` | `aws_bedrock` | cloud | (model id) | No |
| `openai` | `openai` | cloud | `gpt-5.6-terra` | Model-name regex |
| `anthropic` | `anthropic` | cloud | `claude-sonnet-4-6` | Model-name regex |
| `gemini` | `openai` | cloud | `gemini-3.1-flash` | Model-name regex |
| `cloudflare` | `openai` | router | `@cf/zai-org/glm-5.2` | Model-name regex |
| `mistral` | `openai` | cloud | `mistral-large-latest` | Model-name regex |
| `deepseek` | `openai` | cloud | `deepseek-v4-flash` | Model-name regex |
| `xai` (Grok) | `openai` | cloud | `grok-4.3` | Model-name regex |
| `nvidia` (NIM) | `openai` | router | `meta/llama-3.1-8b-instruct` | Model-name regex |
| `groq` | `openai` | router | `llama-3.3-70b-versatile` | Model-name regex |
| `minimax` | `openai` | cloud | `minimax-m2.7` | Model-name regex |
| `kimi` | `openai` | cloud | `kimi-k2.5` | Model-name regex |
| `alibaba` (Qwen) | `openai` | cloud | `qwen-max` | Model-name regex |
| `together` | `openai` | router | `meta-llama/Llama-3.3-70B-Instruct-Turbo` | Model-name regex |
| `openrouter` | `openai` | router | `openrouter/free` | Model-name regex |
| `huggingface` | `openai` | router | `zai-org/GLM-5.2` | Model-name regex |
| `fireworks` | `openai` | router | `accounts/fireworks/models/llama-v3p3-70b-instruct` | Model-name regex |
| `z_ai` | `openai` | cloud | `glm-5.2` | Model-name regex |

### Extended provider catalog

WebBrain also ships 77 disabled-by-default provider cards. Most are sourced
from the OpenCode provider catalog snapshot at commit
`62e4641235d7847dadc60da37cca8a023dd54fc1`; provider-specific additions use
their official API documentation. Together with the original cards, Settings
contains **108 built-in providers on Chromium** and **107 on Firefox**; the
difference is the Chromium-only in-browser WebGPU runtime.

| IDs |
|---|
| `302ai`, `abacus`, `aihubmix`, `alibaba-coding-plan`, `alibaba-coding-plan-cn`, `azure-cognitive-services`, `bailing`, `baseten`, `berget`, `cerebras`, `chutes`, `clarifai`, `cloudferro-sherlock`, `cohere`, `cortecs`, `deepinfra`, `digitalocean`, `dinference`, `drun`, `evroc`, `fastrouter`, `friendli` |
| `google-vertex`, `google-vertex-anthropic`, `helicone`, `iflowcn`, `inception`, `inference`, `io-net`, `jiekou`, `kilo`, `kimi-for-coding`, `kuae-cloud-coding-plan`, `llama`, `lucidquery`, `meganova`, `minimax-cn-coding-plan`, `minimax-coding-plan`, `moark`, `modelscope`, `morph` |
| `nano-gpt`, `nebius`, `nova`, `novita-ai`, `ollama-cloud`, `opencode`, `opencode-go`, `orcarouter`, `ovhcloud`, `perplexity`, `perplexity-agent`, `poe`, `privatemode-ai`, `qihang-ai`, `qiniu-ai`, `requesty`, `scaleway`, `siliconflow`, `siliconflow-cn`, `stackit` |
| `stepfun`, `submodel`, `synthetic`, `tencent-coding-plan`, `upstage`, `v0`, `venice`, `vercel`, `vivgrid`, `vultr`, `wandb`, `xiaomi`, `zai-coding-plan`, `zenmux`, `zhipuai`, `zhipuai-coding-plan` |

Most use the OpenAI-compatible Chat Completions contract and bearer API keys.
The exceptions are:

| Provider | Authentication / protocol |
|---|---|
| Azure AI Foundry | Resource name plus `api-key`; model is the deployed model name |
| Google Vertex AI | Project, location, and a Google authorization key sent as `x-goog-api-key`; `global` uses `aiplatform.googleapis.com` |
| Google Vertex AI (Anthropic) | Vertex `rawPredict` / `streamRawPredict` with the same authorization-key fields; `us` and `eu` use their multi-region hosts |
| Perplexity Agent | OpenAI Responses-compatible `/v1/responses` |
| Cloudflare | Existing card supports Workers AI plus an optional AI Gateway ID; blank IDs use Cloudflare's `default` gateway for `@cf/` models |

Morph and standard Perplexity Sonar are text-only integrations in the agent
and advertise `supportsTools: false`. New provider cards remain inactive until
the user saves their credentials and selects the provider.

### Ask response streaming

Providers with `supportsAskStreaming` stream visible text during interactive
Ask turns. Act, Dev, scheduled, managed-cloud, and Continue turns remain
non-streaming. Tool calls are withheld until a terminal protocol event arrives
(`[DONE]`, a terminal `finish_reason`, `message_stop`, or
`response.completed`). A network failure, HTTP failure before completion, or
premature EOF clears partial UI text and retries that turn once without
streaming; the rest of that run then stays non-streaming.

When a streaming provider returns token usage, WebBrain records it directly.
If the provider omits usage, WebBrain records a conservative character-based
estimate so streaming cannot bypass the configured cost allowance.

The setting still uses the stored key `openaiAskStreamingEnabled` for backward
compatibility, but it now controls all capable providers.

Official OpenAI GPT-5.6 and streaming-capable Responses-only GPT-5 Pro variants
use Responses streaming. Supported GPT-5.x, GPT-4.1, GPT-4o, GPT-4 Turbo, and
o-series variants retain Chat Completions streaming. GPT-5.5 Pro and other
official OpenAI models without documented streaming or function-calling
support stay non-streaming. Compatible built-ins opt in explicitly; custom
endpoints are not inferred from their model names.

Alibaba Cloud and both Alibaba Coding Plan cards remain non-streaming for
interactive Ask because
[DashScope does not allow `tools` with `stream=True`](https://www.alibabacloud.com/help/en/model-studio/compatibility-of-openai-with-dashscope),
and Ask always sends its read-only tool catalog.

Every parser waits for its protocol's terminal event (`response.completed`,
Anthropic `message_stop`, or SSE `[DONE]`). A network/read error, malformed
frame, or premature EOF clears partial output, displays a localized notice,
retries the current generation once through `chat()`, and disables streaming
for the rest of that run. HTTP failures, explicit in-stream provider/API
errors, and `content_filter` finish reasons are terminal and never trigger the
duplicate request.

### Deliberately unsupported provider entries

- `github-models`: GitHub is not being retired, but
  [GitHub Models will retire on July 30, 2026](https://github.blog/changelog/2026-07-01-github-models-is-being-fully-retired-on-july-30-2026/).
- `github-copilot`: requires GitHub subscription/OAuth and does not expose a
  suitable stable general provider API for this extension.
- `gitlab`: GitLab Duo uses custom authentication, discovery, and protocol
  behavior rather than a direct Chat Completions endpoint.
- `sap-ai-core`: requires service-key OAuth, deployment discovery, and custom
  service integration.

### Local Providers

On Chromium, **WebGPU (In-browser)** is an endpoint-free local provider. Its
Apocalypse text picker offers seven shipped presets:

- [`LiquidAI/LFM2.5-2.6B-ONNX`](https://huggingface.co/LiquidAI/LFM2.5-2.6B-ONNX/)
  (`q4f16`, about 1.55 GB) through the packaged Transformers.js 4.2 / ONNX
  Runtime Web GPU worker. This remains the default. Enabling Apocalypse Mode
  starts this download automatically.
- [`LiquidAI/LFM2.5-1.2B-Instruct-ONNX`](https://huggingface.co/LiquidAI/LFM2.5-1.2B-Instruct-ONNX)
  and [`LiquidAI/LFM2.5-1.2B-Thinking-ONNX`](https://huggingface.co/LiquidAI/LFM2.5-1.2B-Thinking-ONNX)
  (`q4f16`, about 760 MB each). The Thinking preset preserves reasoning as
  hidden reasoning content while Instruct uses the normal visible-answer path.
- [`LiquidAI/LFM2.5-VL-1.6B-ONNX`](https://huggingface.co/LiquidAI/LFM2.5-VL-1.6B-ONNX)
  (FP16 vision/text embeddings plus Q4 decoder, about 2.3 GB) and
  [`LiquidAI/LFM2.5-VL-3B-ONNX`](https://huggingface.co/LiquidAI/LFM2.5-VL-3B-ONNX)
  (the corresponding Transformers.js layout, about 4.0 GB). These two presets
  advertise `supportsVision`, accept image blocks in normal provider chat, and
  are marked **Multimodal** in the picker. The 1.6B export uses older ONNX
  component filenames; WebBrain maps those filenames into the packaged
  Transformers.js image-text runtime before loading it. LiquidAI's current VL
  exports also nest their image metadata in `processor_config.json` and ship
  `chat_template.jinja` separately; the local runtime loads that layout
  explicitly instead of probing for the older `preprocessor_config.json`.
- [`Michionlion/Nanbeige4.2-3B-ONNX-WebGPU`](https://huggingface.co/Michionlion/Nanbeige4.2-3B-ONNX-WebGPU)
  (`q4f16`, about 3.1 GB), a browser export of
  [`Nanbeige/Nanbeige4.2-3B`](https://huggingface.co/Nanbeige/Nanbeige4.2-3B)
  that runs the same 22 physical layers twice and therefore keeps 44 KV-cache
  slots. It publishes one WebGPU-fused graph under a non-default file name, so
  the worker loads it with `model_file_name: 'model_webgpu_mlp'`; the external
  data shards come from the repository's own `use_external_data_format`. The
  graph needs the `com.microsoft::MatMulNBitsMlp` WebGPU kernel from the
  vendored ONNX Runtime build and an adapter with `shader-f16`. Its practical
  context is set to 4k rather than 16k because those 44 slots cost roughly
  176 KB per token in FP16, on top of 3.1 GB of weights. The reference
  implementation is the [Nanbeige Browser Lab](https://huggingface.co/spaces/borkiss/nanbeige4-2-3b-browser-lab)
  Space, which drives the same export through a hand-written ONNX Runtime Web
  loop rather than Transformers.js.
- [`prism-ml/Bonsai-27B-gguf`](https://huggingface.co/prism-ml/Bonsai-27B-gguf)
  (`Q1_0`, about 3.8 GB) through a dedicated vendored [bitgpu](https://github.com/stfurkan/bitgpu)
  worker. Bonsai is opt-in: WebBrain never auto-downloads the 27B weights.
  It needs a high-end GPU (16 GB+ RAM/VRAM recommended). Mutually exclusive
  WebGPU text runtimes are released when the selected preset changes; disk
  caches may coexist.

Custom Hugging Face repositories have not been tested and are likely not to
work. They must be compatible with Transformers.js text generation, provide a
`q4f16` ONNX variant, and use a chat template that accepts `tools`; WebBrain
validates the template after loading and rejects incompatible repositories.
Do not point Transformers.js at the Bonsai GGUF — 27B is not an ONNX pipeline.

The provider defaults to the Compact prompt tier with a conservative 16k
practical context setting (4k for Nanbeige and Bonsai). Text-only presets
reject image blocks; the two LFM2.5-VL presets route image and text blocks
through the local image-text runtime. LFM2.5 2.6B, 1.2B Thinking, and
Nanbeige4.2-3B use reasoning paths; WebBrain keeps completed thinking out of
the visible answer and reports an error when a template that opens `<think>`
in the generation prompt exhausts its output budget before closing it. Those
three presets decode with their publisher's recommended sampling settings; the
remaining ONNX presets stay greedy. Bonsai uses bitgpu
`think: true` with a 128-token think budget and the same post-think visible-
answer UX. Each repository is cached separately in Chrome.
After downloading a preset in Apocalypse Mode, the WebGPU card in
**Settings -> Providers** can be configured, tested, and selected as the normal
chat provider. The nuclear standalone-chat control remains available as a
per-run override that does not change the global selection.
**Test Connection** checks only the packaged runtime and hardware WebGPU
adapter, so it does not trigger a model download. There is no API key, base
URL, localhost server, or OpenAI-compatible endpoint. Firefox does not expose
the card because its build does not package the Chromium MV3 offscreen/WebGPU
runtime.

Ten local endpoint providers are enabled by default. The model runtimes need no
API key unless the server was started with auth; Unsloth Studio and the generic
proxy card require their configured client keys:

- **llama.cpp**: `http://localhost:8080` — runs `llama-server -m model.gguf`
- **Ollama**: `http://localhost:11434/v1` — `ollama serve`, or `ollama launch webbrain --model <model>`
- **LM Studio**: `http://localhost:1234/v1` — LM Studio's local inference server
- **Jan**: `http://localhost:1337/v1` — Jan's local OpenAI-compatible API server
- **vLLM**: `http://localhost:8000/v1` — vLLM's OpenAI-compatible server
- **SGLang**: `http://localhost:30000/v1` — SGLang's OpenAI-compatible server
- **LocalAI**: `http://localhost:8080/v1` — LocalAI's OpenAI-compatible server
- **GPT4All**: `http://localhost:4891/v1` — GPT4All's local API server
- **Local OpenAI-compatible Proxy**: `http://127.0.0.1:8317/v1` — a generic,
  authenticated local gateway; the model and proxy client API key are required
- **Unsloth Studio**: `http://127.0.0.1:8888/v1` by default, with a configurable
  port — Studio's API URL, loaded model, and generated API key are required

#### Unsloth Studio

Install or open [Unsloth Studio](https://unsloth.ai/docs/get-started/install),
then start Studio and load a chat model. In Studio, open the avatar menu,
choose **Settings → API Access**, and create an API key. Keys currently use the
`sk-unsloth-` prefix; keep the full value private.

In WebBrain, open **Settings → Providers → Unsloth Studio (Local)**. Enter the
Studio API address as `http://127.0.0.1:8888/v1`, replacing `8888` when the
running Studio instance shows a different port. Enter the generated API key,
click **Load Models**, select the loaded model, then click **Test Connection**.
WebBrain normalizes a
base URL entered without the terminal `/v1` after a successful request.

Unsloth model discovery, chat, interactive Ask streaming, and tool calls use
the existing OpenAI-compatible endpoints. Vision starts off: enable the manual
vision checkbox only when the model loaded in Studio accepts image input.

#### Subscription proxy guide (EasyCLIProxyAPI / CLIProxyAPI)

The generic **Local OpenAI-compatible Proxy** card can connect WebBrain to a
separately managed [EasyCLIProxyAPI](https://github.com/router-for-me/EasyCLIProxyAPI)
or [CLIProxyAPI](https://github.com/router-for-me/CLIProxyAPI) instance. WebBrain
uses only the local OpenAI-compatible endpoint and its client key; it does not
bundle, launch, update, audit, or manage the proxy or its upstream OAuth tokens.

For the current desktop walkthrough, supported upstream sign-in labels,
loopback hardening, provider-terms warnings, video, and troubleshooting, use the
canonical [EasyCLIProxyAPI subscription proxy guide](https://webbrain.one/docs/easy-cli-proxy/).
Keep the listener on `127.0.0.1`, require a strong random client key, and never
publish the endpoint to a LAN or the internet. Official provider API keys remain
the stable default.

Ollama, llama.cpp, LM Studio, and LocalAI default to `visionMode: auto`. WebBrain asks
the selected server for model capability metadata before enrichment and sends
screenshots only when the response explicitly reports image input. A failed or
malformed metadata request is text-only for that turn and is retried later;
Settings can override Auto with Force on or Off. For providers whose Model
field may be blank, WebBrain coalesces concurrent checks but rechecks once per
user turn, so changing the model loaded by the server cannot reuse a stale
answer. Other local providers retain
their existing explicit `supportsVision` setting.

#### Ollama launch handoff (preview)

<p align="center">
  <img src="../web/assets/webbrain-ollama-heart.png" alt="WebBrain loves Ollama launch handoff" width="720">
</p>

WebBrain supports Ollama today through the local OpenAI-compatible provider. A
new `ollama launch webbrain --model <model>` handoff can also configure WebBrain
automatically, but it is not integrated into upstream Ollama yet. For now, try
it from the [`codex/ollama-webbrain-launch-handoff` branch of
`esokullu/ollama`](https://github.com/esokullu/ollama/tree/codex/ollama-webbrain-launch-handoff);
we hope Ollama will integrate it upstream.

```bash
git clone https://github.com/esokullu/ollama.git
cd ollama
git switch codex/ollama-webbrain-launch-handoff
cmake -S . -B build -G Ninja -DOLLAMA_MLX_BACKENDS=
cmake --build build --parallel 8

OLLAMA_ORIGINS="chrome-extension://*,moz-extension://*" ./ollama serve
./ollama launch webbrain --model <model>
```

**Streaming.** Local streaming is primarily a runtime/server capability, not a
property of the GGUF or other model weights. Interactive Ask streaming is
enabled for llama.cpp, Ollama, LM Studio, Jan, vLLM, SGLang, current LocalAI,
and Unsloth Studio
through their OpenAI-compatible Chat Completions endpoints. Each parser requires
`[DONE]`; safe network/read, malformed-frame, and premature-EOF failures
silently retry once with non-streaming generation. Tool-call streaming
additionally depends on the model's tool-use training, the runtime's chat
template/parser, and a current runtime version (LocalAI added tool streaming in
3.10).

**Context window.** Load local models with **at least a 16k-token context window** for reliable agent runs — that's the usable minimum. 8k can work with the Compact tier selected; 4k is too small to hold the system prompt + tool schemas. The agent reads the window from `provider.contextWindow` (`providers/base.js`) to drive auto-compaction; when a provider config doesn't set `contextWindow`, local providers default to a conservative **16k** (cloud/router default to 128k). **Test connection** / **Load models** auto-detect for **llama.cpp**, **Ollama**, and **LM Studio** when reported (llama.cpp `GET /props` `n_ctx`, Ollama `GET /api/ps` live context then `/api/show` `num_ctx`, LM Studio `/api/v0/models` `loaded_context_length`). Detection refreshes the 16k default; it shrinks a larger manual override only from live/runtime context (not from Ollama `/api/show` alone). Jan / vLLM / SGLang / LocalAI / Unsloth Studio do not auto-detect yet. You can still set `config.contextWindow` explicitly, and the model server must actually be started with that much context (e.g. `llama-server -c 16384`).

### Prompt/tool tiers and modes

Provider tier and conversation mode are separate knobs:

- **Tier** (`compact | mid | full`) is a provider setting. It controls which Act-system prompt and normal browser-agent tool subset the model receives.
- **Mode** (`ask | act | dev`) is selected by the user per conversation/message. It controls whether the request is read-only, normal browser action, or developer/page-inspection work.

`provider.promptTier` resolves the active tier. Cloud providers are forced to Full. Local providers default to Mid. OpenRouter/router providers default to Full unless explicitly changed. Existing configs that still set the legacy `useCompactPrompt` boolean map to Compact.

| Tier | Intended model class | Normal tool surface |
|---|---|---|
| `compact` | very small/local models | Shortest prompt and a small normal Act tool set. No scheduling, iframe, download-resource, or advanced DOM/UI fallback tools. |
| `mid` | capable local models | Balanced prompt and common task tools: downloads, scheduling, iframe tools, form verification, and `download_resource_from_page`, while excluding Full-only advanced UI/DOM fallbacks. |
| `full` | frontier/cloud or large local models | Full normal Act prompt and advanced fallbacks such as hover, drag-drop, frames, and shadow DOM. |

Ask mode ignores provider tier and stays read-only. Act mode uses the selected tier's normal tools. Dev mode requires Mid or Full, uses the selected Act prompt, appends `SYSTEM_PROMPT_DEV_APPENDIX`, and adds Dev-only source/style tools plus Dev-extended shadow/frame inspection for Mid-tier debugging. Compact Dev is blocked before an LLM request is sent.

### Vision Detection

| Provider | Mechanism |
|---|---|
| OpenAI-compatible | Regex against model name (`gpt-4o`, `gpt-5`, `claude-3`, `claude-sonnet-4`, `gemini-2.0-flash`, etc.) |
| Anthropic | `claude-(3\|sonnet-4\|opus-4)` patterns |
| Ollama | `POST /api/show` `capabilities`, with legacy projector / `.vision.` metadata fallbacks; Auto / Force on / Off |
| llama.cpp | `GET /props` → `modalities.vision`, with Auto / Force on / Off |
| LM Studio | `GET /api/v1/models` → `capabilities.vision`; legacy `/api/v0/models` `type`, with overrides |
| LocalAI | `GET /v1/models/capabilities` → `input_modalities` / `capabilities`, with overrides |
| Jan / vLLM / SGLang | Explicit `supportsVision` config toggle (via OpenAI provider) |

Auto results are keyed by provider, exact selected model, and canonical base
URL. Concurrent checks share one request, and a late response from an older
configuration cannot change the current provider. A separately configured
dedicated vision provider continues to use the existing split-provider path.

### Anthropic Conversion

When the active provider is Anthropic, the agent converts OpenAI-format messages:

| OpenAI format | Anthropic format |
|---|---|
| `system` message | `system` field (top-level) |
| `assistant` + `tool_calls` | `assistant` + `tool_use` content blocks |
| `tool` role | `user` + `tool_result` content blocks |
| `image_url` (data URL) | `image` source block |

---

## ProviderManager (`providers/manager.js`)

Manages provider lifecycle:

```js
const pm = new ProviderManager();

await pm.load();                    // Load from chrome.storage.local
await pm.save();                    // Persist to chrome.storage.local
pm.getActive();                     // Get the active provider instance
await pm.setActive('openai');       // Switch active provider
await pm.updateProvider('openai', { model: 'gpt-5' }); // Update config
await pm.duplicateProvider('openai'); // Create openai__duplicate
await pm.removeDuplicateProvider('openai__duplicate'); // Remove it
pm.getAll();                        // All provider configs (for Settings UI)
await pm.testProvider('openai');    // Test connection
```

Each non-WebBrain provider config includes a persisted `configured` flag. An
explicit configuration update sets it to `true`; this is the UI's **Active**
state and is separate from `activeProvider`, which is the provider currently
**Selected** for chat. WebBrain Compass is always selectable without being marked
configured. Connection tests report reachability but do not control the Active
flag.

Settings can create one independent duplicate of each configurable endpoint
provider. A duplicate is stored as a normal provider entry with the stable ID
`<source>__duplicate` and a `duplicateOf` reference to the source definition,
so credentials, models, endpoint URLs, compatibility options, export/import,
and active-provider selection continue to use the existing provider schema.
The manager rejects duplicate-of-duplicate, second, orphaned, type-mismatched,
and forged duplicate entries when loading storage. WebBrain Compass and the
Chromium-only WebGPU runtime are not duplicable because they do not represent
independent user-managed API credentials or endpoints; their cards keep the
Duplicate affordance disabled with an explanatory tooltip.

### Settings Search

The Settings search index includes provider IDs, labels, type/category, model,
base URL, field labels/placeholders, suggestions, and compatibility options.
Matching cards are ordered by exact provider name/ID, then name/ID prefix, then
name/ID substring, then field-only matches. Original provider order breaks
ties, and the selected provider remains visible across category filters.

### Config Persistence

Configs are stored in `chrome.storage.local` under the `providers` key, merged against defaults. Defaults provide the SHAPE (which provider keys exist); stored configs override per-key values. This allows upgrades that introduce new provider entries to work without users clearing storage. Duplicate entries share this same persistence path and therefore remain portable through Settings config export/import.

Deprecated provider entries (`webbrain`, `openai_subscription`,
`claude_subscription`) are filtered out.

### Cost Allowances

Settings exposes session and total cloud cost allowances. The agent prefers a provider-reported `usage.cost`/`usage.cost_usd` value when present (OpenRouter reports this directly). For direct cloud providers that only return token counts, WebBrain estimates spend from the provider config fields:

- `inputCostPerMillionUsd`
- `cacheReadCostPerMillionUsd`
- `cacheWriteCostPerMillionUsd` (5-minute or unspecified cache writes)
- `cacheWrite1hCostPerMillionUsd`
- `outputCostPerMillionUsd`

OpenAI reports cache reads and writes inside the input-token total (`prompt_tokens_details.cached_tokens` / `cache_write_tokens`, or the Responses API `input_tokens_details` equivalents), so WebBrain subtracts both before applying the regular input rate and prices writes with `cacheWriteCostPerMillionUsd`. Anthropic and Bedrock report regular input, cache reads, and cache writes separately, so those counts are added as separate billing classes. Anthropic and Bedrock can also distinguish 5-minute and 1-hour cache writes.

Those rates are editable in the provider card so custom model pricing can be adjusted without code changes. If a cache-specific rate is absent, it falls back to the regular input rate; a missing 1-hour write rate falls back to the general cache-write rate. If a metered remote provider has token usage but no configured input/output rates, the agent uses conservative defaults (`$3` input / `$15` output per 1M tokens). Streaming providers contribute only their final cumulative usage snapshot for each request. Local providers are not counted.

### Dedicated Vision Provider

The user can configure a separate vision provider for screenshot description. The agent sub-calls this provider to get a text description of the viewport, then feeds only the description (not the raw image) to the main planning provider. This reduces token costs when the main provider is text-only:

| Aspect | Separate vision model + text planner | Single multimodal planner |
|---|---|---|
| Processing flow | The vision model describes the screenshot, then the text planner reasons over that description and chooses tools. | One model sees the screenshot, reasons about the task, and chooses tools in the same call. |
| Access to raw pixels | Only the vision model sees the image; the planner receives text. | The planner retains direct access to the image while deciding what to do. |
| Visual information loss | The description is a lossy handoff and may omit small text, spatial relationships, colors, icons, or state cues. | No intermediate description is required, so the model can revisit visual details during reasoning. |
| Planning and tool calls | The vision model is observation-only; the text planner owns all action and tool decisions. | The same model performs visual interpretation and tool planning. |
| Specialist-model advantage | Perception and planning can use models selected independently for their strongest capability. | One model must be strong at both multimodal perception and browser-tool use. |
| Visual grounding and coordinates | Text descriptions can weaken the relationship between an element and its exact visual position; accessibility-tree `ref_id` targets remain preferable. | Image and coordinate context stay together, although semantic `ref_id` targets are still safer than coordinate clicks. |
| Latency | Usually requires two sequential inference calls. | Usually requires one inference call. |
| Cost | Pays for the vision call plus the planner call, but can keep expensive image tokens away from the planner. | Pays for one multimodal call, whose image-token cost depends on the provider and image detail. |
| Prompt-injection boundary | The observation model receives no agent tools, creating a stronger separation between screenshot content and actions. | The model that sees screenshot content can also choose tools, so multimodal prompt-injection defenses carry more responsibility. |
| Failure characteristics | Adds a sidecar timeout or transcription-failure point; a text-only planner may have to continue without visual enrichment. | Removes the handoff failure, but the entire turn depends on one multimodal endpoint and its combined capabilities. |
| Best fit | Strong text/tool planner paired with a specialist vision model, especially when most actions use DOM or accessibility evidence. | A model that is already strong at both vision and tool use, especially for tasks requiring fine visual detail or tight visual reasoning. |

```js
const vision = await providerManager.getVisionProvider();
// Returns the explicit dedicated OpenAI-compatible vision provider, or null.
// Screenshot callers use resolveVisionRoute(activeProvider) to consider raw
// active-provider vision and the explicitly enabled, ready local fallback.
```

On Chromium, **Settings -> Multimodal -> Vision** also offers a one-click
in-browser fallback. It runs `webbrain-one/webbrain-vl-2-450M-onnx` through WebGPU in a
dedicated Worker with FP16 embeddings/vision encoder and a Q4 decoder. The
model is not present in the general provider catalog and never receives agent
tools or planning turns. Local vision is disabled by default and neither
Apocalypse Mode nor a screenshot operation can enable it or start its download.
The dedicated control probes WebGPU, records versioned consent, and then downloads
approximately 810 MB of model data from Hugging Face into the browser cache. The download runs in Chrome's
offscreen extension worker, so the user may switch tabs or close Settings while
it continues, but must keep Chrome running. Screenshots stay on-device and
only the generated description is passed to the active provider. The local
selection is stored as a Chrome-only preference, separately from the synced
OpenAI-compatible vision endpoint, so it can be disabled without losing that
endpoint or its credentials. Disabling it releases the loaded model and GPU
resources while retaining the browser-cached download. Firefox does not expose
this option because its build has no MV3 offscreen document.

Screenshot routing is deterministic: an explicit dedicated vision endpoint,
then a vision-capable active provider receiving raw pixels, then an explicitly
enabled and already-ready local fallback. If none is ready, inspection returns a
recoverable availability result; automatic screenshots skip enrichment and let
the task continue. Screenshot tools never wait for a model download. Dedicated
and local description calls have a 90-second total deadline, worker startup has
a 15-second deadline, and a local timeout cancels generation before recreating a
worker that does not settle within five seconds.

### Transcription Provider

Used by Tab Recorder for Whisper transcription. Falls back through configured providers in priority order: OpenAI → Groq → LM Studio → llama.cpp. Blocklist excludes providers known not to host Whisper (Anthropic, Gemini, Mistral, DeepSeek, xAI, Nvidia, Kimi), including duplicates of those providers.

---

## Adding a Provider

1. Add OpenAI-compatible metadata to `providers/provider-catalog.js`, including
   endpoint, model, auth mode, capabilities, and UI suggestions.
2. Create a provider class only when the wire protocol differs from the
   existing OpenAI, Anthropic, Azure, Bedrock, or Vertex adapters.
3. Add a factory case and import when a new class is required.
4. Add and attribute an SVG under `icons/providers/`.
5. Mirror code, icon, UI, and tests to Firefox.

### For OpenAI-compatible providers

If the provider speaks the OpenAI `/v1/chat/completions` API format, you only need to add a default config entry — `OpenAICompatibleProvider` handles the rest:

```js
myprovider: {
  type: 'openai',
  category: 'cloud',
  label: 'My Provider',
  providerName: 'myprovider',
  baseUrl: 'https://api.myprovider.com/v1',
  model: 'my-model',
  supportsAskStreaming: true,
  supportsStreamUsageOptions: false,
  apiKey: '',
  enabled: false,
},
```

Vision is auto-detected via model-name regex. If the provider has a known set of vision models, add them to the regex in `openai.js`. Set `supportsStreamUsageOptions: true` only for providers that accept OpenAI-style `stream_options.include_usage`; leave it false when a provider returns usage without accepting that request field.
