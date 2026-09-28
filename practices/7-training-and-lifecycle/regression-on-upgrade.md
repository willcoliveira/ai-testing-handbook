---
id: regression-on-upgrade
title: Regression on upgrade
area: 7-training-and-lifecycle
status: draft
last_reviewed: 2026-09-28
sources: [S146, S147, S148, S149, S217, S222, S223, S224, S225, S226, S240, S251, S254, S257, S261, S266, S271, S290, S299]
related: [non-determinism-and-pass-rates, ci-gates-for-llm-apps, online-evals-and-drift, fine-tuning-evals, golden-datasets]
---

# Regression on upgrade

## What
Regression on upgrade is the check a team runs before a model id changes under an application: the same offline suite, run enough times on the old and the new version to compare pass-rate distributions rather than single runs, plus a check that the request itself still works, because labs remove parameters as well as models. It includes the calendar work: knowing when the current id retires, pinning ids rather than aliases, and keeping the old id available as a rollback until the retirement date.

## Why
Model changes are not optional. Anthropic gives "at least 60 days' notice before model retirement for publicly released models" and its history shows Opus 4.1 notified 2026-06-05 and retired 2026-08-05, Sonnet 4 and Opus 4 notified 2026-04-14 and retired 2026-06-15 [S147]. OpenAI gives at least six months for generally available models, three for specialised variants and as little as two weeks for previews [S148]. Behaviour moves even without a retirement: Chen, Zaharia and Zou found GPT-4's response rate on sensitive questions fell from 21% to 5% between March and June 2023 snapshots and directly executable LeetCode solutions fell from 52% to 10%, and "if LLM's response to a prompt (e.g. its accuracy or formatting) suddenly changes, this might break the downstream pipeline" [S149]. The trade-off: a full N-run suite on two versions costs tokens and time, and a two-pull-request model swap is slower than editing a string. Both are cheaper than discovering a format change in production.

## How
1. **Pin.** Use the dated snapshot id, not an alias; OpenAI lists aliases such as `gpt-3.5-turbo` that resolve to a dated snapshot such as `gpt-3.5-turbo-0125` [S148]. Anthropic ids carry dates for older models (`claude-sonnet-4-5-20250929`) and not for newer ones (`claude-sonnet-4-6`), so record the id string and the date you adopted it [S147]. Treat model id and prompt as build inputs; see [ci-gates-for-llm-apps](../2-application-evals/ci-gates-for-llm-apps.md).
2. **Keep a calendar.** Record, per model id in use: status (Anthropic: active, legacy, deprecated, retired), deprecation date, retirement date, recommended replacement [S147]. Partner platforms set their own dates: Amazon Bedrock and Google Cloud "set their own retirement schedules, so a model's lifecycle status and dates can differ" [S147]. Audit usage by exporting the Console usage CSV by API key and model [S147].
3. **Check the request before the behaviour.** Anthropic's migration guide lists breaking changes per version: `temperature`, `top_p` and `top_k` return a 400 on Opus 4.7 and later; assistant-turn prefills return a 400 on Opus 4.6 and Sonnet 4.6; `thinking: {type: 'enabled', budget_tokens: N}` becomes `thinking: {type: 'adaptive'}`; a changed model string invalidates the prompt cache [S146] [S147]. Run one request and inspect `stop_reason` and `usage` before any suite [S146].
4. **Run the suite N times on both.** Same cases, same judge, same N, both model ids; compare the pass-rate distribution per case and per criterion; gate on the threshold already used in CI; see [non-determinism-and-pass-rates](../2-application-evals/non-determinism-and-pass-rates.md). Alert on distribution shift, not only on the mean.
5. **Read the release notes for behaviour, then test for it.** The migration guide describes "More literal instruction following" on Opus 4.7, a model that "narrates more" and "asks more often" on 4.8, and longer responses on Opus 5 [S146]. Each becomes a criterion: verbatim compliance, unsolicited questions per turn, response length distribution. Add refusal rate and output format, the two dimensions Chen et al. saw move most [S149].
6. **Roll out with a rollback.** Canary a percentage on the new id, watch online scores, keep the old id configured until its retirement date; see [online-evals-and-drift](../6-observability/online-evals-and-drift.md).
7. **Repeat for fine-tunes and judges.** A fine-tuned model rides on a base snapshot with its own shutdown date; a judge model is a model id too [S148].

