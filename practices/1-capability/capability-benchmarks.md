---
id: capability-benchmarks
title: Capability benchmarks and leaderboards
area: 1-capability
status: draft
last_reviewed: 2026-09-27
sources: [S001, S002, S003, S006, S007, S008, S009, S010, S011, S012, S013, S014, S015, S016, S017, S018, S019, S020, S021, S022, S023, S024, S026, S027, S028, S029, S215, S219, S220, S225, S230, S239, S241, S247, S248, S255, S260, S266, S272, S274, S276, S277, S278]
related: [statistical-treatment-of-evals, benchmark-hygiene, agent-evals, tool-use-evals]
---

# Capability benchmarks and leaderboards

## What
A capability benchmark is a fixed set of tasks, a grader, and a reported score. A leaderboard ranks models on one or more of them. This practice is about reading those numbers correctly: what each headline benchmark measures, how it grades, what the score is a score of, and which benchmarks are saturated or retired. The per-benchmark detail lives in `benchmarks/README.md` and the cards beside it.

## Why
Teams choose models, defend upgrades and set expectations with benchmark numbers. The number only means something with the task format, grader, version and sample size attached. SWE-bench alone exists as a 2,294-task set [S007], a 500-task Verified subset [S008], and a 1,865-task Pro set with public, held-out and commercial splits [S026]; the same model scores differently on each. The trade-off: public benchmarks are cheap and comparable across labs, but they measure the benchmark's distribution, not yours, and public sets decay through contamination and saturation [S027] [S028].

## How
Read a benchmark score in six steps.

1. **Name the family and version.** SWE-bench full, Verified or Pro; tau-bench, tau2 or the tau3-labelled repo at v1.0.1, where results from versions before 1.0.1 are not comparable on the banking domain [S012]; BFCL V4, not V3 [S013].
2. **Name the grader.** The grader decides what the score can mean.

| Grader | Benchmarks | What a point means |
|---|---|---|
| Exact match on a fixed answer | MMLU-Pro (10 options) [S016], GPQA (4 options) [S017], HLE short answer and multiple choice [S018], BBQ inside HELM Safety [S029] | The model picked the keyed answer. Says nothing about the reasoning shown. |
| Executing hidden tests | SWE-bench and Verified [S007] [S008], SWE-Bench Pro (Docker per task) [S009], LiveCodeBench [S020], Terminal-Bench 2.0 [S021] | The patch or command sequence made the tests pass. A flawed test rejects a correct patch [S028]. |
| Final state of a database | tau-bench and tau2 compare the end database state with an annotated goal state [S010] [S011] | The agent reached the right outcome, however it got there. |
| AST or executable match of a function call | BFCL [S013] | The call matched the expected signature and arguments, or executed to the expected result. |
| Model judge | HELM Capabilities on WildBench and Omni-MATH, with several judge models [S002]; HELM Safety, mean of two judges [S029] | A model rated the output. Judge choice moves the score. |
| Human pairwise votes | Chatbot Arena, Bradley-Terry over votes [S024] | People preferred this model's answer in anonymous head-to-head battles. |
| Human time to complete | METR time horizon: the length of task, in human time, at which the model succeeds 50% of the time [S014] [S015] | A model with a 1-hour horizon fails most 4-hour tasks. |
| Action efficiency against humans | ARC-AGI-3: a 100% score means beating every game as efficiently as humans [S023] | Novel interactive environments, no instructions [S022]. |

