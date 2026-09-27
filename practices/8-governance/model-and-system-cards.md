---
id: model-and-system-cards
title: Model and system cards
area: 8-governance
status: draft
last_reviewed: 2026-09-27
sources: [S156, S157, S160, S161, S164, S165, S216, S222, S223, S226, S229, S230, S238, S239, S246, S252, S254, S257, S265, S266, S267, S269, S273]
related: [frontier-safety-frameworks, golden-datasets, capability-benchmarks, standards-and-regulation, data-contamination]
---

# Model and system cards

## What
A model card is a short document that ships with a trained model and states what it is, what it is for, and how it performs across conditions and groups [S156]. A datasheet does the same for a dataset: why it was made, what is in it, how it was collected, what it should and should not be used for, and who maintains it [S157]. A system card is the frontier labs' longer form for a specific release: the evaluations run, the safeguards applied, and the reasoning behind the decision to ship [S164]. All three are read more often than they are written, so the skill is reading them for what is missing.

## Why
Without a card a downstream team cannot separate intended use from out-of-scope use, and cannot tell whether a headline number was measured on anything like their distribution. Model cards were proposed "to clarify the intended use cases of machine learning models and minimize their usage in contexts for which they are not well suited" [S156]. Datasheets were proposed because "there is currently no standardized process for documenting machine learning datasets" [S157]. The trade-off is upkeep: a card describes one version, and a card that is not updated on the next version is worse than no card, because it is trusted.

## How
Reading a model card, in the order of the nine sections proposed by Mitchell et al. [S156]:

| Section | What to look for | Red flag |
|---|---|---|
| Model Details | version, date, licence, who built it | no version or date |
| Intended Use | primary uses, intended users, out-of-scope uses | out-of-scope section empty |
| Factors | groups, environments, instrumentation the results are split by | one aggregate number |
| Metrics | which metrics, decision thresholds, variation | no threshold, no variance |
| Evaluation Data | what, why chosen, preprocessing | "internal" with no description |
| Training Data | source and composition | not stated at all |
| Quantitative Analyses | unitary and intersectional results | only the best group shown |
| Ethical Considerations | sensitive uses, known harms | boilerplate |
| Caveats and Recommendations | what was not tested | absent |

Reading a datasheet: seven question groups, Motivation, Composition, Collection Process, Preprocessing/cleaning/labeling, Uses, Distribution, Maintenance [S157]. For an eval set the questions that matter most are how many instances there are, who labelled them and how, whether it is a sample of a larger set, which uses are discouraged, and whether it will be updated (which breaks comparisons across time).

Reading a system card, using the Claude Sonnet 4.6 card as the worked example [S164]:
1. Find the release decision section first (there it is section 1.2). Note which snapshots were measured: "many of our dangerous capability evaluations measure whichever snapshot scored highest", and the card states results are "generally" from the final deployed model.
2. Find the safety level and who set it: "we have deployed Claude Sonnet 4.6 under the AI Safety Level 3 (ASL-3) Standard"; "the Responsible Scaling Officer (RSO) determined the ASL-3 safeguards level to be appropriate for the CBRN domain".
3. Find what was not run. This card says "Automated assessments only", "We did not conduct human uplift trials", and, on third-party assessments, "Since Claude Sonnet 4.6 is not a frontier model, we did not do so before its release".
4. Read the changelog. This card's 6 March 2026 changelog revises two BrowseComp scores after "an improved cheating detection pipeline" flagged unintended solutions. A card that has never been corrected is not necessarily a card that was right.
5. Map the sections to your own risk: 3 Safeguards and harmlessness, 4 Alignment assessment, 5 Agentic safety (including prompt injection in coding, computer use and browser use), 6 RSP evaluations.

Writing a card for your own application: use a README.md with YAML metadata so tooling can index it [S165]; fill Intended Use and out-of-scope first; version and date it; link the eval set and give that set a datasheet; write the "not tested" list before the results table.

