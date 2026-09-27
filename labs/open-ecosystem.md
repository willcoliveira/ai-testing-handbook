---
id: open-ecosystem
title: Open evaluation ecosystem (Hugging Face, EleutherAI, AI2)
sources: [S118, S165, S274, S275, S276, S277, S278, S279, S280]
last_reviewed: 2026-09-27
---

# Open evaluation ecosystem: Hugging Face, EleutherAI, AI2

## Published framework (what governs a release)
No safety framework governs these organisations' releases. What they publish are evaluation standards and
leaderboard rules, and those are the "framework" here. Four of them.

- **EleutherAI's lm-evaluation-harness** standardises the task, not the model: "over 60 standard academic
  benchmarks for LLMs, with hundreds of subtasks and variants implemented", four request types
  (`generate_until`, `loglikelihood`, `loglikelihood_rolling`, `multiple_choice`), and the rule that
  "Evaluation with publicly available prompts ensures reproducibility and comparability between papers".
  MIT; v0.4.13 released August 31, 2026 [S274].
- **Hugging Face's Open LLM Leaderboard v1** wrote the rules that many later copied: "reference models would
  be evaluated in the exact same setup (same questions, asked in the same order, etc.)"; six benchmarks
  with fixed shots (ARC 25-shot, HellaSwag 10-shot, MMLU 5-shot, TruthfulQA 0-shot, Winogrande 5-shot,
  GSM8K 5-shot); a pinned harness commit; one node of eight H100s; models "flagged" by the community marked
  as such. Archived June 2024 and replaced by a second version [S277]. That version retired on March 13,
  2025: "we've evaluated over 13K models"; "As model capabilities change ... benchmarks need to follow"; the
  board "could encourage people to hill climb irrelevant directions" [S276].
- **AI2's OLMES** is a written standard: "choices of how a model is evaluated on a task can lead to large
  changes in measured performance", so it fixes "prompt formatting, choice of in-context examples,
  probability normalizations, and task formulation", and supports the "cloze" formulation for small base
  models against multiple choice for large ones. Findings of NAACL 2025; code Apache 2.0 [S279].
- **Hugging Face's evaluation guidebook** is the practitioner text written from "managing the Open LLM
  Leaderboard and designing lighteval": automatic benchmarks, human evaluation, LLM-as-judge and
  troubleshooting. CC BY-NC-SA 4.0; the GitHub copy is unmaintained since December 2025 and the live
  version is an OpenEvals Space [S280].

Context: Stanford's HELM, the other long-running open standard, "entered maintenance mode on June 1, 2026"
[S118].

## What they say they run before a release (sourced, dated)
AI2's OLMo 3 is the reference here because it publishes the whole flow: weights, data, code, training logs
and the evaluation suite [S278].

- **Base model development, December 2025:** OlmoBaseEval, "43 tasks, which is over 4 times more benchmarks
  than OLMo 2", split into a Base Easy suite for small runs and a Base Main suite for the final run, plus a
  held-out set of four benchmarks (MMLU Pro, DeepMind Math, LBPP and BBH) to limit overfitting to the
  development suite. Tasks are clustered by capability, checked for signal at small scale, and pruned or
  enlarged by signal-to-noise ratio [S278].
- **Decontamination, December 2025:** a `decon` package samples n-grams from each midtraining document,
  expands matches into clusters and removes documents above a score; "We decontaminate against all
  benchmarks in the OLMES package", every split. Finding: "despite the fact that our decontamination
  procedure detected complete leakage of GSM8K in our data, this does not result in better performance with
  the contaminated data" [S278].
- **Post-training evaluation, December 2025:** one configuration for all baselines (32K context, temperature
  0.6, top-p 0.95); "evaluation costs between 10 and 20% of our compute budget"; variance measured as the
  mean standard deviation over "3 runs of 14 models", giving high-variance tasks (GPQA 1.48, AlpacaEval
  1.24, IFEval 0.88) and very stable ones (MATH 0.25, MMLU 0.22, PopQA 0.16). Every reported number is "the
  mean of three runs" [S278].
- **Safety, December 2025:** a safety average in the main tables built from BBQ, StrongREJECT, ToxiGen,
  WMDP, HarmBench, WildGuard-Test, WildJailbreak, XSTest, DoAnythingNow and TrustLLM-JailbreakTrigger,
  each the mean of three runs. No human red teaming or third-party testing is described [S278].
- **EleutherAI, August 2026:** the v0.4.13 release fixed "Eval documents leaked into few-shot prompts" and
  warns that "few-shot prompts changed" on some tasks, so "prior numbers on those tasks may not be
  comparable" [S274].
- **Hugging Face, 2023 to 2025:** the leaderboard ran every submission itself on its cluster under the
  pinned setup, and published per-model results and the request queue as datasets [S277][S276].

## Public evaluation tooling they ship
- lm-evaluation-harness, MIT, v0.4.13 (2026-08-31), with `--check_integrity` for dataset checks and
  backends from Hugging Face transformers to ONNX Runtime and Megatron-LM [S274].
- lighteval, MIT, v0.13.0 (2025-11-24; repository active in September 2026): "1000+ evaluation tasks" over
  inspect-ai, accelerate, nanotron, vLLM, SGLang and hosted endpoints; the 0.13 release made "one file one
  task definition" a breaking change [S275].
- OLMES and `decon`, Apache 2.0, the suite and the decontamination tool used for OLMo 3 [S279][S278].
- The evaluation guidebook [S280] and the Hub's model card format with its `model-index` evaluation
  metadata [S165].

## What is not public (stated as unknown)
- A successor leaderboard with the v1 rules. The retirement post points to "over 200 community led
  leaderboards" and the OpenEvals organisation, not to one board [S276].
- Which harness tasks reproduce their source papers' numbers. Neither README we fetched states a validation
  status per task [S274][S275].
- Human red teaming or external testing of OLMo 3. The report describes benchmark suites only [S278].
- The rendered guidebook on the Space: our fetch returned only the page header, so its contents are taken
  from the GitHub copy [S280].
- Hugging Face and EleutherAI publish no pre-release process for models of their own in these sources.

## Reading order for a newcomer
1. The leaderboard v1 archive page, then the retirement post, for the rules and why they aged
   [S277][S276].
2. The OLMES abstract, for why the same benchmark gives different numbers [S279].
3. OLMo 3, Section 3.3 (experimental design), 3.5.3 (decontamination) and 4.1.1 (variance) [S278].
4. The lm-evaluation-harness README and the v0.4.13 release notes [S274].
5. The evaluation guidebook, start to finish [S280].

## Sources
- [S118] HELM repository, Stanford CRFM, living.
- [S165] Model Cards (Hub documentation), Hugging Face, living.
- [S274] lm-evaluation-harness, EleutherAI, living (v0.4.13, 2026-08-31).
- [S275] lighteval, Hugging Face, living (v0.13.0, 2025-11-24).
- [S276] End of the Open LLM Leaderboard (Hub discussion), Hugging Face, 2025-03-13.
- [S277] Open LLM Leaderboard v1 archive documentation, Hugging Face, living.
- [S278] Olmo 3 technical report, Ai2, 2025-12 (v2 2026-04-14).
- [S279] OLMES: A Standard for Language Model Evaluations, Ai2, 2024-06-12.
- [S280] The LLM Evaluation Guidebook, Hugging Face (OpenEvals), living.
