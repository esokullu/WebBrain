---
title: >
  Introducing WebBrain Compass Tiny: edge-sized Compact tool routing for WebBrain
slug: webbrain-compass-tiny-v1
sortOrder: -281
date: 2026-09-05
readTime: 6 min read
description: >
  WebBrain Compass Tiny v1 is a private 2.6B WebBrain Compact-model preview. In our first routing suite it ties Qwen3.6-35B-A3B on tool-name conformity, improves the same local LFM2.5 base model by four routing outcomes, and keeps the model small enough for edge-oriented deployment.
excerpt: >
  A 2.6B model is not a 35B general-reasoning replacement. But in the narrow, production-shaped WebBrain Compact routing loop, Compass Tiny v1 reaches the same tool-name conformity as Qwen3.6-35B-A3B and improves its matched local base model by four routing outcomes.
titleTag: >
  Introducing WebBrain Compass Tiny v1 - WebBrain Blog
ogTitle: >
  WebBrain Compass Tiny v1: Compact browser-tool routing at the edge
ogDescription: >
  A first look at WebBrain's 2.6B Compact model preview, its tool-routing benchmark, and the road toward open weights.
twitterTitle: >
  WebBrain Compass Tiny v1: an edge-sized Compact model
twitterDescription: >
  Compass Tiny v1 ties a 35B Qwen model on WebBrain Compact tool-name routing. More tests and v1.1/v2 work are coming.
keywords:
  - WebBrain Compass Tiny
  - browser agent
  - tool calling
  - compact mode
  - edge AI
  - LFM2.5
  - Qwen
author: Emre Sokullu
authorUrl: https://emresokullu.com
lede: >
  **WebBrain Compass Tiny v1 is our first edge-sized model built specifically for the Compact browser-tool loop.** It is not a claim that 2.6B parameters equal a 35B model at general reasoning. It is evidence that a focused, grounded routing policy can make a small model useful inside a real browser agent: in this first suite, Compass ties Qwen3.6-35B-A3B on the expected tool name and improves the matched local LFM2.5-2.6B base model by four routing outcomes. Qwen3.8-27B remains the quality leader when its cost and footprint fit the deployment.
---

## The short version

Compass Tiny v1 is a **private preview** today. We are preparing an open-weights release so it can be downloaded and run locally, subject to the remaining release, provenance, and packaging checks. Until that work is complete, it is not a public download and this article should not be read as a release announcement.

The model is tuned for three Compact behaviors in WebBrain:

1. Answer or ask a clarifying question when that is the justified next step.
2. Emit a grounded Compact tool call when the page context supports it.
3. Abstain or escalate when direct execution would be unjustified.

That is deliberately narrower than “be a universally smarter model.” It is the right narrowness for a browser agent that must choose a next action from a constrained toolset.

## What we measured

We ran the current Compact Chrome suite: 100 first-action cases and 100 stateful scenarios. Eleven scenarios are intentionally out of scope for Compact and are excluded from the scenario-quality denominator, leaving 89 scored scenarios.

The table uses two different signals:

- **Exact reference action** means the tool and arguments matched the canonical next action.
- **Expected tool name** credits the expected tool even when arguments differ. It is useful for measuring routing, but it is not a completed browser task.

The exact reference is a Sonnet-authored canonical next action. It is a regression-oriented reference, not an oracle for every reasonable live-browser strategy: a careful model may inspect before a direct click, for example. That distinction matters here.

| Model | Parameters | First-turn structured calls | Exact reference action (of 89) | Expected tool name (of 89) |
| --- | ---: | ---: | ---: | ---: |
| Qwen3.8-27B | 27B | **99 / 100** | **17** | 39 |
| Qwen3.6-35B-A3B | 35B A3B | 89 / 100 | 15 | **42** |
| **WebBrain Compass Tiny v1** | **2.6B** | **81 / 100** | 4 | **42** |
| LFM2.5-2.6B base (local) | 2.6B | 80 / 100 | 4 | 38 |
| Qwen3.5-9B | 9B | 84 / 100 | 2 | 12 |

Compass therefore does not beat the 35B model on the strict reference. It **matches it on tool-name routing** in this Compact suite. It also exceeds the 9B Qwen result by 30 expected-tool-name outcomes and the matched local LFM base model by four. Those are promising results for a model intended to live near the edge of the product, where size, VRAM, latency, and controllability matter as much as raw general capability.

## The controlled base-model comparison

The base-model row is the comparison we care about most. We served the pinned `LiquidAI/LFM2.5-2.6B` base revision locally through the same vLLM version, LFM2 parser, tokenizer, BF16 precision, 32K context window, Compact prompt, tools, and benchmark harness used for Compass.

The base model produced 80 first-turn structured calls, four exact-reference scenario actions, and 38 expected-tool-name outcomes. Compass produced 81, four, and **42** respectively. In this deliberately narrow measurement, the fine-tune does not change the exact-reference count, but it adds **four** expected Compact routing outcomes.

That is a useful, bounded result: Compass is not claiming a broad general-intelligence jump over its base. It is demonstrating that WebBrain-specific training can move the next-action routing policy in the desired direction without making the model larger.

## Why Qwen3.8 is still the default quality choice

Qwen3.8-27B remains the best model in this comparison if the budget and deployment footprint are acceptable. It has the highest exact-reference score, almost universal first-turn tool-call emission, and fast scenario completion in this run.

Compass is not positioned as a replacement for that class. The point is different: **a 2.6B specialist can already be useful for a well-scoped WebBrain Compact decision**, rather than forcing every low-risk browser step through a much larger planner.

Qwen3.6-35B-A3B remains an important reference point too. Its tie with Compass on expected tool name should not be over-read as equal general intelligence. It is evidence of task specialization, not a claim about broad reasoning, coding, knowledge, multilingual breadth, or long-horizon browser reliability.

## A note on the public free route

We also exercised the public `liquid/lfm-2.5-2.6b:free` route on OpenRouter as an availability probe. Its scenario service was not stable enough to rank: it returned intermittent provider errors even when requests were serialized. It is therefore excluded from the table above. The local, pinned base comparison is the relevant fine-tune baseline.

## What happens next

This is the beginning of the evaluation, not the end of it. We are adding more browser surfaces, longer trajectories, tool-result recovery, calibrated escalation behavior, and broader multilingual cases. The first locally hosted base-LFM comparison now gives us a controlled fine-tune baseline; the next work is to broaden it.

The working roadmap includes Compass **v1.1** and eventually **v2**, with more data, more targeted evaluations, and clearer release artifacts. We hope that work turns this private preview into a useful open-weights option for teams that want WebBrain-native Compact behavior without making a large cloud model the only route for every action.

## Reproducibility notes

The comparison used the same Compact Chrome harness and structured tool schemas for every listed model. The runner captures the next response; it does not execute the browser action, so these figures are routing metrics rather than end-to-end success rates. Provider routes, sampling behavior, and model revisions can change, so these results should be read as a dated benchmark snapshot rather than a permanent leaderboard.

More evaluation results will follow as the suite grows.

Tags: #WebBrain #CompassTiny #BrowserAgent #ToolCalling #EdgeAI #CompactMode #LFM25 #OpenWeights
