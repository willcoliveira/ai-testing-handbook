---
id: agent-evals
title: Agent evals
area: 4-agents-and-systems
status: draft
last_reviewed: 2026-09-27
sources: [S066, S077, S078, S079, S083, S087, S088, S089, S215, S225, S228, S229, S230, S239, S251, S254, S256, S265, S266, S270, S272]
related: [harnesses, tool-use-evals, orchestrators-and-simulators, non-determinism-and-pass-rates, criteria-authoring, regulated-domain-checks]
---

# Agent evals

## What
An agent eval is a set of tasks, each with inputs and a success criterion, run against a system that acts over many turns with tools, and graded by logic that looks either at what the agent left behind or at what it did on the way. Anthropic's engineering post fixes the vocabulary: "A task (a.k.a problem or test case) is a single test with defined inputs and success criteria", "Each attempt at a task is a trial", "A grader is logic that scores some aspect of the agent's performance", and "The outcome is the final state in the environment at the end of the trial" [S079]. The transcript is "the complete record of a trial, including outputs, tool calls, reasoning, intermediate results, and any other interactions" [S079]. Outcome grading and transcript grading answer different questions, and an agent eval needs a decision about which one gates.

## Why
A single-turn eval scores one output. An agent's failures live in the sequence: a wrong tool call, a skipped confirmation, a correct answer reached after an action that should never have happened. Grading the final state catches the first kind cheaply and without depending on wording. tau2-bench's default reward is exactly this: a hash of the database end state multiplied by a check that required strings were said, so "any sequence of tool calls that produces an equivalent DB end state passes the DB check" [S078]. Transcript grading catches the second kind, but when a model does the grading it inherits judge noise. The trade-off: state grading is blind to how the agent got there; transcript grading is expensive to keep honest. Most teams need both, with state as the gate and transcript checks as the alarm.

## How
1. Write the task as inputs plus a criterion you can check without reading the whole transcript. Prefer a state assertion: a record written, a flag set, a state-machine position reached.
2. Pick a grader per criterion. tau2-bench's reward types are a usable menu: `DB` (end-state hash equals the target), `COMMUNICATE` (every required string appears in the agent's messages), `ENV_ASSERTION` (assertions on the environment after the run), `ACTION` (a specific tool call happened) and `NL_ASSERTION` (an LLM judge, marked experimental) [S078]. Use `ACTION` "only when you are confident `actions` enumerates the only acceptable trajectory" [S078].
3. Run more than one trial per task. "Because model outputs vary between runs, we run multiple trials to produce more consistent results" [S079]. Report pass@k when one success is enough (search, drafting). Report pass^k when every run must succeed (customer-facing actions): "pass^k measures the probability that all k trials succeed" [S079].
4. Keep a transcript grader for what state cannot see: a disallowed action later undone, a policy line said aloud that should not be, a tool called with a secret in an argument. LangSmith's concepts page frames agent checks as "correct tool selection and proper argument formatting or trajectory that the agent took" [S083].
5. Store every transcript. OpenAI's guide: "A trace captures the end-to-end record of model calls, tool calls, guardrails, and handoffs for one run", and "Graders let you score those traces with structured criteria so you can find regressions and failure modes at scale" [S077].
6. Set limits. Inspect provides "Limits to set token, message, and time limits for agent execution" [S066]. An agent eval without limits has a budget set by its worst trial.
7. Read transcripts by hand on a cadence. The Anthropic post recommends routine transcript reading alongside automated graders [S079]. Graders drift from what you meant.

| Question | Grade on |
|---|---|
| Did the job get done? | End state: database hash, record, state-machine position |
| Was the required thing said? | Substring or pattern match on the agent's messages |
| Did it take a forbidden path? | Transcript assertion on tool calls and arguments |
| Was it helpful, on policy, polite? | Rubric-based LLM grader, calibrated, never the only gate |

