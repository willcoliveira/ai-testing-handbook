---
id: judge-calibration
title: Judge calibration
area: 3-judging
status: draft
last_reviewed: 2026-09-27
sources: [S051, S052, S053, S054, S056, S057, S059, S060, S062, S063, S064, S065, S251, S252, S255, S257]
related: [llm-as-judge, human-annotation, rubrics-and-pairwise, statistical-treatment-of-evals, non-determinism-and-pass-rates]
---

# Judge calibration

## What
Judge calibration is the measurement of how often a grader (a model judge, or a second human) agrees with a set of trusted human labels, on items the grader has not seen, before the grader's verdicts are used for anything. It produces a number per failure mode, a decision on whether the judge is good enough for the decision it gates, and a schedule for measuring again.

## Why
An uncalibrated judge is an unmeasured guess, and its errors are not symmetric. Eugene Yan's review reports an evaluator that identified over 95% of consistent summaries but only 30 to 60% of inconsistent ones: high precision on good outputs, low recall on defects [S054]. Zheng et al. set the reference point: GPT-4 agreed with experts on 85% of non-tie votes where experts agreed with each other on 81%, so a judge is compared with the human ceiling, not with 100% [S051]. The trade-off is expert time. Hamel Husain's method needs about 100 labelled examples per failure mode from the principal domain expert, and those labels must stay out of the judge's prompt [S052].

## How
1. Fix the label type first, because it fixes the metric. Binary or categorical labels: true positive rate and true negative rate reported separately, precision and recall, Cohen's kappa. Ordinal scores: Spearman's rho or Kendall's tau [S054] [S052].
2. Build the labelled set from the principal domain expert, who writes a pass or fail and a critique for each item [S052]. Start with about 30 items and keep going until no new failure modes appear; then aim for about 100 per failure mode with enough of both classes. Below 60 the confidence intervals are usually too wide to conclude anything [S052].
3. Split. 10 to 20 percent of the labelled items go into the judge prompt as examples; the rest is divided into a dev set for iterating on the prompt and a test set reported once [S052].
4. Compute agreement on the test set. For two raters and nominal labels, Cohen's kappa corrects raw agreement for chance [S062]. For more than two raters, ordinal or interval scores, or missing labels, Krippendorff's alpha applies with one formula and no minimum sample size [S064]. Langfuse's Score Analytics compares judge scores with human annotation using Cohen's kappa and a confusion matrix [S056].
5. Decide what is enough against a stated bar, not a table. Landis and Koch's bands (0.61 to 0.80 substantial) are widely cited, but the encyclopedia entry records that they supplied no evidence for them [S062]. McHugh's table calls 0.80 to 0.90 strong and says low agreement is not acceptable in healthcare or clinical research [S063]. Krippendorff's convention is to rely on data at alpha of at least 0.800, treat 0.667 to 0.800 as tentative, and discard below 0.667 [S065]. A practical bar: the judge must match or approach the human-human agreement measured on the same set [S051], and the true negative rate on defects must be high enough for the decision the judge gates.
6. Count Unable to Verify as its own class. Do not fold it into pass. Report its rate. If the judge says it often, the transcript or the criterion is missing evidence, not the judge.
7. For a pairwise judge, run the swap test: the share of items where the verdict survives swapping the candidates is the position consistency figure to report [S051]. For a preference judge, check its correlation against an independent human preference source after controlling for length [S060].
8. Recalibrate at regular intervals and whenever something material changes: the judge model, the judge prompt, the system prompt, or the criteria [S052]. Expect the criteria themselves to move as graders see more outputs [S053], and record the rubric version with each number.

