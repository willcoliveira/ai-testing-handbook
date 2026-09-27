# Contributing

## The sourcing bar

- Public, dated, and preferably primary: a lab's own publication, a tool's own docs, a benchmark's
  paper. Practitioner writing is welcome as `practitioner` and never as the only source for a
  claim about what a lab does.
- Every claim about how an organisation tests its own models is written as what they say they do,
  with a source id. Anything not public is written as unknown. Never inferred.
- Every source is a row in `sources.md` first. A practice file that cites an id not in the register
  fails `npm run check`.

## The vendor-balance rule

A practice describes an industry practice, not a vendor's. Its "Who does it (sourced)" section
names at least three organisations where three have published on it, and no single organisation
supplies more than half the bullets. `node scripts/check-balance.mjs` reports the current state.
Lab files are where one vendor gets the whole page.

## The template rule

`practices/_TEMPLATE.md` has seven headings in a fixed order. All seven, always, even when a section
says "none yet". `patterns/_TEMPLATE.md` and `labs/_TEMPLATE.md` likewise.

## Adding a source

1. Append a row to `sources.md` with the next free id in that area's range (see the header).
2. `published` is `YYYY-MM-DD` or `YYYY-MM`, or `living` for docs that change, which then needs
   `last_checked`.
3. Cite it as `[S0nn]` in the body and list it in the file's frontmatter `sources:`.
4. Run `npm run check`.

## Proposing an edit

Open a pull request with the source id in the description. The refresh skill proposes edits as an
unstaged diff plus a digest; a human reviews and commits. The skill never commits.

## Style

No em dashes. No leverage, robust, seamless, streamline, empower, foster, rigour. Claim, then
evidence, then the trade-off. Short sentences. Conventional commits (`docs:`, `feat:`, `chore:`,
`docs(refresh):`).

## Privacy

Read `PRIVACY.md` before writing anything that came from a job.

## Pre-commit hook

`git config core.hooksPath .githooks` enables a hook that runs the forbidden-strings and sources checks before every commit.
