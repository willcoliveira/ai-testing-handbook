---
id: autonomous-qa-agents
title: Autonomous QA agents
area: 8-governance
status: draft
last_reviewed: 2026-09-28
sources: [S158, S160, S161, S163, S164, S166, S167, S168, S169, S282]
related: [human-in-the-loop, ai-generated-tests, agent-evals, prompt-injection, guardrails, standards-and-regulation]
---

# Autonomous QA agents

## What
An autonomous QA agent is a model-driven process that runs without a person at the keyboard. It reads a repository or a product, decides what to test, writes or runs tests, and opens changes. A charter is the document that says what the agent may do, how much of it, where it may never go, how it is watched, and how it is stopped. Without a charter the agent is an unbounded change generator with commit rights.

## Why
Agents get more access than the task needs. OWASP lists LLM06:2025 Excessive Agency, where "An LLM-based system is often granted a degree of agency" beyond the function it serves [S163]. Anthropic recommends agents only for "open-ended problems where it's difficult or impossible to predict the required number of steps", with "some level of trust in its decision-making", and only after "extensive testing in sandboxed environments, along with the appropriate guardrails" [S166]. The trade-off is that caps make the agent less useful on a good day and bound the damage on a bad one. The charter is where the number gets chosen and written down.

## How
A charter has ten parts. Write all ten before the first run.
1. Purpose, one sentence. "Propose tests that raise branch coverage on the service layer."
2. Outputs allowed. Draft pull requests only. No direct pushes, no merges, no approving comments.
3. Volume cap. A number of proposals per day that a reviewer can read in full. The pattern below used five.
4. No-go layers. The test framework's own code, CI workflow files, and security-sensitive code: authentication, payments, secrets, migrations, infrastructure. Enforce with path-scoped deny rules [S167] and code-owner review [S168], not with prompt text.
5. Permissions. Read-only by default. Write only to a branch prefix. Network only to an allowlist; a deny rule on `curl` "isn't a security boundary around the program", so pair it with the sandbox network allowlist [S167].
6. Model choice. The least capable model that does the job well. Cheaper, faster, and less able to surprise.
7. Phase gates. Phase 0, shadow: the agent proposes into a log and nothing is opened. Phase 1: draft pull requests against one module. Phase 2: wider scope. Each phase has a written exit criterion, for example a count of accepted proposals and zero no-go touches.
8. Kill switch. One owner, one action: a deny rule for the whole tool, a disabled workflow, a revoked token. Test it before phase 1 and again after any change to the agent.
9. Escalation. Anything the agent finds that touches a no-go path becomes a ticket for elevated human review. The agent never patches it.
10. Records. Every action goes to a trace with the prompt, the diff and the model version, kept for audit. Incidents are written up and reported without delay, mirroring Commitment 9 of the EU code [S161]. The charter is reviewed monthly against the metrics in [S169].

| Question | Workflow | Agent |
|---|---|---|
| Are the steps known in advance? | yes: use a fixed pipeline | no: the model decides the steps [S166] |
| Can a mistake be reversed cheaply? | either | required, or a human gate is in front of the action |
| Is the target a no-go layer? | a human does it | the agent escalates and stops |

