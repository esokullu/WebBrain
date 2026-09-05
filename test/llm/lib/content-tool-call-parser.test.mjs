import test from 'node:test';
import assert from 'node:assert/strict';
import { extractToolCallFromContent } from './content-tool-call-parser.mjs';

const tools = ['navigate', 'click_ax', 'clarify', 'read_page'].map((name) => ({
  type: 'function', function: { name, parameters: { type: 'object' } },
}));

test('parses native LFM2 wrapper after reasoning', () => {
  const raw = "reasoning</think><|tool_call_start|>[navigate(url='https://example.com', force=False)]<|tool_call_end|>";
  assert.deepEqual(extractToolCallFromContent(raw, { tools }), {
    name: 'navigate', args: { url: 'https://example.com', force: false },
  });
});

test('parses nested literal lists and dictionaries without evaluation', () => {
  const raw = "<|tool_call_start|>[clarify(question='More?', options=['A','B'], meta={'safe': True}, require_explicit_answer=True)]<|tool_call_end|>";
  assert.deepEqual(extractToolCallFromContent(raw, { tools }), {
    name: 'clarify',
    args: { question: 'More?', options: ['A', 'B'], meta: { safe: true }, require_explicit_answer: true },
  });
});

test('keeps legacy JSON fallback support', () => {
  assert.deepEqual(extractToolCallFromContent('<tool_call>{"name":"click_ax","arguments":{"ref_id":"r1"}}</tool_call>', { tools }), {
    name: 'click_ax', args: { ref_id: 'r1' },
  });
});

for (const [name, raw] of [
  ['unknown tool', "<|tool_call_start|>[unknown(value='x')]<|tool_call_end|>"],
  ['nested call', "<|tool_call_start|>[navigate(url=open('secret'))]<|tool_call_end|>"],
  ['positional argument', "<|tool_call_start|>[navigate('https://example.com')]<|tool_call_end|>"],
  ['malformed nested helper', "<|tool_call_start|>[read_page(continuationArgs=set_continuationArgs({'offset': 0}))]<|tool_call_end|>"],
  ['unclosed wrapper', "<|tool_call_start|>[navigate(url='https://example.com')]"],
  ['duplicate keyword', "<|tool_call_start|>[navigate(url='a', url='b')]<|tool_call_end|>"],
]) {
  test(`fails closed: ${name}`, () => assert.equal(extractToolCallFromContent(raw, { tools }), null));
}
