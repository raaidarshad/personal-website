---
title: Standup + OKRs week 1
date: 2021/10/3
description: Standup and OKR logs for Pop the Bubble week 1
tag: project, log, popthebubble
author: Raaid
---

UPDATE: The purpose of the Key Requirements was to measure interest for idea validation. Given that the idea is already validated to an extent by another organization (see Friday's stand-up notes), *proving* this seems less important, but this will still be important once I have a product to show.

Also, I found a [research report from the Pew Research Center](https://www.pewresearch.org/journalism/2016/07/07/the-modern-news-consumer/) I bookmarked a while back that has a lot of data to suggest there is a young, online-news-reading demographic that knows there is bias in their news and would really appreciate tools/products/services that address that.

## OKRs
Current period ends December 31, 2021.

### Mission
Agree on reality: Get U.S. online news readers on the same page with regards to reality.

### Objective
Provide bias-aware slow news to online readers who don't want to be in a news bubble.

### Current priorities
- *P1* Figure out and execute consistent way to present clusters
- *P1* Clean/improve/debug pipelines, DB structure, and deployment

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
1. Get 50 hits/day on website. Current by CloudFlare: ~20/day, Plausible: ~1/day. Confidence to achieve: 3/10
2. Get 25 mail list subscribers. Current: 0 subscribers. Confidence to achieve: 4/10
3. Get 25 Instagram followers. Current: 0 followers. Confidence to achieve: 5/10

### Health metrics
- Me: Green
- Costs: Yellow

### Week's successes
- Restructured the DB and pipelines to a new schema/organization that will result in cleaner code, better provenance, better performance, and easier debugging

## Standup logs

### Monday

**What did you do yesterday?** On Friday, I ironed out some issues with the ETL deployment.

**What will you do today?** Figure out the syntax for the queries I need to pull data on article clusters (e.g. "for a given cluster, get all articles from the left and lean-left AllSides sources"). Start codifying them into SQLAlchemy if enough time today. Also take another pass over the KRs; happier with the mission and objective, but the KRs might need more refinement (should be rates, but since I'm starting and really just validating an idea, any numbers at all are more of a concern, perhaps?)

**What, if anything, is blocking your progress?** Nothing at the moment.

### Tuesday

**What did you do yesterday?** Fix a bug where the article table's `url` column was not properly declared as unique: had to find and remove all duplicate article rows (and connected data) then use Alembic to define the change/update. I did notice some weird html stuff getting into the article table, so noting that as a future clean up task. Started learning how to translate more SQL to SQLAlchemy (group by, order by, join, etc.)

**What will you do today?** Have SQLAlchemy prototype code for pulling the data I want/need for manual, simple cluster analysis/presentation, like "for this topic, there are X articles from the left, Y from the right, Z from the center" and corresponding UI work. Time permitting, I will look into email/instagram things as well.

**What, if anything, is blocking your progress?** Auto-deleting old clusters will actually make manual analysis harder! So I might update the code to not auto-delete everything older, and add some kind of "clean up" pipeline on a schedule.

### Wednesday

**What did you do yesterday?** Pulled SQL models out into a python package so both the ETL and Website projects can access it easily. Got the first cluster/topic based query written and added it to the website server. Started building the new UI components. Noted that some news sources publish a LOT more than others (NYPost with 773 articles in my DB while NPR has 72), which could impact analysis. Something to be aware of and likely address. Also noted that some sources have far fewer articles than they should, so looking into bugs in the extract_articles pipeline.

**What will you do today?** Dig into the extract_articles bug(s), do a few data cleaning tasks for the extract_articles pipeline, then time permitting keep working on the new UI prototype.

**What, if anything, is blocking your progress?** Uncertainty around sources; for example, NYPost has a lot of tabloid content with lots of articles about the same thing. I'm not clear on how to handle it.

### Thursday

**What did you do yesterday?** Did a lot of clean up work, little all over the place. Added lots more logging.

**What will you do today?** A lot of thinking on e-paper and ticketing up changes to make, playing around with the OpenAI API playground, then starting to execute the aforementioned changes to make, probably either updating DB models or refactoring the extract_articles pipeline.

**What, if anything, is blocking your progress?** I don't think anything is blocking.

### Friday

**What did you do yesterday?** A lot of thinking and diagram drawing for DB and pipeline refactors, started the DB refactor. Realized that there is already an organization making similar efforts, and was initially deflated at learning that since they have things built out and backers and users, but then one of my mentors reframed it: The idea is already validated and worthy of funding! The competitor is also backed by Facebook, which is not a very trustworthy establishment in my (and many people's) regard.

**What will you do today?** Recover from whiplash of realizing someone else is doing the same thing and the implications of that knowledge, refine mission and priorities, continue refactoring pipelines and DB. I need to get the CI/CD, database things (alembic and new table defs), infrastructure, all squared away and easy to update. It will facilitate faster development downstream in case of any changes.

**What, if anything, is blocking your progress?** Now that I think of it: lack of personnel. I need more people writing code.

### Sunday

**What did you do yesterday?** Did a lot of thinking on paper, continued the article extraction refactor and adding more CI/CD.

**What will you do today?** More article extraction refactoring and test writing.

**What, if anything, is blocking your progress?** Nothing new.

Cheers,

+raaid
