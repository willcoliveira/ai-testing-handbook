---
id: calibrate-the-evaluator
title: Calibrate the evaluator
sources: [S051, S052, S053, S054, S063, S064]
last_reviewed: 2026-09-26
---

# Calibrate the evaluator

## When
Before any pass rate from a model judge is reported to anyone; after the judge prompt, judge
model, criteria or data distribution change; and on a schedule while the judge is in use.

## What
A calibration record: the sample, the human labels, the judge verdicts, an agreement statistic,
the disagreements analysed, the changes made, and the date. A threshold below which the judge
is not trusted.

## Why
A judge that has not been measured against humans is an opinion with a confidence interval
nobody computed. MT-Bench reported judge-to-human agreement around the level humans reach with
each other, and that is the bar [S051]. EvalGen showed that grading changes the grader's own
criteria as they go, so the record must be kept, not remembered [S053]. Eugene Yan's review of
judge studies lists the conditions under which agreement holds and fails [S054].

## How
1. **Draw a blind sample.** At least 30 cases per failure mode you care about; more for the
   noisy ones [S052]. Hide the judge's verdicts from the labellers.
2. **Label by hand, two people, same rubric.** Record verdicts and the quoted evidence line, the
   same schema the judge uses.
3. **Compute agreement three ways.** Human-to-human, judge-to-each-human, judge-to-consensus.
   Use Cohen's kappa for two raters on binary labels [S063]; use Krippendorff's alpha when
   raters, categories or missing labels vary [S064]. Report raw percent agreement next to it.
4. **Set the threshold before you look.** McHugh's reading of kappa treats 0.80 to 0.90 as
   strong and below 0.60 as weak [S063]. A judge that agrees with humans less than the humans
   agree with each other is not ready.
5. **Read every disagreement.** Classify each: criterion badly written (fix playbook 03), judge
   prompt unclear (fix playbook 04), human error (relabel), genuine ambiguity (mark the case). Do
   not tune the judge to the sample; fix the cause.
6. **Re-run on a fresh sample** after changes. Calibrating and measuring on the same cases is
   overfitting.
7. **Schedule recalibration triggers:** any judge model or prompt change, any criteria change, a
   drift alert on the pass-rate distribution, or a fixed interval such as monthly.
8. **Write the record** and store it beside the judge prompt version.

Calibration record template:

```
judge: model id, prompt version, temperature
sample: n cases, drawn <date>, failure modes covered
labellers: A, B (blind)
agreement: A-B kappa 0.86, judge-A 0.81, judge-B 0.79, judge-consensus 0.83, raw 91%
threshold: kappa >= 0.80 to trust; below 0.60 stop using
disagreements: 9 read, 4 criteria rewritten, 2 relabelled, 3 ambiguous cases tagged
verdict: trusted for failure modes X and Y; not trusted for Z (kappa 0.52)
next: recalibrate on judge change, criteria change, drift alert, or 2026-10-26
```

## Done when
The record exists with a number, a threshold set before the number, disagreements classified
and acted on, a fresh-sample re-run, and the triggers written. No pass rate from this judge is
reported without a link to the record.

## Related
Practices: [judge-calibration](../practices/3-judging/judge-calibration.md),
[human-annotation](../practices/3-judging/human-annotation.md).
[ROADMAP](../ROADMAP.md) lists a full agreement study as a deliverable.
Playbook: [16 Add a decision model to a testing workflow](16-add-a-decision-model-to-a-testing-workflow.md)
applies the same calibration to a cheaper model proposed in front of a judge.
