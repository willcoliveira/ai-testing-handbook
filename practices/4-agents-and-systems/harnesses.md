---
id: harnesses
title: Harnesses
area: 4-agents-and-systems
status: draft
last_reviewed: 2026-10-03
sources: [S066, S067, S068, S070, S072, S073, S079, S080, S082, S085, S268, S270, S274, S275, S278, S279, S302, S389]
related: [agent-evals, ci-gates-for-llm-apps, eval-driven-development, capability-benchmarks, llm-as-judge]
---

# Harnesses

## What
An eval harness is the code that takes a dataset of tasks, runs each one through a model or an application, applies one or more scorers, and writes a log you can open afterwards. The word covers open-source frameworks (Inspect, promptfoo, DeepEval, Ragas, OpenAI Evals, Weave) and the offline half of hosted platforms. What separates a harness from a script is that the dataset, the thing under test and the grading are three parts you can swap without touching the other two. Inspect describes its own parts as "facilities for prompt engineering, tool usage, multi-turn dialog, and model graded evaluations" [S066].

## Why
Every team writes one anyway. Without a harness the eval is a notebook nobody reruns; with one, the same forty cases run on every pull request and a scorer swap is one line. The trade-off is that each harness carries a model of the world. Inspect thinks in samples, solvers, scorers and logs [S066]. promptfoo thinks in prompts crossed with providers and checked by assertions [S068]. DeepEval thinks in pytest test cases with metrics attached [S070]. Pick the one whose model matches your system or you will spend the first month fighting it.

## How
1. Decide what is under test. A model (capability, safety) points to Inspect and its 200+ pre-built evals [S066][S067]. An application (a prompt, a RAG chain, an agent) points to promptfoo, DeepEval, Ragas or a platform SDK.
2. Match the language. Inspect, DeepEval, Ragas, OpenAI Evals and Weave are Python; promptfoo is a Node CLI driven by YAML with a library form [S068]. A TypeScript team that adopts a Python harness ends up with two toolchains in CI.
3. Put the dataset in version control next to the code, with an id per case. Weave's `Evaluation` takes "Dataset objects or lists of dictionaries" [S085]; Inspect reads samples from files or Hugging Face datasets [S066].
4. Deterministic scorers first, model-graded second. Inspect ships text-comparison scorers and `model_graded_qa()` [S066]; DeepEval ships "50+ ready-to-use metrics, including LLM-as-a-judge" [S070]; Ragas lets you "Create custom metrics tailored to your specific use case with simple decorators" [S080]. A model-graded scorer needs calibration before it can gate (see `llm-as-judge`).
5. Run repeats. Weave has a `trials` parameter "to run each example multiple times" [S085]. Report the spread, not one number.
6. Keep per-sample logs. Inspect View and the VS Code extension open a log per sample [S066]. A harness that only prints an aggregate cannot tell you which case regressed.
7. Wire it into CI with an exit code and a small suite. DeepEval is "built to run with pytest and CI providers for regression testing" [S070]; promptfoo documents GitHub Actions [S068].

| Harness | Under test | Language | Judge | Agents and multi-turn | Version checked |
|---|---|---|---|---|---|
| Inspect AI | models, agents | Python | model_graded_qa and custom | react agent, multi-agent, agent bridge, sandboxes | 0.3.270, 2026-09 [S066] |
| promptfoo | prompts, apps, agents | Node CLI, YAML | model-graded assertions | agents as targets; multi-turn not stated in source | 0.123.1, 2026-09 [S068] |
| DeepEval | apps, agents, voice | Python, pytest | LLM-as-a-judge | end-to-end, component, trajectory modes | 4.2.6, 2026-09 [S070] |
| Ragas | RAG and LLM apps | Python | LLM-driven metrics | not stated in source | 0.4.3, 2026-01 [S080] |
| OpenAI Evals | models, systems | Python, YAML | model-graded templates | completion functions for "prompt chains or tool-using agents" | last push 2026-04 [S082] |
| Weave | apps | Python | custom scorers | not stated in source | 0.53.11, 2026-09 [S085] |

