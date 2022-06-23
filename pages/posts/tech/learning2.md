---
title: Learning log 2
date: 2022/6/23
description: Pre-commit and code format
tag: software, log
author: Raaid
---

# Pre-commit + code formatting = better developer experience

This past week, I was looking through an existing code base that I did not write. It is fairly well documented, well organized, most things are named well; without extending this list further, I found it to be very readable.

Even the tidiest code bases can have their quirks, though! I noticed a smattering of unused imports, some inconsistent spacing and formatting, and a few other things.

I started manually removing unused imports and fixing their order to the standard I'm familiar with: 3 sections, first is standard library imports, then 3rd party packages, then local modules, each section sorted alphanumerically. After a bit I thought "surely there has to be a tool to do this automatically", and the terms "black" and "flake8" hazily appeared in my memory.

And so I dove into setting up pre-commit hooks for code formatting, something I've heard lots about but never actually set up myself. I'll write why I think this all is truly useful, then show how I set it up myself, with plenty of links to relevant github repos and documentation pages all throughout.

### What + why

Straight from the [pre-commit website](https://pre-commit.com/), "Git hook scripts are useful for identifying simple issues before submission to code review. We run our hooks on every commit to automatically point out issues in code such as missing semicolons, trailing whitespace, and debug statements. By pointing these issues out before code review, this allows a code reviewer to focus on the architecture of a change while not wasting time with trivial style nitpicks."

For the uninitiated, this is what it looks like:

1. You make changes to a file
2. You attempt to commit these changes
3. The hook runs whatever you have specified to run (in our case, code formatting tools) on the changed files
4. Depending on your configuration, it can make changes to your code, flag issues, and even prevent the commit
5. Once all the rules that you have configured deem the code to be acceptable, the commit actually goes through

This is great for so many reasons!

1. You don't have to manually change every single formatting issue, as many tools will make the changes for you (e.g. remove unused imports)
2. When it is set up as a pre-commit hook, it makes sure sub-standard (standards that you define) code does not even get committed. Its like preventing a mess from happening instead of cleaning it up later
3. Consistent code formatting/style makes for better readability, and removes the overhead of checking for that during a code review, allowing you to focus on the substance of the code instead

There is certainly a world in which this can be a huge nuisance, and I'd like to acknowledge that. What if you've never used pre-commit hooks before and you try to commit your code, and it doesn't commit? That'd be quite frustrating. Two super important pieces of information here are:

1. Where do the hook logs (and error messages) show up? You need to know what "broke" and where so you can do something about it if needed (flake8 case) or if it has already re-formatted for you and you can just commit again (black case)
2. How do you reconfigure the tools? What if there is some edge case or particular styling thing you (and your team) don't care to adhere to, and you'd like your commit to go through regardless? You need to know where the configuration lives and how to edit it

Where the logs show up depends on your development environment. I use PyCharm, so for me they show up in the console tab of the git window. How you configure the tools is detailed in each tool's documentation, linked below in the next section.

### How to set it up

For reference, here are the documentation pages for each of the tools used:

- [pre-commit](https://pre-commit.com)
- [black](https://black.readthedocs.io)
- [isort](https://pycqa.github.io/isort)
- [flake8](https://flake8.pycqa.org)

We're going to need to configure these tools in a smattering of files. For this post, I'll avoid prescribing how to install any dependencies and assume you have your own preferred way of doing so. I tend to use [Poetry](https://python-poetry.org/) for what it's worth!

First, assuming you have a Python environment set up and running (I'd suggest a virtualenv), install pre-commit:

```bash
> pip install pre-commit
```

I added pre-commit as a dev dependency in my Poetry configuration and hit `poetry update`, which accomplishes the same thing. You don't actually need to install isort, black, or flake8 by the way.

Next, create a `.pre-commit-config.yaml` file in the root directory of your project and configure it as you see fit [per the documentation](https://pre-commit.com/#2-add-a-pre-commit-configuration). This is what mine looks like:

```yaml
# .pre-commit-config.yaml

# pre-commit, once installed, runs these specified tools to format/lint/check our code for a consistent standard.
# see https://pre-commit.com/ for more
repos:
# isort re-formats import orders to a standard, see https://pycqa.github.io/isort/index.html for more
-   repo: https://github.com/pycqa/isort
    rev: 5.10.1
    hooks:
    - id: isort
      name: isort (python)
# black re-formats code to an opinionated standard, see https://black.readthedocs.io/en/stable/index.html for more
-   repo: https://github.com/psf/black
    rev: 22.3.0
    hooks:
    - id: black
      language_version: python3.9
# flake8 checks code to make sure it conforms to pep8 (we specify things to ignore in tox.ini)
# see https://flake8.pycqa.org/en/latest/ for more
-   repo: https://gitlab.com/pycqa/flake8
    rev: 3.7.9
    hooks:
    - id: flake8
```

This specifies what tools you want to run and in what order you'd like to run them in (the first tool runs first, second runs second, etc.).

Great, we have our pre-commit configuration in place! We still need to specify configuration for isort, black, and flake8. Lets start with isort. There are a number of configuration file options for isort, [detailed here](https://pycqa.github.io/isort/docs/configuration/config_files.html). Since I use Poetry and already have a `pyproject.toml` file in my root directory, I opt to use that option. This is what the isort section of my `pyproject.toml` file looks like:


```yaml
# pyproject.toml

[tool.isort]
profile = "black"
```

Pretty simple, since I like the default behavior and only want to account for black (if you use black and omit this profile argument, your pre-commit hook will keep failing). Lets add black next! Black specifically uses the `pyproject.toml` file as [described here](https://black.readthedocs.io/en/stable/usage_and_configuration/the_basics.html#configuration-via-a-file) (there is an example configuration as well). This is what the isort and black sections of my `pyproject.toml` file look like now:

```yaml
# pyproject.toml

[tool.black]
line-length = 122
include = '\.pyi?$'
exclude = '''
/(
    \.git
  | \.hg
  | \.mypy_cache
  | \.tox
  | \.venv
  | _build
  | buck-out
  | build
  | dist
)/
'''

[tool.isort]
profile = "black"
```
I copied this from a gist somewhere, thus the smattering of include and exclude arguments. The line-length is to conform to the standard already set in the project I'm getting my hands into. Great, now all we have left is flake8! Configuration details for this tool are [here](https://flake8.pycqa.org/en/latest/user/configuration.html). The project already had a flake8 configuration in the `tox.ini` file in the root directory, so I updated it slightly. Here is what it looks like:

```yaml
[flake8]
# tox.ini

# see https://www.flake8rules.com/rules/E203.html and change "E203" for explanation of different rules to ignore
# these are primarily ignored for compatibility with black
ignore = E203, E501, W503, F403
max-line-length = 122
max-complexity = 18
select = B,C,E,F,W,T4,B9
exclude = .git,__pycache__,.env,node_modules

```

Yours might look different, but I found these error cases important in order to work well with isort and black. You'll note the line-length parameter is set to 122 here as well.

Alrighty, we're all configured now! To recap, we've configured pre-commit, isort, black, and flake8. Pre-commit will run the three tools on any changed files when we try to commit code, isort will make changes to sort your imports, black will make changes to adhere to an opinionated style guide, and flake8 will check for pep8 compliance (it won't actually make the changes for you). With the way I have it configured, isort and black will cause the commit to fail if either tool makes changes. In that case, all you need to do is commit again. Flake8 will point out what needs to be changed, so your commit won't go through until and unless you go address the changes (or change the config/override the pre-commit hook).

To actually have the pre-commit hook work, we need to install it. Run this incantation:

```bash
> pre-commit install
```

Et voila, you're all set! If you want to have the tools manually run on all your files, you can run:

```bash
> pre-commit run --all-files
```

The output can look like this if all the tools pass:

```bash
isort (python)...........................................................Passed
black....................................................................Passed
flake8...................................................................Passed

```

Conversely, the output can look something like this if there are changes to be made (note that the `...` means there were a lot more files, I took them out for this, and I also renamed files and libraries for the example):

```bash
isort (python)...........................................................Failed
- hook id: isort
- files were modified by this hook

Fixing /path/to/fixed/file.py
...

black....................................................................Failed
- hook id: black
- files were modified by this hook

reformatted path/to/reformatted/file.py
...

All done! ✨ 🍰 ✨
9 files reformatted, 16 files left unchanged.

flake8...................................................................Failed
- hook id: flake8
- exit code: 1

path/to/a/file.py:1:1: F401 'foo' imported but unused
path/to/b/file.py:5:1: F401 'bar' imported but unused
...
```


If you have a large code base that hasn't had these tools run on it before, this might make a ton of changes and flag a lot of issues, so keep that in mind. For more fine grained pre-commit run commands, check out the tool's documentation linked above.

### Conclusion

Congrats! You did it! You've now configured and installed pre-commit hooks for isort, black, and flake8. I find it quite liberating to not need to worry about little style things when reviewing code, or when submitting my own code to be reviewed, and intend to set this up for any team-based project moving forward. Reminder that each team member _will_ need to install pre-commit to their Python environment (though I think there is a way to do an install beyond your project virtualenv) and run `pre-commit install` to actually have it run the hooks.

If you've made it till here, thanks for reading. Hope you found it helpful!

Cheers,

+raaid
