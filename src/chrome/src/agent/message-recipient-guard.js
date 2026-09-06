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
 * Does the user answer explicitly authorize targetRole (to, cc, or bcc) for
 * candidateIdentity?
 *
 * Role authorization must come strictly from the user's answer, never from
 * the clarification context (question, reason, or options) which are
 * model-authored and cannot supply recipient authorization.
 *
 * For 'bcc' and 'cc', explicit mentions of BCC or CC in the answer authorize the role.
 * Each role label is strictly associated with its intended recipient rather than
 * accepted anywhere in a shared multi-recipient sentence or clause.
 *
 * For 'bcc' and 'cc', explicit mentions of BCC or CC attached to the recipient
 * identity in the answer authorize the role.
 * For 'to', because "to" is also a ubiquitous preposition ("send to Alice"),
 * an explicit role label ("To: Alice", "Alice (To)", "as To", "in To", "to To", "To field")
 * or localized role indicator ("收件人", "主送") attached to the recipient identity
 * is required in the user's answer.
 */
export function clarificationAuthorizesRecipientRole(clarifyContext, answer, candidateIdentity, targetRole) {
  const role = String(targetRole || '').trim().toLowerCase();
  if (!MESSAGE_RECIPIENT_ROLES.has(role)) return false;

  const answerText = String(answer ?? '').trim();
  if (!answerText) return false;

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
      if (/\b(?:as|in|into|role|field|to)\s+to\b/i.test(snippet)) return true;
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

  const prefixPatterns = {
    to: /(?:\bto\s*[:：]|\b(?:as|in|into|to)\s+(?:the\s+)?to(?:\s+(?:field|role|recipient))?\s*[:：,]?(?:\s+(?:put|move|set|send|keep|leave|add|place))?|(?:作为|设为)?(?:收件人|主送)\s*[:：]?)\s*$/i,
    cc: /(?:\b(?:cc|carbon\s+copy)\s*[:：]|\b(?:as|in|into)\s+(?:the\s+)?(?:cc|carbon\s+copy)(?:\s+(?:field|role|recipient))?\s*[:：,]?(?:\s+(?:put|move|set|send|keep|leave|add|place))?|(?:作为|设为)?抄送\s*[:：]?)\s*$/i,
    bcc: /(?:\b(?:bcc|blind\s+carbon\s+copy)\s*[:：]|\b(?:as|in|into)\s+(?:the\s+)?(?:bcc|blind\s+carbon\s+copy)(?:\s+(?:field|role|recipient))?\s*[:：,]?(?:\s+(?:put|move|set|send|keep|leave|add|place))?|(?:作为|设为)?(?:密送|暗送)\s*[:：]?)\s*$/i,
  };

  const suffixPatterns = {
    to: /^\s*(?:[:：]\s*to\b|[(\[【]\s*to\s*[)\]】]|(?:->|=>|→)\s*to\b|(?:(?:is|should\s+be|remains?|stays?|needs?\s+to\s+be)\s+)?(?:as|in|into|to)\s+(?:the\s+)?to(?:\s+(?:field|role|recipient))?\b|(?:from\s+(?:bcc|cc)\s+to\s+to\b)|to\s+(?:field|role|recipient)\b|(?:作为|设为)?(?:收件人|主送))/i,
    cc: /^\s*(?:[:：]\s*(?:cc|carbon\s+copy)\b|[(\[【]\s*(?:cc|carbon\s+copy)\s*[)\]】]|(?:->|=>|→)\s*(?:cc|carbon\s+copy)\b|(?:(?:is|should\s+be|remains?|stays?|needs?\s+to\s+be)\s+)?(?:as|in|into|to)\s+(?:the\s+)?(?:cc|carbon\s+copy)(?:\s+(?:field|role|recipient))?\b|(?:from\s+(?:to|bcc)\s+to\s+cc\b)|(?:cc|carbon\s+copy)\s+(?:field|role|recipient)\b|(?:作为|设为)?抄送)/i,
    bcc: /^\s*(?:[:：]\s*(?:bcc|blind\s+carbon\s+copy)\b|[(\[【]\s*(?:bcc|blind\s+carbon\s+copy)\s*[)\]】]|(?:->|=>|→)\s*(?:bcc|blind\s+carbon\s+copy)\b|(?:(?:is|should\s+be|remains?|stays?|needs?\s+to\s+be)\s+)?(?:as|in|into|to)\s+(?:the\s+)?(?:bcc|blind\s+carbon\s+copy)(?:\s+(?:field|role|recipient))?\b|(?:from\s+(?:to|cc)\s+to\s+bcc\b)|(?:bcc|blind\s+carbon\s+copy)\s+(?:field|role|recipient)\b|(?:作为|设为)?(?:密送|暗送))/i,
  };

  const delimiterRe = /[,;，；\n\r|/]|(?:\s+(?:and|or|while|whilst|but|whereas|yet|however|instead\s+of|rather\s+than|as\s+well\s+as|以及|与|及|而|但是|但)\s+)/gi;
  const roleWordsRe = /\b(?:to|cc|bcc|carbon\s+copy|blind\s+carbon\s+copy)\b|收件人|主送|抄送|密送|暗送/i;

  let hasSpans = false;
  for (const alias of candidateAliases) {
    const spans = findCandidateAnswerSpans(answerText, alias);
    if (spans.length > 0) {
      hasSpans = true;
      for (const span of spans) {
        let clauseStart = 0;
        delimiterRe.lastIndex = 0;
        let m;
        while ((m = delimiterRe.exec(answerText)) !== null) {
          if (m.index < span.start) {
            clauseStart = m.index + m[0].length;
          } else {
            break;
          }
        }

        let clauseEnd = answerText.length;
        delimiterRe.lastIndex = span.end;
        const mAfter = delimiterRe.exec(answerText);
        if (mAfter) {
          clauseEnd = mAfter.index;
        }

        const prefix = answerText.slice(clauseStart, span.start);
        const suffix = answerText.slice(span.end, clauseEnd);

        if (prefixPatterns[role].test(prefix) || suffixPatterns[role].test(suffix)) {
          return true;
        }

        // Grouped role suffix: e.g. Put Alice and Bob in BCC / 把Alice和Bob设为密送
        const fullSuffix = answerText.slice(span.end);
        const coordMatch = fullSuffix.match(/^(?:\s*(?:[,;，；和]|(?:\s+(?:and|or|以及|与|及)\s*))\s*[^,;，；\n\r|/]+?)+?(\s*(?:(?:as|in|into|to)\s+(?:the\s+)?(?:to|cc|bcc|blind\s+carbon\s+copy|carbon\s+copy)(?:\s+(?:field|role|recipient))?\b|[(\[【]\s*(?:to|cc|bcc)\s*[)\]】]|\s*[:：]\s*(?:to|cc|bcc)\b|(?:作为|设为)?(?:收件人|主送|抄送|密送|暗送)))/i);
        if (coordMatch) {
          const intervening = fullSuffix.slice(0, coordMatch.index + coordMatch[0].length - coordMatch[1].length);
          const rolePart = coordMatch[1];
          if (!roleWordsRe.test(intervening) && suffixPatterns[role].test(rolePart)) {
            return true;
          }
        }

        // Grouped role prefix: e.g. To: Alice and Bob
        const fullPrefix = answerText.slice(0, span.start);
        const prefixCoordMatch = fullPrefix.match(/(?:(\b(?:to|cc|bcc)\s*[:：]|(?:作为|设为)?(?:收件人|主送|抄送|密送|暗送)\s*[:：]?)\s*[^,;，；\n\r|/]+(?:\s*(?:[,;，；和]|(?:\s+(?:and|or|以及|与|及)\s*))\s*[^,;，；\n\r|/]+)*\s*(?:[,;，；和]|(?:\s+(?:and|or|以及|与|及)\s*))\s*)$/i);
        if (prefixCoordMatch) {
          const roleLeader = prefixCoordMatch[1];
          const intervening = prefixCoordMatch[0].slice(roleLeader.length);
          if (!roleWordsRe.test(intervening) && prefixPatterns[role].test(roleLeader)) {
            return true;
          }
        }
      }
    }
  }

  if (!hasSpans) {
    delimiterRe.lastIndex = 0;
    const hasMultipleClauses = delimiterRe.test(answerText);
    if (!hasMultipleClauses && snippetHasExplicitRole(answerText, role)) {
      return true;
    }
  }

  return false;
}

