---
id: nvidia
title: NVIDIA
sources: [S116, S129, S130, S267, S268, S269, S270]
last_reviewed: 2026-09-27
---

# NVIDIA

## Published framework (what governs a release)
The Frontier AI Risk Assessment, by Simkin, Pope, Derczynski and Parisien, "Applicable from August 2025"
[S267]. METR's tracker lists it under NVIDIA with a February 17, 2025 date; the document itself carries
August 2025 [S116][S267]. Its opening position is unusual among the frameworks in this repository: "Even
though frontier AI models are not currently under development at NVIDIA, our existing risk framework can be
applied to identify emerging capabilities within our advanced AI models" [S267].

Two stages. A Preliminary Risk Assessment scores capabilities, use case and autonomy on "discrete thresholds
between 1 and 5" to give a model risk score MR1 to MR5; "A frontier model would be classified as MR5". A
Detailed Risk Assessment covers "use case specification, hazard identification, risk analysis, risk
mitigation and risk evaluation". "All relevant data from the risk evaluation process is then stored in our
model cards" [S267]. Hazards named for frontier models: cyber offence, CBRN, "Persuasion and manipulation"
and "At-scale discrimination" [S267].

What the framework says it would do if a model showed frontier capability: "initially restrict access to
model weights to essential personnel", and restrict "at-will fine tuning of frontier AI models without
safeguards in NeMo customizer" [S267]. It names public benchmarks as early-warning signals (TruthfulQA,
FEVER, GLUE, BBQ, BOLD, WMDP, AILuminate) and admits "not many are directly targeted to measure frontier
risks" [S267]. It commits to garak: "NVIDIA takes advantage of this and uses Garak as a highest-priority
assessment of models before release" [S267][S130]. It states a confidence rule for assessment cost: "50%
confidence to ascertain general trends" during development, and "for data used in the model card an
assessment with 95-99% confidence" [S267].

## What they say they run before a release (sourced, dated)
- **Nemotron 3 Nano, December 2025, capability evaluation:** "All evaluation results were collected via Nemo
  Evaluator SDK and LM Evaluation Harness", with NeMo Skills for most post-training benchmarks and separate
  containers for Tau-2 Bench, ArenaHard v2 and AA_LCR; Terminal Bench, SWE-Bench and Scale AI Multi
  Challenge ran on "their official open source implementation". MATH-500 is reported as avg@32; other tasks
  use greedy decoding. The report points to the SDK config folder "for reproducibility purposes" [S268].
- **Nemotron 3 Nano, December 2025, prompt sensitivity:** "we evaluate models using multiple prompts"; for
  each prompt "we compute mean accuracy across eight seeds, and we use the standard deviation of prompt
  averages as the prompt sensitivity metric", reported as "below 1 across all datasets" [S268].
- **Nemotron 3 Nano, December 2025, safety training:** unsafe prompts from Nemotron Content Safety v2,
  Gretel Safety Alignment v1, Harmful Tasks and Red-Team-2K; refusal templates, including suicide
  prevention helplines for self-harm prompts; "A content-safety classifier is employed to filter the
  responses". The report describes safety data; we found no safety evaluation table in it [S268].
- **Nemotron-3-Content-Safety, March 2026:** version V1.1, released March 16, 2026, trained October 2025 to
  March 2026 on a Gemma-3-4B-it base. Evaluated on external benchmarks including RTVLM, VLGuard,
  MM-SafetyBench, FigStep, MultiJail, XSafety, Aya Redteaming, XSTest, Aegis 2, WildGuard, PolyGuard and
  RTP-LX, with accuracy from 0.56 to 0.94 and harmful-class F1 from 0.38 to 0.98. False-positive rate on
  benchmarks assumed benign: 0.023 on MMMU, 0.058 on DocVQA, 0.001 on AI2D, with the caveat "We assume that
  these 3 benchmarks contain 100% safe inputs". Roughly 86k training, 6k test and 6k evaluation samples,
  collected "Hybrid: Automated, Human, Synthetic" [S269].
- **Red teaming, framework level:** "The red team also probes each guardrail component independently with
  targeted examples", using an experimental NeMo red-teaming interface and garak [S267][S129][S130].

## Public evaluation tooling they ship
- NeMo Evaluator, an open-source library, Apache 2.0, v0.3.0 released June 3, 2026, with 17 built-in
  benchmarks (MMLU, MMLU-Pro, GPQA, GSM8K, MATH-500, MGSM, DROP, TriviaQA, HumanEval, SimpleQA, HealthBench,
  PinchBench, XSTest, Terminal-Bench and NMP-Harbor) and external harnesses addressed as `lm-eval://`,
  `skills://`, `vlmevalkit://`, `gym://`, `harbor://` and `container://`; an adapter proxy for caching and
  logging; Docker and SLURM sandboxes [S270]. The microservice documentation at docs.nvidia.com now
  redirects to an archive with a banner that it "should not be relied upon for current product
  capabilities" [S270].
- garak, the LLM vulnerability scanner, covered in [tools/red-teaming.md](../tools/red-teaming.md) [S130].
- NeMo Guardrails, covered in [tools/guardrails.md](../tools/guardrails.md) [S129].
- The content safety models, of which Nemotron-3-Content-Safety is the current multimodal one, under the
  NVIDIA Nemotron Open Model License and the Gemma terms [S269].
- Weights, recipe, code and "most of the data" for Nemotron 3 Nano [S268].

## What is not public (stated as unknown)
- Whether any Nemotron release went through the PRA and DRA, and what MR score it received. The framework
  says results go into model cards; the Nemotron 3 Nano report we read does not mention the framework
  [S267][S268].
- Safety evaluation results for Nemotron 3 Nano. The report covers safety training data and no safety
  benchmark table [S268].
- The internal evaluation set and the "NVIDIA ThreatOps" data behind the content safety model [S269].
- garak findings for any specific release. The commitment is stated; results are not [S267].
- The licence of Nemotron 3 Nano is not stated in the report text we extracted; check the model card [S268].
- The NVIDIA Trustworthy AI page (fetched, not registered) lists principles and two papers and no
  evaluation procedure.

## Reading order for a newcomer
1. The Frontier AI Risk Assessment, executive summary and "Risk evaluation", for the two-stage process and
   the garak commitment [S267].
2. The Nemotron 3 Nano report, the evaluation sections, for how the numbers were produced and the eight-seed
   prompt-sensitivity method [S268].
3. The Nemotron-3-Content-Safety card, for what a guard model's evaluation looks like, including the
   false-positive check [S269].
4. NeMo Evaluator's README, for the harness-of-harnesses design [S270].
5. garak and NeMo Guardrails in the tools files [S130][S129].

## Sources
- [S116] Frontier AI Safety Policies tracker, METR, living.
- [S129] NeMo Guardrails documentation, NVIDIA, living.
- [S130] garak, NVIDIA, living.
- [S267] Frontier AI Risk Assessment, NVIDIA, 2025-08.
- [S268] Nemotron 3 Nano technical report, NVIDIA, 2025-12-23.
- [S269] Nemotron-3-Content-Safety model card, NVIDIA, living (V1.1, 2026-03-16).
- [S270] NeMo Evaluator repository, NVIDIA, living (v0.3.0, 2026-06-03).
