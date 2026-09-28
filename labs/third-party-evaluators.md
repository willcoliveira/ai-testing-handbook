---
id: third-party-evaluators
title: Third-party evaluators
sources: [S098, S099, S104, S106, S115, S116, S117, S118, S119, S120, S284, S285, S286, S289, S290]
last_reviewed: 2026-09-28
---

# Third-party evaluators

## Published framework (what governs a release)
Third-party evaluators do not govern a release; the lab does. What they publish is a method, a
benchmark or a tracker, and the labs cite them in system cards. Five appear repeatedly.

- **METR** publishes a tracker of frontier safety policies across twelve developers and states that
  "our indexing these documents should not be considered an endorsement of their substance" [S116]. It
  runs pre-deployment capability evaluations for labs, reported in their cards [S098][S104].
- **UK AI Security Institute (AISI)** maintains Inspect, "an open-source evaluation framework created
  by the UK AISI", released May 2024, and Inspect Evals, "a repository of community contributed LLM
  benchmark evaluations" announced November 13, 2024 [S117]. It runs pre-deployment safeguards and
  capability testing for labs [S104][S098].
- **Apollo Research** published "Frontier Models are Capable of In-context Scheming" in December 2024,
  "a suite of six agentic evaluations where models are instructed to pursue goals and are placed in
  environments that incentivize scheming" [S115], and co-authored the anti-scheming paper with OpenAI
  in September 2025 [S106].
- **MLCommons** publishes AILuminate, "the AI Risk and Reliability Benchmark", v1.0 in February 2025,
  which "evaluates an AI system's resistance to prompts designed to elicit dangerous, illegal, or
  undesirable behavior in 12 hazard categories" [S119], with a 1,200-prompt demo set on GitHub [S120].
- **Stanford CRFM** maintains HELM, "an open source Python framework ... for holistic, reproducible and
  transparent evaluation of foundation models", with a "HELM Safety" leaderboard among others; the
  repository states that "HELM entered maintenance mode on June 1, 2026" [S118].

## What they say they run before a release (sourced, dated)
- **METR on GPT-5, August 2025:** "this work spanned 3 weeks, with OpenAI sharing all requested key
  background information about the model, and providing access to reasoning traces in some
  assessments"; four "tentative" conclusions; a "50%-time horizon" of "around 2h15m"; 789 runs reviewed
  with a monitor that "did not find any clear evidence of sandbagging" [S104].
- **METR on Claude Opus 5.5, September 2026:** "capability testing, conducted via API access granted
  over a period of 10 business days" on five tasks, plus a questionnaire and an interview with an
  Anthropic researcher; "our work ... was not meant to verify claims about compliance with any specific
  threshold from Anthropic's policies" [S098].
- **UK AISI on GPT-5, August 2025:** with "access to prototype versions of our safeguards", "the UK
  AISI's Safeguards team identified multiple model-level jailbreaks that overcome gpt-5-thinking's
  built-in refusal logic"; "one of the jailbreaks evades all layers of mitigations and is being patched"
  [S104].
- **UK AISI with Gray Swan, February and September 2026:** the Agent Red Teaming benchmark was
  "developed in collaboration with the UK AI Security Institute" [S099]; the later indirect-injection
  benchmark was built "in partnership with the UK AI Security Institute, the US Center for AI Standards
  and Innovation, and model developers" [S098].
- **Apollo on GPT-5, August 2025:** "26 evaluations (>180 environments, >4600 samples) that measure
  capability and propensity to take covert or deceptive actions", with "rate-limited access to the
  internal reasoning" and a finding that the model "is sometimes aware of being evaluated" [S104].
- **Apollo, December 2024:** models tested were o1, Claude 3.5 Sonnet, Claude 3 Opus, Gemini 1.5 Pro
  and Llama 3.1 405B; o1 "maintains deception in over 85% of follow-up questions" [S115].
- **MLCommons, February 2025:** grading on a five-tier scale from Poor to Excellent, with a full test
  set of 24,000 human-generated prompts and a public demo set of 1,200 [S119][S120].
- **US CAISI, 2025 to 2026:** named in both labs' cards as running pre- and post-deployment evaluations
  of cyber and biological capabilities and safeguards [S104][S098]. We did not fetch a CAISI publication.
