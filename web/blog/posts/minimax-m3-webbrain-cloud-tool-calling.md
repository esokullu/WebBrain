---
title: >
  MiniMax M3 and WebBrain Compass 1.0 enter the frozen WebBrain planner benchmark
slug: minimax-m3-webbrain-cloud-tool-calling
sortOrder: -10
date: 2026-06-21
readTime: 6 min read
description: >
  We ran MiniMax M3 through OpenRouter and WebBrain Compass 1.0 through api.webbrain.one against WebBrain's frozen 100-case browser-agent first-tool benchmark, then updated the Sonnet 4.6 comparison table.
excerpt: >
  MiniMax M3 landed at 75% Sonnet first-tool alignment, below the older MiniMax M2.7 run. WebBrain Compass 1.0 reached 73% alignment with a much lower run cost, but higher latency in this test path.
titleTag: >
  MiniMax M3 and WebBrain Compass 1.0 WebBrain planner benchmark - WebBrain Blog
ogTitle: >
  MiniMax M3 and WebBrain Compass 1.0 in WebBrain's frozen planner bench
ogDescription: >
  Two new hosted OpenAI-compatible runs join the WebBrain first-tool benchmark: MiniMax M3 via OpenRouter and WebBrain Compass 1.0 via api.webbrain.one.
twitterTitle: >
  MiniMax M3 and WebBrain Compass 1.0 planner benchmark
twitterDescription: >
  MiniMax M3: 75% Sonnet alignment. WebBrain Compass 1.0: 73%. Same frozen 41-tool WebBrain harness.
keywords:
  - WebBrain
  - MiniMax M3
  - WebBrain Compass
  - OpenRouter
  - browser agent
  - tool calling
  - Claude Sonnet
  - LLM benchmark
lede: >
  We added two hosted OpenAI-compatible planner runs to WebBrain's frozen first-tool benchmark: **minimax/minimax-m3** through OpenRouter and **webbrain-cloud 1.0** through `https://api.webbrain.one/v1`. The surprise is that MiniMax M3 does not beat the older MiniMax M2.7 result in this harness. WebBrain Compass lands close behind M3 on Sonnet alignment, costs much less for the replay, but was much slower on this endpoint path.
---

## What we ran

Both runs used the same 100 single-turn browser-agent prompts and the same frozen baseline we use for comparable planner results:

```bash
node test/llm/run-llamacpp.mjs \
  --base https://openrouter.ai/api/v1 \
  --model minimax/minimax-m3 \
  --tag 2026-06-21-openrouter-minimax-m3 \
  --concurrency 2 \
  --timeout 180000 \
  --no-save-request \
  --freeze test/llm/freeze/baseline-2026-05-23.json

node test/llm/run-llamacpp.mjs \
  --base https://api.webbrain.one/v1 \
  --model "webbrain-cloud 1.0" \
  --tag 2026-06-21-webbrain-cloud-final \
  --concurrency 1 \
  --timeout 180000 \
  --no-save-request \
  --freeze test/llm/freeze/baseline-2026-05-23.json
```

The compatibility anchor is the frozen May 23, 2026 Sonnet 4.6 WebBrain prompt and 41-tool schema, system hash `5c4fac1387025050`. These hosted endpoints both support native OpenAI structured tools, so the published runs used the old frozen toolset as native `tools`, not the text-call fallback used for local chat-template compatibility experiments.

Result files:

```text
test/llm/results/2026-06-21-openrouter-minimax-m3_chrome_minimax_minimax-m3_frozen
test/llm/results/2026-06-21-webbrain-cloud-final_chrome_webbrain-cloud_1.0_frozen
```

## Headline results

| Metric | MiniMax M3 via OpenRouter | WebBrain Compass 1.0 |
| --- | ---: | ---: |
| Completed cases | 100/100 | 100/100 |
| Transport errors | 0 | 0 |
| Parsed tool calls | 85/100 | 90/100 |
| Strict exact first-call match | 17/100 | 16/100 |
| Tool-name match vs ideal | 32/100 | 35/100 |
| Sonnet match, all cases | 75.0% | 73.0% |
| Sonnet match, when Sonnet tooled | 73.9% | 72.8% |
| Median latency | 3.1s | 8.8s |
| p95 latency | 8.2s | 47.1s |
| Total wall time | 214s at concurrency 2 | 1,388s at concurrency 1 |
| Reported run cost | $1.06 | $0.12 |

