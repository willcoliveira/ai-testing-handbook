---
id: audit
title: Audit
sources: [S005, S006, S014, S053, S072, S073, S096, S098, S102, S104, S109, S117, S121, S127, S128, S154]
last_reviewed: 2026-09-26
---

# Audit

## When
Before a launch or a sign-off; when you inherit a suite and need to know whether its green means
anything; when a model or agent needs its behaviour surveyed beyond your own cases; or when a
third party or a regulator will ask what was tested.

## What
One of three audit reports, each with a checklist, evidence and gaps:

- **A system audit:** what this AI system was tested for, by whom, with what results, and what
  is not covered.
- **A suite audit:** whether an evaluation suite measures what it claims.
- **A behavioural audit:** a survey of a model's behaviour across scenarios, using automated
  auditors, beyond the cases the team wrote.

## Why
Green is a claim. A suite can be green because its criteria are phrase-locked, its judge is
uncalibrated, its data leaked into the prompt, or half its cases silently skip. Public
benchmarks fail the same way [S005] [S006] [S154]. The labs publish system cards precisely
because a release needs a written account of what was evaluated and what was not [S098] [S104],
and the frameworks that govern those releases define the thresholds and the evidence they expect
[S096] [S102] [S109]. NIST's generative AI profile [S127] and the EU code of practice [S128] ask
for the same account from anyone deploying.

## How

### A. Audit a system before sign-off
1. **Ask for the artefacts.** The test map (01), the golden set and datasheet (02), the
   criteria (03), the evaluator and its calibration record (04, 05), the benchmark record (06),
   the safety suite and red-team log (07), the gate map (08), the trace and redaction setup, the
   incident log, the flag states in each environment, the model deprecation plan.
2. **Read a system card as the model for the report.** What a card covers: capability
   evaluations, safety evaluations, red teaming, third-party testing, mitigations, known
   limitations [S098] [S104]. Your report covers the same headings for your system.
3. **Check the OWASP classes** one by one against the safety suite [S121].
4. **Verify three things by running them,** not by reading: one gate red on purpose, one
   must-not-block case, one opt-out from a handoff state.
5. **Write what is not covered** as a list, not a paragraph. It is the most useful section.

### B. Audit an evaluation suite
1. **Coverage:** map every planned cell (component, segment, failure mode) to the cases that
   exercise it, and list cells with none. Count skips and fixmes; a skipped case is not coverage.
2. **Criteria:** sample cases and check for phrase-locked criteria, unobservable criteria, and
   criteria that changed without a record [S053].
3. **Evaluator:** find the calibration record; if there is none, the pass rate is unmeasured.
   Check the judge model and prompt are pinned.
4. **Data:** check for contamination between the dev set and the prompts, and whether the test
   split was ever used to edit anything [S154].
5. **Statistics:** are results distributions with intervals, or single runs? Are version
   comparisons paired?
6. **Gates:** do the thresholds have reasons? What is reported but never gated, and why? What
   would have caught the last incident?
7. **Staleness:** when were cases, criteria and sources last reviewed? Use BetterBench's
   criteria as the checklist for any public benchmark the suite leans on [S005].

### C. Run a behavioural audit with automated auditors
1. **Choose the tool.** Petri drives an auditor model through many seeded scenarios and scores
   transcripts with a judge across behaviour dimensions [S072]; Bloom builds behaviour-specific
   evaluations from a description [S073]. Both are for surveying behaviour beyond your cases, not
   for replacing them.
2. **Write the seeds** from your risk list: the invariants from playbook 01 phrased as
   scenarios an auditor can pursue.
3. **Run across seeds and repetitions,** and read rates, not single transcripts.
4. **Read the flagged transcripts by hand.** Automated auditors also hallucinate findings; treat
   each as a lead to reproduce, and add reproduced ones to the safety suite (07).
5. **Record the limits:** what the auditor could not exercise (real tools, real users, audio).

### D. When a third party evaluates you
Expect requests shaped like METR's task-based capability measurements [S014] or Inspect-based
evaluation suites [S117]: a task set, a harness, transcripts, and results with intervals. Have
the artefacts from A ready in that shape.

Audit report skeleton:

```
1. Scope and version under audit (model, prompt, cases, judge, date)
2. Evidence received (list) and evidence missing (list)
3. Coverage: planned cells vs exercised, skips
4. Criteria and evaluator: calibration record, pinning, unable-to-verify rate
5. Safety: OWASP classes, must-not-block, injection, verbatim, regulated keywords
6. Statistics: N, intervals, paired comparisons
7. Gates: thresholds with reasons, flake policy, runbooks
8. Verified by running: three checks and their results
9. Not covered
10. Findings ranked, each with severity, evidence and the playbook that fixes it
```

## Done when
The report exists with the skeleton filled; every finding has evidence and a playbook; the
not-covered list is written; three checks were run rather than read; and the person who signs
off has read section 9 before section 1.

## Related
Practices: [frontier-safety-frameworks](../practices/5-safety-and-security/frontier-safety-frameworks.md),
[model-and-system-cards](../practices/8-governance/model-and-system-cards.md),
[standards-and-regulation](../practices/8-governance/standards-and-regulation.md),
[benchmark-hygiene](../practices/1-capability/benchmark-hygiene.md). [labs/](../labs/) for
what each lab publishes. [tools/auditors](../tools/auditors.md).