- **METR, 2026:** a summary of its independent pre-deployment evaluation of Claude Opus 5.5 (2026-09-22) [S285], and a post on how independent researchers could investigate AI propensities after misalignment incidents (2026-07-28) [S286]. **Apollo Research, 2026:** an argument for third-party evaluations during training runs (2026-07-05) [S289] and a method for measuring reward-seeking through contrastive belief updates (2026-07-21) [S290]. **OWASP, 2026-06:** a red, blue and purple teaming taxonomy [S284]. All listed by the 2026-09-28 refresh; not yet read in full.

## Public evaluation tooling they ship
- Inspect and Inspect Evals (UK AISI): "over 200 pre-built evaluations", agent benchmarks including
  GAIA, SWE-Bench, GDM CTF and Cybench, "run against any model with a single command" [S117].
- HELM (Stanford CRFM): Apache-2.0, standardised datasets, a unified model interface, and metrics
  "beyond accuracy (e.g. efficiency, bias, toxicity)" [S118].
- AILuminate demo prompts (MLCommons): 1,200 prompts in English and French across 12 hazards, with
  personas "normal, unskilled, skilled", under CC BY 4.0 [S120].
- METR's time-horizon methodology, referenced in the GPT-5 card [S104]; the tracker of safety policies
  [S116].
- Apollo's scheming evaluations, described in the paper [S115]; release status is not stated in the
  abstract fetched.

## What is not public (stated as unknown)
- The full METR and Apollo reports behind the card summaries. Cards quote conclusions; the supporting
  evidence for a "separate METR assessment" with "elevated access" was, by METR's own account, not
  shared even with METR's other team [S098].
- The jailbreaks UK AISI found on GPT-5. The card reports their existence and that one is being patched
  [S104].
- The access terms: what model versions, safeguards and traces each evaluator received, beyond the
  sentences quoted above.
- Whether an evaluator's findings changed a launch decision. The cards say findings "contribute" to or
  are "consistent with" determinations [S098]; no card fetched describes a launch blocked by a third
  party.
- AILuminate's full 24,000-prompt set, which is held back from the public demo set by design [S120].
- CAISI's own methods; not fetched.

## Reading order for a newcomer
1. METR's tracker, to see every framework side by side [S116].
2. The GPT-5 card, Sections 5.1.3.7, 5.2.1 and 5.3.3.5, for what METR, Apollo, CAISI and UK AISI each
   did on one model [S104].
3. The Opus 5.5 card, Section 2.3.6, for METR's own wording of what its assessment is and is not [S098].
4. Inspect Evals, to run a benchmark yourself [S117]; then AILuminate's demo set for a safety pass
   [S120]; then HELM Safety for a leaderboard view [S118].
5. Apollo's scheming paper, for the evaluation design labs now cite [S115].

## Sources
- [S098] Claude Opus 5.5 System Card, Anthropic, 2026-09-22.
- [S099] Claude Sonnet 4.6 System Card, Anthropic, 2026-02-17.
- [S104] GPT-5 System Card, OpenAI, 2025-08-13.
- [S106] Stress Testing Deliberative Alignment for Anti-Scheming Training, OpenAI and Apollo Research, 2025-09-19.
- [S115] Frontier Models are Capable of In-context Scheming, Apollo Research, 2024-12-06.
- [S116] Frontier AI Safety Policies tracker, METR, living.
- [S117] Announcing Inspect Evals, UK AI Security Institute, 2024-11-13.
- [S118] HELM repository, Stanford CRFM, living.
- [S119] AILuminate v1.0 benchmark paper, MLCommons, 2025-02-19.
- [S120] AILuminate repository, MLCommons, living.
- [S284] Solutions Landscape: Red Teaming Taxonomy, OWASP GenAI Security Project, 2026-06-28.
- [S285] Summary of METR's predeployment evaluation of Claude Opus 5.5, METR, 2026-09-22.
- [S286] How independent researchers could investigate AI propensities after misalignment incidents, METR, 2026-07-28.
- [S289] We Need 3rd Party Training-Run Evaluations, Apollo Research, 2026-07-05.
- [S290] Measuring Reward-Seeking via Contrastive Belief Updates, Apollo Research, 2026-07-21.
