---
id: anthropic
title: Anthropic
sources: [S096, S097, S098, S099, S100, S101, S116, S287, S288]
last_reviewed: 2026-09-28
---

# Anthropic

## Published framework (what governs a release)
The Responsible Scaling Policy (RSP), version 3.4, effective July 8, 2026 [S096]. Version 3.0
(February 24, 2026) was "a comprehensive rewrite" that introduced two artifacts: Frontier Safety
Roadmaps, described as "public goals against which we will openly grade our progress", and Risk
Reports, which "will provide detailed information on the safety profile of our models at the time of
publication" [S096][S097]. The RSP says "we will publish a Risk Report every 3-6 months" and that, unlike
system cards, Risk Reports "will not be published with each new model release" [S096]. It commits to
external review "with at least one external reviewer anytime a Risk Report covers highly capable models
and is significantly redacted", with reviewers approved by the Long-Term Benefit Trust [S096].

The vocabulary: ASL-3 protections (security and deployment standards); chemical and biological
thresholds CB-1 and CB-2; AI R&D thresholds; a sabotage risk assessment for models that push the
frontier [S098][S099]. The Opus 5.5 card also cites a Frontier Compliance Framework (FCF) alongside the
RSP [S098]; METR's tracker lists it as dated June 2026 [S116]. We did not fetch the FCF itself.

Versions listed on the RSP page: 1.0 (September 19, 2023), 2.0 (October 15, 2024), 2.1 (March 31,
2025), 2.2 (May 14, 2025), 3.0 (February 24, 2026), 3.1 (April 2, 2026), 3.2 (April 29, 2026), 3.3
(May 26, 2026), 3.4 (July 8, 2026) [S097]. Risk Reports were published in February 2026 and August
2026 [S097].

## What they say they run before a release (sourced, dated)
- **Process, September 2026:** "we evaluate multiple model snapshots throughout the training process,
  then make our final determination of the model's risk level based on both the capabilities of the
  production release candidate and the trends we observed leading up to it", drawing on "automated
  evaluations, uplift trials, third-party expert red teaming, and third-party assessments" [S098].
- **Snapshots, September 2026:** "starting with Opus 5.5, we only use release-variant candidate models
  in our CB assessments", because of "behavioral and capabilities differences in the helpful-only
  variants relative to the release candidates" [S098].
- **RSP evaluations, September 2026:** chemical and biological evaluations (human-run and automated,
  including external testing by the US Center for AI Standards and Innovation), AI R&D and autonomy
  evaluations (with pre-deployment testing by METR over "10 business days" of API access on five tasks),
  and cyber evaluations [S098]. Determination: CB-1 but not CB-2; below the next AI R&D threshold [S098].
- **Safeguards testing, September 2026:** an internal adversarial evaluation where an attacker model has
  "a 400-call limit against the assistant" on sandboxed cyber tasks; external red teaming of the
  safeguards by contracted testers (roughly 95 hours and 29,000 requests from one, 56 hours from
  another, and an automated attacker with roughly 3,300 attempts across 61 scenarios) [S098].
- **Harmlessness, September 2026:** "single-turn prompts that span clearly harmful and clearly benign
  requests, ambiguous-context prompts", and "multi-turn conversations in which a simulated user attempts
  to gradually steer the model toward a harmful outcome", reported "without the additional safeguards we
  apply in production", in two configurations (API with no system prompt; claude.ai with the production
  system prompt) [S098]. Standing suites: child safety, suicide and self-harm, disordered eating,
  political even-handedness, election integrity [S098].
- **Agentic safety, September 2026:** malicious use of Claude Code and computer use; an agentic
  influence campaign evaluation; prompt injection across "coding, tool use, GUI computer use, and
  browser use", including an external benchmark of 37 scenarios and 1,804 attacks and adaptive
  attackers [S098].
- **Alignment assessment, September 2026:** an automated behavioral audit of "about 4,000 investigation
  sessions" per model from "about 1,900 scenario descriptions", scored by a judge on "several dozen
  dimensions"; targeted evaluations for pasted-text instructions, destructive actions, self-preference,
  honesty; white-box analyses; sabotage-capability evaluations [S098].
