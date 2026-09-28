---
id: standards-and-regulation
title: Standards and regulation
area: 8-governance
status: draft
last_reviewed: 2026-09-28
sources: [S158, S159, S160, S161, S162, S163, S164, S233, S234, S244, S247, S250, S254, S257, S281, S282, S283, S291]
related: [model-and-system-cards, frontier-safety-frameworks, red-teaming, prompt-injection, human-in-the-loop, regulated-domain-checks]
---

# Standards and regulation

## What
Five documents an AI quality engineer gets asked about: the NIST AI Risk Management Framework and its Generative AI Profile (voluntary, United States), ISO/IEC 42001:2023 (a certifiable management-system standard), the EU General-Purpose AI Code of Practice (a voluntary route to AI Act compliance for model providers), the OWASP Top 10 for LLM Applications (a risk list for application builders), and, as an example of a published behaviour specification, the OpenAI Model Spec. None of them names a test to write. Each says what must exist, who owns it, and what has to be shown.

## Why
These documents are the vocabulary of auditors, procurement and regulators, so test evidence has to map onto them or it does not count. NIST's profile was written to "help organizations identify unique risks posed by generative AI" and its actions carry ids that an auditor can point at [S160]. The EU code requires that documentation be "controlled for quality and integrity, retained as evidence of compliance" [S161]. The trade-off is paperwork. Framework language is broad, and the failure mode is a binder that describes tests that do not run.

## How
| Document | Who, when | Status | What it asks for | Test evidence that maps to it |
|---|---|---|---|---|
| AI RMF 1.0 | NIST, 26 January 2023 | voluntary | four functions: Govern, Map, Measure, Manage [S159] | a named owner per function; a risk register |
| AI RMF Generative AI Profile, NIST AI 600-1 | NIST, July 2024 | voluntary companion | twelve GAI risks; suggested actions with ids GV-, MP-, MS-, MG-x.y-nnn; four considerations: Governance, Content Provenance, Pre-deployment Testing, Incident Disclosure [S160] | red-team reports (MP-5.1-005); pre-deployment and ongoing evaluation policy (GV-1.2-002); T&E roles (GV-3.2-002); capability claims backed by "empirically validated methods" (MS-2.3-002) |
| ISO/IEC 42001:2023 | ISO/IEC, December 2023 | certifiable | an AI management system: policies, objectives and processes for responsible development, provision or use of AI; risk assessment, AI system impact assessment, lifecycle management, supplier oversight [S162] | documented risk and impact assessments; lifecycle records; an audit trail; the model's own tests are inputs, not the certificate |
| General-Purpose AI Code of Practice | EU AI Office, 10 July 2025 | voluntary, for GPAI providers | Transparency: Model Documentation Form kept ten years (Measure 1.1). Copyright: policy, robots.txt, complaint mechanism. Safety and Security, systemic-risk models only: a Framework, model evaluations including "red-teaming and other methods of adversarial testing" (Measure 3.2), external evaluator access (Measure 3.5), a Model Report (Commitment 7), serious incident reporting (Commitment 9) [S161] | evaluation results with samples of inputs and outputs; incident write-ups; a dated Framework with a changelog |
| OWASP Top 10 for LLM Applications, 2025 edition; a 2026 edition was published 2026-08-03 [S281] | OWASP GenAI Security Project, 2025 and 2026 | community risk list | LLM01 Prompt Injection to LLM10 Unbounded Consumption [S163] | an injection suite; output-handling tests; agency limits; rate and cost limits |
| Model Spec | OpenAI, version 2026-08-18 | a lab's published behaviour spec, CC0 | a chain of command (root, system, developer, user, guideline); a bounded scope of autonomy [S158] | a behaviour spec of your own that evals are written against |

Steps:
1. Decide which frames apply. Most teams are deployers, not GPAI providers: NIST, ISO and OWASP apply; the EU code's Safety and Security chapter applies to "approximately 5-15 providers" [S161].
2. Build a two-column map, clause to artefact. "MP-5.1-005" to "red-team report, dated"; "LLM01" to "injection suite, pass rate, date".
3. Date everything. A result without a date and a model version is not evidence.
4. Name owners. GOVERN 3.2 asks for roles for "Test and evaluation, validation, and red-teaming" [S160]; the EU code asks for responsibility allocation across organisational levels [S161].
5. Set a cadence. The EU code reassesses the Framework every twelve months or on reasonable grounds (Measure 1.3) [S161]; the labs describe testing "both pre- and post-deployment" [S164].