## Who does it (sourced)
- **Anthropic, 2026-01:** the engineering post defines task, trial, grader, transcript and outcome, separates state-based from transcript grading, defines pass@k and pass^k, and notes teams use "a second LLM to simulate the user" for conversational agents [S079].
- **Sierra Research, tau2-bench v1.0.1, 2026-07:** the default reward is the product of a DB end-state check and a communicate check; the changelog records a grader fix where "extra read calls no longer zero the reward", and warns that scores before and after the fix are not comparable [S078].
- **UK AI Security Institute, Inspect, 2026-09:** ships a react agent, multi-agent primitives, an agent bridge for OpenAI Agents SDK, LangChain and Pydantic AI, sandboxes, and token, message and time limits [S066].
- **OpenAI, living guide:** trace grading with structured criteria plus dataset evals for "comparing prompts and changes over time" [S077].
- **Microsoft Foundry, 2026-07:** built-in agent evaluators include "tool call accuracy, task completion", with continuous evaluation "of production traffic at a sampled rate" [S088].
- **Google Cloud, Vertex, 2026-09:** adaptive rubrics generate "a unique set of pass or fail rubrics for each individual prompt in your dataset", with a separate agent evaluation path in the SDK [S087].
- **UC Berkeley, BFCL V4, 2026-04:** the function-calling leaderboard added multi-turn in v3 and "holistic agentic evaluation" in v4 [S089].
- **DeepSeek, 2025-12:** SWE-bench Verified 73.1 and Terminal Bench 2.0 46.4 "using the Claude Code framework"; BrowseComp needed context management because "approximately 20%+ of the test cases exceed" the 128K limit [S215].
- **Moonshot AI, 2026-02:** K2.5 reports BrowseComp under three harness conditions (60.6, 74.9, 78.4) and OSWorld-Verified 63.3; the Agent Swarm result replaces token counts with a "critical steps" metric [S225].
- **Zhipu, 2025-08 and 2026-02:** CC-Bench, 52 tasks in isolated containers scored as a win rate against Claude Sonnet 4, and an internal CC-Bench-V2 for GLM-5; RL used "over 10k verifiable environments" across nine languages [S229][S230].
- **Context, UK AISI and US CAISI, 2026-07:** a 41-task public exploit benchmark and a private 32-step cyber range, scored as success rate, arbitrary code execution count and steps reached, with a single-benchmark confidence caveat [S228].
- **Microsoft, 2026-08:** agent-only red-teaming categories (prohibited actions, sensitive data leakage, task adherence) check "tool outputs for unsafe or risky behavior", run cloud-only in "a minimally sandboxed environment", and are limited to "Single-turn, English-only; synthetic data" [S251].
- **Amazon, 2026-01:** cyber evaluation of Nova 2 Lite used Hack The Box environments with "a custom agent deployed on a Kali Linux EC2 instance" in "fully autonomous mode", scenario-based testing and human-in-the-loop phases [S256].
- **Amazon, 2026-09:** framework evaluations run "both with and without 'agentic scaffoldings,' environments that grant the model access to external tools such as code interpreters, web browsers, and file systems" [S254].
- **Google, 2026-05:** OSWorld-Verified scores are "averaged over 5 runs with a single attempt per run" with "max step length of 100" and pyautogui actuation [S239].
- **xAI, April 2026:** AgentHarm for agentic refusals (violation rate 0.30) and AgentDojo for prompt injection (attack success 0.33), both in the model card [S265]; **September 2026:** CyberGym, CVE-Bench and Terminal-Bench run through the Grok Build harness, with the caveat that scores "remain sensitive to the agent harness" [S266].
- **NVIDIA, living:** NeMo Evaluator ships agentic and terminal benchmarks (PinchBench, Terminal-Bench) with Docker sandboxes and solvers for tool calling [S270].
- **Cohere, April 2025:** agentic tool use is an evaluation area of its own, with TauBench and BFCL [S272].

## Pitfalls
1. Grading the reference trajectory as if it were the requirement. tau2-bench's docs exist because the listed actions are "one reference trajectory that solves the task", not the only correct one, and "in many tasks several distinct trajectories produce an equivalent DB end state" [S078].
2. Penalising harmless extra actions. The v1.0.1 changelog describes a grader where "A single prudent verification read not present in the golden trajectory" zeroed the reward [S078]. Decide up front which actions are neutral.
3. One trial per task. A pass rate from a single run of a probabilistic system is a coin flip. Run trials and report pass^k when every run must succeed [S079].
4. A transcript-only oracle for a state change. Several symptoms in a transcript can share one cause in the state machine while every transcript looks plausible; check the state, not the prose.
5. Unbounded runs. Without message, token and time limits the eval cost is set by the slowest trial, not by you [S066].

## Pattern from a production build
None yet.

## Sources
- [S079] Demystifying evals for AI agents, Anthropic, 2026-01-09.
- [S078] tau2-bench repository and evaluation docs, Sierra Research, living (v1.0.1, 2026-07).
- [S066] Inspect AI documentation, UK AI Security Institute, living.
- [S083] LangSmith evaluation concepts, LangChain, living.
- [S077] Agent evals guide, OpenAI, living.
- [S088] Observability in Generative AI, Microsoft Foundry, 2026-07-31.
- [S087] Gen AI evaluation service overview, Google Cloud, living (updated 2026-09-25).
- [S089] Berkeley Function Calling Leaderboard, UC Berkeley, living (V4, 2026-04-12).
- [S215] DeepSeek-V3.2: Pushing the Frontier of Open Large Language Models, DeepSeek-AI (arXiv 2512.02556), 2025-12-02
- [S225] Kimi K2.5: Visual Agentic Intelligence, Moonshot AI (arXiv 2602.02276), 2026-02-02
- [S229] GLM-4.5: Agentic, Reasoning, and Coding (ARC) Foundation Models, Zhipu AI and Tsinghua University (arXiv 2508.06471), 2025-08-08
- [S230] GLM-5: from Vibe Coding to Agentic Engineering, Z.ai (arXiv 2602.15763), 2026-02-17
- [S228] UK AISI / CAISI Preliminary Assessment of Kimi K3's Cyber Capabilities, UK AI Security Institute and US CAISI, 2026-07-23
- [S251] AI Red Teaming Agent (Microsoft Foundry docs), Microsoft, living
- [S256] Evaluating Nova 2.0 Lite model under Amazon's Frontier Model Safety Framework, Krishna et al., Amazon, arXiv 2601.19134, 2026-01-27
- [S254] Amazon's Frontier Model Safety Framework (September 2026 update), Amazon, 2026-09-17
- [S239] Gemini 3.5 Flash model evaluation: approach, methodology and results, Google DeepMind, 2026-05
- [S265] Grok 4.20 System Card, xAI, 2026-04-07
- [S266] Grok 4.7 Model Card (revision 2026-09-21), xAI (SpaceXAI), 2026-09-21
- [S270] NeMo Evaluator (repository), NVIDIA-NeMo, GitHub, living
- [S272] Command A: An Enterprise-Ready Large Language Model (technical report), Cohere, arXiv 2504.00698, 2025-04
