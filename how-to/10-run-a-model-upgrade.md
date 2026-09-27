---
id: run-a-model-upgrade
title: Run a model upgrade
sources: [S004, S041, S146, S147, S148]
last_reviewed: 2026-09-26
---

# Run a model upgrade

## When
A deprecation notice arrives; a newer model is cheaper, faster or better on a benchmark; a
vendor changes a model behind the same id; or a judge model is being changed.

## What
An upgrade record: the deprecation or motivation, the migration notes read, the replay results
for both versions with a paired difference, safety suite results, judge recalibration, latency
and cost, a canary plan with a rollback rule, and the decision.

## Why
Model behaviour changes between versions in ways no changelog lists; the ChatGPT drift study
measured large swings on the same tasks across a few months [S041]. Providers publish deprecation
schedules [S147] [S148] and migration guidance that names parameter and behaviour changes [S146];
reading them is the cheap part. The expensive part, replaying your own cases, is the only evidence
about your task.

## How
1. **Read the deprecation and migration notes** and list every parameter, default and
   behaviour change that could touch your prompts or tools [S146] [S147] [S148].
2. **Pin both versions** as explicit build inputs; never let "latest" be a version.
3. **Replay the golden set N times on each,** same cases, same judge, same tools (playbook 06).
   Report the paired difference with its interval [S004].
4. **Run the safety suite** on the new version. Binary. Any must-block or must-not-block change
   is a stop.
5. **Recalibrate the judge if the judge changed,** or check that judge agreement on the new
   outputs has not moved (playbook 05).
6. **Measure latency and cost** at the load you gate on.
7. **Plan the canary:** what percentage, for how long, which metrics, and the rollback rule
   written before it starts.
8. **Update the register:** the model id in every run log, the thresholds file if a reason
   changed, the calibration record.
9. **Decide, in one sentence,** with the trade-off.

Upgrade record template:

```
from: <model id A>      to: <model id B>      reason: deprecation 2026-12 / cost -30%
notes read: migration guide (params x, y), deprecation page (date)
replay: cases v3 x10; A 0.88 [0.84, 0.92]; B 0.87 [0.83, 0.91]; paired -0.01 [-0.04, +0.02]
safety suite: 24/24 both; injection corpus 18/18 both
judge: unchanged; agreement on B outputs kappa 0.82 (record #7)
latency: median 1.2 s -> 1.0 s; p95 5.1 s -> 4.4 s
cost: -30% per turn
canary: 10% for 5 days; rollback if pass rate < 0.85 or any safety fail
decision: proceed; trade-off: quality flat within interval, cost down
```

## Done when
Both versions were replayed N times on the same cases; the paired interval is reported; the
safety suite passed; the judge was recalibrated or verified; the canary has a rollback rule
written before it starts; the register and run logs carry the new id.

## Related
Practices: [regression-on-upgrade](../practices/7-training-and-lifecycle/regression-on-upgrade.md),
[non-determinism-and-pass-rates](../practices/2-application-evals/non-determinism-and-pass-rates.md).
[training/README](../training/README.md) for what changes inside a model between versions.
