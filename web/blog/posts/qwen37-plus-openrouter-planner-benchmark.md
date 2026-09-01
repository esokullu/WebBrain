---
title: >
  Qwen 3.7 Plus is a serious OpenRouter rival to MiniMax M3
slug: qwen37-plus-openrouter-planner-benchmark
sortOrder: -5
date: 2026-07-02
readTime: 6 min read
description: >
  We ran qwen/qwen3.7-plus through WebBrain's frozen 100-case browser-agent planner benchmark on OpenRouter. It ties MiniMax M3 on all-case Sonnet alignment, beats it on tool-call discipline, and lands just below the Gemma 4 31B QAT, Qwen 3.6 27B, and MiniMax M2.7 cluster.
excerpt: >
  Qwen 3.7 Plus reached 75/100 Sonnet alignment, 95/100 parsed native tool calls, and the best ideal tool-name score in the top hosted slice of WebBrain's frozen planner table.
titleTag: >
  Qwen 3.7 Plus OpenRouter WebBrain planner benchmark - WebBrain Blog
ogTitle: >
  Qwen 3.7 Plus challenges MiniMax M3 in WebBrain's planner benchmark
ogDescription: >
  Qwen 3.7 Plus ties MiniMax M3 on all-case Sonnet alignment, beats it on parsed calls and ideal tool-name matches, and stays close to the top Gemma and Qwen rows.
twitterTitle: >
  Qwen 3.7 Plus WebBrain planner benchmark
twitterDescription: >
  Qwen 3.7 Plus via OpenRouter: 95 parsed calls, 75% Sonnet alignment, and a strong MiniMax M3 comparison.
keywords:
  - WebBrain
  - Qwen 3.7 Plus
  - OpenRouter
  - MiniMax M3
  - MiniMax M2.7
  - Gemma 4 31B
  - Qwen 3.6 27B
  - browser agent
  - planner benchmark
  - tool calling
lede: >
  We ran **qwen/qwen3.7-plus** through WebBrain's frozen 100-case browser-agent first-tool benchmark on OpenRouter. The headline is not that it beats every saved row. It does not. The interesting result is more specific: Qwen 3.7 Plus looks like a better direct OpenRouter competitor to MiniMax M3, while still sitting just below the strongest Gemma 4 31B QAT, Qwen 3.6 27B, and MiniMax M2.7 rows.
---

## What we ran

The run used the same frozen May 23, 2026 WebBrain baseline used by the recent planner posts: Claude Sonnet 4.6's system prompt and 41-tool schema, system hash `5c4fac1387025050`.

```bash
node test/llm/run-llamacpp.mjs \
  --base https://openrouter.ai/api/v1 \
  --model qwen/qwen3.7-plus \
  --tag 2026-07-02-openrouter-qwen37-plus \
  --concurrency 3 \
  --timeout 180000 \
  --no-save-request \
  --freeze test/llm/freeze/baseline-2026-05-23.json
```

This was a native OpenAI structured-tools run. No chat-template fallback was used, and request payloads were not saved.

Result files:

```text
test/llm/results/2026-07-02-openrouter-qwen37-plus_chrome_qwen_qwen3.7-plus_frozen
```

## Headline result

| Metric | Qwen 3.7 Plus via OpenRouter |
| --- | ---: |
| Completed cases | 100/100 |
| Transport errors | 0 |
| Parsed tool calls | 95/100 |
| Valid frozen-schema tool names | 95/95 |
| Strict exact first-call match | 19/100 |
| Ideal tool-name match | 41/100 |
| Sonnet match, all cases | 75.0% |
| Sonnet match, when Sonnet tooled | 77.2% |
| Average latency | 4.25s |
| Median latency | 3.74s |
| p95 latency | 7.76s |
| Slowest case | 15.35s |
| Total wall time | 143s at concurrency 3 |
| OpenRouter reported cost | $0.14 |

The clean read: this is a very healthy hosted tool-calling row. The model completed the full suite, stayed inside the frozen tool schema on every parsed tool call, and matched Sonnet's first tool on 75 of 100 cases.

The standout number is the ideal tool-name score: 41/100. That ties the frozen Sonnet reference's own ideal-name count in this harness and is higher than the other saved top rows. The stricter exact-argument score is not a breakout, but the first-tool routing shape is strong.

## Against MiniMax M3

This is the most important comparison because both are hosted OpenRouter options in the same practical lane.

