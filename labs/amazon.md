---
id: amazon
title: Amazon
sources: [S086, S116, S124, S254, S255, S256, S257, S258]
last_reviewed: 2026-09-27
---

# Amazon

## Published framework (what governs a release)
Amazon's Frontier Model Safety Framework (FMSF). The first version was published in February 2025 (the
publisher page says February 9; METR lists February 10) and the text we read is the update dated
September 17, 2026 [S254][S116]. The core commitment: Amazon "will not deploy frontier AI models developed
by Amazon that exceed specified risk thresholds without appropriate safeguards in place" [S254]. The
September 2026 text defines four Critical Risk Domains, each with a Critical Capability Threshold: CBRN
weapons proliferation ("expert-level, interactive instruction that provides material uplift (beyond other
publicly available models in known harnesses) that would enable a non-subject matter expert to reliably
produce and deploy a CBRN weapon"), offensive cyber operations ("enable non-subject matter experts to
discover novel end-to-end exploit chains in hardened systems"), harmful manipulation, and loss of control
(autonomous execution of expert-level tasks "including, but not limited to, the research, development,
and deployment of frontier models" that "would impair the ability to direct, modify, or shut down the
model") [S254]. The Nova 2 report and the Nova 2 Lite evaluation describe the earlier framework as three
domains: CBRN, offensive cyber, and automated AI R&D [S255][S256]. We did not fetch the February 2025 text.

Governance as stated: the framework "will be incorporated into the Amazon-wide Responsible AI Governance
Program"; updates are reviewed by "the SVP for the model development team, the Chief Security Officer,
and legal counsel"; "Models may not be released unless evaluations demonstrate that risks are within
acceptable levels prior to launch"; a threshold breach is reported to the SVP and the Chief Security
Officer, who review "the safeguards evaluation report as part of a go/no-go decision"; Amazon "will
publish, in connection with the launch of a frontier AI model, information about the frontier model
evaluation for safety and security"; the framework is revisited "at least annually" [S254]. Below the
FMSF, product-level work is organised around eight responsible AI dimensions: fairness, explainability,
privacy and security, safety, controllability, veracity (defined as "correct system outputs, even with
unexpected or adversarial inputs"), governance and transparency, with content guidelines that govern
"the entire model development life cycle" [S258].

## What they say they run before a release (sourced, dated)
- **Framework method, September 2026:** "internal and, as appropriate, external evaluations on an ongoing
  basis, including during training and prior to deployment"; "maximal capability evaluations" early,
  then pre-deployment evaluations of the mitigations; "we will re-evaluate deployed models prior to any
  major updates that could meaningfully enhance underlying capabilities". Three evaluation types:
  automated benchmarks, expert red teaming ("Red teaming vendors and in-house red teaming experts"), and
  uplift studies ("controlled trials that compare the abilities of a group with access to the new
  frontier model to the abilities of a group without access"), run "both with and without 'agentic
  scaffoldings'". After launch, "lighter-touch automated benchmark assessments on a recurring basis"
  [S254].
- **Nova 2, December 2025:** internal responsible AI benchmarks "performed through automated pipelines and
  reviewed by policy experts", in "reasoning and non-reasoning modes"; partner-built benchmarks D-REX and
  QRLLM; red teaming in three pillars, "internal Amazon red teaming, automated red teaming, and external
  third-party red teaming", with the automated framework upgraded for "multi-lingual, multimodal, and
  agentic testing"; external specialists ActiveFence and Innodata; third-party guardrail assessments by
  Chatterbox Labs, PrismAI, EnkryptAI, Gray Swan and Aymara. FMSF evaluations covered Lite, Omni and Pro,
  "with detailed testing for Lite and Pro": WMDP, ProtocolQA and BioLP-Bench plus uplift studies with
  Nemesys Insights for CBRN; SECURE, CTIBench, CyberMetric and Cybench plus red teaming by "Amazon
  security experts" for cyber; RE-Bench and internal simulations reviewed with METR for AI R&D. All three
  were judged below the critical threshold [S255].
- **Nova 2 Lite under the FMSF, January 2026:** WMDP-Bio (1,273 items) 0.82, WMDP-Chem (408) 0.71,
  ProtocolQA (108) 0.49, BioLP-Bench (800) 0.24, Virology Capabilities Test 0.29; Nemesys ran an uplift
  study with "nearly 800 participants" and "concluded that the model remains below the overall CBRN
  threshold", with a radiological uplift signal that "prompt[ed] additional safeguards". Cyber: over 85%
  on knowledge benchmarks, 40 CyBench challenges, a 7.5% uplift over Nova 1.0 Pro, and Hack The Box
  exercises with "a custom agent deployed on a Kali Linux EC2 instance" in autonomous, scenario and
  human-in-the-loop phases. AI R&D: METR "believe this model does not cross the Automated AI R&D Critical
  Capability Threshold" [S256].
- **Service card testing, December 2025:** "automated benchmarking against publicly available datasets,
  automated benchmarking against proprietary datasets, benchmarking against proxies for anticipated
  customer use cases, human evaluation of completions against proprietary datasets, automated red
  teaming, manual red teaming"; an "Independent Red Teaming Network" of third parties. Harmlessness: on a
  proprietary set of 6.4k harmful prompts, safe responses to "over 98%"; toxicity: 8.5K prompts, "over
  95%" with end-to-end guardrails; bias: 1.4k prompts, 95.8%; CBRN: "no indications that Amazon Nova 2
  Lite increases access". Stability is scored as "the worst-case performance across all perturbations of
  each prompt" [S257].
- **What customers are told to run:** "Customers are responsible for end-to-end testing of their
  applications on datasets representative of their use cases"; on new versions, "Customers should
  consider retesting the performance"; on drift, "periodically retesting" [S257].

## Public evaluation tooling they ship
- Bedrock Guardrails [S124] and Bedrock Evaluations [S086], covered in `tools/platforms.md`.
- Per-model frontier evaluation papers (Nova 2 Lite) alongside the framework's promise to "publish safety
  evaluation reports for our most capable frontier models" [S254][S256].
- AI Service Cards per model with a downloadable training data summary, and the Nova 2 report's content
  moderation results (F1 on Aegis, WildGuard and Jigsaw) for teams considering Nova as a classifier
  [S255][S257].
- Bedrock's automated abuse detection ("no human review of, or access to, user inputs or model outputs")
  and CSAM hash matching [S257]; a private AI bug bounty since November 2025 [S254].

## What is not public (stated as unknown)
- How benchmark scores map to "below the critical threshold". The thresholds are qualitative; no scoring
  rule is given in the framework or the Nova 2 Lite paper [S254][S256].
- Nova 2 Pro and Omni frontier results in detail. The report says Lite and Pro got "detailed testing";
  only the Lite paper was found [S255][S256].
- The proprietary datasets (6.4k, 8.5K, 1.4k prompts) and the internal RAI benchmarks; sizes and pass
  rates are given, contents are not [S255][S257].
- The full third-party reports (Nemesys, METR, the guardrail assessors); the papers quote conclusions
  [S255][S256]. Which of the framework's listed safeguards (training data safeguards, alignment
  training, runtime moderation, fine-tuning safeguards, abuse detection classifiers and others) are
  active on a given model [S254].
- The February 2025 framework text and the exact change set of the September 2026 update; the update
  says only that it reflects "current practices" and "relevant laws and regulations" [S254].
- Whether any evaluation not mentioned in a card or report was run. Absence is not evidence.

## Reading order for a newcomer
1. The FMSF, sections 1, 2 and the governance bullets, for thresholds and the go/no-go step [S254].
2. The Nova 2 Lite evaluation paper, for the numbers behind one "below threshold" call [S256].
3. The Nova 2 report, section 5, for the three red-teaming pillars and the named assessors [S255].
4. The Nova 2 Lite AI Service Card, for the test-driven methodology and the customer duties [S257].
5. The Nova responsible use page, for the content guidelines models are aligned to [S258].
6. Bedrock Guardrails and Evaluations, for the tooling you would use yourself [S124][S086].

## Sources
- [S086] Evaluate model performance using another LLM as a judge (Amazon Bedrock Evaluations), AWS, living.
- [S116] Frontier AI Safety Policies tracker, METR, living.
- [S124] Amazon Bedrock Guardrails components, AWS, living.
- [S254] Amazon's Frontier Model Safety Framework (September 2026 update), Amazon, 2026-09-17.
- [S255] Amazon Nova 2: Multimodal Reasoning and Generation Models, technical report and model card, Amazon AGI, 2025-12.
- [S256] Evaluating Nova 2.0 Lite model under Amazon's Frontier Model Safety Framework, Amazon, 2026-01-27.
- [S257] Amazon Nova 2 Lite, AWS AI Service Card, AWS, living.
- [S258] Responsible use (Amazon Nova 2 user guide), AWS, living.
