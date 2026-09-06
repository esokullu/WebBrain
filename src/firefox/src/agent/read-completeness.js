const COMPLETE_THREAD_ACTIONS = new Set(['summarize-thread', 'find-followups']);
const READ_SCOPES = new Set(['complete_thread', 'current_message', 'visible_page', 'none']);
export const STANDARD_TREE_PAGE_CHARS = 6000;
export const EXPANDED_TREE_PAGE_CHARS = 12000;
export const STANDARD_TOOL_RESULT_CHARS = 8000;
export const EXPANDED_TOOL_RESULT_CHARS = 16000;
export const EXPANDED_READ_CONTEXT_TOKENS = 65536;
const EMAIL_ADAPTERS = new Set(['gmail', 'yahoo-mail', 'proton-mail', 'fastmail', 'zoho-mail', 'yandex-mail', 'outlook']);
const EMAIL_HOST_RE = /(^|\.)(mail\.google\.com|gmail\.com|outlook\.live\.com|outlook\.office\.com|outlook\.office365\.com|mail\.yahoo\.com|icloud\.com|proton\.me|protonmail\.com|fastmail\.com|hey\.com|mail\.zoho\.com|mail\.yandex\.[a-z.]+)$/i;
const DM_HOST_RE = /(^|\.)(instagram\.com|x\.com|twitter\.com|facebook\.com|messenger\.com|threads\.net|reddit\.com|linkedin\.com|discord\.com|slack\.com|web\.whatsapp\.com|messages\.google\.com|web\.telegram\.org)$/i;

function isGmailThreadIdentifier(value = '') {
  const segment = String(value || '').split('?')[0];
  return /^FMfc[A-Za-z0-9_-]+$/.test(segment) || /^[a-f0-9]{12,}$/i.test(segment);
}

