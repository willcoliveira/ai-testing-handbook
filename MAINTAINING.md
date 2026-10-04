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
   The sweeps read pages anyone can publish, so their reach is narrow by design: fetching is done
   by `web-reader` subagents (`.claude/agents/web-reader.md`, web access only); `kb-refresh`
   pre-approves only its own scripts and the sweep-list domains, so a write, an edit or any other
   command asks you first; `/refresh` and `/roles` stage named paths only after
   `node scripts/check-diff-paths.mjs <refresh|roles>` passes, and check the commit message and PR
   body with `check-forbidden --file`. With `git config core.hooksPath .githooks`, the `commit-msg`
   hook checks every commit message the same way.
3. Read `digests/YYYY-MM-DD.md`, then `git diff`. The skill adds sourced bullets, register rows and date
   bumps only; anything else is listed under "Skipped" for a human.
4. `npm run check`. Commit as `docs(refresh): YYYY-MM-DD digest`. Add one line to `CHANGELOG.md`.
5. `main` requires the CI check, so push the branch and merge through a pull request:
   `git push -u origin HEAD && gh pr create --fill && gh pr merge --squash --auto`. Auto-merge is
   enabled at repository level and lands the change when the check is green.

## Every few weeks

`/roles` reads current AI QA postings and updates `learning-path/ai-qa-requirements.md` and the
interview questions. It stores requirements only, never postings, companies or links.

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

## Site

The handbook is also published as a book at <https://willcoliveira.github.io/ai-testing-handbook/>.
VitePress reads the Markdown files in place; nothing in the content is written for the site.

- Run: `npm ci`, then `npm run docs:dev` (live), `npm run docs:build` and `npm run docs:preview`
  (the built site at `http://localhost:4173/ai-testing-handbook/`). Each first runs
  `node .vitepress/gen.mjs`, which writes the part intro pages (`practices/_part.md`,
  `practices/N-*/_part.md`, `patterns/_part.md`) and `.vitepress/data/*.json`. All are gitignored,
  and `_part.md` is skipped by `check-sources` and `apply-bullets`.
- Gate: `npm run test:site` builds with strict dead-link checking, runs the unit tests in
  `tests/site/unit/`, then `tests/site/post-build.mjs` over `.vitepress/dist` (links, fragments,
  citations, every page in the sidebar once, no third-party hosts, size budgets, forbidden strings).
- Reading order lives in `.vitepress/book.mjs`. Practices follow `TAXONOMY.md`; a practice file not
  listed there fails the build. A new learning-path file needs a place in `LEARNING_TAIL`.
- Add a part: create `practices/N-name/`, add a `## N. Name. Question?` area with its table to
  `TAXONOMY.md`, and add the practice files. The intro page and sidebar group follow from those.
- Citations: `[S0nn]` becomes a link to the register row; an id missing from `sources.md` fails the build.
- Privacy: `tests/site/post-build.mjs` runs `check-forbidden --dir .vitepress/dist` on the built
  HTML. In CI only the example list is present (the real list is gitignored), so that check is fully
  effective only locally and in the pre-commit hook. Nothing new is exposed: the repository is public.
