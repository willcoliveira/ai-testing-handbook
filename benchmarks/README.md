# Benchmarks

One row per benchmark researched for area 1. Each row links to a card in this folder where one exists. Source ids resolve in `sources.md`.

## How to read this matrix

A score is only comparable inside one row and one version. **Grader** tells you what a point means: exact match says the keyed answer was picked, executed tests say a patch passed the tests it was given (which may themselves be wrong [S028]), a model judge says another model approved, and human votes say people preferred it in a head-to-head. **Contamination risk** is this repository's reading, not a claim by the maintainer: high for a public static set older than a year, medium for a public set that is new, rolling, or backed by a simulated environment, low for held-out, private or novel-environment sets. **Status** is active, saturated or retired, with the version in brackets; "retired" is used only where the maintainer or a major user has said so in public [S027]. Before quoting a number from any row, attach n, the version and the interval per `practices/1-capability/statistical-treatment-of-evals.md`.

| Benchmark | What it measures | Task format | Grader | Contamination risk | Maintainer | Status | Source id |
|---|---|---|---|---|---|---|---|
| [HELM Classic and Capabilities](helm.md) | Broad multi-metric evaluation; Capabilities covers knowledge, reasoning, instruction following, dialogue, maths | 5 scenarios of 1,000 instances each (GPQA 448) | Exact match plus several model judges on free-form tasks | Medium: component sets are public | Stanford CRFM | Active (Capabilities v1.0.0) | S001, S002 |
| [HELM Safety](helm.md) | Refusal and bias across six risk categories | Five prompt sets, 100 to 58,492 items each | Exact match on BBQ; mean of two model judges elsewhere | Medium: public prompt sets | Stanford CRFM | Active (v1.0) | S029, S003 |
| [MMLU-Pro](mmlu-pro.md) | Knowledge with reasoning | 10-option multiple choice, chain of thought | Exact match | High: public static set | Wang et al. | Active; built after MMLU plateaued | S016 |
| [GPQA](gpqa.md) | Graduate-level science reasoning | 448 four-option questions in biology, physics, chemistry | Exact match | High: public static set, small | Rein et al. | Active | S017 |
| [Humanity's Last Exam](hle.md) | Expert-frontier closed-ended academic questions | 2,500 multiple-choice and short-answer questions | Automated match to a verifiable answer | Medium: public, released 2025 | CAIS and Scale AI | Active | S018 |
| [SWE-bench (full)](swe-bench.md) | Resolving real GitHub issues | 2,294 issue-to-patch tasks, 12 Python repos | Hidden unit tests | High: public repos and tasks | Princeton SWE-bench team | Active leaderboard; superseded in practice | S007 |
| [SWE-bench Verified](swe-bench.md) | Same, human-filtered | 500 tasks | Hidden unit tests | High: contamination confirmed by OpenAI | SWE-bench team with OpenAI | Retired by OpenAI, 2026-02 | S008, S027, S028 |
| [SWE-Bench Pro](swe-bench.md) | Long-horizon issue resolution | 1,865 tasks, 41 repos; public V2 split 642 | Tests executed in per-task Docker images | Low on held-out and commercial splits; medium on public | Scale AI | Active (V2) | S026, S009 |
| [LiveCodeBench](livecodebench.md) | Code generation, self-repair, execution, test-output prediction | Rolling competitive-programming problems with release dates | Unit tests | Low when scored on a post-cutoff window | Jain et al., UC Berkeley and others | Active (rolling) | S020 |
| [Terminal-Bench 2.0](terminal-bench.md) | Task completion in a terminal | 89 tasks, each with environment, human solution and tests | Tests run inside the environment | Medium: public tasks, released 2026-01 | Merrill et al. | Active (2.0) | S021 |
| [tau-bench and tau2](tau-bench.md) | Policy-following conversational agents with tools and a simulated user | 115 retail and 50 airline tasks, plus telecom and banking domains | Final database state versus goal state; pass^k | Medium: public tasks, stochastic simulated user | Sierra | Active (repo v1.0.1) | S010, S011, S012 |
| [BFCL V4](bfcl.md) | Function calling: simple, multiple, parallel, multi-turn, agentic, memory, web search | Prompt plus tool schemas | AST match, executable and state-based checks | Medium: public test set | UC Berkeley Gorilla team | Active (V4) | S013 |
| [AgentBench](agentbench.md) | LLM as agent across eight environments | Interactive environments | Per-environment success metrics | High: public since 2023 | Tsinghua THUDM | Active (v3 2025-10) | S019 |
| [METR time horizon](metr-long-tasks.md) | Length of task, in human time, a model completes autonomously | 170 software and reasoning tasks with human baselines | Success rate fitted against human time; 50% and 80% horizons | Unknown: task privacy not stated in the sources read | METR | Active | S014, S015 |
| [ARC-AGI-3](arc-agi.md) | Agentic intelligence on novel interactive games | Turn-based environments with no instructions | Action efficiency against human baselines | Low: novel environments | ARC Prize Foundation | Active, unbeaten at release | S022, S023 |
| Chatbot Arena | Human preference | Anonymous pairwise battles on live prompts | Bradley-Terry over votes, sandwich intervals | Not applicable; gaming risk instead (private variants, retraction) | LMSYS at paper time | Active | S024, S006 |
| GSM1k | Contamination probe for grade-school maths | 1,000 GSM8k-style problems, held private | Exact match | Low: private | Scale AI | Active (private) | S025 |

## Sources
- [S001] HELM, Stanford CRFM, 2022-11-16. [S002] HELM Capabilities v1.0.0, 2025-03-20. [S003] HELM Safety leaderboard, living. [S029] HELM Safety v1.0, 2024-11-08.
- [S006] The Leaderboard Illusion, 2025-04-29. [S007] SWE-bench, 2023-10-10. [S008] Introducing SWE-bench Verified, OpenAI, 2024-08-13. [S009] SWE-Bench Pro repository, living. [S026] SWE-Bench Pro paper, 2025-09-21. [S027] OpenAI on retiring SWE-bench Verified, 2026-02-23. [S028] Epoch AI review, 2026-09-03.
- [S010] tau-bench, 2024-06-17. [S011] tau2-bench, 2025-06-09. [S012] tau2-bench repository, living. [S013] BFCL, living. [S019] AgentBench, 2023-08-07.
- [S014] METR paper, 2025-03-18. [S015] METR blog, 2025-03-19. [S016] MMLU-Pro, 2024-06-03. [S017] GPQA, 2023-11-20. [S018] Humanity's Last Exam, 2025-01-24. [S020] LiveCodeBench, 2024-03-12. [S021] Terminal-Bench 2.0, 2026-01-17. [S022] ARC-AGI-3, 2026-03-24. [S023] ARC Prize, living. [S024] Chatbot Arena, 2024-03-07. [S025] GSM1k, 2024-05-01.
