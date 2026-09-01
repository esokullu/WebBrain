---
title: >
  Ornith-1.0-35B in WebBrain's frozen planner benchmark
slug: ornith-35b-webbrain-planner-benchmark
sortOrder: -30
date: 2026-06-26
readTime: 6 min read
description: >
  We ran Ornith-1.0-35B through WebBrain's frozen 100-case browser-agent first-tool benchmark after DeepReinforce's model card claimed wins over Qwen3.6-35B and Gemma4-31B on agentic coding benchmarks.
excerpt: >
  Ornith-1.0-35B is a strong local planner and narrowly beats Qwen 3.6 35B on WebBrain's all-case Sonnet alignment. It does not beat Gemma 4 31B QAT in this browser-agent harness.
titleTag: >
  Ornith-1.0-35B WebBrain planner benchmark - WebBrain Blog
ogTitle: >
  Ornith-1.0-35B enters WebBrain's frozen planner benchmark
ogDescription: >
  Ornith's coding-agent claims are impressive. In WebBrain's browser-agent planner benchmark, it lands near the hosted/local planner tier but does not overtake Gemma 4 31B.
twitterTitle: >
  Ornith-1.0-35B WebBrain planner benchmark
twitterDescription: >
  Ornith-1.0-35B vs Gemma 4 31B and Qwen 3.6 35B in WebBrain's frozen first-tool browser-agent benchmark.
keywords:
  - WebBrain
  - Ornith
  - Ornith-1.0-35B
  - DeepReinforce
  - browser agent
  - tool calling
  - planner benchmark
  - Gemma 4
  - Qwen 3.6
lede: >
  DeepReinforce's **Ornith-1.0-35B** model card makes a bold claim for a 35B-class open agent model: on their published agentic coding benchmarks, it beats the comparable Qwen 3.6 35B and Gemma 4 31B rows. We ran the local `ornith-35b` endpoint through WebBrain's frozen browser-agent planner benchmark to see whether that advantage transfers to first-tool browser control. The answer is mixed: Ornith is good, but it does not beat Gemma 4 31B here.
---

## The claim

