# Changelog

## 0.1.24 (2026-10-29)

- Refresh process, from the 2026-10-28 run: a figure is read a second time from its page or
  abstract before it goes into a bullet, asked for by quantity and never by expected value, and a
  figure the page gives twice or that cannot be paired with its comparison stays out (`/refresh`
  step 2b, kb-refresh step 6); arXiv queries take the top 10 when `--since` is more than seven days
  back, since the top 5 covered only the last three to seven days of a twelve-day window; the
  one-at-a-time rule for arXiv opens every prompt that fetches there and is repeated per part.

## 0.1.23 (2026-10-29)

- Site gates, from the 2026-10-28 repository audit: the content lint rejects a symlink in a content
  folder (it published an excluded file, such as a test fixture or a draft digest, as a page under
  the link's name, with a canonical URL for a route that does not exist) and a root `404.md`
  (VitePress builds it as the not-found page, outside the sidebar, with content the HTML gate never
  parses); post-build fails on a built `404.md` chunk and on any `<script>` that is not one of the
  four a VitePress build emits. Regression tests in `tests/site/unit/`; the record is
  `repo-audit-2026-10-28.md` in the maintainer's plan records.

## 0.1.22 (2026-10-28)

- Refresh since 2026-10-16: twenty new sources (S455 to S474): METR's review of Anthropic's
  August 2026 Risk Report and its red team of OpenAI's agent monitor, Amazon's third-party review
  of its safety eval set, UK AISI and Anthropic on the Mythos 5 cyber-evaluation incident, AISI on
  pretraining data filtering and ReproBAIT, the GPT-6.1 Terra addendum, Cohere on a rare outbound
  call from Qwen3.8-Flash-Next, the Gemini 4 Carbon launch post, seven arXiv papers (BARBICAN,
  Log-To-Leak, ShutdownMod, budgeted strong-verifier audits, Req2Test-Bench, FeatureArc, decision
  models as judges) and two OWASP documents; eighteen bullets across fifteen practices, plus
  bullets for tau2-bench 2.0.0 (scores not comparable with 1.x) and OTel PR #578 (embeddings
  metrics); Inspect AI 0.3.286, promptfoo 0.125.1, DeepEval 4.3.2 and Langfuse v4.71.0 recorded;
  two new contradictions for the reviewer; sweep-list notes fixed or extended on thirteen items;
  `digests/2026-10-28.md`.

## 0.1.21 (2026-10-16)

- Refresh since 2026-10-13: ten new sources (S445 to S454): a study of what an LLM judge must be
  shown, Google's Gemini 4 Argon safety post, SWE-MISBEHAVIOR, NVIDIA NeMo Gym with Siemens,
  Cohere on teams of coding agents, the INFUSE indirect injection benchmark, calibration and
  deferral for injection detectors, Apollo on update-aware reasoning in GLM-5.3, the GPT-Live-1.1
  system card and evaluation awareness in Indic languages; one bullet each in ten practices;
  Inspect AI 0.3.281 (Docker sandboxes block writable host mounts by default from 0.3.280),
  DeepEval 4.3.0 and Langfuse v4.63.0 recorded; register ids and two notes in the sweep list;
  `digests/2026-10-16.md`.

## 0.1.20 (2026-10-14)

- Design decisions the evals have to back: a new practice,
  `practices/4-agents-and-systems/side-effects-and-state.md`, on proving an agent's action takes
  effect once under retries, replays and resumes (idempotency keys, fault-injection tests, effects
  counted in the end state), on testing approval pauses, and on keeping authoritative state in
  the system of record. Playbook 01 gains a "does this box need a model" step with a scored
  baseline and a booking-tool row; playbook 06 a non-inferiority step for cost cuts; playbook 10
  covers prompt version changes and records the margin; playbook 13 treats a replay as a retry.
  Interview questions 29 to 34, two glossary terms, a knowledge-matrix row, ten sources (S435 to
  S444) and an S357 note on untrusted tool annotations.

