---
title: Workflow Orchestration Tools Comparison
date: 2021/10/15
description: Do you like DAGs?
tag: software
author: Raaid
---

# Workflow Orchestration Tool Comparison (for Python)

So you need to kick off some data pipelines based off of a trigger, or on some set schedule. You want to see if anything goes wrong, you want easy to parse logs, and you'd love a clean UI. It'd be great to configure your runs to run locally or in a specific environment, you certainly want to be able to test it, you don't want to learn a new DSL, and you want to make sure it can handle lots of running jobs. Seems like a pretty common problem, so there should be a go-to solution, right?

It didn't seem super clear for me, and I had to go through some pain to figure out what worked for me (and more importantly what didn't). This is an updated version of a document I wrote while at The Broad Institute and was working on orchestrating ETL pipelines that handle terabytes of file data and metadata. I ran into a lot of friction with some of these tools, and I hope my experience might help others avoid the same furstrations I ran into.

Note that I only considered tools I could use relatively easily as a Python developer, and did not consider tools or frameworks in other common languages like Java, JS, etc. I avoided considering fully managed tools like Google Cloud Composer as I prefer to avoid vendor lock-in. I didn't consider tools that are only for the pipeline part (like Apache Beam or Google Dataflow built on it). I'd also like to note that my suggestions work for smaller projects, as I am using my recommended tool on [Pop the Bubble News](ptblog3.md) which is far less data than what I dealt with while working on the Human Cell Atlas project at the Broad.

**tl;dr: You almost certainly don't want to use Argo Workflows unless your use case is very simple and linear. Dagster is excellent, especially when paired with Pydantic. If you hate stronger typing, go with Prefect instead.**

