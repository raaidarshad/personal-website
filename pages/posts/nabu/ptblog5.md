---
title: Standup + OKRs week 5
date: 2021/10/31
description: Standup and OKR logs for Pop the Bubble week 5
tag: project, log, popthebubble
author: Raaid
---

Back end up and running (in dev), focusing on getting something worth looking at on the page next.

## OKRs
Current period ends December 31, 2021.

### Mission
Agree on reality: Get U.S. online news readers on the same page with regards to reality.

### Objective
Provide bias-aware slow news to online readers who don't want to be in a news bubble.

### Current priorities
- *P1* Figure out and execute consistent way to present clusters
- *P1* Experiment with clustering methods to figure out which one is best for our use case -> A variety seem to work, and my custom way seems to work quite well based on just eyeballing it. Calling this done because it works and I don't want to use too much time optimizing just now

### Next-up priorities
- *P2* Create and launch mail option
- *P2* Revamp the "support" option on website
- *P1* Experiment with own bias rating methods (subjectivity measures, spin measures, objective measures, attributed information, etc.)
- *P1* Add more sources
- *P3* Find first sponsor for email?
- *P1* Create and launch Instagram option with "weekly summary" posts
- *P3* Make BubblePopper tool V0

### Key requirements
1. Get 50 hits/day on website. Current by CloudFlare: ~35/day, Plausible: ~1/day. Confidence to achieve: 2/10
2. Get 25 mail list subscribers. Current: 0 subscribers. Confidence to achieve: 3/10
3. Get 25 Instagram followers. Current: 0 followers. Confidence to achieve: 3/10

### Health metrics
- Me: Green
- Costs: Yellow

### Week's successes
- Clustering looks good (enough)!
- Initial proof-of-concept for sentence-level similarity looks promising

## Standup logs


### Monday

**What did you do yesterday?** Added a new article clustering method and set up some simple database graphs to get a sense of the data I'm collecting. I will note that neither of these activities is working towards my current priorities, whoops.

**What will you do today?** Work towards priorities! I am going to spend most of today on the other project, but my goal is to have 1 one-hour data-pull labelled today. Time permitting, I'd like to get a lot done on writing the code to evaluate a set of clustering algorithms + parameters against a corresponding labelled truth set.

**What, if anything, is blocking your progress?** People people people people people. So much to do.

### Tuesday

**What did you do yesterday?** Did work on the other project, then finished labeling one one-hour data-pull! Finished the code to compare various algorithms and parameters to the labeled set, and the results didn't look so great, which is odd to me because at the very least I've seen the custom algorithm do exactly what I want it to.

**What will you do today?** Primarily work on the other project. I will probably do a quick reality-check on the article clustering capabilities and if my observations of "it works pretty well!" are indeed valid, I'd like to come up with a more explicit measure of the clustering methods working well, but if not, I'm happy to just eyeball it for now and say "yep, that looks good, lets use that for now".

**What, if anything, is blocking your progress?** Need to clone self.

### Wednesday

**What did you do yesterday?** Primariliy the other project.

**What will you do today?** Primarily work on the other project. Time permitting, will run some clustering jobs and see how they look.

**What, if anything, is blocking your progress?** I guess the other project's priority at the moment?

### Thursday

**What did you do yesterday?** Worked on the other project for the morning, spent a large chunk of the afternoon fixing a bug in the load step for the article cluster pipeline. It has been fixed! And just running my custom algorithm produced excellent results to my eyes. I speculate that the small sample size of articles for my labelled set was just too little data for the clustering algos? I'd love to find a better measure, but just looking at the article clusters generated, I am quite heartened.

**What will you do today?** Work on getting a topic-driven (clustered) view to the UI!

**What, if anything, is blocking your progress?** Being slow at front end dev work!

### Friday

**What did you do yesterday?** Made progress towards the topic-driven view, it gets there! Still needs styling, still needs mobile-friendly view, and will probably keep iterating.

**What will you do today?** Keep working on the topic-driven view. Might also work on keyword extraction for clusters, as well as working towards "sentence clustering" or whatever I want to call the process of identifying similarities/differences between what things articles in a cluster cover. Also will want to write up these new tasks in ClickUp.

**What, if anything, is blocking your progress?** A lack of design expertise. I am struggling to figure out how to present the work well. Also could use some guidance on what the non-profit funding route looks like.

Cheers,

+raaid
