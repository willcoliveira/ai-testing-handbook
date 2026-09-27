---
id: fine-tuning-evals
title: Fine-tuning evals
area: 7-training-and-lifecycle
status: draft
last_reviewed: 2026-09-27
sources: [S143, S144, S145, S148, S152, S155, S247, S254, S257]
related: [post-training-evals, golden-datasets, eval-driven-development, regression-on-upgrade, data-contamination, statistical-treatment-of-evals, judge-calibration]
---

# Fine-tuning evals

## What
A fine-tuning eval answers one question with three arms: does the fine-tuned model beat the base model with your best prompt, on a held-out set the training loop never saw, by enough to pay for the training and for owning a dated snapshot. The methods are supervised fine-tuning (SFT), vision fine-tuning, direct preference optimization (DPO) and reinforcement fine-tuning (RFT); the checks are the same for all four.

## Why
OpenAI's own optimisation guide orders the work as evals first, then prompting, then fine-tuning, and suggests writing evals "before you start writing prompts, taking an approach akin to behavior-driven development (BDD)" [S145]. Without the base-plus-prompt arm a fine-tune can look like an improvement that a longer system prompt would have matched for free. Without a held-out set the validation metric that picked the checkpoint becomes the headline number. The trade-off: a fine-tuned model is a dated snapshot with its own deprecation and, on OpenAI, a platform whose availability is now restricted [S144] [S148], so the eval has to justify a maintenance cost, not only a delta.

## How
1. **Baseline on the base model.** Run the offline suite N times on the base model with your best prompt; see [non-determinism-and-pass-rates](../2-application-evals/non-determinism-and-pass-rates.md). RFT needs a baseline that is neither floor nor ceiling: "If your eval scores between minimum and maximum possible scores, you'll have enough data to work with" [S144].
2. **Pick the method from the failure mode.** SFT: "Provide examples of correct responses to prompts", for classification, translation, format generation and instruction-following corrections. DPO: "Provide both a correct and incorrect example response for a prompt", for tone, style and summarisation. RFT: "Generate a response for a prompt, provide an expert grade for the result", for domain reasoning, reasoning models only (o4-mini-2025-04-16 when checked) [S145] [S144]. Do not use RFT when experts disagree on the answer, the task is ambiguous, the baseline is 0%, or lucky guesses score well [S144].
3. **Split three ways.** Training, validation and a held-out test set that nobody tunes on. RFT requires a validation split, caps at 50,000 training and 1,000 test examples, and recommends starting "between several dozen and a few hundred examples" [S144]. Decontaminate training data against the test set with an n-gram check before the job starts; see [data-contamination](data-contamination.md) and [S155].
4. **Make the grader gradeable.** RFT graders are `string_check`, `text_similarity`, `score_model`, `label_model`, `python` and `multi` (a weighted combination), returning a reward from 0 to 1 [S144]. A grader an engineer cannot explain is a reward the model will learn to game.
5. **Watch train against validation.** Monitor `train_reward_mean` and `valid_reward_mean` per step; a rising train reward with a flat validation reward is overfitting; checkpoints let you evaluate intermediate models [S144]. Llama 3's equivalent selection step is rejection sampling with a reward model that keeps the best of 10 to 30 samples, and quality filters that keep the top quartile of RM scores [S143].
6. **Compare three arms on the held-out set.** Base plus prompt, fine-tuned, fine-tuned plus prompt, same N runs, same judge, reported as pass-rate distributions with error bars. DPO's paper evaluated with a GPT-4 judge win rate against a reference [S152]; if you do the same, calibrate the judge first. See [judge-calibration](../3-judging/judge-calibration.md).
7. **Inspect for reward hacking before deployment.** OpenAI's guide says to inspect evals after training to detect reward hacking or overfitting; read a sample of outputs, not only the score [S144].
8. **Record the snapshot as a build input.** The fine-tuned model id, the base model id, the data version and the grader version go in the same place as the prompt version; the base snapshot's retirement date becomes the fine-tune's. See [regression-on-upgrade](regression-on-upgrade.md).