## 0.1.19 (2026-10-13)

- Refresh since 2026-10-12: five new sources (S430 to S434): the GLM-5.3 model card, Anthropic's
  self-replication evaluation and distillation defences, UK AISI's priorities for frontier best
  practice and the Gemini 4 Argon launch; OTel PR #374 recorded, which removed
  `gen_ai.client.token.usage` in September, and genai-tracing How step 4 updated to the new token
  metrics; GLM-5.3 added to the Moonshot and Zhipu lab page; Inspect AI 0.3.279 and Langfuse
  v4.58.0 recorded; six bullets; the arXiv contamination query rewritten, a Gemini launch feed
  added and arXiv results from the days before `--since` kept when never seen;
  `digests/2026-10-13.md`.

## 0.1.18 (2026-10-12)

- Follow-ups from the 2026-10-12 refresh: four sources (S426 to S429), NVIDIA OpenShell runtime
  controls, two LLM-as-a-judge reliability studies and the RH-Detect reward-hacking benchmark, with
  bullets in guardrails, judge-calibration, rubrics-and-pairwise and agent-evals. GenAI tracing How
  step 4 now names `gen_ai.client.inference.duration` and the renamed streaming metrics; the
  refresh's OTel bullet and S136 note are corrected (the old duration metric was narrowed, not
  replaced).

## 0.1.17 (2026-10-12)

- `/refresh` keeps its sweep list current: the sweep agents report off-target queries, failed or
  undated pages and stale compare notes, and the run fixes them, adds up to two pages or queries
  for a trend seen in two or more accepted sources, and removes dead items, each tested with one
  fetch first and listed in a new "Sweep list changes" section of the digest. arXiv queries run one
  at a time, since a parallel burst is throttled.

## 0.1.16 (2026-10-12)

- Refresh since 2026-10-03: fourteen new sources (S412 to S425) including Anthropic's review of
  unintended agent actions during benchmark runs, UK AISI's Transect transcript tool, OpenAI's
  October GPT-6 Sol and Luna update, TestJack's audit of coding benchmark graders and APEX-Harm;
  Inspect AI 0.3.278, promptfoo 0.124.1 and Langfuse v4.56.0 recorded; eighteen bullets; the arXiv
  judge query fixed and a reward-hacking query added to the sweep list; `digests/2026-10-12.md`.

## 0.1.15 (2026-10-05)

- RAG testing: a practice page (`practices/2-application-evals/rag-evals.md`), playbook 17 (Test a
  RAG application) with a worked example that redoes a five-case demo report (the unanswerable case
  becomes an expected abstention), and a staged RAG build project in the learning path whose
  exercises run from a planted corpus to a report. Interview questions 26 to 28, seven glossary
  terms, the DeepEval recall, relevancy and hallucination rows in the metrics table, a roadmap row
  for a starter repository, and sources S393 to S411.

## 0.1.14 (2026-10-04)

- The refresh and roles skills, which read pages anyone can publish, can no longer be steered by a
  fetched page into files, commands or a commit: fetching moves to a `web-reader` agent with web
  access only, `kb-refresh` pre-approves only its own scripts and the sweep-list domains, and
  `/refresh` and `/roles` stage named paths after `scripts/check-diff-paths.mjs` and check the
  commit message and PR body for forbidden strings (also a `commit-msg` hook).
  `wico-playwright-agent-skills` 2.4.1: writes are contained to the project and project fields
  are validated; the regenerated skill treats traces and saved auth state as secrets.

## 0.1.13 (2026-10-04)