[Ornith-1.0-35B](https://huggingface.co/deepreinforce-ai/Ornith-1.0-35B) is the 35B MoE member of DeepReinforce's Ornith 1.0 family. The model card describes the family as open-source, MIT licensed, and post-trained for agentic coding with RL. Its benchmark table compares Ornith-1.0-35B against Qwen3.5-35B, Qwen3.6-35B, Gemma4-31B, and a larger Qwen3.5-397B row across Terminal-Bench, SWE-bench, NL2Repo, ClawEval, and SWE Atlas.

The model card's own benchmark image:

![Ornith-1.0-35B benchmark results from the Hugging Face model card](https://huggingface.co/deepreinforce-ai/Ornith-1.0-35B/resolve/main/assets/ornith%5F35b%5Feval.png)

That is a coding-agent claim, not a browser-agent claim. WebBrain's benchmark is narrower: the model sees a browser state, user instruction, and a 41-tool browser-control schema, then we score only the first tool call.

## What we ran

The local server advertised:

```json
{
  "id": "ornith-35b",
  "root": "sakamakismile/Ornith-1.0-35B-NVFP4",
  "max_model_len": 65536
}
```

We used the same frozen May 23, 2026 WebBrain baseline used by the published planner table: Claude Sonnet 4.6's system prompt and 41-tool schema, system hash `5c4fac1387025050`.

```bash
node test/llm/run-llamacpp.mjs \
  --base http://localhost:8000 \
  --model ornith-35b \
  --tag 2026-06-26-ornith-35b-localhost8000 \
  --concurrency 2 \
  --timeout 180000 \
  --no-save-request \
  --freeze test/llm/freeze/baseline-2026-05-23.json
```

Result files:

```text
test/llm/results/2026-06-26-ornith-35b-localhost8000_chrome_ornith-35b_frozen
```

## Headline result

| Metric | Ornith-1.0-35B NVFP4 |
| --- | ---: |
| Completed cases | 100/100 |
| Transport errors | 0 |
| Parsed tool calls | 88/100 |
| Valid frozen-schema tool names | 88/100 |
| Strict exact first-call match | 21/100 |
| Ideal tool-name match | 36/100 |
| Sonnet match, all cases | 71.0% |
| Sonnet match, when Sonnet tooled | 70.7% |
| Median latency | 2.4s |
| p95 latency | 4.0s |
| Total wall time | 128s at concurrency 2 |

This is a credible result. Ornith is in the same broad planner tier as MiniMax M3, WebBrain Compass 1.0, Qwen 3.6 35B, and the Gemma 4 31B local rows. It emits only valid frozen-schema tool names when it emits tools, it has a sane tool distribution, and its latency is much better than the saved Qwen 3.6 35B run.

It is not a new top row.

## Claim check: Gemma 4 31B and Qwen 3.6 35B

The published Ornith table says the model beats both Qwen3.6-35B and Gemma4-31B on DeepReinforce's agentic coding suite. In WebBrain's browser-agent first-tool benchmark, the result splits:

| Model | Parsed calls | Exact | Ideal name | Sonnet all | Sonnet tooled | Median |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Gemma 4 31B QAT w4a16 | 95/100 | 19/100 | 37/100 | 77.0% | 78.3% | 0.55s |
| Ornith-1.0-35B NVFP4 | 88/100 | 21/100 | 36/100 | 71.0% | 70.7% | 2.4s |
| Qwen 3.6 35B-A3B | 90/100 | 18/100 | 38/100 | 70.0% | 70.7% | 10.3s |

Against **Qwen 3.6 35B**, Ornith mostly holds up. It is one point higher on all-case Sonnet alignment, tied on the Sonnet-tooled rate, better on exact ideal first calls, and much faster in this local setup. Qwen still has slightly more parsed calls and a better ideal tool-name score, so this is not a clean sweep, but Ornith is at least competitive.

Against **Gemma 4 31B**, the claim does not transfer. Ornith has a small edge on strict exact first-call matches, but Gemma wins the WebBrain-relevant picture: more parsed calls, higher ideal-name match, higher Sonnet alignment, and much lower latency. If the question is "does Ornith beat Gemma 4 31B as a WebBrain browser planner?", our answer from this run is no.

## Where Ornith is strong

Ornith's tool distribution looks like a real browser planner, not a model flailing at the schema:

| Tool or output | First calls |
| --- | ---: |
| `get_accessibility_tree` | 38 |
| `navigate` | 21 |
| no tool call | 12 |
| `read_page` | 6 |
| `execute_js` | 4 |
| `new_tab` | 3 |
| `list_downloads` | 2 |
| `screenshot` | 2 |
| `click` | 2 |
| `download_social_media` | 2 |

The category view is encouraging. Ornith matched Sonnet on all 10 direct navigation cases, 9 of 10 search cases, 8 of 8 form/interactive cases, and all 4 scrolling/inspection cases. That is the kind of basic routing discipline a browser agent needs.

It also did well on the benchmark's stricter ideal-name rubric for navigation and page reading: 9 of 10 direct navigation prompts, 7 of 10 search prompts, and 5 of 8 page-reading prompts matched the expected first tool name.

## Where it loses points

The weaker areas are the agent-boundary cases:

| Category | Cases | Sonnet-name matches | No-tool turns |
| --- | ---: | ---: | ---: |
| Ambiguous / clarify | 8 | 2 | 5 |
| Knowledge questions | 5 | 4 | 4 |
| Destructive / refusal-worthy | 6 | 2 | 0 |
| Multi-page / listing | 3 | 2 | 1 |

Some no-tool turns are correct. Knowledge questions often should be answered directly, and Sonnet also emits no tool for several of them. But ambiguous tasks are tricky: the ideal behavior is usually an explicit `clarify` call, while Ornith often replied with prose or no parsed tool call. For WebBrain, a terminal prose response may be fine in a chat transcript, but a planner benchmark wants that decision represented as a tool.

The other drag is tool-call rate. Ornith produced parsed calls in 88 cases. Gemma 4 31B produced 95. Seven cases is a lot in a 100-case first-tool benchmark, especially when the missing tools cluster around boundary and ambiguity handling.

## Updated local/hosted context

Here is where Ornith lands among the nearby frozen rows:

| Model | Parsed calls | Exact | Ideal name | Sonnet all | Sonnet tooled | Median |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Gemma 4 31B QAT w4a16 | 95/100 | 19/100 | 37/100 | 77.0% | 78.3% | 0.55s |
| Qwen 3.6 27B | 92/100 | 18/100 | 37/100 | 77.0% | 77.2% | 10.2s |
| MiniMax M3 | 85/100 | 17/100 | 32/100 | 75.0% | 73.9% | 3.1s |
| WebBrain Compass 1.0 | 90/100 | 16/100 | 35/100 | 73.0% | 72.8% | 8.8s |
| Ornith-1.0-35B NVFP4 | 88/100 | 21/100 | 36/100 | 71.0% | 70.7% | 2.4s |
| Qwen 3.6 35B-A3B | 90/100 | 18/100 | 38/100 | 70.0% | 70.7% | 10.3s |

The interesting part is not that Ornith dominates. It does not. The interesting part is that it lands this close while being a coding-agent model evaluated on a browser-planner task that was not the benchmark advertised on its model card.

The exact-match score is particularly good: 21/100 is higher than Gemma 4 31B, Qwen 3.6 35B, MiniMax M3, and WebBrain Compass in this table. But exact ideal calls are only one lens. The broader Sonnet-alignment metric still keeps Gemma 4 31B and Qwen 3.6 27B ahead.

## Bottom line

Ornith-1.0-35B is a strong local model, and the Hugging Face coding-agent claim is directionally believable: the model clearly has agentic tool-use training, and it beats or ties Qwen 3.6 35B on several WebBrain metrics while running much faster in this setup.

But the stronger claim - "better than both Gemma4-31B and Qwen3.6-35B" - does not hold inside WebBrain's frozen browser-agent planner benchmark. Ornith edges Qwen 3.6 35B on all-case Sonnet alignment and exact calls, but Gemma 4 31B remains the better browser planner in this saved table.

For WebBrain, I would put Ornith in the serious-candidate bucket, not the default-model bucket. The next useful test is a live-schema WebBrain run and then multi-turn scenarios. First-tool routing says Ornith is good; it does not yet say Ornith is the best local browser agent.

Tags: #Ornith #DeepReinforce #Gemma4 #Qwen36 #ToolCalling #BrowserAgent #WebBrain
