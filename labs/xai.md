---
id: xai
title: xAI
sources: [S116, S263, S264, S265, S266]
last_reviewed: 2026-09-27
---

# xAI

## Published framework (what governs a release)
The xAI Frontier Artificial Intelligence Framework (FAIF), effective June 30, 2026 [S263]. METR's tracker
lists the lineage: a Risk Management Framework draft (February 2025), Risk Management Framework v1.0 (August
2025), FAIF v2.0 (December 2025) and the June 30, 2026 FAIF [S116]. The December 30, 2025 version states
that it "complies with California's Transparency in Frontier Artificial Intelligence Act" [S264]; the June
2026 version adopts the terminology of the EU General-Purpose AI Code of Practice for its risk domains [S263].

Four risk domains: "CBRN Risks, Offensive Cybersecurity Risks, Loss of Control Risks and Harmful
Manipulation Risks" [S263]. Three behaviour buckets that the model cards follow: "abuse potential (e.g.,
vulnerability to jailbreaks), concerning propensities (e.g., a propensity for deceiving the user), and
dual-use capabilities (e.g., offensive cyber capabilities)" [S263].

Cadence: "xAI will conduct a full systemic risk assessment and mitigation process of our frontier models at
least once a year", with smaller evaluations triggered by an updated model, a serious incident, a
risk-increasing integration, or a change in the basis for accepting risk [S263]. Evaluations "are performed
precedent to the wider deployment of our models, and are a precondition for release of our models for public
use" [S263]. The final call "reflects an overall judgment based on all the available evidence", including
"human expert red-teaming" [S263].

Thresholds moved between versions. The December 2025 text states two numbers: a risk acceptance criterion of
"maintaining a dishonesty rate of less than 1 out of 2 on MASK", and, on an internal benchmark of restricted
biology and chemistry queries developed "in collaboration with SecureBio", "an answer rate of less than 1
out of 20 on restricted queries" [S264]. The June 2026 text we read speaks of "risk tiers for each systemic
risk category" and "appropriate safety margins" and states no number [S263]. The Grok 4.7 card says the
model "scores below the FAIF safety thresholds on dual-use knowledge" without giving the threshold [S266].

Security is stated as NIST SP 800-171 Rev. 3 with SOC 2 Type II, encryption of weights, and measures
against "large-scale extraction and distillation of reasoning traces" [S263].

## What they say they run before a release (sourced, dated)
- **Grok 4.20, April 2026, release process:** "we conducted evaluations of Grok 4.20's safety profile
  throughout its training process", in single-agent and multi-agent modes, and "we provided third-party
  evaluators access to an early snapshot of Grok 4.20 for testing of our refusal policy" [S265].
- **Refusals and jailbreaks, April 2026:** an internal single-turn dataset of "several thousand diverse
  violative prompts" in six languages, graded by "a separate model"; AgentHarm for agentic refusals; an
  internal set of jailbreak templates; AgentDojo for prompt injection. Reported: violation rate 0.00 on
  refusals, 0.01 with a user jailbreak, 0.30 on AgentHarm, and an AgentDojo attack success rate of 0.33
  [S265].
- **Loss of control, April 2026:** MASK for deception (dishonesty rate 0.27, against 0.43 for Grok 4),
  Anthropic's sycophancy evaluation and an internal contrastive-pair evaluation seeded from production
  conversations, and an RMS calibration error on Humanity's Last Exam. An automated alignment audit uses
  "an internal tool built off of Petri 2.0" over handwritten seed scenarios; the table reports cooperation
  with misuse, sabotage against the operator and against xAI, and "verbalized awareness" of being evaluated
  (0.09). Third-party evaluators received an early checkpoint "for an audit of their deceptive and scheming
  behaviors" [S265].
- **Dual-use, April 2026, pre-mitigation:** WMDP bio and chem, VCT, ProtocolQA, FigQA, CloningScenarios,
  CyBench and MakeMeSay. Grok 4.20 scores 0.91 on WMDP Bio against a stated human baseline of 0.61 and 0.54
  on VCT against 0.22; the card answers with "input filters for restricted chemical and biological
  knowledge" [S265].