## Who does it (sourced)
- **Zheng et al. (LMSYS), June 2023:** they measure agreement between judge types as the probability that two randomly selected raters agree on a random question, and report GPT-4 to expert at 85% and expert to expert at 81% on non-tie votes, with position consistency of 65.0% for GPT-4 [S051].
- **Liu et al. (Microsoft), March 2023:** G-Eval is validated by Spearman and Kendall correlation with human scores on SummEval, Topical-Chat and QAGS, and they note that GPT-4 scored GPT-3.5 summaries above human-written ones [S057].
- **Dubois et al. (Stanford), April 2024:** they fit a generalized linear model to the judge's preferences with length difference as a mediator and condition on zero difference; the corrected leaderboard's Spearman with Chatbot Arena rises from 0.94 to 0.98 [S060].
- **Kim et al., May 2024:** Prometheus 2 is checked by Pearson correlation on four direct assessment benchmarks and accuracy on four pairwise benchmarks against human and GPT-4 judgements [S059].
- **Shankar et al., April 2024:** EvalGen re-estimates each candidate assertion's coverage (fails what the user marks bad) and false failure rate (does not fail what the user marks good) every time the user grades another output [S053].
- **Hamel Husain, October 2024:** he says he reports true positive and true negative rates separately, labels about 100 items per failure mode, and re-runs the human review at regular intervals and on material change [S052].
- **Langfuse docs, living:** they say Score Analytics measures agreement between judge and human scores with Cohen's kappa and a confusion matrix [S056].
- **Microsoft, 2026-07:** the safety-evaluator judge was checked against human labels on "500 English, single-turn texts, 250 single-turn text-to-image generations, and 250 multi-modal text with image-to-text generations" per risk area on a 0 to 7 scale at 0, 1 and 2-level tolerance, with lower agreement for violence and hate because the human and automated guidelines "have since diverged" [S252].
- **Microsoft, 2026-08:** red-teaming runs "use generative models to evaluate Attack Success Rates (ASR) and can be non-deterministic, non-predictive" [S251].
- **Amazon, 2025-12:** the service card tells customers to establish an effectiveness score from "human judgements (with multiple judgements per test prompt)", and the Nova 2 report's image quality study was "performed by a third-party" in a single-blind design [S257][S255].

## Pitfalls
1. Raw agreement on imbalanced classes. With a 5% defect rate a judge that always passes scores 95% agreement and zero recall on defects [S052].
2. Treating a kappa band as a standard. The Landis and Koch table rests on opinion [S062], and McHugh says Cohen's own reading may be too lenient for health studies since it treats 0.41 as possibly acceptable [S063].
3. Kappa moves with prevalence. Its chance correction depends on the marginal sums, so the same judge scores differently on sets with different defect rates [S063]. Report the confusion matrix alongside it.
4. Leakage between prompt examples and the test set. Items used as examples in the judge prompt cannot be used to measure it [S052].
5. Labels made before the labeller has seen outputs. EvalGen's nine participants added criteria and reinterpreted existing ones while grading [S053]. Calibrate against labels made after the rubric settled.
6. Measuring in one order only. A pairwise agreement figure taken without a position swap can reflect a first-position preference rather than quality [S051].

## Pattern from a production build
None yet.

## Sources
- [S051] Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena, Zheng et al. (LMSYS), 2023-06-09.
- [S052] Creating an LLM-as-a-Judge that drives business results, Hamel Husain, 2024-10-29.
- [S053] Who Validates the Validators? (EvalGen), Shankar et al., 2024-04-18.
- [S054] Evaluating the Effectiveness of LLM-Evaluators, Eugene Yan, 2024-08.
- [S056] LLM-as-a-Judge, Langfuse docs, living.
- [S057] G-Eval: NLG Evaluation using GPT-4 with Better Human Alignment, Liu et al., 2023-03-29.
- [S059] Prometheus 2, Kim et al., 2024-05-02.
- [S060] Length-Controlled AlpacaEval, Dubois et al., 2024-04-06.
- [S062] Cohen's kappa, Wikipedia, living.
- [S063] Interrater reliability: the kappa statistic, McHugh, Biochemia Medica, 2012-10.
- [S064] Computing Krippendorff's Alpha-Reliability, Krippendorff, 2011-01-25.
- [S065] Krippendorff's alpha, Wikipedia, living.
- [S252] Microsoft Foundry risk and safety evaluations Transparency Note, Microsoft, living
- [S251] AI Red Teaming Agent (Microsoft Foundry docs), Microsoft, living
- [S257] Amazon Nova 2 Lite, AWS AI Service Card, AWS, living
- [S255] Amazon Nova 2: Multimodal Reasoning and Generation Models, technical report and model card, Amazon AGI, 2025-12
