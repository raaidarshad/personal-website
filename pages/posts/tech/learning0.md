---
title: Learning log 0
date: 2021/9/21
description: A lot of Dockerfile things
tag: software
author: Raaid
---

I'm going to start publicly logging things I run into and learn while working on my various projects, mostly for my sake but also for anyone else who might benefit from my experience.

- multistage builds in docker are very useful for reducing final image size. Here is a Dockerfile (be gentle) without using the multistage feature, which came out to be 770MB:

```
FROM python:3.9.5-slim
RUN apt-get update && apt-get install -y libpq-dev gcc
COPY requirements.txt .
RUN pip install -r requirements.txt
```

And here is one with the multistage feature, came out to be 538MB:
```
FROM python:3.9.5-slim as builder
RUN apt-get update && apt-get install -y libpq-dev gcc
COPY requirements.txt .
RUN pip install --user -r requirements.txt


FROM python:3.9.5-slim as runner
RUN apt-get update && apt-get install --no-install-recommends -y libpq-dev
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH
```

Sure, it's just a couple hundred MB, but that's significant enough in taking up space in my container registry for every build that I'd prefer it!

- Alpine images have different c compilers and don't use wheel files, so can take really long for python builds in a Dockerfile (I sat there staring at the terminal installing a dependency of Spacy for over 15 minutes before hitting ctrl-C). Link: https://pythonspeed.com/articles/alpine-docker-python/

- Spacy's en_core_web_sm is WAY smaller than en_core_web_lg and while the latter is advertised as more accurate, the differences are not that big and one should probably start with _sm and only bump up if the accuracy is an issue. I am only using it for tokenization so they have the same accuracy for that so... Link: https://spacy.io/models/en#en_core_web_sm-accuracy

- Repeatedly building images (that don't take full advantage of caching because the install step fails) while on a hotspot will DRAIN your data

- Poetry is nice and all, but the package resolver step takes really freaking long and I'd rather just commit my lock file or output to requirements.txt for production than have my CD resolve and take minutes. So I can either do `poetry install` or `poetry lock && poetry export -o requirements.txt && pip install -r requirements.txt` if I start from a pyproject.toml file, or I can do `poetry install` from a poetry.lock file. BUT pip has the `--user` argument which I found very convenient for the multistage build, so doing `poetry export -o requirements.txt && pip install --user -r requirements.txt` got me the fastest results that I could easly `COPY` to another image. Here is my final (so far) Dockerfile. It is X, slightly larger than the aforementioned 538MB because this added the spacy en_core_web_sm piece, and it took 6m02s:
```
FROM python:3.9.5-slim as req
COPY pyproject.toml .
COPY poetry.lock .
RUN pip install poetry && poetry export -o requirements.txt

FROM python:3.9.5-slim as builder
RUN apt-get update && apt-get install -y libpq-dev gcc
COPY --from=req requirements.txt .
RUN pip install --user -r requirements.txt

FROM python:3.9.5-slim as runner
RUN apt-get update && apt-get install --no-install-recommends -y libpq-dev
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH
RUN python -m spacy download en_core_web_sm
```

Copying in my application code in the `runner` section added under 1MB and under 1 second, for what it is worth. I see the allure of [buildpacks](https://buildpacks.io/) and other efforts so that we don't have to write these crazy Dockerfiles, but until they're really stellar and work for even non-general cases, I suppose it is good to know how to profile and improve our Docker efforts.

Cheers,

+raaid
