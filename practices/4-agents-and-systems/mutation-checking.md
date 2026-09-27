---
id: mutation-checking
title: Mutation checking
area: 4-agents-and-systems
status: draft
last_reviewed: 2026-09-26
sources: [S091, S092, S078]
related: [tool-use-evals, offline-probes, ai-generated-tests, ci-gates-for-llm-apps]
---

# Mutation checking

## What
Mutation checking introduces small deliberate changes to code and asks whether the existing tests notice. Stryker states the rule: "If your tests fail then the mutant is killed. If your tests passed, the mutant survived. The higher the percentage of mutants killed, the more effective your tests are" [S091]. Around a model the technique applies to the deterministic code that surrounds it: prompt assembly, per-state configuration swaps, state-machine transitions, tool dispatch, guardrail wiring, response parsing. It does not apply to the model's own output, which is not code and does not have a single correct value to mutate away from.

## Why
Coverage says a line ran. It does not say a test would fail if the line changed, and Stryker's docs make that point directly: "code coverage doesn't tell you everything about the effectiveness of your tests" [S091]. LLM-adjacent code is prone to tests that assert shape rather than value, because the interesting value came from a model and was stubbed. A mutation run exposes those tests in minutes. The trade-off: a full run is slow on a large codebase, and some survivors are equivalent mutants or unreachable branches rather than test gaps, so every survivor needs a human reading before it becomes a task.

## How
1. Pick the targets by risk, not by size: the code that chooses a prompt or configuration per state, the code that validates and dispatches a tool call, the code that decides whether a guardrail runs. A wrong branch there is a wrong action in production.
2. Choose the tool by language. StrykerJS for JavaScript and TypeScript, with Stryker.NET and Stryker4s for C# and Scala [S091]; mutmut for Python [S092]. For a small target, six hand-written mutations can be faster than configuring either.
3. Run once, then read every survivor and classify it: a missing assertion (fix the test), an unreachable branch (fix the code or rename the test so it stops overstating its guard), or an equivalent mutant (mark it and move on). mutmut lets you apply a mutant on disk "with a simple command" to look at it in place [S092].
4. Write the classification down next to the score. A score of five killed out of six with the sixth explained is worth more than a score of six out of six nobody checked.
5. Keep runs incremental. mutmut caches results and detects dependency changes [S092]; run the full set on a schedule and the touched files per pull request.
6. Filter what cannot be tested. mutmut integrates with coverage.py for line-level filtering and with type checkers such as mypy so that mutants a type checker would reject are skipped [S092].
7. Do not mutate the prompt text and expect a deterministic kill. A test that stubs the model cannot see a prompt change; a test that calls the model cannot be gated on one run.

| Component around the model | Example mutation | A good test notices because |
|---|---|---|
| per-state configuration swap | swap two states' configurations | it asserts which value was chosen, not that a value exists |
| tool dispatch | drop an argument validation | it sends a bad call and expects a rejection |
| guardrail wiring | skip the guardrail on one path | it asserts the guardrail ran on every path |
| response parsing | flip a comparison operator | it covers the boundary value |

| Survivor means | Action |
|---|---|
| the test never checked the value | add the assertion |
| the branch cannot be reached | remove the branch or rename the test honestly |
| the mutant is behaviourally identical | record it as equivalent |
| the change is in text the model reads | out of scope for mutation; needs an eval |

## Who does it (sourced)
- **Stryker team, StrykerJS v10.0.0, 2026-08:** mutation testing for JavaScript and TypeScript, C# and Scala under Apache 2.0, defining killed and survived mutants and mutating only source code to avoid false positives [S091].
- **Stryker team, FOSDEM 2024:** the docs reference the talk "Who's testing the tests? Mutation testing with StrykerJS" as the introduction to the practice [S091].
- **mutmut, 3.8.0, 2026-09:** Python mutation testing with killed and survived states, incremental caching, parallel execution with an interactive terminal UI, coverage.py and type-checker filtering, and a requirement for fork support: "if you want to run on windows, you must run inside WSL" [S092].
- **Sierra Research, tau2-bench, 2026-07:** an example of the same idea applied to a grader rather than to tests: the v1.0.1 changelog records that a prudent extra read call zeroed the reward, a defect found by inspecting what the grader was and was not sensitive to [S078].

## Pitfalls
1. Reading every survivor as a test gap. A mutation can survive because the branch is unreachable, in which case the finding is that a test's name overstates its guard, not that an assertion is missing.
2. Mutating prompt text. The model, not the test, reads it; a stubbed test cannot see the change, and a live test is not deterministic enough to gate.
3. Full mutation runs on every pull request. Use incremental mode and a scheduled full run [S092].
4. Chasing a score. Stryker's own framing is effectiveness, not a target number [S091]; a 100 percent score on a badly chosen target proves nothing about the risky code.
5. Running mutmut where fork is unavailable. On Windows it needs WSL [S092].

## Pattern from a production build
None yet.

## Sources
- [S091] Stryker mutator documentation, Stryker team, living (StrykerJS v10.0.0, 2026-08-14).
- [S092] mutmut documentation, mutmut, living (3.8.0, 2026-09-12).
- [S078] tau2-bench repository and changelog, Sierra Research, living (v1.0.1, 2026-07).
