---
id: tool-use-evals
title: Tool-use evals
area: 4-agents-and-systems
status: draft
last_reviewed: 2026-09-30
sources: [S066, S070, S077, S078, S083, S088, S089, S215, S220, S224, S229, S260, S268, S272, S319]
related: [agent-evals, offline-probes, mutation-checking, harnesses, prompt-injection]
---

# Tool-use evals

## What
A tool-use eval checks whether the model chose the right function, with the right arguments, at the right moment, and did not call one when none was needed. It sits one level below the agent eval: no environment is required, because you compare the call the model emitted with the call you expected. The Berkeley Function Calling Leaderboard grades this way, introducing "AST as an evaluation metric" in its first version, "multi-turn interactions" in v3 and "holistic agentic evaluation" in v4 [S089]. A trajectory assertion is the multi-call form: an ordered or unordered set of expected calls across a run.

## Why
Function calling is the boundary between the model and everything with side effects. A wrong argument is a wrong action, and a missing call is a job not done. Testing the boundary in isolation is cheaper and less noisy than a full agent run, and it localises the failure to one of three places: the model's choice, your dispatch code, or the sequence. The trade-off: a test that replays recorded model output through your dispatch code proves your code, not the model. A live test proves the model's choice at the cost of model calls and variance. You need both, and you need to know which one you are running.

## How
1. Split the problem in three. (a) The model's choice of tool and arguments: needs the model. (b) Your dispatch, validation and error handling: no model, replay fixtures of recorded tool calls. (c) The sequence across calls: an agent eval with a trajectory grader.
2. For (a), build a dataset of prompts with the expected call and compare structurally. Compare argument by argument: exact for identifiers and enums, schema-valid and tolerant for free text. BFCL's approach is an AST match rather than string equality [S089]. Include cases where the correct answer is to call nothing.
3. For (b), write fixture-driven tests against the code that receives a tool call: unknown tool, missing required argument, wrong type, tool error. Then mutation-check those tests (see `mutation-checking`); a test that only asserts the response shape survives most mutations.
4. For (c), write the trajectory assertion with care. tau2-bench's `ACTION` evaluator asks "For every entry in `actions`, did the agent produce a matching tool call" and its docs say to use it "only when you are confident `actions` enumerates the only acceptable trajectory" [S078]. Prefer an end-state check plus a forbidden-call check over an exact sequence.
5. Grade the arguments the agent passed, not just the tool name. LangSmith's concepts page frames the check as "correct tool selection and proper argument formatting" [S083]; Foundry's agent evaluators include "tool call accuracy" [S088].
6. Run tools with side effects in a sandbox. Inspect supports "Custom and MCP tools", built-in bash, Python and browsing tools, and sandboxing via Docker, Kubernetes, Modal, Proxmox and Vagrant [S066].
7. Keep the trace. A tool-use failure is only debuggable if the trace holds "model calls, tool calls, guardrails, and handoffs" [S077].

Argument comparison rules that hold up:
- identifiers, enums and booleans: exact match
- dates and amounts: parse, then compare the value
- free text such as queries and notes: schema-valid, plus a tolerant check such as required substrings
- optional arguments: absent and null count as the same unless the tool's schema says otherwise

| Layer | Needs the model | Grader | Where it runs |
|---|---|---|---|
| Choice of tool and arguments | yes | structural comparison, schema validation | harness, nightly |
| Dispatch and error handling | no | fixtures, unit tests, mutation check | unit tests, per PR |
| Trajectory | yes | end state plus forbidden calls; exact sequence only when unique | agent eval, nightly or manual |