- Security hardening from a review of the site work and an adversarial re-test of the fixes: the
  book accepts plain Markdown (no images, attributes, containers, includes or raw fence labels) and
  typed frontmatter from an allowlist only, opened by a plain `---`, page content is never
  evaluated by Vue, labels are escaped, and a parser-based post-build check fails on handlers,
  `javascript:` URLs, third-party loads and injected markup, with tests for every known payload.
  The privacy check scans visible text as well as raw lines and no longer lets an allowed token,
  the noreply address, markup, lookalike characters or a file extension hide a hit. The Pages
  deploy is split so the job holding deploy permissions runs no repository or dependency code,
  checked on the parsed workflow, re-checked on the exact artifact, with every action pinned to a
  commit SHA. Content folders hold Markdown only. New dev dependencies: `parse5`, `yaml`. `MAINTAINING.md`,
  "## Site".

## 0.1.12 (2026-10-04)

- The handbook as a book at <https://willcoliveira.github.io/ai-testing-handbook/>: VitePress over
  the Markdown in place, learning path first, then parts I to VIII with generated intro pages,
  playbooks, patterns, appendices and about; previous/next and arrow keys; `[S0nn]` citations link
  to the register; black-and-white theme with dark mode, print styles and phone and tablet layouts.
- Gates on every PR, on Linux and Windows: strict links, post-build checks (citations, sidebar
  coverage, third-party hosts, size budgets, forbidden strings in the built HTML), unit tests,
  `npm audit`. A Playwright suite on the `playwright-ts-template` conventions with the
  `playwright-e2e` skill (reading flow, citations, search, layout, dark mode, axe), the full
  four-browser sweep on `main` and weekly, and screenshot tests of a specimen page with baselines
  from the Playwright Docker image.
- Deploy to GitHub Pages on every push to `main` after the gates, then a smoke test on the live
  site. Dependabot monthly: minor and patch grouped, majors alone. Vite overridden to 6.4.3 for
  the dev-server advisories in VitePress 1.6.4. See `MAINTAINING.md`, "## Site".

## 0.1.11 (2026-10-03)

- Refresh since 2026-09-30: six new sources (S387 to S392) including METR's Senate testimony on
  agents defeating a test scorer, UK AISI's hardened environment for dangerous-capability evals
  and Cohere's RCP-nDCG judge; Inspect AI 0.3.276, Langfuse v4.50.0, Petri 3.1.1 and DeepEval
  4.2.8 recorded; ten bullets; `digests/2026-10-03.md`.

## 0.1.10 (2026-10-02)

- Pattern `decision-model-triage-before-an-llm-judge`: a hosted and an open, self-hosted
  decision model measured against an adversarial LLM judge on payment features (calibration,
  live shadow sessions, constructed discrimination tests, a partial fine-tune), and why both stay
  advisory. Pattern sections filled in `llm-as-judge`, `judge-calibration`,
  `rubrics-and-pairwise`, `exploratory-testing-of-agents`, `ci-gates-for-llm-apps` and
  `non-determinism-and-pass-rates`; a precursor note on the judge calibration study in the roadmap.
- Playbook 16 Add a decision model to a testing workflow: typed questions, scrubbing and logging
  what leaves the machine, shadow mode, calibration against existing verdicts, constructed
  discrimination tests, an adoption bar set before the run, and replacement versus gate versus
  advisory, failing open.
- Glossary: adversarial judge, AUROC, claim card, constructed test, decision model, fail open,
  shadow mode, typed question.
- Fixed the dead criteria-authoring links in `llm-as-judge` and `rubrics-and-pairwise`.
- The payments stand-in in `PRIVACY.md` and the governance pages now reads "a platform with
  payment features".

## 0.1.9 (2026-10-01)

- MCP testing: practice `mcp-testing` (contract, tool quality, security, tracing; the 2026-07-28
  stateless spec), playbook 15 Test an MCP server, requirement R19, interview questions 23 to 25,
  MCP rows in the tools and metrics pages; 32 new sources (S355 to S386) including the MCP
  specification, OWASP's MCP cheat sheets, Invariant Labs' disclosures and six arXiv papers.

## 0.1.8 (2026-09-30)