- Security (review and adversarial re-test, 2026-10-04): the book accepts plain Markdown and data
  only. Off: Markdown images, Markdown attributes (`{...}`), GitHub alerts, custom containers (`:::`), snippet
  imports (`<<<`), includes (`<!--@include-->`, rejected by `gen.mjs` before the build), and code
  fence info other than a plain language name (VitePress writes it into the page raw). Frontmatter
  keys are an allowlist with fixed types, a title may not contain `<` or `>`, and frontmatter must
  open with a plain `---` (gray-matter would run `---js` through eval). Content folders hold
  Markdown only, checked at any depth by `gen.mjs` (also run from `config.mjs`): code, `[param]`
  routes, `*.paths.*` and `*.data.*` loaders and `public/` fail the build (`plugins/lockdown.mjs`; `description`,
  `layout`, `prev`, `next`, `head` fail the build). Every page's content is wrapped in `v-pre`, and
  every `{` `}` in text is an entity, so Vue evaluates nothing from content. Sidebar and prev/next
  labels are escaped. `post-build` parses each page (parse5) and fails on any `on*` attribute,
  URL with a scheme in anything but a link, `target=_blank` without `rel`, iframe/object/embed/meta
  refresh, markup in a label, any tag inside page content that plain Markdown does not produce, or any built
  file other than pages, code, styles, fonts, the sitemap and the hash map.
  `tests/site/unit/security-*.test.mjs` build every known payload. `check-forbidden` scans each line
  raw and as visible text (tags and emphasis removed, entities decoded, NFKC, zero-width and
  Unicode hyphens normalised), reports every match, compares allowlisted ids as whole tokens, skips
  binary formats only when they hold a NUL byte, reads UTF-16, scans CSS strings and comments, and
  matches names wrapped across lines or spaced out.
  Deploy is two jobs: `build` (read-only token, `npm ci --ignore-scripts`) and `deploy` (Pages and
  OIDC permissions, only `deploy-pages`); `tests/site/unit/workflow.test.mjs` checks this and more on
  the parsed YAML; the build job re-runs the post-build checks on the exact artifact, and every action
  is GitHub's own, pinned to a commit SHA (Dependabot updates the pins). Checkouts keep no credentials, every job has a timeout, superseded PR runs are
  cancelled. Adding a Markdown feature or a frontmatter key means changing `lockdown.mjs` and these
  tests on purpose.
- Windows: CI builds and tests the site on Linux and Windows (`.github/workflows/site.yml`).
  `.gitattributes` keeps LF line endings and the parsers in `.vitepress/read.mjs` accept CRLF.
- Dependencies: `package.json` overrides Vite to 6.4.3, because VitePress 1.6.4 ships Vite 5, which
  has dev-server advisories (one high, Windows paths) with no fix in Vite 5. CI fails on any
  moderate or higher advisory. Drop the override once a VitePress release depends on a fixed Vite.
- Browser tests: Playwright specs in `tests/site/e2e/` with one page object,
  `tests/site/pages/book.page.ts` (setup from `willcoliveira/playwright-ts-template`). Once:
  `npx playwright install chromium webkit` (`npm run pw:setup`; CI adds `--with-deps`). Then
  `npm run docs:build` and `npm run test:e2e` (the PR set: `chromium` at 1280px and `mobile-chrome`,
  a Pixel 7) or `npm run test:e2e:full` (adds `tablet` at 820px, `mobile-safari` on an iPhone 15 in
  WebKit, and the every-page sideways-scroll sweep tagged `@full`). Playwright starts
  `docs:preview` on port 4173 itself, or reuses one already running. `npm run report` opens the last
  HTML report; a local failure keeps a `trace.zip` under `test-results/` for
  `npx playwright show-trace`.
- `BASE_URL` points the tests at another copy of the site, such as a preview on another port or the
  deployed book (`BASE_URL=https://willcoliveira.github.io/ai-testing-handbook/ npx playwright test
  --grep @smoke`); Playwright then starts no server. Paths in specs are relative to it, never `/…`.
- Test code checks: `npm run lint` (ESLint with `eslint-plugin-playwright`), `npm run typecheck`
  (`tsc`), `npm run format:check` (Prettier, `npm run format` to fix). All three cover only
  `tests/site/**/*.ts` and `playwright.config.ts`; content, `.vitepress` and scripts keep their own style.
- Agent skill: `.claude/skills/playwright-e2e/` is generated by `wico-playwright-agent-skills`.
  `npm run skills:sync` regenerates it; `npm run skills:check` fails when the committed copy differs
  from a fresh one. Change the flags in the `skills:sync` script, not the files. Its example
  ticket ids and emails are listed as exact tokens in `privacy/allowlist.txt`; after a version bump,
  add any new placeholder `npm run check` reports there (never a real name).
- What runs where (`.github/workflows/site.yml`): every PR runs the static gates (Linux and Windows),
  the `lint` job (no browsers) and the `e2e` job (PR set, Chromium only, browsers cached per
  Playwright version); a push to `main` runs `e2e` too, because `deploy` waits for it. A push to
  `main` and the weekly schedule (Mondays) run the `full` job: all four
  projects in Chromium and WebKit, including the every-page sweep. A failing browser job uploads the
  HTML report as an artifact.
