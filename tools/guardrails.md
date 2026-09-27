---
id: tools-guardrails
title: Guardrail tools
sources: [S098, S114, S124, S126, S129, S135]
last_reviewed: 2026-09-26
---

# Guardrail tools

Per-tool notes: what each is for, what it is not for, and where the claim comes from. See the practice
files [guardrails](../practices/5-safety-and-security/guardrails.md) and
[false-positive-protection](../practices/5-safety-and-security/false-positive-protection.md).

## Amazon Bedrock Guardrails
- **What it is:** a managed policy layer applied to prompts and responses. Components: content filters
  (Hate, Insults, Sexual, Violence, Misconduct, Prompt Attack) with configurable strength; denied
  topics; word filters (exact match, with a ready-made profanity list); sensitive information filters
  (PII in standard formats or custom regex, with block or mask); contextual grounding checks for RAG;
  automated reasoning checks against policies written in natural language [S124].
- **For:** a first layer on a Bedrock deployment with no code to run; PII masking with named exceptions;
  a prompt-attack filter on input.
- **Not for:** nuanced topics where a blunt block is wrong; the docs describe topic and content filters,
  not domain judgement. Not a substitute for output review where the log path matters: "all blocked
  content ... will appear as plain text in Amazon Bedrock Model Invocation Logs, if you have enabled
  them" [S124].
- **Testing note:** a guardrail "must contain at least one filter and messaging for when prompts and
  user responses are blocked" [S124]; test the message as well as the block.

## NVIDIA NeMo Guardrails
- **What it is:** "an open-source Python package for adding programmable guardrails to LLM-based
  applications", with input, retrieval, dialog, execution and output rails defined in Colang and YAML
  [S129].
- **For:** rails that need logic, such as a dialog flow that must reach a state before a tool may run,
  or an execution rail that validates a tool call. The five rail types are a useful placement checklist
  even if you do not adopt the tool.
- **Not for:** a team that cannot maintain a second language (Colang) beside its prompts. The docs give
  no version or date on the landing page fetched; pin the version yourself.

## Llama Guard 4 (Meta)
- **What it is:** "a natively multimodal safety classifier with 12 billion parameters trained jointly
  on text and multiple images", pruned from Llama 4 Scout, labelling a prompt or response safe or
  unsafe across 14 categories aligned with the MLCommons hazards taxonomy [S126].
- **For:** input and output classification where you want a model you can host and a published error
  profile: 69% recall at 11% false positive rate on English text, 43% at 3% multilingual, 41% at 9% on
  single images, 61% at 9% on multiple images [S126].
- **Not for:** the only layer in front of a consequential action. The card says the model "may be
  susceptible to adversarial attacks or prompt injection attacks that could bypass or alter its
  intended use", and was "tested mostly with prompts containing a few images" [S126].
- **Context:** Meta names Llama Guard, Prompt Guard and Code Shield as the system-level protections
  shipped with Llama 4 and says developers remain responsible for application-specific testing [S114].

## Guardrails AI
- **What it is:** a Python framework that "runs Input/Output Guards in your application that detect,
  quantify and mitigate the presence of specific types of risks", built from validators that "can be
  combined together into Input and Output Guards", with a Guardrails Hub of validators; it also handles
  structured output generation [S135].
- **For:** validating structured output shape and composing several checks into one guard.
- **Not for:** a team that needs a published error profile; the docs page fetched gives no version,
  date or accuracy figures.

## A lab's own layer, for comparison
Anthropic describes production safeguards as blocking classifiers with "transparent blocks" and named
fallback models, paired with "prompt injection probes" on tool results and a classifier on dangerous
tool calls [S098]. That is the shape to aim for: one check on data in, one on actions out, both tested.

## Sources
- [S098] Claude Opus 5.5 System Card, Anthropic, 2026-09-22.
- [S114] Llama 4 Model Card, Meta, 2025-04-05.
- [S124] Amazon Bedrock Guardrails components, AWS, living.
- [S126] Llama Guard 4 Model Card, Meta, living.
- [S129] NeMo Guardrails documentation, NVIDIA, living.
- [S135] Guardrails AI documentation, Guardrails AI, living.
