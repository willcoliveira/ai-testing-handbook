---
id: google-deepmind
title: Google DeepMind
sources: [S087, S107, S108, S109, S110, S111, S116, S236, S237, S238, S239, S240, S241, S242, S243, S244, S245]
last_reviewed: 2026-09-27
---

# Google DeepMind

## Published framework (what governs a release)
The Frontier Safety Framework (FSF), version 3.1, published April 17, 2026 [S109]. Prior versions: 1.0
(May 17, 2024), 2.0 (February 4, 2025), 3.0 (September 22, 2025) [S107]. The framework's four steps, as
stated on the frontier safety page: identify capability levels, "implement protocols to detect the
attainment of such capability levels throughout the model lifecycle", prepare mitigation plans, and
"where required or appropriate, involve external parties" [S107].

The vocabulary [S109]: Critical Capability Levels (CCLs) are "the capability levels at which, absent
mitigation measures, frontier AI models or systems may pose heightened risk of severe harm"; Tracked
Capability Levels (TCLs), added in v3.1, capture "significant but not severe levels of harm"; alert
thresholds are "set marginally earlier than our CCLs"; early warning evaluations "measure the dangerous
capabilities of a model" against the threat scenarios; material capability change assessments decide
whether a new checkpoint needs a fresh critical capability assessment; a safety case is "an assessable
argument showing how severe risks associated with a model's CCLs have been reduced to an acceptable
level". The September 2025 update added a harmful manipulation CCL and "safety case reviews prior to
external launches when relevant CCLs are reached" [S108]. Risk domains named in the Gemini 3 Pro report:
CBRN, cybersecurity, harmful manipulation, machine learning R&D, and misalignment [S110]. METR's tracker
lists FSF 3.1 (April 17, 2026); indexing "should not be considered an endorsement of their substance" [S116].

Three published layers sit below the FSF. The AI principles page says governance "spans the entire
model lifecycle" with "comprehensive pre- and post-launch testing" [S245]. The Gemini API exposes safety
settings: four adjustable categories (harassment, hate speech, sexually explicit, dangerous), five block
thresholds from OFF to BLOCK_LOW_AND_ABOVE over four probability levels; "the default block threshold is
Off for Gemini 2.5 and 3 models"; and "built-in protections against core harms, such as content that
endangers child safety. These types of harm are always blocked and cannot be adjusted" [S236]. The Secure
AI Framework (SAIF) is a security taxonomy of 15 risks (data poisoning, prompt injection, model evasion,
rogue actions and others) with named controls such as "Adversarial Training and Testing" and "Agent
Observability"; the site says its content "is not a reflection of Google's current technical
implementations", so it is guidance, not evidence of internal practice [S244].

## What they say they run before a release (sourced, dated)
- **When, November 2025:** "we conduct a risk assessment using 'early warning evaluations', testing
  specifically for capabilities relevant to the CCLs for the first external deployment of a new
  frontier AI model. For subsequent versions of the model, we conduct a further risk assessment if the
  model has meaningful new capabilities or a material increase in performance" [S110].
- **Cadence, February 2026:** "we conduct continuous testing, evaluating models at a fixed cadence and
  when a significant capability jump is detected" [S111].
- **Elicitation, April 2026:** "we seek to apply appropriate scaffolding, inference compute, and other
  augmentations to also assess the capabilities of systems that will likely be produced with the
  model" [S109]. For ML R&D, the lab "may use sources of information about our own progress at
  accelerating ML R&D" alongside evaluations [S109].
- **Gemini 3 Pro, November 2025:** "we ran our full suite of early warning evaluations on Gemini 3 Pro.
  We found that Gemini 3 Pro did not reach any of our FSF CCLs". The cyber "alert threshold" was met and
  the CCL confirmed not met; the CBRN alert threshold was not reached under the updated framework [S110].
