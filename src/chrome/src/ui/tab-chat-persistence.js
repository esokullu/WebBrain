import { escapeHtml } from './utils.js';

export const TAB_CHAT_PREFIX = 'tabChat:';
export const TAB_CHAT_PERSIST_BUDGET = 7 * 1024 * 1024;
const TAB_CHAT_QUOTA_RETRY_BUDGET = 256 * 1024;
export const TRANSPARENT_PIXEL_PNG_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

const IMAGE_DATA_URL_PREFIX = 'data:image/';
const BASE64_DATA_URL_MARKER = ';base64,';

function asciiLowerCode(code) {
  return code >= 65 && code <= 90 ? code + 32 : code;
}

function matchesAsciiIgnoreCase(source, offset, expected) {
  if (offset + expected.length > source.length) return false;
  for (let i = 0; i < expected.length; i++) {
    if (asciiLowerCode(source.charCodeAt(offset + i))
      !== asciiLowerCode(expected.charCodeAt(i))) return false;
  }
  return true;
}

function isMimeTypeCode(code) {
  return (code >= 48 && code <= 57)
    || (code >= 65 && code <= 90)
    || (code >= 97 && code <= 122)
    || code === 43
    || code === 45
    || code === 46;
}

function isBase64Code(code) {
  return (code >= 48 && code <= 57)
    || (code >= 65 && code <= 90)
    || (code >= 97 && code <= 122)
    || code === 43
    || code === 47
    || code === 61;
}

function findImageDataUrl(source, start) {
  const firstCode = IMAGE_DATA_URL_PREFIX.charCodeAt(0);
  for (let index = start; index <= source.length - IMAGE_DATA_URL_PREFIX.length; index++) {
    if (asciiLowerCode(source.charCodeAt(index)) !== firstCode) continue;
    if (matchesAsciiIgnoreCase(source, index, IMAGE_DATA_URL_PREFIX)) return index;
  }
  return -1;
}

function imageDataPayloadEnd(source, marker) {
  let cursor = marker + IMAGE_DATA_URL_PREFIX.length;
  const mimeStart = cursor;
  while (cursor < source.length && isMimeTypeCode(source.charCodeAt(cursor))) cursor++;
  if (cursor === mimeStart) return -1;

  // Walk the short metadata section without applying a regexp to the image
  // bytes. A comma before `;base64,` means this is not a base64 data URL.
  while (cursor < source.length) {
    if (source.charCodeAt(cursor) === 44) return -1;
    if (matchesAsciiIgnoreCase(source, cursor, BASE64_DATA_URL_MARKER)) {
      cursor += BASE64_DATA_URL_MARKER.length;
      const payloadStart = cursor;
      while (cursor < source.length && isBase64Code(source.charCodeAt(cursor))) cursor++;
      return cursor > payloadStart ? cursor : -1;
    }
    cursor++;
  }
  return -1;
}

export function stripImagePayloadsForPersist(html) {
  const source = String(html || '');
  const chunks = [];
  let copyCursor = 0;
  let searchCursor = 0;
  let replaced = false;

  while (searchCursor < source.length) {
    const marker = findImageDataUrl(source, searchCursor);
    if (marker < 0) break;
    const end = imageDataPayloadEnd(source, marker);
    if (end < 0) {
      searchCursor = marker + IMAGE_DATA_URL_PREFIX.length;
      continue;
    }
    chunks.push(source.slice(copyCursor, marker), TRANSPARENT_PIXEL_PNG_DATA_URL);
    copyCursor = end;
    searchCursor = end;
    replaced = true;
  }

  if (!replaced) return source;
  chunks.push(source.slice(copyCursor));
  return chunks.join('');
}

function findHtmlTagEnd(source, start) {
  let quote = '';
  for (let i = start; i < source.length; i++) {
    const char = source[i];
    if (quote) {
      if (char === quote) quote = '';
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === '>') return i;
  }
  return -1;
}

function describeHtmlTag(raw) {
  let i = 0;
  while (i < raw.length && /\s/.test(raw[i])) i++;
  if (raw[i] === '!' || raw[i] === '?') return { closing: false, name: '' };
  let closing = false;
  if (raw[i] === '/') {
    closing = true;
    i++;
    while (i < raw.length && /\s/.test(raw[i])) i++;
  }
  const start = i;
  if (!/[a-z]/i.test(raw[i] || '')) return null;
  while (i < raw.length && /[a-z0-9:-]/i.test(raw[i])) i++;
  return {
    closing,
    name: raw.slice(start, i).toLowerCase(),
  };
}

