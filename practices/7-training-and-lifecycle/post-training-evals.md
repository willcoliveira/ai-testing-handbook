---
id: post-training-evals
title: Post-training evals
area: 7-training-and-lifecycle
status: draft
last_reviewed: 2026-09-27
sources: [S143, S150, S151, S152, S153, S215, S220, S225, S229, S242, S247, S248, S255, S265, S268, S272, S278]
related: [fine-tuning-evals, capability-benchmarks, statistical-treatment-of-evals, data-contamination, frontier-safety-frameworks, model-and-system-cards]
---

# Post-training evals

## What
Post-training is everything a lab does to a pre-trained checkpoint to make it follow instructions and behave: supervised fine-tuning (SFT) on demonstrations, reward modelling and reinforcement learning from human feedback (RLHF), direct preference optimization (DPO), and reinforcement learning with verifiable rewards (RLVR). Post-training evals are the measurements a lab says it takes at each of those stages: held-out preference win rates, benchmark suites, safety violation and false-refusal rates, and contamination checks. This page records what the published recipes say is evaluated where, and marks the thresholds that are not public as unknown.

## Why
A pre-training loss says nothing about whether a model refuses a harmful request or follows a formatting instruction, and a benchmark score says nothing about whether a preference-tuned model got there by gaming its reward model. Each post-training stage introduces a new failure mode: SFT overfits to demonstration style, a learned reward model can be hacked, DPO depends on preference-pair quality, and RLVR can trade readability for correctness. The papers below are useful because they describe the check used at each step. The trade-off in reading them: every recipe is a description of what a lab did once, with numbers, not a gate a reader can copy, and the pass and fail criteria a lab applied between rounds are mostly not published.

## How
| Stage | Trains on | Signal | What the papers say is evaluated |
|---|---|---|---|
| SFT | demonstrations, or rejection-sampled outputs | human-written or reward-selected targets | downstream preference and benchmarks [S150] [S143] |
| Reward model | pairwise comparisons | human labels | agreement with held-out labelers [S150] |
| RLHF (PPO) | policy against the reward model | scalar reward | human win rate on the API prompt distribution; public NLP benchmarks for the alignment tax [S150] |
| DPO | policy on preference pairs directly | classification loss, no reward model | judge win rates against a reference; instruction-following benchmarks [S152] [S143] |
| RLVR | policy against rule-based verifiers | exact match, test suites, format rewards | pass@1 on maths and code sets, format compliance, language consistency [S153] |
| Constitutional AI (RLAIF) | critique-and-revision data, then AI preference labels | model-generated preferences under a rule list | crowdworker comparisons for harmlessness and helpfulness [S151] |

Read a lab's recipe with these questions:
1. **What is held out?** InstructGPT used held-out labelers: "training labelers agree with each-other 72.6±1.5% of the time, while for held-out labelers this number is 77.3±1.3%" [S150]. Llama 3 states "We do not include any training sets from commonly used benchmarks in our annealing data" and reports an 8-gram overlap check between benchmarks and training data [S143].
2. **How many rounds, and what gates each?** Llama 3 says "we apply the above methods in six rounds": reward model, then SFT, then DPO, per round, with preference labels at four strengths (significantly better, better, slightly better, marginally better) and a portion of the data ranked edited > chosen > rejected [S143]. The criteria used to end a round are not published; treat them as unknown.
3. **How is training data filtered?** Llama 3 describes rule-based removal, an RM-based score keeping the top quartile, a Llama-rated three-point quality score (two-point for code), difficulty scoring, semantic deduplication and a topic classifier fine-tuned from Llama 3 8B; rejection sampling draws K outputs, "typically between 10 and 30", and keeps the reward model's best [S143].
4. **Why this optimiser?** Llama 3: "DPO required less compute for large-scale models and performed better, especially on instruction following benchmarks like IFEval" [S143]. DeepSeek-R1 avoided learned reward models for reasoning because "neural reward models are susceptible to reward hacking during large-scale reinforcement learning" and used rule-based accuracy and format rewards with GRPO [S153].
5. **What is the final scorecard?** Llama 3 405B post-trained: MMLU 87.3, IFEval 88.6, HumanEval 89.0, GSM8K 96.8, MATH 73.8, GPQA 51.1, BFCL 88.5, plus human pairwise evaluations and safety measured as violation rate and false refusal rate [S143]. DeepSeek-R1: AIME 2024 pass@1 79.8, MATH-500 97.3, GPQA Diamond 71.5, MMLU 90.8, SWE-bench Verified 49.2 [S153]. InstructGPT: 1.3B outputs "are preferred to outputs from the 175B GPT-3", with TruthfulQA and RealToxicityPrompts for truthfulness and toxicity [S150].
6. **What regressed and how was it paid for?** InstructGPT reports an alignment tax on public NLP tasks and mitigates it with PPO-ptx, mixing pre-training gradient updates into the RL step [S150]. DeepSeek-R1-Zero showed "poor readability and language mixing", fixed with cold-start SFT data and a language-consistency reward [S153].