## Tools Considered
- [Airflow](https://airflow.apache.org/) - Apache workflow tool. Python.
- [Argo Workflows](https://argoproj.github.io/argo-workflows/) - Kubernetes CRD for orchestration. YAML.
- [Dagster](https://docs.dagster.io/getting-started) - Data orchestrator, idealistic new kid on the block. Python.
- [Luigi](https://luigi.readthedocs.io/en/stable/) - Spotify’s workflow orchestration tool. Python.
- [Prefect](https://docs.prefect.io/core/) - Workflow system with OS pieces and a paid ecosystem. Python.
- Serverless approach

## Evaluation Criteria
- How is it deployed?
  - How do you deploy the whole system?
  - How do you deploy pipelines?
  - How does it scale?
  - Can you deploy/run it locally?
- How is it managed?
  - How do you schedule, start, stop, retry, and generally manage jobs/runs?
  - Is there a UI?
  - Are logs easy to access and search?
- How is it tested and developed?
  - What does someone need to know/learn to develop with it?
  - How are tests defined?
  - How is the documentation?
- How is it supported?
  - Is there substantial (corporate/non-profit/organizational) backing?
  - Is there a good community?

# Evaluation of options

## Airflow
### Summary
**Not considered**, though it is prevalent in the space, backed by Airbnb, and has lots of users. DAG deployment is tricky, the Helm chart doesn’t have official support, and there are a lot of hacks and workarounds to get Airflow to work the way we would want and we prefer to not work against how something is designed if there is a viable alternative.

A summary of things that are not supported in a first-class way:
- Runs which need to be run off-schedule or with no schedule at all
- Runs that run concurrently with the same start time
- DAGs with complicated branching logic
- DAGs with many fast tasks
- DAGs which rely on the exchange of data from one step to another
- Parametrized DAGs
- Dynamic DAGs

## Argo Workflows
### Summary
**It works**, but deployment, configuration, development, and testing are currently awful. Code should not be written in YAML, even if it is backed by Intuit, has corporate users, and is an incubating project of the CNCF.
### Evaluation
- How is it deployed?
  - How do you deploy the whole system? You install the Custom Resource Definition (CRD) onto your Kubernetes cluster then run the server and UI, which can all be done via their [official Helm chart](https://github.com/argoproj/argo-helm/tree/master/charts/argo-workflows).
  - How do you deploy pipelines? You put `WorkflowTemplate`s into your desired namespace on your cluster. These are also CRDs, and you can either manually put them in, or go the suggested way of using some GitOps to keep them up to date.
  - How does it scale? It scales easily with your cluster, but make sure you tune your memory, parallelism, and cpu parameters to values you are okay with. I spent a few hours unsure why tens of runs failed until I bumped up the max memory the process requests (and bumped up my node pool's max).
  - Can you deploy/run it locally? If you run kubernetes locally, you can deploy/run it locally.
- How is it managed?
  - How do you schedule, start, stop, retry, and generally manage jobs/runs? Via the UI or the CLI. The CLI feels like `kubectl` but just specific to Argo Workflows CRDs. Both are fairly straighforward and well designed.
  - Is there a UI? Yes, and it is nicely configurable. You can add secure sign-in too. It did always feel a bit jumpy and unstable to me, though, and would often hit unhelpful error messages.
  - Are logs easy to access and search? No, unless you configure the logs to be stored in a place that you can easily access and search. Accessing logs in the UI is slow and cumbersome and often caused my browser to greatly slow down or crash.
- How is it tested and developed?
  - What does someone need to know/learn to develop with it? A comfortable familiarity with Kubernetes is essential, then learning about the YAML specs for their CRDs since actually writing workflows means writing in YAML. [This](https://github.com/argoproj/argo-workflows/blob/master/examples/README.md#hello-world) is what a super simple one-step workflow looks like. The functionality of your code will still be written in whatever you choose to write it in, but stringing it together will be done in YAML.
  - How are tests defined? They're... not. Testing is not first class here. You can test your individual components that you'd run (all the steps we had were written in Bash, Python, or Scala) which is all well and good, but testing a workflow through? Not so easy and not outlined in the docs. We ended up just running workflows with test input and asserting that they ran without failure. Not great in my opinion.
  - How is the documentation? It is okay in my opinion. I don't enjoy reading through raw specs, and the most useful page I found myself returning to repeatedly was the [examples page](https://github.com/argoproj/argo-workflows/blob/master/examples/README.md). Not horrible, not super helpful.
- How is it supported?
  - Is there substantial (corporate/non-profit/organizational) backing? It is created/backed by Intuit (who I just so happen to dislike because of their lobbying and scumminess around TurboTax), used by a slew of companies, and a part of the [CNCF](https://www.cncf.io/).
  - Is there a good community? I didn't find the community support incredibly helpful, but it is there on the [CNCF Slack](https://argoproj.github.io/community/join-slack/).

## Dagster
### Summary
**Ideal solution barring newness**, upfront work, and lack of notable users/backing so far, though there is a [company](https://www.elementl.com/) behind it now.
### Evaluation
- How is it deployed?
  - How do you deploy the whole system? [Lots of ways](https://docs.dagster.io/deployment). You can use the [official Helm chart](https://github.com/dagster-io/dagster/tree/master/helm/dagster) that is [very well documented](https://docs.dagster.io/deployment/guides/kubernetes/deploying-with-helm), [using Docker](https://docs.dagster.io/deployment/guides/docker), [as a service](https://docs.dagster.io/deployment/guides/service), and you can even execute on Celery or Dask. The Helm chart does make it very easy and I'd suggest going with that for production.
  - How do you deploy pipelines? Once you have written your pipelines in Python, you simply add them to a [repository](https://docs.dagster.io/concepts/repositories-workspaces/repositories) and make sure you include the repository in your deployment (there is a specific spot to do so in the Helm chart).
  - How does it scale? Quite well, especially if you make sure to back it with a database (I use Postgres), give it enough memory and cpu, and use whatever executor is ideal for your use case (kubernetes jobs, celery, dask, etc.). You can control the parallelism overall, as well as in a more fine-grained manner like per-pipeline limits.
  - Can you deploy/run it locally? Yup! Sans Kubernetes, you can run `dagit -f path/to/repositories.py` right on your machine and access the UI, you can run pipelines without dagit through the CLI, you can even run both dagit and the dagster-daemon to run schedules and sensors.
- How is it managed?
  - How do you schedule, start, stop, retry, and generally manage jobs/runs? Through the UI, in Python, or the CLI, all of which are quite easy to use and well documented.
  - Is there a UI? Yes, it is called [Dagit](https://docs.dagster.io/concepts/dagit/dagit), and it is REALLY nice.
  - Are logs easy to access and search? Yes! On a per-run basis, you get access to a beautiful log view that you can filter by type (info, warning, etc.), you can search for specific terms, you can filter to just a specific solid, and more. You can also add a log storage location to the Helm chart to make sure they're backed up in a second location. I just about always use the UI log view because it is just so dang nice.
- How is it tested and developed?
  - What does someone need to know/learn to develop with it? Python, and then the few key concepts of solids, pipelines, and repositories. You can get fancier and learn about I/O managers, assets, workspaces, sensors, and schedules too, but all you *need* to get up and go is a few additional things on top of your existing Python knowledge. You essentially just write functions for each step (solids), and then functions to connect the solids in a pipeline.
  - How are tests defined? Like normal Python tests! I just use pytest. It's almost like testing a normal Python function. The only difference is importing and using `execute_solid` or `execute_pipeline` and running your function through that.
  - How is the documentation? STELLAR. Like c'mon, [this is beautiful](https://docs.dagster.io/getting-started). I have no problem navigating it, it works very smoothly, and they keep it pretty up to date.
- How is it supported?
  - Is there substantial (corporate/non-profit/organizational) backing? The company [Elementl](https://www.elementl.com/) is now behind it, and I've seen an increasing number of "lead engineer from XYZ company" in their Slack.
  - Is there a good community? Their [Slack](https://docs.dagster.io/community) channel is wonderfully helpful, and fairly quick to respond in my experience. Both team members and community members have helped me out.

## Luigi
### Summary
**Not considered**. A former coworker used it a lot prior to joining my team and told me to avoid using it, and I greatly respect their opinion. The docs are subpar, the use-case is very Spotify-specific, and the maintainers don’t maintain it actively. I can’t find suitable deployment methods (no Helm chart!), and it seems to assume only scheduled workflows (not allowing for on-demand ones). Additionally, the syntax seems unnecessarily complex compared to Prefect/Dagster. Removed from consideration.

## Prefect
### Summary
Seems **nearly ideal barring newness**, Dask on Kubernetes instead of directly to Kubernetes and an overall less straightforward deployment, and the fact that they have a product to sell that they want you to ultimately use instead of using it entirely open source.
### Evaluation
- How is it deployed?
  - How do you deploy the whole system? There isn't an official Helm chart as far as I can find. You could [install Prefect Server on a single node using docker-compose](https://docs.prefect.io/orchestration/server/deploy-local.html), and configure storage for the Postgres piece. You can configure the Prefect Cloud hosted UI to point to your deployment of Prefect Server, so you don’t need to stand up your own UI. You'd also likely need a Kubernetes cluster with Dask running on top of it, and then point a project’s workflows at that particular cluster for execution (you can specify the address of a Dask cluster to execute on when using the Dask Executor). You would also need to store flows somewhere, so allocating storage on some kind of s3-like storage would be required, and some docker images published to a registry would be necessary as well. In short, not super straightforward.
  - How do you deploy pipelines? You “register” flows to “projects”. This is done as a part of the Python code, after defining the flow’s tasks. You can then execute flows from Python, the command line, or the UI, with particular execution agents. This bit is similar to Dagster, if that helps.
  - How does it scale? Scales with your Dask cluster.
  - Can you deploy/run it locally? Prefect includes an [open-source server](https://docs.prefect.io/orchestration/) that can run locally. Even without this server, you can run Prefect locally like any other Python program. You can also specify that you'd like to use a particular executor, like a DaskExecutor, which spins up a Dask Cluster locally to test with (or you can specify where the Dask cluster is).

- How is it managed?
  - How do you schedule, start, stop, retry, and generally manage jobs/runs? Through the UI, in Python, or via the command line that interacts with Prefect Server.
  - Is there a UI? [Yes](https://docs.prefect.io/orchestration/ui/dashboard.html), it is quite nice, though many of its features are only available in the Prefect Cloud paid product.
  - Are logs easy to access and search? [Yup!](https://docs.prefect.io/orchestration/ui/flow-run.html#logs) Easy to check out right there in the UI, good filtering, and easy to download/route to other storage locations.
- How is it tested and developed?
  - What does someone need to know/learn to develop with it? Python, plus some concepts and syntax around steps and flows. There are, like Dagster, more advanced concepts to use as well, but just those two will get you quite far.
  - How are tests defined? Like normal Python tests! When I started trying out Prefect for a project, I just used pytest pretty normally.
  - How is the documentation? [Very shiny](https://docs.prefect.io/), and pretty good, but sometimes a little laggy and jumpy which can be pretty annoying when you're trying to debug something.
- How is it supported?
  - Is there substantial (corporate/non-profit/organizational) backing? They have a paid version that they very much want you to use, so there is a company behind it.
  - Is there a good community? [Their Slack channel](https://docs.prefect.io/core/community.html) was quite helpful the few times I popped in!

## Serverless approach
### Summary
Costs less and involves less infrastructure, but at the cost of lost visibility, retryability, and Cloud-provider lock-in.
### Evaluation
This would be a completely different approach. It would:
- Use a message queue for talking between services
- Use cloud/serverless functions as a way to run step-specific code

Why this serverless approach is better than the DAG approach:
- Potentially lower cost
- Less infrastructure to define and stand up
- Extremely scalable

Why the DAG approach is better than the serverless approach:
- Easier to track logs and identify what has gone wrong (easier to debug)
- Easier to have integration tests
- Easier to retry failures
- Easy to define a particular run (vs “stuff is running” ambiguously)
- Avoids Cloud-provider lock-in (If serverless is not implemented on something like k8s OpenFaaS)


## Conclusions
Airflow (and therefore Cloud Composer or anything built on it) and Luigi require working against the framework at times or simply don't meet the evaluation criteria. Writing workflows with the complexity should not be done in YAML (it gets so, SO, so messy), and a lack of clean deployment, local development, and testing rules out Argo Workflows.

I think the serverless approach is interesting, but the DAG approach makes it easier to do a great many things, particularly on the dev experience side. I think the biggest advantage of the serverless approach is lower cost and less infrastructure, but doing so at the cost of losing visibility, retryability, debugging ability, and testability is not worth it. I don’t recommend going with the serverless approach given current technology.

**I recommend Dagster**. It is very well documented, has a fully supported official Helm chart, the community is excellent, the concepts are clear, the UI is spectacular, and embraces stronger typing in Python (which I feel strongly about). Prefect works great too, but I think Dagster is better on the typing front, the UI edges out Prefect's, and the biggest blemish to Prefect is the difficulty in deployment (which makes sense because they want you to use Prefect Cloud, not deploy your own).

This is just one person's opinion, so if you disagree, great! My experience and research with these tools led me to Dagster and far, far away from Argo Workflows.