# LiveCodeBench

## What it measures
Code ability on competitive-programming problems, across four scenarios: code generation, self-repair, code execution and test-output prediction. Problems come from LeetCode, AtCoder and CodeForces. At publication the set held 400 problems published between May 2023 and May 2024, evaluated on 18 base and 34 instruction-tuned models, and it keeps collecting new problems [S020].

## Format and grader
Each problem carries tests; a solution passes or fails them. Every problem is tagged with its release date so a model can be scored only on problems published after its training cutoff. The maintainers release prompts and completions for community analysis [S020].

## Known issues
- Contamination protection depends on the user choosing the right window; a score on the full set for a recent model is not contamination-free [S020].
- Competitive programming is a narrow slice of software work; it does not test repository navigation, tooling or long-horizon change.
- Problem pools shift over time, so two scores are only comparable on the same window.

## How a team should use it
- Quote the date window with every score, and make sure it starts after the model's training cutoff [S020].
- Use it as the cleanest public signal for raw algorithmic coding.
- Pair it with SWE-Bench Pro or Terminal-Bench for repository and environment work.
- Report which of the four scenarios the number comes from; self-repair and generation are different skills [S020].

## Sources
- [S020] LiveCodeBench, Jain et al., UC Berkeley and others, 2024-03-12.
