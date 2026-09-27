---
id: wire-the-gates
title: Wire the gates
sources: [S046, S049, S066, S076]
last_reviewed: 2026-09-26
---

# Wire the gates

## When
A suite exists and runs on someone's laptop; a pipeline runs everything on every pull request and
people have started ignoring red; or a release process has no written rule for what blocks.

## What
A gate map: what runs per pull request, nightly, on a manual trigger, on a model change, and in
production; the threshold for each with the reason written next to it; an owner and a runbook per
gate; a flake policy.

## Why
A gate that fails every run is a gate people disable. A gate that never runs is decoration. The
cost of a model call and the noise of a probabilistic system mean the expensive, noisy checks
cannot run on every commit, and the cheap, deterministic ones must. The reason for each threshold
has to be written down, or the next person raises or lowers it without knowing why.

## How
1. **Per pull request: fast, deterministic, no network.** Unit and contract tests, schema
   checks, the guardrail binary suite against configuration, a one-user smoke against a stubbed
   model that must persist every answer. Minutes, not tens of minutes. Harness CI hooks make this
   ordinary [S046] [S066].
2. **Nightly: the distribution.** The criteria-based smoke suite N times with the real model,
   pass-rate distribution compared to the last nightly, drift alert on shift [S049]. Judge
   unable-to-verify rate tracked.
3. **Manual trigger: load and the tail.** Real-model load scenarios with a virtual user per
   conversation; breakpoint and ceiling re-measured after infrastructure changes [S076].
4. **On model or prompt change: the upgrade replay** (playbook 10).
5. **Production: sampled online scoring** on a small percentage of traffic, with the same judge
   and criteria, feeding the drift alert.
6. **Write the thresholds file.** For every gated metric: the value, whether it blocks, and the
   sentence that says why. For every reported-but-not-gated metric: why not, and what would make
   it a gate.
7. **Write the flake policy.** Retries visible in the report; a test seen flaky in parallel
   moves to a sequential lane; quarantine has an owner and a date; auto-restore after consecutive
   passes; never a bare skip.
8. **Name an owner and write a runbook per gate:** what a red means, who to call, how to tell
   "the gate is broken" from "the deploy is broken".

Gate map template:

```
| Gate | Runs | Includes | Blocks | Threshold and reason | Owner | Runbook |
|---|---|---|---|---|---|---|
| pr-fast | every PR | unit, contract, guardrail binary, 1-user stubbed smoke | yes | smoke p95 < 1.5 s (no network, so code-level); data_accuracy == 1 | quality | runbooks/pr-fast.md |
| nightly-distribution | 02:00 | criteria smoke x10, real model | no, alerts | pass rate >= 0.9 of last nightly; unable_to_verify <= 5% | quality | runbooks/nightly.md |
| load-manual | on dispatch | real-model stress and breakpoint | no | median < 2 s gated; p95 reported (model tail, see thresholds.md) | quality | runbooks/load.md |
| upgrade-replay | model or prompt change | golden set x10 both versions | yes | paired diff interval must not cross zero downward | quality + owner | runbooks/upgrade.md |
| prod-sample | continuous | 1% of conversations scored | no, alerts | drift alert on 5-point shift | platform | runbooks/drift.md |
```

## Done when
The map exists; every gated metric has a written reason; every reported-not-gated metric has a
written reason; every gate has an owner and a runbook; the flake policy is written; the per-PR
gate finishes in minutes with no model call.

## Related
Practices: [ci-gates-for-llm-apps](../practices/2-application-evals/ci-gates-for-llm-apps.md),
[online-evals-and-drift](../practices/6-observability/online-evals-and-drift.md).

