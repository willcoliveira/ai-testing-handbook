# METR time horizon

## What it measures
The length of task, measured in how long humans take, that an AI agent can complete with a given success rate. The headline is the 50% time horizon: "the time humans typically take to complete tasks that AI models can complete with 50% success rate". Tasks come from RE-Bench, HCAST and 66 new short tasks, timed with domain-expert humans; the paper reports the horizon doubling about every seven months since 2019 and Claude 3.7 Sonnet at roughly 50 minutes [S014]. The blog gives 170 tasks, success near 100% under 4 minutes of human time and under 10% above about 4 hours, and also reports an 80% horizon [S015].

## Format and grader
Each task has a human baseline time. A model is run on all tasks, a logistic curve of success against log human time is fitted, and the horizon is the time at which the curve crosses 50% (or 80%). Confidence intervals come from a hierarchical bootstrap over task families, tasks and attempts [S015]. The paper was revised through July 2026 (v4) and published at NeurIPS 2025 [S014].

## Known issues
- The metric is one number summarising a curve with substantial model error, which the authors acknowledge [S015].
- Tasks are software and reasoning tasks with clean scoring; whether the trend transfers to messier real work is stated as a conditional in the abstract [S014].
- The blog page has been updated with later models (through November 2025), so the number you read depends on when you read it [S015].
- Task privacy is not described in the sources read here; treat contamination as unknown.

## How a team should use it
Use it to size what autonomy to expect: if the horizon is about an hour at 50%, plan for agents that need a checkpoint well before that in human-equivalent effort, and expect the 80% horizon to be much shorter. Do not use it to compare two models a few months apart without the intervals.

## Sources
- [S014] Measuring AI ability to complete long tasks, Kwa et al., METR, 2025-03-18.
- [S015] Measuring AI ability to complete long tasks (blog), METR, 2025-03-19.