## Who does it (sourced)
- **Mitchell et al. (Google), January 2019 (v2):** "we recommend that released models be accompanied by documentation detailing their performance characteristics"; model cards "provide benchmarked evaluation in a variety of conditions, such as across different cultural, demographic, or phenotypic groups"; nine sections from Model Details to Caveats and Recommendations [S156].
- **Gebru et al., December 2021 (v8, CACM):** "we propose that every dataset be accompanied with a datasheet that documents its motivation, composition, collection process, recommended uses, and so on"; datasheets serve "two key stakeholder groups: dataset creators and dataset consumers" [S157].
- **Hugging Face, docs, living (checked 2026-09-26):** the model card is the repo's `README.md` with a YAML block; it "should describe" the model, "its intended uses & potential limitations, including biases and ethical considerations as detailed in Mitchell, 2018", training details, datasets and evaluation results; `base_model`, `new_version` and `model-index` fields make lineage and results machine-readable [S165].
- **Anthropic, 17 February 2026 (changelog 6 March 2026):** they say the system card describes "evaluations for its capabilities and its safety-related properties" and outlines "the reasoning behind its release under our Responsible Scaling Policy"; sections run Introduction, Capabilities, Safeguards and harmlessness, Alignment assessment, Agentic safety, RSP evaluations, Appendix [S164]. What the internal review looked like beyond the RSO determination is not public.
- **EU AI Office, July 2025:** providers document each model in a Model Documentation Form before placing it on the market and keep it updated for ten years (Measure 1.1); systemic-risk providers also produce a Model Report that includes "at least five random sample of inputs and outputs from each relevant model evaluation" (Measure 7.3) [S161].
- **NIST, July 2024:** suggested action MS-2.3-002, "Evaluate claims of model capabilities using empirically validated methods" [S160].
- **DeepSeek, 2026-04:** the V4 "Technical Documentation" covers provider, release date, architecture, sizes, distribution, licence, acceptable use, intended use and training-data handling, and has no evaluation or safety section [S216].
- **Moonshot AI, 2026-07:** the Kimi-K3 card carries capability tables with run counts and sampling settings, links a "Full Report" PDF, and has brief refusal notes on cyber benchmarks and no safety section [S226].
- **Zhipu, 2026-02:** the GLM-5 card states per-task sampling settings and context windows and a modified Terminal-Bench 2.0; no safety statement [S230].
- **Alibaba Qwen, living:** Qwen3 and Qwen3.5 cards carry a Best Practices block on sampling and output format and no safety statement [S222][S223].
- **Zhipu, 2025-08:** GLM-4.5 is the one report here with a safety table, SafetyBench 89.9 over 11,435 multiple-choice questions in seven categories [S229].
- **Google, living:** the model cards index describes cards as "Simple, structured overviews of how an advanced AI model was designed and evaluated" and lists cards per Gemini, Gemma, generative and robotics release with dates [S238].
- **Google, 2026-05:** the Gemini 3.5 Flash methodology note accompanies the card and states which scores are self-computed, which are "sourced from providers' self reported numbers", and the run counts behind each benchmark [S239].
- **Microsoft, 2022-06:** the Responsible AI Standard makes a Transparency Note mandatory for platform services, carrying "intended uses" and "evidence that the system is fit for purpose" (A3.6) and the reliability evaluation outputs (RS1.9) [S246].
- **Microsoft, 2026-07:** the Foundry safety evaluations Transparency Note states that models sold by Azure "have been evaluated by Microsoft based on Microsoft's Responsible AI standards" while third-party and open models "have not been evaluated by Microsoft" [S252].
- **Amazon, 2025-12:** an AWS AI Service Card covers intended uses, a test-driven methodology, per-dimension results with dataset sizes and pass rates, and a downloadable training data summary, and is dated to a release ("current as of December 2, 2025") [S257].
- **Amazon, 2026-09:** the framework commits that "Amazon will publish, in connection with the launch of a frontier AI model, information about the frontier model evaluation for safety and security" [S254].
- **xAI, September 2026:** the Grok 4.7 card gives each evaluation its own subsection, states whether safeguards were on, names its evaluation partners, and says in its references that "Internal evaluations are not listed" [S266]; the 4.20 card structures itself by malicious use, loss of control and dual-use capability [S265].
- **NVIDIA, March 2026:** the Nemotron-3-Content-Safety card states training window, sample counts (about 86k train, 6k test, 6k eval), collection method and licence alongside the benchmark table [S269]; the risk framework says assessment data "is then stored in our model cards" [S267].
- **Cohere, October 2024:** the Command R and R+ model card reports a BOLD bias evaluation and a multi-turn toxicity caveat [S273].
- **Hugging Face, living:** the Hub model card format carries `model-index` evaluation metadata [S165]; Mistral's Large 3 card shows results as images (fetched, not registered).