3. **Name the metric.** pass@1 is one attempt. pass^k is the chance that all k independent attempts succeed; tau-bench reports gpt-4o at 61.2 pass^1 on retail and below 25 pass^8 [S010]. A mean over five scenarios is HELM Capabilities' headline [S002]. A 50% horizon and an 80% horizon are different numbers on the same tasks [S015].
4. **Name the harness.** Agentic benchmarks score a model plus a scaffold. Terminal-Bench ships its own harness [S021]; SWE-Bench Pro runs patches in per-task containers [S009]. Two scaffolds on one model give two scores. Never compare a score from one harness to a score from another.
5. **Check status.** Retired: OpenAI stopped evaluating on SWE-bench Verified on 2026-02-23 after auditing 27.6% of tasks and finding at least 59.4% of the audited ones had tests that reject correct patches, plus contamination in every frontier model tested [S027] [S028]. Built to replace a plateaued predecessor: MMLU-Pro, where accuracy falls 16 to 33 points below MMLU [S016]. Unbeaten as of its release: ARC-AGI-3, humans 100%, frontier AI below 1% in March 2026 [S022].
6. **Attach the error bar.** A 500-task score at 70% has a 95% interval of about plus or minus 4 points; a 50-task domain at 50% has about plus or minus 14. See `statistical-treatment-of-evals.md`.

Then map the benchmark to your need. Knowledge and reasoning: MMLU-Pro, GPQA, HLE. Code: SWE-Bench Pro, LiveCodeBench, Terminal-Bench. Tool calling: BFCL. Conversational agents with policies: tau2. General agent environments: AgentBench's eight environments, public since 2023 [S019]. Long-horizon autonomy: METR. Safety: HELM Safety. Human preference: Arena, read with its known distortions [S006].

