# Harnesses

Open-source frameworks that run a dataset through a model or an application, score it, and log it. Practice: [harnesses](../practices/4-agents-and-systems/harnesses.md). Matrix: [README](README.md).

## Inspect AI
- **What it is:** an open-source Python framework from the UK AI Security Institute "for large language model evaluations", MIT, with "facilities for prompt engineering, tool usage, multi-turn dialog, and model graded evaluations" [S066].
- **What it is for:** model and agent evals with sandboxed tools. It ships a react agent, multi-agent primitives, an agent bridge for OpenAI Agents SDK, LangChain and Pydantic AI, external-agent integration for Claude Code, Codex CLI and Gemini CLI, sandboxes on Docker, Kubernetes, Modal, Proxmox and Vagrant, and token, message and time limits [S066]. Bloom exports Inspect-compatible transcripts and the UK AISI built evaluations on a pre-release Petri [S073][S072].
- **What it is not for:** a quick assertion on one prompt in a Node codebase; the model of samples, solvers and scorers is worth learning, and it is Python.
- **Version checked:** inspect-ai 0.3.270, 2026-09-26 [S066].

## Inspect Evals
- **What it is:** "a library of evaluations built using Inspect AI", MIT; the README describes it as maintained by Generality Labs with contributions from the UK AI Security Institute, Arcadia Impact and the Vector Institute [S067].
- **What it is for:** running public benchmarks across OpenAI, Anthropic, Google, Mistral, Azure, Bedrock, Together, Groq, Hugging Face, vLLM and Ollama, and multi-task runs via `inspect eval-set` [S067].
- **What it is not for:** your application on your distribution. These are capability tasks.
- **Version checked:** v0.22.0, 2026-09-25 [S067].

## promptfoo
- **What it is:** an open-source CLI and library, MIT, for evaluating and red-teaming LLM applications; "Originally built for LLM apps serving over 10 million users in production" [S068].
- **What it is for:** prompts crossed with providers and checked by assertions, with caching, concurrency, a web UI and GitHub Actions [S068]; red-team plugins for harmful content, BOLA, BFLA, competitor endorsement and prompt injection, against RAG systems, agents and chatbots [S069].
- **What it is not for:** the source does not describe multi-turn simulation or trajectory grading; check before you assume it.
- **Version checked:** 0.123.1, 2026-09-18 [S068].
- **2026-08 and 2026-09 releases:** OpenTelemetry GenAI tracing with external trace fetch (0.122.1), a per-test repeat option (0.121.19), and native audio grading with live voice sessions (0.123.0) [S068].

## DeepEval
- **What it is:** an open-source Python framework, Apache-2.0, for "unit testing of LLM outputs with pytest-style assertions" [S070].
- **What it is for:** "50+ ready-to-use metrics, including LLM-as-a-judge" plus agent, tool-use, conversational, voice, safety, RAG and multimodal metrics; end-to-end, component-level and trajectory-based modes; tracing of spans and tool calls; regression runs "with pytest and CI providers"; red teaming through DeepTeam [S070].
- **What it is not for:** teams that want deterministic scorers only; the framework's centre of gravity is model-graded metrics that need calibration.
- **Version checked:** 4.2.6, 2026-09-24 [S070].

## Ragas
- **What it is:** an open-source Python library, Apache-2.0, for "systematic evaluation of LLM applications" using "LLM-driven metrics" and an experiments workflow; the repository moved from explodinggradients to vibrantlabsai [S080].
- **What it is for:** RAG and LLM application metrics, custom metrics "with simple decorators", dataset management, LangChain and LlamaIndex integrations [S080].
- **What it is not for:** the source does not mention agents, multi-turn, tracing or CI; pair it with a harness or a platform for those.
- **Version checked:** 0.4.3, 2026-01-13 [S080].

## OpenAI Evals
- **What it is:** "a framework for evaluating large language models (LLMs) or systems built using LLMs" and an open registry of benchmarks, MIT per its README [S082].
- **What it is for:** model-graded evals from YAML templates, and a completion-function protocol that covers "prompt chains or tool-using agents" [S082].
- **What it is not for:** a maintained application harness. There is no deprecation notice, but the last push was 2026-04-14 and custom code evals are not accepted for contribution [S082]. Treat it as a reference implementation.
- **Version checked:** tag 3.0.1; last push 2026-04-14 [S082].

## Benchmarks that carry their own runner
- **tau2-bench:** a simulation framework for customer-service agents with an orchestrator, an LLM user simulator with its own tools, half-duplex and full-duplex modes, and a reward that defaults to a database end-state hash times a communicate check; MIT; v1.0.1 changed grading on one domain and warns that older scores are not comparable [S078].
- **Berkeley Function Calling Leaderboard:** grades function calling by AST match, added multi-turn in v3 and agentic evaluation in v4, and reports cost and latency; V4 last updated 2026-04-12 [S089].