## Who does it (sourced)
- **UK AI Security Institute, Inspect, 2026-09:** a framework "for large language model evaluations" with "over 200 pre-built evaluations ready to run on any model", MIT, with sandboxing via Docker, Kubernetes, Modal, Proxmox and Vagrant [S066].
- **Inspect Evals maintainers, v0.22.0, 2026-09:** the evals library is described as maintained by Generality Labs with contributions from the UK AI Security Institute, Arcadia Impact and the Vector Institute, and runs across OpenAI, Anthropic, Google, Mistral, Azure, Bedrock, vLLM and Ollama providers [S067].
- **Anthropic, Petri and Bloom, 2025-10 and 2025-12:** Petri's early adopters include "MATS scholars, Anthropic Fellows, and the UK AISI", and the UK AISI "used a pre-release version of Petri to build evaluations" [S072]; Bloom "exports Inspect-compatible transcripts" [S073].
- **promptfoo, 2026-09:** "Originally built for LLM apps serving over 10 million users in production"; CLI, library and CI/CD integration, with caching and concurrency [S068].
- **Confident AI, DeepEval, 2026-09:** aimed at "AI engineers who need to evaluate agents, RAG pipelines, tool calls, and production LLM workflows" and "QAs who need reliable regression tests for AI behavior" [S070].
- **OpenAI, Evals repository, last push 2026-04:** "Evals provide a framework for evaluating large language models (LLMs) or systems built using LLMs", with a registry of benchmarks; custom code evals are not currently accepted for contribution [S082].
- **Anthropic, 2026-01:** the agent evals post surveys Harbor for "running agents in containerized environments" and platforms such as Braintrust, LangSmith, Langfuse and Phoenix [S079].
- **EleutherAI, living:** lm-evaluation-harness, MIT, v0.4.13 (2026-08-31), four request types, backends from transformers to ONNX Runtime and Megatron-LM, and `--check_integrity` for datasets [S274].
- **Hugging Face, living:** lighteval, MIT, v0.13.0 (2025-11-24), "1000+ evaluation tasks" over inspect-ai, accelerate, nanotron, vLLM, SGLang and endpoints [S275].
- **NVIDIA, living:** NeMo Evaluator, Apache 2.0, v0.3.0 (2026-06-03), 17 built-in benchmarks and other harnesses addressed as `lm-eval://`, `skills://`, `vlmevalkit://`, `gym://`, `harbor://` and `container://` [S270]; the Nemotron 3 Nano report collected its results through it and LM Evaluation Harness [S268].
- **AI2, living:** OLMES, Apache 2.0, the suite behind OLMo 3, with a companion `decon` tool for decontamination [S279][S278].
- **arXiv, 2026-09:** "harness or model" measured with a private suite: no consistent advantage for vendor-native harnesses over neutral ones [S302].
- **Inspect AI, 2026-09:** version 0.3.272 deprecated the `web_browser()` tool, which now warns and will be removed, and fixed computer-tool back and forward clicks in a rebuilt sandbox image [S066].
- **UK AISI, 2026-10:** after agents took unsanctioned actions in cyber testing, AISI resumed evaluations with outbound networking disabled in its cyber ranges plus an independent cloud-network egress block, phased security testing before agents run, a synchronous LLM monitor over messages, tool calls and reasoning with an action-only fallback, and sandbox-escape tests run from weaker to stronger models [S389].
- **Inspect AI, 2026-10:** version 0.3.274 lets a task set `ViewerConfig(trust_content=False)` so the log viewer shows transcript content as plain text with no markdown, media or clickable links, and runs the sandbox root check once at sample start, before the solver or agent executes [S066].

## Pitfalls
1. Choosing by star count instead of by the shape of the thing under test. A harness built for model benchmarks (Inspect, OpenAI Evals) makes you wrap your application as a model; an application harness makes benchmark runs awkward [S066][S082].
2. Treating a benchmark library as an application eval. The 200+ Inspect evals measure model capability on public tasks, not your product on your distribution [S067].
3. Assuming a registry is maintained. OpenAI Evals shows no deprecation notice, but its last push was 2026-04 and custom code evals are not accepted [S082]. Check the date before you depend on it.
4. Model-graded scorers as the only scorers. Every harness offers them [S066][S070][S080]; none calibrates them for you.
5. Aggregates without per-sample logs. If the harness cannot show you the one case that flipped, the number it prints is not actionable [S066].

## Pattern from a production build
None yet.

## Sources
- [S066] Inspect AI documentation and repository, UK AI Security Institute, living.
- [S067] Inspect Evals, UK AI Security Institute and contributors, living (v0.22.0, 2026-09-25).
- [S068] promptfoo documentation, promptfoo, living (0.123.1, 2026-09-18).
- [S070] DeepEval documentation, Confident AI, living (4.2.6, 2026-09-24).
- [S080] Ragas documentation, Ragas, living (0.4.3, 2026-01-13).
- [S082] OpenAI Evals repository, OpenAI, living (last push 2026-04-14).
- [S085] Weave evaluations, Weights & Biases, living (0.53.11, 2026-09-25).
- [S079] Demystifying evals for AI agents, Anthropic, 2026-01-09.
- [S072] Petri: an open-source auditing tool, Anthropic, 2025-10-06.
- [S073] Bloom: automated behavioral evaluations, Anthropic, 2025-12-19.
- [S274] lm-evaluation-harness (repository), EleutherAI, GitHub, living
- [S275] lighteval (repository), Hugging Face, GitHub, living
- [S270] NeMo Evaluator (repository), NVIDIA-NeMo, GitHub, living
- [S268] Nemotron 3 Nano: Open, Efficient Mixture-of-Experts Hybrid Mamba-Transformer Model for Agentic Reasoning (technical report), NVIDIA, 2025-12-23
- [S279] OLMES: A Standard for Language Model Evaluations, Ai2, arXiv 2406.08446, 2024-06-12
- [S278] Olmo 3 (technical report), Ai2 (Olmo Team), arXiv 2512.13961, 2025-12
- [S302] Harness or Model? Isolating the harness effect in agentic coding with a contamination-controlled private suite, arXiv 2609.11987, 2026-09-08
- [S389] Building a more secure environment for evaluating dangerous capabilities, UK AI Security Institute, 2026-10-01