| Arm | Model | Prompt | Purpose |
|---|---|---|---|
| A | base snapshot | best prompt | the free alternative |
| B | fine-tuned | minimal prompt | what training bought |
| C | fine-tuned | best prompt | what ships |

Ship C only if C beats A on the held-out set by more than the run-to-run spread, and B is not worse than A on the criteria you did not train for.

| Method | Data per example | Fits when | Does not fit when |
|---|---|---|---|
| SFT | prompt and correct response | format, classification, instruction corrections [S145] | the right answer is a matter of taste |
| DPO | prompt, chosen and rejected response | tone, style, summarisation [S145] [S152] | no clear pair can be written |
| RFT | prompt and a grader | domain reasoning with a checkable answer [S144] | experts disagree, 0% baseline, guessable [S144] |

## Who does it (sourced)
- **OpenAI, living (checked 2026-09-26), model optimisation guide:** "Write evals that measure model output, establishing a baseline for performance and accuracy"; then prompt, optionally fine-tune, "Run your evals against test inputs like you expect to see in production", repeat [S145].
- **OpenAI, living (checked 2026-09-26), RFT guide:** mandatory validation split; 50,000 training and 1,000 test example caps; `valid_reward_mean`; six grader types; the page states "OpenAI is winding down the fine-tuning platform. The platform is no longer accessible to new users" [S144].
- **OpenAI, living (checked 2026-09-26), deprecations:** an entry dated 2026-05-07 for fine-tuning availability restrictions, with a date of 2027-01-06 [S148].
- **Meta, 2024-07-31:** rejection sampling with K between 10 and 30 and reward-model quality filtering as the selection step before SFT [S143].
- **Rafailov et al., 2023-05-29:** DPO evaluated by GPT-4 judged win rates on summarisation and dialogue [S152].
- **Microsoft, 2026-02:** a leading indicator assessment is triggered when Microsoft "substantially fine-tunes first- or third-party models, where the compute used for fine-tuning is more than 1/3 of the base model", defaulting to a third of 10^25 FLOPs when base compute is unknown [S247].
- **Amazon, 2025-12:** the service card says customization "can impact safety, fairness and other properties of the new model", that Amazon's adaptation method aims to minimise changes to built-in protections, and that "After any customization, customers should test their model according to their own responsible AI policies" [S257].
- **Amazon, 2026-09:** the framework lists "Fine-tuning Safeguards" and says Amazon observes "signals in the fine-tuning recipe" that could raise misalignment and takes "corrective actions" [S254].

## Pitfalls
1. **No base-plus-prompt arm.** The delta is measured against nothing [S145].
2. **Validation set reported as the result.** It chose the checkpoint; it is no longer held out [S144].
3. **A gameable grader.** "Lucky guesses yield high rewards" is a listed reason not to run RFT at all [S144].
4. **Training data that overlaps the test set.** N-gram overlap is the minimum check; paraphrases pass it [S155].
5. **Forgetting the snapshot retires.** Fine-tunes ride on a dated base model with a shutdown date, and the platform itself is subject to deprecation notices [S148].

## Pattern from a production build
None yet.

## Sources
- [S143] The Llama 3 Herd of Models, Meta AI, 2024-07-31.
- [S144] Reinforcement fine-tuning guide, OpenAI API docs, living, checked 2026-09-26.
- [S145] Model optimization guide, OpenAI API docs, living, checked 2026-09-26.
- [S148] Deprecations, OpenAI API docs, living, checked 2026-09-26.
- [S152] Direct Preference Optimization: Your Language Model is Secretly a Reward Model, Rafailov et al., 2023-05-29.
- [S155] Benchmark Data Contamination of Large Language Models: A Survey, Xu et al., 2024-06-06.
- [S247] Frontier Governance Framework, Microsoft, 2026-02
- [S257] Amazon Nova 2 Lite, AWS AI Service Card, AWS, living
- [S254] Amazon's Frontier Model Safety Framework (September 2026 update), Amazon, 2026-09-17
