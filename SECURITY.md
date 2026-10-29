# Security

This repository is a public handbook and the source of the book site at
willcoliveira.github.io/ai-testing-handbook. It holds no secrets, runs no server and stores no
user data. What can go wrong is in the build and the publishing path.

## In scope

- The site build: anything that lets page content (a Markdown file, its frontmatter, a register
  row) put raw HTML, script or a third-party load into a built page, or read a file from outside
  the repository (`.vitepress/`, `tests/site/post-build.mjs`).
- The workflows and the deploy to GitHub Pages (`.github/workflows/`).
- The scripts and the Claude Code skills and agent (`scripts/`, `.claude/`), including anything a
  fetched web page could make them do.
- A name, identifier or other detail that the privacy rules in [PRIVACY.md](PRIVACY.md) say must
  not be here.

A factual error in the handbook's content is not a security report: open an issue or a pull
request for it.

## How to report

Use GitHub's private vulnerability reporting for this repository:
[Report a vulnerability](https://github.com/willcoliveira/ai-testing-handbook/security/advisories/new).
Do not open a public issue for a security problem until it is fixed.

Say what you found, how to reproduce it and, if you have one, a fix. A reproduction as a failing
unit test under `tests/site/unit/` is the most useful form; the existing security tests there show
the pattern.

## What to expect

One person maintains this repository. A report is acknowledged when it is read, which can take up
to two weeks, and fixed in a pull request that credits the reporter unless they ask otherwise.

## Supported version

The `main` branch and the live site built from it. There are no releases to patch separately.
