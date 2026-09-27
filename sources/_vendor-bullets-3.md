# Proposed "Who does it (sourced)" bullets, vendors batch 3

Mistral, xAI, NVIDIA, Cohere, and the open ecosystem (Hugging Face, EleutherAI, AI2). One block per
practice id. Ids S259 to S280 are in `sources/_vendors-3.rows.md`; S006, S116, S129, S130, S165 are already
in the register. Merge into each practice's "Who does it (sourced)" section and add the ids to that file's
frontmatter.

## practice: capability-benchmarks
- **EleutherAI, living:** lm-evaluation-harness implements "over 60 standard academic benchmarks for LLMs, with hundreds of subtasks and variants" behind one interface, and holds that "Evaluation with publicly available prompts ensures reproducibility and comparability between papers" [S274].
- **Hugging Face, 2023 to 2025:** the Open LLM Leaderboard v1 fixed six benchmarks and their shot counts and ran every model "in the exact same setup" on a pinned harness commit [S277]; the board retired in March 2025 after "over 13K models" because "benchmarks need to follow" capabilities [S276].
- **AI2, December 2025:** OlmoBaseEval is 43 tasks clustered by capability, with a Base Easy suite for small runs, a Base Main suite for the final run, and four held-out benchmarks to catch overfitting to the development suite [S278].
- **Mistral, June 2025:** the Magistral report states its decoding settings (temperature 0.7 for math and GPQA, 0.95 for code; 40k or 32k max tokens) alongside AIME, MATH-500, LiveCodeBench, GPQA and Humanity's Last Exam scores [S260].
- **Cohere, April 2025:** Command A is scored on a published table of benchmarks by area, follows the simple-evals implementation for MMLU, MMLU-Pro and GPQA, and shows "externally reported results with comparable evaluation settings" wherever possible [S272].
- **xAI, September 2026:** the Grok 4.7 card runs capability tests unsafeguarded and attributes several results to third-party runs (Datacurve, Harbor), noting that on Terminal-Bench "absolute scores remain sensitive to the agent harness" [S266].

## practice: benchmark-hygiene
- **Hugging Face, March 2025:** retired its leaderboard because it "could encourage people to hill climb irrelevant directions" [S276]; v1 had marked community-flagged models so they "should probably be ignored" [S277].
- **AI2, December 2025:** keeps four held-out benchmarks out of the development suite and decontaminates midtraining data against every split of every OLMES benchmark; even "complete leakage of GSM8K" did not raise the score [S278].
- **Cohere Labs, April 2025:** co-authored The Leaderboard Illusion on private testing and data asymmetries on Chatbot Arena [S006]; Cohere's own human-evaluation prompts are "curated from scratch by our pool of annotators to avoid accidental contamination for competitor models" [S272].
- **EleutherAI, August 2026:** the v0.4.13 release fixed eval documents leaking into few-shot prompts and warns that "prior numbers on those tasks may not be comparable" after prompt changes [S274].
- **xAI, September 2026:** notes that CursorBench 4.0 "scores are not comparable with CursorBench 3.2" and that DeepSWE tasks are "written from scratch rather than mined from existing commits" to keep reference solutions out of the public record [S266].

## practice: statistical-treatment-of-evals
- **AI2, December 2025:** measures variance as the mean standard deviation over "3 runs of 14 models", buckets tasks (GPQA 1.48 high, MATH 0.25 very stable), and reports every number as "the mean of three runs" [S278].
- **NVIDIA, December 2025:** evaluates Nemotron 3 Nano under multiple prompt variants, "mean accuracy across eight seeds" per prompt, and reports the standard deviation of prompt averages as a prompt-sensitivity metric [S268]; its risk framework runs assessments at "50% confidence" during development and "95-99% confidence" for model-card data [S267].
- **Cohere, April 2025:** reports the human agreement (77.7%) and Cohen's kappa (0.55) of its LLM jury for relative safety, and runs the demographic bias test "five times per sample" to plot the distribution [S272].
- **xAI, April 2026:** reports an RMS calibration error over ten confidence bins on Humanity's Last Exam as its overconfidence metric [S265].

