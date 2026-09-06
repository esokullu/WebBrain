// Browser-free normalization and comparison helpers for the direct-message
// recipient guard. This file is mirrored in the Firefox tree; keep both copies
// byte-identical.

export const MESSAGE_TARGET_KINDS = new Set(['named', 'active_conversation']);
export const MESSAGE_RECIPIENT_ROLES = new Set(['to', 'cc', 'bcc']);

function compact(value, max = 200) {
  return String(value ?? '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/[\u200b-\u200d\ufeff]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

export function normalizeMessageTarget(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const targetKind = String(value.target_kind || '').trim();
  if (!MESSAGE_TARGET_KINDS.has(targetKind)) return null;
  if (targetKind === 'active_conversation') {
    return { target_kind: targetKind, recipients: [] };
  }
  const recipients = new Map();
  const rawRecipients = Array.isArray(value.recipients)
    ? value.recipients
    : [value.recipient];
  for (const value of rawRecipients.slice(0, 16)) {
    const legacy = typeof value === 'string' || typeof value === 'number';
    const identity = compact(legacy ? value : (value?.identity ?? value?.recipient), 240);
    const role = compact(legacy ? 'to' : value?.role, 12).toLowerCase();
    const normalized = normalizeRecipientIdentity(identity);
    const key = `${role}:${normalized}`;
    if (identity && normalized && MESSAGE_RECIPIENT_ROLES.has(role) && !recipients.has(key)) {
      recipients.set(key, { identity, role });
    }
  }
  return recipients.size
    ? { target_kind: targetKind, recipients: [...recipients.values()] }
    : null;
}

export function normalizeRecipientIdentity(value) {
  const text = compact(value, 240);
  if (!text) return '';
  try {
    return text.normalize('NFKC').toLocaleLowerCase();
  } catch {
    return text.toLowerCase();
  }
}

export function recipientMatchesObservedIdentity(recipient, observedIdentity) {
  const expected = normalizeRecipientIdentity(recipient);
  const observed = normalizeRecipientIdentity(observedIdentity);
  return !!expected && observed === expected;
}

const IDENTITY_WORD_CHAR = /[\p{L}\p{N}]/u;

/**
 * Return all start/end spans where normalizedIdentity occurs in normalizedAnswer
 * at word boundaries, or as an exact full-string match for short identities (< 3 chars).
 */
export function findCandidateAnswerSpans(normalizedAnswer, normalizedIdentity) {
  const answer = normalizeRecipientIdentity(normalizedAnswer);
  const identity = normalizeRecipientIdentity(normalizedIdentity);
  if (!identity || !answer) return [];
  if (identity.length < 3) {
    return answer === identity ? [{ start: 0, end: answer.length }] : [];
  }
  const spans = [];
  for (let at = answer.indexOf(identity); at >= 0; at = answer.indexOf(identity, at + 1)) {
    const before = at > 0 ? answer[at - 1] : '';
    const after = answer[at + identity.length] || '';
    if (!IDENTITY_WORD_CHAR.test(before) && !IDENTITY_WORD_CHAR.test(after)) {
      spans.push({ start: at, end: at + identity.length });
    }
  }
  return spans;
}

/**
 * Does the user's answer actually name this identity, rather than merely
 * containing its letters?
 *
 * A bare substring test authorizes on accidents: the observed display name
 * "Ann" is inside "I cannot decide". Requiring the match to sit against a
 * non-alphanumeric neighbour or a string edge keeps an incidental fragment
 * from standing in for the user naming someone. Identities shorter than 3
 * characters accept exact equality to authorize short names without loose
 * substring false positives.
 */
export function answerNamesIdentity(normalizedAnswer, normalizedIdentity) {
  return findCandidateAnswerSpans(normalizedAnswer, normalizedIdentity).length > 0;
}

/**
 * Verify that each observed recipient identity is matched by a distinct,
 * non-overlapping span in the user's answer.
 *
 * When one observed identity is a boundary-delimited prefix of another
 * (e.g. "Ann" and "Ann Smith", or "user@example.co" and "user@example.co.uk"),
 * a single mention must not satisfy both candidates. A distinct span is
 * required for each observed recipient identity.
 */
export function answerNamesAllObservedRecipients(normalizedAnswer, observedCandidates) {
  const answer = normalizeRecipientIdentity(normalizedAnswer);
  if (!answer || !Array.isArray(observedCandidates) || observedCandidates.length === 0) {
    return false;
  }
  const uniqueIdentities = [...new Set(
    observedCandidates
      .map(c => normalizeRecipientIdentity(typeof c === 'string' ? c : (c?.identity ?? c?.recipient)))
      .filter(Boolean)
  )];
  if (uniqueIdentities.length === 0) return false;

  const candidateSpans = [];
  for (const identity of uniqueIdentities) {
    const spans = findCandidateAnswerSpans(answer, identity);
    if (spans.length === 0) return false;
    candidateSpans.push(spans);
  }

  function search(index, usedSpans) {
    if (index >= candidateSpans.length) return true;
    for (const span of candidateSpans[index]) {
      const overlaps = usedSpans.some(used => !(span.end <= used.start || used.end <= span.start));
      if (!overlaps) {
        usedSpans.push(span);
        if (search(index + 1, usedSpans)) return true;
        usedSpans.pop();
      }
    }
    return false;
  }

  return search(0, []);
}

export function messageTargetMatchesObservedIdentities(target, candidates) {
  const normalizedTarget = normalizeMessageTarget(target);
  const recipients = new Map();
  for (const value of (Array.isArray(candidates) ? candidates : []).slice(0, 16)) {
    const legacy = typeof value === 'string' || typeof value === 'number';
    const identity = compact(legacy ? value : (value?.identity ?? value?.recipient), 240);
    const role = compact(legacy ? 'to' : value?.role, 12).toLowerCase();
    const normalized = normalizeRecipientIdentity(identity);
    const key = `${role}:${normalized}`;
    if (identity && normalized && MESSAGE_RECIPIENT_ROLES.has(role) && !recipients.has(key)) {
      recipients.set(key, { identity, role });
    }
  }
  if (!normalizedTarget) return false;
  // active_conversation is planner intent, not a dispatch-time identity. A
  // protected adapter must pin it to a concrete named identity before tools
  // run; accepting any later conversation would authorize retargeting.
  if (normalizedTarget.target_kind === 'active_conversation') return false;
  const expected = new Set(normalizedTarget.recipients.map(recipient => (
    `${recipient.role}:${normalizeRecipientIdentity(recipient.identity)}`
  )));
  return expected.size === recipients.size
    && [...expected].every(key => recipients.has(key));
}
