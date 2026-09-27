# Proposed "Who does it (sourced)" bullets, Chinese frontier labs

One block per practice id. Each bullet is what the named document says, with its id from
`sources/_vendors-1.rows.md` (S213 to S235) or an existing register row (S153). Third-party rows are
marked as context and belong under a practice only where the practice is about outside testing.

## practice: capability-benchmarks
- **DeepSeek, 2025-12:** the V3.2 report scores SWE-bench Verified 73.1, Terminal Bench 2.0 46.4 "using the Claude Code framework", BrowseComp 67.6 with context management and 51.4 without, tau2-Bench 80.3 and MCP-Universe 45.9, at temperature 1.0 with a 128K context [S215].
- **Alibaba Qwen, 2025-05:** the Qwen3 report scores the 235B-A22B flagship in two modes, thinking (AIME 2024 85.7, LiveCodeBench v5 70.7) and non-thinking (AIME 2024 40.1, LiveCodeBench v5 35.3), so the same weights carry two rows [S220].
- **Moonshot AI, 2026-02:** the K2.5 report reports BrowseComp three ways, 60.6 plain, 74.9 with context management and 78.4 with the Agent Swarm orchestrator, one benchmark under three harness conditions [S225].
- **Zhipu, 2026-02:** the GLM-5 card says a "verified" Terminal-Bench 2.0 variant "fixes some ambiguous instructions", so its score is not the public leaderboard's [S230].
- **Context, NIST CAISI, 2026-05:** an outside tester aggregated nine benchmarks in five domains into an IRT-style capability index and placed DeepSeek V4 Pro about eight months behind the frontier [S219].

## practice: benchmark-hygiene
- **Alibaba Qwen, living:** the Qwen3-235B-A22B card instructs "DO NOT use greedy decoding, as it can lead to performance degradation", fixes temperature, top-p, top-k and min-p per mode, and tells evaluators to "standardize output format" with a boxed maths answer and a JSON answer field for multiple choice [S222].
- **DeepSeek, 2025-12:** the V3.2 report states its maths prompt template, puts tool outputs "within messages designated with the 'tool' role, rather than the 'user' role", and runs olympiad problems with "No tools or internet access" under contest time and attempt limits [S215].
- **Zhipu, 2025-08:** GLM-4.5 reports TAU-Bench with an "optimized user simulator" and HLE as "text-based, GPT-4o judged", both departures a reader must carry into any comparison [S229].
- **ByteDance Seed, 2025-08:** the Seed-OSS card presents scores across thinking budgets from 512 to 16K tokens and notes that "the score exhibits fluctuations as the thinking budget increases" on short-reasoning tasks [S231].

## practice: statistical-treatment-of-evals
- **Alibaba Qwen, 2025-05:** "For each question, we sample 64 times and take the average accuracy as the final score" on AIME [S220].
- **Moonshot AI, 2025-07 and 2026-02:** K2 reports AIME 2025 as Avg@64, GPQA-Diamond as Avg@8 and Tau2-Bench as Avg@4; the K2.5 card states avg@32 for AIME and HMMT, avg@8 for GPQA, five independent runs for coding and avg@3 for vision [S224][S225].
- **Zhipu, 2025-08:** GLM-4.5 reports AIME 24 as Avg@32 and GPQA as Avg@8; SWE-bench Verified is a single run under a 100-iteration limit [S229].
- **Context, UK AISI and US CAISI, 2026-07:** "Kimi K3's overall cyber capability has a larger confidence interval than other models because it was estimated from a single benchmark" [S228].

## practice: post-training-evals
- **Alibaba Qwen, 2025-05:** four stages, a long chain-of-thought cold start, reasoning RL with GRPO over "3,995 query-verifier pairs", thinking mode fusion, and general RL over "20 distinct tasks" with "Rule-based, Model-based with Reference Answer, Model-based without Reference Answer" rewards; benchmarks are reported after the final stage only [S220].
- **DeepSeek, 2025-12:** V3.2's RL uses "a generative reward model where each prompt has its own rubrics for evaluation" for general tasks and synthetic agent environments, over 1,800 of them with 85,000 prompts, for tool use [S215].
- **Moonshot AI, 2026-02:** K2.5's RL uses generative reward models "aligned with Kimi's internal value criteria"; the criteria are not published [S225].
- **Zhipu, 2025-08:** GLM-4.5 trains experts by iteration and then RL; the human check is 660 prompts scored 0 to 10 by a "single, consistent evaluator" with reasoning traces hidden [S229].

