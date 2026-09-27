---
id: offline-probes
title: Offline probes
area: 2-application-evals
status: draft
last_reviewed: 2026-09-26
sources: [S031, S032, S033, S034, S036, S038, S040, S042, S045]
related: [tool-use-evals, ci-gates-for-llm-apps, criteria-authoring, regulated-domain-checks, mutation-checking]
---

# Offline probes

## What
An offline probe is a test that drives the code around the model, such as configuration loaders, prompt
assembly, tool schemas, option tables, state machines and post-processors, against the real configuration
the product ships with, and asserts on what reaches the model or what leaves the system, without a model call
or with the model stubbed. It differs from a unit test with mocks in one respect: the fixtures are the real
data, because that is where the defects are. It differs from an eval in another: no grader judges a model
output, so the result is deterministic and can gate every pull request.

## Why
A large share of what an LLM app gets wrong is decided before the model sees the prompt. Anthropic's account
of implementing MMLU is the cleanest evidence that assembly matters: a change of answer labels from "(A)" to
"(1)" moved accuracy by about 5 percent [S038]. Anthropic's agent guidance asks builders to "Carefully craft
your agent-computer interface (ACI) through thorough tool documentation and testing" and to give agents
"ground truth" from the environment at each step [S040]. OpenAI's per-architecture list includes "Data
precision: Evaluations that verify the agent calls the tool with the correct arguments" [S033], which is
checkable without a model once the arguments are captured. Probes replace two weaker things: a mock-heavy
unit test that passes on fixtures nobody maintains, and a live-call eval that is too slow and too noisy to
run on every change.

The trade-off is scope. A probe proves the inputs and the plumbing; it says nothing about what the model
will do with a correct prompt. It is the first gate, not the only one.

## How
1. **Enumerate the real configuration space.** List every axis the product varies on (region, plan, option,
   locale, tenant) and generate the cross product from the shipped config files, not from a hand-written
   sample. Anthropic's edge-case list is the checklist for what to add on top: "Irrelevant or nonexistent
   input data", "Overly long input data or user input", ambiguous inputs [S031].
2. **Drive the real functions, no mocks.** Call the production runner or assembler with each configuration
   and capture the artefact that would be sent: the prompt, the tool definition, the option list, the state
   after a transition. Anthropic's code-based grader types are the assertion vocabulary: "string matching,
   static analysis, outcome verification" [S032].
3. **Derive acceptance criteria when the ticket has none.** Write one criterion per invariant that the
   artefact must satisfy, in the style of a binary check (see [criteria-authoring](criteria-authoring.md)).
   Hamel's FAQ for code-based evals: include pass and fail examples "for every condition and edge case"
   [S042].
4. **Assert on structure and on content.** promptfoo's deterministic assertions are the menu: `equals`,
   `contains`, `regex`, `is-json`, `javascript`, `python` [S045]; OpenAI's `string_check` and `python` graders
   cover the same ground in that stack [S034]. Typical invariants: no placeholder text survives into the
   prompt; every option has a human-readable label; every referenced tool exists in the schema; the compliance
   copy is present verbatim where required.
5. **Treat an instruction to the model as a hint, not a control.** If the config contains an empty label and
   the prompt says "do not invent names", the model will still fill the gap. The probe's job is to make the
   gap impossible upstream. Hamel's Rechat tests include the same category: "generic assertions like the one to
   verify UUIDs are not in the response" [S036].
6. **Stub the model for the smoke path.** A stub that returns a fixed answer per turn lets the probe check
   that the surrounding code persists, routes and formats every answer. This is Hamel's Level 1, which runs on
   every code change and "you don't necessarily need a 100% pass rate" applies only to the model-graded tiers,
   not to this one [S036].
7. **Confirm with a small number of live calls.** After a fix, a handful of real calls checks that the
   upstream change removed the behaviour; the count is small because the effect is large, in line with
   Anthropic's note that early on "small sample sizes suffice" [S032].
8. **Wire it as the first gate.** Probes are deterministic, so they can run on every pull request without
   trials or thresholds. See [ci-gates-for-llm-apps](ci-gates-for-llm-apps.md).

| Probe target | Invariant | Assertion type | Source |
|---|---|---|---|
| Option or plan tables | no placeholder or empty label reaches the prompt | regex, contains | [S045] |
| Prompt assembly | answer labels and format are exactly as designed | equals | [S038] |
| Tool schemas | every tool the prompt names exists with the expected arguments | is-json, python | [S033], [S034] |
| Post-processing | no internal ids leak into user text | regex | [S036] |
| State machine | each transition persists the answer it collected | python | [S040] |

## Who does it (sourced)
- **Anthropic, 2023-10-04:** says a formatting change in MMLU answer options moved accuracy by about 5
  percent, and that implementing one bias evaluation took an engineer a full week [S038].
- **Anthropic, 2024-12-19:** says to test the agent-computer interface with the same care as the prompt and to
  have agents read "ground truth" from tool results at each step [S040].
- **Anthropic, 2026-01-09:** lists code-based graders (string matching, static analysis, outcome verification)
  as one of its three grader families [S032].
- **OpenAI, living docs (checked 2026-09-26):** lists tool selection and data precision as agent evals and
  names executable evals among metric-based methods [S033]; its grader API includes `string_check` and
  `python` graders with a 2-minute limit [S034].
- **Hamel Husain on Rechat, 2024-03-29:** says Level 1 tests were pytest-style assertions, including generic
  ones such as no UUIDs in the response, run on every code change [S036].
- **promptfoo, docs dated 2026-09-26:** documents deterministic assertions that need no model [S045].

## Pitfalls
1. **Mocking the configuration.** A fixture that is not the shipped file tests the fixture; the MMLU result
   shows how small an input change can matter [S038].
2. **Relying on a prompt instruction as a constraint.** The model fills gaps regardless; remove the gap in
   the data [S040], [S036].
3. **Sampling the space instead of enumerating it.** Failures cluster in specific cells of the config grid;
   a random sample misses them. Enumerate, then add edge cases [S031].
4. **Skipping the live confirmation.** A probe proves the input; a few real calls prove the effect [S032].
5. **No acceptance criteria written down.** Without them the probe has nothing to assert; derive them per
   condition and edge case [S042].

## Pattern from a production build
None yet.

## Sources
- [S031] Create strong empirical evaluations, Anthropic Claude Platform docs, living (checked 2026-09-26).
- [S032] Demystifying evals for AI agents, Anthropic engineering, 2026-01-09.
- [S033] Evaluation best practices, OpenAI developer docs, living (checked 2026-09-26).
- [S034] Graders, OpenAI developer docs, living (checked 2026-09-26).
- [S036] Your AI product needs evals, Hamel Husain, 2024-03-29.
- [S038] Challenges in evaluating AI systems, Anthropic, 2023-10-04.
- [S040] Building effective agents, Anthropic engineering, 2024-12-19.
- [S042] Frequently asked questions (and answers) about AI evals, Hamel Husain, living (checked 2026-09-26).
- [S045] Assertions and metrics, promptfoo docs, living (checked 2026-09-26).
