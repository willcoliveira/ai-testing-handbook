---
id: run-an-exploratory-session
title: Run an exploratory session against an agent
sources: [S205, S206, S207, S210]
last_reviewed: 2026-09-27
---

# Run an exploratory session against an agent

## When
A new build lands and the suite is green; a ticket has acceptance criteria but no test yet; a
production report needs reproducing; or the suite has not found anything in a while and you
suspect it is measuring the wrong things.

## What
A dated session folder with a charter, a log, a report, one file per bug, and an evidence folder;
plus the target layer that makes the next session cheaper: a target definition with its oracles
and test data, a knowledge base of checklists, rules, techniques and known failure shapes, a
learned-patterns file of false positives, and a rolling learnings file that ends as a handover.

## Why
An agent's failures do not show up as exceptions. Hallucination, drift, a mis-tuned guardrail and
a state that should be terminal but is not are found by a person exploring with invariants in
mind, and lost again unless the evidence standard is strict and the oracles are written down. The
skills automate the procedure [S205] [S210]; the target layer is what turns a run of sessions into a
method instead of a run of afternoons.

## How
1. **Set up the target once.** Run the target-setup skill with live discovery. Record the
   surfaces (the chat or simulator surface you drive, the dashboard or store you read as the
   oracle), scope, safety flags, test data that is known to work, a control path, any known-broken
   path marked "confirm, do not re-file", and personas. Add the instruction that shapes the session:
   drive the agent like its real user would, not like a form.
2. **Gather context before the run.** The gather skill turns the ticket or the acceptance criteria
   into a context file the session reads. If the ticket has no criteria, write them now and say so.
3. **Write the charter.** One target, one risk, 45 minutes. Name the invariants you will probe
   (opt-out from every state; no value spoken that is not in the data; compliance copy verbatim).
4. **Run the session with the skill,** driving a real browser [S206]. One probe per node; never
   batch adversarial probes, because context pollution shifts results. Capture evidence for every
   claim, including passes: a verbatim quote, an id, a turn or timestamp, a snapshot.
5. **Grade with the rubric, not a feeling.** Intent landed; accuracy, where any hallucination
   fails; boundaries held; tone; efficiency; would a struggling user feel helped. Classify
   compliance copy as verbatim (byte-exact or the highest severity) and everything else as
   substantive (wording drift goes to content owners).
6. **Apply the run-N rule.** Verbatim-critical paths at least twice, diffed. A behaviour seen once
   in five runs is cold-start noise to reproduce, not a bug to file.
7. **Verify side effects.** A claimed side effect (a task created, a scheduler run, a transfer, a
   suppression) is checked in the store, not assumed from the transcript.
8. **File one bug per report** with severity "when in doubt go lower". Before filing, check the
   index of bugs already reproduced and the seven-shape catalogue: a repeat finding gets its shape
   and fix recipe, not a new investigation.
9. **Feed the session back.** False positives go to the learned-patterns file through the feedback
   skill. New oracles and new failure shapes go to the knowledge base. Test data that worked goes
   to the target.
10. **Update the rolling learnings file**: findings open and resolved, notable passes kept as
    regression oracles, test data that carries forward, oracles and oracle gaps (what the dashboard
    cannot tell you), rules learned, next-session priorities. When the engagement ends, this file
    is the handover.
11. **Turn a reproduced bug into a regression check** where it deserves one, by hand or through
    the Playwright agents handoff [S207].

Session folder template:

```
output/sessions/YYYY-MM-DD-<target>-<slug>/
  charter.md           one risk, one target, 45 minutes, the invariants
  session-log.md       what was done, in order, with timestamps
  session-report.md    findings ranked, passes with evidence, coverage against the charter
  bugs/bug-01.md       one per bug: steps, expected, actual, evidence, severity, shape if known
  evidence/            snapshots, console logs, payloads, an EVIDENCE-INDEX.md
  probes/              any script written for this session, with its stated limits
  JIRA-COMMENT.md      the paste-ready summary for the ticket
```

## Done when
The target file, the knowledge base and the learned-patterns file are each richer than before the
session; every finding has evidence an engineer can reproduce without a call; the learnings file
has a next-session section; and no bug was filed that the index already held.

## Related
Practices: [exploratory-testing-of-agents](../practices/4-agents-and-systems/exploratory-testing-of-agents.md),
[human-annotation](../practices/3-judging/human-annotation.md),
[regulated-domain-checks](../practices/5-safety-and-security/regulated-domain-checks.md).
The skills themselves: [S205].
Playbook: [16 Add a decision model to a testing workflow](16-add-a-decision-model-to-a-testing-workflow.md),
for a cheaper model proposed in front of the verification of findings.
