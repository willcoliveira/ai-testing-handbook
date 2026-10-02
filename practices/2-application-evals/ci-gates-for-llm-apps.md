---
id: ci-gates-for-llm-apps
title: CI gates for LLM apps
area: 2-application-evals
status: draft
last_reviewed: 2026-10-02
sources: [S031, S032, S033, S036, S042, S043, S046, S047, S049, S299, S346, S347]
related: [eval-driven-development, non-determinism-and-pass-rates, load-and-latency, regression-on-upgrade, online-evals-and-drift]
---

# CI gates for LLM apps

## What
A CI gate is a check that runs on a proposed change and can block the merge. For an LLM application the
question is which evals belong in that gate, which run on a schedule, and which run only when a person asks,
because a model call is slow, costs money, and can fail for reasons unrelated to the change. The practice is a
tiered layout: cheap deterministic checks and a small regression set on every pull request, expensive and noisy
suites on a nightly or manual trigger, and a written rule for what may never gate.

## Why
Teams do it because the alternative is a green build that means nothing or a red build nobody reads.
Anthropic: automated evals are "especially useful pre-launch and in CI/CD, running on each agent change and
model upgrade as the first line of defense" [S032]. OpenAI: "Set up continuous evaluation (CE) to run evals on
every change" [S033]. Hamel's split by cost is the practical version: assertion-level tests "on every code
change", human and model evaluation "on a set cadence", A/B tests "only after significant product changes"
[S036]. The trade-off is trust against coverage. A gate that fails for flakiness gets disabled, so the gate
holds only the checks that are stable enough to be believed, and the rest is reported.

## How
1. **Trigger on the files that matter.** promptfoo's GitHub Actions example runs on `pull_request` for paths
   `prompts/**` and `promptfooconfig.yaml`, with `promptfoo/promptfoo-action@v1` [S046]. Prompt files, tool
   schemas and eval configs are code; a change to any of them runs the gate.
2. **Layer one, every PR, must not call a real model.** Unit-test assertions in the style of pytest: format
   checks, "generic assertions like the one to verify UUIDs are not in the response", tool-call shape [S036].
   A stubbed model makes this layer fast and repeatable. See [offline-probes](offline-probes.md).
3. **Layer two, every PR, a small regression set with repeats.** Regression cases "should have a nearly 100%
   pass rate" [S032]. Run 3 to 5 trials on LLM-graded cases [S049]; promptfoo's `--repeat` and
   `--filter-sample N` keep the run short [S047]. Gate on `PROMPTFOO_PASS_RATE_THRESHOLD`; the run exits with
   code 100 on a failing test or a rate below the threshold, 1 on other errors [S047]. The docs' shell example
   fails the job when the pass rate is under 95 percent [S046].
4. **Layer three, nightly or on demand, the full and expensive suites.** Capability evals "should start at a
   low pass rate" [S032], so they never gate. Braintrust's model: "Offline evaluation runs against known
   datasets before deployment", with each experiment "an immutable snapshot" you compare over time [S043].
   Hamel's FAQ: "phase out expensive evals like LLM-as-a-judge more aggressively than cheaper evals" and retire
   any that always pass [S042].
5. **Gate the latency figure you can hold, report the rest.** Anthropic's criteria example includes
   "95% response time < 200ms" as one line of a multidimensional target [S031]. A percentile that a shared
   runner cannot reproduce will fail on load unrelated to the change; gate the median, report p95, and write
   the reason down in the workflow file.
6. **Make output machine-readable.** promptfoo writes JUnit XML so the CI viewer shows each case as a test
   [S046]. Keep the per-case scores outside CI with the prompt and dataset version: "collect metrics along with
   versions of your tests/prompts outside your CI system" [S036].
7. **Cache what does not change.** promptfoo caches under `~/.cache/promptfoo` keyed on prompt and config
   hashes [S046]; `--no-cache` forces a fresh run when the model or provider changed [S047].
8. **Run the gate on model upgrades too.** The same suite that runs per PR is the first thing to run when a
   dated model snapshot changes [S032]. See [regression-on-upgrade](../7-training-and-lifecycle/regression-on-upgrade.md).

