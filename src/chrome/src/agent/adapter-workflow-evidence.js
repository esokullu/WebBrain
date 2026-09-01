/**
 * Bounded v1 completeness rules for adapter workflow inventories.
 *
 * This module is the stop-line for the evidence kernel: form success is the
 * last exhaustive document-root snapshot, not an ever-growing union of
 * site-specific completeness folklore. Jobs that cannot produce that snapshot
 * must keep `requiresLedger: false` and rely on terminal evidence instead.
 *
 * v1 bounds:
 * - Exhaustive means document-root, filter=all, maxDepth >= 15, and the tree
 *   builder did not report truncation (chars, pagination, or depth).
 * - Depth-limited walks set `depthTruncated` only when an omitted descendant
 *   would have been included. A missing flag is treated as not truncated so
 *   mocked tests stay explicit, while production trees always emit the boolean.
 * - Successful reconciliation requires every required inventory row processed.
 *   Skip is allowed only when the inventory item is explicitly `required: false`.
 *   AX and iframe inventories emit `required=true` only for native or
 *   `aria-required="true"` controls, and `required=false` only when
 *   `aria-required="false"`. Missing `required` stays unknown and cannot skip.
 * - Checkbox, radio, click, iframe-click, and successful value mutations
 *   (`type_ax`, `set_field`, `iframe_type`) stale the snapshot.
 *   Screenshots and other generic observations cannot restore completeness.
 * - Fail closed on form-relevant omission. Decorative depth is not truncation.
 *   Empty or erroring third-party frames are omitted only when another frame
 *   already inventoried form controls. If no frame produced controls,
 *   unclassified failed cross-origin frames stay incomplete.
 */

export const WORKFLOW_INVENTORY_EXHAUSTIVE_FILTER = 'all';
export const WORKFLOW_INVENTORY_MIN_MAX_DEPTH = 15;

export const WORKFLOW_FORM_STRUCTURE_TOOLS = Object.freeze([
  'click_ax',
  'click',
  'set_checked',
  'iframe_click',
  'type_ax',
  'set_field',
  'iframe_type',
  // An application that parses an uploaded resume, or reveals questions that
  // depend on the attachment, changes the form the moment the file lands.
  'upload_file',
]);

export function isWorkflowInventoryContinuationPending(result = {}) {
  return result?.hasMore === true
    || result?.truncated === true
    || result?.textTruncated === true
    || result?.depthTruncated === true
    || !!result?.continuationArgs
    || result?.nextPage != null;
}

export function isExhaustiveAccessibilityInventoryRead(args = {}, result = {}) {
  const requestRefId = String(args?.ref_id || args?.continuationArgs?.ref_id || '').trim();
  const requestFilter = String(
    args?.filter || args?.continuationArgs?.filter || WORKFLOW_INVENTORY_EXHAUSTIVE_FILTER,
  ).trim().toLowerCase();
  const requestedMaxDepth = Number(args?.maxDepth ?? args?.continuationArgs?.maxDepth ?? (
    requestFilter === WORKFLOW_INVENTORY_EXHAUSTIVE_FILTER
      ? WORKFLOW_INVENTORY_MIN_MAX_DEPTH
      : 10
  ));
  const exhaustiveRootScope = !requestRefId
    && requestFilter === WORKFLOW_INVENTORY_EXHAUSTIVE_FILTER
    && Number.isFinite(requestedMaxDepth)
    && requestedMaxDepth >= WORKFLOW_INVENTORY_MIN_MAX_DEPTH;
  const continuationPending = isWorkflowInventoryContinuationPending(result);
  return {
    exhaustiveRootScope,
    continuationPending,
    rootReadComplete: exhaustiveRootScope && !continuationPending,
  };
}

export function shouldInvalidateFormInventoryAfterAction(name) {
  return WORKFLOW_FORM_STRUCTURE_TOOLS.includes(String(name || ''));
}

export function invalidateWorkflowInventoryCompleteness(evidence, currentDocumentScope = '') {
  if (!evidence || typeof evidence !== 'object') return evidence;
  // One action can reshape more than one document: an iframe write without a
  // resolvable frame identity may have changed any embedded document.
  const scopes = new Set(
    (Array.isArray(currentDocumentScope) ? currentDocumentScope : [currentDocumentScope])
      .map(value => String(value || ''))
      .filter(Boolean),
  );
  const documents = {};
  for (const [key, document] of Object.entries(evidence.documents || {})) {
    // A structural action only reshapes the documents it ran in. Earlier wizard
    // steps are finished and usually unreachable, so invalidating them would
    // strand the cumulative inventory on a coverage nobody can restore.
    if (scopes.size && !scopes.has(key)) {
      documents[key] = { ...(document || {}) };
      continue;
    }
    // Paged coverage goes with completeness: a mutated document must be read
    // again from its first page, not re-completed from pre-mutation ranges.
    const { coverage, ...rest } = document || {};
    documents[key] = {
      ...rest,
      complete: false,
      // A Next/Continue click reshapes the current step and leaves it behind at
      // the same time. Remember that it was complete so a read of the next
      // document can hand it back as finished history rather than a hole.
      ...(document?.complete === true ? { completeBeforeMutation: true } : {}),
    };
  }
  return {
    ...evidence,
    documents,
    complete: Object.keys(documents).length > 0
      && Object.values(documents).every(document => document.complete === true),
  };
}

