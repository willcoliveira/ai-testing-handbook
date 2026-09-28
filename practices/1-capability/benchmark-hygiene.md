---
id: benchmark-hygiene
title: Benchmark hygiene: contamination, gaming and trust
area: 1-capability
status: draft
last_reviewed: 2026-09-28
sources: [S005, S006, S008, S012, S016, S020, S021, S022, S025, S026, S027, S028, S215, S222, S229, S231, S266, S272, S274, S276, S277, S278, S295]
related: [capability-benchmarks, statistical-treatment-of-evals, data-contamination, golden-datasets]
---

# Benchmark hygiene: contamination, gaming and trust

## What
Benchmark hygiene is the set of checks that decide whether a benchmark, and a score on it, can be trusted. It covers three failure routes: contamination, where test items or their solutions reach the training data; gaming, where the submission process rather than the model produces the rank; and construction faults, where the tasks or tests are wrong. It also covers the practices a benchmark maintainer should follow so users can tell.

## Why
A contaminated or gamed score is worse than no score, because it carries the authority of a number. OpenAI stopped evaluating on SWE-bench Verified in February 2026 after finding that every frontier model tested had seen some of its problems and solutions in training, and that a large share of the tasks it audited had tests that reject correct patches [S027] [S028]. A study of Chatbot Arena found 205 of 243 public models silently deprecated and up to 27 private variants tested before one release [S006]. Saturation is a separate decay: MMLU-Pro was built because scores on MMLU had plateaued, and it drops accuracy by 16 to 33 points [S016]. The trade-off: private or rolling sets resist contamination but are harder to reproduce and audit; public static sets are reproducible and decay.

## How
**A. Assess the benchmark itself with the BetterBench criteria [S005].** The framework has 46 practices across four lifecycle stages: design (goals and scope stated, domain experts involved), implementation (working evaluation code, accessible data or environment), documentation (metrics documented, statistical significance reported), and maintenance (a feedback channel for issues). Each practice is scored 0, 5, 10 or 15; a stage average at or above 10 is reasonably good. Across 24 benchmarks the implementation stage averaged 6.2 of 15 and design 10.8; MMLU scored lowest at 5.5 aggregate and GPQA 11.0. Minimum checklist: purpose and scope defined, experts involved, code and data accessible, construction documented, significance reported, licence stated, feedback channel open.

**B. Test for contamination.**
1. *Parallel private set.* Commission fresh items matched to the public set on human solve rate, solution steps and answer magnitude, then compare. GSM1k did this for GSM8k with 1,000 problems: some model families dropped up to 8 points across almost all sizes, frontier models showed little drop, and the size of the gap correlated with the model's likelihood of generating the public items (Spearman r^2 = 0.36) [S025].
2. *Time windows.* Only score items published after the model's training cutoff. LiveCodeBench tags each problem with its release date and keeps collecting, so any model can be scored on a post-cutoff window [S020].
3. *Held-out and commercial splits.* SWE-Bench Pro keeps 12 repositories held out and 18 commercial alongside 11 public [S026].
4. *Verbatim reproduction probe.* Ask the model for the solution without the task context. OpenAI's audit found frontier models reproducing gold patches or problem-specific details from Verified tasks [S027] [S028].
5. *Novel environments.* ARC-AGI-3 uses interactive environments with no instructions and no language, so memorised text cannot help [S022].

**C. Test for gaming on a leaderboard [S006].** Ask the operator: are scores retractable after submission; how many private variants may a provider test at once; is sampling of model pairs fair across providers; are deprecations published. The paper's five recommendations are to prohibit retraction, cap concurrent private variants, deprecate in a stratified way across model types, sample under-evaluated pairs, and publish all tests and deprecations.

**D. Test task validity.** SWE-bench Verified was built by three annotators reviewing 1,699 tasks and keeping 500 [S008]. The later audit of the 27.6% of tasks models most often failed still found at least 59.4% with tests that reject functionally correct patches, a floor of 16.4% of the whole set [S028]. Human filtering at construction is not enough; sample the failures of a strong model and re-check the tests. Terminal-Bench 2.0 ships a human-written solution with each task so the tests can be run against a known-good answer [S021].

**E. Pin the version.** A score is a score on a version. The tau2-bench repo went to v1.0.1 in July 2026 and states that results from earlier versions are not comparable on the banking domain [S012]. Write the version string, commit or dataset revision beside every number.

**F. The six questions to ask before quoting a score.** Version and n; grader; contamination window against the model's cutoff; who submitted and how many variants; which harness; and the interval (see `statistical-treatment-of-evals.md`).

