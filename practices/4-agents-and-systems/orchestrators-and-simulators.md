---
id: orchestrators-and-simulators
title: Orchestrators and simulators
area: 4-agents-and-systems
status: draft
last_reviewed: 2026-09-26
sources: [S078, S079, S072, S073, S093, S094, S095]
related: [agent-evals, voice-agent-testing, non-determinism-and-pass-rates, red-teaming, ci-gates-for-llm-apps]
---

# Orchestrators and simulators

## What
An orchestrator runs a conversation between the agent under test, a simulated user and an environment, either turn by turn or as two streams at once. tau2-bench names the two modes: a half-duplex `Orchestrator` where "Each participant takes turns sending complete messages" and a `FullDuplexOrchestrator` for "Real-time streaming" [S078]. A simulator is the model-driven party on the other side: a user with instructions and a persona, or an auditor with a hypothesis to test. Agent-to-agent testing is the same idea with two production-grade agents on a real channel, usually a phone call, where "An AI tester acts as the caller and adapts during a complete conversation" [S093].

## Why
A scripted multi-turn test breaks the moment the agent rephrases. A simulated user adapts, so one scenario can reach a path that a fixed script never would. Anthropic's post says teams use "a second LLM to simulate the user" and stress-test through "extended, adversarial conversations" [S079]. The trade-off is that you now have two probabilistic systems in the loop. The simulator's own mistakes read as agent failures, run-to-run variance multiplies, and every run costs two sets of model calls plus, for voice, telephony and speech. A simulator is good at finding; it is rarely stable enough to gate.

## How
1. Decide the job first: coverage (find paths you did not script), stress (adversarial personas), or gate (block a release). Only the third needs stability, and it is the one simulators most often fail at.
2. Give the simulator instructions, a persona and, where the domain needs it, its own tools. tau2-bench constructs `UserSimulator(llm=..., instructions=..., tools=user_tools)` and lets a domain define "a set of user tools for the user simulator" [S078].
3. Grade the outcome with a state check, not the simulated dialogue. tau2-bench scores on the database end state and on required strings, so a different but correct path through the tools still passes [S078]. Keep transcript grading for policy breaches.
4. Measure the simulator before trusting it. Run every scenario several times unchanged and record the pass-rate spread. Then change the agent's prompt in a controlled way and see which scenarios flip. A scenario that flips on an unrelated change is measuring the simulator, not the agent.
5. Set a stability gate and a cost gate before adoption. Write down the pass-rate threshold across sequential runs, the requirement to survive a controlled prompt change, and the cost per run at the intended cadence. A gate such as over 90 percent across five sequential runs, with a monthly cost estimate, is a reasonable starting point.
6. For auditing rather than regression, use an auditor agent. Petri "deploys an automated agent to test a target AI system through diverse multi-turn conversations involving simulated users and tools" and scores with LLM judges [S072]. Bloom runs "Understanding, Ideation, Rollout, Judgment" stages and can choose "whether to simulate a user" [S073]. Their output is hypotheses and transcripts, not a pass rate.
7. Cap steps and seed where you can. tau2-bench's orchestrator takes `max_steps` and `seed` [S078].

| Situation | Simulated user | Why |
|---|---|---|
| Finding paths a script would miss | helps | it adapts to the agent's wording |
| Adversarial personas, long conversations | helps | "extended, adversarial conversations" [S079] |
| Release gate on a pass rate | doubles the noise | two probabilistic systems behind one number |
| Verbatim or regulated wording | doubles the noise | the simulator's wording varies too; use a fixed case |
| Speech-layer defects on a voice channel | only with audio assertions | transcript grading cannot see them |

## Who does it (sourced)
- **Sierra Research, tau2-bench, 2026-07:** a half-duplex orchestrator with `LLMAgent` and `UserSimulator`, a full-duplex orchestrator with `VoiceStreamingUserSimulator`, and a user simulator that uses ElevenLabs voices in voice mode [S078].
- **Anthropic, 2026-01:** conversational agents are evaluated with "a second LLM to simulate the user", including "extended, adversarial conversations" [S079].
- **Anthropic, Petri, 2025-10:** an auditor agent plans and interacts "with the target model in a tool use loop"; the pilot ran 111 seed instructions across 14 models; early adopters include the UK AISI [S072].
- **Anthropic, Bloom, 2025-12:** "A judge model scores each transcript for the presence of the behavior, along with other user-defined qualities, and a meta-judge produces suite-level metrics"; conversation and simenv (tool-calling) modalities [S073].
- **Vapi, living docs:** two mechanisms, evals that check "exact matching, a pattern, or an AI judge" at known points, and simulations where an AI tester plays the caller over chat or voice; manual real calls are still recommended for background noise and accents [S093].
- **Roark, living product page:** "Hundreds of simulated callers (the angry one, the rambler, the interrupter) built from your real call types", with regression runs and CI/CD gates [S094].
- **Coval, living docs:** "Run thousands of realistic conversations" before launch, with "human reviewers whose feedback retrains the AI judge" [S095].

## Pitfalls
1. Gating on a simulator you have not measured. A simulator can leave zero scenarios reliably stable after days of tuning, and scenarios at 100 percent can regress the moment the team tunes its own prompt.
2. Asserting on the transcript when the channel was audio. Real two-channel audio was captured, but the assertions ran on the transcript, so speech-layer defects were invisible to the grader.
3. Counting simulator failures as agent failures. A simulated user that forgets its own instructions produces a failed run that says nothing about the agent [S079].
4. Ignoring cost until adoption. Two agents plus telephony per run adds up; price the intended cadence before deciding.
5. Confusing auditors with regression suites. Petri and Bloom generate scenarios and hypotheses [S072][S073]; a hypothesis is a starting point for a fixed case, not a gate.

## Pattern from a production build
None yet.

## Sources
- [S078] tau2-bench repository and orchestrator docs, Sierra Research, living (v1.0.1, 2026-07).
- [S079] Demystifying evals for AI agents, Anthropic, 2026-01-09.
- [S072] Petri: an open-source auditing tool, Anthropic, 2025-10-06.
- [S073] Bloom: automated behavioral evaluations, Anthropic, 2025-12-19.
- [S093] Voice testing, Vapi docs, living.
- [S094] Simulation testing for voice AI agents, Roark, living.
- [S095] Coval documentation, Coval, living.
