# Training and model lifecycle

This folder is the reading order for area 7 of the taxonomy: what changes when the model changes, and what the labs and the tool vendors say they measure at each step. Four practices own the detail:

- [post-training-evals](../practices/7-training-and-lifecycle/post-training-evals.md): what SFT, RLHF, DPO and RL with verifiable rewards are, and what is evaluated at each stage.
- [fine-tuning-evals](../practices/7-training-and-lifecycle/fine-tuning-evals.md): how to know a fine-tune beat the base model and a prompt, and what is held out.
- [regression-on-upgrade](../practices/7-training-and-lifecycle/regression-on-upgrade.md): what to run before a model id changes, how to pin, what deprecations mean.
- [data-contamination](../practices/7-training-and-lifecycle/data-contamination.md): how eval data leaks into training, how it is detected, how a private set stays clean.

Every claim about a lab is what the lab published, with a source id. Where a threshold or a gate is not public, this page says unknown.

## Pre-training versus post-training evaluation

Pre-training produces a base model from a large corpus; its native metric is loss on held-out text, and its public scorecard is a set of capability benchmarks. Post-training is everything after that checkpoint: supervised fine-tuning on demonstrations, preference optimisation, and reinforcement learning against rules. The evaluation questions differ. Pre-training asks how much the model knows and how well it predicts; post-training asks whether it follows instructions, whether people prefer its answers, whether it refuses what it should and only that, and whether the gains came from the intended signal rather than from a leaked benchmark or a gamed reward.

Two consequences for an application team. First, a benchmark score on a model card is mostly a post-training result, so the post-training recipe and its contamination policy decide how much the number means [S143] [S155]. Second, a base model and its post-trained sibling are different products; the eval you run on one does not transfer to the other.

## The stages, and what each paper says is evaluated

**Supervised fine-tuning (SFT).** The model is trained on prompt and response pairs written by people or selected from its own samples. InstructGPT's SFT set was "about 13k training prompts (from the API and labeler-written)" [S150]. Llama 3 builds its SFT data largely by rejection sampling: for each prompt, draw K outputs, "typically between 10 and 30", and keep the one the reward model scores highest, then filter with rule-based cleaning, an RM score in the top quartile, a model-rated quality score, difficulty scoring, semantic deduplication and a topic classifier [S143]. What is evaluated: downstream preference and benchmark results, not SFT loss alone.

**Reward modelling and RLHF with PPO.** A reward model is trained on pairwise human comparisons, and the policy is optimised against it with proximal policy optimization. InstructGPT used 33k prompts for the reward model and 31k for PPO, "a team of about 40 contractors", and evaluated with held-out labelers: "training labelers agree with each-other 72.6±1.5% of the time, while for held-out labelers this number is 77.3±1.3%" [S150]. The headline result is a human preference: 1.3B InstructGPT outputs "are preferred to outputs from the 175B GPT-3" [S150]. The known cost is an alignment tax on public NLP benchmarks, mitigated by PPO-ptx, which mixes pre-training gradient updates into the RL step [S150].

**Constitutional AI (RLAIF).** Anthropic's 2022 method replaces human harmlessness labels with model-generated ones under a written list of principles: a supervised phase that samples, self-critiques and revises, then an RL phase in which "a model [evaluates] which of the two samples is better" and a preference model is trained on those AI preferences [S151]. What is evaluated: crowdworker comparisons on harmlessness and helpfulness.

**Direct preference optimization (DPO).** DPO drops the explicit reward model and the RL loop and optimises the policy on preference pairs with "only a simple classification loss" [S152]. The paper evaluates on sentiment control, TL;DR summarisation and Anthropic HH dialogue against PPO-based RLHF, using a GPT-4 judge for win rates [S152]. Llama 3 chose DPO for its final stage because "DPO required less compute for large-scale models and performed better, especially on instruction following benchmarks like IFEval" [S143].

