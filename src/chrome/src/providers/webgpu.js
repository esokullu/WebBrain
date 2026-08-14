/** In-browser WebGPU providers hosted by Chrome's shared offscreen worker. */

import { BaseLLMProvider } from './base.js';
import { ensureOffscreen } from '../offscreen/ensure.js';

export const WEBGPU_VISION_MODEL_ID = 'LiquidAI/LFM2.5-VL-450M-ONNX';
export const WEBGPU_MODEL_ID = 'webbrain-one/Ling-3.0-tiny-ONNX';
export const WEBGPU_QWEN_MODEL_ID = 'onnx-community/Qwen3-0.6B-ONNX';
export const WEBGPU_BONSAI_MODEL_ID = 'onnx-community/Ternary-Bonsai-1.7B-ONNX';
export const WEBGPU_DTYPE = 'q4f16';
export const WEBGPU_BONSAI_DTYPE = 'q2f16';
export const WEBGPU_MODEL_PRESETS = Object.freeze([
  Object.freeze({ id: WEBGPU_MODEL_ID, label: 'Ling 3.0 Tiny', size: '4.85 GB', dtype: WEBGPU_DTYPE, dtypeLabel: WEBGPU_DTYPE }),
  Object.freeze({ id: WEBGPU_QWEN_MODEL_ID, label: 'Qwen3 0.6B', size: '570 MB', dtype: WEBGPU_DTYPE, dtypeLabel: WEBGPU_DTYPE }),
  Object.freeze({ id: WEBGPU_BONSAI_MODEL_ID, label: 'Ternary Bonsai 1.7B', size: '480 MB', dtype: WEBGPU_BONSAI_DTYPE, dtypeLabel: WEBGPU_BONSAI_DTYPE }),
]);
export const WEBGPU_MODEL_NOT_READY_ERROR = `${WEBGPU_MODEL_ID} is not downloaded. Open Settings > Providers > WebGPU to download it before chatting.`;
// Chrome-only selection state. Keep this separate from the synced
// `visionModel` endpoint so enabling the fallback never overwrites a user's
// remote vision credentials or sends a Chromium-only provider type to Firefox.
export const WEBGPU_VISION_ENABLED_KEY = 'webgpuVisionEnabled';
export const WEBGPU_VISION_DTYPE = Object.freeze({
  embed_tokens: 'fp16',
  vision_encoder: 'fp16',
  decoder_model_merged: 'q4',
});

export function normalizeWebgpuModelId(value) {
  let model = String(value || '').trim();
  if (!model) return WEBGPU_MODEL_ID;
  if (/^https?:\/\//i.test(model)) {
    let url;
    try {
      url = new URL(model);
    } catch {
      throw new Error('Enter a Hugging Face repository as owner/repository or a huggingface.co URL.');
    }
    if (!['huggingface.co', 'www.huggingface.co'].includes(url.hostname.toLowerCase())) {
      throw new Error('Custom WebGPU models must use a huggingface.co repository.');
    }
    const parts = url.pathname.split('/').filter(Boolean).map(part => decodeURIComponent(part));
    if (parts.length !== 2) {
      throw new Error('Use the repository URL, not a file, branch, or collection URL.');
    }
    model = parts.join('/');
  }
  model = model.replace(/^\/+|\/+$/g, '');
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*\/[A-Za-z0-9][A-Za-z0-9._-]*$/.test(model)) {
    throw new Error('Enter a Hugging Face repository as owner/repository.');
  }
  return model;
}

export function webgpuModelDisplayName(modelId) {
  const normalized = normalizeWebgpuModelId(modelId);
  return WEBGPU_MODEL_PRESETS.find(preset => preset.id === normalized)?.label || normalized;
}

export function webgpuModelDtype(modelId, fallback = WEBGPU_DTYPE) {
  const normalized = normalizeWebgpuModelId(modelId);
  return WEBGPU_MODEL_PRESETS.find(preset => preset.id === normalized)?.dtype || fallback;
}

