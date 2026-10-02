---
id: rubrics-and-pairwise
title: Rubrics and pairwise
area: 3-judging
status: draft
last_reviewed: 2026-09-26
sources: [S051, S052, S053, S054, S055, S057, S058, S059, S060, S061]
related: [llm-as-judge, judge-calibration, human-annotation, criteria-authoring]
---

# Rubrics and pairwise

## What
A rubric is the text a grader applies: the criteria, what counts as meeting each one, and the scale. The format decision has two parts: pointwise (grade one output on its own) or pairwise (choose between two), and for pointwise, binary (pass or fail) or a scale (1 to 5). The format fixes which agreement metric can be computed and what the number can be used for.

## Why
Format drives stability and usefulness. Pairwise comparison yields more stable results than direct scoring on subjective quality, per the survey and per Eugene Yan's review, but the better of a pair can still be a defect, so objective criteria need direct scoring [S058] [S054]. Binary labels with a critique are actionable and match how experts judge; Hamel Husain reports that expert judgments tend not to correlate with 1 to 5 scores [S052]. Scales still have a place: Anthropic's docs use a 1 to 5 Likert for tone, and OpenAI's grader guide asks for a smooth score rather than a pass or fail stamp when the grader feeds an optimiser [S061] [S055]. The trade-off: pairwise needs a baseline and doubles the calls for the position swap; pointwise needs anchors that two graders read the same way.

## How
Decision table:

| Question | Format | Metric |
|---|---|---|
| Can code decide it (exact match, regex, schema, similarity)? | Code grader, no model [S061] [S055] | Accuracy |
| Objective, needs reading (correct, grounded, followed the instruction)? | Binary pass or fail with critique [S052] | TPR and TNR, kappa |
| A matter of degree (tone, context use)? | 1 to 5 with both ends anchored [S061], or a per-score rubric [S059] | Spearman, Kendall |
| Which of two systems or prompts is better on subjective quality? | Pairwise with a tie option, swapped [S051] | Win rate, position consistency |
| Feeding a training or optimisation loop? | Smooth 0 to 1 score [S055], or probability-weighted score [S057] | Correlation |

Writing a rubric a grader can apply:
1. One behaviour per criterion, phrased as what the agent must do, not a sentence it must say. Bound when it must happen and name the speaker. Reserve verbatim matching for compliance copy that is verbatim by law. See [criteria-authoring](../2-application-evals/criteria-authoring.md).
2. Put the criterion and its scale in the prompt. G-Eval's prompt is a task introduction, the criteria, evaluation steps the model generates itself, then a form to fill [S057]. Prometheus 2 takes a score rubric with a description of the criterion and a description for each score from 1 to 5 [S059]. Anthropic's tone prompt anchors only the ends, "1: Not at all {target_tone}" and "5: Perfectly {target_tone}", then "Output only the number" [S061].
3. Add a third label, Unable to Verify, for pointwise grading. If the transcript lacks the evidence the criterion needs, the grader says so rather than guessing. Track its rate; a high rate means the criterion asks for something the transcript does not show.
4. Grade with examples. Each example carries the input, the output, a critique and the label, and the requested output format matches the examples [S052]. EvalGen's interface uses thumbs up or down and treats a thumbs up as passing every criterion [S053].

Pairwise mechanics:
1. Present the question and two answers and ask for A, B or tie [S051].
2. Call twice with the answers swapped; count a win only when the same answer wins in both orders [S051]. Report position consistency.
3. Control for length. Length-controlled AlpacaEval fits a generalized linear model on the judge's preferences with length difference as a mediator and reports the preference at zero difference; Spearman with Chatbot Arena rose from 0.94 to 0.98 [S060].
4. Report with and without ties; Zheng et al. give both setups [S051].
5. Use pairwise for ranking systems, not for gating one system: a pairwise win says nothing about whether either answer passed [S054].

## Who does it (sourced)
- **Zheng et al. (LMSYS), June 2023:** they use three judge prompts, pairwise comparison with a tie option, single answer grading, and reference-guided grading for maths, and swap positions to counter position bias [S051].
- **Liu et al. (Microsoft), March 2023:** G-Eval fills a form per criterion and weights the score by output token probability because integer scores cluster on one digit [S057].
- **Kim et al., May 2024:** Prometheus 2 is trained on both a 1 to 5 rubric format and a pairwise format and merges the two evaluators' weights into one model [S059].
- **Dubois et al. (Stanford), April 2024:** the length-controlled AlpacaEval leaderboard reports a pairwise win rate against a fixed baseline, adjusted for length [S060].
- **Shankar et al., April 2024:** EvalGen collects binary thumbs up or down per output [S053].
- **Hamel Husain, October 2024:** he says he uses pass or fail with a critique and avoids 1 to 5 scales because they are not actionable [S052].
- **Anthropic docs, living:** they show binary (yes or no), Likert (1 to 5) and ordinal (1 to 5) LLM-graded prompts, each ending with an instruction to output only the label [S061].
- **OpenAI docs, living:** score_model graders return a number in a range and multi graders combine sub-scores with a formula; the guide says to produce a smooth score, not a pass or fail stamp [S055].

## Pitfalls
1. Position bias in pairwise. Default-prompt GPT-4 was consistent across a swap 65.0% of the time; Claude-v1 23.8% [S051].
2. Verbosity bias. Padded answers won 91.3% of the time under Claude-v1 and GPT-3.5 judges [S051]; length control corrects the leaderboard [S060].
3. Likert mid-values. A 3 or 4 is not actionable and does not correlate with expert judgement [S052]; integer scores also cluster [S057].
4. Phrase-locked criteria. A criterion that names a sentence breaks on the next prompt change, and graders reinterpret criteria as they see outputs [S053]. See [criteria-authoring](../2-application-evals/criteria-authoring.md).
5. Self-enhancement. A judge from the same family as the graded model may favour it: GPT-4 by 10% and Claude-v1 by 25% in Zheng et al., and GPT-4 scored GPT-3.5 summaries above human ones in G-Eval [S051] [S057].
6. Pairwise as a gate. The better of a pair can still be a defect [S054].

## Pattern from a production build
None yet.

## Sources
- [S051] Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena, Zheng et al. (LMSYS), 2023-06-09.
- [S052] Creating an LLM-as-a-Judge that drives business results, Hamel Husain, 2024-10-29.
- [S053] Who Validates the Validators? (EvalGen), Shankar et al., 2024-04-18.
- [S054] Evaluating the Effectiveness of LLM-Evaluators, Eugene Yan, 2024-08.
- [S055] Graders, OpenAI API docs, living.
- [S057] G-Eval: NLG Evaluation using GPT-4 with Better Human Alignment, Liu et al., 2023-03-29.
- [S058] A Survey on LLM-as-a-Judge, Gu et al., 2024-11-23.
- [S059] Prometheus 2, Kim et al., 2024-05-02.
- [S060] Length-Controlled AlpacaEval, Dubois et al., 2024-04-06.
- [S061] Create strong empirical evaluations, Anthropic Claude Platform docs, living.
