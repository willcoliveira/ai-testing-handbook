---
id: openai
title: OpenAI
sources: [S102, S103, S104, S105, S106, S116, S131]
last_reviewed: 2026-09-26
---

# OpenAI

## Published framework (what governs a release)
The Preparedness Framework, Version 2, last updated April 15, 2025 [S102]. It tracks three "Tracked
Categories": Biological and Chemical, Cybersecurity, and AI Self-improvement, each with a "High" and a
"Critical" capability threshold [S102]. "Research Categories" such as sandbagging and nuclear and
radiological capabilities are watched without thresholds [S102]. The commitment: "we do not deploy
models that reach a High capability threshold until the associated risks that they pose are
sufficiently minimized", and Critical thresholds require safeguards "during development, irrespective of
deployment plans" [S102]. An internal Safety Advisory Group (SAG) "makes expert recommendations";
"OpenAI Leadership can approve or reject these recommendations, and our Board's Safety and Security
Committee provides oversight" [S102].

Two documents feed the decision: a Capabilities Report compiled from "Scalable Evaluations" with
"indicative thresholds", and a Safeguards Report listing the ways harm can be realised, the safeguards,
their efficacy and residual risk [S102]. "Deep Dives" add evidence: "human expert red-teaming, expert
consultations, resource-intensive third party evaluations" [S102]. The framework applies to "every
frontier model" deployed externally, to agentic systems that "represent a substantial increase in the
capability frontier", and to "any significant change in the deployment conditions" [S102].

METR's tracker also lists an OpenAI "Frontier Governance Framework (May 2026)" [S116]. We did not fetch
it; nothing here describes it. System cards are collected on the Deployment Safety Hub, which lists
cards through September 2026 [S103].

## What they say they run before a release (sourced, dated)
- **Elicitation, April 2025:** evaluations run "using the highest-capability tier of system settings,
  using a version of the model that has a negligible rate of safety-based refusals ... and with the best
  presently-available scaffolds"; "we regard any one-time capability elicitation in a frontier model as a
  lower bound, rather than a ceiling" [S102].
- **Safety evaluations, August 2025:** the GPT-5 card reports disallowed content (a saturated standard
  set plus multi-turn "Production Benchmarks"), sycophancy, jailbreaks, instruction hierarchy ("system
  prompt extraction" and "phrase protection"), prompt injections (browsing, tool-calling, coding),
  hallucinations, deception with chain-of-thought monitoring, image input, health, multilingual
  performance and a bias benchmark [S104].
- **Red teaming, August 2025:** "more than 5,000 hours of work from over 400 external testers and
  experts" across campaigns grouped as pre-deployment research, API safeguards testing and in-product
  safeguards testing; 25 domain red teamers for violent attack planning in a blind pairwise design; two
  external groups on a two-week system-level prompt-injection assessment; the Microsoft AI Red Team with
  more than 70 experts and PyRIT [S104].
- **Preparedness evaluations, August 2025:** biological (long-form risk questions, multimodal virology
  troubleshooting, ProtocolQA, tacit knowledge, and external evaluations by SecureBio), cyber (capture
  the flag, a cyber range, external evaluations by Pattern Labs), AI self-improvement (SWE-bench
  Verified, OpenAI PRs, MLE-Bench, SWE-Lancer, PaperBench, OPQA, and external evaluation by METR over
  three weeks) [S104]. Determination: treated as High in Biological and Chemical "primarily to ensure
  organizational readiness" [S104].
- **Scheming, August and September 2025:** Apollo Research ran "26 evaluations (>180 environments,
  >4600 samples)" and reported a covert action rate of 3.97% for gpt-5-thinking against 8.24% for o3 and
  28.36% for a helpful-only variant [S104]. The joint anti-scheming paper reports a reduction from 13%
  to 0.4% on o3 with deliberative alignment, with the caveat that reductions may be "partially driven by
  situational awareness" [S106].
- **Safeguard testing, August 2025:** model safety training tested on prompts from "red teamers with
  biosafety-relevant PhDs" and a filtered sample of production prompts; system-level protections
  reported as a topical classifier (recall 0.960, precision 0.737) and a reasoning monitor (recall 0.838,
  precision 0.647); three expert bioweaponisation campaigns; third-party red teaming; "external
  government red teaming" by the US CAISI and the UK AI Security Institute, the latter with access to
  "prototype versions of our safeguards" and finding "multiple model-level jailbreaks" [S104].

## Public evaluation tooling they ship
- The Deployment Safety Hub, "sharing the technical work we do to make our systems safe, including how
  deployed models perform in evaluations, the risks we measure, and the steps we take to improve over
  time" [S103].
- Published system cards, which name the external evaluations and give tables of results [S104].
- The anti-scheming environments are described in the paper [S106]; whether they are released as code
  is not stated in the pages fetched.
- PyRIT is Microsoft's, not OpenAI's, but it is the automated red-teaming tool named in the GPT-5 card
  [S104][S131].

## What is not public (stated as unknown)
- The values of the "indicative thresholds" for each Scalable Evaluation. The framework defines the
  term; the card reports whether a threshold was judged crossed [S102][S104].
- The membership of the Safety Advisory Group and the record of its recommendations [S102].
- The full prompt-injection defence stack. The card says "we have implemented further mitigations but
  due to the adversarial nature of prompt injections, they are not all described here" [S104].
- The contents of the "Production Benchmarks" and the standard disallowed-content set [S104].
- The full reports from SecureBio, Pattern Labs, METR, Apollo Research, CAISI and UK AISI. The card
  summarises; METR's and Apollo's own publications are separate [S104].
- The Frontier Governance Framework (May 2026) listed by METR [S116], which we did not fetch.
- The scheming blog post itself returned an error on fetch; the numbers above come from the arXiv paper
  and a web search summary [S105][S106].

## Reading order for a newcomer
1. Preparedness Framework v2, Sections 1 to 4: the categories, thresholds, reports and SAG [S102].
2. GPT-5 system card, Section 3 (safety evaluations) and Section 4 (red teaming), then Section 5.3.3
   (safeguard testing) for the recall-precision numbers [S104].
3. The anti-scheming paper, for how covert actions are used as a proxy and why situational awareness
   is a caveat [S106].
4. The Deployment Safety Hub, to find the card for the model you are actually using [S103].

## Sources
- [S102] Preparedness Framework Version 2, OpenAI, 2025-04-15.
- [S103] Deployment Safety Hub, OpenAI, living.
- [S104] GPT-5 System Card, OpenAI, 2025-08-13.
- [S105] Detecting and reducing scheming in AI models, OpenAI, 2025-09 (fetch failed).
- [S106] Stress Testing Deliberative Alignment for Anti-Scheming Training, OpenAI and Apollo Research, 2025-09-19.
- [S116] Frontier AI Safety Policies tracker, METR, living.
- [S131] PyRIT, Microsoft, living.