function htmlToPlainText(html) {
  const source = String(html || '');
  const chunks = [];
  let cursor = 0;
  let suppressedTag = '';

  while (cursor < source.length) {
    const open = source.indexOf('<', cursor);
    if (open < 0) {
      if (!suppressedTag) chunks.push(source.slice(cursor));
      break;
    }
    if (!suppressedTag && open > cursor) chunks.push(source.slice(cursor, open));

    if (source.startsWith('<!--', open)) {
      const commentEnd = source.indexOf('-->', open + 4);
      if (commentEnd < 0) break;
      if (!suppressedTag) chunks.push(' ');
      cursor = commentEnd + 3;
      continue;
    }

    const close = findHtmlTagEnd(source, open + 1);
    if (close < 0) {
      if (!suppressedTag) chunks.push(source.slice(open));
      break;
    }
    const tag = describeHtmlTag(source.slice(open + 1, close));
    if (!tag) {
      if (!suppressedTag) chunks.push('<');
      cursor = open + 1;
      continue;
    }

    if (tag.name === 'script' || tag.name === 'style') {
      if (tag.closing && suppressedTag === tag.name) {
        suppressedTag = '';
        chunks.push(' ');
      } else if (!tag.closing && !suppressedTag) {
        suppressedTag = tag.name;
        chunks.push(' ');
      }
    } else if (!suppressedTag) {
      chunks.push(' ');
    }
    cursor = close + 1;
  }

  return chunks.join('');
}

export function compactTabChatForPersist(html, budget = TAB_CHAT_PERSIST_BUDGET) {
  const boundedBudget = Math.max(1024, Math.floor(Number(budget) || TAB_CHAT_PERSIST_BUDGET));
  const stripped = stripImagePayloadsForPersist(html);
  if (stripped.length <= boundedBudget) return stripped;

  // This is the last-resort stored copy only. Keep recent readable text in
  // valid markup instead of slicing arbitrary HTML and potentially restoring
  // a broken DOM. The live in-memory transcript remains untouched.
  const plainText = htmlToPlainText(stripped)
    .replace(/\s+/g, ' ')
    .trim();
  const marker = '[Earlier persisted chat content omitted to fit browser session storage.] ';
  // Entity escaping can expand a character to five bytes, so reserve a
  // conservative sixth of the available character budget for source text.
  const textBudget = Math.max(0, Math.floor((boundedBudget - 160) / 6));
  const recentText = plainText.slice(-textBudget);
  const fallback = `<div class="message system"><div class="message-text">${escapeHtml(marker + recentText)}</div></div>`;
  return fallback.slice(0, boundedBudget);
}

async function tabChatKeyBelongsToOpenTab(storedKey) {
  const rawTabId = String(storedKey || '').slice(TAB_CHAT_PREFIX.length);
  const tabId = Number(rawTabId);
  const tabs = globalThis.browser?.tabs || globalThis.chrome?.tabs;
  // Without a tab API there is no proof that removal is safe.
  if (!Number.isFinite(tabId) || !tabs?.get) return true;
  try {
    await tabs.get(tabId);
    return true;
  } catch (error) {
    // Only the browser's explicit "tab does not exist" errors prove closure.
    // A transient API/context failure leaves ownership unknown and must retain
    // the other tab's chat.
    const message = String(error?.message || error || '').toLowerCase();
    return !(
      /no tab with id\b/.test(message)
      || /invalid tab id\b/.test(message)
      || /no such tab\b/.test(message)
    );
  }
}

export async function persistTabChatToSession(storageArea, key, html, warn = console.warn) {
  const source = String(html || '');
  const initialValue = source.length > TAB_CHAT_PERSIST_BUDGET
    ? compactTabChatForPersist(source)
    : source;

  try {
    await storageArea.set({ [key]: initialValue });
    return { ok: true, degraded: initialValue !== source, recoveredFromQuota: false };
  } catch (initialError) {
    const retryValue = compactTabChatForPersist(source, TAB_CHAT_QUOTA_RETRY_BUDGET);
    let retryError = initialError;
    try {
      // The quota is shared across keys, so an individually-small chat can
      // still fail. First retry this write with a tightly bounded stored copy.
      await storageArea.set({ [key]: retryValue });
      return { ok: true, degraded: true, recoveredFromQuota: true };
    } catch (error) {
      retryError = error;
    }

    try {
      // Tab-close cleanup can be interrupted by a service-worker shutdown.
      // Reclaim only chats whose tab is provably gone; never delete another
      // open tab's history merely to make the current write fit.
      const stored = await storageArea.get(null);
      const candidates = Object.entries(stored || {})
        .filter(([storedKey, value]) => (
          storedKey !== key
          && storedKey.startsWith(TAB_CHAT_PREFIX)
          && typeof value === 'string'
        ))
        .sort((a, b) => b[1].length - a[1].length);
      const evictedKeys = [];
      for (const [storedKey] of candidates) {
        if (await tabChatKeyBelongsToOpenTab(storedKey)) continue;
        await storageArea.remove(storedKey);
        evictedKeys.push(storedKey);
        try {
          await storageArea.set({ [key]: retryValue });
          return {
            ok: true,
            degraded: true,
            recoveredFromQuota: true,
            evictedKeys,
          };
        } catch (error) {
          retryError = error;
        }
      }
    } catch (error) {
      retryError = error;
    }

    try {
      warn(
        '[WebBrain] persistTabChat: session storage write failed after compacting the stored copy; chat may not survive a panel reopen:',
        retryError?.message || retryError || initialError?.message || initialError,
      );
      return { ok: false, error: retryError || initialError };
    } catch {
      return { ok: false, error: retryError || initialError };
    }
  }
}