| Provider | Notice before retirement | Lifecycle terms | Where |
|---|---|---|---|
| Anthropic | at least 60 days | active, legacy, deprecated, retired | model deprecations page [S147] |
| OpenAI | 6 months GA, 3 months specialised, about 2 weeks preview | deprecated, legacy | deprecations page [S148] |
| Amazon Bedrock, Google Cloud | their own schedules | their own | partner model tables, per [S147] |

A pre-switch checklist, in order:

| Step | Evidence kept |
|---|---|
| One request on the new id; `stop_reason` and `usage` inspected | the response JSON [S146] |
| Parameters and prefills checked against the version's breaking changes | the diff of the request builder [S146] [S147] |
| Suite run N times on old and new id | pass-rate distribution per case, both versions |
| Behaviour criteria from the release notes added and run | new cases in the golden set [S146] |
| Canary percentage and rollback id configured | the deployment config |
| Retirement date of the new id in the calendar | the calendar entry [S147] [S148] |

## Who does it (sourced)
- **Anthropic, living (checked 2026-09-26):** lifecycle terms; "at least 60 days' notice"; "Requests to models past the retirement date will fail"; usage audit by CSV export; a stated commitment to long-term preservation of model weights; parameter deprecations for `temperature`, `top_p`, `top_k` on Claude 4.7 and later [S147].
- **OpenAI, living (checked 2026-09-26):** "When we announce that a model or endpoint is being deprecated, it immediately becomes deprecated"; notice periods by model class; entries dated 2026-09-11 (`gpt-5.4-cyber`, shutdown 2026-10-01), 2026-06-11 (GPT-5 and o3 snapshots, 2026-12-11) and 2026-04-22 (twelve legacy GPT snapshots, 2026-10-23) [S148].
- **Anthropic skills repository, living (checked 2026-09-26):** a migration reference listing current and retired ids with dates, per-version breaking changes and behaviour notes, and the instruction to run one test request and inspect `stop_reason` and `usage` [S146].
- **Chen, Zaharia and Zou, 2023-07-18:** the March-to-June 2023 measurements above; "the need for continuous monitoring of LLMs" [S149].
- **DeepSeek, living:** the API's deepseek-flash alias "replaced" deepseek-v4-flash and deepseek-v4-flash-vision-exp and is now served by DeepSeek-V4.1-Flash; deepseek-v4-pro resolves to DeepSeek-V4-Pro-0813. An alias can change model under a fixed name [S217].
- **Alibaba Qwen, living:** the Qwen3.5 card recommends different sampling values per mode and per task type (general, coding, instruct) from the Qwen3 card's, so a pinned prompt and sampler may need re-tuning on upgrade [S222][S223].
- **Moonshot AI, 2025-07 to 2026-07:** K2's report includes a red-teaming table; the K2.5 report and K3 card do not, so a deployer has no lab-published safety baseline to diff against across the upgrade [S224][S225][S226].
- **Google, 2026-09:** the Gemini 3.8 Flash card reports each safety and tone suite as a signed point change against Gemini 3.7 Flash rather than as an absolute score [S240].
- **Amazon, 2025-12:** "When we release new versions of Amazon Nova 2 Lite, customers may experience changes in performance on their use cases", so customers "should consider retesting the performance of the new Amazon Nova 2 Lite models on their use cases" [S257].
- **Amazon, 2026-09:** Amazon "will re-evaluate deployed models prior to any major updates that could meaningfully enhance underlying capabilities" [S254].
- **Microsoft, 2026-08:** the AI Red Teaming Agent is positioned for the development stage of "Upgrading models within your application or creating fine-tuned models" as well as pre-deployment [S251].
- **Cohere, February 2025:** the launch rule is "no significant regressions compared to our previously launched model versions"; regressions found in any pre-deployment evaluation "are investigated and mitigated before deployment" [S271].
- **Mistral, living:** `mistral-moderation-2411` was deprecated on March 31, 2026 in favour of `mistral-moderation-2603`, and the docs warn that threshold-based custom policies "can require recalibration" [S261].
- **xAI, September 2026:** each safety table reports Grok 4.5, 4.6 and 4.7 side by side on the same suites, which is what makes a regression visible [S266].
- **Apollo Research, 2026-07:** measured whether models are becoming aligned or better at concealing misalignment as training proceeds, a reason to re-run behavioural evaluations on every version [S290].
- **arXiv, 2026-09:** trajectory-aware subset selection is one way to keep a per-version regression replay affordable [S299].