- **Gemini 3.1 Pro, February 2026:** content safety through automated evaluations (text-to-text,
  multilingual, image-to-text), tone and unjustified-refusal measurements, and "manual red teaming by
  specialist teams who sit outside of the model development team"; frontier evaluations across CBRN,
  cyber (alert threshold reached, CCL not), harmful manipulation, ML R&D and misalignment, with no CCL
  reached [S111].
- **External testing, November 2025:** "we work with a set of specialist independent groups" doing
  "structured evaluations, qualitative probing and unstructured red teaming"; "this testing is
  independent of Google, using methodologies and approaches defined by these groups"; for Gemini 3 Pro
  it "was performed on a similar earlier version to the final version" [S110].
- **When alert thresholds are hit, April 2026:** "we will assess the proximity of the model to the CCL
  and analyze the risk posed, involving internal and external experts as needed", leading to a response
  plan; if capabilities "remain distant from a CCL, the response plan may include updating the alert
  threshold" [S109].
- **Gemini 3.8 Flash, September 2026 (a Flash-tier card):** the same automated suites (text-to-text,
  multilingual, image-to-text, tone, unjustified refusals), each reported as a point change against
  Gemini 3.7 Flash: it "performs similarly to Gemini 3.7 Flash across both safety and tone, with low
  unjustified refusals". Child safety "satisfied required launch thresholds"; red teaming found "no
  egregious concerns". Frontier safety was inherited: it "did not reach any Tracked or Critical Capability
  Levels (T/CCLs)" on the basis of the Gemini 3.7 Flash evaluation. No external testers are named [S240].
- **Benchmark method, Gemini 3.5 Flash, May 2026:** "All Gemini scores are pass @1 except where otherwise
  noted"; "'Single attempt' settings allow no majority voting or parallel test-time compute"; results run
  "with default sampling settings"; "To reduce variance, we average over multiple trials for smaller
  benchmarks"; SWE-Bench Pro "averaged over 5x runs" on "an internal version of the Antigravity harness";
  competitor numbers "sourced from providers' self reported numbers unless otherwise mentioned" [S239].
- **Gemma 4, July 2026 (open weights):** "A range of automated as well as human evaluations were
  conducted to help improve model safety" against policies for child sexual abuse material, dangerous
  content, sexually explicit content, hate speech and harassment; "All testing was conducted without
  safety filters to evaluate the model capabilities and behaviors", "keeping unjustified refusals low"
  [S241]; "minimal policy violations" for text-to-text and image-to-text across all sizes [S242]. Neither
  document describes dangerous capability evaluations, red teaming or third-party testing for Gemma 4.
- **ShieldGemma 2, April 2025:** a 4B image safety classifier on Gemma 3, evaluated on an internal
  synthetic set of "approximately 500 examples for each harm policy" and on external data; the card
  warns "there are limited benchmarks that can be used to evaluate content moderation" and that the model
  "is also highly sensitive to the specific user-provided description of safety principles" [S243].
- **What developers are told to run, living:** "the onus is on developers to apply these models
  responsibly"; set "minimum acceptable levels of safety metrics before testing"; adversarial testing is
  "systematically evaluating an ML model with the intent of learning how it behaves when provided with
  malicious or inadvertently harmful input" [S237].

## Public evaluation tooling they ship
- Per-model Frontier Safety Framework Reports (Gemini 3 Pro, Gemini 3.7 Flash) and model cards with a
  frontier safety section [S107][S110][S111].
- The framework document itself, with a glossary that defines each term used in the reports [S109].
- A model cards index (modelcards.withgoogle.com redirects there): "Simple, structured overviews of how
  an advanced AI model was designed and evaluated", newest Gemini 3.8 Audio, September 24, 2026 [S238].
  Per-model methodology notes state pass@1, attempt counts, harnesses and which numbers are
  self-computed [S239].
- Gemini API safety settings and safety guidance [S236][S237]; ShieldGemma 2, an open-weight image
  classifier in the Responsible Generative AI Toolkit [S243]; the SAIF risk map [S244]; the Vertex AI Gen
  AI evaluation service, covered in `tools/platforms.md` [S087].
