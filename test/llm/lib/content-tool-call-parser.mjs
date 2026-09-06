// Safe fallback extraction for servers that leave structured calls in content.
// Supports JSON wrappers plus native LFM2/Python-literal calls. It never uses
// eval/Function and accepts keyword-only literal arguments only.

const LFM2_START = '<|tool_call_start|>';
const LFM2_END = '<|tool_call_end|>';

class ParseError extends Error {}

class PythonLiteralCallParser {
  constructor(text) { this.text = text; this.i = 0; }
  ws() { while (/\s/u.test(this.text[this.i] || '')) this.i += 1; }
  peek() { this.ws(); return this.text[this.i]; }
  take(ch) {
    this.ws();
    if (this.text[this.i] !== ch) throw new ParseError(`expected ${ch}`);
    this.i += 1;
  }
  identifier({ dotted = false } = {}) {
    this.ws();
    const rest = this.text.slice(this.i);
    const match = rest.match(dotted
      ? /^[A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)*/u
      : /^[A-Za-z_][A-Za-z0-9_]*/u);
    if (!match) throw new ParseError('expected identifier');
    this.i += match[0].length;
    return match[0];
  }
  string() {
    this.ws();
    const quote = this.text[this.i++];
    if (quote !== "'" && quote !== '"') throw new ParseError('expected string');
    let out = '';
    while (this.i < this.text.length) {
      const ch = this.text[this.i++];
      if (ch === quote) return out;
      if (ch !== '\\') { out += ch; continue; }
      if (this.i >= this.text.length) throw new ParseError('dangling escape');
      const esc = this.text[this.i++];
      const simple = { '\\': '\\', "'": "'", '"': '"', n: '\n', r: '\r', t: '\t', b: '\b', f: '\f' };
      if (Object.hasOwn(simple, esc)) { out += simple[esc]; continue; }
      if (esc === 'u') {
        const hex = this.text.slice(this.i, this.i + 4);
        if (!/^[0-9A-Fa-f]{4}$/u.test(hex)) throw new ParseError('bad unicode escape');
        out += String.fromCharCode(Number.parseInt(hex, 16)); this.i += 4; continue;
      }
      throw new ParseError('unsupported escape');
    }
    throw new ParseError('unterminated string');
  }
  number() {
    this.ws();
    const match = this.text.slice(this.i).match(/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/u);
    if (!match) throw new ParseError('expected number');
    this.i += match[0].length;
    const value = Number(match[0]);
    if (!Number.isFinite(value)) throw new ParseError('non-finite number');
    return value;
  }
  list() {
    this.take('['); const out = [];
    if (this.peek() === ']') { this.take(']'); return out; }
    while (true) {
      out.push(this.value());
      if (this.peek() === ']') { this.take(']'); return out; }
      this.take(',');
      if (this.peek() === ']') { this.take(']'); return out; }
    }
  }
  object() {
    this.take('{'); const out = Object.create(null);
    if (this.peek() === '}') { this.take('}'); return { ...out }; }
    while (true) {
      if (this.peek() !== "'" && this.peek() !== '"') throw new ParseError('dict keys must be strings');
      const key = this.string();
      if (Object.hasOwn(out, key)) throw new ParseError('duplicate dict key');
      this.take(':'); out[key] = this.value();
      if (this.peek() === '}') { this.take('}'); return { ...out }; }
      this.take(',');
      if (this.peek() === '}') { this.take('}'); return out; }
    }
  }
  value() {
    const ch = this.peek();
    if (ch === "'" || ch === '"') return this.string();
    if (ch === '[') return this.list();
    if (ch === '{') return this.object();
    if (ch === '-' || /\d/u.test(ch || '')) return this.number();
    const name = this.identifier();
    if (name === 'True') return true;
    if (name === 'False') return false;
    if (name === 'None') return null;
    throw new ParseError('non-literal value');
  }
  call() {
    const name = this.identifier({ dotted: true });
    this.take('('); const args = Object.create(null);
    if (this.peek() === ')') { this.take(')'); return { name, args: { ...args } }; }
    while (true) {
      const key = this.identifier();
      if (Object.hasOwn(args, key)) throw new ParseError('duplicate keyword');
      this.take('='); args[key] = this.value();
      if (this.peek() === ')') { this.take(')'); return { name, args: { ...args } }; }
      this.take(',');
      if (this.peek() === ')') { this.take(')'); return { name, args: { ...args } }; }
    }
  }
  callList() {
    this.take('['); const calls = [];
    if (this.peek() === ']') throw new ParseError('empty call list');
    while (true) {
      calls.push(this.call());
      if (this.peek() === ']') { this.take(']'); break; }
      this.take(',');
    }
    this.ws();
    if (this.i !== this.text.length) throw new ParseError('trailing syntax');
    return calls;
  }
  singleCall() {
    const call = this.call(); this.ws();
    if (this.i !== this.text.length) throw new ParseError('trailing syntax');
    return call;
  }
}