## practice: harnesses
- **EleutherAI, living:** lm-evaluation-harness, MIT, v0.4.13 (2026-08-31), four request types, backends from transformers to ONNX Runtime and Megatron-LM, and `--check_integrity` for datasets [S274].
- **Hugging Face, living:** lighteval, MIT, v0.13.0 (2025-11-24), "1000+ evaluation tasks" over inspect-ai, accelerate, nanotron, vLLM, SGLang and endpoints [S275].
- **NVIDIA, living:** NeMo Evaluator, Apache 2.0, v0.3.0 (2026-06-03), 17 built-in benchmarks and other harnesses addressed as `lm-eval://`, `skills://`, `vlmevalkit://`, `gym://`, `harbor://` and `container://` [S270]; the Nemotron 3 Nano report collected its results through it and LM Evaluation Harness [S268].
- **AI2, living:** OLMES, Apache 2.0, the suite behind OLMo 3, with a companion `decon` tool for decontamination [S279][S278].

## practice: guardrails
- **Mistral, living:** the moderation endpoint returns per-category scores; "The policy threshold is determined based on the optimal performance of our internal test set", deployers may set thresholds from 0 to 1, and "Custom policies that depend on `category_scores` can require recalibration" [S261]; the classifier is an LLM on Ministral 8B with 9 categories [S262].
- **NVIDIA, March 2026:** Nemotron-3-Content-Safety V1.1 reports accuracy 0.56 to 0.94 across 14 external safety benchmarks and false-positive rates of 0.023 (MMMU), 0.058 (DocVQA) and 0.001 (AI2D) on sets assumed benign [S269]; NeMo Guardrails supplies the rails [S129].
- **Cohere, April 2025:** Safety Modes ("contextual", "strict") are evaluated with one set that "should always be answered" and one that "should always be refused", and the over-refusal set came from red-teaming the previous model [S272].
- **xAI, September 2026:** a "layered, defense-in-depth stack": safety fine-tuning, system prompts, and on some surfaces "runtime input and topical filters" for CSAM, self-harm and CBRN pathways, measured by refusal recall (bio 100%, chem 99.9%) and a self-harm suite that fails refusals "without redirecting the user to help" [S266].

## practice: red-teaming
- **xAI, April 2026:** gave third-party evaluators an early checkpoint for "coverage testing and red-teaming of the refusal boundary" and, separately, "an audit of their deceptive and scheming behaviors"; internal jailbreak templates and AgentDojo cover the automated side [S265]. **September 2026:** "a broad, continuously updated set of jailbreak attacks" including StrongREJECT and Crescendo, with compliance 0.01% to 2.0% [S266].
- **Cohere, February 2025:** "multidisciplinary red teaming during both the model development phase and post-launch", which "may include independent external parties, such as NIST and Humane Intelligence"; findings become standing evaluations run on later versions [S271].
- **NVIDIA, August 2025:** "uses Garak as a highest-priority assessment of models before release" and has red teams probe "each guardrail component independently with targeted examples" [S267][S130].
- **AI2, December 2025:** no human or external red teaming is described for OLMo 3; safety is a benchmark average [S278].

## practice: frontier-safety-frameworks
- **xAI, June 2026:** the FAIF names four risk domains, commits to "a full systemic risk assessment and mitigation process of our frontier models at least once a year" with named triggers, and makes evaluations "a precondition for release" [S263]. **December 2025:** the prior version stated numeric criteria, a MASK dishonesty rate "less than 1 out of 2" and a restricted bio and chem answer rate "less than 1 out of 20"; the June 2026 text gives none [S264].
- **NVIDIA, August 2025:** a Preliminary Risk Assessment (MR1 to MR5, frontier models at MR5) and a Detailed Risk Assessment, with results "stored in our model cards", written while "frontier AI models are not currently under development at NVIDIA" [S267].
- **Cohere, February 2025:** declines capability thresholds as "limited in their methodological maturity", and sets a bright line of "no significant regressions compared to our previously launched model versions", with launch authority delegated to the Chief Scientist [S271].
- **METR, living:** the tracker lists xAI (four versions), NVIDIA (February 2025) and Cohere (February 2025), and no Mistral document [S116].