// AX formatLine backslash-escapes `\` then `"` inside value="...". Inventory
// readback must consume escaped quotes and restore the app-owned string.
export function parseWorkflowAxQuotedValue(line) {
  const match = /\bvalue="((?:[^"\\]|\\.)*)"/i.exec(String(line || ''));
  if (!match) return undefined;
  return match[1].replace(/\\([\\"])/g, '$1');
}

export function normalizeWorkflowControlLabel(value) {
  let text = String(value ?? '');
  try { text = text.normalize('NFKC'); } catch {}
  return text.toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Words that carry no field identity: the page's optionality decoration and
// the verbs and pronouns a request wraps around the field it names.
const WORKFLOW_LABEL_FILLER_WORDS = new Set([
  'optional', 'required', 'opcional', 'obligatorio', 'facultatif', 'obligatoire',
  'opzionale', 'obbligatorio', 'optionell', 'pflichtfeld', 'zorunlu', 'isteğe', 'bağlı',
  'please', 'kindly', 'attach', 'attaching', 'upload', 'uploading', 'add', 'adding',
  'provide', 'include', 'enter', 'fill', 'set', 'put', 'write', 'answer', 'select',
  'my', 'me', 'i', 'the', 'a', 'an', 'your', 'our', 'this', 'that', 'and', 'or',
  'to', 'in', 'on', 'at', 'of', 'for', 'with', 'as', 'is', 'be', 'field', 'question',
  'box', 'section', 'form', 'file', 'document',
]);

export function workflowControlLabelTokens(value) {
  return normalizeWorkflowControlLabel(value)
    .split(' ')
    .filter(token => token.length > 1 && !WORKFLOW_LABEL_FILLER_WORDS.has(token));
}

// A control the page marks optional can still be something the user asked for.
// The request names it in its own words ("attach my cover letter") while the
// page labels it ("Cover letter (optional)"), so neither string contains the
// other. Compare the content words instead: one side's identity words being
// fully covered by the other's is the match. Whole-string containment stays as
// a fallback for scripts that do not separate words.
export function workflowControlLabelIsRequested(label, requestedLabels = []) {
  const normalized = normalizeWorkflowControlLabel(label);
  if (!normalized) return false;
  const labelTokens = workflowControlLabelTokens(label);
  const labelSet = new Set(labelTokens);
  // A lone content word is a weak claim on a long label: "attach my resume"
  // reduces to "resume", which also appears in "consent to automated resume
  // screening". One token may only name a control the word actually heads.
  const covers = (subset, superset, supersetTokens) => {
    if (!subset.length || !subset.every(token => superset.has(token))) return false;
    if (subset.length > 1) return true;
    return supersetTokens.length <= 2 && supersetTokens[0] === subset[0];
  };
  return (Array.isArray(requestedLabels) ? requestedLabels : []).some((requested) => {
    const wanted = normalizeWorkflowControlLabel(requested);
    if (wanted.length < 3) return false;
    if (normalized === wanted || normalized.includes(wanted) || wanted.includes(normalized)) return true;
    const requestedTokens = workflowControlLabelTokens(requested);
    if (!labelTokens.length || !requestedTokens.length) return false;
    const requestedSet = new Set(requestedTokens);
    return covers(requestedTokens, labelSet, labelTokens)
      || covers(labelTokens, requestedSet, requestedTokens);
  });
}

export function workflowRequiredRowsAreProcessed(
  rows = [],
  inventory = null,
  inventoryItems = [],
  requestedLabels = [],
  requestedLabelsResolved = false,
) {
  const requiredIds = new Set((inventory?.itemIds || []).map(id => String(id)));
  if (!requiredIds.size) return true;
  const items = Array.isArray(inventoryItems) ? inventoryItems : [];
  const optionalIds = new Set(
    items
      .filter(item => item?.required === false
        && !workflowControlLabelIsRequested(item?.label, requestedLabels))
      .map(item => String(item.id || '')),
  );
  // A radio group takes one answer. Its other options are the alternatives
  // that answer rejects, so they can never carry action evidence of their own.
  const radioGroupOf = new Map();
  for (const item of items) {
    if (String(item?.role || '').toLowerCase() !== 'radio') continue;
    // A native group shares one control name; a custom one shares the
    // radiogroup that encloses it. Either way the options are alternatives.
    const name = String(item?.fieldName || '').trim() || String(item?.group || '').trim();
    if (!name) continue;
    radioGroupOf.set(String(item.id || ''), `${String(item.documentScope || '')}|${name}`);
  }
  const answeredGroups = new Set();
  for (const row of (Array.isArray(rows) ? rows : [])) {
    if (String(row?.status || '').toLowerCase() !== 'processed') continue;
    const group = radioGroupOf.get(String(row?.id || ''));
    if (group) answeredGroups.add(group);
  }
  return (Array.isArray(rows) ? rows : []).every((row) => {
    const id = String(row?.id || '');
    if (!requiredIds.has(id)) return true;
    const status = String(row?.status || '').toLowerCase();
    if (status === 'processed') return true;
    if (status !== 'skipped') return false;
    // Skipping is only safe once it is known which controls the request named.
    // A row every answer filled needs no such knowledge, so this only bites
    // where something was actually left out.
    if (optionalIds.has(id)) return requestedLabelsResolved;
    const group = radioGroupOf.get(id);
    return !!group && answeredGroups.has(group);
  });
}
