---
id: mistral
title: Mistral AI
sources: [S116, S259, S260, S261, S262, S292]
last_reviewed: 2026-09-28
---

# Mistral AI

## Published framework (what governs a release)
Mistral has not published a frontier safety framework in any page we fetched. METR's tracker of frontier
safety policies lists twelve developers; the entries returned to us named xAI, NVIDIA, Cohere, Anthropic,
OpenAI, Google DeepMind, Meta, Microsoft, Amazon, Magic, NAVER and G42, and no Mistral document [S116].

What governs a release, as far as the public record shows, is a licence and a product line. The Mistral 3
family (three dense models at 14B, 8B and 3B, and Mistral Large 3, a sparse mixture of experts with 41B
active and 675B total parameters) ships under an "Apache 2.0 license", announced December 2025 [S259].
Magistral Small, the open reasoning model, is also Apache 2.0; Magistral Medium is served through the API
[S260]. Safety for deployers is a service: a moderation endpoint and a guardrailing layer documented at
docs.mistral.ai [S261][S262]. Nothing in these pages describes a capability threshold, a release gate, or
an external review step.

## What they say they run before a release (sourced, dated)
- **Mistral 3, December 2025:** the announcement reports leaderboard position, "Mistral Large 3 debuts at #2
  in the OSS non-reasoning models category (#6 amongst OSS models overall) on the LMArena leaderboard",
  GPQA Diamond charts against comparable models, and "85% on AIME '25 with our 14B variant" for the small
  reasoning model. Training ran on "3000 of NVIDIA's H200 GPUs". No safety testing, red teaming or
  third-party testing is described [S259].
- **Magistral, June 2025:** the report evaluates on AIME 2024 and 2025, MATH-500, LiveCodeBench v5 and v6,
  Aider Polyglot, GPQA Diamond and Humanity's Last Exam, plus MathVista, MMMU and MMMU-Pro for the
  multimodal claim. Magistral Medium reports 73.6% pass@1 on AIME 2024 against a 26.8% baseline, 59.4% on
  LiveCodeBench v5 against 29.1%, 70.8% on GPQA and 9.0% on Humanity's Last Exam. AIME 2024 was translated
  into French, Spanish, German, Italian, Russian and Chinese, with scores from 63.7% (Chinese) to 73.6%
  (English). The decoding configuration is stated: temperature 0.7 for math and GPQA and 0.95 for code, a
  maximum of 40k tokens for AIME and LiveCodeBench and 32k elsewhere. Function calling is scored on an
  "internal benchmark". No safety or adversarial evaluation section appears [S260].
- **Moderation model, November 2024:** "Our model is an LLM classifier trained to classify text inputs into
  9 categories", built on Ministral 8B 24.10, "natively multilingual" across eleven named languages, and
  reported as "AUC PR across policies on our internal testset". It powers moderation in Le Chat [S262].
- **Moderation model, living docs:** the current model is `mistral-moderation-2603`; `mistral-moderation-2411`
  was deprecated on March 31, 2026. "The policy threshold is determined based on the optimal performance of
  our internal test set." Deployers can set per-category thresholds from 0 to 1, and the docs warn that
  "Custom policies that depend on `category_scores` can require recalibration" when the model changes [S261].

The pattern: Mistral publishes capability numbers with their decoding settings, which is more than some
labs give, and publishes nothing about safety evaluation of the generative models themselves.

## Public evaluation tooling they ship
- Open weights under Apache 2.0 for the Mistral 3 family and Magistral Small, which lets anyone run their
  own evaluation with the harnesses in [open-ecosystem](open-ecosystem.md) [S259][S260].
- The moderation API: one endpoint for raw text and one for the last turn of a conversation, returning
  per-category scores, plus a guardrailing layer with custom policies on top of `moderation_llm_v2`
  [S261][S262].
- No evaluation harness, no published red-team suite and no auditing tool in the pages fetched.
- **Shieldstral, August 2026:** a safety product announced on the news page; details not read at the time of the refresh [S292].

## What is not public (stated as unknown)
- Any pre-release safety evaluation of Mistral Large 3, Mistral Medium 3 or Magistral. The announcement
  and the report do not mention one. Absence from a page is not evidence that none was run [S259][S260].
- Red teaming, internal or external. Not described anywhere we fetched.
- The moderation model's test set, its false-positive and false-negative rates, and the default thresholds.
  The docs say the threshold was tuned on an internal test set and give no numbers [S261][S262].
- The composition of the "internal benchmark" for function calling [S260].
- The Hugging Face model card for Mistral Large 3 and the Mistral trust centre are not in the register: the
  card we fetched shows benchmark charts as images, three stated limitations and the Apache 2.0 licence,
  and the trust centre page rendered only its title. Neither adds evaluation detail.
- Whether any external body has tested a Mistral model before release. No source says so.

## Reading order for a newcomer
1. The Mistral 3 announcement, for what the lab chooses to report at launch: leaderboard rank and a few
   benchmarks, no safety section [S259].
2. The Magistral report, the evaluation section, for the decoding settings and the translated AIME set. It
   is the only Mistral document we found that states how a number was produced [S260].
3. The moderation announcement and then the guardrailing docs, for what a deployer gets and the
   recalibration warning [S262][S261].
4. METR's tracker, to see who has a framework and who does not [S116].

## Sources
- [S116] Frontier AI Safety Policies tracker, METR, living.
- [S259] Introducing Mistral 3, Mistral AI, 2025-12-02.
- [S260] Magistral (technical report, arXiv 2506.10910), Mistral AI, 2025-06.
- [S261] Moderation and guardrailing (docs.mistral.ai), Mistral AI, living.
- [S262] Mistral Moderation API (announcement), Mistral AI, 2024-11-07.
- [S292] Introducing Shieldstral, Mistral AI, 2026-08-04.