The clean read: MiniMax M3 is a solid hosted planner, but it is not an upgrade over our saved MiniMax M2.7 result for this specific first-tool benchmark. WebBrain Compass 1.0 is slightly weaker on Sonnet alignment, but it is cheaper in the reported usage fields and produced more parsed tool calls.

Latency needs one caveat. MiniMax M3 ran with concurrency 2, matching the older OpenRouter-style run. WebBrain Compass had to run with concurrency 1; a concurrency-2 attempt produced transport failures from this environment. So compare the median per-case latency directly, but treat wall time as endpoint-path-specific.

## MiniMax M3 vs MiniMax M2.7

This is the comparison I cared about most.

| Model | Parsed calls | Exact | Name | Sonnet all | Sonnet tooled | Median | Cost |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| MiniMax M2.7 | 88/100 | 23% | 36% | 77.0% | 76.1% | 3.1s | $0.16 |
| MiniMax M3 | 85/100 | 17% | 32% | 75.0% | 73.9% | 3.1s | $1.06 |

M3 did not regress catastrophically. It still tracks Sonnet better than most local runs. But the older M2.7 result remains stronger on every quality metric we publish here: more parsed tool calls, more exact first actions, higher tool-name agreement, and better Sonnet alignment. M3 also reported a much higher cost for this replay.

That does not mean M3 is the weaker model in general. This is a narrow first-tool browser-agent routing harness, frozen to an older WebBrain schema. It does mean we should not silently replace M2.7 with M3 in the planner table just because the model name is newer.

## WebBrain Compass 1.0

WebBrain Compass 1.0 came in just below MiniMax M3 on Sonnet alignment:

| Model | Parsed calls | Exact | Name | Sonnet all | Sonnet tooled | Median | Cost |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| MiniMax M3 | 85/100 | 17% | 32% | 75.0% | 73.9% | 3.1s | $1.06 |
| WebBrain Compass 1.0 | 90/100 | 16% | 35% | 73.0% | 72.8% | 8.8s | $0.12 |

The profile is different. WebBrain Compass produced more tool calls and a slightly better ideal tool-name score than M3, but it aligned less often with Sonnet's first-tool choices and had much higher latency in this run. It also reported a much lower cost for the 100-case replay.

For product use, this is a reasonable default-cloud profile: cheap, OpenAI-compatible, native tool-capable, and close enough to the top hosted planner tier to be useful. For the benchmark leaderboard, it sits below MiniMax M3 and above the Qwen 3.5 4B row on the all-case Sonnet score.

## Updated Sonnet 4.6 comparison

This table uses the saved Claude Sonnet 4.6 run as the first-tool reference. "Match all" counts all 100 prompts. "Match when Sonnet tooled" counts only the 92 prompts where Sonnet emitted a tool call. "Exact" and "Name" are the stricter replay against `expected/NNN.json`, not the Sonnet reference.