- `learning-path/ai-qa-requirements.md`: the requirements that AI QA roles ask for, consolidated
  from 24 current postings into 18 requirements with fundamentals, a worked example and what to
  build for each, plus a section on evaluation roles at AI labs; five new interview questions
  (18 to 22); 7 new sources (S348 to S354); `/roles` to update the page from new postings.

## 0.1.7 (2026-09-30)

- Interview preparation and two new playbooks: 13 Debug a multi-agent orchestration (tracing a
  subagent's status and context, budgets, handoff contracts, checkpoints and replay) and 14 Test a
  backend-only chatbot (deterministic, judged, red team and performance layers); a DeepEval and
  Ragas metric map in `tools/rag-and-agent-metrics.md`; `learning-path/interview-questions.md` with
  17 sourced answers; 26 new sources (S322 to S347) and 11 sourced bullets across six practices.

## 0.1.6 (2026-09-30)

- Fourth refresh, all areas (35 items, first run of `/refresh`): 9 new sources (S313 to S321: the GPT-6.1 Sol
  system card addendum, listing only, and eight arXiv papers), 10 sourced bullets across eight practices,
  Inspect AI 0.3.273 (multi-model grading fix), DeepEval 4.2.7, Langfuse 4.48.0 and the OTel GenAI
  skill attributes recorded, last_checked bumped on 57 rows. Digest: `digests/2026-09-30.md`.

## 0.1.5 (2026-09-29)

- Third refresh, all areas (full sweep list, 36 items): 6 new sources (S307 to S312, arXiv), 8 sourced
  bullets across seven practices, Inspect AI 0.3.272 and Langfuse 4.47.0 recorded, last_checked bumped
  on 56 rows. Labs, vendor and standards pages had nothing new since 2026-09-28.
  Digest: `digests/2026-09-29.md`.

## 0.1.4 (2026-09-28)

- Second refresh, areas 1 to 4, 6 and 7 plus the vendor pages: 10 new sources (S297 to S306), 17 sourced
  bullets across nine practices, tool release notes for promptfoo, DeepEval and Langfuse, and the three
  headline sources from the first run (OWASP 2026, METR on Opus 5.5, DeepMind double-blind) read in
  full and upgraded from listings to content. Digest: `digests/2026-09-28-areas-1-4-6-7.md`.

## 0.1.3 (2026-09-28)

- First refresh, area 5: 16 new sources (S281 to S296), 18 sourced bullets across nine practices,
  the OWASP LLM Top 10 2026 edition recorded, newer OpenAI system cards noted for reading, six lab
  files updated with listing-level items, the sweep list extended to the vendors added in 0.1.1.
  Digest: `digests/2026-09-28.md`.

## 0.1.2 (2026-09-27)

- Removed the eleven patterns drawn from one healthcare voice-and-SMS programme; that case stays
  private. The practices, playbooks and learning path keep only generic examples. One pattern
  remains. Added the exploratory-session playbook.

## 0.1.1 (2026-09-27)

- Vendor coverage: lab files for DeepSeek, Alibaba Qwen, Moonshot and Zhipu (with ByteDance and
  MiniMax), Microsoft, Amazon, xAI, NVIDIA, Cohere and the open ecosystem; Google extended with the
  Gemini and Gemma material; a cross-vendor matrix in `labs/README.md`; 68 new sources; 170 sourced
  bullets added across the practices; a vendor-balance rule and a report-only checker.
- How-to playbooks: eleven procedures with templates and exit criteria.

## 0.1.0 (2026-09-26)

- Initial reference: eight-area taxonomy, a register of 201 dated sources, 39 practice files,
  5 lab files, tools and benchmarks matrices with 8 tool notes and 12 benchmark cards, a datasets
  guide, a training-lifecycle guide, a 90-term glossary, 12 anonymised patterns (pending review),
  a six-phase learning path with a knowledge matrix, and the manual `kb-refresh` skill.