- No open-source evaluation harness is named in the pages fetched. The UK AISI Inspect Evals collection
  includes a "GDM CTF" suite; see `labs/third-party-evaluators.md`.

## What is not public (stated as unknown)
- The values of alert thresholds and the pass criteria for early warning evaluations. The reports say a
  threshold was met or not met and give selected results (for example "3/11 situational awareness
  challenges") without the threshold rule [S110][S111].
- The contents of the early warning evaluation suite [S109][S110].
- The names of the "specialist independent groups" that run external safety testing and their reports
  [S110].
- The internal decision body and sign-off record. The framework describes "the appropriate governance
  function" without naming it in the sections read [S109].
- Safety cases: the framework says they are produced when a CCL is reached; none was fetched, and no
  model in the fetched reports reached a CCL [S109][S110][S111].
- Which mitigations from the deployment list ("safety post-training, input/output/chain-of-thought
  monitoring and analysis, account moderation, jailbreak detection and patching, user verification, and
  bug bounties") are active on a given model [S109].
- The "required launch thresholds" for child safety, the composition of the automated content safety
  suites behind the Flash cards' point changes, and whether Flash-tier models get external testing; the
  3.8 Flash card names none, and absence is not evidence either way [S240].
- For Gemma 4, whether dangerous capability evaluations or red teaming were run [S241][S242]. For
  ShieldGemma 2, external comparisons: the card promises a technical report we did not fetch, and the
  metric labels in its results table did not survive our fetch, so we do not name them [S243].
- How the API's always-on "built-in protections" are implemented and their error rates [S236].

## Reading order for a newcomer
1. The frontier safety page, for the four steps and the version history [S107].
2. FSF v3.1, the glossary first (pages 18 to 20), then the risk assessment section [S109].
3. The Gemini 3 Pro FSF report, for a full pass of the process on one model, including the alert
   threshold that was met [S110].
4. The Gemini 3.1 Pro model card, for the content safety evaluations that sit outside the FSF [S111].
5. The "Strengthening our Frontier Safety Framework" post, for why manipulation and misalignment were
   added [S108].
6. The Gemini 3.8 Flash card, for what a non-frontier card inherits and reports as deltas [S240], then
   the 3.5 Flash methodology note, to read benchmark tables correctly [S239].
7. Safety settings and safety guidance if you build on the API [S236][S237]; the Gemma 4 and ShieldGemma
   2 cards for what an open-weight release documents [S241][S243].

## Sources
- [S087] Gen AI evaluation service overview (Vertex AI), Google Cloud, living.
- [S107] Frontier safety at Google DeepMind, Google DeepMind, living.
- [S108] Strengthening our Frontier Safety Framework, Google DeepMind, 2025-09-22 (updated 2026-04-17).
- [S109] Frontier Safety Framework Version 3.1, Google DeepMind, 2026-04-17.
- [S110] Gemini 3 Pro Frontier Safety Framework Report, Google DeepMind, 2025-11.
- [S111] Gemini 3.1 Pro Model Card, Google DeepMind, 2026-02.
- [S116] Frontier AI Safety Policies tracker, METR, living.
- [S236] Safety settings (Gemini API docs), Google, living.
- [S237] Safety guidance (Gemini API docs), Google, living.
- [S238] Model cards index, Google DeepMind, living.
- [S239] Gemini 3.5 Flash model evaluation: approach, methodology and results, Google DeepMind, 2026-05.
- [S240] Gemini 3.8 Flash Model Card, Google DeepMind, 2026-09-02.
- [S241] Gemma 4 model card, Google, living.
- [S242] Gemma 4 Technical Report, Gemma Team, 2026-07-02.
- [S243] ShieldGemma 2 model card, Google, 2025-04-03.
- [S244] Secure AI Framework (SAIF) risks, Google, living.
- [S245] Responsible AI practices and AI principles, Google, living.
