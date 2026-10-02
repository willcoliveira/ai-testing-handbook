---
id: llm-as-judge
title: LLM-as-judge
area: 3-judging
status: draft
last_reviewed: 2026-09-30
sources: [S051, S052, S053, S054, S055, S056, S057, S058, S059, S060, S061, S066, S070, S071, S153, S213, S221, S229, S230, S252, S253, S255, S265, S270, S272, S278, S303]
related: [judge-calibration, rubrics-and-pairwise, human-annotation, criteria-authoring, non-determinism-and-pass-rates]
---

# LLM-as-judge

## What
An LLM-as-judge is a model prompted to grade another model's output. The prompt carries the task, the criteria, often a few graded examples, and an output format. The judge returns a label (pass or fail), a score (1 to 5), or a choice between two candidates. It stands in for a human grader on open-ended text where a code check cannot decide. It is only trustworthy after its agreement with human labels has been measured on a held-out set (see [judge-calibration](judge-calibration.md)).

## Why
Human grading does not scale and code checks cannot read prose. Zheng et al. found that GPT-4 agreed with human experts on 85% of non-tie MT-Bench votes, while the experts agreed with each other on 81% [S051]. G-Eval with GPT-4 reached a Spearman correlation of 0.514 with human scores on SummEval, above every prior automatic metric [S057]. The trade-off is that a model judge carries documented biases (position, verbosity, self-enhancement), that its agreement is task-specific and must be re-measured when anything changes, and that it can look calibrated while missing most defects. Eugene Yan's review reports an evaluator that flagged over 95% of consistent summaries correctly but caught only 30 to 60% of the inconsistent ones [S054].

## How
1. Decide whether a judge is needed at all. Exact match, regex, schema checks and text similarity come first. Anthropic's docs put code-based grading ahead of LLM grading, and OpenAI's grader types start with string checks and text similarity [S061] [S055]. Use a model judge for what code cannot read.
2. Pick the format before writing the prompt. Binary pass or fail with a written critique is the default for objective criteria [S052]. Likert (1 to 5) only where the criterion is a matter of degree such as tone, with both ends anchored [S061]. Pairwise when comparing two systems on subjective quality [S054]. See [rubrics-and-pairwise](rubrics-and-pairwise.md).
3. Shape the prompt in this order: a role, the task and its guidelines, the criteria, graded examples each with a critique and a label, the item to grade, and the exact output format, which matches the examples [S052]. G-Eval adds evaluation steps the model generates itself between the criteria and the item, and asks for the score as form-filling [S057]. Ask for the critique before the label so the label is conditioned on reasons.
4. Give the judge a third label: Unable to Verify. The transcript may not contain the evidence a criterion needs. A forced pass or fail is a guess. Route those items to a human and track the rate.
5. For pairwise, call the judge twice with the candidates swapped and count a win only when the same candidate wins in both orders [S051]. Report results with and without ties [S051].
6. Use a different model from the one that produced the output [S061]. Where that is not possible, measure the self-preference on the calibration set.
7. Calibrate before trusting. Label about 30 items to find failure modes, then about 100 per failure mode, and report true positive and true negative rates separately [S052]. Details in [judge-calibration](judge-calibration.md).
8. Run it as an asynchronous scorer on sampled traces, not in the request path. Langfuse's worker picks matching observations off a queue, renders the prompt, calls the model and writes back a numeric, categorical or boolean score [S056].
9. Recheck at regular intervals and on every material change to the judge model, the judge prompt, or the system under test [S052].