## Who does it (sourced)
- **UC Berkeley, BFCL V4, 2026-04:** the leaderboard grades native function calling and prompt-based workarounds, reports cost and latency alongside accuracy, and measures format sensitivity for prompt models; overall accuracy is "the unweighted average of all the sub-categories" [S089].
- **Sierra Research, tau2-bench, 2026-07:** an `ActionEvaluator` matches expected tool calls "per `Action.compare_with_tool_call`", and the default reward deliberately does not use it because the reference actions are one path among several [S078].
- **LangChain, LangSmith, living:** agent checks on "correct tool selection and proper argument formatting or trajectory that the agent took" [S083].
- **Microsoft Foundry, 2026-07:** built-in "agent-specific metrics (tool call accuracy, task completion)" [S088].
- **Confident AI, DeepEval, 2026-09:** "agent, tool-use, conversational" metrics, with tracing of "agent steps, spans, tool calls, and component behavior" [S070].
- **UK AI Security Institute, Inspect, 2026-09:** tools as custom Python or MCP, built-in bash, Python, web search, browsing and computer tools, all runnable in sandboxes [S066].
- **DeepSeek, 2025-12:** "Tool-use benchmarks are evaluated using the standard function call format, wherein models are configured to thinking mode", with tool outputs in the tool role; tau2-Bench 80.3, MCP-Universe 45.9, MCP-Mark 38.0, Tool-Decathlon 35.2 [S215].
- **Zhipu, 2025-08:** BFCL V3 77.8 and TAU-Bench retail 79.7 and airline 60.4 with an "optimized user simulator" [S229].
- **Moonshot AI, 2025-07:** Tau2-Bench 70.6 (Avg@4) and ACEBench 76.5, with output capped at 8192 tokens [S224].
- **Alibaba Qwen, 2025-05:** BFCL v3 70.8 in thinking mode and 68.0 in non-thinking mode for the 235B-A22B flagship [S220].
- **Cohere, April 2025:** TauBench and BFCL for agentic tool use, plus mTauBench for multilingual tool use [S272].
- **NVIDIA, December 2025:** Tau-2 Bench run in a dedicated container under NeMo Evaluator SDK [S268].
- **Mistral, June 2025:** function calling scored on an "internal benchmark" [S260].
- **arXiv, 2026-09:** treating each tool's advertised interface as an executable contract confirmed seven tool defects and one evaluator property across 34 tools in four agent benchmarks, including a tau2-bench telecom case where the evaluator rewards refuelling a suspended line and fails the repaired tool [S319].

## Pitfalls
1. Exact-match on free-text arguments. A search query or a note field varies run to run; compare identifiers exactly and free text by schema or by a tolerant check [S089].
2. Grading one reference trajectory as the only trajectory. tau2-bench calls this "a strong assumption" and keeps it out of its default reward [S078].
3. Believing a fixture test proves the model will call the tool. It proves the dispatch. The model's choice needs its own dataset and its own run.
4. No "call nothing" cases. A model that always calls a tool passes every positive case and fails in production on the questions that needed no action.
5. Side-effecting tools outside a sandbox. An eval that sends the email it was testing is an incident, not a test [S066].

## Pattern from a production build
None yet.

## Sources
- [S089] Berkeley Function Calling Leaderboard, UC Berkeley, living (V4, 2026-04-12).
- [S078] tau2-bench repository and evaluation docs, Sierra Research, living (v1.0.1, 2026-07).
- [S083] LangSmith evaluation concepts, LangChain, living.
- [S088] Observability in Generative AI, Microsoft Foundry, 2026-07-31.
- [S070] DeepEval documentation, Confident AI, living (4.2.6, 2026-09-24).
- [S066] Inspect AI documentation, UK AI Security Institute, living.
- [S077] Agent evals guide, OpenAI, living.
- [S215] DeepSeek-V3.2: Pushing the Frontier of Open Large Language Models, DeepSeek-AI (arXiv 2512.02556), 2025-12-02
- [S229] GLM-4.5: Agentic, Reasoning, and Coding (ARC) Foundation Models, Zhipu AI and Tsinghua University (arXiv 2508.06471), 2025-08-08
- [S224] Kimi K2: Open Agentic Intelligence, Moonshot AI (arXiv 2507.20534), 2025-07-28
- [S220] Qwen3 Technical Report, Qwen Team, Alibaba (arXiv 2505.09388), 2025-05-14
- [S272] Command A: An Enterprise-Ready Large Language Model (technical report), Cohere, arXiv 2504.00698, 2025-04
- [S268] Nemotron 3 Nano: Open, Efficient Mixture-of-Experts Hybrid Mamba-Transformer Model for Agentic Reasoning (technical report), NVIDIA, 2025-12-23
- [S260] Magistral (technical report), Mistral AI, arXiv 2506.10910, 2025-06
- [S319] Do Agent Benchmarks Do What They Say? An executable-contract audit of tool-using agent environments, arXiv 2609.37315, 2026-09-29
