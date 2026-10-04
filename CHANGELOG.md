# Changelog

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