## practice: llm-as-judge
- **DeepSeek, 2024-12 and 2025-01:** the V3 report uses "DeepSeek-V3 as a Generative Reward Model"; the R1 recipe queries DeepSeek-V3 four times per preference pair for its preference data, and reports ArenaHard with GPT-4-1106 as judge [S213][S153].
- **Zhipu, 2025-08 and 2026-02:** GLM-4.5's HLE score is "GPT-4o judged"; GLM-5 grades search tasks with "the OpenAI evaluation prompt" and o3-mini as judge [S229][S230].
- **Alibaba Qwen, 2025-10:** Qwen3Guard's 1.19M training labels come from "multiple versions of Qwen models" aggregated "via a voting mechanism", seeded by "a small set of manually annotated samples" [S221].

## practice: data-contamination
- **DeepSeek, 2026-01:** the R1 arXiv v2 refers to a pre-training decontamination procedure in an appendix and states that web pages containing OpenAI-model-generated answers were present without the team intentionally adding synthetic OpenAI data [S153].
- **ByteDance Seed, 2025-08:** the Seed-OSS card states that ARC-AGI-2 was "measured on the official evaluation set, which was not involved in the training process", and ships base variants with and without synthetic instruction data because their inclusion "may affect post-training research" [S231].
- **Alibaba Qwen, Moonshot AI, Zhipu, 2025 to 2026:** the Qwen3, Kimi K2, Kimi K2.5, GLM-4.5 and GLM-5 reports contain no contamination or decontamination check; treat their scores accordingly [S220][S224][S225][S229][S230].

## practice: guardrails
- **Alibaba Qwen, 2025-10:** Qwen3Guard returns safe, controversial or unsafe with one of nine categories, in generative and streaming variants (a token-level head for checking a response as it is produced), across 119 languages; the 8B generative model reports F1 90.0 on English prompts and 83.9 on English responses against WildGuard-7B at 85.8 and 79.9 [S221].
- **DeepSeek, 2025-09:** the R1 paper describes a "risk control system" of "Potential Risky Dialogue Filtering" and "Model-based Risk Review", and states that with it "the safety level of the model is increased to a superior standard"; the system is not shipped with the weights [S214][S153].
- **Context, TC260, 2024-02:** China's Basic Safety Requirements for Generative AI Services ask providers to cover corpus safety, model safety, safety measures and safety assessment against more than 30 listed risks [S233].

## practice: red-teaming
- **Moonshot AI, 2025-07:** "We conducted red-teaming evaluations on Kimi K2 compare with other open-source LLMs": five categories (Harmful, Criminal, Misinformation, Privacy, Security) by four strategies (Basic, Prompt Injection, Iterative Jailbreak, Crescendo), "3 attack prompts per plugin for each strategy", passing rates from 100 (Criminal, Basic) to 43.90 (Security, Iterative Jailbreak), with "multiple rounds of review" by humans [S224].
- **DeepSeek, 2025-09:** the R1 safety report covers "safety levels across several languages and against jailbreak attacks" and concedes that "R1 can be subject to jailbreak attacks, leading to the generation of dangerous content such as explosive manufacturing plans" [S214].
- **Context, NIST CAISI, 2025-09:** an outside tester found DeepSeek R1-0528 "responded to 94% of overtly malicious requests" under common jailbreaks against 8% for US reference models [S218].
- **Context, UK AISI and US CAISI, 2026-07:** Kimi K3's "safeguards did not prevent it from attempting cyber exploit development or offensive cyber operations", while the US comparison models ran with safeguards disabled [S228].

## practice: frontier-safety-frameworks
- **Zhipu, 2024-05:** Zhipu.ai signed the Seoul commitments to red-team "for severe and novel threats", set thresholds at which risks "would be deemed intolerable", and publish "a safety framework focused on severe risks" by February 2025; METR's tracker lists no Zhipu framework as of 2026-09-27 [S234][S116].
- **DeepSeek, 2024-12:** signed the Chinese "Artificial Intelligence Safety Commitments" convened by CAICT, which Carnegie describes as promising red-teaming, transparency and organisational security without explicit thresholds [S235].
- **Alibaba Qwen and Moonshot AI, 2026-09:** no framework found; neither is a Seoul signatory and neither appears on METR's tracker [S234][S116].
- **Context, Concordia AI, 2026-07:** "only five of ten leading foundation-model developers reported safety evaluation results when releasing models this past year. No company did so consistently" [S232].