function allowedNames(tools) {
  if (!Array.isArray(tools)) return null;
  return new Set(tools.map((tool) => tool?.function?.name).filter((name) => typeof name === 'string'));
}

function validateCall(call, allowed) {
  if (!call || typeof call.name !== 'string' || !call.name) return null;
  if (allowed && !allowed.has(call.name)) return null;
  if (!call.args || typeof call.args !== 'object' || Array.isArray(call.args)) return null;
  return call;
}

function safeJsonArguments(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value;
  if (typeof value !== 'string') return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch { return {}; }
}

function normalizeJsonCall(value) {
  if (!value || typeof value !== 'object') return null;
  if (Array.isArray(value)) return value[0] ? normalizeJsonCall(value[0]) : null;
  if (Array.isArray(value.tool_calls)) return value.tool_calls[0] ? normalizeJsonCall(value.tool_calls[0]) : null;
  if (value.function && typeof value.function.name === 'string') {
    return { name: value.function.name, args: safeJsonArguments(value.function.arguments ?? value.function.args ?? {}) };
  }
  const name = typeof value.name === 'string' ? value.name
    : typeof value.tool_name === 'string' ? value.tool_name : null;
  if (!name) return null;
  return { name, args: safeJsonArguments(value.arguments ?? value.args ?? value.parameters ?? {}) };
}

export function extractToolCallFromContent(text, { tools = null } = {}) {
  if (!text || typeof text !== 'string') return null;
  const allowed = allowedNames(tools);
  const candidates = [];
  for (const match of text.matchAll(/<tool_call>\s*([\s\S]*?)\s*<\/tool_call>/gu)) candidates.push({ kind: 'json', raw: match[1] });
  for (const match of text.matchAll(/<\|START_ACTION\|>\s*([\s\S]*?)\s*<\|END_ACTION\|>/gu)) candidates.push({ kind: 'json', raw: match[1] });
  for (const match of text.matchAll(/```(?:json)?\s*([\s\S]*?)\s*```/gu)) candidates.push({ kind: 'json', raw: match[1] });

  const lfmStart = text.indexOf(LFM2_START);
  if (lfmStart >= 0) {
    const lfmEnd = text.indexOf(LFM2_END, lfmStart + LFM2_START.length);
    if (lfmEnd < 0) return null;
    candidates.unshift({ kind: 'python-list', raw: text.slice(lfmStart + LFM2_START.length, lfmEnd).trim() });
  }

  const trimmed = text.trim();
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    candidates.push({ kind: 'json', raw: trimmed });
  }
  const trailingJson = trimmed.match(/(\[\s*\{[\s\S]*\}\s*\]|\{[\s\S]*\})\s*$/u);
  if (trailingJson) candidates.push({ kind: 'json', raw: trailingJson[1] });
  if (/^[A-Za-z_][\w.]*(?:\s*)\(/u.test(trimmed)) candidates.push({ kind: 'python-call', raw: trimmed.replace(/;\s*$/u, '') });

  for (const candidate of candidates) {
    try {
      let call = null;
      if (candidate.kind === 'python-list') call = new PythonLiteralCallParser(candidate.raw).callList()[0] || null;
      else if (candidate.kind === 'python-call') call = new PythonLiteralCallParser(candidate.raw).singleCall();
      else call = normalizeJsonCall(JSON.parse(candidate.raw));
      const valid = validateCall(call, allowed);
      if (valid) return valid;
    } catch { /* fail closed and try the next non-executable representation */ }
  }
  return null;
}

export const _test = { PythonLiteralCallParser };
