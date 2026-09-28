---
id: frontier-safety-frameworks
title: Frontier safety frameworks
area: 5-safety-and-security
status: draft
last_reviewed: 2026-09-28
sources: [S096, S098, S099, S102, S104, S107, S109, S110, S113, S114, S116, S128, S232, S234, S235, S240, S247, S254, S256, S263, S264, S267, S271, S285, S287, S289, S295]
related: [red-teaming, model-and-system-cards, standards-and-regulation, guardrails]
---

# Frontier safety frameworks

## What
A frontier safety framework is a lab's published policy for catastrophic risk. It names capability
thresholds, the evaluations meant to detect them, the mitigations that apply once a threshold is
crossed, and who decides. A system card is the per-release document that reports which of those
evaluations ran on a specific model and what was found. The two are read together: the framework
says what should happen, the card says what the lab says happened.

## Why
Teams that build on a frontier model inherit the lab's safety claims and nothing more. The frameworks
cover chemical and biological weapons, cyber offence, automated AI research and misalignment. They do
not cover an application's own failure modes: an opt-out keyword that is not honoured, a guardrail that
blocks a legitimate question, an agent that follows an instruction inside a pasted email. Reading the
framework tells you what the lab has tested so you can stop re-testing it and spend the budget on what
is yours. The trade-off: the frameworks are voluntary, self-graded and partly redacted. METR indexes
them and says plainly that indexing "should not be considered an endorsement of their substance" [S116].

## How
1. Find the version string and effective date. Frameworks change every few months. Anthropic's RSP is
   at v3.4, effective July 8, 2026 [S096]; Google DeepMind's Frontier Safety Framework is at v3.1,
   published April 17, 2026 [S109]; Meta's Advanced AI Scaling Framework v2.0 is dated April 7, 2026
   [S113]; OpenAI's Preparedness Framework v2 is dated April 15, 2025 [S102].
2. Map the vocabulary before comparing anything. The same idea has four names.

   | Lab | Threshold names | Decision body named in the framework |
   |---|---|---|
   | Anthropic | ASL-3 protections; CB-1 and CB-2; AI R&D thresholds; Risk Reports [S096][S098] | CEO and Responsible Scaling Officer, with Board and Long-Term Benefit Trust [S096] |
   | OpenAI | High and Critical capability thresholds in Tracked Categories [S102] | Safety Advisory Group; Board Safety and Security Committee [S102] |
   | Google DeepMind | Critical Capability Levels, Tracked Capability Levels, alert thresholds [S109] | Not named as a single body in the pages fetched |
   | Meta | Critical, High, Moderate or lower risk thresholds [S113] | Chief AI Officer and Director of Alignment and Risk [S113] |

3. Find the evaluation types the card claims. Look for four words: automated evaluations, uplift
   trials, expert red teaming, third-party assessment. Anthropic's Opus 5.5 card lists exactly these
   four as the evidence base [S098]. OpenAI's framework splits "Scalable Evaluations" with indicative
   thresholds from "Deep Dives" such as human expert red-teaming and third-party evaluations [S102].
4. Find the snapshot policy. Cards evaluate several training snapshots and may report the highest
   score. Sonnet 4.6 reports "the snapshot that scored highest" [S099]. Opus 5.5 states that, starting
   with that model, only release-variant candidates are used in chemical and biological assessments [S098].
5. Find the determination and the safeguards it triggered, then write down what the card says is
   still a lower bound. OpenAI's framework says "any one-time capability elicitation in a frontier
   model" is "a lower bound, rather than a ceiling" [S102].
6. Find what is not there. Every lab file in `labs/` has a section for it. Threshold values, internal
   test sets and red-team rosters are usually absent.
7. Map the residue to your own gate. What the framework does not cover is your test plan.

## Who does it (sourced)
- **Anthropic, July 2026:** the RSP v3.4 commits to "publish a Risk Report every 3-6 months", covering
  all publicly deployed models as of a coverage date, with external review by at least one reviewer
  when a report covers highly capable models and is significantly redacted [S096].
- **Anthropic, September 2026:** the Claude Opus 5.5 system card says the risk assessment draws on
  "automated evaluations, uplift trials, third-party expert red teaming, and third-party assessments",
  and that "the majority of evaluations of Claude Opus 5.5 were run in-house at Anthropic" [S098].