export const TAB_CHAT_HANDOFF_PREFIX = 'tabChatHandoff:';

/**
 * Serialize tab-chat reads and writes in the background's shared JavaScript
 * realm. Coordinated loads explicitly request and acknowledge the outgoing
 * document's final snapshot before assigning a new handoff generation.
 *
 * @param {chrome.storage.StorageArea | browser.storage.StorageArea} storageArea
 * @param {{
 *   persist?: typeof persistTabChatToSession,
 *   requestHandoff?: (tabId: number, handoff: { ownerId: string, generation: number }) => Promise<object | null>,
 * }} options
 */
export function createTabChatHandoffCoordinator(storageArea, {
  persist = persistTabChatToSession,
  requestHandoff = async () => null,
} = {}) {
  const operations = new Map();
  const handoffOperations = new Map();
  const latestHtml = new Map();

  function normalizeTabId(tabId) {
    const numericTabId = Number(tabId);
    return Number.isFinite(numericTabId) ? numericTabId : null;
  }

  function enqueue(tabId, fn) {
    const numericTabId = normalizeTabId(tabId);
    if (numericTabId == null) {
      return Promise.resolve({ ok: false, error: 'No tab ID' });
    }
    const previous = operations.get(numericTabId) || Promise.resolve();
    const operation = previous.catch(() => {}).then(() => fn(numericTabId));
    operations.set(numericTabId, operation);
    operation.finally(() => {
      if (operations.get(numericTabId) === operation) operations.delete(numericTabId);
    }).catch(() => {});
    return operation;
  }

  function enqueueHandoff(tabId, fn) {
    const previous = handoffOperations.get(tabId) || Promise.resolve();
    const operation = previous.catch(() => {}).then(fn);
    handoffOperations.set(tabId, operation);
    operation.finally(() => {
      if (handoffOperations.get(tabId) === operation) handoffOperations.delete(tabId);
    }).catch(() => {});
    return operation;
  }

  async function readHandoffState(tabId) {
    const key = TAB_CHAT_HANDOFF_PREFIX + tabId;
    const stored = await storageArea.get(key);
    const state = stored?.[key];
    const ownerId = String(state?.ownerId || '');
    const generation = Number(state?.generation);
    return ownerId && Number.isFinite(generation) && generation > 0
      ? { ownerId, generation }
      : null;
  }

  async function readLatest(tabId) {
    if (latestHtml.has(tabId)) {
      return { ok: true, found: true, html: latestHtml.get(tabId) };
    }
    const key = TAB_CHAT_PREFIX + tabId;
    const stored = await storageArea.get(key);
    const html = stored?.[key];
    if (typeof html === 'string') {
      latestHtml.set(tabId, html);
      return { ok: true, found: true, html };
    }
    return { ok: true, found: false, html: null };
  }

  function save(tabId, html, { ownerId = '', handoffGeneration = null } = {}) {
    const numericTabId = normalizeTabId(tabId);
    if (numericTabId == null) return Promise.resolve({ ok: false, error: 'No tab ID' });
    const source = String(html || '');
    return enqueue(numericTabId, async (queuedTabId) => {
      const normalizedOwnerId = String(ownerId || '');
      const normalizedGeneration = Number(handoffGeneration);
      if (normalizedOwnerId) {
        if (!Number.isFinite(normalizedGeneration) || normalizedGeneration <= 0) {
          return { ok: true, skipped: true, reason: 'stale-handoff' };
        }
        const state = await readHandoffState(queuedTabId);
        if (!state
            || state.ownerId !== normalizedOwnerId
            || state.generation !== normalizedGeneration) {
          return { ok: true, skipped: true, reason: 'stale-handoff' };
        }
      }
      // Retain the lossless copy even if persistence has to compact the
      // storage.session value for quota recovery.
      latestHtml.set(queuedTabId, source);
      return persist(storageArea, TAB_CHAT_PREFIX + queuedTabId, source);
    });
  }

  async function load(tabId, { waitForHandoff = false, claimantId = '' } = {}) {
    const numericTabId = normalizeTabId(tabId);
    if (numericTabId == null) return { ok: false, found: false, error: 'No tab ID' };
    if (!waitForHandoff) {
      return enqueue(numericTabId, queuedTabId => readLatest(queuedTabId));
    }

    return enqueueHandoff(numericTabId, async () => {
      const outgoing = await enqueue(numericTabId, queuedTabId => readHandoffState(queuedTabId));
      if (outgoing) {
        let acknowledgement = null;
        try {
          acknowledgement = await requestHandoff(numericTabId, outgoing);
        } catch { /* an unavailable outgoing document has no snapshot to acknowledge */ }
        if (acknowledgement?.ok
            && String(acknowledgement.ownerId || '') === outgoing.ownerId
            && Number(acknowledgement.generation) === outgoing.generation
            && typeof acknowledgement.html === 'string') {
          await save(numericTabId, acknowledgement.html, {
            ownerId: outgoing.ownerId,
            handoffGeneration: outgoing.generation,
          });
        }
      }

      return enqueue(numericTabId, async (queuedTabId) => {
        const current = await readHandoffState(queuedTabId);
        const generation = Math.max(
          Number(outgoing?.generation || 0),
          Number(current?.generation || 0),
        ) + 1;
        const normalizedClaimantId = String(claimantId || '');
        if (normalizedClaimantId) {
          await storageArea.set({
            [TAB_CHAT_HANDOFF_PREFIX + queuedTabId]: {
              ownerId: normalizedClaimantId,
              generation,
            },
          });
        }
        const result = await readLatest(queuedTabId);
        return {
          ...result,
          handoffOwnerId: normalizedClaimantId || null,
          handoffGeneration: normalizedClaimantId ? generation : null,
        };
      });
    });
  }

  function clear(tabId, {
    ownerId = '',
    handoffGeneration = null,
    additionalKeys = [],
    commitAfterRemove = null,
  } = {}) {
    const numericTabId = normalizeTabId(tabId);
    if (numericTabId == null) return Promise.resolve({ ok: false, error: 'No tab ID' });
    return enqueue(numericTabId, async (queuedTabId) => {
      const normalizedOwnerId = String(ownerId || '');
      const normalizedGeneration = Number(handoffGeneration);
      if (normalizedOwnerId && typeof commitAfterRemove === 'function') {
        throw new Error('A transactional clear cannot retain an existing handoff owner.');
      }
      if (normalizedOwnerId) {
        if (!Number.isFinite(normalizedGeneration) || normalizedGeneration <= 0) {
          return { ok: true, skipped: true, reason: 'stale-handoff' };
        }
        const state = await readHandoffState(queuedTabId);
        if (!state
            || state.ownerId !== normalizedOwnerId
            || state.generation !== normalizedGeneration) {
          return { ok: true, skipped: true, reason: 'stale-handoff' };
        }
      }
      const keys = [TAB_CHAT_PREFIX + queuedTabId];
      let nextGeneration = null;
      if (normalizedOwnerId) {
        nextGeneration = normalizedGeneration + 1;
        await storageArea.set({
          [TAB_CHAT_HANDOFF_PREFIX + queuedTabId]: {
            ownerId: normalizedOwnerId,
            generation: nextGeneration,
          },
        });
      } else {
        keys.push(TAB_CHAT_HANDOFF_PREFIX + queuedTabId);
      }
      for (const additionalKey of additionalKeys) {
        if (typeof additionalKey === 'string' && additionalKey) keys.push(additionalKey);
      }
      const removalKeys = [...new Set(keys)];
      const hadLatestHtml = latestHtml.has(queuedTabId);
      const previousLatestHtml = latestHtml.get(queuedTabId);
      const rollbackSnapshot = {};
      if (typeof commitAfterRemove === 'function') {
        for (const removalKey of removalKeys) {
          const stored = await storageArea.get(removalKey);
          if (Object.prototype.hasOwnProperty.call(stored || {}, removalKey)) {
            rollbackSnapshot[removalKey] = stored[removalKey];
          }
        }
      }
      await storageArea.remove(removalKeys);
      latestHtml.delete(queuedTabId);
      try {
        await commitAfterRemove?.();
      } catch (error) {
        if (hadLatestHtml) latestHtml.set(queuedTabId, previousLatestHtml);
        else latestHtml.delete(queuedTabId);
        if (Object.keys(rollbackSnapshot).length) {
          await storageArea.set(rollbackSnapshot);
        }
        throw error;
      }
      return {
        ok: true,
        handoffOwnerId: normalizedOwnerId || null,
        handoffGeneration: nextGeneration,
      };
    });
  }

  return { save, load, clear };
}
