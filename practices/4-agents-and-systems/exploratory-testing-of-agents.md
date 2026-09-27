---
id: exploratory-testing-of-agents
title: Exploratory testing of agents
area: 4-agents-and-systems
status: draft
last_reviewed: 2026-09-26
sources: [S079, S072, S073, S090, S093, S088]
related: [agent-evals, voice-agent-testing, orchestrators-and-simulators, autonomous-qa-agents, ai-generated-tests, human-in-the-loop]
---

# Exploratory testing of agents

## What
Exploratory testing of an agent is a time-boxed session with a written charter, run by a person who designs the next probe from the last response. Increasingly the person drives an AI assistant that operates a browser or places a call, but the judgement stays with the person. Against a probabilistic system the evidence standard has to be stricter than for a deterministic one: a session log, page snapshots and console logs for every claim, one bug per report, a pass recorded with the same evidence as a fail, and a repeat run before a one-off behaviour is called a defect. The automated cousins of this practice are the auditor agents: Petri "deploys an automated agent to test a target AI system through diverse multi-turn conversations" [S072], and Bloom's Ideation stage "Generates diverse evaluation scenarios" from a behaviour description [S073].

## Why
Scripted evals find what you thought of. An agent produces behaviours nobody scripted, and some of them appear one time in five. Exploration is how those get found; it is also how graders get checked, which is why Anthropic's post recommends reading transcripts as a routine [S079]. The trade-off is that exploration finds and does not prove. A session shows that something can happen; only a repeated, fixed case shows how often. The output of a good session is a defect report with evidence and a candidate eval case, not a pass rate.

## How
1. Write the charter before the session: the surface (a chat simulator, a browser, a phone line), the behaviour under question, the oracle that decides pass or fail, and the cap. A 45-minute cap is a common choice.
2. Choose the oracle first. For a data-collecting agent the oracle is the record it wrote, read from a dashboard or a database, not the agent's own words.
3. Keep evidence for everything, including passes. A page snapshot, the console log and the session log, with timestamps. A pass without evidence is an opinion.
4. Run verbatim-critical paths twice and diff. Regulated wording, consent lines and opt-out confirmations must match across runs; a diff is the cheapest test of that.
5. Reproduce before you report. A behaviour seen once in five runs is a lead. Rerun it; if it goes away after the first run, record it as cold-start noise and move on.
6. One bug, one report, and when in doubt on severity, go lower. A report that bundles three symptoms hides the one cause.
7. Use the real channel for what the harness cannot reach: barge-in, whisper, cold handoff on a phone line. Vapi's own guidance recommends manual real calls for "background noise, accents, and production recordings" [S093].
8. Graduate findings. A confirmed defect becomes a fixed eval case; a confirmed grader miss becomes a rubric change.
9. When an assistant drives the session, keep its planner and its healer apart. Playwright's planner "explores the app and produces a Markdown test plan"; its healer repairs failing tests and re-runs "until it passes or until guardrails stop the loop" [S090]. In exploration, a test that fails is information; do not let the loop repair it away.

| Artefact | Purpose |
|---|---|
| charter | what is under question, the oracle, the cap |
| session log | every probe and every response, timestamped |
| page snapshots and console logs | evidence for each claim, pass or fail |
| diff of a repeated run | proof for verbatim-critical paths |
| defect report, one per bug | severity, steps, evidence, a candidate eval case |

## Who does it (sourced)
- **Anthropic, 2026-01:** the agent evals post recommends reading transcripts routinely and treating eval building as part of development, alongside automated graders [S079].
- **Anthropic, Petri, 2025-10:** an auditor agent explores a target through multi-turn conversations with simulated users and tools, and "Early adopters, including MATS scholars, Anthropic Fellows, and the UK AISI, are already using Petri to explore eval awareness, reward hacking, self-preservation, model character, and more" [S072].
- **Anthropic, Bloom, 2025-12:** an Understanding stage "Analyzes the target behavior and examples" and an Ideation stage generates scenarios; "Early adopters are already using Bloom to evaluate nested jailbreak vulnerabilities, test hardcoding, measure evaluation awareness, and generate sabotage traces" [S073].
- **Microsoft, Playwright test agents, docs current to 1.63, 2026-09:** planner, generator and healer agents for VS Code, Claude Code, Codex and OpenCode; the generator "verifies selectors and assertions live as it performs the scenarios" [S090].
- **Vapi, living docs:** simulations over chat or voice, with manual real calls recommended for conditions the simulator does not cover [S093].
- **Microsoft Foundry, 2026-07:** the AI red teaming agent, built on PyRIT, is "Best used with human-in-the-loop processes" [S088].

## Pitfalls
1. Reporting a one-in-five behaviour as a defect before reproducing it. Treat it as cold-start noise until it reproduces.
2. Passes without evidence. If the session log cannot show the pass, the next person reruns the session.
3. Letting a healing loop repair an exploratory failure. Playwright's healer exists to fix flaky tests, not to decide what the product should do [S090].
4. Sessions with no cap and no charter. Without them the session drifts into re-running the scripted suite by hand.
5. Several symptoms in one report. A finding with three symptoms and one cause, filed as three reports, gets triaged three times.

## Pattern from a production build
None yet.

## Sources
- [S079] Demystifying evals for AI agents, Anthropic, 2026-01-09.
- [S072] Petri: an open-source auditing tool, Anthropic, 2025-10-06.
- [S073] Bloom: automated behavioral evaluations, Anthropic, 2025-12-19.
- [S090] Playwright test agents, Microsoft, living (1.63.0, 2026-09-04).
- [S093] Voice testing, Vapi docs, living.
- [S088] Observability in Generative AI, Microsoft Foundry, 2026-07-31.