| Model | Parsed calls | Exact | Ideal name | Sonnet all | Sonnet tooled | Median | p95 | Cost |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| MiniMax M3 | 85/100 | 17/100 | 32/100 | 75.0% | 73.9% | 3.1s | 8.2s | $1.06 |
| Qwen 3.7 Plus | 95/100 | 19/100 | 41/100 | 75.0% | 77.2% | 3.74s | 7.76s | $0.14 |

Qwen 3.7 Plus and MiniMax M3 tie on the headline all-case Sonnet metric at 75/100. After that, Qwen's row is stronger almost everywhere that matters for WebBrain's first turn:

- 10 more parsed tool calls.
- 2 more exact expected first calls.
- 9 more ideal tool-name matches.
- Better Sonnet-tooled alignment, 77.2% versus 73.9%.
- Lower reported cost for this replay.

MiniMax M3 keeps a slightly better median latency in the saved run, but the difference is small enough that quality and cost dominate the decision. For WebBrain's frozen planner harness, Qwen 3.7 Plus is the better MiniMax M3 competitor.

## Against MiniMax M2.7

The older MiniMax row is still harder to beat.

| Model | Parsed calls | Exact | Ideal name | Sonnet all | Sonnet tooled | Median | Cost |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| MiniMax M2.7 | 88/100 | 23/100 | 36/100 | 77.0% | 76.1% | 3.1s | $0.16 |
| Qwen 3.7 Plus | 95/100 | 19/100 | 41/100 | 75.0% | 77.2% | 3.74s | $0.14 |

This one is mixed. Qwen 3.7 Plus is more parseable, has a better ideal-name score, and edges MiniMax M2.7 on the Sonnet-tooled subset. MiniMax M2.7 still wins the all-case Sonnet score and the strict exact-match score.

That means Qwen 3.7 Plus is not a clean replacement for M2.7 in the historical table. It is a clean challenge to M3. Against M2.7, it is a different profile: more native-tool consistency and better tool-required alignment, but less exact first-action agreement and two fewer all-case Sonnet matches.

## Against Gemma 4 31B QAT and Qwen 3.6 27B

The current top cluster is still the standard.

| Model | Parsed calls | Exact | Ideal name | Sonnet all | Sonnet tooled | Median |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Gemma 4 31B QAT w4a16 | 95/100 | 19/100 | 37/100 | 77.0% | 78.3% | 0.55s |
| Qwen 3.6 27B | 92/100 | 18/100 | 37/100 | 77.0% | 77.2% | 10.2s |
| Qwen 3.7 Plus | 95/100 | 19/100 | 41/100 | 75.0% | 77.2% | 3.74s |
| Qwen 3.6 27B NVFP4 | 96/100 | 18/100 | 38/100 | 74.0% | 77.2% | 1.76s |

Gemma 4 31B QAT remains the best saved local planner balance: it ties the top all-case score, has the best Sonnet-tooled score, and is dramatically faster locally. Qwen 3.7 Plus ties it on parsed calls and exact matches, and beats it on ideal tool-name count, but does not catch its Sonnet alignment or latency.

The Qwen family comparison is more interesting. Qwen 3.7 Plus does not beat the older Qwen 3.6 27B all-case row, but it matches its Sonnet-tooled alignment, improves exact and ideal-name scores, and is much faster in this OpenRouter path than the old local saved row. Against the newer Qwen 3.6 27B NVFP4 run, Qwen 3.7 Plus wins on all-case Sonnet alignment, exact match, and ideal-name score, while NVFP4 wins on parsed-call count and local latency.

In short: Qwen 3.7 Plus is the strongest Qwen row by ideal-name routing, but not the strongest Qwen row by the all-case Sonnet metric.

## Where it is strong

The tool distribution is clean:

| Tool or output | First calls |
| --- | ---: |
| `get_accessibility_tree` | 41 |
| `navigate` | 20 |
| `clarify` | 6 |
| `read_page` | 6 |
| no tool call | 5 |
| `execute_js` | 4 |
| `download_file` | 2 |
| `download_social_media` | 2 |
| `extract_data` | 2 |
| `list_downloads` | 2 |
| `new_tab` | 2 |
| `screenshot` | 2 |

The strongest category bands were ordinary browser work:

| Category | Sonnet matches |
| --- | ---: |
| Direct navigation | 10/10 |
| Page reading / summarize | 7/8 |
| Forms / interactive | 7/8 |
| Email | 5/6 |
| Downloads | 5/6 |
| GitHub flows | 4/6 |

That is the profile I want from a browser planner: it reads pages, navigates correctly, and picks valid WebBrain tools without format drama.

## Where it loses points

The weaker bands are also familiar:

| Category | Sonnet matches | Pattern |
| --- | ---: | --- |
| Search | 7/10 | Sometimes inspected the current page before navigating directly to search. |
| Ambiguous / clarify | 4/8 | Split between no-tool answers, clarify, and page inspection. |
| Destructive / refusal-worthy | 4/6 | Better than many rows, but still not perfectly aligned with confirmation boundaries. |
| Knowledge questions | 2/5 | Sometimes used `done`, sometimes no-tooled, and used a browser tool for the current-time question. |
| Tab management | 2/4 | The missing browser-tab primitive still creates awkward first moves. |
| UI mutations | 2/4 | Mixed `execute_js`, `press_keys`, and navigation choices. |

This explains the gap between its excellent ideal tool-name score and its merely good all-case Sonnet score. Qwen 3.7 Plus is strong when a tool should be used. It is less perfectly Sonnet-like on boundaries: ambiguous user intent, no-browser-needed answers, and browser-control gaps.

## Current top slice

Rows are ranked by all-case Sonnet match, then Sonnet-tooled match.

| # | Model | Parsed calls | Exact | Ideal name | Sonnet all | Sonnet tooled | Median |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | Gemma 4 31B QAT w4a16 | 95/100 | 19/100 | 37/100 | 77.0% | 78.3% | 0.55s |
| 2 | Qwen 3.6 27B | 92/100 | 18/100 | 37/100 | 77.0% | 77.2% | 10.2s |
| 3 | MiniMax M2.7 | 88/100 | 23/100 | 36/100 | 77.0% | 76.1% | 3.1s |
| 4 | **Qwen 3.7 Plus** | **95/100** | **19/100** | **41/100** | **75.0%** | **77.2%** | **3.74s** |
| 5 | MiniMax M3 | 85/100 | 17/100 | 32/100 | 75.0% | 73.9% | 3.1s |
| 6 | Qwen 3.6 27B NVFP4 | 96/100 | 18/100 | 38/100 | 74.0% | 77.2% | 1.76s |
| 7 | Intel Gemma 4 31B int4 AutoRound | 88/100 | 14/100 | 34/100 | 74.0% | 72.8% | 0.63s |
| 8 | WebBrain Compass 1.0 | 90/100 | 16/100 | 35/100 | 73.0% | 72.8% | 8.8s |

This is a nice result, but it is not a new overall winner. The top three all have 77/100 all-case Sonnet alignment. Qwen 3.7 Plus lands one row below that cluster and wins the tiebreaker against MiniMax M3.

## Bottom line

The conclusion depends on which comparison matters.

Against **MiniMax M3**, Qwen 3.7 Plus looks better for WebBrain's planner job. It ties M3 on all-case Sonnet alignment and beats it on parsed calls, exact matches, ideal-name matches, Sonnet-tooled alignment, and reported run cost. If the decision is "which OpenRouter-hosted model should compete with MiniMax M3 for browser-agent routing?", Qwen 3.7 Plus is the stronger row in this frozen run.

Against **MiniMax M2.7**, the answer is more cautious. M2.7 still has the better all-case score and exact-match score. Qwen 3.7 Plus is cleaner and more tool-eager, but M2.7 remains the stronger historical MiniMax reference.

Against **Gemma 4 31B QAT** and **Qwen 3.6 27B**, Qwen 3.7 Plus is close but not ahead. Gemma 4 31B QAT still has the best saved local quality-speed balance. The old Qwen 3.6 27B row still has the stronger all-case Sonnet score. Qwen 3.7 Plus earns its place by being hosted, native-tool-capable, cheaper than the saved M3 replay, and unusually good at choosing the ideal tool name.

So the practical take is: Qwen 3.7 Plus is not the new WebBrain planner king, but it is a very serious OpenRouter candidate and a better MiniMax M3 rival than I expected. For users who want a hosted model with clean structured tools, it belongs in the shortlist.

Tags: #Qwen37 #OpenRouter #MiniMaxM3 #MiniMaxM27 #Gemma4 #Qwen36 #ToolCalling #BrowserAgent #WebBrain
