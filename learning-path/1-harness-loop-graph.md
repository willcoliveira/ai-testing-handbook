# Phase 1: Harness, loop, graph

Outcome: you can draw an agent as a loop inside a harness, and point at where a test can attach.

## What you learn to build
An agent loop: the model proposes an action, the harness executes it, the result returns to the
model, until a stop condition. Then a graph: named states and transitions instead of one loop, so
behaviour can be constrained per state.

## What a tester takes from it
The loop and the graph are code. Every edge is a place to assert. The four videos in this phase
use the words harness, loop and graph slightly differently; what matters is the split between what
the model decides and what the harness enforces.

## Line items

| Item | Know | Do | Prove it |
|---|---|---|---|
| The harness | the code that owns the model call, the tools, the stop condition, the budget | write a loop with a max-turn budget | show the loop stop when the budget is hit |
| Tool contracts | each tool has typed arguments and a typed result | add argument validation | send a malformed argument and show it rejected before the tool runs |
| Trajectories | the sequence of tool calls is observable and often deterministic in shape | log the trajectory per run | assert the sequence, not the prose |
| State as a graph | states constrain which tools and prompts are available | move the loop into two states with an explicit transition | show a tool being refused in the wrong state |
| Terminal versus hold states | some states end the conversation; some only pause it | add a handoff state | send a stop command from every state and assert it works |
| Replay | a stored trajectory can be replayed without the model | record one run; replay it with the model stubbed | run the replay in a unit test |

## Worked example
A survey agent with states ask, confirm, escalate. In confirm, only two tools are available. In
escalate, the loop ends and a handoff record is written. The test sends the opt-out keyword in
each of the three states and asserts the same outcome each time. A handoff state that is a pause and not an end is a common place for an
opt-out to fail, so it is worth a test of its own.

## Exercises
1. Build the loop with a budget and a stop condition. Test both.
2. Add two states. Write one test per transition.
3. Record a trajectory and replay it with a stub. Put the replay in CI.

## Read next
[agent-evals](../practices/4-agents-and-systems/agent-evals.md),
[harnesses](../practices/4-agents-and-systems/harnesses.md),
[regulated-domain-checks](../practices/5-safety-and-security/regulated-domain-checks.md).

## Resources
[S171] harness engineering in 14 minutes; [S172] harness, loop, graph; [S173] graph engineering;
[S174] loop and graph engineering. Watch [S172] first; it draws the split the others assume.
