/**
 * Floating WebBrain shortcut for selected page text.
 *
 * Runs only in the top frame. The UI is isolated in a closed Shadow DOM;
 * the background owns prompt construction and untrusted-content wrapping.
 */
(function () {
  const shortcutConfig = globalThis.__webbrainSelectionShortcutConfig;
  if ((window.top !== window && shortcutConfig?.allowNestedFrame !== true)
      || window.__webbrainSelectionShortcutInjected) return;
  window.__webbrainSelectionShortcutInjected = true;

  const api = globalThis.browser || globalThis.chrome;
  if (!api?.runtime || !api?.storage?.local) return;

  const STORAGE_KEY = 'selectionShortcutEnabled';
  const LOCALE_STORAGE_KEY = 'wbLocale';
  const SUBMIT_MESSAGE = typeof shortcutConfig?.submitMessage === 'string'
    && shortcutConfig.submitMessage.trim()
    ? shortcutConfig.submitMessage.trim()
    : 'WB_SELECTION_SHORTCUT_SUBMIT';
  const SUBMIT_FIELDS = shortcutConfig?.submitFields
    && typeof shortcutConfig.submitFields === 'object'
    && !Array.isArray(shortcutConfig.submitFields)
    ? { ...shortcutConfig.submitFields }
    : {};
  const LOCALIZATION_MESSAGE = 'WB_SELECTION_SHORTCUT_LOCALIZATION';
  const GAP = 8;
  const BUTTON_SIZE = 44;
  const POPUP_WIDTH = 316;
  const MAX_SELECTION_HIGHLIGHT_RECTS = 200;
  const TRANSLATION_LANGUAGES = Object.freeze([
    'en', 'es', 'fr', 'tr', 'zh', 'ru', 'uk', 'ar',
    'ja', 'ko', 'id', 'th', 'ms', 'tl', 'pl', 'he',
    'hi', 'pt', 'vi', 'bn', 'fa', 'nl', 'de',
  ]);
  const LOCALIZATION_KEYS = Object.freeze([
    'askSelection', 'askHighlightedText', 'openChat', 'summarize', 'explain', 'quiz',
    'proofread', 'humanize', 'translate', 'translateTo', 'askAbout',
    'askQuestion', 'sendQuestion', 'includePageContext', 'hideShortcut', 'sentManual', 'sendFailed',
  ]);

  let enabled = true;
  let suppressed = false;
  let submitting = false;
  let interacting = false;
  let snapshot = null;
  let host = null;
  let shadow = null;
  let highlightLayer = null;
  let shortcut = null;
  let popup = null;
  let question = null;
  let includePageContext = null;
  let sendButton = null;
  let interfaceLanguage = resolveInterfaceLanguage('');
  let localization = null;
  let localizationRequestId = 0;
  let toast = null;
  let toastTimer = null;
  let selectionTimer = null;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function isTextField(element) {
    return element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement;
  }

  function isSupportedTranslationLanguage(value) {
    return TRANSLATION_LANGUAGES.includes(value);
  }

  function serializeRect(rect) {
    return {
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height,
    };
  }

  function collectVisibleHighlightRects(rects) {
    const visibleRects = [];
    for (const rect of rects) {
      const isVisible = rect.bottom > 0
        && rect.right > 0
        && rect.top < window.innerHeight
        && rect.left < window.innerWidth;
      if (!isVisible) continue;
      visibleRects.push(rect);
      if (visibleRects.length >= MAX_SELECTION_HIGHLIGHT_RECTS) break;
    }
    return visibleRects;
  }

  function resolveInterfaceLanguage(value) {
    const preferred = String(value || '').trim().toLowerCase();
    if (isSupportedTranslationLanguage(preferred)) return preferred;
    const browserLanguage = String(navigator.language || 'en').slice(0, 2).toLowerCase();
    return isSupportedTranslationLanguage(browserLanguage) ? browserLanguage : 'en';
  }

  function normalizeLocalization(response) {
    if (!response?.ok || !response.strings || typeof response.strings !== 'object') return null;
    const strings = {};
    for (const key of LOCALIZATION_KEYS) {
      const value = response.strings[key];
      if (typeof value !== 'string' || !value.trim()) return null;
      strings[key] = value;
    }
    return {
      locale: resolveInterfaceLanguage(response.locale),
      dir: response.dir === 'rtl' ? 'rtl' : 'ltr',
      strings,
    };
  }

  function applyLocalization() {
    if (!localization || !shadow) return;
    const strings = localization.strings;
host.lang = localization.locale;
    host.dir = localization.dir;
    shortcut.setAttribute('aria-label', strings.askHighlightedText);
    shortcut.title = strings.askHighlightedText;
    popup.setAttribute('aria-label', strings.askHighlightedText);
    for (const action of ['summarize', 'explain', 'quiz', 'proofread', 'humanize', 'translate']) {
      const label = shadow.querySelector(`[data-action="${action}"] .action-label`);
      if (label) label.textContent = strings[action];
    }
    question.setAttribute('aria-label', strings.askQuestion);
    question.placeholder = strings.askQuestion;
    sendButton.setAttribute('aria-label', strings.sendQuestion);
    const contextOptionLabel = shadow.querySelector('.context-option span');
    if (contextOptionLabel) contextOptionLabel.textContent = strings.includePageContext;
    const hideButton = shadow.querySelector('.hide');
    if (hideButton) hideButton.textContent = strings.hideShortcut;
  }

  async function refreshLocalization(value) {
    interfaceLanguage = resolveInterfaceLanguage(value);
    const requestId = ++localizationRequestId;
    try {
      const response = await api.runtime.sendMessage({
        type: LOCALIZATION_MESSAGE,
        locale: interfaceLanguage,
      });
      if (requestId !== localizationRequestId) return;
      const next = normalizeLocalization(response);
      if (!next) return;
      interfaceLanguage = next.locale;
      localization = next;
      applyLocalization();
    } catch { /* English markup remains the offline fallback. */ }
  }

  function readSelection() {
    if (!enabled || suppressed || submitting || isTextField(document.activeElement)) return null;
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) return null;
    const text = selection.toString().trim();
    if (!text) return null;

    const range = selection.getRangeAt(0);
    const ancestor = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
      ? range.commonAncestorContainer
      : range.commonAncestorContainer.parentElement;
    if (ancestor?.closest?.('input, textarea')) return null;

    const rects = Array.from(range.getClientRects()).filter((rect) => rect.width > 0 && rect.height > 0);
    const visibleRects = collectVisibleHighlightRects(rects);
    const rect = visibleRects[0] || rects[0] || range.getBoundingClientRect();
    if (!rect || (!rect.width && !rect.height)) return null;
    return {
      text,
      rect: serializeRect(rect),
      rects: (visibleRects.length ? visibleRects : [rect]).map(serializeRect),
    };
  }

  function ensureSurface() {
    if (host?.isConnected) return;
    host = document.createElement('div');
    host.id = 'webbrain-selection-shortcut-host';
    host.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;display:block;pointer-events:none;z-index:2147483647';
    shadow = host.attachShadow({ mode: 'closed' });
    shadow.innerHTML = `
      <style>
        :host {
          --accent:#6c63ff; --accent-strong:#554cf2; --bg:#fff;
          --hover:#f4f3ff; --text:#171722; --muted:#666679; --border:#dedee9;
          --shadow:0 18px 50px rgba(24,20,70,.22),0 3px 12px rgba(24,20,70,.12);
          color-scheme:light dark;
        }
        * { box-sizing:border-box; }
        button,textarea { font:inherit; }
        [hidden] { display:none !important; }
        .selection-highlight {
          position:fixed; border-radius:3px; pointer-events:none;
          background:rgba(108,99,255,.3); box-shadow:inset 0 0 0 1px rgba(85,76,242,.18);
        }
        .shortcut {
          position:fixed; width:${BUTTON_SIZE}px; height:${BUTTON_SIZE}px; display:grid;
          place-items:center; padding:0; border:1px solid rgba(108,99,255,.34);
          border-radius:14px; background:var(--bg); color:var(--accent);
          box-shadow:0 10px 26px rgba(35,30,95,.22),0 2px 7px rgba(35,30,95,.12);
          cursor:pointer; pointer-events:auto; transition:transform 130ms ease,box-shadow 130ms ease;
        }
        .shortcut:hover { transform:translateY(-1px) scale(1.03); box-shadow:0 13px 30px rgba(35,30,95,.27),0 3px 8px rgba(35,30,95,.14); }
        .shortcut-icon {
          display:block; font:700 25px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          transform:translateY(-1px);
        }
        .popup {
          position:fixed; width:min(${POPUP_WIDTH}px,calc(100vw - 16px));
          max-height:calc(100vh - 16px); overflow-y:auto; overscroll-behavior:contain;
          padding:12px;
          border:1px solid var(--border); border-radius:16px; background:var(--bg);
          color:var(--text); box-shadow:var(--shadow); pointer-events:auto;
          font:15px/1.35 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        }
        .actions { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:2px; }
        .action,.hide {
          border:0; border-radius:10px; background:transparent;
          color:var(--text); text-align:start; cursor:pointer;
        }
        .action {
          width:100%; min-width:0; display:flex; align-items:center; gap:9px;
          padding:10px 12px; font-size:15px; font-weight:550;
        }
        .action-icon {
          width:17px; height:17px; flex:0 0 17px; color:var(--accent);
          fill:none; stroke:currentColor; stroke-width:1.7;
          stroke-linecap:round; stroke-linejoin:round;
        }
        .action-label { min-width:0; }
        .action:hover .action-icon { color:var(--accent-strong); }
        .action:hover,.hide:hover { background:var(--hover); }
        .question-wrap { position:relative; margin-top:8px; }
        textarea {
          display:block; width:100%; min-height:76px; max-height:150px; resize:vertical;
          padding:10px 42px 10px 11px; border:1px solid var(--border); border-radius:12px;
          background:var(--bg); color:var(--text); font:14px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        }
        textarea::placeholder { color:var(--muted); }
        textarea:focus { border-color:var(--accent); outline:none; }
        .send {
          position:absolute; right:8px; bottom:8px; width:28px; height:28px;
          display:grid; place-items:center; padding:0; border:0; border-radius:9px;
          background:var(--accent); color:#fff; cursor:pointer;
        }
        .send:hover:not(:disabled) { background:var(--accent-strong); }
        .send:disabled { opacity:.38; cursor:default; }
        .send svg { width:15px; height:15px; }
        .context-option {
          display:flex; align-items:flex-start; gap:8px; margin:8px 2px 2px;
          color:var(--muted); font-size:13px; line-height:1.35; cursor:pointer;
        }
        .context-option input { margin:2px 0 0; accent-color:var(--accent); }
        .divider { height:1px; margin:10px 0 4px; background:var(--border); }
        .hide-row { display:flex; }
        .hide {
          width:auto; margin-left:auto; padding:5px 8px;
          color:var(--muted); font-size:12px; line-height:1.25;
        }
        .shortcut:focus-visible,.action:focus-visible,.hide:focus-visible,.send:focus-visible,textarea:focus-visible,.context-option input:focus-visible {
          outline:3px solid rgba(108,99,255,.34); outline-offset:2px;
        }
        .toast {
          position:fixed; left:50%; bottom:22px; max-width:min(440px,calc(100vw - 24px));
          transform:translateX(-50%); padding:10px 14px; border:1px solid var(--border);
          border-radius:12px; background:var(--bg); color:var(--text); box-shadow:var(--shadow);
          font:600 13px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          pointer-events:none;
        }
        @media (prefers-color-scheme:dark) {
          :host {
            --bg:#20202a; --hover:#2d2c42; --text:#f5f4ff; --muted:#b5b3c7;
            --border:#444355; --shadow:0 18px 54px rgba(0,0,0,.46),0 3px 12px rgba(0,0,0,.28);
          }
        }
        @media (prefers-reduced-motion:reduce) { .shortcut { transition:none; } }
      </style>
      <div class="selection-highlights" aria-hidden="true"></div>
      <button class="shortcut" type="button" aria-label="Ask WebBrain about this" title="Ask WebBrain about this" hidden>
        <span class="shortcut-icon" aria-hidden="true">?</span>
      </button>
      <div class="popup" role="dialog" aria-label="Ask WebBrain about this" hidden>
        <div class="main-view">
          <div class="actions">
            <button class="action" type="button" data-action="summarize">
              <svg class="action-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
                <path d="M4 5h12M4 9h9M4 13h12M4 17h7"/>
              </svg>
              <span class="action-label">Summarize</span>
            </button>
            <button class="action" type="button" data-action="explain">
              <svg class="action-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
                <path d="M6.5 11.5a5 5 0 1 1 7 0c-.9.8-1.3 1.6-1.4 2.5H7.9c-.1-.9-.5-1.7-1.4-2.5ZM8.2 17h3.6M8 14h4"/>
              </svg>
              <span class="action-label">Explain</span>
            </button>
            <button class="action" type="button" data-action="quiz">
              <svg class="action-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
                <circle cx="10" cy="10" r="7"/>
                <path d="M7.8 7.8a2.5 2.5 0 0 1 4.8 1c0 1.8-2.6 2.1-2.6 3.7M10 15.5h.01"/>
              </svg>
              <span class="action-label">Quiz me</span>
            </button>
            <button class="action" type="button" data-action="proofread">
              <svg class="action-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
                <path d="M5 3.5h7l3 3v10H5zM12 3.5v3h3M7.3 11.8l1.6 1.6 3.5-3.7"/>
              </svg>
              <span class="action-label">Proofread</span>
            </button>
            <button class="action" type="button" data-action="humanize">
              <svg class="action-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
                <circle cx="10" cy="7" r="2.5"/>
                <path d="M4.8 16.5C5.6 13.5 7.4 12 10 12s4.4 1.5 5.2 4.5"/>
              </svg>
              <span class="action-label">Humanize</span>
            </button>
            <button class="action" type="button" data-action="translate">
              <svg class="action-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
                <path d="M3.5 5h9M8 3v2M5.2 8.5c1.2 2 3 3.6 5.4 4.7M11.2 7.5c-1 2.6-3.2 4.8-6.5 6.5M12.5 16.5l2.8-7 2.8 7M13.5 14h3.6"/>
              </svg>
              <span class="action-label">Translate</span>
            </button>
          </div>
          <div class="question-wrap">
            <textarea maxlength="2000" rows="3" aria-label="Ask WebBrain a question" placeholder="Ask WebBrain…"></textarea>
            <button class="send" type="button" aria-label="Send question" disabled>
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h11M11 6l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
          <label class="context-option">
            <input type="checkbox" checked>
            <span>Include page &amp; conversation context</span>
          </label>
          <div class="divider"></div>
          <div class="hide-row">
            <button class="hide" type="button">Hide this</button>
          </div>
        </div>
      </div>
      <div class="toast" role="status" aria-live="polite" hidden></div>
    `;

    highlightLayer = shadow.querySelector('.selection-highlights');
    shortcut = shadow.querySelector('.shortcut');
    popup = shadow.querySelector('.popup');
    question = shadow.querySelector('textarea');
    includePageContext = shadow.querySelector('.context-option input');
    sendButton = shadow.querySelector('.send');
    toast = shadow.querySelector('.toast');
    applyLocalization();

    shortcut.addEventListener('click', (event) => {
      if (event.isTrusted && snapshot && !submitting) openPopup();
    });
    shadow.querySelectorAll('[data-action]').forEach((button) => {
      button.addEventListener('click', (event) => {
        if (!event.isTrusted) return;
        submitSelection(button.dataset.action, '', interfaceLanguage);
      });
    });
    question.addEventListener('input', () => {
      sendButton.disabled = !question.value.trim();
    });
    sendButton.addEventListener('click', (event) => {
      if (event.isTrusted) submitSelection('custom', question.value);
    });
    shadow.querySelector('.hide').addEventListener('click', (event) => {
      if (event.isTrusted) disableShortcut();
    });
    host.addEventListener('pointerdown', () => { interacting = true; }, true);
    host.addEventListener('pointerup', () => {
      setTimeout(() => { interacting = false; }, 0);
    }, true);
    (document.documentElement || document.body).appendChild(host);
  }

  function getVisibleSelectionBottom() {
    if (!snapshot) return 0;
    return (snapshot.rects || []).reduce(
      (bottom, selectionRect) => Math.max(bottom, selectionRect.bottom),
      snapshot.rect.bottom,
    );
  }

  function positionShortcut() {
    if (!snapshot || !shortcut) return;
    const rect = snapshot.rect;
    let left = rect.left + rect.width / 2 - BUTTON_SIZE / 2;
    let top = rect.top - BUTTON_SIZE - GAP;
    if (top < GAP) top = getVisibleSelectionBottom() + GAP;
    left = clamp(left, GAP, Math.max(GAP, window.innerWidth - BUTTON_SIZE - GAP));
    top = clamp(top, GAP, Math.max(GAP, window.innerHeight - BUTTON_SIZE - GAP));
    shortcut.style.left = `${Math.round(left)}px`;
    shortcut.style.top = `${Math.round(top)}px`;
  }

  function positionPopup() {
    if (!popup || popup.hidden || !shortcut) return;
    const buttonRect = shortcut.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();
    let left = buttonRect.left;
    let top = buttonRect.bottom + 8;
    if (top + popupRect.height > window.innerHeight - GAP) top = buttonRect.top - popupRect.height - 8;
    left = clamp(left, GAP, Math.max(GAP, window.innerWidth - popupRect.width - GAP));
    top = clamp(top, GAP, Math.max(GAP, window.innerHeight - popupRect.height - GAP));
    popup.style.left = `${Math.round(left)}px`;
    popup.style.top = `${Math.round(top)}px`;
  }

  function clearSelectionHighlight() {
    highlightLayer?.replaceChildren();
  }

  function showSelectionHighlight() {
    clearSelectionHighlight();
    if (!highlightLayer || !snapshot) return;
    const rects = snapshot.rects?.length ? snapshot.rects : [snapshot.rect];
    for (const rect of rects) {
      const highlight = document.createElement('span');
      highlight.className = 'selection-highlight';
      highlight.style.left = `${rect.left}px`;
      highlight.style.top = `${rect.top}px`;
      highlight.style.width = `${rect.width}px`;
      highlight.style.height = `${rect.height}px`;
      highlightLayer.appendChild(highlight);
    }
  }

  function containSurfaceKeyboardEvent(event) {
    if (!host || !event.composedPath?.().includes(host)) return;
    event.stopImmediatePropagation();
    if (event.type !== 'keydown') return;
    if (event.key === 'Escape') {
      event.preventDefault();
      if (!popup.hidden) closePopup(true);
      else dismissSurface();
    } else if (event.key === 'Enter' && (event.metaKey || event.ctrlKey) && shadow?.activeElement === question) {
      event.preventDefault();
      submitSelection('custom', question.value);
    }
  }

  function showShortcut(nextSnapshot) {
    ensureSurface();
    clearSelectionHighlight();
    snapshot = nextSnapshot;
    popup.hidden = true;
    question.value = '';
    includePageContext.checked = true;
    sendButton.disabled = true;
    shortcut.hidden = false;
    positionShortcut();
  }

  async function openPopup() {
    if (!snapshot || submitting) return;
    if (!localization) await refreshLocalization(interfaceLanguage);
    if (!snapshot || submitting) return;
    ensureSurface();
    applyLocalization();
    popup.hidden = false;
    popup.style.visibility = 'hidden';
    positionPopup();
    popup.style.visibility = '';
    showSelectionHighlight();
    shadow.querySelector('[data-action="summarize"]')?.focus();
  }

  function closePopup(restoreFocus) {
    if (!popup) return;
    popup.hidden = true;
    question.value = '';
    includePageContext.checked = true;
    sendButton.disabled = true;
    clearSelectionHighlight();
    if (restoreFocus && shortcut && !shortcut.hidden) shortcut.focus();
  }

  function dismissSurface() {
    clearSelectionHighlight();
    snapshot = null;
    if (shortcut) shortcut.hidden = true;
    if (popup) popup.hidden = true;
    if (question) question.value = '';
    if (includePageContext) includePageContext.checked = true;
    if (sendButton) sendButton.disabled = true;
  }

  function destroySurface() {
    hideToast();
    host?.remove();
    host = shadow = highlightLayer = shortcut = popup = question = includePageContext = sendButton = toast = null;
    snapshot = null;
  }

  function hideToast() {
    clearTimeout(toastTimer);
    toastTimer = null;
    if (toast) toast.hidden = true;
  }

  function showToast(message) {
    if (suppressed) return;
    ensureSurface();
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      if (toast) toast.hidden = true;
      toastTimer = null;
    }, 3800);
  }

  async function submitSelection(action, customQuestion = '', language = '') {
    if (submitting || !snapshot?.text) return;
    if (action === 'custom' && !String(customQuestion || '').trim()) return;
    if (action === 'translate' && !isSupportedTranslationLanguage(language)) return;
    const request = {
      ...SUBMIT_FIELDS,
      type: SUBMIT_MESSAGE,
      action,
      selectionText: snapshot.text,
      question: action === 'custom' ? String(customQuestion).trim() : undefined,
      ...(action === 'custom' ? { includePageContext: includePageContext?.checked === true } : {}),
      language: action === 'custom' ? undefined : (language || interfaceLanguage),
    };
    submitting = true;
    dismissSurface();
    try {
      const response = await api.runtime.sendMessage(request);
      if (!response?.ok) throw new Error(response?.error || 'Selection request was not accepted.');
      if (response.requiresManualOpen) showToast(localization?.strings.sentManual || 'Sent to WebBrain. Open the sidebar if it does not start.');
    } catch {
      showToast(localization?.strings.sendFailed || 'Could not send to WebBrain. Try the right-click menu instead.');
    } finally {
      submitting = false;
    }
  }

  function disableShortcut() {
    enabled = false;
    destroySurface();
    Promise.resolve(api.storage.local.set({ [STORAGE_KEY]: false })).catch(() => {});
  }

  function refreshFromSelection() {
    clearTimeout(selectionTimer);
    selectionTimer = setTimeout(() => {
      const next = readSelection();
      if (next) showShortcut(next);
      else if (!shadow?.activeElement && !interacting) dismissSurface();
    }, 0);
  }

  document.addEventListener('pointerup', (event) => {
    if (!event.composedPath?.().includes(host)) refreshFromSelection();
  }, true);
  document.addEventListener('keyup', (event) => {
    if (!event.composedPath?.().includes(host)) refreshFromSelection();
  }, true);
  document.addEventListener('pointerdown', (event) => {
    if (host && !event.composedPath?.().includes(host)) dismissSurface();
  }, true);
  document.addEventListener('selectionchange', () => {
    if (!interacting && !shadow?.activeElement) refreshFromSelection();
  });
  window.addEventListener('scroll', (event) => {
    if (!event.composedPath?.().includes(host)) dismissSurface();
  }, true);
  window.addEventListener('resize', dismissSurface);
  window.addEventListener('keydown', containSurfaceKeyboardEvent, true);
  window.addEventListener('keypress', containSurfaceKeyboardEvent, true);
  window.addEventListener('keyup', containSurfaceKeyboardEvent, true);

  api.runtime.onMessage.addListener((message) => {
    if (message?.type === 'WB_HIDE_FOR_TOOL_USE') {
      suppressed = true;
      hideToast();
      dismissSurface();
    } else if (message?.type === 'WB_SHOW_AFTER_TOOL_USE') {
      suppressed = false;
    }
  });
  api.storage.onChanged?.addListener?.((changes, area) => {
    if (area !== 'local') return;
    if (changes[STORAGE_KEY]) {
      enabled = changes[STORAGE_KEY].newValue !== false;
      if (!enabled) destroySurface();
    }
    if (changes[LOCALE_STORAGE_KEY]) void refreshLocalization(changes[LOCALE_STORAGE_KEY].newValue);
  });
  Promise.resolve(api.storage.local.get({ [STORAGE_KEY]: true, [LOCALE_STORAGE_KEY]: '' }))
    .then((stored) => {
      enabled = stored?.[STORAGE_KEY] !== false;
      void refreshLocalization(stored?.[LOCALE_STORAGE_KEY]);
      if (!enabled) destroySurface();
    })
    .catch(() => { enabled = true; });

  // Isolated-world diagnostic hook used by deterministic browser fixtures.
  window.__webbrainSelectionShortcut = {
    refreshFromSelection,
    openPopup,
    submitPreset: (action) => submitSelection(action, '', interfaceLanguage),
    submitCustom: (value) => submitSelection('custom', value),
    setIncludePageContext: (value) => {
      if (includePageContext) includePageContext.checked = value === true;
    },
    hideShortcut: disableShortcut,
    getState: () => ({
      enabled,
      suppressed,
      submitting,
      interfaceLanguage,
      hasSelection: !!snapshot?.text,
      shortcutVisible: !!shortcut && !shortcut.hidden,
      popupVisible: !!popup && !popup.hidden,
      highlightRectCount: highlightLayer?.childElementCount || 0,
      toastVisible: !!toast && !toast.hidden,
      shortcutRect: shortcut && !shortcut.hidden ? shortcut.getBoundingClientRect().toJSON() : null,
      selectionRect: snapshot?.rect || null,
      selectionBottom: snapshot ? getVisibleSelectionBottom() : null,
      shortcutLabel: shortcut?.getAttribute('aria-label') || '',
      shortcutBackground: shortcut ? getComputedStyle(shortcut).backgroundColor : '',
      shortcutColor: shortcut ? getComputedStyle(shortcut).color : '',
      shortcutBoxShadow: shortcut ? getComputedStyle(shortcut).boxShadow : '',
      summarizeRect: popup && !popup.hidden
        ? shadow.querySelector('[data-action="summarize"]')?.getBoundingClientRect().toJSON() || null
        : null,
      translateRect: popup && !popup.hidden
        ? shadow.querySelector('[data-action="translate"]')?.getBoundingClientRect().toJSON() || null
        : null,
      hideRect: popup && !popup.hidden
        ? shadow.querySelector('.hide')?.getBoundingClientRect().toJSON() || null
        : null,
      questionRect: popup && !popup.hidden ? question?.getBoundingClientRect().toJSON() || null : null,
      questionValue: question?.value || '',
      includePageContextChecked: includePageContext?.checked === true,
      includePageContextLabel: shadow?.querySelector('.context-option span')?.textContent || '',
      hideLabel: shadow?.querySelector('.hide')?.textContent || '',
      actionIconCount: shadow?.querySelectorAll('.action > .action-icon').length || 0,
      direction: host?.dir || 'ltr',
      summarizeLabel: shadow?.querySelector('[data-action="summarize"] .action-label')?.textContent || '',
      explainLabel: shadow?.querySelector('[data-action="explain"] .action-label')?.textContent || '',
      quizLabel: shadow?.querySelector('[data-action="quiz"] .action-label')?.textContent || '',
    }),
  };
})();