function isGmailConversationHash(hash = '') {
  const segments = String(hash || '').replace(/^#/, '').split('/').filter(Boolean);
  const route = String(segments[0] || '').toLowerCase();
  const threadId = segments.at(-1);
  if (!isGmailThreadIdentifier(threadId)) return false;
  if (route === 'label') {
    // Label names may contain slashes and may themselves look like legacy
    // hexadecimal thread IDs. Only Gmail's unambiguous modern ID prefix can
    // terminate a variable-depth label conversation route.
    return segments.length >= 3 && /^FMfc[A-Za-z0-9_-]+$/.test(threadId);
  }
  if (route === 'search' || route === 'category') return segments.length === 3;
  return segments.length === 2;
}

export function normalizeReadScope(value) {
  const scope = String(value || '').trim();
  return READ_SCOPES.has(scope) ? scope : null;
}

export function readWindowLimits(promptTier = 'full', contextWindow = 0) {
  const tokens = Number(contextWindow);
  const expanded = promptTier !== 'compact'
    && Number.isFinite(tokens)
    && tokens >= EXPANDED_READ_CONTEXT_TOKENS;
  return {
    expanded,
    treePageChars: expanded ? EXPANDED_TREE_PAGE_CHARS : STANDARD_TREE_PAGE_CHARS,
    toolResultChars: expanded ? EXPANDED_TOOL_RESULT_CHARS : STANDARD_TOOL_RESULT_CHARS,
  };
}

export function isCommunicationThreadContext(url = '', adapterName = '') {
  let parsed;
  try {
    parsed = new URL(String(url || ''));
  } catch {
    return false;
  }

  const host = parsed.hostname.replace(/^www\./i, '');
  const route = `${parsed.pathname || '/'}${parsed.search || ''}${parsed.hash || ''}`;
  const adapter = String(adapterName || '').trim().toLowerCase();
  if (EMAIL_HOST_RE.test(host) || EMAIL_ADAPTERS.has(adapter)) {
    if (/(?:^|\.)google\.com$/i.test(host) || host === 'gmail.com') {
      return isGmailConversationHash(parsed.hash);
    }
    return /(?:^|[/?#])(?:messages?|message|thread|conversation|id|p)(?:[/?#])[^/?#\s]+/i.test(route)
      || /(?:^|[/?#])(?:inbox|sent|all|archive|folders?|labels?)(?:[/?#])[^/?#\s]+/i.test(route);
  }

  if (!DM_HOST_RE.test(host)) return false;
  return /(?:^|[/?#])(?:client|channels)(?:[/?#][^/?#\s]+){2,}/i.test(route)
    || /(?:^|[/?#])(?:direct|messaging)(?:[/?#][^/?#\s]+){2,}/i.test(route)
    || /(?:^|[/?#])(?:messages?|chat|chats|dm|conversation|conversations|t)(?:[/?#])[^/?#\s]+/i.test(route);
}

export function requiresCompleteThreadRead(_userMessage, runOptions = {}) {
  const recommendedId = String(runOptions?.recommendedAction?.id || '').trim();
  return COMPLETE_THREAD_ACTIONS.has(recommendedId);
}

export function plannerRequiresCompleteThreadRead(plan = null) {
  return plan?.request_kind === 'execute'
    && normalizeReadScope(plan.read_scope) === 'complete_thread';
}

export function createReadCompletenessState(runToken = '', required = false, communicationThread = false, adapterName = '') {
  const adapter = String(adapterName || '').trim().toLowerCase();
  return {
    runToken: String(runToken || ''),
    communicationThread: communicationThread === true,
    adapterName: adapter,
    required: required === true,
    sawEligibleRead: false,
    complete: required !== true,
    treeCoverageComplete: required !== true,
    requiresExpansionEvidence: adapter === 'gmail',
    expansionConfirmed: false,
    treeKey: '',
    treePages: [],
    treeTerminalPage: null,
    conversationRootRefId: '',
    coverageRevision: 0,
    pendingTool: '',
    continuationArgs: null,
  };
}

export function requirePlannerReadCompleteness(state, plan = null) {
  const current = state || createReadCompletenessState();
  if (!current.communicationThread || current.required || !plannerRequiresCompleteThreadRead(plan)) return current;
  return {
    ...current,
    required: true,
    complete: false,
    sawEligibleRead: false,
    treeCoverageComplete: false,
    expansionConfirmed: false,
    treeKey: '',
    treePages: [],
    treeTerminalPage: null,
    conversationRootRefId: '',
    coverageRevision: Number(current.coverageRevision || 0),
    pendingTool: '',
    continuationArgs: null,
  };
}

function normalizedTreePage(args, result) {
  const rawPage = Number(result?.page ?? args?.page ?? 1);
  return Number.isFinite(rawPage) && rawPage >= 1 ? Math.trunc(rawPage) : 1;
}

function normalizedTreeMaxChars(args) {
  const maxChars = Number(args?.maxChars);
  return Number.isFinite(maxChars) && maxChars > 0 ? Math.trunc(maxChars) : STANDARD_TREE_PAGE_CHARS;
}

function updateExpansionEvidence(state, result) {
  let expansionConfirmed = state.expansionConfirmed === true;
  let expansionChanged = false;
  const observed = result?.conversationExpansionState;
  // 'not_applicable' means Gmail exposed no expansion control at all, which is
  // what a single-message thread looks like. Nothing is collapsed there, so the
  // coverage requirement is already met and demanding an Expand all click would
  // block completion on a thread that was fully read.
  if (observed === 'expanded' || observed === 'not_applicable') {
    expansionChanged = expansionConfirmed !== true;
    expansionConfirmed = true;
  } else if (observed === 'collapsed') {
    expansionChanged = expansionConfirmed !== false;
    expansionConfirmed = false;
  }
  return { expansionConfirmed, expansionChanged };
}

function normalizedTreeScope(args = {}) {
  const page = normalizedTreePage(args, null);
  return {
    filter: String(args?.filter || 'all'),
    maxDepth: args?.maxDepth == null ? 15 : Number(args.maxDepth),
    maxChars: normalizedTreeMaxChars(args),
    ref_id: typeof args?.ref_id === 'string' ? args.ref_id.trim() : '',
    page,
    // Page 1 always starts a fresh snapshot. Models sometimes carry the
    // previous document/subtree revision into a restart; treating that opaque
    // value as part of the page-1 scope makes every otherwise valid restart
    // look non-sequential and traps complete-thread reads in a retry loop.
    tree_revision: page > 1 && typeof args?.tree_revision === 'string'
      ? args.tree_revision.trim()
      : '',
  };
}

function sameTreeScope(left, right) {
  return JSON.stringify(normalizedTreeScope(left)) === JSON.stringify(normalizedTreeScope(right));
}

function restartGmailRootDiscovery(state) {
  return {
    ...state,
    sawEligibleRead: false,
    complete: false,
    treeCoverageComplete: false,
    expansionConfirmed: false,
    treeKey: '',
    treePages: [],
    treeTerminalPage: null,
    conversationRootRefId: '',
    pendingTool: '',
    continuationArgs: null,
  };
}

function gmailAccessibilityTreeState(state, args, result) {
  const requestedRefId = typeof args?.ref_id === 'string' ? args.ref_id.trim() : '';
  const requestedPage = normalizedTreePage(args, null);
  const requestedTreeRevision = requestedPage > 1 && typeof args?.tree_revision === 'string'
    ? args.tree_revision.trim()
    : '';
  const resultRootRefId = typeof result?.conversationRootRefId === 'string'
    ? result.conversationRootRefId.trim()
    : '';
  const resultTreeRevision = typeof result?.treeRevision === 'string'
    ? result.treeRevision.trim()
    : '';
  const previousRootRefId = state.conversationRootRefId;
  if (!resultRootRefId && previousRootRefId && (
    requestedRefId === previousRootRefId
    || (!result?.error && typeof result?.pageContent === 'string')
  )) return restartGmailRootDiscovery(state);
  if (!resultRootRefId) return state;
  const currentRootRefId = resultRootRefId;

  const rootChanged = !!previousRootRefId && previousRootRefId !== currentRootRefId;
  const trustedThreadRead = requestedRefId === currentRootRefId;
  const expansionEvidenceState = rootChanged
    ? { ...state, expansionConfirmed: false }
    : state;
  const { expansionConfirmed, expansionChanged } = updateExpansionEvidence(expansionEvidenceState, result);
  const expandedAfterCollapsed = state.expansionConfirmed === false
    && result?.conversationExpansionState === 'expanded';
  const resetCoverage = rootChanged || expandedAfterCollapsed;
  const maxChars = normalizedTreeMaxChars(args);
  const startArgs = {
    filter: 'all',
    maxDepth: 15,
    maxChars,
    ref_id: currentRootRefId,
    page: 1,
  };

  const revisionMismatch = trustedThreadRead
    && !!requestedTreeRevision
    && requestedTreeRevision !== resultTreeRevision;
  const revisionMissing = trustedThreadRead && !resultTreeRevision;
  if (revisionMismatch || revisionMissing) {
    return {
      ...state,
      sawEligibleRead: true,
      complete: false,
      treeCoverageComplete: false,
      expansionConfirmed,
      treeKey: '',
      treePages: [],
      treeTerminalPage: null,
      conversationRootRefId: currentRootRefId,
      coverageRevision: Number(state.coverageRevision || 0) + (expansionChanged ? 1 : 0),
      pendingTool: 'get_accessibility_tree',
      continuationArgs: startArgs,
    };
  }
  if (result?.error || typeof result?.pageContent !== 'string') return state;

  if (!trustedThreadRead) {
    const discoveredRoot = !previousRootRefId && !!currentRootRefId;
    return {
      ...state,
      sawEligibleRead: true,
      complete: false,
      treeCoverageComplete: false,
      expansionConfirmed,
      treeKey: resetCoverage ? '' : state.treeKey,
      treePages: resetCoverage ? [] : state.treePages,
      treeTerminalPage: resetCoverage ? null : state.treeTerminalPage,
      conversationRootRefId: currentRootRefId,
      coverageRevision: Number(state.coverageRevision || 0)
        + (discoveredRoot || expansionChanged ? 1 : 0),
      pendingTool: 'get_accessibility_tree',
      continuationArgs: startArgs,
    };
  }

  const filter = String(args?.filter || 'all');
  const maxDepth = args?.maxDepth == null ? 15 : Number(args.maxDepth);
  if (filter !== 'all' || !Number.isFinite(maxDepth) || maxDepth < 15) {
    return {
      ...state,
      sawEligibleRead: true,
      complete: false,
      treeCoverageComplete: resetCoverage ? false : state.treeCoverageComplete,
      expansionConfirmed,
      treeKey: resetCoverage ? '' : state.treeKey,
      treePages: resetCoverage ? [] : state.treePages,
      treeTerminalPage: resetCoverage ? null : state.treeTerminalPage,
      conversationRootRefId: currentRootRefId,
      coverageRevision: Number(state.coverageRevision || 0) + (expansionChanged ? 1 : 0),
      pendingTool: 'get_accessibility_tree',
      continuationArgs: startArgs,
    };
  }

  const expectedArgs = resetCoverage
    ? startArgs
    : state.pendingTool === 'get_accessibility_tree' && state.continuationArgs
      ? state.continuationArgs
      : startArgs;
  if (!sameTreeScope(args, expectedArgs)) {
    return {
      ...state,
      sawEligibleRead: true,
      complete: false,
      treeCoverageComplete: resetCoverage ? false : state.treeCoverageComplete,
      expansionConfirmed,
      treeKey: resetCoverage ? '' : state.treeKey,
      treePages: resetCoverage ? [] : state.treePages,
      treeTerminalPage: resetCoverage ? null : state.treeTerminalPage,
      conversationRootRefId: currentRootRefId,
      coverageRevision: Number(state.coverageRevision || 0) + (expansionChanged ? 1 : 0),
      pendingTool: 'get_accessibility_tree',
      continuationArgs: expectedArgs,
    };
  }

  const page = normalizedTreePage(args, result);
  const treeKey = resultTreeRevision
    ? `gmail|${currentRootRefId}|${resultTreeRevision}|${maxDepth}|${maxChars}`
    : '';
  const treeChanged = !!(treeKey && state.treeKey && treeKey !== state.treeKey);
  if (treeChanged && page > 1) {
    return {
      ...state,
      sawEligibleRead: true,
      complete: false,
      treeCoverageComplete: false,
      expansionConfirmed,
      treeKey: '',
      treePages: [],
      treeTerminalPage: null,
      conversationRootRefId: currentRootRefId,
      coverageRevision: Number(state.coverageRevision || 0) + (expansionChanged ? 1 : 0),
      pendingTool: 'get_accessibility_tree',
      continuationArgs: startArgs,
    };
  }
  const resetPages = resetCoverage || treeChanged;
  const pages = new Set(resetPages ? [] : state.treePages);
  const addedPage = !pages.has(page);
  pages.add(page);

  const paged = result.hasMore === true
    || result.truncated === true
    || result.page != null
    || args?.page != null;
  let terminalPage = resetPages ? null : state.treeTerminalPage;
  if (paged && result.hasMore !== true && result.truncated !== true) terminalPage = page;
  const pagesComplete = Number.isInteger(terminalPage)
    && terminalPage >= 1
    && Array.from({ length: terminalPage }, (_, index) => index + 1).every(item => pages.has(item));
  const treeCoverageComplete = !paged || pagesComplete;
  const complete = treeCoverageComplete
    && (state.requiresExpansionEvidence !== true || expansionConfirmed);
  const nextPage = result.nextPage == null ? Number.NaN : Number(result.nextPage);
  const fallbackContinuation = result.hasMore === true && Number.isFinite(nextPage)
    ? {
        filter: 'all',
        maxDepth,
        maxChars,
        ref_id: currentRootRefId,
        page: Math.trunc(nextPage),
        tree_revision: resultTreeRevision,
      }
    : null;

  return {
    ...state,
    sawEligibleRead: true,
    complete: state.complete || complete,
    treeCoverageComplete,
    expansionConfirmed,
    treeKey: treeKey || state.treeKey,
    treePages: [...pages].sort((a, b) => a - b),
    treeTerminalPage: terminalPage,
    conversationRootRefId: currentRootRefId,
    coverageRevision: Number(state.coverageRevision || 0)
      + (addedPage || expansionChanged ? 1 : 0),
    pendingTool: complete ? '' : 'get_accessibility_tree',
    continuationArgs: complete ? null : (result.continuationArgs || fallbackContinuation),
  };
}

function documentAccessibilityTreeState(state, args, result) {
  const filter = String(args?.filter || 'all');
  const maxDepth = args?.maxDepth == null ? 15 : Number(args.maxDepth);
  if (filter !== 'all' || args?.ref_id || !Number.isFinite(maxDepth) || maxDepth < 15 || result?.error || typeof result?.pageContent !== 'string') return state;

  const page = normalizedTreePage(args, result);
  const maxChars = normalizedTreeMaxChars(args);
  const totalChars = result.totalChars == null ? Number.NaN : Number(result.totalChars);
  const treeKey = Number.isFinite(totalChars)
    ? `${totalChars}|${maxDepth}|${maxChars}`
    : '';
  const resetPages = treeKey && state.treeKey && treeKey !== state.treeKey;
  const pages = new Set(resetPages ? [] : state.treePages);
  pages.add(page);

  const paged = result.hasMore === true
    || result.truncated === true
    || result.page != null
    || args?.page != null;
  let terminalPage = resetPages ? null : state.treeTerminalPage;
  if (paged && result.hasMore !== true && result.truncated !== true) terminalPage = page;
  const pagesComplete = Number.isInteger(terminalPage)
    && terminalPage >= 1
    && Array.from({ length: terminalPage }, (_, index) => index + 1).every(item => pages.has(item));
  const treeCoverageComplete = !paged || pagesComplete;
  const { expansionConfirmed } = updateExpansionEvidence(state, result);
  const complete = treeCoverageComplete
    && (state.requiresExpansionEvidence !== true || expansionConfirmed);
  const nextPage = result.nextPage == null ? Number.NaN : Number(result.nextPage);
  const fallbackContinuation = result.hasMore === true && Number.isFinite(nextPage)
    ? {
        filter: 'all',
        maxDepth,
        maxChars,
        page: Math.trunc(nextPage),
      }
    : null;

  return {
    ...state,
    sawEligibleRead: true,
    complete: state.complete || complete,
    treeCoverageComplete,
    expansionConfirmed,
    treeKey: treeKey || state.treeKey,
    treePages: [...pages].sort((a, b) => a - b),
    treeTerminalPage: terminalPage,
    // Only Gmail's anchored path validates exact sequential continuations.
    // Generic document pages retain their coverage bookkeeping, but must not
    // bypass the delivery checkpoint merely by using new page numbers.
    coverageRevision: Number(state.coverageRevision || 0),
    pendingTool: complete ? '' : 'get_accessibility_tree',
    continuationArgs: complete ? null : (result.continuationArgs || fallbackContinuation),
  };
}

function accessibilityTreeState(state, args, result) {
  if (state.adapterName === 'gmail') return gmailAccessibilityTreeState(state, args, result);
  return documentAccessibilityTreeState(state, args, result);
}

export function recordReadCompleteness(state, toolName, args = {}, result = null) {
  const current = state || createReadCompletenessState();
  if (!current.required || current.complete) return current;
  if (toolName === 'get_accessibility_tree') return accessibilityTreeState(current, args, result);
  return current;
}

export function readCompletenessMadeProgress(beforeState, afterState) {
  if (!beforeState?.required || !afterState?.required) return false;
  if (beforeState.adapterName !== 'gmail' || afterState.adapterName !== 'gmail') return false;
  return Number(afterState.coverageRevision || 0) > Number(beforeState.coverageRevision || 0);
}

export function readCompletenessLimitation(state, mode = 'ask') {
  if (
    mode !== 'ask'
    || !state?.required
    || state.complete
    || state.requiresExpansionEvidence !== true
    || state.treeCoverageComplete !== true
    || state.expansionConfirmed === true
  ) return null;
  return 'I could not verify the complete Gmail conversation because one or more messages may still be collapsed, and Ask mode cannot expand them. Expand all messages in Gmail and retry, or switch to Act mode so WebBrain can expand the conversation before reading it.';
}

export function readCompletenessBlock(state, treePageChars = STANDARD_TREE_PAGE_CHARS, options = {}) {
  if (!state?.required || state.complete) return null;
  const requestedTreePageChars = Number(treePageChars) === EXPANDED_TREE_PAGE_CHARS
    ? EXPANDED_TREE_PAGE_CHARS
    : STANDARD_TREE_PAGE_CHARS;
  const expansionRequired = state.requiresExpansionEvidence === true
    && state.treeCoverageComplete === true
    && state.expansionConfirmed !== true;
  const continuation = expansionRequired
    ? options.mode === 'ask'
      ? ' The root tree is fully paged, but Gmail conversation expansion is not verified. Ask mode cannot expand messages. Report that limitation without claiming complete coverage.'
      : ' The trusted active-thread tree is fully paged, but Gmail conversation expansion is not verified. Activate Gmail\'s top-level Expand all control, then perform a fresh full-depth accessibility-tree read of the trusted active conversation root and verify that Gmail exposes Collapse all before answering.'
    : state.pendingTool && state.continuationArgs
    ? ` Call ${state.pendingTool}(${JSON.stringify(state.continuationArgs)}) exactly, then repeat with each returned continuationArgs while hasMore or truncated is true.`
    : state.sawEligibleRead
      ? ' Continue the full-depth accessibility-tree read from its first missing page and preserve the returned pagination arguments.'
      : ` First call get_accessibility_tree({"filter":"all","maxDepth":15,"maxChars":${requestedTreePageChars}}) from the document root.`;
  return `[COMPLETE THREAD READ REQUIRED: The user explicitly asked for the whole conversation, but the available read coverage is incomplete. Do not answer, summarize, recommend a follow-up, or claim that you reviewed the thread yet.${continuation} Answer only after a terminal result confirms there is no unread remainder.]`;
}