class WebGPUOffscreenProvider extends BaseLLMProvider {
  async _dispatch(message) {
    await ensureOffscreen();
    return await new Promise((resolve, reject) => {
      try {
        chrome.runtime.sendMessage(message, (response) => {
          const lastError = chrome.runtime.lastError;
          if (lastError) reject(new Error(lastError.message));
          else resolve(response);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async _testWebGPU() {
    try {
      const response = await this._dispatch({ type: 'webgpu-probe' });
      if (!response || response.error) {
        return { ok: false, error: response?.error || 'offscreen probe failed' };
      }
      if (!response.hasWebGPU) {
        return {
          ok: false,
          error: 'Hardware WebGPU is unavailable. Check chrome://gpu and enable WebGPU before using this provider.',
        };
      }
      if (response.isFallbackAdapter) {
        return {
          ok: false,
          error: 'Chrome is using a software WebGPU adapter. This provider requires a hardware WebGPU adapter.',
        };
      }
      return {
        ok: true,
        model: this.model,
        device: 'webgpu',
        libraryVersion: response.libraryVersion || null,
      };
    } catch (error) {
      return { ok: false, error: error?.message || String(error) };
    }
  }
}

/**
 * General, endpoint-free local provider backed by a Transformers.js ONNX model.
 * Model data is downloaded by Transformers.js and cached by the browser.
 */
export class WebGPUProvider extends WebGPUOffscreenProvider {
  constructor(config = {}) {
    const model = normalizeWebgpuModelId(config.model);
    const dtype = webgpuModelDtype(model, config.dtype || WEBGPU_DTYPE);
    super({
      ...config,
      type: 'webgpu',
      category: 'local',
      providerName: 'webgpu',
      label: 'WebGPU (In-browser)',
      baseUrl: '',
      model,
      device: 'webgpu',
      dtype,
      supportsVision: false,
      supportsAskStreaming: false,
    });
    this.model = model;
    this.baseUrl = '';
    this.device = 'webgpu';
    this.dtype = dtype;
  }

  get name() {
    return 'webgpu';
  }

  get supportsTools() {
    return true;
  }

  async chat(messages, options = {}) {
    if (this._messagesContainImage(messages)) {
      throw new Error('The WebGPU chat model is text-only. Configure a separate model under Settings -> Multimodal for screenshots.');
    }
    const download = await this.downloadStatus();
    if (!download.ready) {
      throw new Error(`${webgpuModelDisplayName(this.model)} is not downloaded. Open Settings > Providers > WebGPU to download it before chatting.`);
    }
    const response = await this._dispatch({
      type: 'webgpu-chat',
      model: this.model,
      device: this.device,
      dtype: this.dtype,
      messages: this._chatMessages(messages, options),
      options: {
        maxTokens: options.maxTokens,
        tools: Array.isArray(options.tools) ? options.tools : [],
      },
    });
    if (!response || response.error) {
      const error = new Error(`In-browser WebGPU: ${response?.error || 'no response from the inference worker'}`);
      // A failed OrtRun leaves the WebGPU session/device in an unknown state.
      // The agent's generic two-second network retry only repeats a costly GPU
      // failure, so surface this terminally and let the user free resources or
      // restart Chrome before attempting another turn.
      if (/OrtRun|BufferManager::Download|mapAsync|GPUBuffer|device lost/i.test(error.message)) {
        error.isAskStreamTerminalError = true;
      }
      throw error;
    }
    return {
      content: String(response.content || ''),
      reasoningContent: response.reasoningContent || null,
      toolCalls: null,
      usage: null,
      raw: response.raw || null,
    };
  }

  /** Probe the packaged runtime and adapter without downloading model weights. */
  async testConnection() {
    return this._testWebGPU();
  }

  async downloadStatus() {
    const response = await this._dispatch({
      type: 'webgpu-download-status',
      model: this.model,
      dtype: this.dtype,
    });
    if (!response || response.error) {
      throw new Error(response?.error || 'Unable to read the WebGPU model download status.');
    }
    return response;
  }

  async startDownload() {
    const response = await this._dispatch({
      type: 'webgpu-download-start',
      model: this.model,
      device: this.device,
      dtype: this.dtype,
    });
    if (!response || response.error) {
      throw new Error(response?.error || `Unable to download ${webgpuModelDisplayName(this.model)}.`);
    }
    return response;
  }

  async pauseDownload() {
    const response = await this._dispatch({ type: 'webgpu-download-pause' });
    if (!response || response.error) {
      throw new Error(response?.error || 'Unable to pause the WebGPU model download.');
    }
    return response;
  }

  async stopDownload() {
    const response = await this._dispatch({
      type: 'webgpu-download-stop',
      model: this.model,
      dtype: this.dtype,
    });
    if (!response || response.error) {
      throw new Error(response?.error || 'Unable to stop the WebGPU model download.');
    }
    return response;
  }

  /** Release text-model GPU allocations while preserving the browser cache. */
  async dispose() {
    try {
      const response = await this._dispatch({ type: 'webgpu-dispose' });
      return response?.error
        ? { ok: false, error: response.error }
        : { ok: true, disposed: response?.disposed !== false };
    } catch (error) {
      return { ok: false, error: error?.message || String(error) };
    }
  }
}

export class WebGPUVisionProvider extends WebGPUOffscreenProvider {
  constructor(config = {}) {
    const model = String(config.model || WEBGPU_VISION_MODEL_ID).trim();
    super({
      ...config,
      type: 'webgpu',
      category: 'local',
      providerName: 'webgpu-vision',
      label: 'In-browser vision',
      baseUrl: 'local://webgpu',
      model,
      supportsVision: true,
    });
    this.model = model;
    this.baseUrl = this.config.baseUrl;
    this.device = config.device || 'webgpu';
    this.dtype = config.dtype || WEBGPU_VISION_DTYPE;
  }

  get name() {
    return 'webgpu-vision';
  }

  get supportsVision() {
    return true;
  }

  get supportsTools() {
    return false;
  }

  async chat(messages, options = {}) {
    const response = await this._dispatch({
      type: 'webgpu-vision-chat',
      model: this.model,
      device: this.device,
      dtype: this.dtype,
      messages,
      options: {
        maxTokens: options.maxTokens,
        ...(options.webbrainVisionProbe === true ? { visionProbe: true } : {}),
      },
    });
    if (!response || response.error) {
      throw new Error(`In-browser vision: ${response?.error || 'no response from the inference worker'}`);
    }
    return {
      content: String(response.content || ''),
      toolCalls: null,
      usage: null,
      raw: response.raw || null,
    };
  }

  /** Probe WebGPU and the packaged runtime without downloading model weights. */
  async testConnection() {
    return this._testWebGPU();
  }

  async clearCache() {
    try {
      const response = await this._dispatch({ type: 'webgpu-vision-clear-cache' });
      return response?.error
        ? { ok: false, error: response.error }
        : { ok: true, deletedCaches: response?.deletedCaches || [] };
    } catch (error) {
      return { ok: false, error: error?.message || String(error) };
    }
  }

  /** Release GPU/model allocations while preserving downloaded model files. */
  async dispose() {
    try {
      const response = await this._dispatch({ type: 'webgpu-vision-dispose' });
      return response?.error
        ? { ok: false, error: response.error }
        : { ok: true, disposed: response?.disposed !== false };
    } catch (error) {
      return { ok: false, error: error?.message || String(error) };
    }
  }

}
