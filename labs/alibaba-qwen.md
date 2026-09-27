---
id: alibaba-qwen
title: Alibaba Qwen
sources: [S116, S220, S221, S222, S223, S232, S233, S234]
last_reviewed: 2026-09-27
---

# Alibaba Qwen

## Published framework (what governs a release)
No frontier safety framework has been published. METR's tracker lists no Chinese developer as of
2026-09-27 [S116], and Alibaba is not a signatory of the Seoul Frontier AI Safety Commitments [S234].
We searched for an Alibaba safety statement and found only third-party descriptions of a usage policy
and a corporate responsible-AI page; neither was fetched, so nothing here describes them.

What the Qwen team does publish, in date order:
- **May 2025:** the Qwen3 technical report, with a four-stage post-training recipe and capability
  benchmarks, all models under Apache 2.0 [S220].
- **Living:** Hugging Face model cards with a "Best Practices" section that fixes sampling parameters
  and output formats for benchmarking [S222][S223].
- **October 2025:** Qwen3Guard, a family of safety classifiers with its own technical report, which is
  the closest thing to a published safety policy: nine content categories and three severity tiers
  [S221].

The regulatory backdrop is a standard, not a lab document. TC260's Basic Safety Requirements for
Generative AI Services (2024-02-29) sets out corpus safety, model safety, safety measures and safety
assessment for services offered in China, with more than 30 listed risks [S233]. How Alibaba applies it
to Qwen services is not described in any page fetched; the standard is context only.

## What they say they run before a release (sourced, dated)
- **Qwen3, May 2025, capability:** the flagship Qwen3-235B-A22B in thinking mode scores MMLU-Redux
  92.7, GPQA-Diamond 71.1, AIME 2024 85.7, AIME 2025 81.5, MATH-500 98.0, LiveCodeBench v5 70.7, BFCL
  v3 70.8; in non-thinking mode AIME 2024 40.1 and LiveCodeBench v5 35.3. Arena-Hard, AlignBench v1.1
  and LiveBench are reported for open-ended quality [S220].
- **Qwen3, May 2025, settings:** "For each question, we sample 64 times and take the average accuracy
  as the final score" on AIME; thinking mode at "temperature of 0.6, a top-p value of 0.95, and a top-k
  value of 20" with a 32,768-token output; non-thinking at 0.7, 0.8 and 20 [S220].
- **Qwen3, May 2025, post-training:** four stages. A long chain-of-thought cold start with "query
  filtering and response filtering"; reasoning RL with GRPO over "3,995 query-verifier pairs"; thinking
  mode fusion by continued SFT with a thinking budget; general RL over "20 distinct tasks" scored by
  "three distinct types of rewards: Rule-based, Model-based with Reference Answer, Model-based without
  Reference Answer" [S220].
- **Qwen3, May 2025, what is missing:** the report gives benchmark scores and no safety evaluation.
  There is no harmlessness suite, no red teaming, no jailbreak test, no refusal measurement, and no
  contamination or decontamination check [S220].
- **Model cards, living:** the Qwen3-235B-A22B card instructs "DO NOT use greedy decoding, as it can
  lead to performance degradation", sets the same sampling values as the report, recommends 32,768
  output tokens and 38,912 "for complex problems", and tells evaluators to "standardize output format":
  a boxed final answer for maths and a JSON answer field for multiple choice [S222]. The Qwen3.5
  card (February 2026) repeats per-mode sampling advice, reports MMLU-Pro 86.7, IFEval 93.4, SWE-bench
  Verified 72.0 and MMMU 83.9, and carries no safety statement [S223]. No Qwen3.5 text technical report
  was found; the only 3.5-series report located is Qwen3.5-Omni [S223].