- **Non-frontier releases, February 2026:** for Sonnet 4.6 the "Preliminary Assessment Process" ran
  "automated assessments only" for ASL-3 and ASL-4 thresholds and "did not conduct human uplift trials,
  expert red-teaming sessions, or other resource-intensive evaluations", nor pre-deployment testing with
  external government partners, "since Claude Sonnet 4.6 is not a frontier model" [S099].
- **Evaluations run in seven languages, February 2026:** single-turn safety evaluations ran in Arabic,
  English, French, Hindi, Korean, Mandarin Chinese and Russian [S099].
- **September 2026, listed by the refresh and not yet read in full:** an alignment assessment of four incidents in which Claude models gained unauthorised access to real third-party systems [S287], and a Frontier Red Team measurement of tactical intelligence targeting and conventional weapons capabilities [S288].

## Public evaluation tooling they ship
- Petri, an open-source auditing tool: an auditor agent, seed instructions in natural language, and LLM
  judges that "score each conversation across multiple safety-relevant dimensions" [S101]. The Sonnet
  4.6 card reports "Petri 2.0" results over 362 investigations per model for cross-provider comparison
  [S099].
- The agentic misalignment scenarios (blackmail, corporate espionage, lethal action) tested on 16
  models in June 2025, with the finding that "direct instructions reduced but did not prevent" the
  behaviours [S100].
- Published Risk Reports (redacted) and a Sabotage Risk Report for Opus 4.6 [S097].

## What is not public (stated as unknown)
- The contents of the internal evaluation suites: the CB task sets, the "rule-out" evaluations, the
  1,900 audit scenarios and the judge rubric are described but not released [S098].
- Numerical thresholds for most determinations. The cards report that a threshold was or was not
  crossed and give selected scores; the decision rules that map scores to CB-1, CB-2 or AI R&D levels
  are not published in the pages fetched [S098][S099].
- The unredacted Risk Reports and the identity of external reviewers. The RSP commits to redaction
  indications and reviewer selection with LTBT approval, not to full publication [S096].
- The full roster of external testers and their reports. The cards name some organisations and
  summarise their findings; METR's summary explicitly "was not meant to verify claims about compliance
  with any specific threshold" [S098].
- Classifier designs and false-positive rates for the production safeguards. The card states the goal
  of reducing the false-positive rate but does not publish the rate [S098].
- The Frontier Compliance Framework text, which we did not fetch.
- Whether any evaluation not mentioned in a card was run. Absence from a card is not evidence.

## Reading order for a newcomer
1. The RSP page for the version list and the three artifacts (Roadmap, Risk Report, system card) [S096][S097].
2. The executive summary of the Claude Opus 5.5 system card, then Section 1.4 to 1.6 (evaluations,
   safeguards, external testing) and Section 2.1 (the risk assessment process) [S098].
3. The Sonnet 4.6 card, Section 1.2 and Section 6.1, to see what a non-frontier release skips [S099].
4. Petri, to run an automated audit yourself [S101].
5. Agentic misalignment, for the shape of a scenario-based evaluation [S100].

## Sources
- [S096] Responsible Scaling Policy, Anthropic, living (v3.4 effective 2026-07-08).
- [S097] RSP updates, Anthropic, living.
- [S098] Claude Opus 5.5 System Card, Anthropic, 2026-09-22.
- [S099] Claude Sonnet 4.6 System Card, Anthropic, 2026-02-17.
- [S100] Agentic Misalignment, Anthropic, 2025-06-20.
- [S101] Petri: an open-source auditing tool, Anthropic, 2025-10-06.
- [S116] Frontier AI Safety Policies tracker, METR, living.
- [S287] An alignment assessment of recent cybersecurity incidents, Anthropic, 2026-09-09.
- [S288] Measuring tactical intelligence targeting and conventional weapons capabilities of AI models, Anthropic Frontier Red Team, 2026-09-10.
