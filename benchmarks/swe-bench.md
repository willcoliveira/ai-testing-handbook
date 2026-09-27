# SWE-bench, SWE-bench Verified, SWE-Bench Pro

## What it measures
Whether a model, given a repository and an issue, can write a patch that resolves the issue. The original set has 2,294 tasks drawn from real issues and pull requests in 12 Python repositories; at launch the best model, Claude 2, resolved 1.96% [S007]. SWE-bench Verified is a 500-task subset kept after three annotators each reviewed 1,699 tasks for clear descriptions, correct tests and solvability [S008]. SWE-Bench Pro is a separate set of 1,865 long-horizon tasks from 41 repositories, split into public (11 repos), held-out (12) and commercial (18) [S026]; the open V2 public split has 642 tasks and a HARD-51 subset [S009].

## Format and grader
Input is the codebase plus the issue text. Output is a patch. Grading runs hidden tests: the patch must make the failing tests pass without breaking the passing ones. Pro executes each patch in a per-task Docker image [S009]. The score is the share of tasks resolved, so the harness or agent scaffold around the model is part of what is scored.

## Known issues
- Retired for frontier measurement: on 2026-02-23 OpenAI said it no longer evaluates on Verified. It audited the 27.6% of tasks models most often failed and found at least 59.4% of those had tests that reject functionally correct patches; frontier models also reproduced gold patches from memory [S027].
- Epoch AI restates the audit as a floor of 16.4% broken tasks across the whole set and assigns a "Flawed" designation [S028].
- The full set and Verified live in public repositories that models train on; Pro's held-out and commercial splits exist to avoid this [S026].
- Scores from different scaffolds are not comparable even on the same model.

## How a team should use it
Do not quote SWE-bench Verified for a model released after early 2026. Use SWE-Bench Pro public V2 for a reproducible number and treat the held-out and commercial leaderboards as the less contaminated signal [S009]. Report the scaffold, the version, and the interval: 500 tasks at 70% is about plus or minus 4 points; 642 is similar. For your own codebase, build a small issue-to-patch set in the same shape and run it with the same scaffold you ship.

## Sources
- [S007] SWE-bench, Jimenez et al., Princeton, 2023-10-10.
- [S008] Introducing SWE-bench Verified, OpenAI, 2024-08-13.
- [S009] SWE-Bench Pro repository, Scale AI, living.
- [S026] SWE-Bench Pro paper, Scale AI, 2025-09-21.
- [S027] Why SWE-bench Verified no longer measures frontier coding capabilities, OpenAI, 2026-02-23.
- [S028] SWE-bench Verified benchmark review, Epoch AI, 2026-09-03.
