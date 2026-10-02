---
id: human-in-the-loop
title: Human in the loop
area: 8-governance
status: draft
last_reviewed: 2026-09-26
sources: [S158, S160, S161, S166, S167, S168, S169, S170]
related: [autonomous-qa-agents, ai-generated-tests, ci-gates-for-llm-apps, agent-evals, standards-and-regulation]
---

# Human in the loop

## What
Human in the loop is the rule that a person, not a model, takes the decisions that change production, money, data or access. The model reads, drafts, classifies and proposes. A named human approves, merges or ships. In practice the loop is a small set of gates, each placed where a mistake would be expensive or hard to reverse, and each enforced by a mechanism the model cannot argue with.

## Why
Models produce plausible changes quickly and are poor at knowing when they are wrong. Anthropic's own guidance on coding agents says automated tests verify functionality but "human review remains crucial for ensuring solutions align with broader system requirements" [S166]. OpenAI's Model Spec asks the assistant to "act as if side effects will manifest in reality unless explicitly instructed otherwise", and to "notify the user and seek approval" when a task cannot be completed within its agreed scope [S158]. The trade-off is reviewer time. Gate everything and reviewers stop reading; gate nothing and the first bad merge is on you. The practice is to gate by risk, not by volume.

## How
1. Draw the boundary. List the actions that never happen without a person: merge to a protected branch, deploy, change authentication, payments, migrations or infrastructure, spend money, message a customer, delete data.
2. Put each gate in a mechanism, not a prompt. Branch protection can require approving reviews, code-owner review, dismissal of stale approvals and passing status checks [S168]. Agent tooling can enforce deny, ask and allow rules; "Permission rules are enforced by Claude Code, not by the model" [S167].
3. Sort changes into lanes. Green (internal UI, docs, tests, fixtures): standard review. Yellow (business logic, integrations, jobs): senior sign-off when the logic is subtle. Red (auth, payments, PII, migrations, infrastructure, public APIs): "AI may draft only" [S169].
4. Design the checkpoint as an artefact. Agents "can then pause for human feedback at checkpoints or when encountering blockers" [S166]. Make the checkpoint a draft pull request, a proposal file or a ticket, never a live change.
5. Record what the human verified. Ask the author for "Checks I personally verified"; "If the answer is 'the assistant said it was correct,' the PR is not ready" [S169].
6. Keep pass/fail deterministic. "Test execution and release decisions demand consistency, repeatability, and explainability" [S170]. The model proposes, a deterministic pipeline decides pass or fail, a human decides ship.
7. Review the gates on a cadence. Track the share of AI-assisted PRs, review load per reviewer, CI failure rate after first review, escaped defects and policy exceptions [S169].

| Action | Who decides | Mechanism |
|---|---|---|
| Suggest a test, a fix, a label | model | inline, no gate |
| Open a change | model | draft pull request only |
| Merge | a human with write access | required review, code owners, stale-approval dismissal [S168] |
| Run a command that mutates state | a human | ask rule, or deny rule [S167] |
| Touch auth, payments, PII, migrations, infra | a human, with senior approval and security review | red lane [S169] |
| Ship | a human | release decision outside the model [S170] |

## Who does it (sourced)
- **Anthropic, December 2024:** in Building effective agents they say agents "can then pause for human feedback at checkpoints or when encountering blockers", recommend "extensive testing in sandboxed environments, along with the appropriate guardrails", and for coding agents that "human review remains crucial" [S166].
- **OpenAI, Model Spec version 2026-08-18:** "Autonomy must be bounded by a clear, mutually understood scope of autonomy shared between the assistant and the user"; the assistant "must adhere strictly to the agreed scope (subject to the chain of command) unless explicitly updated and approved by the original user or developer"; and it "should act as if side effects will manifest in reality unless explicitly instructed otherwise, even if likely operating within simulations, training, or evaluation contexts" [S158].
- **Anthropic, Claude Code docs, living (checked 2026-09-26):** rules are evaluated "deny, then ask, then allow"; "An allow rule can't carve an exception out of a deny rule"; bypassPermissions mode is for "isolated environments like containers or VMs where Claude Code can't cause damage" and managed settings can disable it [S167].
- **GitHub, docs, living (checked 2026-09-26):** protected branches can require that "all pull requests receive a specific number of approving reviews before someone merges", reviews from code owners, dismissal of stale approvals when new commits change the diff, and that "the most recent reviewable push must be approved by someone other than the person who pushed it" [S168].
- **NIST, July 2024:** the Generative AI Profile's suggested action GV-3.2-002 asks organisations to define roles for "Test and evaluation, validation, and red-teaming of GAI systems", and GV-1.2-002 asks for policies that evaluate risk-relevant capabilities and the strength of safety measures "both prior to deployment and on an ongoing basis, through internal and external evaluations" [S160].
- **EU AI Office, July 2025:** the General-Purpose AI Code of Practice, Measure 4.2, says a provider proceeds only if systemic risk is acceptable, otherwise mitigates or does "not make the model available on the market"; Commitment 8 requires clear allocation of responsibility across organisational levels [S161].
- **metacto (practitioner), July 2026:** a review checklist that keeps final approval of red-lane changes, dependency approval and waiving of CI, security or test requirements as human-only, and requires the author to state what they verified after generation [S169].
- **Applitools (practitioner), August 2026:** LLMs "excel at tasks that tolerate variation: generating test ideas, creating data, summarizing results", while "test execution and release decisions demand consistency, repeatability, and explainability" [S170].

## Pitfalls
1. Gating in the prompt. A line in CLAUDE.md saying "never push to main" is advice. "Permission rules are enforced by Claude Code, not by the model" [S167]. Put the rule in branch protection or a deny rule.
2. Approval fatigue. When every file edit asks, reviewers stop reading. Gate by lane [S169] and let read-only work run without prompts [S167].
3. Stale approvals. A review given before the agent pushed another commit is not a review of the merged diff. Turn on dismissal of stale approvals [S168].
4. Self-approval loops. An agent that opens and approves its own change has no human in the loop. Require the latest push to be approved by someone other than the pusher [S168].
5. Treating the sandbox as harmless. The Model Spec asks the model to behave as if side effects are real even in evaluation contexts [S158]; stub the side effects and test in sandboxes [S166].
6. The human as rubber stamp. The reviewer must be able to name what they checked; "the assistant said it was correct" is not verification [S169].

## Pattern from a production build
On a platform with payment features the org's rule was "agents propose, humans merge": AI scaffolds, suggests and classifies but does not merge, and AI-generated tests are marked for SDET review rather than treated as validated. An upstream-change-checking agent escalates anything touching authentication, payments, migrations or infrastructure for elevated human review rather than patching it silently. See [governance-agents-propose-humans-merge](../../patterns/governance-agents-propose-humans-merge.md).

## Sources
- [S158] OpenAI Model Spec, OpenAI, living (version 2026-08-18).
- [S160] AI RMF: Generative AI Profile (NIST AI 600-1), NIST, July 2024.
- [S161] General-Purpose AI Code of Practice, EU AI Office, 10 July 2025.
- [S166] Building effective agents, Anthropic, 19 December 2024.
- [S167] Configure permissions, Claude Code docs, Anthropic, living.
- [S168] About protected branches, GitHub Docs, living.
- [S169] Establishing code review standards for AI-generated code, metacto, 8 July 2026.
- [S170] AI testing in 2026: why signal, trust and intentional choices matter, Applitools, 20 August 2026.