**RL with verifiable rewards (RLVR).** The reward is a rule, not a learned model: a maths answer matched to a reference, code run against a test suite, a format check. DeepSeek-R1-Zero applied this directly to a base model with GRPO and no SFT, and the authors state they avoided neural reward models because they "are susceptible to reward hacking during large-scale reinforcement learning" [S153]. What is evaluated: pass@1 on AIME 2024 (79.8), MATH-500 (97.3), GPQA Diamond (71.5), MMLU (90.8) and SWE-bench Verified (49.2), plus readability and language consistency, which R1-Zero failed and R1 fixed with cold-start SFT and a language-consistency reward [S153].

## What gates each stage, per Llama 3 and the other sources

Llama 3 is the most complete public recipe. Meta says "we apply the above methods in six rounds", each round training a reward model on fresh preference data, then SFT, then DPO, with preference labels at four strengths and a portion of data ranked edited over chosen over rejected [S143]. The final post-trained 405B scorecard includes MMLU 87.3, IFEval 88.6, HumanEval 89.0, GSM8K 96.8, MATH 73.8, GPQA 51.1 and BFCL 88.5, human pairwise evaluations, and safety reported as a violation rate and a false refusal rate [S143]. Contamination is handled by excluding benchmark training sets from annealing data and by an 8-gram overlap analysis [S143].

What is not public, across all five papers: the numeric criterion that let one round proceed to the next, and the human-evaluation win rate a release had to reach. Treat any such figure attributed to a lab as unsourced unless it carries an id in `sources.md`.

| Stage | Signal | Public evaluation | Gate criterion |
|---|---|---|---|
| SFT | demonstrations, rejection-sampled outputs | benchmarks, preference [S143] [S150] | unknown |
| Reward model | pairwise labels | held-out labeler agreement [S150] | unknown |
| PPO | reward model | human win rate, alignment-tax benchmarks [S150] | unknown |
| DPO | preference pairs | judge win rate, IFEval [S152] [S143] | unknown |
| RLVR | rule-based verifiers | pass@1, format, language consistency [S153] | unknown |

## Fine-tuning evals and held-out discipline

A team that fine-tunes owns the same questions at small scale. OpenAI's optimisation guide orders the work as evals, then prompting, then fine-tuning, and suggests writing evals "before you start writing prompts" [S145]. Its reinforcement fine-tuning guide requires a validation split, caps jobs at 50,000 training and 1,000 test examples, recommends starting "between several dozen and a few hundred examples", exposes `train_reward_mean` and `valid_reward_mean`, and lists when not to use RFT: experts disagree, the task is ambiguous, the baseline is 0%, or lucky guesses score well [S144]. The grader menu is `string_check`, `text_similarity`, `score_model`, `label_model`, `python` and `multi` [S144].

The discipline is three-way: training data, a validation set that picks the checkpoint, and a held-out test set that nobody tunes on and that is decontaminated against the training file with at least an n-gram check [S155]. The comparison is three arms on that held-out set, base plus best prompt, fine-tuned, fine-tuned plus prompt, each run N times. Details in [fine-tuning-evals](../practices/7-training-and-lifecycle/fine-tuning-evals.md). Note the platform risk: OpenAI's RFT page states "OpenAI is winding down the fine-tuning platform. The platform is no longer accessible to new users", and its deprecations page carries a 2026-05-07 entry for fine-tuning availability restrictions dated 2027-01-06 [S144] [S148].

## Retraining cadence

No lab publishes a retraining schedule. What is observable is the release and retirement cadence and the behaviour change between snapshots. Chen, Zaharia and Zou compared March and June 2023 snapshots of GPT-3.5 and GPT-4 and found GPT-4's prime identification fell from 84% to 51% on 1,000 questions, its sensitive-question response rate from 21% to 5%, and its directly executable LeetCode solutions from 52% to 10%; their conclusion is "the need for continuous monitoring of LLMs" [S149]. Anthropic's deprecation history lists nine notices between 2024-09-04 and 2026-06-05 [S147]; OpenAI's lists ten entries between 2026-04-22 and 2026-09-11 alone [S148]. For an application team the cadence that matters is therefore set by the provider's calendar, and the retraining question for a fine-tune is: the base snapshot retires on a known date, so the fine-tune must be re-run and re-evaluated before it.

