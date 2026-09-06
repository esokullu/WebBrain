export async function readPdfResponseBytes(response, {
  maxBytes,
  tooLargeMessage = 'This PDF is larger than the WebBrain viewer limit.',
  emptyMessage = 'The PDF stream was empty.',
  unreadableMessage = 'The PDF stream could not be read safely.',
} = {}) {
  const limit = Number(maxBytes);
  if (!Number.isSafeInteger(limit) || limit <= 0) {
    throw new TypeError('A positive PDF byte limit is required.');
  }

  const contentLengthValue = response?.headers?.get?.('content-length');
  const contentLength = Number(contentLengthValue);
  if (contentLengthValue && Number.isFinite(contentLength) && contentLength > limit) {
    throw new Error(tooLargeMessage);
  }

  const reader = response?.body?.getReader?.();
  if (!reader) throw new Error(unreadableMessage);

  const chunks = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = value instanceof Uint8Array ? value : new Uint8Array(value || 0);
      if (totalBytes + chunk.byteLength > limit) {
        try { await reader.cancel(tooLargeMessage); } catch {}
        throw new Error(tooLargeMessage);
      }
      chunks.push(chunk);
      totalBytes += chunk.byteLength;
    }
  } finally {
    try { reader.releaseLock?.(); } catch {}
  }

  if (!totalBytes) throw new Error(emptyMessage);
  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}