- **OpenAI, April 2025:** the Preparedness Framework says "we do not deploy models that reach a High
  capability threshold until the associated risks that they pose are sufficiently minimized", and that
  "prior to deployment, every covered model undergoes the suite of Scalable Evaluations", compiled into
  a Capabilities Report for the Safety Advisory Group [S102].
- **OpenAI, August 2025:** the GPT-5 system card says OpenAI "decided to treat this launch as High
  capability in the Biological and Chemical domain" while lacking "definitive evidence that this model
  could meaningfully help a novice to create severe biological harm" [S104].
- **Google DeepMind, April 2026:** FSF v3.1 says "early warning evaluations" test the threats identified
  through threat modelling and "assess the proximity of the model to a T/CCL", with "alert thresholds"
  set "marginally earlier than our CCLs" [S109]. The Gemini 3 Pro report says "we ran our full suite of
  early warning evaluations on Gemini 3 Pro" and no CCL was reached [S110].
- **Meta, April 2026:** the framework says "we do not have a fixed set of evaluations that we apply to
  each Frontier AI model", that assessments "typically use a version of the Frontier AI before safety
  mitigations have been applied", and commits to a preparedness report for each closed or open release [S113].
- **EU AI Office, July 2025:** the Code of Practice safety chapter says signatories "will conduct at
  least state-of-the-art model evaluations" including "red-teaming and other methods of adversarial
  testing" [S128].
- **Zhipu, 2024-05:** Zhipu.ai signed the Seoul commitments to red-team "for severe and novel threats", set thresholds at which risks "would be deemed intolerable", and publish "a safety framework focused on severe risks" by February 2025; METR's tracker lists no Zhipu framework as of 2026-09-27 [S234][S116].
- **DeepSeek, 2024-12:** signed the Chinese "Artificial Intelligence Safety Commitments" convened by CAICT, which Carnegie describes as promising red-teaming, transparency and organisational security without explicit thresholds [S235].
- **Alibaba Qwen and Moonshot AI, 2026-09:** no framework found; neither is a Seoul signatory and neither appears on METR's tracker [S234][S116].
- **Context, Concordia AI, 2026-07:** "only five of ten leading foundation-model developers reported safety evaluation results when releasing models this past year. No company did so consistently" [S232].
- **Google, 2026-09:** a Flash-tier card inherits the frontier verdict: Gemini 3.8 Flash "did not reach any Tracked or Critical Capability Levels (T/CCLs)" on the basis of the Gemini 3.7 Flash evaluation under the April 2026 framework [S240].
- **Microsoft, 2026-02:** the Frontier Governance Framework tracks five capabilities, runs a leading indicator assessment "during pre-training, after pre-training is complete, after post-training, and prior to deployment" and "at least every six months", and escalates to a deeper capability assessment scored low, medium, high or critical [S247].
- **Amazon, 2026-09:** the Frontier Model Safety Framework commits that Amazon "will not deploy frontier AI models developed by Amazon that exceed specified risk thresholds without appropriate safeguards in place", with a go/no-go review of "the safeguards evaluation report" by the SVP for model development and the Chief Security Officer [S254].
- **Amazon, 2026-01:** the Nova 2 Lite paper is a per-model framework report with benchmark scores (WMDP-Bio 0.82, ProtocolQA 0.49, VCT 0.29), a third-party uplift study and METR's statement that the model "does not cross the Automated AI R&D Critical Capability Threshold" [S256].
- **METR, living:** the tracker lists Google DeepMind's FSF v3.1 (2026-04-17), Microsoft's Frontier Governance Framework (2026-02, v1.0 2025-02) and Amazon's Frontier Model Safety Framework (2025-02), and states that indexing "should not be considered an endorsement of their substance" [S116].
- **xAI, June 2026:** the FAIF names four risk domains, commits to "a full systemic risk assessment and mitigation process of our frontier models at least once a year" with named triggers, and makes evaluations "a precondition for release" [S263]. **December 2025:** the prior version stated numeric criteria, a MASK dishonesty rate "less than 1 out of 2" and a restricted bio and chem answer rate "less than 1 out of 20"; the June 2026 text gives none [S264].
- **NVIDIA, August 2025:** a Preliminary Risk Assessment (MR1 to MR5, frontier models at MR5) and a Detailed Risk Assessment, with results "stored in our model cards", written while "frontier AI models are not currently under development at NVIDIA" [S267].
- **Cohere, February 2025:** declines capability thresholds as "limited in their methodological maturity", and sets a bright line of "no significant regressions compared to our previously launched model versions", with launch authority delegated to the Chief Scientist [S271].
- **METR, living:** the tracker lists xAI (four versions), NVIDIA (February 2025) and Cohere (February 2025), and no Mistral document [S116].
- **METR, 2026-09:** published a summary of its independent pre-deployment evaluation of Claude Opus 5.5 [S285].
- **Anthropic, 2026-09:** published an alignment assessment of four incidents in which its models gained unauthorised access to third-party systems [S287].
- **Apollo Research, 2026-07:** argued for third-party evaluations during training runs, not only before deployment [S289].
- **Google DeepMind, 2026-08:** piloted a double-blind evaluation in which the evaluator's prompts and the model's weights are hidden from each other in a cryptographically protected environment [S295].