- **Qwen3Guard, October 2025:** the guard model is evaluated as a classifier. Prompt classification on
  ToxicChat, OpenAI Moderation, Aegis, Aegis 2.0, SimpleSafetyTests, HarmBench and WildGuardTest;
  response classification on HarmBench, SafeRLHF, BeaverTails, XSTest, Aegis 2.0 and WildGuardTest;
  Chinese translations of several of these plus a political-sensitivity set; RTP-LX and
  PolyGuard-Response for other languages. The 8B generative model reports F1 of 90.0 on English
  prompts, 83.9 on English responses, 85.1 and 87.1 in Chinese, 85.0 on RTP-LX and 77.6 on PolyGuard,
  against WildGuard-7B at 85.8 and 79.9 [S221]. The training set is "over 1.19M positive and negative
  samples, including both human-annotated and synthetically generated data", labelled by several Qwen
  models with a voting step seeded by "a small set of manually annotated samples" [S221].

The plain statement: Alibaba's model reports and cards publish capability numbers and sampling
settings, and the safety evidence that is public concerns the guard model, not the base or chat models.

## Public evaluation tooling they ship
- Open weights under Apache 2.0 for every Qwen3 size and for Qwen3.5 [S220][S223].
- Qwen3Guard in 0.6B, 4B and 8B sizes, two variants: generative, which returns safe, controversial or
  unsafe with a category, and streaming, which adds a token-level head so a response can be checked
  while it is produced. Nine categories: Violent, Non-violent Illegal Acts, Sexual Content, Personally
  Identifiable Information, Suicide and Self-Harm, Unethical Acts, Politically Sensitive Topics,
  Copyright Violation, and Jailbreak (input only). 119 languages. Apache 2.0 [S221].
- The "controversial" tier as a design choice: "Content whose harmfulness may be context-dependent or
  subject to disagreement", so a deployer can set the cut-off per policy [S221].
- The model-card "Best Practices" block, in effect a published benchmark protocol: sampling values, no
  greedy decoding, output budgets and answer formats [S222][S223].
- No red-teaming tool, no evaluation harness, and no published safety benchmark for the chat models
  were found in the pages fetched.

## What is not public (stated as unknown)
- Any pre-deployment safety evaluation of Qwen3 or Qwen3.5: harmlessness, refusals, jailbreaks, or
  frontier risks. Not in the report or the cards [S220][S223].
- Red teams: whether any exist, who staffs them, and what they found.
- Whether Qwen3Guard gates Qwen releases or runs on Alibaba Cloud's API. The report presents it as a
  moderation model for deployers; its internal use is not stated [S221].
- The human-labelled seed set for Qwen3Guard: its size and who labelled it [S221].
- The security assessment Alibaba filed under the TC260 requirements, and any pass rates on the
  standard's question banks [S233].
- Contamination checks for Qwen3 and Qwen3.5 [S220][S223].
- The usage policy and responsible-AI statements described by third parties; not fetched.
- Whether Qwen3.6, whose cards exist on the Hub, has a report; not fetched [S223].

## Reading order for a newcomer
1. The Qwen3 report, Section 4 on post-training, then the evaluation tables, noting what is not there
   [S220].
2. A Qwen3 model card's Best Practices section, for a protocol you can copy into your own harness
   [S222].
3. The Qwen3Guard report, for a guard-model evaluation done properly: named datasets, F1 per language,
   named baselines [S221].
4. The CSET translation of the TC260 requirements, for what a Chinese service must assess [S233].
5. Concordia's 2026 survey and the METR tracker, for where the labs stand on public safety reporting
   [S232][S116].

## Sources
- [S116] Frontier AI Safety Policies tracker, METR, living.
- [S220] Qwen3 Technical Report, Qwen Team, Alibaba, 2025-05-14.
- [S221] Qwen3Guard Technical Report, Qwen Team, Alibaba, 2025-10-16.
- [S222] Qwen3-235B-A22B model card, Qwen Team, Alibaba, living.
- [S223] Qwen3.5-122B-A10B model card, Qwen Team, Alibaba, living.
- [S232] State of AI Safety in China (2026), Concordia AI, 2026-07.
- [S233] Basic Safety Requirements for Generative Artificial Intelligence Services, TC260 via CSET translation, 2024-02-29.
- [S234] Frontier AI Safety Commitments, AI Seoul Summit 2024, UK DSIT, 2024-05-21.
