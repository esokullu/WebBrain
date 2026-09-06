---
title: >
  Introducing WebBrain Compass Tiny: edge-sized Compact tool routing for WebBrain
slug: webbrain-compass-tiny-v1
sortOrder: -281
date: 2026-09-05
readTime: 6 min read
description: >
  WebBrain Compass Tiny v1 is a private preview of a 2.6B model built for WebBrain's Compact tool loop. In our first routing suite it matches Qwen3.6-35B-A3B on tool-name conformity and beats the local LFM2.5 base model it was trained from by eight routing outcomes, at a size meant for edge deployment.
excerpt: >
  A 2.6B model does not replace a 35B one at general reasoning. But inside WebBrain's narrow, production-shaped Compact routing loop, Compass Tiny v1 hits the same tool-name conformity as Qwen3.6-35B-A3B and beats its matched local base model by eight routing outcomes.
titleTag: >
  Introducing WebBrain Compass Tiny v1 - WebBrain Blog
ogTitle: >
  WebBrain Compass Tiny v1: Compact browser-tool routing at the edge
ogDescription: >
  A first look at WebBrain's 2.6B Compact model preview, its tool-routing benchmark, and what an open-weights release would take.
twitterTitle: >
  WebBrain Compass Tiny v1: an edge-sized Compact model
twitterDescription: >
  Compass Tiny v1 matches a 35B Qwen model on WebBrain Compact tool-name routing. More tests and v1.1/v2 work are coming.
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
  **WebBrain Compass Tiny v1 is our first edge-sized model built for the Compact browser-tool loop.** We are not claiming that 2.6B parameters match a 35B model at general reasoning. What this first suite shows is narrower: a focused, grounded routing policy can make a small model useful inside a real browser agent. Compass matches Qwen3.6-35B-A3B at picking the expected tool name, and it beats the LFM2.5-2.6B base model it was trained from by eight routing outcomes. Qwen3.8-27B is still the quality leader wherever its cost and footprint fit.
---

## The short version

Compass Tiny v1 is a private preview today. We are preparing an open-weights release so it can be downloaded and run locally, once the remaining release, provenance, and packaging checks are done. Until that work is finished it is not a public download, and this article is not a release announcement.

The model is tuned for three Compact behaviors in WebBrain:

1. Answer or ask a clarifying question when that is the justified next step.
2. Emit a grounded Compact tool call when the page context supports it.
3. Abstain or escalate when direct execution would be unjustified.

That is narrower than "be a universally smarter model," and the narrowness is the point. A browser agent has to choose its next action from a constrained toolset.

## What we measured

We ran the current Compact Chrome suite: 100 first-action cases and 100 stateful scenarios. Eleven of the scenarios are intentionally out of scope for Compact, so they are excluded from the scenario-quality denominator. That leaves 89 scored scenarios.

The table reports two different signals. Exact reference action means the tool and the arguments matched the canonical next action. Expected tool name credits the model for reaching for the right tool even when the arguments differ, which measures routing rather than a completed browser task.

The canonical next action was authored by Sonnet. It works as a regression reference, not as an oracle for every reasonable live-browser strategy: a careful model might inspect something before clicking it directly. Keep that in mind when reading the exact-reference column.

| Model | Parameters | First-turn structured calls | Exact reference action (of 89) | Expected tool name (of 89) |
| --- | ---: | ---: | ---: | ---: |
| Qwen3.8-27B | 27B | **99 / 100** | **17** | 39 |
| Qwen3.6-35B-A3B | 35B A3B | 89 / 100 | 15 | **42** |
| **WebBrain Compass Tiny v1** | **2.6B** | **81 / 100** | 4 | **42** |
| LFM2.5-2.6B base (local) | 2.6B | 80 / 100 | 4 | 34 |
| Qwen3.5-9B | 9B | 84 / 100 | 2 | 12 |

So Compass does not beat the 35B model on the strict reference. It matches it on tool-name routing in this Compact suite. It also lands 30 expected-tool-name outcomes above the 9B Qwen and eight above the local LFM base model. For a model meant to run near the edge of the product, where size, VRAM, latency, and controllability count for as much as raw general capability, that is a good starting position.

## The controlled base-model comparison

The base-model row is the comparison we care about most. We served the pinned `LiquidAI/LFM2.5-2.6B` base revision locally through the same vLLM version, LFM2 parser, tokenizer, BF16 precision, 32K context window, Compact prompt, tools, and benchmark harness we used for Compass.

The base model produced 80 first-turn structured calls, four exact-reference scenario actions, and 34 expected-tool-name outcomes. Compass produced 81, four, and 42. In this deliberately narrow measurement the fine-tune leaves the exact-reference count where it was and adds eight expected Compact routing outcomes.

That is a bounded result and we would rather report it as one. Compass is not making a broad general-intelligence jump over its base. WebBrain-specific training moved the next-action routing policy in the direction we wanted, without making the model any bigger.

## Where the larger models still win

Qwen3.8-27B is the best model in this comparison if its budget and deployment footprint are acceptable. It has the highest exact-reference score, it emits a first-turn tool call almost every time, and it completed scenarios quickly in this run.

Compass is not positioned as a replacement for that class. The claim is smaller: a 2.6B specialist can already handle a well-scoped WebBrain Compact decision, so every low-risk browser step no longer has to go through a much larger planner.

Qwen3.6-35B-A3B is an important reference point too, and its tie with Compass on expected tool name should not be over-read as equal general intelligence. It is evidence of task specialization. It says nothing about broad reasoning, coding, knowledge, multilingual breadth, or long-horizon browser reliability.

## What happens next

The evaluation is just getting started. We are adding more browser surfaces, longer trajectories, tool-result recovery, calibrated escalation behavior, and broader multilingual cases.

The working roadmap has Compass v1.1 and eventually v2, with more data, more targeted evaluations, and clearer release artifacts. If that work lands, this private preview becomes an open-weights option for teams that want WebBrain-native Compact behavior without routing every action through a large cloud model.

## Reproducibility notes

Every model in the table ran against the same Compact Chrome harness and the same structured tool schemas. The runner captures the next response and does not execute the browser action, so these figures are routing metrics rather than end-to-end success rates. Provider routes, sampling behavior, and model revisions all change over time, so read this as a dated benchmark snapshot rather than a standing leaderboard.

Tags: #WebBrain #CompassTiny #BrowserAgent #ToolCalling #EdgeAI #CompactMode #LFM25 #OpenWeights
