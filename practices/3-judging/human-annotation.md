---
id: human-annotation
title: Human annotation
area: 3-judging
status: draft
last_reviewed: 2026-09-26
sources: [S051, S052, S053, S054, S056, S059, S061, S062, S063, S064, S065]
related: [judge-calibration, llm-as-judge, rubrics-and-pairwise, exploratory-testing-of-agents, human-in-the-loop]
---

# Human annotation

## What
Human annotation is a labelling pass in which people read model outputs and record a verdict, usually pass or fail with a short critique, sometimes a preference between two outputs. Its products are the ground truth a model judge is calibrated against, the examples in the judge prompt, and the evidence behind a release decision. A pass is defined by who labels, what unit they label, the instructions, the sample, and the agreement figure between labellers.

## Why
Every automatic grade is measured against human labels, so their quality bounds everything downstream. Zheng et al. built their judge study on about 3K expert votes and about 30K crowd votes, and found that experts agreed with one another 81% of the time on non-tie votes [S051]. Human labels cost expert hours and do not scale; Anthropic's docs say to prefer more questions with slightly lower-signal automated grading over fewer hand-graded ones [S061]. The trade-off is that without a human pass there is nothing to calibrate against, so the human pass is small, expert, versioned and reused.

## How
1. Choose the labeller. For product correctness use one principal domain expert, the person whose judgement decides whether the product is good; Hamel Husain says most organisations have one or two such people [S052]. Crowd preference (Chatbot Arena) answers a different question, what users prefer, not what is correct [S051].
2. Fix the unit and the label. One output, or one agent turn, per item. Binary pass or fail with a written critique [S052]. EvalGen also chose thumbs up or down for simplicity, with the rule that a thumbs up means the output passes every criterion [S053]. Use Likert only for a matter of degree, with both ends anchored [S061].
3. Write the instructions as the rubric, one behaviour per criterion, and pilot them on 5 to 10 items. Expect criteria drift: grading outputs changes the criteria, both by adding new failure modes and by reinterpreting existing ones [S053]. Version the rubric and tag each batch of labels with its version.
4. Size the sample. About 30 items until no new failure modes appear, then about 100 per failure mode with both passes and fails present [S052]. Draw items across features, scenarios and personas [S052].
5. Require evidence with every label, including passes: the verbatim quote, the test id and the turn. A label without a location cannot be checked or reused.
6. Put a second labeller on an overlap subset and compute agreement. Two raters and nominal labels: Cohen's kappa [S062]. More raters, ordinal scores or missing labels: Krippendorff's alpha, which needs no minimum sample [S064]. Krippendorff's convention treats alpha of at least 0.800 as reliable and 0.667 to 0.800 as tentative [S065]; McHugh's table calls 0.80 to 0.90 strong [S063].
7. Resolve disagreement by adjudication, not averaging. The principal expert decides, the reason is recorded, and a recurring reason becomes a rubric edit.
8. Store labels where the judge can be compared with them. Langfuse's Score Analytics compares judge scores with human annotation scores using Cohen's kappa and a confusion matrix [S056].
9. For preference labels, show the two outputs without the system names and randomise which one is first. The swap that exposes position bias in a model judge [S051] costs nothing to apply to a human pass.
10. Cost per label is not stated in any source here. What is public is the sizes: about 3K expert votes over 80 questions [S051], 5 to 10 graded outputs per participant in EvalGen's study [S053], and about 100 per failure mode in Hamel Husain's practice [S052].

## Who does it (sourced)
- **Zheng et al. (LMSYS), June 2023:** they collected about 3K expert votes on 80 MT-Bench questions and about 30K crowdsourced votes on Chatbot Arena, and report 81% expert-expert agreement on non-tie votes [S051].
- **Shankar et al., April 2024:** nine industry practitioners (engineers, ML scientists, startup executives, consultants) graded 5 to 10 outputs each with thumbs up or down; the authors report criteria drift in both directions [S053].
- **Hamel Husain, October 2024:** he says the principal domain expert writes a pass or fail and a detailed critique per item, starting around 30 items and reaching about 100 per failure mode [S052].
- **Eugene Yan, August 2024:** his review lists labelled sets used to test evaluators, such as 1.2k question answers of which 961 were labelled correct and 239 incorrect, and reports expert inter-rater agreement of 0.8 to 0.9 on SummEval [S054].
- **Kim et al., May 2024:** they test evaluators against human-labelled pairwise sets such as MT Bench Human Judgment, where Prometheus 2 8x7B agrees with the human label on 71.96% of pairs and GPT-4 on 79.90% [S059].
- **Anthropic docs, living:** they say to prioritise volume, since more questions with slightly lower-signal automated grading beat fewer high-quality hand-graded ones, and to structure questions so grading can be automated [S061].
- **Langfuse docs, living:** they say human annotation scores can be compared with judge scores using Cohen's kappa and a confusion matrix [S056].

## Pitfalls
1. One labeller and no agreement figure. Without a second rater on an overlap you cannot separate rubric ambiguity from rater error; kappa or alpha is the check [S062] [S064].
2. Likert without anchors. Expert judgments tend not to correlate with unanchored scales, and a 3 or a 4 is not actionable [S052].
3. Unrecorded criteria drift. Labels made under an earlier reading of the rubric get mixed with later ones [S053]. Version the rubric.
4. Treating a crowd preference as a correctness label. Chatbot Arena votes are preferences between two answers; Zheng et al. keep them separate from expert votes [S051], and Yan notes the better of a pair can still be a defect [S054].
5. Reading a kappa band as a pass mark. Landis and Koch's bands rest on opinion [S062]; McHugh says low agreement is not acceptable where results change clinical practice [S063]. Set the bar from the decision the labels gate.

## Pattern from a production build
None yet.

## Sources
- [S051] Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena, Zheng et al. (LMSYS), 2023-06-09.
- [S052] Creating an LLM-as-a-Judge that drives business results, Hamel Husain, 2024-10-29.
- [S053] Who Validates the Validators? (EvalGen), Shankar et al., 2024-04-18.
- [S054] Evaluating the Effectiveness of LLM-Evaluators, Eugene Yan, 2024-08.
- [S056] LLM-as-a-Judge, Langfuse docs, living.
- [S059] Prometheus 2, Kim et al., 2024-05-02.
- [S061] Create strong empirical evaluations, Anthropic Claude Platform docs, living.
- [S062] Cohen's kappa, Wikipedia, living.
- [S063] Interrater reliability: the kappa statistic, McHugh, Biochemia Medica, 2012-10.
- [S064] Computing Krippendorff's Alpha-Reliability, Krippendorff, 2011-01-25.
- [S065] Krippendorff's alpha, Wikipedia, living.