## Who does it (sourced)
- **Stanford, BetterBench, 2024-11:** assessed 24 benchmarks on 46 practices and keeps a living repository of assessments at betterbench.stanford.edu [S005].
- **Scale AI, 2024-05:** commissioned GSM1k, held it private, and compared it with GSM8k to measure overfitting [S025].
- **UC Berkeley and others, 2024-03:** LiveCodeBench collects problems continuously with release dates for post-cutoff scoring; 400 problems from May 2023 to May 2024 at publication [S020].
- **OpenAI, 2024-08:** built SWE-bench Verified with three annotators per task [S008]. **2026-02:** published an audit and stopped evaluating on it [S027] [S028].
- **Scale AI, 2025-09:** SWE-Bench Pro keeps held-out and commercial splits under partnership agreements and calls the set contamination-resistant [S026].
- **Cohere Labs and others, 2025-04:** analysed 2M Arena battles over 243 models and 42 providers from January 2024 to April 2025 [S006].
- **Sierra, 2026-07:** versions tau2-bench and declares which results are not comparable across versions [S012].
- **Alibaba Qwen, living:** the Qwen3-235B-A22B card instructs "DO NOT use greedy decoding, as it can lead to performance degradation", fixes temperature, top-p, top-k and min-p per mode, and tells evaluators to "standardize output format" with a boxed maths answer and a JSON answer field for multiple choice [S222].
- **DeepSeek, 2025-12:** the V3.2 report states its maths prompt template, puts tool outputs "within messages designated with the 'tool' role, rather than the 'user' role", and runs olympiad problems with "No tools or internet access" under contest time and attempt limits [S215].
- **Zhipu, 2025-08:** GLM-4.5 reports TAU-Bench with an "optimized user simulator" and HLE as "text-based, GPT-4o judged", both departures a reader must carry into any comparison [S229].
- **ByteDance Seed, 2025-08:** the Seed-OSS card presents scores across thinking budgets from 512 to 16K tokens and notes that "the score exhibits fluctuations as the thinking budget increases" on short-reasoning tasks [S231].
- **Hugging Face, March 2025:** retired its leaderboard because it "could encourage people to hill climb irrelevant directions" [S276]; v1 had marked community-flagged models so they "should probably be ignored" [S277].
- **AI2, December 2025:** keeps four held-out benchmarks out of the development suite and decontaminates midtraining data against every split of every OLMES benchmark; even "complete leakage of GSM8K" did not raise the score [S278].
- **Cohere Labs, April 2025:** co-authored The Leaderboard Illusion on private testing and data asymmetries on Chatbot Arena [S006]; Cohere's own human-evaluation prompts are "curated from scratch by our pool of annotators to avoid accidental contamination for competitor models" [S272].
- **EleutherAI, August 2026:** the v0.4.13 release fixed eval documents leaking into few-shot prompts and warns that "prior numbers on those tasks may not be comparable" after prompt changes [S274].
- **xAI, September 2026:** notes that CursorBench 4.0 "scores are not comparable with CursorBench 3.2" and that DeepSWE tasks are "written from scratch rather than mined from existing commits" to keep reference solutions out of the public record [S266].
- **Google DeepMind, 2026-08:** the double-blind evaluation pilot targets contamination from the evaluator side and weight leakage from the developer side at the same time [S295].

## Pitfalls
1. Trusting "verified" as permanent. Human-filtered tasks still carried flawed tests at a rate found only when strong models' failures were audited [S028].
2. Assuming a public benchmark is uncontaminated because it is recent. Every frontier model tested had seen Verified items [S027].
3. Reading Arena rank as model quality when a provider can test many variants and retract the losers [S006].
4. Reading a small GSM8k-to-GSM1k gap as proof of no contamination for all families; several families overfit while the frontier did not [S025].
5. Quoting a score without its version; tau2-bench results before 1.0.1 are not comparable on one domain [S012].
6. Building a benchmark with no feedback channel or replication script; 17 of 24 assessed benchmarks lacked easy replication [S005].

## Pattern from a production build
None yet.

## Sources
- [S005] BetterBench, Reuel et al., 2024-11-20.
- [S006] The Leaderboard Illusion, Singh et al., 2025-04-29.
- [S008] Introducing SWE-bench Verified, OpenAI, 2024-08-13.
- [S012] tau2-bench repository, sierra-research, living.
- [S016] MMLU-Pro, Wang et al., 2024-06-03.
- [S020] LiveCodeBench, Jain et al., 2024-03-12.
- [S021] Terminal-Bench 2.0, Merrill et al., 2026-01-17.
- [S022] ARC-AGI-3, ARC Prize Foundation, 2026-03-24.
- [S025] GSM1k, Zhang et al., Scale AI, 2024-05-01.
- [S026] SWE-Bench Pro paper, Scale AI, 2025-09-21.
- [S027] Why SWE-bench Verified no longer measures frontier coding capabilities, OpenAI, 2026-02-23.
- [S028] SWE-bench Verified benchmark review, Epoch AI, 2026-09-03.
- [S222] Qwen3-235B-A22B model card, Qwen Team, Alibaba (Hugging Face), living
- [S215] DeepSeek-V3.2: Pushing the Frontier of Open Large Language Models, DeepSeek-AI (arXiv 2512.02556), 2025-12-02
- [S229] GLM-4.5: Agentic, Reasoning, and Coding (ARC) Foundation Models, Zhipu AI and Tsinghua University (arXiv 2508.06471), 2025-08-08
- [S231] Seed-OSS-36B-Instruct model card, ByteDance Seed (Hugging Face), living
- [S276] It's been a wild ride, folks :) (end of the Open LLM Leaderboard), Hugging Face (Clementine Fourrier), Hub discussion, 2025-03-13
- [S277] Open LLM Leaderboard v1 (archive documentation), Hugging Face, leaderboards docs, living
- [S278] Olmo 3 (technical report), Ai2 (Olmo Team), arXiv 2512.13961, 2025-12
- [S272] Command A: An Enterprise-Ready Large Language Model (technical report), Cohere, arXiv 2504.00698, 2025-04
- [S274] lm-evaluation-harness (repository), EleutherAI, GitHub, living
- [S266] Grok 4.7 Model Card (revision 2026-09-21), xAI (SpaceXAI), 2026-09-21
- [S295] Piloting the world's first double-blind AI evaluations, Google DeepMind, 2026-08-27