## Who does it (sourced)
- **NIST, 26 January 2023:** the AI RMF 1.0 is "intended for voluntary use and to improve the ability to incorporate trustworthiness considerations into the design, development, use, and evaluation of AI products, services, and systems"; the four core functions are Govern, Map, Measure and Manage; the page notes the framework is being revised [S159].
- **NIST, July 2024:** NIST AI 600-1 was developed under EO 14110 as a companion to the AI RMF; it lists twelve risks (CBRN Information or Capabilities, Confabulation, Dangerous, Violent, or Hateful Content, Data Privacy, Environmental Impacts, Harmful Bias and Homogenization, Human-AI Configuration, Information Integrity, Information Security, Intellectual Property, Obscene, Degrading, and/or Abusive Content, Value Chain and Component Integration) and suggested actions per AI RMF subcategory [S160].
- **ISO/IEC, December 2023:** ISO/IEC 42001 "specifies requirements for establishing, implementing, maintaining, and continually improving an Artificial Intelligence Management System (AIMS)". The standard's text is paid and the ISO page could not be fetched for this row; what is public is the abstract and vendor summaries [S162].
- **EU AI Office, 10 July 2025:** the final Code was drafted by independent chairs and vice-chairs; providers who sign commit to the Transparency and Copyright chapters, and systemic-risk providers to the Safety and Security chapter, including "adequate free access" for independent external evaluators to the most capable and least-mitigated model versions [S161].
- **OWASP, 2025 list (living, checked 2026-09-26):** the ten entries are LLM01 Prompt Injection, LLM02 Sensitive Information Disclosure, LLM03 Supply Chain, LLM04 Data and Model Poisoning, LLM05 Improper Output Handling, LLM06 Excessive Agency, LLM07 System Prompt Leakage, LLM08 Vector and Embedding Weaknesses, LLM09 Misinformation, LLM10 Unbounded Consumption [S163].
- **OpenAI, version 2026-08-18:** the Model Spec is published under CC0; "We are training our models to align to the principles in the Model Spec"; "Our production models do not yet fully reflect the Model Spec" [S158].
- **Anthropic, February 2026:** the Sonnet 4.6 system card reports evaluations "in the domains explicitly covered by the Responsible Scaling Policy" and commits to "regular safety testing of all our frontier models both pre- and post-deployment" [S164]. How the RSP maps to any external standard is not stated in the card.
- **Context, TC260, 2024-02:** the Basic Safety Requirements for Generative AI Services (CSET translation) set corpus safety, model safety, safety measures and safety assessment obligations and list more than 30 risks, with a supply chain security assessment clause [S233].
- **Context, UK DSIT, 2024-05:** the Seoul commitments list Zhipu.ai among initial signatories and Minimax and 01.ai among later additions; DeepSeek, Alibaba, Moonshot AI and ByteDance are absent [S234].
- **Microsoft, 2026-02:** the Frontier Governance Framework scopes itself to models covered by "the EU AI Act, California's Transparency in Frontier AI Act (TFAIA), and New York's Responsible AI Safety and Education (RAISE) Act", cites NIST SP 800-53 and NIST 800-218 for security, and logs its 2026 changes against the EU Code of Practice [S247].
- **Microsoft, living:** the 2026 transparency report aligns the programme to "the NIST AI Risk Management Framework (RMF) functions of Govern, Map, Measure, and Manage" and reports reviewing "100+ enacted and proposed laws" [S250].
- **Amazon, 2025-12:** the Nova 2 Lite service card states the model "is not intended to support any prohibited practices under the EU AI Act" and provides a complaints channel under the EU Code of Practice for General-Purpose AI Models [S257].
- **Amazon, 2026-09:** the framework update was made to "account for relevant laws and regulations" and will be revisited "at least annually" [S254].
- **Google, living:** SAIF maps 15 AI security risks to named controls, with the caveat that the site "is not a reflection of Google's current technical implementations" [S244].
- **OWASP GenAI Security Project, 2026-08 and 2026-09:** the LLM Top 10 2026 edition, the Agent Control Standard, and a crosswalk that maps 51 GenAI vulnerabilities to industry frameworks [S281][S282][S283].
- **Microsoft, 2026-09:** described how its responsible AI practices are adapting in 2026 [S291].

## Pitfalls
1. Reading "voluntary" as "optional". Procurement questionnaires quote the NIST functions whether or not anyone signed anything [S159].
2. Confusing provider obligations with deployer ones. The EU code binds providers of general-purpose models; a team that deploys one has different obligations and should not claim the code's Model Report as its own [S161].
3. Mistaking a management-system certificate for a tested model. ISO/IEC 42001 certifies processes and governance; it does not certify that a given model passed a given eval [S162].
4. Treating OWASP as ten tests. It is a list of risks; each one needs its own suite and each suite needs a pass rate and a date [S163].
5. Documentation that describes tests that do not run. The EU code asks for "at least five random sample of inputs and outputs from each relevant model evaluation" [S161]; a mapping that cannot produce samples is a mapping to nothing.

## Pattern from a production build
None yet.

## Sources
- [S158] OpenAI Model Spec, OpenAI, living (version 2026-08-18).
- [S159] AI Risk Management Framework (AI RMF 1.0), NIST, 26 January 2023.
- [S160] AI RMF: Generative AI Profile (NIST AI 600-1), NIST, July 2024.
- [S161] General-Purpose AI Code of Practice, EU AI Office, 10 July 2025.
- [S162] ISO/IEC 42001:2023 AI management systems, ISO/IEC, December 2023.
- [S163] OWASP Top 10 for LLM Applications 2025, OWASP GenAI Security Project, living.
- [S164] Claude Sonnet 4.6 System Card, Anthropic, 17 February 2026.
- [S233] Basic Safety Requirements for Generative Artificial Intelligence Services (TC260 technical document, English translation), CSET, Georgetown (translation of TC260-003-2024), 2024-02-29
- [S234] Frontier AI Safety Commitments, AI Seoul Summit 2024, UK Department for Science, Innovation and Technology, 2024-05-21
- [S247] Frontier Governance Framework, Microsoft, 2026-02
- [S250] 2026 Responsible AI Transparency Report, Microsoft, living
- [S257] Amazon Nova 2 Lite, AWS AI Service Card, AWS, living
- [S254] Amazon's Frontier Model Safety Framework (September 2026 update), Amazon, 2026-09-17
- [S244] Secure AI Framework (SAIF) risks, Google, living
- [S281] OWASP GenAI LLM Top 10 2026, OWASP GenAI Security Project, 2026-08-03
- [S282] Agent Control Standard (ACS), OWASP GenAI Security Project, 2026-09-01
- [S283] GenAI Security Industry Framework Crosswalk, OWASP GenAI Security Project, 2026-09-01
- [S291] Responsible AI in 2026: how we are adapting for what's ahead, Microsoft, 2026-09-01
