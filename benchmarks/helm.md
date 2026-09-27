# HELM (Classic, Capabilities, Safety)

## What it measures
HELM Classic set out to evaluate models on many scenarios and many metrics at once: 16 core scenarios and 26 targeted ones, scored on seven metrics (accuracy, calibration, resilience to input perturbation, fairness, bias, toxicity and efficiency) across 30 models at launch [S001]. Two later tracks matter most now. HELM Capabilities v1.0.0 (March 2025) covers general knowledge, reasoning, instruction following, dialogue and mathematical reasoning through five component benchmarks: MMLU-Pro, GPQA, IFEval, WildBench and Omni-MATH [S002]. HELM Safety v1.0 (November 2024) covers six risk categories (violence, fraud, discrimination, sexual content, harassment, deception) through five prompt sets [S029], with a live leaderboard [S003].

## Format and grader
Capabilities downsamples every scenario to 1,000 instances, except GPQA at 448, and ranks models by the mean score across scenarios. MMLU-Pro, GPQA and IFEval are scored by accuracy or strict accuracy; WildBench by WB-Score and Omni-MATH by model-judged accuracy, using more than one judge model to reduce judge bias [S002]. Safety uses exact-match accuracy on BBQ (58,492 items) and, for SimpleSafetyTests (100), HarmBench (321), AnthropicRedTeam (38,961) and XSTest (450), a model-judge score that is the mean of two judges, Llama 3.1 405B Instruct Turbo and GPT-4o 0513 [S029].

## Known issues
- Two of the five Capabilities scenarios and four of the five Safety sets are judged by models; the judge choice is part of the score [S002] [S029].
- Every component set is public, so the contamination risk of HELM is the contamination risk of its parts.
- Safety v1.0 states it "is not able to designate models as safe" because its sets do not cover all risks; scores fell 25.9% on average under automated red-team prompts [S029].
- The Safety leaderboard page is client-rendered; scores must be read in a browser, not scraped.

## How a team should use it
Use Capabilities as a cross-lab mean with known parts, and read the per-scenario columns rather than the mean when picking a model for one job. Use Safety as a list of public refusal and bias sets you can run yourself, not as a certificate. Cite the version string (Capabilities v1.0.0, Safety v1.0) with any number.

## Sources
- [S001] Holistic Evaluation of Language Models, Stanford CRFM, 2022-11-16.
- [S002] HELM Capabilities v1.0.0, Stanford CRFM, 2025-03-20.
- [S003] HELM Safety leaderboard, Stanford CRFM, living.
- [S029] HELM Safety v1.0, Stanford CRFM, 2024-11-08.
