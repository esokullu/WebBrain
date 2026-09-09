# Vendored Transformers.js WebGPU runtime

This directory packages the JavaScript and WASM runtime used by two local
WebGPU paths in Chrome and by offline RAG's CPU/WASM semantic reranker:

- **Apocalypse Mode -> local WebGPU chat** downloads the selected LFM2.5 text
  or vision-language preset, or the Nanbeige4.2-3B ONNX export, used by the
  standalone-chat nuclear override. An opt-in Bonsai 27B preset uses a separate
  vendored bitgpu worker, not this Transformers.js runtime; see
  `src/chrome/vendor/bitgpu/README.webbrain.md`.
- **Settings -> Multimodal -> Vision -> LFM2.5-VL local fallback** runs
  `LiquidAI/LFM2.5-VL-450M-ONNX` as the dedicated screenshot sidecar.
- **Apocalypse Mode -> Offline RAG** runs the explicitly downloaded, pinned
  `Xenova/multilingual-e5-small` q8 model in a separate CPU/WASM worker. Model
  weights remain optional and are never bundled or downloaded by a question.

Model weights are not bundled. Transformers.js downloads each selected WebGPU
model on first use and stores it in the browser cache. The shipped ONNX chat
presets are LFM2.5 2.6B, 1.2B Instruct, 1.2B Thinking, VL 1.6B, VL 3B, and
Nanbeige4.2-3B.
They are available through the nuclear control in standalone chat and can also
be selected as the normal provider after download. The reasoning presets keep
completed thinking out of visible answers. Current LFM2.5-VL layouts use:

- `embed_tokens`: FP16
- `vision_encoder`: FP16
- `decoder_model_merged`: Q4

`Michionlion/Nanbeige4.2-3B-ONNX-WebGPU` needs no bundle patch, but it does
need two things from this runtime. It publishes one WebGPU-fused graph named
`onnx/model_webgpu_mlp_q4f16.onnx` instead of the default `model_q4f16.onnx`,
so the worker passes `model_file_name: 'model_webgpu_mlp'`; the two external
data shards are declared by the repository's own
`transformers.js_config.use_external_data_format`. Its graph also uses the
`com.microsoft::MatMulNBitsMlp` WebGPU kernel, which is compiled into the
vendored `ort-wasm-simd-threaded.asyncify.wasm`. Do not replace the ONNX
Runtime artifacts with a build that drops that kernel; a test asserts it is
present because its absence only shows up as an opaque session-creation
failure at runtime.

The dedicated 450M vision sidecar uses the same component layout and is
approximately 810 MB. The VL 1.6B chat export instead names its vision and
decoder components `embed_images` and `decoder`; the compatibility patch below
maps those files into the standard image-text session names.

## Packaged files

| File / directory | Source | Purpose |
| --- | --- | --- |
| `transformers.web.js` | `@huggingface/transformers` 4.2.0 | Browser ESM model/processor APIs |
| `ort.webgpu.mjs` | `onnxruntime-web` 1.27.0 | WebGPU execution provider |
| `onnxruntime-common/` | matching `onnxruntime-common` dependency | Tensor and session types |
| `ort-wasm-simd-threaded.asyncify.*` | `onnxruntime-web` 1.27.0 | The only WASM bridge; carries the WebGPU/JSEP runtime |
| `LICENSE.transformers.txt` | `@huggingface/transformers` 4.2.0 | Apache-2.0 license |
| `LICENSE.onnxruntime.txt` | ONNX Runtime 1.27.0 | MIT license |
| `ThirdPartyNotices.onnxruntime.txt` | ONNX Runtime 1.27.0 | Notices for incorporated third-party software |

The readable, unminified browser builds are committed so a fresh checkout is a
complete, Chrome Web Store-reviewable extension. Remote executable code is not
allowed by Manifest V3 CSP; only model/config/tokenizer data is fetched from
Hugging Face.

Only the asyncify variant is vendored. `ort.webgpu.mjs` resolves its WASM
filename from flags fixed at ONNX Runtime build time, and in this build the jsep
and jspi branches are compiled out, so `ort-wasm-simd-threaded.asyncify.*` is the
only bridge that can ever load. The WebGPU/JSEP execution provider lives inside
that artifact; it is not a separate download. Copying the `jsep` or `jspi` pair
adds tens of megabytes of unreachable binary to the reviewed package, so do not
restore them without first checking that filename branch.

