# Learning path: breaking into AI testing

Most learning paths for AI engineers teach you to build the agent. This one teaches you to build
the agent and then prove it works, because a tester who cannot read the harness cannot test it,
and an engineer who cannot evaluate the agent has not finished it.

The six phases follow the order a builder learns in. Each phase file has the same shape: what you
learn to build, what a tester takes from it, a table of line items (know, do, prove), a worked
example, exercises, the practices to read next, and the resources.

| Phase | File | You can build | You can prove |
|---|---|---|---|
| 0 | [Foundations](0-foundations.md) | a prompt with structured output and a tool call | why two runs differ, and what to pin |
| 1 | [Harness, loop, graph](1-harness-loop-graph.md) | an agent loop with a bounded tool set | where an assertion can live in a loop |
| 2 | [Build a harness](2-build-a-harness.md) | a harness on an agent SDK that runs for hours | a harness instrumented for replay and tests |
| 3 | [Context, memory, orchestration](3-context-memory-orchestration.md) | a long-horizon agent with context management and a simulated user | context-window and memory failure modes, and the noise a simulator adds |
| 4 | [Production and inference](4-production-and-inference.md) | a deployed agent with latency and cost budgets | what a load test proves about an LLM app |
| 5 | [Evals and testing](5-evals-and-testing.md) | an evaluation suite that gates a release | the reference, read in order |

The [how-to playbooks](../how-to/README.md) are the procedures: do them in order as you go through phases 3 to 5. The [knowledge matrix](knowledge-matrix.md) is the line-item view across all eight taxonomy areas:
concept, worked example, how a tester tests it, tool, practice. [Resources](resources.md) lists
every video, talk and document with its phase and its testing counterpart.

## How to use it

- If you build agents and want evals: read phases 0 and 5, then the practices your phase 5
  reading points at.
- If you test software and want to move into AI: read all six in order. Do the exercises. Each
  phase ends with something you can show.
- If you interview people for AI quality roles: the matrix is a question bank.

## The build project

The hands-on vehicle for this path is a multimodal build (a detector, an embedding index and a
language layer taken to a production shape with evals, guardrails and QA at each step). It is
planned separately; each phase names the exercise that will map onto it.
