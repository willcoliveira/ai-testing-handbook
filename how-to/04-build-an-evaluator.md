---
id: build-an-evaluator
title: Build an evaluator
sources: [S034, S051, S056, S057, S060, S066, S068, S070]
last_reviewed: 2026-09-26
---

# Build an evaluator

## When
Criteria exist (playbook 03) and nothing applies them automatically; a team is about to use a
model to grade outputs; or a suite grades everything with one "was this good" prompt.

## What
A graded evaluator stack: code graders for everything decidable, a model judge only for prose
that needs judgement, humans for calibration and disputes. A judge prompt with a fixed output
schema. A record of which grader decided each criterion.

## Why
Model judges have measured biases: they prefer the first of two answers, longer answers, and
their own outputs [S051]; length can be controlled for [S060]. Every criterion a code grader can
decide is one the judge cannot get wrong. OpenAI's grader taxonomy makes the order explicit:
string checks and similarity, then model-scored, then custom code [S034].

## How
1. **Route each criterion to the cheapest grader that can decide it.**
   - Code: exact match, regex, JSON schema, numeric bounds, a database or state check, a tool
     call sequence check, a byte diff for verbatim copy.
   - Model judge: "did the agent confirm the spelling before continuing", "is the tone calm".
   - Human: anything the judge marks unable to verify, and the calibration sample.
2. **Write the judge prompt from the rubric.** Give the judge the criterion, the transcript,
   and the rule "answer from the transcript only". Ask for a verdict, a quoted evidence line and
   a one-sentence reason. G-Eval's form-filling with explicit evaluation steps is a workable
   shape [S057].
3. **Fix the output schema** and validate it with code before reading the verdict:

```json
{"criterion_id": "enrol-0042-c1", "verdict": "pass | fail | unable_to_verify",
 "evidence": "verbatim quote from the transcript", "reason": "one sentence"}
```

4. **Pin the judge.** Model id, prompt version, temperature 0. A judge change is a version
   change (playbook 10). Never grade a model's outputs with the same model when you can avoid it
   [S051].
5. **For pairwise comparisons, swap positions** and run both orders; a preference that flips
   with order is a tie [S051].
6. **Keep unable to verify as a third state.** Count it separately. A criterion with a high
   unable rate is badly written (playbook 03), not a system failure.
7. **Run it inside a harness** so cases, graders and results are versioned together: Inspect
   scorers [S066], promptfoo assertions [S068], DeepEval metrics [S070], or a platform's
   evaluators [S056]. The harness matters less than that everything is in version control.
8. **Log which grader decided what.** A results row carries the grader kind, so a reviewer can
   see how much of the pass rate rests on a model's opinion.

## Done when
Every criterion has a named grader kind; the judge returns schema-valid verdicts with a quoted
evidence line; the judge model and prompt are pinned; pairwise runs both orders; unable-to-verify
is reported separately; and the evaluator has not yet been trusted: playbook 05 comes next.

## Related
Practices: [llm-as-judge](../practices/3-judging/llm-as-judge.md),
[tool-use-evals](../practices/4-agents-and-systems/tool-use-evals.md),
[harnesses](../practices/4-agents-and-systems/harnesses.md). [tools/README](../tools/README.md)
for the matrix.
