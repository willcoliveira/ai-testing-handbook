# ARC-AGI (1, 2, 3)

## What it measures
Fluid, adaptive skill on novel tasks, with as little dependence on language and prior knowledge as possible. ARC-AGI-3 (March 2026) moves from static puzzles to interactive, turn-based environments: the agent must explore, infer the goal and plan without instructions. Environments are difficulty-calibrated with human test-takers; humans solve 100% of them, and frontier AI systems scored below 1% as of March 2026 [S022]. The ARC Prize Foundation, a nonprofit co-founded by Mike Knoop and François Chollet, runs all three versions and a 2026 prize of over 2M USD across three tracks on Kaggle [S023].

## Format and grader
Scoring is efficiency-based against human action baselines: "A 100% score means AI agents can beat every game as efficiently as humans" [S023]. The paper describes measuring skill-acquisition efficiency over time rather than final answers only [S022]. Public versus private evaluation-set rules and per-level scoring were not readable on the pages fetched; the technical report and documentation on arcprize.org carry them.

## Known issues
- The public site's headline pages carry no score tables; scores live on per-version leaderboard pages.
- Novel environments cut contamination risk to low, at the cost of any direct link to product tasks.
- An efficiency score against humans depends on how the human baseline was collected; the paper says extensive testing, without counts in the abstract [S022].

## How a team should use it
- Treat it as a signal about generalisation to unseen interactive tasks, not about any specific job.
- If your product puts an agent in an unfamiliar interface, the gap between 100% human and under 1% AI at release is the expectation to set [S022].
- Read scores from the per-version leaderboard pages, with the date, since the foundation updates them as the prize runs [S023].
- Do not compare ARC-AGI-1 or 2 scores with ARC-AGI-3; the format changed from static puzzles to interactive games.

## Sources
- [S022] ARC-AGI-3, ARC Prize Foundation, 2026-03-24.
- [S023] ARC Prize, ARC Prize Foundation, living, last checked 2026-09-26.
