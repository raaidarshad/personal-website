---
title: Standup + OKRs week 4
date: 2021/10/24
description: Standup and OKR logs for Pop the Bubble week 4
tag: project, log, popthebubble
author: Raaid
---

Made good progress on the other project, plan to dedicate more time to this for this week.

## OKRs

Current period ends December 31, 2021.

### Mission

Agree on reality: Get U.S. online news readers on the same page with regards to reality.

### Objective

Provide bias-aware slow news to online readers who don't want to be in a news bubble.

### Current priorities

- _P1_ Figure out and execute consistent way to present clusters
- _P1_ Experiment with clustering methods to figure out which one is best for our use case
- _P1_ Clean/improve/debug pipelines, DB structure, and deployment -> DONE!

### Next-up priorities

Note: Removed adding other bias sources, want to focus on determining various attributes of articles via NLP if possible. Edited the priorities of a number of these.

- _P2_ Create and launch mail option
- _P2_ Revamp the "support" option on website
- _P1_ Experiment with own bias rating methods (subjectivity measures, spin measures, objective measures, attributed information, etc.)
- _P1_ Add more sources
- _P3_ Find first sponsor for email?
- _P1_ Create and launch Instagram option with "weekly summary" posts
- _P3_ Make BubblePopper tool V0

### Key requirements

1. Get 50 hits/day on website. Current by CloudFlare: ~35/day, Plausible: ~2/day. Confidence to achieve: 2/10
2. Get 25 mail list subscribers. Current: 0 subscribers. Confidence to achieve: 4/10
3. Get 25 Instagram followers. Current: 0 followers. Confidence to achieve: 4/10

### Health metrics

- Me: Green
- Costs: Yellow

### Week's successes

- Infrastructure and Helm releases are now automatically updated from code via Pulumi and GitHub actions!!!
- Updated backend is now up and running again in dev, ready for me to experiment on real data via different clustering methods and more

## Standup logs

### Monday

**What did you do yesterday?** Started writing some infrastructure code over the weekend, using Pulumi (in Python).

**What will you do today?** Primarily finish out some work on the other project, but I aim to make some meaningful progress on the infrastructure/deployment front.

**What, if anything, is blocking your progress?** Nothing that I can do, at the moment.

### Tuesday

**What did you do yesterday?** Made a lot of progress on infrastructure/deployment, nearly there!

**What will you do today?** Finish the code for infrastructure/deployment, the dev configuration for that, and the github actions to preview and deploy these things. Will also first confirm that it all works. Pulumi is a FANTASTIC tool so far. If I get that done, then the next step should be to run the schedules/sensors for a day or so to get a batch of new data to play with.

**What, if anything, is blocking your progress?** Nothing in my control.

### Wednesday

**What did you do yesterday?** Finished the Pulumi stuff and new GitHub Actions, kicked off the dev environment running.

**What will you do today?** Investigate all the errors that popped up in the dev environment! A bunch of pipeline runs failed with the message "An exception was thrown during execution that is likely a framework error, rather than an error in user code." which means I ought to introduce simple retries on the pipeline runs, ideally specifically for Dagster framework exceptions. A bunch of the `extract_raw_article_content` (seemingly every run) runs failed or were running for hours, so need to figure out why that is happening and fix it (and add better logging to that pipeline).

**What, if anything, is blocking your progress?** Someone working on the front-end in tandem? Or money to comfortably throw compute/memory at my kubernetes cluster.

### Thursday

**What did you do yesterday?** TOOK A BREAK! But identified the sources of the pipeline errors (I think).

**What will you do today?** Attempt to fix the sources of the pipeline errors, namely by updating the retry mechanism on the `HttpAdapter` in the `http_client` resource, adding a general retry mechanism to every solid (in case of intermittent Kubernetes or Dagster errors which seem to happen from time to time), and update logging to make this debugging process easier (add some, and change some from `debug` to `info`). Apart from that, I intend to add the symbol check back into the `TermCount` tokenizer as that particular pipeline does NOT need to account for symbols. THEN, time permitting, I'd like to add a failure hook to all solids that will Slack me details of any failure, and investigate the default compute log configuration for the Dagster Helm chart. Ambitious, I know.

**What, if anything, is blocking your progress?** The fact that I am one man with finite time and resources. Perhaps if there were more people, this could go faster!

### Friday

**What did you do yesterday?** Added lots of helpful logging and fixed a lot of the retry/http stuff. Turns out WaPo articles were all timing out, so putting that on the backburner and just marking WaPo as `is_okay = false` in the database so we don't pull anything from it. ETL now properly up and running with better logging, and I feel a lot better about its resilience and visibility.

**What will you do today?** So Dagster just released version 0.13.0 with some big API changes. I won't be refactoring today, but this has prompted me to make sure and use ClickUp for tracking all my backlog of tasks. So today I am writing up tasks and organizing their priority in ClickUp, investigating/exploring the least painful way to manually label data, and starting to write code to evaluate the performance of various clustering approaches and parameters.

**What, if anything, is blocking your progress?** PERSONNEL.

### Sunday

**What did you do yesterday?** I ended up spending all of Friday working on a Markov chain model to generate a headline given a set of headlines. It "works" in that it randomly generates a headline, but wow is it bad. Fun exercise in learning though! I did write up and prioritize tasks in ClickUp (and clearly promptly ignored them).

**What will you do today?** I've been labeling a dataset but have realized that it is far too large for me to viably do; I am going to try to label 3 different hour-long pulls of data from the DB and label those, I think that is far more likely to get done sometime soon. I also added a new custom article clustering algorithm, which builds on my previous approach. I also hooked up a few simple graphs to my DB to see the difference between article, rawcontent, and parsedcontent counts, the number of articles by source, and the distribution of article lengths by source. Interesting stuff, to me at least.

**What, if anything, is blocking your progress?** An army of (paid) interns to label a dataset well.

Cheers,

+raaid
