---
id: meta
title: Meta
sources: [S112, S113, S114, S116, S125, S126]
last_reviewed: 2026-09-26
---

# Meta

## Published framework (what governs a release)
The Advanced AI Scaling Framework, Version 2, dated April 7, 2026 in its change log, renamed from the
Frontier AI Framework of February 3, 2025 [S113][S112]. It "currently focuses on catastrophic risks in
three areas: Chemical & Biological, Cybersecurity, and Loss of Control" [S113]. The approach is
"outcomes-led": threat modelling defines catastrophic outcomes and threat scenarios, and thresholds are
"defined in terms of the level of uplift a model provides towards realizing a threat scenario" [S113].

Three risk thresholds [S113]. Critical: "continued development of the Frontier AI could substantially
contribute to any threat scenario"; measure "Develop with Mitigations", proceeding only "if sufficient
mitigations are defined, implemented and validated". High: "deployment of the Frontier AI could
substantially contribute"; measure "Deploy with mitigations". Moderate or lower: "Deploy". The change
log records that v2 changed Critical "from 'Stop' to 'Develop with Mitigations'" and High "from 'Do not
release' to 'Deploy with mitigations'" [S113]. The Chief AI Officer and Director of Alignment and Risk
"will assign a risk threshold" after a pre-mitigation assessment [S113]. A model counts as Frontier AI
on capability grounds or at "a Compute Threshold of at least 10^26 integer or floating point operations"
[S113]. The framework commits to "a preparedness report for each closed or open Frontier AI release" and
to update it "when there is a change in circumstances that materially alters our previous risk
assessment" [S113].

## What they say they run before a release (sourced, dated)
- **Process, April 2026:** three stages, "anticipate; evaluate and mitigate; and decide"; a "reference
  class" of comparable models is identified and evaluated for comparison [S113].
- **Evaluations, April 2026:** "our evaluations can involve a combination of automated and human
  evaluations, as well as red teaming and uplift studies"; "we do not have a fixed set of evaluations
  that we apply to each Frontier AI model"; for cyber and chemical-biological risks "we conduct red
  teaming exercises once a model achieves certain levels of performance in capabilities relevant to
  these domains, involving external experts when appropriate" [S113].
- **Pre-mitigation, April 2026:** "these assessments typically use a version of the Frontier AI before
  safety mitigations have been applied"; thresholds are assigned "with maximum elicitation in mind,
  capturing the upper bound of risk by evaluating the model as part of a system with scaffolding and
  tooling available for the proposed deployment scenario" [S113].
- **Controlled deployments, April 2026:** "prior to controlled deployments ... we will conduct
  preliminary preparedness assessments" [S113].
- **Llama 4, April 2025:** "we conduct recurring red teaming exercises with the goal of discovering
  risks via adversarial prompting", with red teams including "experts in cybersecurity, adversarial
  machine learning, and integrity in addition to multilingual content specialists"; critical risk
  evaluations for CBRNE, child safety and cyber attack enablement; the conclusion that Llama 4 models
  "do not introduce risk plausibly enabling catastrophic cyber outcomes" [S114].
- **Limits stated by Meta, April 2025:** "testing conducted to date has not covered, nor could it cover,
  all scenarios"; developers are responsible for "safety testing and tuning tailored to their specific
  applications" [S114].

## Public evaluation tooling they ship
- CyberSecEval, now version 4: MITRE compliance and false-refusal tests, secure code generation (instruct
  and autocomplete), textual and visual prompt injection, code interpreter abuse, vulnerability
  exploitation, spear phishing, autonomous offensive cyber operations, AutoPatch, and CyberSOCEval
  built with CrowdStrike [S125].
- Llama Guard 4, a 12-billion-parameter multimodal safety classifier for prompts and responses across 14
  categories "aligned to safeguard against the standardized MLCommons hazards taxonomy", with published
  recall and false positive rates [S126].
- Prompt Guard and Code Shield, named as system-level protections in the Llama 4 card [S114].
- Open model weights, which the framework notes make it "possible for the broader" community to
  evaluate [S113].

## What is not public (stated as unknown)
- The evaluation set for any given model. The framework says there is no fixed set [S113]; the Llama 4
  card names risk areas, not tasks [S114].
- The performance levels that trigger red teaming, and the uplift-study designs and results that
  informed the Llama 4 conclusions [S113][S114].
- A preparedness report for Llama 4. The framework's reporting commitment is dated April 2026; the Llama
  4 card (April 2025) predates it, and we did not fetch a preparedness report for any Meta model.
- The identities of external experts and red teamers [S113][S114].
- Internal test-set results for Llama Guard 4 beyond the aggregate recall and false positive figures
  [S126].
- METR lists the framework as v2.0, April 2026 [S116]; the underlying evidence behind any threshold
  assignment for a specific model is not in the pages fetched.

## Reading order for a newcomer
1. Meta's February 2025 post, for the framing and the link to the framework [S112].
2. The Advanced AI Scaling Framework v2, Section 2.1 (the three stages) and Table 1 (thresholds), then
   the change log at the end to see what moved between versions [S113].
3. The Llama 4 model card safety section, for what a release states and what it disclaims [S114].
4. CyberSecEval and Llama Guard 4, for the tools you can run on your own deployment [S125][S126].

## Sources
- [S112] Our Approach to Frontier AI, Meta, 2025-02-03.
- [S113] Advanced AI Scaling Framework Version 2, Meta, 2026-04-07.
- [S114] Llama 4 Model Card, Meta, 2025-04-05.
- [S116] Frontier AI Safety Policies tracker, METR, living.
- [S125] CyberSecEval, Meta, living.
- [S126] Llama Guard 4 Model Card, Meta, living.