| # | Model | Match all | Match when Sonnet tooled | Tool-call rate | Valid-name rate | Exact | Name | Median |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| ref | Claude Sonnet 4.6 | 100.0% | 100.0% | 92% | 92% | 19% | 41% | 2.8s |
| 1 | Gemma 4 31B QAT w4a16 | 77.0% | 78.3% | 95% | 95% | 19% | 37% | 0.55s |
| 2 | Qwen 3.6 27B | 77.0% | 77.2% | 92% | 92% | 18% | 37% | 10.2s |
| 3 | MiniMax M2.7 | 77.0% | 76.1% | 88% | 88% | 23% | 36% | 3.1s |
| 4 | MiniMax M3 | 75.0% | 73.9% | 85% | 85% | 17% | 32% | 3.1s |
| 5 | Intel Gemma 4 31B int4 AutoRound | 74.0% | 72.8% | 88% | 88% | 14% | 34% | 0.63s |
| 6 | WebBrain Compass 1.0 | 73.0% | 72.8% | 90% | 90% | 16% | 35% | 8.8s |
| 7 | Qwen 3.5 4B | 73.0% | 71.7% | 82% | 82% | 12% | 33% | 5.5s |
| 8 | Gemma 4 26B-A4B | 71.0% | 70.7% | 87% | 87% | 13% | 30% | 1.4s |
| 9 | Qwen 3.6 35B-A3B | 70.0% | 70.7% | 90% | 90% | 18% | 38% | 10.3s |
| 10 | Qwen 3.5 9B | 70.0% | 69.6% | 90% | 90% | 15% | 35% | 0.91s |
| 11 | Gemma 4 E4B | 68.0% | 68.5% | 87% | 87% | 14% | 35% | 4.5s |
| 12 | Nemotron Omni 30B | 67.0% | 68.5% | 93% | 93% | 16% | 36% | 2.6s |
| 13 | Gemma 4 12B QAT w4a16 | 67.0% | 67.4% | 92% | 92% | 14% | 33% | 0.43s |
| 14 | DiffusionGemma 26B-A4B | 67.0% | 64.1% | 79% | 79% | 10% | 26% | 0.35s |
| 15 | Gemma 4 E2B | 63.0% | 60.9% | 76% | 76% | 12% | 31% | 4s |
| 16 | Gemma 4 12B Coder Fable5 Composer 2.5 | 61.0% | 62.0% | 94% | 94% | 9% | 26% | 1.9s |
| 17 | Cohere North-Mini-Code 1.0 | 59.0% | 58.7% | 93% | 93% | 9% | 24% | 3.2s |
| 18 | Browser-Use Qwen 30B-A3B Q4 | 43.0% | 45.7% | 93% | 88% | 12% | 35% | 0.48s |
| 19 | LFM 2.5 | 40.0% | 38.0% | 83% | 83% | 4% | 23% | 6s |
| 20 | Qwen 3.5 0.8B | 37.0% | 34.8% | 90% | 90% | 7% | 15% | 0.45s |
| 21 | Qwen 3.5 2B | 36.0% | 34.8% | 89% | 89% | 4% | 7% | 0.78s |
| 22 | VibeThinker 3B BF16 | 33.0% | 32.6% | 84% | 83% | 2% | 19% | 5s |
| 23 | Molmo2 8B | 8.0% | 0.0% | 2% | 1% | 0% | 0% | 1.7s |

The top of the table is getting crowded, but the conclusion did not change. The best saved Sonnet-alignment result is still the Gemma 4 31B QAT / Qwen 3.6 27B / MiniMax M2.7 cluster. MiniMax M3 joins just below that cluster. Because M3 is roughly double the size of M2.7, that result is hard to justify for this job: larger, more expensive, and weaker on the frozen planner run is not a worthwhile trade.

WebBrain Compass 1.0 sits one row lower, but it is the more useful product story here. It is a good entrant with a free tier, and it gives people a working WebBrain path when they do not have a local LLM ready. It should also keep improving as we tune the browser-side optimizations around the hosted route.

## What changes

For hosted planner routing, I would keep MiniMax M2.7 in the table ahead of MiniMax M3 until M3 wins a rerun with a newer prompt or a different tool format. M3 is good, but the frozen WebBrain result does not justify a default-model change, especially when the newer model is about twice the size.

For WebBrain Compass, the result is more product-facing than leaderboard-facing. It passed the old structured tool interface cleanly, completed all 100 cases without transport errors in the final run, and stayed close to the hosted MiniMax tier on Sonnet alignment. The latency needs endpoint work, but the quality/cost shape is usable, and the free tier makes it a practical default for anyone who wants to try WebBrain before setting up a local model.

The next fair test is the current production prompt and tool schema, not the May 23 frozen one. The frozen run answers "how does it compare with our historical rows?" The live-schema run answers "what should WebBrain route to today?"

Tags: #MiniMaxM3 #WebBrainCloud #OpenRouter #ToolCalling #BrowserAgent #LLMBenchmark
