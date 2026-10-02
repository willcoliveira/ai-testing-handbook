---
id: ai-generated-tests
title: AI-generated tests
area: 8-governance
status: draft
last_reviewed: 2026-09-26
sources: [S163, S164, S166, S168, S169, S170]
related: [human-in-the-loop, autonomous-qa-agents, mutation-checking, ci-gates-for-llm-apps, golden-datasets, non-determinism-and-pass-rates]
---

# AI-generated tests

## What
An AI-generated test is any test case, fixture, assertion or eval case that a model wrote. It arrives with the syntax of a human test and none of the intent. The practice is to give every generated test a status (generated, reviewed, trusted, quarantined) and to let only trusted tests gate a merge. A generated test is validated when a person has read it against the requirement, tried to break it, and signed it into the suite.

## Why
A passing generated test proves little on its own, because the model can write an assertion that describes what the code does rather than what it should do. A 2026 practitioner checklist lists "Generated tests assert implementation details instead of behavior" as the signal that review standards are missing [S169]. LLMs suit "tasks that tolerate variation: generating test ideas, creating data, summarizing results", while "test execution and release decisions demand consistency, repeatability, and explainability" [S170]. The trade-off is SDET time. Skip the review and the suite fills with tests that pass on the bug; do the review and generation still saves the typing, not the thinking.

## How
1. Tag at birth. Every generated test carries a marker: a decorator, a directory, or a pull-request label. Its status is `generated`. It runs in CI but is non-blocking.
2. Review against the requirement, not against green. The reviewer reads the ticket's acceptance criteria first, then asks whether each assertion would fail if the feature were broken. The check is "requirement fidelity": the diff implements the acceptance criteria, "not the AI assistant's plausible interpretation" [S169].
3. Break the code. Flip a condition or drop a branch in the code under test. If the generated test still passes, it is not a test. See mutation-checking.
4. Check the failure paths. Tests should "cover malformed input, empty states, permission failures, network failures, concurrency" [S169].
5. Check for weakened gates. The change "does not skip tests, loosen lint rules, lower coverage, bypass hooks, or silence security checks" [S169]. A generated test that arrives with a lowered threshold is a red flag, not a convenience.
6. Check determinism. Run the test ten times. A test that flakes goes to `quarantined` (nightly only) rather than into the suite.
7. Graduate. After review and a mutation check, set the status to `trusted`, move the test into the gating suite, and record the reviewer. Keep the generated origin in history so the share of generated tests can be reported [S169].
8. For eval cases rather than code tests: a generated case needs a human-verified expected output before it enters a golden set, otherwise the model is grading its own homework. See golden-datasets.

| Status | Runs in CI | Blocks merge | Who promotes it |
|---|---|---|---|
| generated | yes, non-blocking | no | nobody without a review |
| reviewed | yes, non-blocking | no | an SDET, after a mutation check |
| trusted | yes | yes | the suite's maintainer |
| quarantined | nightly only | no | an SDET, after a run of clean results |

## Who does it (sourced)
- **Anthropic, December 2024:** "Test how the model uses your tools: Run many example inputs in our workbench to see what mistakes the model makes, and iterate"; and for coding agents, "whereas automated testing helps verify functionality, human review remains crucial" [S166].
- **Anthropic, February 2026 (system card, changelog 6 March 2026):** the Claude Sonnet 4.6 system card carries a section "Reward hacking in coding contexts" and reports hack rates on "Reward-hack-prone coding tasks" and "Impossible tasks", split by "Classifier hack rate" and "Hidden test hack rate"; the lab says it tests the model's tendency to game a grader rather than solve the task [S164].
- **metacto (practitioner), July 2026:** ten checks before merge, including "Failure-path tests" owned by author and reviewer and "No weakening gates" owned by the CI owner; required disclosure of "Human changes after generation" and "Checks I personally verified" [S169].
- **Applitools (practitioner), August 2026:** they say LLMs belong where variation is tolerated, and that where outcomes vary across runs "teams lose trust" [S170].
- **GitHub, docs, living (checked 2026-09-26):** required status checks "must have a successful, skipped, or neutral status before collaborators can make changes to a protected branch"; strict mode requires the branch to be up to date with the base before merging [S168].
- **OWASP, 2025 list (living, checked 2026-09-26):** LLM05:2025 Improper Output Handling names "Insufficient validation, sanitization" of model output before it is passed downstream; generated test code is model output that runs [S163].

## Pitfalls
1. Green is not validated. A generated test that passes on first run has proved only that it compiles and that the assertion matches current behaviour [S169].
2. The test asserts the bug. If the model read the implementation to write the test, the test encodes the implementation, defects included. Mutate the code before trusting the test [S169].
3. The generated change weakens the gate. Skipped tests, lowered coverage thresholds and silenced checks arrive in the same diff as the new tests [S169].
4. Flaky generated tests poison the gate. When outcomes vary across runs "teams lose trust" [S170]. Quarantine, then fix or delete.
5. Generated expected answers. An eval case whose expected output the model also wrote is circular; release decisions need results a team can explain [S170].
6. Losing the origin. Once the marker is stripped, nobody knows which tests were never read. Report the share of AI-assisted changes as a standing metric [S169].

## Pattern from a production build
On a platform with payment features, AI-generated tests were never treated as validated: each was marked for SDET review, and the rule "agents propose, humans merge" applied to test code as much as to product code. See [governance-agents-propose-humans-merge](../../patterns/governance-agents-propose-humans-merge.md).

## Sources
- [S163] OWASP Top 10 for LLM Applications 2025, OWASP GenAI Security Project, living.
- [S164] Claude Sonnet 4.6 System Card, Anthropic, 17 February 2026.
- [S166] Building effective agents, Anthropic, 19 December 2024.
- [S168] About protected branches, GitHub Docs, living.
- [S169] Establishing code review standards for AI-generated code, metacto, 8 July 2026.
- [S170] AI testing in 2026: why signal, trust and intentional choices matter, Applitools, 20 August 2026.