The ONNX Runtime files are intentionally newer than the version pinned by
Transformers.js 4.2.0. Stable 1.27.0 contains WebGPU buffer-pool and
Qwen3/QMoE correctness fixes needed by Ling while retaining the same public
JavaScript session API used by this Transformers.js release.

## Browser bundle patches

The upstream browser bundle contains two bare module specifiers that an
unbundled extension cannot resolve. After copying a new release, rewrite them:

```bash
sed -i 's|"onnxruntime-web/webgpu"|"./ort.webgpu.mjs"|' \
  src/chrome/vendor/transformers/transformers.web.js
sed -i 's|"onnxruntime-common"|"./onnxruntime-common/index.js"|' \
  src/chrome/vendor/transformers/transformers.web.js
```

Verify that no executable bare imports remain:

```bash
grep -E '(import|export)[^"]*from\s+"[a-zA-Z@]' \
  src/chrome/vendor/transformers/transformers.web.js \
  | grep -v '^\s*//' | grep -v '^\s*\*'
```

The LFM2.5-VL ONNX repositories need two compatibility hooks. The 1.6B export
predates the standard ImageTextToText component filenames, so keep the small
`session_file_names` alias hook in
`MODEL_SESSION_CONFIG[MODEL_TYPES.ImageTextToText]`; the worker supplies aliases
through `config["transformers.js_config"]`. Keep the corresponding `getSession`
logic resolving device and dtype by logical `session_name`, while using the
aliased filename only to fetch the physical ONNX graph. Both current VL exports
also use the Transformers v5 processor layout: image metadata is nested in
`processor_config.json`, and the chat template lives in `chat_template.jinja`.
Keep `loadImageProcessorConfig`, `image_processor_config_file`, and
`chat_template_file` support so the worker can opt into that layout without
changing older models. Reapply these patches after replacing
`transformers.web.js`, and mirror the resulting browser bundle into Firefox so
the packaged vendor files remain byte-identical.

## Updating

Use a temporary dependency install; WebBrain does not need a runtime npm
dependency because the reviewed browser assets are committed directly:

```bash
npm install --no-save @huggingface/transformers@latest
cp node_modules/@huggingface/transformers/dist/transformers.web.js \
  src/chrome/vendor/transformers/
cp node_modules/onnxruntime-web/dist/ort.webgpu.mjs \
  src/chrome/vendor/transformers/
cp node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.asyncify.{mjs,wasm} \
  src/chrome/vendor/transformers/
rm -rf src/chrome/vendor/transformers/onnxruntime-common
mkdir src/chrome/vendor/transformers/onnxruntime-common
cp node_modules/onnxruntime-common/dist/esm/*.js \
  src/chrome/vendor/transformers/onnxruntime-common/
```

Copy the Transformers.js license and the ONNX Runtime license plus
`ThirdPartyNotices.txt` into this directory whenever the runtime is updated.
Reapply the specifier and ImageTextToText session-alias patches, update the
version table above, then verify:

1. `node --check` passes for the provider, host, and worker.
2. **Use local fallback** enables the option without downloading weights.
3. **Test Connection** reads `WB7` from the packaged vision probe image.
4. The second test reuses browser-cached model files.

## Runtime architecture

```text
ProviderManager._createProvider('webgpu') / getVisionProvider()
  -> WebGPUProvider.chat() / WebGPUVisionProvider.chat()
  -> MV3 offscreen document
  -> dedicated module Worker
  -> text-generation pipeline / AutoProcessor + AutoModelForImageTextToText
  -> selected LFM2.5 or Nanbeige ONNX repo / LFM2.5-VL-450M-ONNX over WebGPU
```

Keep inference in the Worker. The MV3 service worker has no WebGPU, while the
offscreen document's main thread has shown tighter WASM allocation limits for
large ONNX runs. Do not set `preferredOutputLocation: 'gpu-buffer'` on this
generation path: Transformers.js decodes the generated tensor on the CPU and
must be allowed to download that output normally.

LFM2.5-VL expects the image placeholder before the user's text in its chat
template. The Worker normalizes incoming OpenAI-style multimodal messages to
that order. For the connection test, it replaces the packaged generic OCR image
with three large, unlabeled color panels. This proves the local model received
pixels without relying on fine OCR, which is brittle for a 450M model. Normal
screenshots are never replaced by this probe-only path.