## practice: model-and-system-cards
- **xAI, September 2026:** the Grok 4.7 card gives each evaluation its own subsection, states whether safeguards were on, names its evaluation partners, and says in its references that "Internal evaluations are not listed" [S266]; the 4.20 card structures itself by malicious use, loss of control and dual-use capability [S265].
- **NVIDIA, March 2026:** the Nemotron-3-Content-Safety card states training window, sample counts (about 86k train, 6k test, 6k eval), collection method and licence alongside the benchmark table [S269]; the risk framework says assessment data "is then stored in our model cards" [S267].
- **Cohere, October 2024:** the Command R and R+ model card reports a BOLD bias evaluation and a multi-turn toxicity caveat [S273].
- **Hugging Face, living:** the Hub model card format carries `model-index` evaluation metadata [S165]; Mistral's Large 3 card shows results as images (fetched, not registered).

## practice: post-training-evals
- **AI2, December 2025:** the post-training suite is run at every stage (SFT, DPO, RL) under one configuration, and "evaluation costs between 10 and 20% of our compute budget" during recipe development [S278].
- **Cohere, April 2025:** "while model merging is cheap and fast, evaluating each merge requires significant inference time and compute", and polishing progress is tracked by win rate against a fixed competitor [S272].
- **xAI, April 2026:** "During training, we penalize harmful model propensities" using an LLM judge on rollouts, then measures the same propensities (MASK, sycophancy) on the deployed checkpoint [S265].
- **NVIDIA, December 2025:** safety SFT data is built from named datasets and "A content-safety classifier is employed to filter the responses"; no safety results table follows [S268].

## practice: data-contamination
- **AI2, December 2025:** the `decon` tool detects n-gram matches and expands them into clusters before removing documents; it targets midtraining "in light of results suggesting that memorization occurs most strongly near the end of training" [S278].
- **Cohere, April 2025:** extends its "uncontaminated" LBPP benchmark to five more languages and curates human-evaluation prompts from scratch to avoid contaminating competitor comparisons [S272].
- **EleutherAI, August 2026:** shipped a fix for "Eval documents leaked into few-shot prompts" in the harness itself [S274].

## practice: regression-on-upgrade
- **Cohere, February 2025:** the launch rule is "no significant regressions compared to our previously launched model versions"; regressions found in any pre-deployment evaluation "are investigated and mitigated before deployment" [S271].
- **Mistral, living:** `mistral-moderation-2411` was deprecated on March 31, 2026 in favour of `mistral-moderation-2603`, and the docs warn that threshold-based custom policies "can require recalibration" [S261].
- **xAI, September 2026:** each safety table reports Grok 4.5, 4.6 and 4.7 side by side on the same suites, which is what makes a regression visible [S266].

## practice: tool-use-evals
- **Cohere, April 2025:** TauBench and BFCL for agentic tool use, plus mTauBench for multilingual tool use [S272].
- **NVIDIA, December 2025:** Tau-2 Bench run in a dedicated container under NeMo Evaluator SDK [S268].
- **Mistral, June 2025:** function calling scored on an "internal benchmark" [S260].

## practice: agent-evals
- **xAI, April 2026:** AgentHarm for agentic refusals (violation rate 0.30) and AgentDojo for prompt injection (attack success 0.33), both in the model card [S265]; **September 2026:** CyberGym, CVE-Bench and Terminal-Bench run through the Grok Build harness, with the caveat that scores "remain sensitive to the agent harness" [S266].
- **NVIDIA, living:** NeMo Evaluator ships agentic and terminal benchmarks (PinchBench, Terminal-Bench) with Docker sandboxes and solvers for tool calling [S270].
- **Cohere, April 2025:** agentic tool use is an evaluation area of its own, with TauBench and BFCL [S272].

## practice: llm-as-judge
- **Cohere, April 2025:** "a jury of LLM evaluators" for relative safety with 77.7% human agreement and kappa 0.55; an LLM judge for over-refusal because it is "a much easier task than safety"; human labels "triply annotated" as the baseline [S272].
- **xAI, April 2026:** refusal outcomes graded by "a separate model", correctness on HLE judged by "a separate LLM judge", and an alignment audit whose judge is built on Petri 2.0 [S265].
- **NVIDIA, living:** NeMo Evaluator marks judge-based benchmarks (SimpleQA, HealthBench) as `needs_judge` [S270].
- **AI2, December 2025:** relies on verifiable metrics for most of the suite and reports AlpacaEval, a judge-based task, as one of its high-variance benchmarks [S278].
