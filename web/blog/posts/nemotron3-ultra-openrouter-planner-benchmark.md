---
title: >
  Nemotron 3 Ultra is huge, free, and not a WebBrain planner win
slug: nemotron3-ultra-openrouter-planner-benchmark
sortOrder: -45
date: 2026-07-08
readTime: 6 min read
description: >
  We ran nvidia/nemotron-3-ultra-550b-a55b:free through WebBrain's frozen 100-case browser-agent first-tool benchmark on OpenRouter. The 550B-total MoE model completed the run, but landed well below the best planner rows.
excerpt: >
  Nemotron 3 Ultra completed WebBrain's frozen planner benchmark through OpenRouter's free endpoint, but 81 parsed calls, 65% Sonnet alignment, and a 40.6s p95 keep it out of the planner shortlist.
titleTag: >
  Nemotron 3 Ultra OpenRouter WebBrain planner benchmark - WebBrain Blog
ogTitle: >
  Nemotron 3 Ultra is not a WebBrain planner win
ogDescription: >
  NVIDIA's 550B-total Nemotron 3 Ultra free endpoint completed WebBrain's frozen planner run, but trails Agents-A1, Hy3, Qwen 3.7 Plus, and older Qwen 3.6 rows.
twitterTitle: >
  Nemotron 3 Ultra WebBrain planner benchmark
twitterDescription: >
  Nemotron 3 Ultra via OpenRouter: 81 parsed calls, 17 exact first actions, 65% Sonnet alignment, and a very slow p95.
keywords:
  - WebBrain
  - Nemotron 3 Ultra
  - NVIDIA
  - OpenRouter
  - browser agent
  - planner benchmark
  - tool calling
  - Qwen 3.7 Plus
  - Agents-A1
  - Tencent Hy3
lede: >
  NVIDIA's **Nemotron 3 Ultra 550B-A55B** is exactly the kind of model name that makes a browser-agent benchmark irresistible: 550B total parameters, 55B active, a 1M-token context window, and positioning around agent orchestration, coding agents, deep research, and long-running workflows. We ran `nvidia/nemotron-3-ultra-550b-a55b:free` through WebBrain's frozen planner harness on OpenRouter. The run completed cleanly, but the planner result is underwhelming.
---

## The claim