## Who does it (sourced)
- **Stanford CRFM, 2022-11:** HELM launched with 16 core scenarios, 7 metrics and 30 models, and describes itself as a living benchmark [S001]. **2025-03:** HELM Capabilities v1.0.0 aggregates MMLU-Pro, GPQA, IFEval, WildBench and Omni-MATH, downsampled to 1,000 instances each except GPQA at 448, ranked by mean score, with several judge models on free-form tasks [S002]. **2024-11:** HELM Safety v1.0 groups five safety sets across six risk categories over 24 models, and says it "is not able to designate models as safe" [S029] [S003].
- **OpenAI, 2024-08:** released SWE-bench Verified: 500 tasks kept from 1,699 reviewed, three annotators per task [S008]. **2026-02:** said it no longer evaluates on it and pointed the community to SWE-Bench Pro [S027] [S028].
- **Scale AI, 2025-09:** SWE-Bench Pro, 1,865 problems from 41 repositories, split public (11 repos), held-out (12) and commercial (18), described as contamination-resistant [S026]; the public V2 split is 642 tasks [S009].
- **Sierra, 2024-06 and 2025-06:** tau-bench (115 retail, 50 airline tasks, graded by final database state, pass^k) [S010]; tau2 adds a telecom dual-control domain where user and agent both act on tools [S011]; the repo is at v1.0.1 as of July 2026 [S012].
- **UC Berkeley, living:** BFCL V4 covers simple, multiple, parallel and multi-turn calls, relevance, agentic, web search, memory and format sensitivity; page updated 2026-04-12 [S013].
- **METR, 2025-03:** 50% time horizon over 170 tasks, doubling about every 7 months since 2019 [S014] [S015].
- **LMSYS, 2024-03:** Chatbot Arena, Bradley-Terry scores over 240K anonymous votes [S024].
- **ARC Prize Foundation, 2026-03:** ARC-AGI-3 interactive environments [S022] [S023].
- **DeepSeek, 2025-12:** the V3.2 report scores SWE-bench Verified 73.1, Terminal Bench 2.0 46.4 "using the Claude Code framework", BrowseComp 67.6 with context management and 51.4 without, tau2-Bench 80.3 and MCP-Universe 45.9, at temperature 1.0 with a 128K context [S215].
- **Alibaba Qwen, 2025-05:** the Qwen3 report scores the 235B-A22B flagship in two modes, thinking (AIME 2024 85.7, LiveCodeBench v5 70.7) and non-thinking (AIME 2024 40.1, LiveCodeBench v5 35.3), so the same weights carry two rows [S220].
- **Moonshot AI, 2026-02:** the K2.5 report reports BrowseComp three ways, 60.6 plain, 74.9 with context management and 78.4 with the Agent Swarm orchestrator, one benchmark under three harness conditions [S225].
- **Zhipu, 2026-02:** the GLM-5 card says a "verified" Terminal-Bench 2.0 variant "fixes some ambiguous instructions", so its score is not the public leaderboard's [S230].
- **Context, NIST CAISI, 2026-05:** an outside tester aggregated nine benchmarks in five domains into an IRT-style capability index and placed DeepSeek V4 Pro about eight months behind the frontier [S219].
- **Google, 2026-05:** "All Gemini scores are pass @1 except where otherwise noted", "'Single attempt' settings allow no majority voting or parallel test-time compute", and "To reduce variance, we average over multiple trials for smaller benchmarks", with SWE-Bench Pro "averaged over 5x runs" [S239].
- **Google, 2026-07:** the Gemma 4 card tables MMLU Pro, AIME 2026, LiveCodeBench v6, GPQA Diamond, Tau2, HLE, MMMU Pro, OmniDocBench and MRCR v2 across five sizes from E2B to 31B [S241].
- **Microsoft, 2026-02:** a benchmark enters the leading-indicator suite only if it has "low saturation (i.e., the best performing models typically score lower than 70%)", measures "an advanced capability", and has "a sufficient number of prompts to account for non-determinism in model output" [S247].
- **Microsoft, 2024-12:** the Phi-4 card reports MMLU, MATH, GPQA, DROP, MGSM, HumanEval and SimpleQA "using OpenAI's SimpleEval" [S248].
- **Amazon, 2025-12:** the Nova 2 report lists the API parameters used per benchmark in an appendix (temperatures of 0.7, 0.6 and 0.001 appear) and marks models it "was unable to benchmark" [S255].
- **EleutherAI, living:** lm-evaluation-harness implements "over 60 standard academic benchmarks for LLMs, with hundreds of subtasks and variants" behind one interface, and holds that "Evaluation with publicly available prompts ensures reproducibility and comparability between papers" [S274].
- **Hugging Face, 2023 to 2025:** the Open LLM Leaderboard v1 fixed six benchmarks and their shot counts and ran every model "in the exact same setup" on a pinned harness commit [S277]; the board retired in March 2025 after "over 13K models" because "benchmarks need to follow" capabilities [S276].
- **AI2, December 2025:** OlmoBaseEval is 43 tasks clustered by capability, with a Base Easy suite for small runs, a Base Main suite for the final run, and four held-out benchmarks to catch overfitting to the development suite [S278].
- **Mistral, June 2025:** the Magistral report states its decoding settings (temperature 0.7 for math and GPQA, 0.95 for code; 40k or 32k max tokens) alongside AIME, MATH-500, LiveCodeBench, GPQA and Humanity's Last Exam scores [S260].
- **Cohere, April 2025:** Command A is scored on a published table of benchmarks by area, follows the simple-evals implementation for MMLU, MMLU-Pro and GPQA, and shows "externally reported results with comparable evaluation settings" wherever possible [S272].
- **xAI, September 2026:** the Grok 4.7 card runs capability tests unsafeguarded and attributes several results to third-party runs (Datacurve, Harbor), noting that on Terminal-Bench "absolute scores remain sensitive to the agent harness" [S266].

## Pitfalls
1. Mixing versions of one family. SWE-bench full, Verified and Pro are three different task sets with three different difficulty profiles [S007] [S008] [S026].
2. Reading pass@1 as reliability. tau-bench's pass^8 on retail falls below 25 for a model that scores 61.2 on pass^1 [S010].
3. Trusting a leaderboard rank as a model property. Private best-of-N testing and unequal data access inflate Arena scores; 27 private variants preceded one release [S006].
4. Quoting a retired benchmark. SWE-bench Verified no longer measures frontier coding per its own creator, and Epoch AI labels it Flawed [S027] [S028].
5. Ignoring the judge. HELM Capabilities and HELM Safety scores depend on which judge models graded them [S002] [S029].
6. Forgetting the human baseline. PhD experts score 65% on GPQA and skilled non-experts 34% with web access [S017]; HLE reports low frontier accuracy and calibration against an expert frontier [S018].

## Pattern from a production build
None yet.