## Pitfalls
1. **Aliases in production.** The alias moves when the provider says so; the dated id moves when you say so [S148].
2. **One run per version.** A single run cannot separate a regression from run-to-run spread; see [non-determinism-and-pass-rates](../2-application-evals/non-determinism-and-pass-rates.md) and [S149].
3. **The lab's date is not the platform's date.** Bedrock and Vertex schedules differ from Anthropic's [S147].
4. **A 400 before any behaviour is measured.** Removed parameters and prefills fail the call itself on newer versions [S146] [S147].
5. **Cache and cost.** A new model string starts the prompt cache cold; the first hours after a swap cost more per request [S146].
6. **Preview models in production.** About two weeks of notice is the stated floor [S148].

## Pattern from a production build
None yet.

## Sources
- [S146] Claude API skill, model migration reference, Anthropic (anthropics/skills), living, checked 2026-09-26.
- [S147] Model deprecations, Anthropic Claude Platform docs, living, checked 2026-09-26.
- [S148] Deprecations, OpenAI API docs, living, checked 2026-09-26.
- [S149] How Is ChatGPT's Behavior Changing over Time?, Chen, Zaharia and Zou, 2023-07-18.
- [S217] DeepSeek API docs: Models and Pricing, DeepSeek, living
- [S222] Qwen3-235B-A22B model card, Qwen Team, Alibaba (Hugging Face), living
- [S223] Qwen3.5-122B-A10B model card, Qwen Team, Alibaba (Hugging Face), living
- [S224] Kimi K2: Open Agentic Intelligence, Moonshot AI (arXiv 2507.20534), 2025-07-28
- [S225] Kimi K2.5: Visual Agentic Intelligence, Moonshot AI (arXiv 2602.02276), 2026-02-02
- [S226] Kimi-K3 model card, Moonshot AI (Hugging Face), living
- [S240] Gemini 3.8 Flash Model Card, Google DeepMind, 2026-09-02
- [S257] Amazon Nova 2 Lite, AWS AI Service Card, AWS, living
- [S254] Amazon's Frontier Model Safety Framework (September 2026 update), Amazon, 2026-09-17
- [S251] AI Red Teaming Agent (Microsoft Foundry docs), Microsoft, living
- [S271] The Cohere Secure AI Frontier Model Framework V1.0, Cohere, 2025-02
- [S261] Moderation and guardrailing (docs), Mistral AI, living
- [S266] Grok 4.7 Model Card (revision 2026-09-21), xAI (SpaceXAI), 2026-09-21
- [S290] Measuring Reward-Seeking via Contrastive Belief Updates, Apollo Research, 2026-07-21
- [S299] Trajectory-aware benchmark subset selection for cost-efficient software engineering agent regression testing, arXiv 2609.24928, 2026-09-21
