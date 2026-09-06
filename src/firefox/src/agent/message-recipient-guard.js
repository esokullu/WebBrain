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

export function normalizeRecipientAnswer(value) {
  const text = String(value ?? '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/[\u200b-\u200d\ufeff]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
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

let cachedWordSegmenter = null;

function getWordSegmenter() {
  if (cachedWordSegmenter) return cachedWordSegmenter;
  if (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
    try {
      cachedWordSegmenter = new Intl.Segmenter(undefined, { granularity: 'word' });
    } catch {
      cachedWordSegmenter = null;
    }
  }
  return cachedWordSegmenter;
}

export function getWordBoundaries(text) {
  const boundaries = new Set([0, text.length]);
  const segmenter = getWordSegmenter();
  if (segmenter) {
    try {
      for (const seg of segmenter.segment(text)) {
        boundaries.add(seg.index);
        boundaries.add(seg.index + seg.segment.length);
      }
    } catch {
      // fallback
    }
  }
  return boundaries;
}

/**
 * Return all start/end spans where normalizedIdentity occurs in normalizedAnswer
 * at word boundaries (including script-aware segmentation for unsegmented scripts),
 * or as an exact full-string match for short identities (< 3 chars).
 */
export function findCandidateAnswerSpans(normalizedAnswer, normalizedIdentity) {
  const answer = normalizeRecipientAnswer(normalizedAnswer);
  const identity = normalizeRecipientIdentity(normalizedIdentity);
  if (!identity || !answer) return [];
  if (identity.length < 3) {
    return answer === identity ? [{ start: 0, end: answer.length }] : [];
  }
  const boundaries = getWordBoundaries(answer);
  const spans = [];
  for (let at = answer.indexOf(identity); at >= 0; at = answer.indexOf(identity, at + 1)) {
    const end = at + identity.length;
    const before = at > 0 ? answer[at - 1] : '';
    const after = answer[end] || '';
    const charBoundary = (!before || !IDENTITY_WORD_CHAR.test(before))
      && (!after || !IDENTITY_WORD_CHAR.test(after));
    const segmentBoundary = boundaries.has(at) && boundaries.has(end);
    if (charBoundary || segmentBoundary) {
      spans.push({ start: at, end });
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
  const answer = normalizeRecipientAnswer(normalizedAnswer);
  if (!answer || !Array.isArray(observedCandidates) || observedCandidates.length === 0) {
    return false;
  }
  const candidateGroups = [];
  const seenCanonical = new Set();
  for (const c of observedCandidates) {
    const canonical = normalizeRecipientIdentity(typeof c === 'string' ? c : (c?.identity ?? c?.recipient));
    if (!canonical || seenCanonical.has(canonical)) continue;
    seenCanonical.add(canonical);
    const aliasList = [
      canonical,
      ...(Array.isArray(c?.aliases) ? c.aliases.map(normalizeRecipientIdentity) : []),
    ].filter(Boolean);
    candidateGroups.push([...new Set(aliasList)]);
  }
  if (candidateGroups.length === 0) return false;

  const candidateSpans = [];
  for (const aliases of candidateGroups) {
    const spans = [];
    for (const alias of aliases) {
      for (const span of findCandidateAnswerSpans(answer, alias)) {
        if (!spans.some(s => s.start === span.start && s.end === span.end)) {
          spans.push(span);
        }
      }
    }
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

/**
 * Does the clarification context or user answer explicitly authorize targetRole
 * (to, cc, or bcc) for candidateIdentity?
 *
 * For 'bcc' and 'cc', explicit mentions of BCC or CC in the text surrounding
 * the recipient identity or in the answer authorize the role.
 * For 'to', because "to" is also a ubiquitous preposition ("send to Alice"),
 * an explicit role label ("To: Alice", "Alice (To)", "as To", "in To", "To field")
 * or localized role indicator ("收件人", "主送") is required.
 */
export function clarificationAuthorizesRecipientRole(clarifyContext, answer, candidateIdentity, targetRole) {
  const role = String(targetRole || '').trim().toLowerCase();
  if (!MESSAGE_RECIPIENT_ROLES.has(role)) return false;

  const answerText = String(answer ?? '').trim();
  const contextTexts = clarifyContext && typeof clarifyContext === 'object'
    ? [
        clarifyContext.question,
        clarifyContext.reason,
        ...(Array.isArray(clarifyContext.options) ? clarifyContext.options : []),
      ].filter(Boolean).map(s => String(s).trim())
    : [];

  const candidate = typeof candidateIdentity === 'object' && candidateIdentity !== null
    ? candidateIdentity
    : { identity: candidateIdentity };
  const rawId = candidate.identity ?? candidate.recipient ?? candidateIdentity;
  const normId = normalizeRecipientIdentity(rawId);
  const candidateAliases = [
    normId,
    ...(Array.isArray(candidate.aliases) ? candidate.aliases.map(normalizeRecipientIdentity) : []),
  ].filter(Boolean);

  function snippetHasExplicitRole(snippet, roleToCheck) {
    if (!snippet) return false;
    if (roleToCheck === 'bcc') {
      return /\b(?:bcc|blind\s+carbon\s+copy)\b|密送|暗送/i.test(snippet);
    }
    if (roleToCheck === 'cc') {
      return /\b(?:cc|carbon\s+copy)\b|抄送/i.test(snippet);
    }
    if (roleToCheck === 'to') {
      if (/\bto\s*[:：]/i.test(snippet)) return true;
      if (/[(\[【]\s*to\s*[)\]】]/i.test(snippet)) return true;
      if (/\b(?:as|in|into|role|field)\s+to\b/i.test(snippet)) return true;
      if (/\bto\s+(?:field|role|recipient)\b/i.test(snippet)) return true;
      if (/\bfrom\s+(?:bcc|cc)\s+to\s+to\b/i.test(snippet)) return true;
      if (/\b(?:bcc|cc)\s*(?:->|=>|→)\s*to\b/i.test(snippet)) return true;
      if (/(?:作为|设为)?(?:收件人|主送)/i.test(snippet)) return true;
      const trimmed = snippet.trim();
      if (/^(?:to|as\s+to)$/i.test(trimmed)) return true;
      return false;
    }
    return false;
  }

  const clauseDelimiters = /[,;\n\r|/]|(?:\s+(?:and|or|以及|与|及)\s+)/i;

  function textAuthorizesRoleForIdentity(text) {
    if (!text) return false;
    const clauses = text.split(clauseDelimiters).map(s => s.trim()).filter(Boolean);
    let matchedClause = false;
    for (const clause of clauses) {
      if (candidateAliases.some(alias => answerNamesIdentity(clause, alias))) {
        matchedClause = true;
        if (snippetHasExplicitRole(clause, role)) return true;
      }
    }
    if (!matchedClause) {
      const matchingAliases = candidateAliases.filter(alias => answerNamesIdentity(text, alias));
      if (matchingAliases.length > 0) {
        for (const alias of matchingAliases) {
          const spans = findCandidateAnswerSpans(text, alias);
          for (const span of spans) {
            const window = text.slice(Math.max(0, span.start - 40), Math.min(text.length, span.end + 40));
            if (snippetHasExplicitRole(window, role)) return true;
          }
        }
      } else if (candidateAliases.length === 0 || clauses.length <= 1) {
        if (snippetHasExplicitRole(text, role)) return true;
      }
    }
    return false;
  }

  if (answerText && textAuthorizesRoleForIdentity(answerText)) {
    return true;
  }

  for (const contextText of contextTexts) {
    if (contextText && textAuthorizesRoleForIdentity(contextText)) {
      return true;
    }
  }

  return false;
}

/**
 * Resolve observed recipient candidates against previously authorized recipients
 * and clarification context/answer.
 *
 * When an observed candidate was already authorized with a different role (for
 * example, authorized as 'bcc' while the composer exposes 'to'), require the
 * clarification to explicitly authorize each changed To/CC/BCC role, or retain
 * the previously authorized role when only the identity was confirmed.
 */
export function resolveClarifiedRecipients(observedCandidates, previousTarget, clarifyContext, answer) {
  const previous = normalizeMessageTarget(previousTarget);
  const previousRolesByIdentity = new Map();
  if (previous?.recipients) {
    for (const r of previous.recipients) {
      const norm = normalizeRecipientIdentity(r.identity);
      if (norm && r.role) {
        previousRolesByIdentity.set(norm, r.role);
      }
    }
  }

  const rawList = Array.isArray(observedCandidates) ? observedCandidates : [];
  return rawList.map(candidate => {
    const legacy = typeof candidate === 'string' || typeof candidate === 'number';
    const identity = compact(legacy ? candidate : (candidate?.identity ?? candidate?.recipient), 240);
    const observedRole = compact(legacy ? 'to' : candidate?.role, 12).toLowerCase() || 'to';
    const norm = normalizeRecipientIdentity(identity);
    let previousRole = previousRolesByIdentity.get(norm);
    if (!previousRole && Array.isArray(candidate?.aliases)) {
      for (const alias of candidate.aliases) {
        const normAlias = normalizeRecipientIdentity(alias);
        if (normAlias && previousRolesByIdentity.has(normAlias)) {
          previousRole = previousRolesByIdentity.get(normAlias);
          break;
        }
      }
    }
    if (previousRole && previousRole !== observedRole) {
      const authorized = clarificationAuthorizesRecipientRole(clarifyContext, answer, candidate, observedRole);
      return {
        identity,
        role: authorized ? observedRole : previousRole,
      };
    }
    return {
      identity,
      role: observedRole,
    };
  });
}

