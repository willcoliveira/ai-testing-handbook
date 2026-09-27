---
id: moonshot-and-zhipu
title: Moonshot AI and Zhipu (Z.ai)
sources: [S116, S224, S225, S226, S227, S228, S229, S230, S231, S232, S234]
last_reviewed: 2026-09-27
---

# Moonshot AI and Zhipu (Z.ai)

## Published framework (what governs a release)
**Moonshot AI.** No published framework. METR's tracker lists no Chinese developer as of 2026-09-27
[S116], and Moonshot is not a Seoul signatory [S234]. The Kimi K2 report carries a red-teaming
evaluation; the K2.5 report and the K3 model card do not [S224][S225][S226].

**Zhipu (Z.ai).** Zhipu.ai is an initial signatory of the Seoul Frontier AI Safety Commitments, which commit
each signatory to "internal and external red-teaming of frontier AI models and systems for severe and novel
threats", to thresholds at which risks "would be deemed intolerable", and to "publishing a safety framework
focused on severe risks" by the France summit of February 2025 [S234]. No such framework is listed on METR's
tracker as of 2026-09-27 [S116]; whether one exists elsewhere is unknown to us. GLM-4.5's report has a
SafetyBench table; GLM-5's has no safety section [S229][S230].

Context for both, from Concordia AI's 2026 survey: "only five of ten leading foundation-model developers
reported safety evaluation results when releasing models this past year. No company did so consistently" [S232].

## What they say they run before a release (sourced, dated)
**Moonshot AI**
- **Kimi K2, July 2025, capability:** SWE-bench Verified 65.8 single attempt and 71.6 multi-attempt,
  Tau2-Bench 70.6 (Avg@4), ACEBench 76.5, AIME 2025 49.5 (Avg@64), GPQA-Diamond 75.1 (Avg@8). "Output
  token length is capped at 8192 tokens everywhere except SWE-bench Verified (Agentless), which is
  raised to 16384" [S224].
- **Kimi K2, July 2025, safety:** "We conducted red-teaming evaluations on Kimi K2 compare with other
  open-source LLMs." Five categories with subcategories (Harmful 9, Criminal 11, Misinformation 10,
  Privacy 4, Security 5) crossed with four strategies (Basic, Prompt Injection, Iterative Jailbreak,
  Crescendo), "3 attack prompts per plugin for each strategy", scored as a passing rate after "multiple
  rounds of review" by humans. Reported: Harmful Basic 98.04, Criminal Basic 100, Criminal Iterative
  Jailbreak 57.57, Misinformation Crescendo 85.71, Security Iterative Jailbreak 43.90 [S224]. Three
  prompts per cell is a small design; read the rates as indicative.
- **Kimi K2.5, February 2026:** capability only, at temperature 1.0 and a 256k context: SWE-Bench
  Verified 76.8, Terminal Bench 2.0 50.8, BrowseComp 60.6 (74.9 with context management, 78.4 with the
  Agent Swarm orchestrator), OSWorld-Verified 63.3. The card states run counts: avg@32 for AIME and
  HMMT, avg@8 for GPQA, five runs for coding, avg@3 for vision. RL uses "Generative Reward Models"
  aligned with "Kimi's internal value criteria". No safety evaluation, red teaming or contamination
  check in report or card [S225].
- **Kimi K3, July 2026:** a model card only (GPQA Diamond 93.5, Terminal-Bench 2.1 88.3, BrowseComp 91.2,
  OSWorld-Verified 84.8), multimodal scores "averaged over three runs", temperature 1.0. A "Full Report" PDF
  is linked from GitHub, not fetched. Brief refusal notes on cyber benchmarks; no safety section [S226].

**Zhipu (Z.ai)**
- **GLM-4.5, August 2025, capability:** AIME 24 91.0 (Avg@32), GPQA 79.1 (Avg@8), MATH-500 98.2,
  SWE-bench Verified 64.2 with a 100-iteration limit at temperature 0.6, Terminal-Bench 37.5, TAU-Bench
  retail 79.7 and airline 60.4 with an "optimized user simulator", BFCL V3 77.8, BrowseComp 26.4, HLE
  14.4 "text-based, GPT-4o judged". Human check: 660 prompts (392 English, 108 Chinese, 160 other)
  scored 0 to 10 by a "single, consistent evaluator" with reasoning hidden. CC-Bench: 52 tasks in
  isolated containers, a 40.4 win rate against Claude Sonnet 4 [S229].
- **GLM-4.5, August 2025, safety:** SafetyBench, 11,435 multiple-choice questions in seven categories,
  overall 89.9: Ethics and Morality 94.3, Illegal Activities 91.0, Mental Health 94.7, Offensiveness
  83.0, Physical Health 96.7, Privacy and Property 92.0, Unfairness and Bias 77.4, "an area of ongoing
  focus". A knowledge test, not a behavioural one. No red teaming, jailbreak or injection test, no
  contamination check [S229].