For an application team the transferable discipline is the table's last column: a held-out human set for preference stages, a benchmark suite plus a contamination check for capability, a verifier-based pass@1 for reasoning, and a refusal-rate pair (violations and false refusals) for safety.

What is public and what is not, as of 2026-09-26:

| Question | Llama 3 [S143] | InstructGPT [S150] | DeepSeek-R1 [S153] |
|---|---|---|---|
| Stages and order | yes | yes | yes |
| Data sizes | partial (K, quartiles) | yes (13k, 33k, 31k prompts) | partial ("thousands" of cold-start samples) |
| Held-out design | annealing exclusion, n-gram check | held-out labelers | not stated |
| Gate between rounds | not published | not published | not published |
| Final benchmarks | yes | yes, plus human preference | yes |

## Who does it (sourced)
- **OpenAI, 2022-03-04 (InstructGPT):** three steps, SFT, reward model, PPO; "about 13k training prompts" for SFT, 33k for the RM, 31k for PPO; "a team of about 40 contractors"; held-out labelers for evaluation [S150].
- **Anthropic, 2022-12-15 (Constitutional AI):** a supervised phase that samples, self-critiques and revises, then an RL phase that uses "a model to evaluate which of the two samples is better" and trains a preference model on AI preferences [S151].
- **Rafailov et al., 2023-05-29 (DPO):** "solve the standard RLHF problem with only a simple classification loss"; evaluated on sentiment control, TL;DR summarisation and Anthropic HH dialogue against PPO-based RLHF [S152].
- **Meta, 2024-07-31 (Llama 3):** six rounds of RM, SFT and DPO; rejection sampling with K of 10 to 30; quality filtering by RM top quartile and model-rated scores; DPO chosen over PPO on compute and IFEval [S143].
- **DeepSeek, 2025-01-22 (DeepSeek-R1):** R1-Zero trained by RL directly on the base model with GRPO and rule-based rewards; R1 adds cold-start SFT, reasoning RL with a language-consistency reward, rejection-sampled SFT and a second RL stage [S153].
- **Alibaba Qwen, 2025-05:** four stages, a long chain-of-thought cold start, reasoning RL with GRPO over "3,995 query-verifier pairs", thinking mode fusion, and general RL over "20 distinct tasks" with "Rule-based, Model-based with Reference Answer, Model-based without Reference Answer" rewards; benchmarks are reported after the final stage only [S220].
- **DeepSeek, 2025-12:** V3.2's RL uses "a generative reward model where each prompt has its own rubrics for evaluation" for general tasks and synthetic agent environments, over 1,800 of them with 85,000 prompts, for tool use [S215].
- **Moonshot AI, 2026-02:** K2.5's RL uses generative reward models "aligned with Kimi's internal value criteria"; the criteria are not published [S225].
- **Zhipu, 2025-08:** GLM-4.5 trains experts by iteration and then RL; the human check is 660 prompts scored 0 to 10 by a "single, consistent evaluator" with reasoning traces hidden [S229].
- **Microsoft, 2026-02:** frontier models are screened "after post-training" as one of four fixed checkpoints, and again if there is "significant fine-tuning that might affect tracked high-risk capabilities" [S247].
- **Microsoft, 2024-12:** Phi-4's safety post-training used "SFT (Supervised Fine-Tuning) and iterative DPO" and was then assessed by the AI Red Team [S248].
- **Google, 2026-07:** the Gemma 4 report pairs "post-training evaluations and train-time mitigations" and reports "minimal policy violations" across sizes and modalities [S242].
- **Amazon, 2025-12:** Nova 2 was evaluated "in reasoning and non-reasoning modes" and red-teaming insights "directly informed model refinements prior to release" [S255].
- **AI2, December 2025:** the post-training suite is run at every stage (SFT, DPO, RL) under one configuration, and "evaluation costs between 10 and 20% of our compute budget" during recipe development [S278].
- **Cohere, April 2025:** "while model merging is cheap and fast, evaluating each merge requires significant inference time and compute", and polishing progress is tracked by win rate against a fixed competitor [S272].
- **xAI, April 2026:** "During training, we penalize harmful model propensities" using an LLM judge on rollouts, then measures the same propensities (MASK, sycophancy) on the deployed checkpoint [S265].
- **NVIDIA, December 2025:** safety SFT data is built from named datasets and "A content-safety classifier is employed to filter the responses"; no safety results table follows [S268].