## practice: model-and-system-cards
- **DeepSeek, 2026-04:** the V4 "Technical Documentation" covers provider, release date, architecture, sizes, distribution, licence, acceptable use, intended use and training-data handling, and has no evaluation or safety section [S216].
- **Moonshot AI, 2026-07:** the Kimi-K3 card carries capability tables with run counts and sampling settings, links a "Full Report" PDF, and has brief refusal notes on cyber benchmarks and no safety section [S226].
- **Zhipu, 2026-02:** the GLM-5 card states per-task sampling settings and context windows and a modified Terminal-Bench 2.0; no safety statement [S230].
- **Alibaba Qwen, living:** Qwen3 and Qwen3.5 cards carry a Best Practices block on sampling and output format and no safety statement [S222][S223].
- **Zhipu, 2025-08:** GLM-4.5 is the one report here with a safety table, SafetyBench 89.9 over 11,435 multiple-choice questions in seven categories [S229].

## practice: regression-on-upgrade
- **DeepSeek, living:** the API's deepseek-flash alias "replaced" deepseek-v4-flash and deepseek-v4-flash-vision-exp and is now served by DeepSeek-V4.1-Flash; deepseek-v4-pro resolves to DeepSeek-V4-Pro-0813. An alias can change model under a fixed name [S217].
- **Alibaba Qwen, living:** the Qwen3.5 card recommends different sampling values per mode and per task type (general, coding, instruct) from the Qwen3 card's, so a pinned prompt and sampler may need re-tuning on upgrade [S222][S223].
- **Moonshot AI, 2025-07 to 2026-07:** K2's report includes a red-teaming table; the K2.5 report and K3 card do not, so a deployer has no lab-published safety baseline to diff against across the upgrade [S224][S225][S226].

## practice: tool-use-evals
- **DeepSeek, 2025-12:** "Tool-use benchmarks are evaluated using the standard function call format, wherein models are configured to thinking mode", with tool outputs in the tool role; tau2-Bench 80.3, MCP-Universe 45.9, MCP-Mark 38.0, Tool-Decathlon 35.2 [S215].
- **Zhipu, 2025-08:** BFCL V3 77.8 and TAU-Bench retail 79.7 and airline 60.4 with an "optimized user simulator" [S229].
- **Moonshot AI, 2025-07:** Tau2-Bench 70.6 (Avg@4) and ACEBench 76.5, with output capped at 8192 tokens [S224].
- **Alibaba Qwen, 2025-05:** BFCL v3 70.8 in thinking mode and 68.0 in non-thinking mode for the 235B-A22B flagship [S220].

## practice: agent-evals
- **DeepSeek, 2025-12:** SWE-bench Verified 73.1 and Terminal Bench 2.0 46.4 "using the Claude Code framework"; BrowseComp needed context management because "approximately 20%+ of the test cases exceed" the 128K limit [S215].
- **Moonshot AI, 2026-02:** K2.5 reports BrowseComp under three harness conditions (60.6, 74.9, 78.4) and OSWorld-Verified 63.3; the Agent Swarm result replaces token counts with a "critical steps" metric [S225].
- **Zhipu, 2025-08 and 2026-02:** CC-Bench, 52 tasks in isolated containers scored as a win rate against Claude Sonnet 4, and an internal CC-Bench-V2 for GLM-5; RL used "over 10k verifiable environments" across nine languages [S229][S230].
- **Context, UK AISI and US CAISI, 2026-07:** a 41-task public exploit benchmark and a private 32-step cyber range, scored as success rate, arbitrary code execution count and steps reached, with a single-benchmark confidence caveat [S228].

## practice: standards-and-regulation
- **Context, TC260, 2024-02:** the Basic Safety Requirements for Generative AI Services (CSET translation) set corpus safety, model safety, safety measures and safety assessment obligations and list more than 30 risks, with a supply chain security assessment clause [S233].
- **Context, UK DSIT, 2024-05:** the Seoul commitments list Zhipu.ai among initial signatories and Minimax and 01.ai among later additions; DeepSeek, Alibaba, Moonshot AI and ByteDance are absent [S234].
