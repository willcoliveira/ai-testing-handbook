---
id: debug-a-multi-agent-orchestration
title: Debug a multi-agent orchestration
sources: [S136, S322, S323, S324, S325, S326, S327, S332, S333, S334]
last_reviewed: 2026-09-30
---

# Debug a multi-agent orchestration

## When
An orchestrator hands work to subagents and the final answer is wrong, late or expensive, and
nobody can say which subagent caused it. Or you are designing one and want to be able to answer
"what is subagent 3 doing right now, and what did it see" before it fails in production. Or an
interviewer asks how you would get the status and the context of one subagent.

## What
A system where every subagent run is addressable: one trace per request with a span per agent,
tool and model call; a stable id per subagent that leads to its full transcript; progress events
and hard budgets so a stuck subagent fails fast with a reason; a typed result contract at each
handoff; checkpoints that let you replay one subagent from the step that failed; and component
level evals that score each subagent, not only the final answer.

## Why
Multi-agent systems are harder to debug than one agent. Anthropic's research system notes that
agents "make dynamic decisions and are non-deterministic between runs, even with identical
prompts. This makes debugging harder", and that "Adding full production tracing let us diagnose
why agents failed and fix issues systematically" [S322]. Isolation makes it worse: in the Claude
Agent SDK "intermediate tool calls and results stay inside the subagent; only its final message
returns to the parent" [S326]. So the orchestrator's own log shows a summary, not what went wrong.
Waiting for the end of the run to find out is the expensive option: the same post reports that
multi-agent systems use about 15 times the tokens of a chat [S322].

## How
1. **Trace with one tree per request.** The orchestrator opens the root span; each subagent is a
   child `invoke_agent` span, each model call a `chat` span and each tool call an `execute_tool`
   span [S136]. The OpenTelemetry agent conventions add `invoke_workflow` for "a coordinated
   process composed of multiple agents", reported even when nested, and `gen_ai.agent.id`,
   `gen_ai.agent.name` and `gen_ai.conversation.id` to correlate them [S323]. SDKs do the same
   under their own names: the OpenAI Agents SDK nests agent, generation, function, handoff and
   guardrail spans under a trace and links traces of one conversation with `group_id` [S324];
   LangSmith treats "a run as a span", binds runs to a trace id and groups traces with a
   `thread_id` [S327].
2. **Give every subagent an id that leads to its context.** Status is "which span is open and what
   was its last event"; context is "the full transcript of that span". The Claude Agent SDK tags
   subagent messages with `parent_tool_use_id`, returns `agentId: <id>` when a subagent completes,
   and stores subagent transcripts "in separate files" that persist independently of the main
   conversation [S326]. With the id you can open one subagent's inputs, tool calls and output
   without reading the whole run.
3. **Stream progress, do not wait for the end.** Emit an event per step (started, tool called,
   tool failed, retrying, finished) on the subagent's span so a dashboard or the orchestrator can
   see a stuck or looping subagent while it runs. OpenAI's SDK lets you add a trace processor that
   "will receive traces and spans as they are ready" [S324], which is where a live status view or
   an alert hooks in.
4. **Bound every subagent.** Cap depth, fan-out, turns and spend so a failure is fast and named.
   The Claude Agent SDK caps nesting depth (default 3), concurrent subagents (default 20) and total
   budget, and a subagent that hits `maxTurns` returns output marked partial [S326]. Anthropic sizes
   effort in the prompt: one agent with 3 to 10 tool calls for simple fact-finding, 2 to 4
   subagents with 10 to 15 calls each for comparisons [S322].
5. **Make each handoff a contract.** The brief going down and the result coming up are typed.
   Anthropic's lead agent gives each subagent "an objective, an output format, guidance on the
   tools and sources to use, and clear task boundaries", and subagents "store their work in
   external systems, then pass lightweight references back" [S322]. Validate the returned object
   at the boundary: a malformed result is then a failure you can attribute to one subagent.
6. **Checkpoint so you can replay one subagent.** LangGraph saves "a snapshot of graph state at
   each super-step, organized into threads" keyed by `thread_id`, lists the history newest first,
   and can re-run from a prior `checkpoint_id`; each subgraph has its own `checkpoint_ns` [S325].
   Replay re-executes later nodes "including any LLM calls, API requests", so point it at stubs or
   a sandbox [S325]. Anthropic built its system to "resume from where the agent was when the errors
   occurred" rather than restart [S322].
7. **Evaluate the parts, then the whole.** Score each subagent as a component: DeepEval grades
   "retrievers, tool calls, LLM generations, sub-agents" by attaching metrics to spans marked with
   `@observe` [S334]; tool correctness compares `tools_called` with `expected_tools` [S332]; task
   completion judges the whole trace [S333]. Anthropic evaluates "whether it achieved the correct
   final state" and breaks long runs into checkpoints where specific state changes should have
   happened [S322].
8. **Turn every failure into a case.** Take the failing subagent's input and context from its
   transcript, freeze it as a regression case for that subagent alone, and keep it in the suite.

Triage order for a failed run:

```
1. open the trace for the request; find the first span with an error or an unexpected output
2. that span's agent id -> its transcript: brief received, tool calls, tool results, final message
3. classify: bad brief (orchestrator) | bad tool result (tool) | bad reasoning (subagent) |
   budget hit (limits) | handoff rejected (contract)
4. replay that subagent from its last good checkpoint with the tool stubbed
5. add the frozen input as a component-level case; fix; re-run the case and the end-to-end suite
```

## Done when
One request produces one trace with a span per subagent; any subagent's transcript opens from
its id; progress events are visible during a run; depth, fan-out, turns and spend are capped and
a capped run reports why; every handoff is validated; a failed subagent can be replayed alone; and
each subagent has at least one component-level case in the suite.

## Related
Practices: [genai-tracing](../practices/6-observability/genai-tracing.md),
[agent-evals](../practices/4-agents-and-systems/agent-evals.md),
[tool-use-evals](../practices/4-agents-and-systems/tool-use-evals.md),
[orchestrators-and-simulators](../practices/4-agents-and-systems/orchestrators-and-simulators.md),
[redaction-in-telemetry](../practices/6-observability/redaction-in-telemetry.md).
Playbooks: [04 Build an evaluator](04-build-an-evaluator.md), [08 Wire the gates](08-wire-the-gates.md).
Tools: [observability](../tools/observability.md), [harnesses](../tools/harnesses.md).