## Pitfalls
1. Reading the aggregate and skipping the factors. The point of the format is the disaggregated table [S156].
2. A card with no version. `base_model` and `new_version` exist so a reader can tell which weights a card describes [S165].
3. Trusting a card that does not say what was not run. The Sonnet 4.6 card lists what it skipped; a card without that list has not necessarily run more [S164].
4. An eval set without a datasheet. Nobody can say where the cases came from or which uses are discouraged [S157].
5. Cards that are never corrected. Scores get revised when graders improve; a changelog is a feature [S164].

## Pattern from a production build
None yet.

## Sources
- [S156] Model Cards for Model Reporting, Mitchell et al. (arXiv 1810.03993 v2), 14 January 2019.
- [S157] Datasheets for Datasets, Gebru et al. (arXiv 1803.09010 v8), 1 December 2021.
- [S160] AI RMF: Generative AI Profile (NIST AI 600-1), NIST, July 2024.
- [S161] General-Purpose AI Code of Practice, EU AI Office, 10 July 2025.
- [S164] Claude Sonnet 4.6 System Card, Anthropic, 17 February 2026.
- [S165] Model Cards, Hugging Face Hub docs, living.
- [S216] DeepSeek V4 Technical Documentation (model card), DeepSeek AI, 2026-04-27
- [S226] Kimi-K3 model card, Moonshot AI (Hugging Face), living
- [S230] GLM-5: from Vibe Coding to Agentic Engineering, Z.ai (arXiv 2602.15763), 2026-02-17
- [S222] Qwen3-235B-A22B model card, Qwen Team, Alibaba (Hugging Face), living
- [S223] Qwen3.5-122B-A10B model card, Qwen Team, Alibaba (Hugging Face), living
- [S229] GLM-4.5: Agentic, Reasoning, and Coding (ARC) Foundation Models, Zhipu AI and Tsinghua University (arXiv 2508.06471), 2025-08-08
- [S238] Model cards index, Google DeepMind, living
- [S239] Gemini 3.5 Flash model evaluation: approach, methodology and results, Google DeepMind, 2026-05
- [S246] Microsoft Responsible AI Standard, v2, General Requirements, Microsoft, 2022-06
- [S252] Microsoft Foundry risk and safety evaluations Transparency Note, Microsoft, living
- [S257] Amazon Nova 2 Lite, AWS AI Service Card, AWS, living
- [S254] Amazon's Frontier Model Safety Framework (September 2026 update), Amazon, 2026-09-17
- [S266] Grok 4.7 Model Card (revision 2026-09-21), xAI (SpaceXAI), 2026-09-21
- [S265] Grok 4.20 System Card, xAI, 2026-04-07
- [S269] Nemotron-3-Content-Safety model card, NVIDIA, Hugging Face, living
- [S267] Frontier AI Risk Assessment, NVIDIA (Simkin, Pope, Derczynski, Parisien), 2025-08
- [S273] Command R and Command R+ model card (responsible use), Cohere docs, living