- **Grok 4.7, September 2026, method:** "Capability tests are run without the safeguards we use in
  production"; refusal behaviour is measured separately under the release safeguards. "We additionally
  provided an unrestricted configuration of Grok 4.7 to third-party evaluators, who corroborated the
  results of our internal evaluations and testing on cyber capabilities" [S266].
- **Cyber, September 2026:** CyberGym at 80.3%, CVE-Bench, an internal HackerBench with should-refuse and
  should-complete items run under the release safeguards, and CathedralBench, "an independent, third party
  evaluation", at 29% on its hard subset [S266].
- **Jailbreaks, September 2026:** "a broad, continuously updated set of jailbreak attacks"; compliance of
  0.01% on standard jailbreaks, 2.0% on StrongREJECT, 0.65% on long-horizon and Crescendo attacks [S266].
- **Output safety, September 2026:** general refusals in six languages graded by a model (compliance 1.10%),
  a multi-turn child-safety suite (0.0%), bio and chem refusal recall (100% and 99.9%), FORTRESS
  radiological and nuclear items (97.9%), a self-harm suite where a model "additionally fails if it refuses
  without redirecting the user to help" (1.05%), MASK-Rectified (0.00%) and an internal sycophancy set
  (0.03%) [S266].
- **What changed between cards:** the 4.20 card has a loss-of-control section with an alignment audit; the
  4.7 card has a "Behaviors" section with MASK and sycophancy only, and its reference list says "Internal
  evaluations are not listed" [S265][S266].

## Public evaluation tooling they ship
- None of their own in the documents fetched. The cards run public benchmarks (AgentHarm, AgentDojo, MASK,
  WMDP, VCT, CyBench, StrongREJECT, FORTRESS) and an audit tool derived from Anthropic's open Petri
  [S265][S266].
- The 4.7 card names its capability evaluation partners (Abundant AI, Atopile, Cathedral, Datacurve,
  Harbor, LatchBio, Mecado, Proximal Labs, Vals AI) and attributes several coding results to runs by
  Datacurve and Harbor [S266].

## What is not public (stated as unknown)
- The current numeric thresholds. The June 2026 FAIF gives none; the 4.7 card asserts the model is below
  them [S263][S266].
- The internal datasets: the refusal set, the jailbreak templates, HackerBench, the Autointent CBRN suites,
  the contrastive sycophancy set, and the alignment audit seed scenarios [S265][S266].
- Who the third-party safety evaluators are and what they reported. The cards say they existed and, for
  cyber, that they "corroborated" internal results; no report is linked [S265][S266].
- Whether the yearly "full systemic risk assessment" has been published. The FAIF says results "will be
  documented"; we found no such document [S263].
- Whether a Grok 5 model card exists. Our search found cards for Grok 4.5, 4.6 and 4.7 and none for Grok 5.
- The x.ai/safety page returned HTTP 403 to our fetch, so the document index is taken from METR [S116].
- Whether any evaluation not mentioned in a card was run. Absence from a card is not evidence.

## Reading order for a newcomer
1. The FAIF, Sections 2.1 to 2.3, for the risk domains, the yearly cadence and the acceptance language
   [S263].
2. The December 2025 version, the "Thresholds" paragraphs, for the two numbers that later disappeared
   [S264].
3. The Grok 4.20 card end to end. It is eight pages and shows the three buckets with tables [S265].
4. The Grok 4.7 card, Sections 6 to 11, for the current safeguard evaluations and their scale [S266].
5. METR's tracker, for the version history [S116].

## Sources
- [S116] Frontier AI Safety Policies tracker, METR, living.
- [S263] xAI Frontier Artificial Intelligence Framework, xAI, effective 2026-06-30.
- [S264] xAI Frontier Artificial Intelligence Framework, xAI, 2025-12-30 version.
- [S265] Grok 4.20 System Card, xAI, 2026-04-07.
- [S266] Grok 4.7 Model Card, xAI (SpaceXAI), 2026-09-21.
