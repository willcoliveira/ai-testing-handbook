# Phase 2: Build a harness

Outcome: you have an agent running on a real SDK, for longer than one turn, with hooks a test can
use.

## What you learn to build
An agent on the Claude Agent SDK [S189] with a small tool set, permission checks, and a task that
takes many turns. Then the production cage: budgets, allow-lists, checkpoints, an audit log.

## What a tester takes from it
A harness you can test is one that exposes its decisions. Hooks before and after tool calls,
a trace per run, a way to inject a fixed model response, and a budget you can set low in tests.

## Line items

| Item | Know | Do | Prove it |
|---|---|---|---|
| SDK primitives | sessions, tools, permissions, hooks | build the agent from the workshop | run it end to end once |
| Long-running work | checkpoints, resumption, idempotent tools | add a checkpoint every N turns | kill the process mid-run and resume |
| The cage | allow-listed tools, budgets, no-go actions | add a deny rule for a destructive tool | show the deny firing in a test |
| Hooks as test points | pre- and post-tool hooks see arguments and results | log both to a trace file | assert on the trace, not the console |
| Model injection | a fixed response makes the loop deterministic | add a stub model behind a flag | run the whole suite with the stub in CI |
| Audit log | every action with who, what, when | write it as structured events | replay the log into a summary |

## Worked example
The workshop agent gets a `delete_file` tool. The cage denies it unless a human approves. The
test asserts three things: the deny fires, the approval path is logged, and the model's request
appears in the audit log with its arguments. None of the three depends on what the model said.

## Exercises
1. Build the workshop agent. Add one tool of your own with typed arguments.
2. Add a budget and a stub model. Get the suite green in CI with no network.
3. Add an audit log and write a test that reads it.

## Read next
[harnesses](../practices/4-agents-and-systems/harnesses.md),
[tool-use-evals](../practices/4-agents-and-systems/tool-use-evals.md),
[human-in-the-loop](../practices/8-governance/human-in-the-loop.md),
and the pattern [governance-agents-propose-humans-merge](../patterns/governance-agents-propose-humans-merge.md).

## Resources
[S175] the Claude Agent SDK workshop; [S176] agents that run for hours; [S177] the production cage.