/**
 * Resolve observed recipient candidates against previously authorized recipients
 * and clarification context/answer.
 *
 * Preserves previously authorized delivery roles (such as 'bcc') both when an
 * observed recipient's role is changed and when previously authorized recipients
 * are replaced by new identities (e.g. replacing BCC Alice with Bob). An observed
 * candidate only adopts a different delivery role when the user's answer affirmatively
 * authorizes that role for that specific recipient.
 */
export function resolveClarifiedRecipients(observedCandidates, previousTarget, clarifyContext, answer) {
  const previous = normalizeMessageTarget(previousTarget);
  const previousRecipients = previous?.recipients || [];
  const rawList = Array.isArray(observedCandidates) ? observedCandidates : [];

  const matchedPreviousIndices = new Set();
  const candidatePreviousRoles = new Map();

  for (let i = 0; i < rawList.length; i++) {
    const candidate = rawList[i];
    const legacy = typeof candidate === 'string' || typeof candidate === 'number';
    const identity = compact(legacy ? candidate : (candidate?.identity ?? candidate?.recipient), 240);
    const norm = normalizeRecipientIdentity(identity);
    const candidateAliases = [
      norm,
      ...(Array.isArray(candidate?.aliases) ? candidate.aliases.map(normalizeRecipientIdentity) : []),
    ].filter(Boolean);

    for (let p = 0; p < previousRecipients.length; p++) {
      if (matchedPreviousIndices.has(p)) continue;
      const prevNorm = normalizeRecipientIdentity(previousRecipients[p].identity);
      if (candidateAliases.includes(prevNorm)) {
        candidatePreviousRoles.set(i, previousRecipients[p].role);
        matchedPreviousIndices.add(p);
        break;
      }
    }
  }

  const remainingPrevious = previousRecipients
    .map((r, idx) => ({ ...r, idx }))
    .filter(r => !matchedPreviousIndices.has(r.idx));

  const roleRank = { bcc: 3, cc: 2, to: 1 };
  remainingPrevious.sort((a, b) => (roleRank[b.role] || 0) - (roleRank[a.role] || 0));

  for (let i = 0; i < rawList.length; i++) {
    if (candidatePreviousRoles.has(i)) continue;
    if (remainingPrevious.length > 0) {
      const replaced = remainingPrevious.shift();
      candidatePreviousRoles.set(i, replaced.role);
    }
  }

  return rawList.map((candidate, i) => {
    const legacy = typeof candidate === 'string' || typeof candidate === 'number';
    const identity = compact(legacy ? candidate : (candidate?.identity ?? candidate?.recipient), 240);
    const observedRole = compact(legacy ? 'to' : candidate?.role, 12).toLowerCase() || 'to';
    const previousRole = candidatePreviousRoles.get(i);

    let authorizedRole = null;
    for (const r of ['to', 'cc', 'bcc']) {
      if (clarificationAuthorizesRecipientRole(clarifyContext, answer, candidate, r)) {
        authorizedRole = r;
        break;
      }
    }

    if (authorizedRole) {
      return { identity, role: authorizedRole };
    }
    if (previousRole) {
      return { identity, role: previousRole };
    }
    return { identity, role: observedRole };
  });
}

