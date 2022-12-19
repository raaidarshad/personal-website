---
title: How I Start a New Python Project
date: 2022/12/18
description: Adventures in unnecessary optimization
tag: software, opinion
author: Raaid
---

# How I start a New Python Project

## Motivation
Recently, I've found myself following the same set of steps every time I start a new Python project. I want certain style checking things in place, I want a tests directory, I want a readme and a license, I want a github repository spun up, I want pre-commit set up; there's a lot of small stuff, regardless of the project. It doesn't take _that_ long, but it'd be nice to make the process quick, easy, update-able, and consistent.

## Goals
With the above context, I want the following for every project I spin up:

- A `README.md` and `LICENSE` files
- Style checkers: I like using `black`, `isort`, and `flake8` via `pre-commit`. See [this post](learning2.md) for more information on those tools
- Test runner: I like using [pytest](https://docs.pytest.org) to run tests in a `tests` directory
- Static type checking: I like using [mypy](https://mypy.readthedocs.io/en/stable/) because strong typing helps a lot (yes I know it's not very pythonic but hey it helps avoid lots of issues, its great)
- Basic CI: Running tests and static type checking for any new pull requests to my main branch on git, and since I use GitHub, GitHub actions + workflows are my preferred choice
- Git setup: Initializing git, creating the repo on GitHub, and pushing everything up (instead of forgetting and looking up how to push an existing project up every single time)
- Dependency management: I like using [poetry](https://python-poetry.org/) to define and manage dependencies

## Implementation

I found [cookiecutter](https://cookiecutter.readthedocs.io/en/stable/), a tool that lets you create templates of projects. There are lots of templates out there, one of which is probably already what I want, but hey this isn't my job so I'm happy to roll my own and learn a bit. I made my own template to my taste (given the goals I stated above). You can check out the template and the details of the files along with options [here](https://github.com/raaidarshad/cookiecutter-raaid). My template creates a project structure that looks like this (with a number of optional files shown here):

```
project_name
├─ .github
├─── workflows
├───── on-pull-request.yaml
├───── on-merge-to-main.yaml
├─ LICENSE
├─ pyproject.toml
├─ README.md
├─ src
├─── __init__.py
├─── main.py
├─ tests
├─── __init__.py
├─ tox.ini
├─ .pre-commit-config.yaml
├─ .gitignore
├─ Dockerfile
```


But I need more than just the project directory structure to look the way I want! I want things installed, I want git set up! So what's next?

Well, cookiecutter has pre and post generation scripts! You can write these in Python or in your shell script of choice. [Here](https://github.com/raaidarshad/cookiecutter-python/blob/main/hooks/post_gen_project.sh) is my post-generation script. It does the following:

- installs the right version of Python
- optionally removes the Dockerfile
- optionally removes the default merge-to-main github workflow
- creates a virtual environment and installs dependencies
- optionally initializes git, initializes pre-commit, creates the first git commit, and creates a repository on GitHub and pushes the project

So cookiecutter addresses pretty much everything I set out to do! [Here is the Python cookiecutter repo I made](https://github.com/raaidarshad/cookiecutter-python), with instructions for use in the readme as well!

## Future improvements

Now what would make this better?

- More choices: Different dependency management tool options, different CI tool options, not just github for git, different test runner options, different style checker options and presets, just options everywhere with sensible defaults for all.
- More things: In addition to more choices, it might be nice to add a few other tools. One that comes to mind immediately is a directory for any infrastructure-as-code, along with the CI/CD for it.
- Feature flags: Sort of an additional choice and a thing, but it'd be great to explicitly toggle or deactivate stuff. Maybe I don't want to immediately push stuff to git (gasp!), or maybe I do want to have a default infrastructure as code tool and directory set up.
- Idempotency + edge cases: Does the project already exist locally? Does it already exist in your git remote? Are the necessary dependencies for the install process present on the machine? Etc.
- Not bash: If I was to make all these changes and have so many configurations, then it'd probably be easier to update and maintain it in Python instead of a bash script.

I prefer staying in Python land for any personal projects, so I won't entertain "other languages" as a future improvement. I'm happy with my quick and scrappy custom project creation script. I might make it better at some point, but this works for now!

Cheers,

+raaid
