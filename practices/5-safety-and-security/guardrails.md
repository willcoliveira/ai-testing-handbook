---
id: guardrails
title: Guardrails
area: 5-safety-and-security
status: draft
last_reviewed: 2026-09-27
sources: [S098, S104, S109, S114, S124, S126, S129, S135, S153, S214, S221, S233, S236, S243, S247, S254, S257, S261, S262, S266, S269, S272]
related: [false-positive-protection, prompt-injection, redaction-in-telemetry, voice-agent-testing]
---

# Guardrails

## What
A guardrail is a check that sits outside the model and acts on what goes in, what comes out, what is
retrieved, or what tool call is about to run. Three kinds are common. Managed filters from a cloud
provider (Amazon Bedrock Guardrails offers content filters, denied topics, word filters, sensitive
information filters, contextual grounding checks and automated reasoning checks [S124]). Classifier
models (Llama Guard 4 is a 12-billion-parameter classifier that labels a prompt or a response safe or
unsafe against 14 hazard categories [S126]). Programmable rails in code (NeMo Guardrails defines input,
retrieval, dialog, execution and output rails in Colang [S129]; Guardrails AI composes validators into
input and output guards and validates structured output [S135]).

## Why
The model's own refusals are one layer and they are not tested against your traffic. Guardrails give a
second layer that you can test, tune and log. The labs run the same shape: Anthropic describes blocking
classifiers for chemical-biological, cyber, weapons and distillation misuse, with "transparent blocks"
and fallback models [S098]; OpenAI describes a topical classifier and a reasoning monitor in front of
its biology safeguards [S104]. The trade-off is over-blocking and latency. OpenAI states it "prioritized
safety by optimizing for high recall" and that "our safety mitigations will sometimes accidentally
prevent safe uses of the product" [S104].

## How
1. Place each check where it can act. Use the NeMo taxonomy as a checklist even if you do not use the
   tool: input (before the model), retrieval (on fetched content), dialog (which flow), execution (tool
   calls), output (before the user) [S129].
2. Decide block, mask or flag per filter. Bedrock sensitive-information filters can "block or mask
   inputs and responses" [S124]. Masking is for fields you need to keep working (name, age in a health
   enrolment); blocking is for fields that should never reach the model.
3. Write the suite per filter, two columns: must-block and must-not-block. A reasonable starting shape
   is about two dozen cases over a managed guardrail: content filters (hate, insults, sexual, violence,
   misconduct, prompt attack), PII masking with named exceptions, denied topics, edge cases, and a
   handful of must-not-block cases. See [false-positive-protection](false-positive-protection.md).
4. Measure both error rates and publish them with the tool's own numbers. Llama Guard 4 reports 69%
   recall at 11% false positive rate on English text and 43% recall at 3% on multilingual text [S126].
   Your traffic will differ; measure it.
5. Layer checks on different points. Anthropic pairs "prompt injection probes" on tool results with "a
   classifier that blocks potentially dangerous tool calls", so "an attack would have to defeat both
   independently" [S098].
6. Budget latency. On a voice channel the guardrail either runs in parallel with a wait cap or it does
   not run on that turn. Write the cap down and the coverage it costs.
7. Check the logging path. Bedrock warns that "all blocked content from the above policies will appear
   as plain text in Amazon Bedrock Model Invocation Logs, if you have enabled them" [S124]. A guardrail
   that blocks PHI and then logs it in clear has moved the problem.
8. Define the fallback. Anthropic's blocks "fall back" to a named older model, and the card reports the
   share of rollouts served by the fallback [S098]. Decide what your product does on a block: canned
   copy, a smaller model, or a human.

## Who does it (sourced)
- **Anthropic, September 2026:** the Opus 5.5 card lists classifiers for chemical and biological risks,
  cyber misuse, a narrow set of frontier-LLM development capabilities, conventional weapons, and model
  distillation; "all of our blocking safeguards operate with transparent blocks and do not covertly
  change model responses" [S098].
- **Anthropic, September 2026:** the same card says the lab "opted for a temporarily wider safety margin
  against jailbreaks, while we work to reduce our classifiers' false-positive rate" [S098].
- **OpenAI, August 2025:** the GPT-5 card reports a topical classifier with F1 0.834, recall 0.960 and
  precision 0.737, and a reasoning monitor with recall 0.838 and precision 0.647, tested on "successful
  jailbreak examples that had been false negatives with a prior version of the monitor" and "borderline
  cases between high vs low risk dual use" [S104].
- **Google DeepMind, April 2026:** FSF v3.1 lists deployment mitigations that "may include safety
  post-training, input/output/chain-of-thought monitoring and analysis, account moderation, jailbreak
  detection and patching, user verification, and bug bounties" [S109].
- **Meta, April 2025:** the Llama 4 card names Llama Guard, Prompt Guard and Code Shield as system-level
  protections and says developers are responsible for "safety testing and tuning tailored to their
  specific applications" [S114].
- **Meta, living:** the Llama Guard 4 card says the model "may be susceptible to adversarial attacks or
  prompt injection attacks that could bypass or alter its intended use" [S126].
- **AWS, living:** Bedrock content filters cover "Hate, Insults, Sexual, Violence, Misconduct and Prompt
  Attack" with configurable strength; a guardrail "must contain at least one filter and messaging for
  when prompts and user responses are blocked" [S124].