## Regression on upgrade

Before a model id changes: pin dated snapshot ids rather than aliases [S148]; check the request builder against the version's breaking changes, because Anthropic returns a 400 for `temperature`, `top_p` and `top_k` on Opus 4.7 and later and for assistant prefills on the 4.6 models, and a changed model string invalidates the prompt cache [S146] [S147]; run one request and inspect `stop_reason` and `usage` [S146]; then run the offline suite N times on both ids and compare pass-rate distributions, not single runs. Turn the release notes into criteria: "More literal instruction following", more narration, longer responses, each is a case [S146]. Roll out as a canary with the old id kept until its retirement date. Details in [regression-on-upgrade](../practices/7-training-and-lifecycle/regression-on-upgrade.md) and in the pattern it cites.

## Deprecation calendars

Anthropic defines four states, active, legacy, deprecated and retired, gives "at least 60 days' notice before model retirement for publicly released models", states that "Requests to models past the retirement date will fail", offers a usage export by API key and model, and notes that Amazon Bedrock and Google Cloud "set their own retirement schedules" [S147]. Recent entries: Opus 4.1 notified 2026-06-05, retired 2026-08-05; Sonnet 4 and Opus 4 notified 2026-04-14, retired 2026-06-15 [S147]. OpenAI states that a model "immediately becomes deprecated" on announcement, with at least six months' notice for generally available models, three for specialised variants and about two weeks for previews; its latest entry is `gpt-5.4-cyber`, announced 2026-09-11, shutdown 2026-10-01 [S148].

A calendar entry per model id in use, with status, deprecation date, retirement date and recommended replacement, is the minimum. Fine-tuned models and judge models get entries too.

## Data contamination

Contamination is the reason a benchmark number can overstate capability. Xu et al. define it, give a four-level taxonomy (semantic, information, data, label), and group detection into matching-based (n-gram overlap, membership inference) and comparison-based (perplexity, chronological) methods [S155]. GSM1k shows the effect: a private, human-written mirror of GSM8K on which several open model families scored up to 8 points lower, with a Spearman r² of 0.36 between a model's likelihood of GSM8K examples and its gap, and with the caveat that overfitting also comes from "model builders collecting data similar in nature to benchmarks" [S154]. Llama 3's policy, excluding benchmark training sets from annealing and checking 8-gram overlap, is the published lab-side control [S143]. Details in [data-contamination](../practices/7-training-and-lifecycle/data-contamination.md).

## Sources cited on this page

- [S143] The Llama 3 Herd of Models, Meta AI, 2024-07-31.
- [S144] Reinforcement fine-tuning guide, OpenAI API docs, living, checked 2026-09-26.
- [S145] Model optimization guide, OpenAI API docs, living, checked 2026-09-26.
- [S146] Claude API skill, model migration reference, Anthropic (anthropics/skills), living, checked 2026-09-26.
- [S147] Model deprecations, Anthropic Claude Platform docs, living, checked 2026-09-26.
- [S148] Deprecations, OpenAI API docs, living, checked 2026-09-26.
- [S149] How Is ChatGPT's Behavior Changing over Time?, Chen, Zaharia and Zou, 2023-07-18.
- [S150] Training language models to follow instructions with human feedback, OpenAI, 2022-03-04.
- [S151] Constitutional AI: Harmlessness from AI Feedback, Anthropic, 2022-12-15.
- [S152] Direct Preference Optimization, Rafailov et al., 2023-05-29.
- [S153] DeepSeek-R1, DeepSeek-AI, 2025-01-22.
- [S154] A Careful Examination of Large Language Model Performance on Grade School Arithmetic, Scale AI, 2024-05-01.
- [S155] Benchmark Data Contamination of Large Language Models: A Survey, Xu et al., 2024-06-06.
