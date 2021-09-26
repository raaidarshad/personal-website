---
title: Standup + OKRs week 0
date: 2021/9/24
description: Standup and OKR logs for Pop the Bubble week 0
tag: project, log, popthebubble
author: Raaid
---

I always found standup meetings at my previous jobs to be very helpful. It is a simple, daily check-in to see how you're progressing on the goals at hand, and I rather like the framing of it. SO I'm going to write these up daily then post them weekly, just so I have some space to publicly hold myself to account. I'm starting on a Thursday, so this week 0 will be short. I'll also throw in my OKR tracking (which I am VERY new at so it might not be that great) to contextualize my daily work.

## OKRs
Current period ends December 31, 2021.

### Mission
Agree on reality: Get everyone on the same page with regards to reality, particularly as represented by the news.

### Objective
Provide bias-aware slow news to online readers who don't want to be in a news bubble.

### Current priorities
- *P1* Finish ETL pipelines: 80 -> 100%
- *P1* Deploy ETL pipelines: 0 -> 100$
- *P1* Create and launch mail option: 0%
- *P2* Add Plausible Analytics: 0 -> 100%

### Next-up priorities
- *P2* Revamp the "support" option on website
- *P2* Add other ratings besides AllSides
- *P2* Add more sources
- *P1* Find first sponsor for email
- *P1* Create and launch Instagram option
- *P2* Make BubblePopper tool V0

### Key requirements
1. Get 50 hits/day on website. Current by CloudFlare: ~20/day, Plausible: not enough data yet. Confidence to achieve: 3/10
2. Get 25 mail list subscribers. Current: 0 subscribers. Confidence to achieve: 4/10
3. Get 25 Instagram followers. Current: 0 followers. Confidence to achieve: 5/10

### Health metrics
Don't have much to protect since we're just starting. Myself and my costs are the only things I can think of for now.
- Me: Green
- Costs: Yellow

### Week's successes
- The ETL pipelines are done and deployed! They're running! As we speak!
- Found a coworking space
- Started logging all this OKR and standup stuff
- Refined mission + objective

## Standup logs

### Thursday

**What did you do yesterday?** I battled with the Dagster Helm chart (messing with a custom values.yaml) until I was able to deploy it on my machine, then messed with my code deployment's docker image and the Postgres credentials until I was able to successfully run a pipeline. I successfully ran a pipeline!

**What will you do today?** I will verify that all 4 pipelines work on a local Helm deployment. I will also verify that the 1 schedule and the 3 sensors work as desired. If any of these don't work, the bulk of my day will likely be spent getting them to work. If they do, I will *manually* set up a database cluster and kubernetes cluster on DigitalOcean and try to deploy (via Helm) the ETL process.

**What, if anything, is blocking your progress?** Being in the apartment all day is not helping me in any way, so I suppose space is blocking me. To address this, I will try out a coworking space today, and if that doesn't work, a cafe or two.


### Friday

**What did you do yesterday?** Verified that all the pipelines, schedules, and sensors work locally on k8s. Created DB and k8s clusters on DO and deployed the ETL code! Had my first official meeting with tech mentor.

**What will you do today?** Create database users specifically for Dagster and the ETL code, then update the relevant credential locations (values.yaml, k8s secret). After that, going to work on filling out the keyword extraction feature that is currently just a dummy function.

**What, if anything, is blocking your progress?** Nothing really at the moment, I got membership at the coworking space. The uncertainty around the utility of this project is a little hard to deal with, but I suppose getting to a point where I have something to show for it and then showing it to people will validate (or not) the idea.

Cheers,

+raaid