- **Alibaba Qwen, 2025-10:** Qwen3Guard returns safe, controversial or unsafe with one of nine categories, in generative and streaming variants (a token-level head for checking a response as it is produced), across 119 languages; the 8B generative model reports F1 90.0 on English prompts and 83.9 on English responses against WildGuard-7B at 85.8 and 79.9 [S221].
- **DeepSeek, 2025-09:** the R1 paper describes a "risk control system" of "Potential Risky Dialogue Filtering" and "Model-based Risk Review", and states that with it "the safety level of the model is increased to a superior standard"; the system is not shipped with the weights [S214][S153].
- **Context, TC260, 2024-02:** China's Basic Safety Requirements for Generative AI Services ask providers to cover corpus safety, model safety, safety measures and safety assessment against more than 30 listed risks [S233].
- **Google, living:** the Gemini API exposes four adjustable harm categories with five block thresholds, "the default block threshold is Off for Gemini 2.5 and 3 models", and core harms such as child safety "are always blocked and cannot be adjusted" [S236].
- **Google, 2025-04:** ShieldGemma 2 is a 4B open-weight image classifier for sexually explicit, dangerous and violent content, evaluated on "approximately 500 examples for each harm policy", with the caveat that it "is also highly sensitive to the specific user-provided description of safety principles" [S243].
- **Microsoft, 2026-02:** the Frontier Governance Framework names "harm refusal" and "deployment guidance" as safety mitigations applied "so that the model's risk level remains at low or medium once mitigations have been applied" [S247].
- **Amazon, 2025-12:** the Nova 2 Lite service card describes a runtime pipeline in which "the model filters the prompt to comply with safety, security, and other design goals" and later "filters the completion for safety and other concerns" before returning it [S257].
- **Amazon, 2026-09:** the Frontier Model Safety Framework lists "runtime input and output moderation systems" among its safeguards alongside training data safeguards, alignment training, fine-tuning safeguards and abuse detection classifiers [S254].
- **Mistral, living:** the moderation endpoint returns per-category scores; "The policy threshold is determined based on the optimal performance of our internal test set", deployers may set thresholds from 0 to 1, and "Custom policies that depend on `category_scores` can require recalibration" [S261]; the classifier is an LLM on Ministral 8B with 9 categories [S262].
- **NVIDIA, March 2026:** Nemotron-3-Content-Safety V1.1 reports accuracy 0.56 to 0.94 across 14 external safety benchmarks and false-positive rates of 0.023 (MMMU), 0.058 (DocVQA) and 0.001 (AI2D) on sets assumed benign [S269]; NeMo Guardrails supplies the rails [S129].
- **Cohere, April 2025:** Safety Modes ("contextual", "strict") are evaluated with one set that "should always be answered" and one that "should always be refused", and the over-refusal set came from red-teaming the previous model [S272].
- **xAI, September 2026:** a "layered, defense-in-depth stack": safety fine-tuning, system prompts, and on some surfaces "runtime input and topical filters" for CSAM, self-harm and CBRN pathways, measured by refusal recall (bio 100%, chem 99.9%) and a self-harm suite that fails refusals "without redirecting the user to help" [S266].

## Pitfalls
1. Over-blocking treated as safe. It is a defect with a cost; see
   [false-positive-protection](false-positive-protection.md).
2. Blocked content in plain-text logs [S124]. Check invocation logging before enabling a PII filter.
3. The classifier is itself attackable [S126]. Do not make it the only layer in front of a consequential
   action.
4. A guardrail on the latency-critical path with no cap. A voice turn that waits on a slow classifier
   is a broken turn.
5. Managed denied topics on a domain with legitimate edge cases. A health or support programme has to
   answer questions about cravings and prescriptions; a blunt topic filter will not.
6. Fallback to a weaker model. Anthropic reports that a classifier-triggered fallback to an older model
   weakened resistance to prompt injection until the fallback model's own safeguards were strengthened
   [S098].

## Pattern from a production build
None yet.

## Sources
- [S098] Claude Opus 5.5 System Card, Anthropic, 2026-09-22.
- [S104] GPT-5 System Card, OpenAI, 2025-08-13.
- [S109] Frontier Safety Framework Version 3.1, Google DeepMind, 2026-04-17.
- [S114] Llama 4 Model Card, Meta, 2025-04-05.
- [S124] Amazon Bedrock Guardrails components, AWS, living.
- [S126] Llama Guard 4 Model Card, Meta, living.
- [S129] NeMo Guardrails documentation, NVIDIA, living.
- [S135] Guardrails AI documentation, Guardrails AI, living.
- [S221] Qwen3Guard Technical Report, Qwen Team, Alibaba (arXiv 2510.14276), 2025-10-16
- [S214] DeepSeek-R1 incentivizes reasoning in LLMs through reinforcement learning, DeepSeek-AI, Nature 645, 633-638, 2025-09-17
- [S153] DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning, DeepSeek-AI (arXiv 2501.12948), 2025-01-22
- [S233] Basic Safety Requirements for Generative Artificial Intelligence Services (TC260 technical document, English translation), CSET, Georgetown (translation of TC260-003-2024), 2024-02-29
- [S236] Safety settings (Gemini API docs), Google, living
- [S243] ShieldGemma 2 model card, Google, 2025-04-03
- [S247] Frontier Governance Framework, Microsoft, 2026-02
- [S257] Amazon Nova 2 Lite, AWS AI Service Card, AWS, living
- [S254] Amazon's Frontier Model Safety Framework (September 2026 update), Amazon, 2026-09-17
- [S261] Moderation and guardrailing (docs), Mistral AI, living
- [S262] Mistral Moderation API (announcement), Mistral AI, 2024-11-07
- [S269] Nemotron-3-Content-Safety model card, NVIDIA, Hugging Face, living
- [S272] Command A: An Enterprise-Ready Large Language Model (technical report), Cohere, arXiv 2504.00698, 2025-04
- [S266] Grok 4.7 Model Card (revision 2026-09-21), xAI (SpaceXAI), 2026-09-21