## Who does it (sourced)
- **Anthropic, December 2024:** "You should consider adding complexity only when it demonstrably improves outcomes"; agents suit open-ended problems and need "some level of trust"; "We recommend extensive testing in sandboxed environments, along with the appropriate guardrails" [S166].
- **OpenAI, Model Spec version 2026-08-18:** "The assistant must adhere strictly to the agreed scope (subject to the chain of command) unless explicitly updated and approved by the original user or developer"; "When planning to take irreversible actions, the assistant should attempt to mitigate issues that might occur if its plan fails or the system is abruptly shut down" [S158].
- **Anthropic, Claude Code docs, living (checked 2026-09-26):** a deny rule with a bare tool name "removes the tool from Claude's context entirely"; `permissions.disableBypassPermissionsMode` and `permissions.disableAutoMode` can be fixed in managed settings; `Read(./.env)` and `Read(./secrets/**)` deny rules also block edits to those paths [S167].
- **Anthropic, February 2026 (system card):** the lab says it evaluates "Overly agentic behavior in GUI computer use settings" (section 4.3.3), "Prompt injection risk within agentic systems" (section 5.2), and "Malicious use of Claude Code" (section 5.1.2); an Opus 4.5-based monitor reviewed "approximately 10% of actions by the model in Claude Code" during internal pilot use [S164].
- **OWASP, 2025 list (living, checked 2026-09-26):** LLM01:2025 Prompt Injection and LLM06:2025 Excessive Agency are the two entries that describe an autonomous agent's failure modes directly [S163].
- **NIST, July 2024:** suggested action MP-5.1-005, "Conduct adversarial role-playing exercises, GAI red-teaming, or chaos testing to identify anomalous or unforeseen failure modes"; GOVERN 3.2 asks for policies that "define and differentiate roles and responsibilities for human-AI configurations" [S160].
- **EU AI Office, July 2025:** for systemic-risk models, a Safety and Security Framework must include "systemic risk acceptance criteria" and responsibility allocation (Measure 1.1) and be reassessed every 12 months (Measure 1.3); the same shape, at a smaller scale, is a charter [S161].
- **metacto (practitioner), July 2026:** the red lane (auth, payments, PII, migrations, infrastructure, public APIs) is "AI may draft only" [S169].
- **OWASP GenAI Security Project, 2026-09:** the Agent Control Standard asks for agents that are inspectable, traceable and instrumentable across enterprise environments [S282].

## Pitfalls
1. Charter in the prompt only. The agent will read it and then be told otherwise by a web page or a fixture. Enforce no-go layers with deny rules and code owners [S167] [S168].
2. No volume cap. Reviewers drown, review load rises, and the human gate becomes a rubber stamp; track review load per reviewer [S169].
3. The agent can edit CI or the framework. Then it can turn off its own checks; "No weakening gates" is a human-owned check [S169].
4. Prompt injection through the thing under test. A test fixture, a README or a page the agent browses can carry instructions; labs test this surface in their own products (section 5.2) [S164] and OWASP ranks it first [S163].
5. Kill switch never tested. The first time it is needed is the wrong time to find the token was rotated. See [governance-agents-propose-humans-merge](../../patterns/governance-agents-propose-humans-merge.md).
6. Phase gates with no exit criteria. The pilot becomes production by default. Add scope "only when it demonstrably improves outcomes" [S166].

## Pattern from a production build
On a payments-heavy checkout platform a charter-governed coverage agent was designed to open draft pull requests only, at most five a day, and was forbidden from touching framework layers, CI workflows and security-sensitive code; it was phase-gated with a kill switch. Org standards said to use the least capable model that does the job well and that there is no such thing as a temporary secret in code. See [governance-agents-propose-humans-merge](../../patterns/governance-agents-propose-humans-merge.md).

## Sources
- [S158] OpenAI Model Spec, OpenAI, living (version 2026-08-18).
- [S160] AI RMF: Generative AI Profile (NIST AI 600-1), NIST, July 2024.
- [S161] General-Purpose AI Code of Practice, EU AI Office, 10 July 2025.
- [S163] OWASP Top 10 for LLM Applications 2025, OWASP GenAI Security Project, living.
- [S164] Claude Sonnet 4.6 System Card, Anthropic, 17 February 2026.
- [S166] Building effective agents, Anthropic, 19 December 2024.
- [S167] Configure permissions, Claude Code docs, Anthropic, living.
- [S168] About protected branches, GitHub Docs, living.
- [S169] Establishing code review standards for AI-generated code, metacto, 8 July 2026.
- [S282] Agent Control Standard (ACS), OWASP GenAI Security Project, 2026-09-01