- Type specimen: `tests/site/fixtures/specimen.md` holds every element the theme styles (headings,
  lists, citations, the `[S0nn]` text, a normal and a wide table, code, a blockquote, the meta line
  and See also). It is built only with `SITE_TEST=1 npm run docs:build`, at `/specimen`, with a fixed
  sidebar of its own (`SPECIMEN_SIDEBAR` in `.vitepress/config.mjs`), so its screenshots never move
  with the content. A plain `npm run docs:build` (and the deployed site, sitemap and search index)
  has no specimen; `tests/site/unit/site-test.test.mjs` holds that switch. With `SITE_TEST=1`,
  `post-build.mjs` lets only the specimen sit outside the book sidebar.
- Visual tests: `tests/site/e2e/visual.spec.ts` (tag `@visual`) takes element screenshots of the
  specimen and of the nav bar, sidebar and pager (page body masked) in light and dark, on `chromium`,
  `tablet` and `mobile-chrome` (never WebKit). Budget: `maxDiffPixels: 50`, animations off
  (`playwright.config.ts`). `test:e2e`, `test:e2e:full` and `@smoke` runs leave it out;
  `npm run test:visual` builds with `SITE_TEST=1` and runs it (POSIX shell syntax, so Linux, macOS
  or the Docker image, not Windows `cmd`). Baselines
  (`tests/site/e2e/visual.spec.ts-snapshots/*-linux.png`, 24 files) are Linux-only, so run and
  regenerate them in the Playwright image, from the repository root:
  ```
  docker build --platform linux/amd64 -f tests/site/Dockerfile -t hb-visual .
  docker run --rm --platform linux/amd64 --init --ipc=host hb-visual            # check
  docker rm -f hb-visual-run 2>/dev/null
  docker run --platform linux/amd64 --name hb-visual-run --init --ipc=host hb-visual \
    npm run test:visual -- --update-snapshots                                   # regenerate
  docker cp hb-visual-run:/app/tests/site/e2e/visual.spec.ts-snapshots tests/site/e2e/
  docker rm hb-visual-run
  ```
  Rebuild the image after any change (it copies the repository). A failed check leaves the diffs in
  the container's `/app/test-results` (`docker cp` them out, or drop `--rm`). Review the new PNGs,
  then commit them by hand.
- Baselines from CI instead: Actions > Site > Run workflow, tick `update_baselines`. The `visual` job
  regenerates them in the same image and uploads the `visual-baselines` artifact; download it, copy
  the PNGs into `tests/site/e2e/visual.spec.ts-snapshots/` and commit them by hand. Nothing in the
  workflow commits or pushes. With no committed baselines the job fails with "no baselines: run the
  update-baselines dispatch".
- When the visual job runs: on a PR only when it changes `.vitepress/**`, `tests/site/**`,
  `playwright.config.ts` or `package*.json` (the `changes` job), and on a dispatch. Content-only PRs,
  refreshes included, skip it while the other site jobs still run. A failing run uploads the report
  and diff images (`playwright-report-visual`).
- Dockerfile tag: the `FROM mcr.microsoft.com/playwright:vX.Y.Z-noble` tag in `tests/site/Dockerfile`
  must equal the installed `@playwright/test` version; the `lint` job fails until it does. Bump both
  together, then regenerate the baselines.
- Deploy: a push to `main` runs `deploy` after `test`, `lint` and `e2e` pass: a production build
  (no `SITE_TEST`) uploaded with `upload-pages-artifact` and published with `deploy-pages`
  (Settings > Pages > Source: GitHub Actions). Then `smoke` runs the `@smoke` tests on Chromium
  against the live URL (`BASE_URL` set, no local server) and uploads its report on failure.
- Dependabot (`.github/dependabot.yml`): monthly. npm minor and patch updates come as one grouped
  PR, and GitHub Actions as another; an npm major update comes as its own PR. `@playwright/test`
  and `wico-playwright-agent-skills` always come alone, because each needs a follow-up commit on
  the PR: the Dockerfile tag and usually new baselines for Playwright, `npm run skills:sync` for the
  skill. Major updates of `typescript` (until `typescript-eslint` supports it) and `@types/node`
  (the site runs on Node 22) are ignored.