## Pitfalls
1. Treating a lab's determination as coverage for your product. Meta's Llama 4 card says "testing
   conducted to date has not covered, nor could it cover, all scenarios" [S114].
2. Comparing thresholds across labs by name. METR's tracker lists frameworks side by side without
   endorsing any and the definitions differ [S116]; use the table above before quoting a level.
3. Assuming a benchmark still carries signal. The Sonnet 4.6 card says the model "is close to
   saturating our current cyber evaluations" and that saturated infrastructure "can no longer" track
   progression [S099].
4. Confusing the helpful-only variant with what ships. Anthropic reports "behavioral and capabilities
   differences in the helpful-only variants relative to the release candidates" and changed policy
   because of it [S098].
5. Reading a card number as a ceiling. OpenAI states its elicitation is a lower bound [S102]; Meta
   says it assigns thresholds "with maximum elicitation in mind" [S113]. Neither is a promise about
   your deployment.

## Pattern from a production build
None yet.

## Sources
- [S096] Responsible Scaling Policy, Anthropic, living (v3.4 effective 2026-07-08).
- [S098] Claude Opus 5.5 System Card, Anthropic, 2026-09-22.
- [S099] Claude Sonnet 4.6 System Card, Anthropic, 2026-02-17.
- [S102] Preparedness Framework Version 2, OpenAI, 2025-04-15.
- [S104] GPT-5 System Card, OpenAI, 2025-08-13.
- [S107] Frontier safety at Google DeepMind, Google DeepMind, living.
- [S109] Frontier Safety Framework Version 3.1, Google DeepMind, 2026-04-17.
- [S110] Gemini 3 Pro Frontier Safety Framework Report, Google DeepMind, 2025-11.
- [S113] Advanced AI Scaling Framework Version 2, Meta, 2026-04-07.
- [S114] Llama 4 Model Card, Meta, 2025-04-05.
- [S116] Frontier AI Safety Policies tracker, METR, living.
- [S128] EU General-Purpose AI Code of Practice, European Commission, 2025-07-10.
- [S234] Frontier AI Safety Commitments, AI Seoul Summit 2024, UK Department for Science, Innovation and Technology, 2024-05-21
- [S235] DeepSeek and Other Chinese Firms Converge with Western Companies on AI Promises, Scott Singer, Carnegie Endowment for International Peace, 2025-01-28
- [S232] State of AI Safety in China (2026), Concordia AI, 2026-07
- [S240] Gemini 3.8 Flash Model Card, Google DeepMind, 2026-09-02
- [S247] Frontier Governance Framework, Microsoft, 2026-02
- [S254] Amazon's Frontier Model Safety Framework (September 2026 update), Amazon, 2026-09-17
- [S256] Evaluating Nova 2.0 Lite model under Amazon's Frontier Model Safety Framework, Krishna et al., Amazon, arXiv 2601.19134, 2026-01-27
- [S263] xAI Frontier Artificial Intelligence Framework (effective 30 June 2026), xAI, 2026-06-30
- [S264] xAI Frontier Artificial Intelligence Framework (30 December 2025 version), xAI, 2025-12-30
- [S267] Frontier AI Risk Assessment, NVIDIA (Simkin, Pope, Derczynski, Parisien), 2025-08
- [S271] The Cohere Secure AI Frontier Model Framework V1.0, Cohere, 2025-02
- [S285] Summary of METR's predeployment evaluation of Claude Opus 5.5, METR, 2026-09-22
- [S287] An alignment assessment of recent cybersecurity incidents, Anthropic, 2026-09-09
- [S289] We Need 3rd Party Training-Run Evaluations, Apollo Research, 2026-07-05
- [S295] Piloting the world's first double-blind AI evaluations, Google DeepMind, 2026-08-27