## Pitfalls
1. **A learned reward model as the only judge.** DeepSeek states neural reward models were hacked at scale; verify with rules where a rule exists [S153].
2. **Evaluating with the people who labelled the training data.** Agreement figures differ between training and held-out labelers; report the held-out one [S150].
3. **Benchmark training sets in the late-stage data.** Llama 3 excludes them from annealing and checks n-gram overlap; a team that fine-tunes on GSM8K train and reports GSM8K test is measuring memory [S143]. See [data-contamination](data-contamination.md).
4. **Correctness without readability.** RLVR can raise pass@1 while mixing languages inside one answer; measure format and language consistency alongside accuracy [S153].
5. **Reading a paper's numbers as a gate.** The papers give what was measured, not the threshold that let a round proceed; write "unknown" rather than infer [S143] [S150].

## Pattern from a production build
None yet.

## Sources
- [S143] The Llama 3 Herd of Models, Meta AI, 2024-07-31.
- [S150] Training language models to follow instructions with human feedback, OpenAI, 2022-03-04.
- [S151] Constitutional AI: Harmlessness from AI Feedback, Anthropic, 2022-12-15.
- [S152] Direct Preference Optimization: Your Language Model is Secretly a Reward Model, Rafailov et al., 2023-05-29.
- [S153] DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning, DeepSeek-AI, 2025-01-22.
- [S220] Qwen3 Technical Report, Qwen Team, Alibaba (arXiv 2505.09388), 2025-05-14
- [S215] DeepSeek-V3.2: Pushing the Frontier of Open Large Language Models, DeepSeek-AI (arXiv 2512.02556), 2025-12-02
- [S225] Kimi K2.5: Visual Agentic Intelligence, Moonshot AI (arXiv 2602.02276), 2026-02-02
- [S229] GLM-4.5: Agentic, Reasoning, and Coding (ARC) Foundation Models, Zhipu AI and Tsinghua University (arXiv 2508.06471), 2025-08-08
- [S247] Frontier Governance Framework, Microsoft, 2026-02
- [S248] Phi-4 model card, Microsoft (Hugging Face), 2024-12-12
- [S242] Gemma 4 Technical Report, Gemma Team, Google, arXiv 2607.02770, 2026-07-02
- [S255] Amazon Nova 2: Multimodal Reasoning and Generation Models, technical report and model card, Amazon AGI, 2025-12
- [S278] Olmo 3 (technical report), Ai2 (Olmo Team), arXiv 2512.13961, 2025-12
- [S272] Command A: An Enterprise-Ready Large Language Model (technical report), Cohere, arXiv 2504.00698, 2025-04
- [S265] Grok 4.20 System Card, xAI, 2026-04-07
- [S268] Nemotron 3 Nano: Open, Efficient Mixture-of-Experts Hybrid Mamba-Transformer Model for Agentic Reasoning (technical report), NVIDIA, 2025-12-23