## Sources
- [S001] Holistic Evaluation of Language Models, Stanford CRFM, 2022-11-16.
- [S002] HELM Capabilities v1.0.0, Stanford CRFM, 2025-03-20.
- [S003] HELM Safety leaderboard, Stanford CRFM, living.
- [S006] The Leaderboard Illusion, Singh et al., 2025-04-29.
- [S007] SWE-bench, Jimenez et al., 2023-10-10.
- [S008] Introducing SWE-bench Verified, OpenAI, 2024-08-13.
- [S009] SWE-Bench Pro repository, Scale AI, living.
- [S010] tau-bench, Yao et al., Sierra, 2024-06-17.
- [S011] tau2-bench, Barres et al., Sierra, 2025-06-09.
- [S012] tau2-bench repository, sierra-research, living.
- [S013] Berkeley Function Calling Leaderboard, UC Berkeley, living.
- [S014] Measuring AI ability to complete long tasks, Kwa et al., METR, 2025-03-18.
- [S015] Measuring AI ability to complete long tasks (blog), METR, 2025-03-19.
- [S016] MMLU-Pro, Wang et al., 2024-06-03.
- [S017] GPQA, Rein et al., 2023-11-20.
- [S018] Humanity's Last Exam, Phan et al., 2025-01-24.
- [S019] AgentBench, Liu et al., 2023-08-07.
- [S020] LiveCodeBench, Jain et al., 2024-03-12.
- [S021] Terminal-Bench 2.0, Merrill et al., 2026-01-17.
- [S022] ARC-AGI-3, ARC Prize Foundation, 2026-03-24.
- [S023] ARC Prize, ARC Prize Foundation, living.
- [S024] Chatbot Arena, Chiang et al., 2024-03-07.
- [S026] SWE-Bench Pro paper, Scale AI, 2025-09-21.
- [S027] Why SWE-bench Verified no longer measures frontier coding capabilities, OpenAI, 2026-02-23.
- [S028] SWE-bench Verified benchmark review, Epoch AI, 2026-09-03.
- [S029] HELM Safety v1.0, Stanford CRFM, 2024-11-08.
- [S215] DeepSeek-V3.2: Pushing the Frontier of Open Large Language Models, DeepSeek-AI (arXiv 2512.02556), 2025-12-02
- [S220] Qwen3 Technical Report, Qwen Team, Alibaba (arXiv 2505.09388), 2025-05-14
- [S225] Kimi K2.5: Visual Agentic Intelligence, Moonshot AI (arXiv 2602.02276), 2026-02-02
- [S230] GLM-5: from Vibe Coding to Agentic Engineering, Z.ai (arXiv 2602.15763), 2026-02-17
- [S219] CAISI Evaluation of DeepSeek V4 Pro, NIST Center for AI Standards and Innovation, 2026-05-01
- [S239] Gemini 3.5 Flash model evaluation: approach, methodology and results, Google DeepMind, 2026-05
- [S241] Gemma 4 model card, Google, living
- [S247] Frontier Governance Framework, Microsoft, 2026-02
- [S248] Phi-4 model card, Microsoft (Hugging Face), 2024-12-12
- [S255] Amazon Nova 2: Multimodal Reasoning and Generation Models, technical report and model card, Amazon AGI, 2025-12
- [S274] lm-evaluation-harness (repository), EleutherAI, GitHub, living
- [S277] Open LLM Leaderboard v1 (archive documentation), Hugging Face, leaderboards docs, living
- [S276] It's been a wild ride, folks :) (end of the Open LLM Leaderboard), Hugging Face (Clementine Fourrier), Hub discussion, 2025-03-13
- [S278] Olmo 3 (technical report), Ai2 (Olmo Team), arXiv 2512.13961, 2025-12
- [S260] Magistral (technical report), Mistral AI, arXiv 2506.10910, 2025-06
- [S272] Command A: An Enterprise-Ready Large Language Model (technical report), Cohere, arXiv 2504.00698, 2025-04
- [S266] Grok 4.7 Model Card (revision 2026-09-21), xAI (SpaceXAI), 2026-09-21
