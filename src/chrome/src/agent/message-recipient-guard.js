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
 * Does the user's answer actually name this identity, rather than merely
 * containing its letters?
 *
 * A bare substring test authorizes on accidents: the observed display name
 * "Ann" is inside "I cannot decide". Requiring the match to sit against a
 * non-alphanumeric neighbour or a string edge keeps an incidental fragment
 * from standing in for the user naming someone. Scripts written without word
 * separators fall back to exact equality, which fails closed rather than
 * guessing where a name ends.
 */
export function answerNamesIdentity(normalizedAnswer, normalizedIdentity) {
  const answer = String(normalizedAnswer || '');
  const identity = String(normalizedIdentity || '');
  if (identity.length < 3 || !answer) return false;
  for (let at = answer.indexOf(identity); at >= 0; at = answer.indexOf(identity, at + 1)) {
    const before = at > 0 ? answer[at - 1] : '';
    const after = answer[at + identity.length] || '';
    if (!IDENTITY_WORD_CHAR.test(before) && !IDENTITY_WORD_CHAR.test(after)) return true;
  }
  return false;
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
