---
id: microsoft
title: Microsoft
sources: [S088, S116, S131, S246, S247, S248, S249, S250, S251, S252, S253]
last_reviewed: 2026-09-27
---

# Microsoft

## Published framework (what governs a release)
Two documents. The Responsible AI Standard, version 2, June 2022, is the product-level rulebook, with
requirements under six principle areas (Accountability, Transparency, Fairness, Reliability and Safety,
Privacy and Security, Inclusiveness). Every system gets an Impact Assessment (A1); Sensitive Uses go to
the Office of Responsible AI (A2.2). Goal A3, fit for purpose, requires "Responsible Release Criteria"
for "performance metrics" and "error types" (A3.3), an evaluation plan per metric (A3.4), and documented
pre-release results with a decision on "how often ongoing evaluation should be conducted" (A3.5). Goal
RS1 requires "acceptable error rates" and, where advised, "lower acceptable error rates (including false
positive and false negative error rates)" (RS1.5); RS2 requires a rollback plan with the time to roll
back "across all endpoints" (RS2.3). Platform services publish a Transparency Note (A3.6, RS1.9) [S246].
We found no later public version.

The Frontier Governance Framework, February 2026, is the frontier layer, a "one year update" of the
February 2025 first version [S247]; METR lists both [S116]. It tracks five capabilities: CBRN weapons,
offensive cyberoperations, advanced autonomy ("including AI research and development"), loss of control,
and harmful manipulation (the last two added in 2026), each scored "low, medium, high, or critical"
against qualitative thresholds in Appendix I. Scope: models "in scope for frontier model requirements
under applicable laws, such as the EU AI Act, California's Transparency in Frontier AI Act (TFAIA), and
New York's Responsible AI Safety and Education (RAISE) Act", plus fine-tunes "where the compute used for
fine-tuning is more than 1/3 of the base model". Deployment is decided by "Executive Officers responsible
for Microsoft's AI governance program (or their delegates)"; updates are reviewed by the Chief
Responsible AI Officer and published "within 30 days of adoption" [S247]. The 2026 transparency report
frames the programme on the NIST AI RMF functions "Govern, Map, Measure, and Manage, complemented by a
central pre-release oversight process" [S250].

## What they say they run before a release (sourced, dated)
- **Leading indicators, February 2026:** benchmarks for six precursor capabilities (general, scientific
  and long-context reasoning, spatial understanding, "autonomy, planning, and tool use", software
  engineering), run "during pre-training, after pre-training is complete, after post-training, and prior
  to deployment" and "at least every six months". A benchmark qualifies only if it has "low saturation
  (i.e., the best performing models typically score lower than 70%)", measures "an advanced capability",
  and has "a sufficient number of prompts to account for non-determinism in model output" [S247].
- **Deeper capability assessment, February 2026:** "adversarial testing and systematic measurement using
  state-of-the-art methods", documented with "the assumptions regarding the model, capability being
  evaluated, the method used, and evaluation results"; elicitation by fine-tuning, scaffolding and
  tools, with resources "extrapolated out to those available to actors in threat models"; a holistic
  view of "marginal capability uplift" over available tools and open-weights models [S247].
- **Third parties, February 2026:** "We engage qualified third parties to conduct evaluations in ways
  that are appropriate to the risk profile of the model; sometimes this requires granting API access
  ... and sometimes it requires a review of testing conducted internally"; the decision is made "by
  internal experts who are independent from the model development team" [S247].
- **After mitigation, February 2026:** "the model will be re-evaluated to ensure capabilities are rated
  low or medium"; otherwise "we will pause development and deployment until the point at which
  mitigation practices evolve to meet the risk" [S247].
- **Phi-4, December 2024:** safety post-training by "SFT (Supervised Fine-Tuning) and iterative DPO",
  then "the independent AI Red Team (AIRT) at Microsoft" evaluated "in both average and adversarial user
  scenarios", the latter with "jailbreaks, encoding-based attacks, multi-turn attacks, and adversarial
  suffix attacks"; capability benchmarks via "OpenAI's SimpleEval" [S248].
- **Phi-4-reasoning-vision-15B, March 2026:** "Automated red teaming was performed on Azure to assess
  safety risks including groundedness, jailbreak susceptibility, harmful content generation, and
  copyright violations for protected material"; reported defect rates 1.4% (text-to-text safety) and 4.5%
  (image-to-text safety); no third party named [S249].
