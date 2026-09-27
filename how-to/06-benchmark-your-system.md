---
id: benchmark-your-system
title: Benchmark your system
sources: [S001, S004, S005, S006, S027, S049, S076, S154]
last_reviewed: 2026-09-26
---

# Benchmark your system

## When
Someone asks "is version B better than A", "is it fast enough for launch", "how does our model
compare", or "which vendor". Or a public leaderboard number is about to be quoted in a decision.

## What
An internal benchmark record: a frozen case set and version, N runs per version, pass-rate
distributions with error bars, latency and cost per turn under a stated load, a breakpoint, and a
recommendation with the trade-off. Plus a note on which public benchmarks were consulted and why
they do or do not apply.

## Why
One run of a probabilistic system is a sample, not a score. Error bars on eval scores are
computable and usually wider than teams assume; the difference between two versions needs a
paired test, not a glance [S004]. Public leaderboards are gamed and contaminated: the Leaderboard
Illusion documents private testing and selective disclosure [S006], GSM1k showed memorisation on a
canonical set [S154], and OpenAI retired SWE-bench Verified after auditing its tasks [S027].
BetterBench gives the criteria for judging whether a benchmark is worth using at all [S005].

## How
1. **Freeze the inputs.** Case set version, model id, prompt version, judge version, tool set.
   Two versions differ in exactly the thing you are measuring.
2. **Run N times per version.** Ten is a floor for a smoke set; use the nondeterminism guidance
   of your harness to seed and repeat [S049]. Record every run, not the best.
3. **Report distributions with error bars.** Per version: mean pass rate, a confidence interval
   computed as the error-bars paper describes (per-question standard error, clustered when
   questions share a source), and the paired difference with its interval [S004]. A difference
   whose interval crosses zero is not a difference.
4. **Measure latency and cost under load, separately from quality.** A virtual user is one real
   conversation; stub the model for volume and keep integrations real; run the real model for the
   tail [S076]. Gate the median, report p95 and p99 with the reason, find the breakpoint, and
   publish a ceiling with headroom.
5. **Consult public benchmarks with a checklist.** For each one you might quote: what it
   measures, how it is graded, whether the test set is public, its age, and whether the
   maintainer has audited it [S005] [S001]. Quote it only for the capability it measures, with
   its date, and never as evidence about your task.
6. **Write the recommendation as a decision.** "Ship B", "hold at 25 concurrent", "do not adopt
   until X". State the trade-off accepted.

Benchmark record template:

```
question: is prompt v12 better than v11 on the enrolment smoke set?
inputs: cases v3 (50), model <id>, judge <id>/<prompt v>, tools unchanged
runs: 10 per version, seeds recorded
quality: v11 0.84 [0.79, 0.89]; v12 0.90 [0.86, 0.94]; paired diff +0.06 [+0.02, +0.10]
unable to verify: v11 3%, v12 2%
latency: median 1.3 s both; p95 5.2 s (v11) vs 5.4 s (v12), not gated, reason: model tail
cost: +4% tokens per turn on v12
public benchmarks consulted: none apply to this task
decision: ship v12; trade-off: 4% cost for 6 points; recheck p95 after worker tuning
```

## Done when
Two versions differ in one input; N runs each; intervals reported; a paired difference; latency
and cost stated with what is gated and why; a decision sentence; and any public number quoted
carries its date and its scope.

## Related
Practices: [statistical-treatment-of-evals](../practices/1-capability/statistical-treatment-of-evals.md),
[non-determinism-and-pass-rates](../practices/2-application-evals/non-determinism-and-pass-rates.md),
[load-and-latency](../practices/4-agents-and-systems/load-and-latency.md),
[benchmark-hygiene](../practices/1-capability/benchmark-hygiene.md). 
[benchmarks/README](../benchmarks/README.md) for the public matrix.