| Tier | Trigger | Calls a real model | Gates | Source |
|---|---|---|---|---|
| Deterministic assertions, stubbed model | every PR | no | yes | [S036] |
| Regression set, 3 to 5 trials | every PR | yes, small set | yes, threshold below 100 written down | [S032], [S049], [S047] |
| Capability set, judge-heavy suites | nightly or manual | yes | no, reported | [S032], [S042] |
| Load scenarios | manual | yes | median only | [S031] |
| A/B on users | after significant change | production | no | [S036] |

## Who does it (sourced)
- **Anthropic, 2026-01-09:** says automated evals run in CI/CD on each agent change and model upgrade, with
  regression suites near 100 percent and capability suites deliberately low [S032].
- **OpenAI, living docs (checked 2026-09-26):** says to run evals on every change as continuous evaluation and to
  grow the set over time [S033].
- **Hamel Husain on Rechat, 2024-03-29:** says the team ran assertion tests through GitHub Actions on every
  change, tracked results in Metabase, and reserved A/B tests for significant changes [S036].
- **Hamel Husain, living FAQ (checked 2026-09-26):** says CI evals catch regressions while production evals reveal
  new failure modes, and that always-passing and expensive evals should be run less often or retired [S042].
- **Braintrust, living docs (checked 2026-09-26):** runs offline evals before deployment as immutable experiments
  and scores production traces asynchronously "with no impact on latency" [S043].
- **promptfoo, docs dated 2026-09-26:** ships a GitHub Action, a pass-rate threshold, JUnit output and caching
  for pull-request runs [S046], [S047].
- **arXiv, 2026-09:** selecting a benchmark subset from agent action-trajectory embeddings cut regression-testing cost by 90 percent in the paper's setting, at an accepted error rate [S299].
- **Anthropic and OpenAI, 2026-09:** both structured-output docs guarantee schema adherence but name the exceptions: a refusal can take precedence over the schema, and a response cut off at the token limit may not match it [S346][S347].

## Pitfalls
1. **Gating on a suite that is supposed to fail.** Capability evals start low by design [S032].
2. **A single trial behind a 100 percent threshold.** LLM-graded cases need repeats and a written threshold
   [S049], [S047].
3. **Gating a tail latency on a shared runner.** A gate every PR fails is a gate people disable; hold the
   median and report the tail with the reason [S031].
4. **Running the whole suite on every PR.** Cost and wall-clock push people to skip it; sample and filter
   [S047], move the rest to a schedule [S042].
5. **Results that live only in the CI log.** Trends need per-case scores stored with prompt and dataset
   versions [S036], [S043].

## Pattern from a production build
A decision model proposed as a gate in front of an LLM judge (skip or shorten the judge on
confident items) was refused: it would have passed every claim the judge refuted. It runs in
shadow, records its reading next to the verdict and fails open: a timeout or an error leaves the
pipeline exactly as it was. See [decision-model-triage-before-an-llm-judge](../../patterns/decision-model-triage-before-an-llm-judge.md).

## Sources
- [S031] Create strong empirical evaluations, Anthropic Claude Platform docs, living (checked 2026-09-26).
- [S032] Demystifying evals for AI agents, Anthropic engineering, 2026-01-09.
- [S033] Evaluation best practices, OpenAI developer docs, living (checked 2026-09-26).
- [S036] Your AI product needs evals, Hamel Husain, 2024-03-29.
- [S042] Frequently asked questions (and answers) about AI evals, Hamel Husain, living (checked 2026-09-26).
- [S043] Evaluate (overview), Braintrust docs, living (checked 2026-09-26).
- [S046] CI/CD integration, promptfoo docs, living (checked 2026-09-26).
- [S047] Command line reference, promptfoo docs, living (checked 2026-09-26).
- [S049] How to deal with nondeterminism, Braintrust foundations, living (checked 2026-09-26).
- [S299] Trajectory-aware benchmark subset selection for cost-efficient software engineering agent regression testing, arXiv 2609.24928, 2026-09-21
- [S346] Structured outputs (Claude docs), Anthropic, living
- [S347] Structured model outputs (OpenAI docs), OpenAI, living