- **Products, 2026 report:** evaluation partnerships with "government research institutions in the US,
  UK, Singapore, and Australia"; MLCommons AILuminate across six Asian locales and PazaBench across 39
  African languages; for Copilot Health, "over 250 licensed clinicians from over two dozen countries",
  "a new external testing framework" and a phased release [S250].
- **Platform scope, July 2026:** "Foundry Models sold by Azure have been evaluated by Microsoft based on
  Microsoft's Responsible AI standards"; Anthropic models and open models from Hugging Face or Fireworks
  "are Non-Microsoft Products under the Product Terms and have not been evaluated by Microsoft" [S252].

## Public evaluation tooling they ship
- PyRIT, the open-source attack library [S131], and the AI Red Teaming Agent built on it: seed prompts
  per risk category, 24 attack strategies (Base64, Caesar, Crescendo, multi-turn, indirect jailbreak and
  others), and Attack Success Rate, "the percentage of successful attacks over the number of total
  attacks". Agent-only categories (prohibited actions, sensitive data leakage, task adherence) are
  cloud-only; stated limits are "Single-turn, English-only; synthetic data" and "there's always a chance
  of false positives and we always recommend reviewing results before taking mitigation actions" [S251].
- Hosted risk and safety evaluators: a 0 to 7 severity scale per category; "Given a numerical threshold
  (default 3), the evaluator outputs pass if the score is less than or equal to the threshold, or fail
  otherwise"; an aggregate defect rate; 19 code-vulnerability subclasses; an ungrounded-attributes
  label [S253].
- The transparency note for those evaluators: "a fine-tuned Azure OpenAI GPT-4o model" generates attacks
  and "another GPT-4o model" annotates; validation compared human and automated labels on 500 texts, 250
  text-to-image and 250 image-to-text samples per risk area at 0, 1 and 2-level tolerance; agreement was
  high for self-harm and sexual content and "lower" for violence and hate, partly because the human and
  automated guidelines "have since diverged" [S252].
- Foundry observability and evaluators, in `tools/platforms.md` [S088].

## What is not public (stated as unknown)
- Which models have had a leading indicator or deeper capability assessment, and their risk levels. The
  framework promises to share "the model's risk classification" publicly; we found no per-model frontier
  report in the pages fetched [S247].
- The third parties used for frontier evaluations and their reports; disclosure is "where applicable"
  [S247]. The quantitative meaning of low, medium, high and critical; Appendix I is qualitative [S247].
- AIRT's findings on Phi-4, the datasets and any pass threshold; the card describes the process only
  [S248]. The dataset sizes behind the two Phi-4-reasoning-vision defect rates [S249].
- Whether the 2022 Standard is the current internal version; the 2026 report cites it without a version
  [S246][S250]. The agreement numbers behind "high rate of approximate matches" in the transparency note,
  and the evaluator models behind the hosted safety evaluators [S252][S253].
- Whether any evaluation not mentioned in a card was run. Absence from a card is not evidence.

## Reading order for a newcomer
1. Frontier Governance Framework, sections 3 (evaluation) and 5 (governance), then the change log [S247].
2. Responsible AI Standard, Goal A3 and Goals RS1 to RS2, for release criteria and rollback [S246].
3. The safety evaluations transparency note, for how a vendor validates its own judge [S252], then the
   evaluators page for the severity tables and the default threshold [S253].
4. The AI Red Teaming Agent page, for the strategy list and the stated limits [S251].
5. The Phi-4 card's responsible AI section [S248], then the 2026 transparency report for numbers [S250].

## Sources
- [S088] Observability in Generative AI (Microsoft Foundry), Microsoft, living.
- [S116] Frontier AI Safety Policies tracker, METR, living.
- [S131] PyRIT, Microsoft, living.
- [S246] Microsoft Responsible AI Standard, v2, General Requirements, Microsoft, 2022-06.
- [S247] Frontier Governance Framework, Microsoft, 2026-02.
- [S248] Phi-4 model card, Microsoft (Hugging Face), 2024-12-12.
- [S249] Phi-4-reasoning-vision-15B model card, Microsoft (Hugging Face), 2026-03-04.
- [S250] 2026 Responsible AI Transparency Report, Microsoft, living.
- [S251] AI Red Teaming Agent (Microsoft Foundry docs), Microsoft, living.
- [S252] Microsoft Foundry risk and safety evaluations Transparency Note, Microsoft, living.
- [S253] Risk and safety evaluators for generative AI (Microsoft Foundry docs), Microsoft, living.
