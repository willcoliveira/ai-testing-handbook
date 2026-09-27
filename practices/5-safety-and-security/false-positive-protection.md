---
id: false-positive-protection
title: False-positive protection
area: 5-safety-and-security
status: draft
last_reviewed: 2026-09-27
sources: [S098, S099, S104, S111, S125, S126, S240, S241, S246, S251, S258]
related: [guardrails, criteria-authoring, regulated-domain-checks, judge-calibration]
---

# False-positive protection

## What
A guardrail that blocks a legitimate request is a defect, not a safe default. False-positive protection
is the practice of writing must-not-block cases with the same care as must-block cases, measuring the
false-positive rate per filter and per language, and treating a rise in over-blocking as a regression.
The labs report it under names such as over-refusal, benign request evaluations, unjustified refusals
and false refusal rate.

## Why
Every filter is a recall-precision trade. OpenAI states the choice for its biology monitor outright:
"we prioritized safety by optimizing for high recall" and "this means that our safety mitigations will
sometimes accidentally prevent safe uses of the product" [S104]. That is a legitimate decision when it
is written down and measured. It is a defect when nobody measures it. In a health programme the cost is
concrete: a person asking about a prescription or describing a craving gets a canned refusal instead of
help. The trade-off is that must-not-block cases are harder to write than must-block cases, because
each one has to be close to a real violation and still clearly fine.

## How
1. Pair every must-block case with a nearby must-not-block case. Same topic, opposite verdict. A request
   for a lethal dose pairs with a question about whether a prescribed dose is safe to take with alcohol.
2. Write the four families that break blunt filters: self-criticism ("I hate myself for slipping"), a
   sexual-health concern, a metaphor that uses violent or addiction vocabulary ("my battle with
   cravings"), and a legitimate medical question (a prescription). Each is a case with a verdict of
   must-not-block and a rationale.
3. Measure two numbers per filter and report both. Llama Guard 4 reports recall and false positive rate
   together, per modality: 69% and 11% on English text, 43% and 3% multilingual, 41% and 9% on single
   images [S126]. Report yours the same way so a reviewer can see what a recall gain cost.
4. Measure per language. Anthropic runs its single-turn harmful and benign evaluations "in Arabic,
   English, French, Hindi, Korean, Mandarin Chinese, and Russian" and reports per-language rates [S099].
   A filter tuned on English will over-block or under-block elsewhere.
5. Move nuanced topics off blunt tools. When a managed denied-topics feature over-blocks legitimate
   questions in a domain, replace it for those topics with a prompt classifier that returns a verbatim
   canned response, and keep the managed filter for the topics where a blunt block is correct.
6. Sample blocked traffic. Read a fixed number of blocks each week and label them. The label set is the
   next batch of must-not-block cases.
7. Gate on both directions. A change that raises recall and raises false positives above the agreed
   line fails the gate. Write the line down, as Anthropic did when it chose "a temporarily wider safety
   margin" while working "to reduce our classifiers' false-positive rate" [S098].

## Who does it (sourced)
- **Anthropic, February 2026:** the Sonnet 4.6 card says single-turn testing covers "violative requests
  where we expect Claude to provide a harmless response, as well as benign requests that touch on
  sensitive topic areas, where our goal is to minimize refusals" [S099].
- **Anthropic, February 2026:** the same card reports a targeted evaluation for "refusal to assist with
  AI safety R&D" and notes Sonnet 4.6 "showed a substantial regression on this metric relative to
  Claude Opus 4.6" [S099]. Over-refusal is tracked as a regression.
- **Anthropic, September 2026:** the Opus 5.5 card reports that the model "had very low over-refusal
  rates on benign requests" and that the lab accepted a wider jailbreak safety margin while reducing
  classifier false positives [S098].
- **OpenAI, August 2025:** the GPT-5 card describes a move "from hard refusals to safe-completions" and
  reports the recall and precision of its topical classifier (0.960 and 0.737) and reasoning monitor
  (0.838 and 0.647) [S104].
- **Google DeepMind, February 2026:** the Gemini 3.1 Pro card reports "unjustified-refusals"
  measurements alongside safety and says the model keeps "unjustified refusals low" [S111].
- **Meta, living:** CyberSecEval includes "MITRE False Refusal Rate (FRR) Tests" that "measure how
  often an LLM incorrectly refuses a borderline but essentially benign query, due to misinterpreting the
  prompt as a malicious request" [S125].
- **Meta, living:** the Llama Guard 4 card publishes false positive rate next to recall for each
  modality [S126].
- **Google, 2026-09:** the Gemini 3.8 Flash card reports unjustified refusals as a point change against Gemini 3.7 Flash and summarises the result as "low unjustified refusals" [S240].
- **Google, 2026-07:** the Gemma 4 card says safety gains came "while keeping unjustified refusals low" and that "All testing was conducted without safety filters" [S241].
- **Microsoft, 2022-06:** the Responsible AI Standard requires teams to define intended uses where "lower acceptable error rates (including false positive and false negative error rates), are advised" (RS1.5) [S246].
- **Microsoft, 2026-08:** the AI Red Teaming Agent docs warn that attack success is judged by generative models, so "there's always a chance of false positives and we always recommend reviewing results before taking mitigation actions" [S251].
- **Amazon, living:** the Nova responsible use page tells customers who hit moderation to examine prompts against the published guidelines, since "Optimizing the prompts to reduce the likelihood of generating undesired outcomes is the recommended strategy" [S258].

## Pitfalls
1. Tuning to recall alone. OpenAI names the cost of its own choice [S104]; a team that does not name
   the cost has not made a choice, it has made a default.
2. Managed denied topics on a domain full of legitimate edge cases. Self-harm, medical questions and
   harm to others all have benign neighbours in a health or support programme.
3. No per-language number. The Llama Guard 4 multilingual figures differ from English by a wide margin
   [S126]; a single aggregate hides that.
4. A saturated harmful set as the only gate. OpenAI says its standard disallowed-content set "has become
   relatively saturated" and "no longer provides a useful signal" [S104]. Add the benign side or the
   gate is blind to over-blocking drift.
5. A safety margin nobody wrote down. Anthropic's is public and dated [S098]; make yours the same.

## Pattern from a production build
None yet.

## Sources
- [S098] Claude Opus 5.5 System Card, Anthropic, 2026-09-22.
- [S099] Claude Sonnet 4.6 System Card, Anthropic, 2026-02-17.
- [S104] GPT-5 System Card, OpenAI, 2025-08-13.
- [S111] Gemini 3.1 Pro Model Card, Google DeepMind, 2026-02.
- [S125] CyberSecEval, Meta, living.
- [S126] Llama Guard 4 Model Card, Meta, living.
- [S240] Gemini 3.8 Flash Model Card, Google DeepMind, 2026-09-02
- [S241] Gemma 4 model card, Google, living
- [S246] Microsoft Responsible AI Standard, v2, General Requirements, Microsoft, 2022-06
- [S251] AI Red Teaming Agent (Microsoft Foundry docs), Microsoft, living
- [S258] Responsible use (Amazon Nova 2 user guide), AWS, living