## Who does it (sourced)
- **Zheng et al. (LMSYS), June 2023:** they built MT-Bench (80 multi-turn questions, about 3K expert votes) and Chatbot Arena (about 30K crowd votes), and report GPT-4 at 85% agreement with experts on non-tie votes against 81% expert-expert agreement [S051].
- **Liu et al. (Microsoft), March 2023:** G-Eval's prompt is a task introduction, the criteria, auto chain-of-thought evaluation steps and a form to fill; GPT-4 reached Spearman 0.514 on SummEval, 0.575 on Topical-Chat and 0.611 on QAGS [S057].
- **Kim et al., May 2024:** Prometheus 2 is an open evaluator model trained for direct assessment on a 1 to 5 rubric and for pairwise ranking; the 8x7B model reaches Pearson 0.665 on MT Bench against GPT-4's 0.717 [S059].
- **Shankar et al., April 2024:** EvalGen generates candidate grader prompts and code assertions, then selects among them using human thumbs up or down grades; they report a qualitative study with nine practitioners [S053].
- **Hamel Husain, October 2024:** he says he has helped over 30 companies set up evaluation; in one case the judge reached over 90% agreement with the principal domain expert after three prompt iterations [S052].
- **Anthropic docs, living:** they show LLM-graded Likert and binary prompts ("Output only the number", "Output only 'yes' or 'no'") and say it is generally best practice to grade with a different model than the one that generated the output [S061].
- **OpenAI docs, living:** the score_model grader prompts a separate model, accepts reasoning models with a reasoning_effort setting and parses a float from a result field; the page carries a deprecation notice for graders in the evals and fine-tuning workflows [S055].
- **Langfuse docs, living:** they say judge evaluators run on the worker asynchronously, and Score Analytics compares judge scores with human annotation using Cohen's kappa and a confusion matrix [S056].
- **DeepSeek, 2024-12 and 2025-01:** the V3 report uses "DeepSeek-V3 as a Generative Reward Model"; the R1 recipe queries DeepSeek-V3 four times per preference pair for its preference data, and reports ArenaHard with GPT-4-1106 as judge [S213][S153].
- **Zhipu, 2025-08 and 2026-02:** GLM-4.5's HLE score is "GPT-4o judged"; GLM-5 grades search tasks with "the OpenAI evaluation prompt" and o3-mini as judge [S229][S230].
- **Alibaba Qwen, 2025-10:** Qwen3Guard's 1.19M training labels come from "multiple versions of Qwen models" aggregated "via a voting mechanism", seeded by "a small set of manually annotated samples" [S221].
- **Microsoft, 2026-07:** Foundry "provisions a fine-tuned Azure OpenAI GPT-4o model" to generate adversarial prompts and "another GPT-4o model to annotate your test dataset", returning a label (Very low, Low, Medium, High) "and reasoning for the AI-generated label" [S252].
- **Microsoft, 2026-04:** hosted safety evaluators score on a 0 to 7 scale and, "Given a numerical threshold (default 3), the evaluator outputs pass if the score is less than or equal to the threshold, or fail otherwise" [S253].
- **Amazon, 2025-12:** the Nova 2 report evaluates its own models as content moderation classifiers, reporting F1 on Aegis, WildGuard and Jigsaw against Claude, Gemini and GPT baselines [S255].
- **Cohere, April 2025:** "a jury of LLM evaluators" for relative safety with 77.7% human agreement and kappa 0.55; an LLM judge for over-refusal because it is "a much easier task than safety"; human labels "triply annotated" as the baseline [S272].
- **xAI, April 2026:** refusal outcomes graded by "a separate model", correctness on HLE judged by "a separate LLM judge", and an alignment audit whose judge is built on Petri 2.0 [S265].
- **NVIDIA, living:** NeMo Evaluator marks judge-based benchmarks (SimpleQA, HealthBench) as `needs_judge` [S270].
- **AI2, December 2025:** relies on verifiable metrics for most of the suite and reports AlpacaEval, a judge-based task, as one of its high-variance benchmarks [S278].
- **DeepEval, 2026-09:** version 4.2.4 added a decision-model judge (TypeSafe's Jev) that returns bounded verdicts instead of generated text, presented as less flaky, cheaper and faster [S070].
- **Langfuse, 2026-08 and 2026-09:** versions 4.42 to 4.44 surfaced decision-model evaluators in the template gallery and added them as a judge option [S071].
- **arXiv, 2026-09:** a model used as a document auditor at scale fabricated findings and degraded as batch size grew, a warning for any judge asked to review many items in one call [S303].
- **Inspect AI, 2026-09:** version 0.3.273 fixed `self_critique()`, and `model_graded_qa()` and `model_graded_fact()` with `model_role=None`, which did not grade with the correct model when one task was evaluated against several models [S066].

## Pitfalls
1. Position bias. With the default prompt GPT-4 gave the same verdict across a swap only 65.0% of the time and Claude-v1 23.8%; most judges favoured the first position [S051]. The survey lists position bias as task-agnostic and swapping as the standard fix [S058].
2. Verbosity bias. A "repetitive list" attack that padded 23 answers without adding information fooled Claude-v1 and GPT-3.5 91.3% of the time and GPT-4 8.7% [S051]. Length-controlled AlpacaEval regresses length out of the preference and lifts Spearman with Chatbot Arena from 0.94 to 0.98 [S060].
3. Self-enhancement bias. GPT-4 favoured its own outputs with a 10% higher win rate and Claude-v1 with 25%, though the authors say the data was too limited to be certain [S051]. G-Eval-4 always scored GPT-3.5 summaries above human-written ones even where humans preferred the human text [S057].
4. Phrase-locked criteria. A criterion that names a sentence the agent must say breaks on the next prompt change; write behaviours, not phrases. Grading also changes the criteria: EvalGen's authors call this criteria drift [S053]. See [criteria-authoring](../2-application-evals/criteria-authoring.md).
5. Likert scores nobody can act on. "People don't know what to do with a 3 or 4", and expert judgments tend not to correlate with such scales [S052]. Integer scores also cluster on one digit, which is why G-Eval weights by token probability [S057].
6. Trusting raw agreement. If 5% of items fail, a judge that always passes has 95% agreement and catches nothing [S052].

## Pattern from a production build
None yet.

## Sources
- [S051] Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena, Zheng et al. (LMSYS), 2023-06-09.
- [S052] Creating an LLM-as-a-Judge that drives business results, Hamel Husain, 2024-10-29.
- [S053] Who Validates the Validators? (EvalGen), Shankar et al., 2024-04-18.
- [S054] Evaluating the Effectiveness of LLM-Evaluators, Eugene Yan, 2024-08.
- [S055] Graders, OpenAI API docs, living.
- [S056] LLM-as-a-Judge, Langfuse docs, living.
- [S057] G-Eval: NLG Evaluation using GPT-4 with Better Human Alignment, Liu et al., 2023-03-29.
- [S058] A Survey on LLM-as-a-Judge, Gu et al., 2024-11-23.
- [S059] Prometheus 2, Kim et al., 2024-05-02.
- [S060] Length-Controlled AlpacaEval, Dubois et al., 2024-04-06.
- [S061] Create strong empirical evaluations, Anthropic Claude Platform docs, living.
- [S213] DeepSeek-V3 Technical Report, DeepSeek-AI (arXiv 2412.19437), 2024-12-27
- [S153] DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning, DeepSeek-AI (arXiv 2501.12948), 2025-01-22
- [S229] GLM-4.5: Agentic, Reasoning, and Coding (ARC) Foundation Models, Zhipu AI and Tsinghua University (arXiv 2508.06471), 2025-08-08
- [S230] GLM-5: from Vibe Coding to Agentic Engineering, Z.ai (arXiv 2602.15763), 2026-02-17
- [S221] Qwen3Guard Technical Report, Qwen Team, Alibaba (arXiv 2510.14276), 2025-10-16
- [S252] Microsoft Foundry risk and safety evaluations Transparency Note, Microsoft, living
- [S253] Risk and safety evaluators for generative AI (Microsoft Foundry docs), Microsoft, living
- [S255] Amazon Nova 2: Multimodal Reasoning and Generation Models, technical report and model card, Amazon AGI, 2025-12
- [S272] Command A: An Enterprise-Ready Large Language Model (technical report), Cohere, arXiv 2504.00698, 2025-04
- [S265] Grok 4.20 System Card, xAI, 2026-04-07
- [S270] NeMo Evaluator (repository), NVIDIA-NeMo, GitHub, living
- [S278] Olmo 3 (technical report), Ai2 (Olmo Team), arXiv 2512.13961, 2025-12
- [S070] DeepEval documentation, introduction, Confident AI, living
- [S071] Langfuse evaluation overview, Langfuse, living
- [S303] When Auditors Fabricate: batch-size degradation and confident hallucination in LLM detection of planted document contamination, arXiv 2609.09696, 2026-09-09
- [S066] Inspect AI documentation and repository, UK AI Security Institute, living
