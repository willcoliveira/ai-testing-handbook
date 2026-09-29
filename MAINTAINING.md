# Maintaining this reference

The routine, in the order it happens. `CONTRIBUTING.md` has the rules; this file has the cadence.

## Once, before the first push

1. Read every file in `patterns/` against the checklist in `PRIVACY.md`; set `anonymisation: reviewed`.
2. Skim every file in `labs/`, especially "What is not public", for anything stated beyond its source.
3. `npm run check` with `privacy/forbidden-strings.txt` present: zero hits, zero problems.
4. `git ls-files privacy/forbidden-strings.txt` prints nothing; `git grep -i <a private name> $(git rev-list --all)` prints nothing.
5. Create the GitHub repository private, push, watch CI, enable branch protection on `main`, then make it public.

## Every refresh (monthly, or when a lab, tool or standard ships something)

1. Open Claude Code inside this repository on a fresh branch: `git checkout -b refresh/$(date +%F)`.
   Check `gh auth status` first: the CLI on this machine has two accounts and can revert to the
   work one after a restart; `gh auth switch --user willcoliveira` before any `gh` command.
2. `/refresh` does steps 2 to 5 in one command (full sweep, digest, commit, pull request, no merge).
   By hand: `/kb-refresh --area <n>`, one or two areas per session. `--dry-run` writes only a gitignored draft digest.
3. Read `digests/YYYY-MM-DD.md`, then `git diff`. The skill adds sourced bullets, register rows and date
   bumps only; anything else is listed under "Skipped" for a human.
4. `npm run check`. Commit as `docs(refresh): YYYY-MM-DD digest`. Add one line to `CHANGELOG.md`.
5. `main` requires the CI check, so push the branch and merge through a pull request:
   `git push -u origin HEAD && gh pr create --fill && gh pr merge --squash --auto`. Auto-merge is
   enabled at repository level and lands the change when the check is green.

## When adding by hand

| Adding | Do |
|---|---|
| a source | append a row to the area's `sources/_*.rows.md` file in its id range, then `node scripts/merge-sources.mjs` (it rebuilds `sources.md`, so a row added there directly is lost); reuse an existing id if the url is already registered; cite `[S0nn]`; add the id to the file's frontmatter |
| a practice | copy `practices/_TEMPLATE.md`; keep the seven headings; cite at least three organisations; add it to `TAXONOMY.md` |
| a pattern | copy `patterns/_TEMPLATE.md`; use the stand-ins in `PRIVACY.md`; leave `pending` until re-read cold, then `reviewed` |
| a lab or vendor | copy `labs/_TEMPLATE.md`; write "What is not public" first; add a row to the matrix in `labs/README.md` |
| a how-to | copy the six headings from any file in `how-to/`; end with a checkable "Done when" |
| a learning resource | add a row to `learning-path/resources.md` and a register row with a verified title and date |

## Before every commit

The pre-commit hook runs the privacy and sources checks. Run the report-only ones periodically:
`npm run check:links` (bot-blocked hosts show as soft) and `npm run check:balance` (practices naming
fewer than three organisations).

## Quarterly

- Re-read `labs/` against the current cards and frameworks; this is where the record moves fastest.
- List files with `last_reviewed` older than six months: `grep -rl "last_reviewed: 2026-0[1-3]" practices labs how-to`.
- Move any finished `ROADMAP.md` row into `patterns/`.
- Re-run `scripts/check-links.mjs` without `--report-only` and fix or re-source broken rows.

## Never

- Commit `privacy/forbidden-strings.txt` (the checker refuses to run if it is tracked).
- Let `kb-refresh` commit or push. `/refresh` wraps it and commits and opens a pull request on a
  refresh branch, only when the maintainer types it; neither skill merges.
- Add a client fact that is not expressed in the stand-in vocabulary.
- Quote a lab's internal process without a source; write "unknown" instead.
