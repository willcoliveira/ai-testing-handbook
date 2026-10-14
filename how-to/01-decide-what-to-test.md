---
id: decide-what-to-test
title: Decide what to test
sources: [S031, S032, S036, S040, S440]
last_reviewed: 2026-10-14
---

# Decide what to test

## When
A new LLM feature or agent is being built; you inherit a system with a model in it; a system
you already test gets a model added; or a stakeholder asks "is the AI tested?" and nobody can
point at a map.

## What
A one-page test map: every component, whether it is deterministic, the invariant it must hold,
the oracle that can judge it, the layer that tests it, and the owner. Plus a ranked list of the
five risks you will test first, a short list of what you will not test with a model call, and, for
every P box, the non-model baseline it has to beat.

## Why
Model-shaped systems pull attention to the model, so the code around it stays untested while the
team argues about prompts. Most defects in production agents are in the deterministic parts:
routing, state, tool contracts, persistence, guardrail wiring. Anthropic's guidance starts an
evaluation programme from the task and its failure modes, not from the model [S031], and its
agent-evals note separates outcome checks from transcript checks for the same reason [S032].
Hamel Husain's field advice is the same: look at your data and name failure modes before you
buy an eval tool [S036].

## How
1. **Draw the system.** Boxes for every component a request touches, including the harness,
   tools, retrieval, guardrails, persistence and integrations. Mark each box D (deterministic)
   or P (probabilistic). A prompt template is D. The model's wording is P. A tool call's
   arguments are D once emitted.
2. **Ask whether each P box needs a model at all.** Google's first rule of ML engineering is
   "Don't be afraid to launch a product without machine learning", and it adds that if machine
   learning would give a 100% boost, a heuristic will get you "50% of the way there" [S440]. Anthropic's advice for agents is the same: add
   multi-step agentic systems "only when simpler solutions fall short" [S040]. For each P box,
   write the simplest non-model version (a rule, a lookup, a keyword match, a form) and score it
   on the same cases as the model. The model stays only where it beats the baseline by more than
   it costs. Either way you keep the baseline as a test oracle and a fallback, and the box you
   turned back into D gets cheaper tests.
3. **Write the invariants.** For each box, one line starting "must" or "must never": "opt-out
   must work in every state", "no answer may name a plan not in the caller's list", "the
   guardrail must not block self-criticism". Regulatory and money invariants first. Every tool
   that writes, pays or sends gets "must take effect once, however often it is retried"; see
   [side-effects-and-state](../practices/4-agents-and-systems/side-effects-and-state.md).
4. **Pick the oracle per box.** D boxes: assertions, contract tests, state checks, replay.
   P boxes: a rubric applied N times with a pass-rate threshold. Guardrails: binary, every build.
   State machines: invariants sent from every state. Integrations: real calls in a stubbed-model
   run. If no oracle exists, write "no oracle yet" and treat it as a risk.
5. **Rank by risk.** Score each invariant on harm if broken and likelihood, one to three each.
   The top five get a playbook assigned this week.
6. **Decide what not to test with a model.** Anything a code assertion can decide. A model
   judge costs money, drifts, and needs calibration (playbook 05); use it only where prose has
   to be judged.
7. **Name owners.** Engineers own unit and integration for D boxes. Quality owns end-to-end,
   evaluation, load and the gates. Every P box has a human who can say the oracle was wrong.
8. **Write the map** using the template and put it in the repository next to the tests.

Template:

```
| Component | D or P | Invariant | Oracle | Layer | Owner | Risk (1-9) |
|---|---|---|---|---|---|---|
| survey state machine | D | opt-out keyword works in every state | send STOP from each state, assert unenrolled | integration | team A | 9 |
| booking tool | D | one booking per confirmed request, under retry and resume | same request twice with one key; kill after the commit and resume; count rows | integration | team B | 9 |
| answer interpretation | P | picks the option the caller meant | rubric, 10 runs, 9 of 10 | evaluation | quality | 6 |
| managed guardrail | D | blocks the six filter classes, never blocks the four allow cases | binary suite | per build | quality | 8 |
| catalogue read-back | P over D data | never names an item that is not in the user's list | offline probe over every list, then a live spot check | offline + e2e | quality | 8 |
```

Not tested with a model: schema validity, tool argument types, routing, persistence, flag state.

## Done when
The map exists in the repo; every row has an oracle and an owner or is marked "no oracle yet";
the top five risks each point at a playbook; every P box has a scored baseline; the "not with a
model" list is written; an engineer
who did not write it can say which layer catches which failure.

## Related
Practices: [eval-driven-development](../practices/2-application-evals/eval-driven-development.md),
[agent-evals](../practices/4-agents-and-systems/agent-evals.md),
[offline-probes](../practices/2-application-evals/offline-probes.md),
[side-effects-and-state](../practices/4-agents-and-systems/side-effects-and-state.md).
Building effective agents [S040] for the harness-versus-model split.