[OpenRouter's model page](https://openrouter.ai/nvidia/nemotron-3-ultra-550b-a55b%3Afree) describes Nemotron 3 Ultra as an NVIDIA frontier-reasoning and orchestration model with 55B active parameters out of 550B total, a hybrid Transformer-Mamba MoE architecture, text input/output, and up to a 1M-token context window. It is explicitly pitched at agent orchestration, coding agents, deep research, and complex enterprise tasks.

The [Hugging Face weights page](https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Ultra-550B-A55B-BF16) says the same thing in model-card language: this is a frontier-scale open model optimized for demanding multi-step agents, long-context analysis, and reasoning over code, math, and science.

That is not the same as being a good browser first-tool planner. WebBrain's harness is narrower and harsher: the model sees a browser state, user instruction, and a 41-tool browser-control schema, then we score the first tool call only.

## What we ran

We used OpenRouter's free endpoint:

```text
nvidia/nemotron-3-ultra-550b-a55b:free
```

The run used the same frozen May 23, 2026 WebBrain baseline used by the recent planner posts: Claude Sonnet 4.6's system prompt and 41-tool schema, system hash `5c4fac1387025050`.

```bash
OPENROUTER_API_KEY=... node test/llm/run-llamacpp.mjs \
  --base https://openrouter.ai/api/v1 \
  --model nvidia/nemotron-3-ultra-550b-a55b:free \
  --tag 2026-07-08-openrouter-nemotron3-ultra-free \
  --concurrency 1 \
  --timeout 180000 \
  --no-save-request \
  --freeze test/llm/freeze/baseline-2026-05-23.json
```

This was a native OpenAI structured-tools run. No chat-template fallback was used, and request payloads were not saved. We kept concurrency at 1 because the model is a free OpenRouter variant.

Result files:

```text
test/llm/results/2026-07-08-openrouter-nemotron3-ultra-free_chrome_nvidia_nemotron-3-ultra-550b-a55b_free_frozen
```

## Headline result

| Metric | Nemotron 3 Ultra via OpenRouter |
| --- | ---: |
| Completed cases | 100/100 |
| Transport errors | 0 |
| Parsed tool calls | 81/100 |
| Valid frozen-schema tool names | 81/100 |
| Strict exact first-call match | 17/100 |
| Ideal tool-name match | 33/100 |
| Sonnet match, all cases | 65.0% |
| Sonnet match, when Sonnet tooled | 64.1% |
| Average latency | 12.14s |
| Median latency | 5.89s |
| p95 latency | 40.6s |
| Slowest case | 60.0s |
| Total wall time | 1,214s at concurrency 1 |
| OpenRouter reported cost | $0.00 |

The good news: the endpoint completed the full 100-case suite with zero transport errors and no rate-limit recovery work. That is better operational behavior than I expected from a free 550B-total model.

The bad news: this is not a strong WebBrain planner row. The no-tool rate is high, Sonnet alignment is low for the current table, and latency is rough. The median is tolerable for a free frontier-scale model, but a 40.6s p95 makes it hard to imagine using this as an interactive browser planner.

## Against the nearby hosted rows

The obvious comparison is not the full 550B parameter count. It is the hosted planner rows WebBrain can actually call through an OpenAI-compatible API.

| Model | Parsed calls | Exact | Ideal name | Sonnet all | Sonnet tooled | Median | p95 | Cost |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Qwen 3.7 Plus | 95/100 | 19/100 | 41/100 | 75.0% | 77.2% | 3.74s | 7.76s | $0.14 |
| Agents-A1 AWQ INT4 | 88/100 | 15/100 | 33/100 | 75.0% | 75.0% | 1.66s | 3.0s | local |
| Tencent Hy3 free | 95/100 | 20/100 | 38/100 | 73.0% | 75.0% | 3.68s | 9.16s | $0.00 |
| Qwen 3.6 35B-A3B | 90/100 | 18/100 | 38/100 | 70.0% | 70.7% | 10.3s | 17.0s | local |
| Nemotron 3 Ultra free | 81/100 | 17/100 | 33/100 | 65.0% | 64.1% | 5.89s | 40.6s | $0.00 |

Nemotron's exact score is not terrible: 17/100 is in the neighborhood of MiniMax M3 and Qwen 3.6 35B-A3B. But every broader planner signal is worse. It emits fewer parsed calls, aligns with Sonnet less often, and has a much worse tail latency than the hosted Qwen 3.7 Plus and Hy3 rows.

The Hy3 comparison is especially clean because both rows used OpenRouter free variants. Hy3 produced 95 parsed calls, 73% Sonnet alignment, and a 9.16s p95. Nemotron produced 81 parsed calls, 65% Sonnet alignment, and a 40.6s p95. For WebBrain's planner job, Hy3 is the stronger free OpenRouter candidate by a wide margin.

## Where Nemotron is strong

The tool distribution is not broken:

| Tool or output | First calls |
| --- | ---: |
| `get_accessibility_tree` | 38 |
| `navigate` | 23 |
| no tool call | 19 |
| `read_page` | 7 |
| `new_tab` | 3 |
| `clarify` | 2 |
| `execute_js` | 2 |
| `extract_data` | 2 |
| `download_social_media` | 1 |
| `get_selection` | 1 |
| `screenshot` | 1 |
| `scroll` | 1 |

The basic browser-work categories were decent:

| Category | Cases | Sonnet-name matches | Ideal-name matches |
| --- | ---: | ---: | ---: |
| Direct navigation | 10 | 9 | 10 |
| Search | 10 | 9 | 6 |
| Email | 6 | 5 | 0 |
| Scrolling / inspection | 4 | 4 | 3 |
| Translation / accessibility | 3 | 3 | 1 |
| Multi-page / listing | 3 | 3 | 0 |

Direct navigation is the strongest point. It hit the ideal tool name in all 10 direct navigation cases, and it was often willing to call `navigate` directly instead of over-inspecting the blank tab. It also handled the small scrolling and translation/accessibility bands well.

## Where it loses points

The weak spots are broad:

| Category | Cases | Sonnet-name matches | No-tool turns | Pattern |
| --- | ---: | ---: | ---: | --- |
| Downloads | 6 | 2 | 1 | Chose `execute_js`, `read_page`, and `navigate` where dedicated download/list tools were expected. |
| Forms / interactive | 8 | 5 | 3 | Several simple UI actions produced prose instead of a tool call. |
| Ambiguous / clarify | 8 | 3 | 5 | Mostly prose clarification, with one surprising `execute_js`. |
| Destructive / refusal-worthy | 6 | 2 | 1 | Usually inspected the page before explicit confirmation. |
| Tab management | 4 | 2 | 1 | Sometimes gave correct prose, but slowly and outside the tool protocol. |
| UI mutations | 4 | 0 | 2 | Did not match Sonnet on any of the four browser-control prompts. |

The no-tool issue matters. In normal chat, prose can be acceptable for a vague instruction like "log in" or "buy it." But in WebBrain's planner protocol, ambiguity should usually become a `clarify` tool. Nemotron often wrote the right sort of question in prose, but the browser-agent loop cannot treat that the same as an explicit planner action.

There were also concrete tool-choice misses:

- "close the cookie banner", "close this popup", and "tick the subscribe checkbox" produced no tool call.
- "download this image" used `execute_js` instead of a download tool.
- "save this YouTube thumbnail" produced no tool call instead of `download_social_media`.
- "list my downloads" navigated to `about:downloads` instead of calling `list_downloads`.
- "mute this tab" inspected the page for 43.7s.

That is the pattern: Nemotron can reason and explain, but it does not reliably behave like a browser-control planner.

## Updated context

Rows are ranked by all-case Sonnet match, then Sonnet-tooled match.

| # | Model | Parsed calls | Exact | Ideal name | Sonnet all | Sonnet tooled | Median |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | Gemma 4 31B QAT w4a16 | 95/100 | 19/100 | 37/100 | 77.0% | 78.3% | 0.55s |
| 2 | Qwen 3.6 27B | 92/100 | 18/100 | 37/100 | 77.0% | 77.2% | 10.2s |
| 3 | MiniMax M2.7 | 88/100 | 23/100 | 36/100 | 77.0% | 76.1% | 3.1s |
| 4 | Qwen 3.7 Plus | 95/100 | 19/100 | 41/100 | 75.0% | 77.2% | 3.74s |
| 5 | Agents-A1 AWQ INT4 | 88/100 | 15/100 | 33/100 | 75.0% | 75.0% | 1.66s |
| 6 | MiniMax M3 | 85/100 | 17/100 | 32/100 | 75.0% | 73.9% | 3.1s |
| 7 | Qwen 3.6 27B NVFP4 | 96/100 | 18/100 | 38/100 | 74.0% | 77.2% | 1.76s |
| 8 | Tencent Hy3 free | 95/100 | 20/100 | 38/100 | 73.0% | 75.0% | 3.68s |
| 9 | WebBrain Compass 1.0 | 90/100 | 16/100 | 35/100 | 73.0% | 72.8% | 8.8s |
| 10 | Qwen 3.6 35B-A3B | 90/100 | 18/100 | 38/100 | 70.0% | 70.7% | 10.3s |
| 11 | Nemotron 3 Ultra free | 81/100 | 17/100 | 33/100 | 65.0% | 64.1% | 5.89s |

This is a useful negative result. Nemotron 3 Ultra is bigger than every model in the local planner table by total parameter count, and OpenRouter exposes it for free, but size and availability do not translate into first-tool browser-agent quality.

## Bottom line

Nemotron 3 Ultra is not a WebBrain planner shortlist model from this run. It is stable enough to complete the suite, and it is free on OpenRouter today, but the first-tool quality is behind the better hosted and local rows.

For WebBrain, I would pick Qwen 3.7 Plus, Tencent Hy3, Agents-A1, Gemma 4 31B, or the older Qwen 3.6 rows before this Nemotron endpoint. Nemotron may still be interesting for long-context reasoning, research, or orchestration workloads that look more like its model-card target. In this browser-control harness, it behaves more like a capable reasoner that sometimes forgets it is inside a tool-driven agent loop.

Tags: #Nemotron3Ultra #NVIDIA #OpenRouter #Qwen37 #AgentsA1 #TencentHy3 #ToolCalling #BrowserAgent #WebBrain
