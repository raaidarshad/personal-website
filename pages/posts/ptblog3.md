---
title: Standup + OKRs week 3
date: 2021/10/17
description: Standup and OKR logs for Pop the Bubble week 3
tag: project, log, popthebubble
author: Raaid
---

This is still second priority to my other project at the moment, so will continue to post updates but I won't be working on this everyday/as much. Still focusing on refactors/deployment.

## OKRs
Current period ends December 31, 2021.

### Mission
Agree on reality: Get U.S. online news readers on the same page with regards to reality.

### Objective
Provide bias-aware slow news to online readers who don't want to be in a news bubble.

### Current priorities
- *P1* Figure out and execute consistent way to present clusters
- *P1* Clean/improve/debug pipelines, DB structure, and deployment (just dpeloyment left now!)

### Next-up priorities
- *P1* Create and launch mail option
- *P2* Revamp the "support" option on website
- *P2* Add other ratings besides AllSides
- *P2* Experiment with own bias rating methodology
- *P2* Add more sources
- *P3* Find first sponsor for email
- *P1* Create and launch Instagram option with "weekly summary" posts
- *P2* Make BubblePopper tool V0

### Key requirements
1. Get 50 hits/day on website. Current by CloudFlare: ~20/day, Plausible: <1/day. Confidence to achieve: 3/10
2. Get 25 mail list subscribers. Current: 0 subscribers. Confidence to achieve: 4/10
3. Get 25 Instagram followers. Current: 0 followers. Confidence to achieve: 4/10

### Health metrics
- Me: Green
- Costs: Yellow

### Week's successes
- Finished clustering refactor

## Standup logs


### Monday

**What did you do yesterday?** Did some extraction pipeline refactors and testing while traveling.

**What will you do today?** Refactor downstream pipelines, namely the cluster computations. Need to segment out steps a little more sensibly, and make it easy to create pipelines that are essentially the same but where the clustering step is different (i.e. uses a different algorithm). So refactor, add more configuration, add more logging, and add tests.

**What, if anything, is blocking your progress?** Time? Idk.


### Tuesday

**What did you do yesterday?** Made a wee bit of progress on refactoring the clustering pipeline, dedicated more time to non-work things.

**What will you do today?** Aim to finish refactoring the clustering pipeline!

**What, if anything, is blocking your progress?** Nada.

### Wednesday

**What did you do yesterday?** Finished refactoring the clustering pipeline and added tests for it.

**What will you do today?** Work on the other project.

**What, if anything, is blocking your progress?** N/A


Cheers,

+raaid