- **GLM-5, February 2026:** capability only. Headline benchmarks: HLE, SWE-bench Verified and
  Multilingual, Terminal-Bench 2.0, BrowseComp, MCP-Atlas, tau2-Bench, Vending Bench 2. Search tasks
  are graded with "the OpenAI evaluation prompt" and o3-mini as judge; RL used "over 10k verifiable
  environments" across nine languages; CC-Bench-V2 is internal. The card gives temperature 1.0, top-p
  0.95 and 131,072 tokens for reasoning, 0.7, 0.95 and 16,384 for SWE-bench, and a "verified"
  Terminal-Bench 2.0 that "fixes some ambiguous instructions". No safety evaluation [S230].

**Third parties, for context, not as evidence of either lab's process.** An independent group tested
Kimi K2.5 for CBRNE, cyber, misalignment, censorship and harmlessness and reported "significantly
fewer refusals on CBRNE-related requests" than two US models [S227]. UK AISI and US CAISI assessed
Kimi K3's cyber capability in July 2026: exploit development 32 percent, arbitrary code execution on 0
of 41 tasks against about 20 of 41 for leading models, step 17 of 32 in a network attack against 28.5,
and "Kimi K3's safeguards did not prevent it from attempting cyber exploit development or offensive
cyber operations"; the page does not say whether access was pre-release [S228].

**ByteDance Seed.** The Seed-OSS-36B-Instruct card (August 2025, Apache-2.0) reports MMLU-Pro 82.7,
AIME24 91.7 and LiveCodeBench v6 67.4 at temperature 1.1 and top-p 0.95 across thinking budgets from
512 to 16K tokens, and notes that ARC-AGI-2 was "measured on the official evaluation set, which was
not involved in the training process". No safety statement [S231]. **MiniMax** is a later signatory of
the Seoul commitments [S234]; we did not register a MiniMax report.

## Public evaluation tooling they ship
- Open weights: Kimi K2 and K2.5 under a modified MIT licence, K3 under a "Kimi K3 License"; GLM-4.5
  and GLM-5 under MIT; Seed-OSS under Apache-2.0, with paired base models with and without synthetic
  instruction data [S225][S226][S230][S231].
- The K2 red-teaming taxonomy (five categories, four strategies, a passing-rate metric), reusable as a
  checklist; described, not shipped as code [S224].
- Run counts and sampling values on the K2.5, K3 and GLM-5 cards, and GLM-5's note that its
  Terminal-Bench 2.0 is a modified "verified" variant [S225][S226][S230].
- No guard model, red-teaming tool or harness from either lab was found in the pages fetched.

## What is not public (stated as unknown)
- Pre-deployment safety process at either lab: who decides, on what evidence, against what threshold.
- Red-team rosters and hours. The K2 report names categories and strategies, not people or effort, and
  neither the K2.5 report nor the K3 card says whether the exercise was repeated [S224][S225][S226].
- Zhipu's Seoul safety framework: whether it exists, and its content [S234][S116].
- Frontier-risk evaluations by the labs themselves. The only cyber numbers for Kimi are AISI and
  CAISI's and the only CBRNE numbers are an independent group's; whether Moonshot cooperated or gave
  pre-release access is not stated [S227][S228]. The K3 "Full Report" contents [S226].
- The rubric behind GLM-4.5's single human evaluator and the judge behind its generative rewards
  [S229]. Contamination checks for any of these models [S224][S225][S229][S230].

## Reading order for a newcomer
1. The K2 report's red-teaming table, then the K2.5 report to see it absent [S224][S225].
2. The GLM-4.5 evaluation section: benchmark scores, SafetyBench, a single-rater human evaluation [S229].
3. The GLM-5 model card's sampling and "verified" benchmark notes [S230].
4. The AISI and CAISI assessment of K3, for how a government tester reports cyber capability [S228].
5. The Seoul commitments text, then the METR tracker: a promise against the public record [S234][S116].

## Sources
- [S116] Frontier AI Safety Policies tracker, METR, living.
- [S224] Kimi K2: Open Agentic Intelligence, Moonshot AI, 2025-07-28.
- [S225] Kimi K2.5: Visual Agentic Intelligence, Moonshot AI, 2026-02-02.
- [S226] Kimi-K3 model card, Moonshot AI, living.
- [S227] An Independent Safety Evaluation of Kimi K2.5, Yong et al., 2026-04-03.
- [S228] UK AISI / CAISI Preliminary Assessment of Kimi K3's Cyber Capabilities, 2026-07-23.
- [S229] GLM-4.5: Agentic, Reasoning, and Coding (ARC) Foundation Models, Zhipu AI and Tsinghua University, 2025-08-08.
- [S230] GLM-5: from Vibe Coding to Agentic Engineering, Z.ai, 2026-02-17.
- [S231] Seed-OSS-36B-Instruct model card, ByteDance Seed, living.
- [S232] State of AI Safety in China (2026), Concordia AI, 2026-07.
- [S234] Frontier AI Safety Commitments, AI Seoul Summit 2024, UK DSIT, 2024-05-21.
