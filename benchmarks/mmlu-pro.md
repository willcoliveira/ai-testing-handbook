# MMLU-Pro

## What it measures
Knowledge with reasoning across many subjects, built to replace MMLU after scores on it plateaued. It removes trivial and noisy MMLU items, adds reasoning-focused questions, and widens the choice set from four options to ten. Accuracy falls 16 to 33 points relative to MMLU, and sensitivity to prompt wording falls from 4 to 5 points on MMLU to about 2 points across 24 prompt styles [S016].

## Format and grader
Ten-option multiple choice, graded by exact match on the chosen option. Chain-of-thought prompting scores higher than direct answering, so the prompting regime must be stated with the score [S016]. HELM Capabilities runs it on a 1,000-instance sample.

## Known issues
- Public static set from 2024; contamination risk is high for later models.
- More options reduces guessing but does not change what exact match can see: it cannot tell a correct chain from a lucky pick.
- Accepted at NeurIPS 2024 Datasets and Benchmarks; the paper reached v6 by November 2024, so cite the version [S016].

## How a team should use it
- Treat it as a knowledge-and-reasoning screen when comparing base models, always with the prompt style and CoT setting named [S016].
- Prefer it over MMLU for any model released after the middle of 2024; MMLU scores had plateaued [S016].
- Do not use it to predict performance on domain tasks; build a domain set instead.
- On a 1,000-item sample the 95% interval at 60% is about plus or minus 3 points; differences inside that are noise.

## Sources
- [S016] MMLU-Pro, Wang et al., 2024-06-03.
