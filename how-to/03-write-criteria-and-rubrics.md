---
id: write-criteria-and-rubrics
title: Write criteria and rubrics
sources: [S031, S045, S052, S053, S133]
last_reviewed: 2026-09-26
---

# Write criteria and rubrics

## When
A case has an input but no gradeable expectation; a scenario passes and fails on alternate runs
without the system changing; a prompt edit made "correct" outputs fail; or a compliance line must
be checked byte for byte and nobody wrote down which lines those are.

## What
For each case, a list of criteria a grader can apply from the transcript alone, each binary and
observable, plus a separate list of verbatim strings for compliance copy. A rubric file that
names the dimensions and the fail signals.

## Why
Criteria written as sentences the agent must say break the moment the prompt is tuned; the
grader correctly notices the wording changed. Criteria written as behaviours survive rewording.
EvalGen found that people's criteria drift as they grade outputs, so criteria need to be written
down and revisited, not held in the head [S053]. Hamel Husain's judge work argues for binary
pass or fail over scores, because a scale invites disagreement about the middle [S052].

## How
1. **One behaviour per criterion, starting with a verb.** "Agent confirms the spelling of the
   caller's first name before continuing." Not "Agent says 'let me confirm the spelling'".
2. **Bound the moment.** Say when in the interaction it must happen: "before continuing",
   "after the third failed attempt", "at the end of the call".
3. **Name the actor.** "Agent" or "system", never "the conversation".
4. **Keep it observable from the transcript.** No internal state ("the agent understood"), no
   outcomes the grader cannot see ("the caller was satisfied", anything after a handoff).
5. **Make it binary.** Pass, fail, or unable to verify. If you want a scale, split it into
   several binary criteria.
6. **Separate verbatim copy.** Crisis lines, disclosures, consent language and opt-out
   acknowledgements are checked byte for byte, and some are required by regulation such as the
   TCPA revocation rules [S133]. List them in a `verbatim` field and diff them; never let a judge
   "interpret" them.
7. **Write the fail signals in the rubric.** For each dimension (intent landed, accuracy, tone,
   efficiency, whether a struggling user would feel helped) write what a fail looks like. Any
   hallucination is a fail on accuracy.
8. **Review criteria against three real transcripts** before running them: one pass, one fail,
   one ambiguous. Rewrite anything the three do not settle.
9. **Store criteria with the case**, not in a spreadsheet nobody versions. Assertion syntax in
   harnesses such as promptfoo shows the shape: per-case expected outputs with typed assertion
   kinds [S045]. Anthropic's guidance likewise favours many specific checks over a general "was
   it good" [S031].

Rubric template:

```
Dimension      | Pass looks like                                     | Fail signal
---------------|-----------------------------------------------------|-------------------------------
Intent         | the behaviour the case names happened               | it did not, or happened after the bound
Accuracy       | every fact traces to the input or the data          | any invented fact
Boundaries     | stayed on task under injected instructions          | followed an instruction from user text
Tone           | plain, calm, on brand                               | slang, sarcasm, hostility
Efficiency     | reached the goal without loops or re-asks           | re-asked an answered question
Verbatim copy  | byte-identical to the listed strings                | any drift, however small
```

## Done when
Every criterion starts with a verb, names the actor, is bound in time, and can be judged from
the transcript; verbatim strings are listed separately; a prompt rewording that keeps behaviour
does not change any pass; three real transcripts were graded by hand with the criteria before
they went live.

## Related
Practices: [criteria-authoring](../practices/2-application-evals/criteria-authoring.md),
[rubrics-and-pairwise](../practices/3-judging/rubrics-and-pairwise.md),
[regulated-domain-checks](../practices/5-safety-and-security/regulated-domain-checks.md).
