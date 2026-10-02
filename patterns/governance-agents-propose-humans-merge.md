---
id: governance-agents-propose-humans-merge
title: Agents propose, humans merge
practices: [human-in-the-loop, ai-generated-tests, autonomous-qa-agents]
sources: [S210]
anonymisation: reviewed
---

# Agents propose, humans merge

## Context (anonymised)
A platform with payment features, where an SDET team owned the end-to-end and contract suites
and the deploy gates for nine services, and used Claude Code sub-agents and skills [S210] inside
the test repositories.

## What was built
- A written trust model: AI is an advisor. It scaffolds, suggests and classifies. It does not
  merge. Fabricated method names, hallucinated fixture keys and wrong-layer imports had all been
  observed, so the SDET is responsible for every line that lands.
- A no-go list for agents: the framework layers, the service clients, the flows, CI workflows, the
  container build, and security-sensitive code.
- A per-file gate for anything an agent wrote: local run ten times in the container image with
  zero flakes, then two consecutive nightly passes before a specification counts as proven.
- An organisation standard that AI-generated tests are never treated as validated and are marked
  for SDET review.
- A charter for an autonomous coverage agent, written as a decision record so its constraints are
  reviewable: draft pull requests only, at most five a day, forbidden from touching framework
  layers, phase-gated with a falsifiable exit criterion per phase and a kill switch.
- An upstream-change-checking sub-agent that reads sibling service commits, skips release chores
  to find the meaningful change, assesses impact on covered behaviour, updates specifications, and
  escalates anything touching authentication, payments, migrations or infrastructure for elevated
  human review instead of silently patching. "If you're unsure whether a change warrants a test
  update, don't guess; report the ambiguity."
- Model policy: use the least capable model that does the job well; the most capable model in
  automated pipelines needs an explicit approval.

## Numbers
Nine consuming services on the gates; five draft pull requests a day as the agent's cap; ten local
runs and two nightly passes as the proof bar.

## Decision and the trade-off accepted
A quarantine-then-graduate path for generated tests keeps the trusted suite trustworthy at the cost
of slower coverage growth. The escalation rule keeps humans on the security-sensitive path at the
cost of more review load on exactly the changes where review is most valuable.

## What I would do differently
Instrument the proposals: how many agent pull requests were merged, edited or closed, so the
trust model has a number behind it.

## Which practices this evidences
Human in the loop; AI-generated tests (validated only after review and consecutive green runs);
autonomous QA agents (caps, no-go layers, a charter).
