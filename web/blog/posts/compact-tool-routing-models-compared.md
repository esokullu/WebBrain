---
title: >
  Compact tool routing compared: 11 models, from 2B to 35B
slug: compact-tool-routing-models-compared
sortOrder: -282
date: 2026-09-07
readTime: 3 min read
description: >
  An updated WebBrain Compact benchmark table comparing Compass Tiny with Gemma 4, Qwen 3.5, Qwen 3.6, Qwen 3.8, Nanbeige, and the LFM2.5 base model.
excerpt: >
  Six new local runs expand the Compact comparison. Qwen3.8-27B leads strict exact-action accuracy, while a looser name-only-inclusive metric produces a different ordering.
titleTag: >
  Compact Tool Routing: 11 Models Compared - WebBrain Blog
ogTitle: >
  Compact tool routing: 11 models compared
ogDescription: >
  The latest WebBrain Compact routing results for Compass Tiny, Gemma 4, Qwen, Nanbeige, and LFM2.5.
twitterTitle: >
  Compact tool routing: the updated WebBrain table
twitterDescription: >
  Eleven models from 2B to 35B, measured on the same Compact browser-tool suite.
keywords:
  - browser agent benchmark
  - tool calling
  - WebBrain Compact
  - Gemma 4
  - Qwen 3.5
  - WebBrain Compass Tiny
author: Emre Sokullu
authorUrl: https://emresokullu.com
lede: >
  **We added six local models to the WebBrain Compact routing benchmark.** The updated table now spans 11 models from 2B to 35B. Qwen3.8-27B leads strict exact-action accuracy and first-turn structured-call coverage. A separate, looser tool-family measure produces a different ordering, but should not be read as end-to-end scenario success.
---

## Updated results

The suite contains 100 first-turn prompts and 100 stateful scenarios. Eleven scenarios are intentionally outside Compact mode, leaving 89 scored scenarios. **Strict exact action** requires both the reference tool name and its arguments to match. **Loose tool-family match** also gives credit for name-only matches and terminal prose mapped to the expected tool family; it is diagnostic, not a task-success score.

| Model | Parameters | First-turn structured calls | **Strict exact action (/89)** | Loose tool-family match (/89) | Loose match rate |
| --- | ---: | ---: | ---: | ---: | ---: |
| Qwen3.8-27B | 27B | **99 / 100** | **17** | 39 | 43.8% |
| Qwen3.5-4B | 4B | 89 / 100 | 16 | 36 | 40.4% |
| Qwen3.6-35B-A3B | 35B A3B | 89 / 100 | 15 | 42 | 47.2% |
| Gemma 4 E4B | 7.5B | 90 / 100 | 15 | 43 | 48.3% |
| Nanbeige4.2-3B | 4.2B reported | 89 / 100 | 13 | 37 | 41.6% |
| Gemma 4 12B QAT | 12B | 90 / 100 | 12 | 34 | 38.2% |
| Qwen3.5-2B | 2B | 92 / 100 | 11 | 28 | 31.5% |
| Gemma 4 E2B | 4.6B | 74 / 100 | 8 | **45** | **50.6%** |
| **WebBrain Compass Tiny v1** | **2.6B** | 81 / 100 | 4 | 42 | 47.2% |
| LFM2.5-2.6B base | 2.6B | 80 / 100 | 4 | 34 | 38.2% |
| Qwen3.5-9B | 9B | 84 / 100 | 2 | 12 | 13.5% |

## What stands out

- Qwen3.8-27B has the strongest strict exact-action result and the highest first-turn structured-call rate.
- Gemma 4 E2B tops only the loose measure: 8 of its 45 credited outcomes are exact, while 37 are name-only or equivalent prose credits. Qwen3.8 records 17 exact outcomes and 22 additional loose matches.
- Model size alone is not the story, but neither is the loose ranking. The strict and loose columns measure different behavior and should be read together.

## Notes

The six new rows—Gemma 4 E2B, Gemma 4 E4B, Gemma 4 12B QAT, Nanbeige4.2-3B, Qwen3.5-4B, and Qwen3.5-2B—were run locally as 4-bit models through LM Studio. Concurrency varied from one to four, so this is a quality table, not a speed comparison. The displayed E4B row is its second concurrency-2 run; the first produced 13 exact and 42 loose matches, illustrating modest run-to-run variance.

The runner records the model’s next response without executing the browser action. These are routing results, not end-to-end task-completion rates. The Sonnet-authored reference action is a regression target rather than an oracle: a cautious model may reasonably inspect before acting. In the paired E2B/Qwen3.8 comparison, all 19 scenarios credited only to E2B were loose `ideal_name` outcomes, not exact action-and-argument matches.

Tags: #WebBrain #BrowserAgent #ToolCalling #CompactMode #Gemma4 #Qwen #CompassTiny
