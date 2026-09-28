---
id: red-teaming
title: Red teaming
area: 5-safety-and-security
status: draft
last_reviewed: 2026-09-28
sources: [S098, S099, S101, S104, S106, S110, S111, S113, S114, S127, S128, S130, S131, S132, S214, S218, S224, S228, S240, S248, S249, S251, S255, S256, S265, S266, S267, S271, S278, S284, S288]
related: [prompt-injection, guardrails, frontier-safety-frameworks, exploratory-testing-of-agents]
---

# Red teaming

## What
Red teaming is adversarial testing: a person or an automated attacker tries to make the system do what
it must not, before a real adversary does. It differs from a safety eval in that the attacker adapts.
Human red teams bring domain knowledge and pretext; automated attackers bring volume and repetition.
Labs run both and report hours, attempts and attack success rate. Application teams run the same shape
at smaller scale and turn every finding into a regression case.

## Why
A static test set measures known attacks. An adaptive attacker finds the ones you did not write down.
Anthropic's Opus 5.5 card states the risk directly: "fixed datasets of known attacks can provide a
false sense of security, as a model may perform well against established attack patterns while
remaining vulnerable to novel approaches" [S098]. The trade-off is cost and noise. Human campaigns are
expensive (OpenAI reports "more than 5,000 hours of work from over 400 external testers" for one
release [S104]) and automated attackers generate findings that need triage before they mean anything.

## How
1. Pick the layer. Model-only, model plus safeguards, or the full product. OpenAI sorted its GPT-5
   campaigns into "Pre-Deployment Research", "API Safeguards Testing" and "In-Product Safeguards
   Testing" [S104]. Say which one a finding applies to.
2. Write one hypothesis per campaign. OpenAI says "each individual red teaming campaign aimed to
   contribute to a specific hypothesis" and "provide strong quantitative comparisons to previous
   models" [S104]. A campaign without a hypothesis produces anecdotes.
3. Use a comparison design when you can. Pairwise, blind, against the previous model or the previous
   prompt. OpenAI's violent-attack campaign had red teamers rate anonymised responses from two models in
   parallel and reported a win rate with a confidence interval [S104].
4. Set a budget in the unit the attacker uses: hours for humans, calls or attempts for tools. Anthropic
   gives its internal attacker "a 400-call limit against the assistant" with the ability to rewind [S098].
   Report attack success rate at k attempts, not a single number.
5. Choose tools by what they attack. garak runs static, dynamic and adaptive probes against a model
   endpoint [S130]. PyRIT is a framework for orchestrating attacks, converters and scorers [S131].
   promptfoo generates adversarial inputs per plugin, runs them through your application and grades
   with deterministic and model-graded metrics, in CI [S132]. Petri runs an auditor model through
   multi-turn scenarios and scores transcripts on safety dimensions [S101]. See `tools/red-teaming.md`.
6. Triage, then regress. Distinguish reported from notable: OpenAI's prompt-injection assessment went
   "from an initial 47 reported findings" to "10 notable issues" [S104]. Every notable finding becomes
   a fixed case in the suite with its expected outcome.
7. Write down the elicitation. NIST AI 600-1 suggests teams "document the instructions given to data
   annotators or AI red-teamers" [S127]. Without the instructions, a finding cannot be reproduced.

## Who does it (sourced)
- **OpenAI, August 2025:** the GPT-5 card reports 25 red teamers "with backgrounds in defense,
  intelligence, and law enforcement/security professions" for attack planning; two external groups on a
  two-week prompt-injection assessment; and the Microsoft AI Red Team using PyRIT to scale "stress tests
  to almost million adversarial conversations across the following 18 harm areas" [S104].
- **Anthropic, September 2026:** the Opus 5.5 card says contracted testers red-teamed the safeguards:
  one "spent roughly 95 hours", "sending over 29,000 requests", reporting "13 candidate breaks across
  seven tasks" and "no universal jailbreak"; another ran an automated attacker for "roughly 3,300
  attempts" across 61 scenarios with "no breaks" [S098].
- **Anthropic, February 2026:** the Sonnet 4.6 card says the preliminary assessment used "automated
  assessments only" and "did not conduct human uplift trials, expert red-teaming sessions, or other
  resource-intensive evaluations that require human participants" [S099].
- **Anthropic, October 2025:** Petri "deploys an automated agent to test a target AI system through
  diverse multi-turn conversations", run across "14 frontier models using 111 diverse seed
  instructions" [S101].
- **Google DeepMind, November 2025 and February 2026:** the Gemini 3 Pro report says external groups
  undertake "structured evaluations, qualitative probing and unstructured red teaming", independent of
  Google [S110]; the Gemini 3.1 Pro card says "we conduct manual red teaming by specialist teams who sit
  outside of the model development team" [S111].
- **Meta, April 2025 and April 2026:** the Llama 4 card says "we conduct recurring red teaming exercises
  with the goal of discovering risks via adversarial prompting" [S114]; the framework says red teaming
  runs "once a model achieves certain levels of performance" in cyber and chemical-biological domains [S113].
- **OpenAI and Apollo Research, September 2025:** the anti-scheming paper uses "covert actions" as a
  proxy and evaluates on 26 out-of-distribution evaluations across more than 180 environments [S106].
- **Moonshot AI, 2025-07:** "We conducted red-teaming evaluations on Kimi K2 compare with other open-source LLMs": five categories (Harmful, Criminal, Misinformation, Privacy, Security) by four strategies (Basic, Prompt Injection, Iterative Jailbreak, Crescendo), "3 attack prompts per plugin for each strategy", passing rates from 100 (Criminal, Basic) to 43.90 (Security, Iterative Jailbreak), with "multiple rounds of review" by humans [S224].
- **DeepSeek, 2025-09:** the R1 safety report covers "safety levels across several languages and against jailbreak attacks" and concedes that "R1 can be subject to jailbreak attacks, leading to the generation of dangerous content such as explosive manufacturing plans" [S214].
- **Context, NIST CAISI, 2025-09:** an outside tester found DeepSeek R1-0528 "responded to 94% of overtly malicious requests" under common jailbreaks against 8% for US reference models [S218].
- **Context, UK AISI and US CAISI, 2026-07:** Kimi K3's "safeguards did not prevent it from attempting cyber exploit development or offensive cyber operations", while the US comparison models ran with safeguards disabled [S228].
- **Google, 2026-09:** the Gemini 3.8 Flash card reports "manual red teaming by specialist teams who sit outside of the model development team" with "no egregious concerns" against the Gemini 3.1 Pro baseline [S240].
- **Microsoft, 2024-12:** the Phi-4 card says "the independent AI Red Team (AIRT) at Microsoft" tested "in both average and adversarial user scenarios", the latter with "jailbreaks, encoding-based attacks, multi-turn attacks, and adversarial suffix attacks" [S248].
- **Microsoft, 2026-03:** for Phi-4-reasoning-vision-15B, "Automated red teaming was performed on Azure to assess safety risks including groundedness, jailbreak susceptibility, harmful content generation, and copyright violations for protected material" [S249].
- **Microsoft, 2026-08:** the AI Red Teaming Agent applies 24 PyRIT attack strategies to seed prompts per risk category and scores Attack Success Rate, "the percentage of successful attacks over the number of total attacks" [S251].
- **Amazon, 2025-12:** the Nova 2 report keeps a "three-pillar structure" of "internal Amazon red teaming, automated red teaming, and external third-party red teaming" and names ActiveFence, Innodata, Chatterbox Labs, PrismAI, EnkryptAI, Gray Swan and Aymara [S255].
- **Amazon, 2026-01:** for Nova 2 Lite, Nemesys Insights ran an uplift study with "nearly 800 participants in a rigorous red-teaming exercise" and "concluded that the model remains below the overall CBRN threshold" [S256].
- **xAI, April 2026:** gave third-party evaluators an early checkpoint for "coverage testing and red-teaming of the refusal boundary" and, separately, "an audit of their deceptive and scheming behaviors"; internal jailbreak templates and AgentDojo cover the automated side [S265]. **September 2026:** "a broad, continuously updated set of jailbreak attacks" including StrongREJECT and Crescendo, with compliance 0.01% to 2.0% [S266].
- **Cohere, February 2025:** "multidisciplinary red teaming during both the model development phase and post-launch", which "may include independent external parties, such as NIST and Humane Intelligence"; findings become standing evaluations run on later versions [S271].
- **NVIDIA, August 2025:** "uses Garak as a highest-priority assessment of models before release" and has red teams probe "each guardrail component independently with targeted examples" [S267][S130].
- **AI2, December 2025:** no human or external red teaming is described for OLMo 3; safety is a benchmark average [S278].
- **OWASP GenAI Security Project, 2026-06:** published a taxonomy for classifying red, blue and purple teaming capabilities in AI security [S284].
- **Anthropic Frontier Red Team, 2026-09:** measured tactical intelligence targeting and conventional weapons capabilities of models [S288].

## Pitfalls
1. Static sets as proof. Anthropic calls this "a common pitfall" and invests in adaptive evaluations
   instead [S098].
2. Benchmark asymmetry. Models entered in public attack competitions score worse on benchmarks built
   from those competitions, so Anthropic reports only models not subject to them [S098]. Compare like
   with like.
3. Counting findings instead of grading them. 47 reported, 10 notable [S104]. Report both.
4. Red-teaming the model but not the connectors. OpenAI's system-level assessment targeted "ChatGPT's
   connectors and mitigations, rather than model-only behavior" [S104]. An application has the same gap.
5. Findings that never become tests. promptfoo scans "integrate into CI/CD pipelines" [S132]; a
   finding that lives only in a report is a finding you will re-discover.
6. Evaluation awareness. Apollo found GPT-5 "often reasons about what a 'typical eval' looks like"
   [S104], and the anti-scheming paper says reductions may be "partially driven by situational
   awareness" [S106]. Treat clean red-team results on obviously synthetic scenarios with care.

## Pattern from a production build
None yet.

## Sources
- [S098] Claude Opus 5.5 System Card, Anthropic, 2026-09-22.
- [S099] Claude Sonnet 4.6 System Card, Anthropic, 2026-02-17.
- [S101] Petri: an open-source auditing tool, Anthropic, 2025-10-06.
- [S104] GPT-5 System Card, OpenAI, 2025-08-13.
- [S106] Stress Testing Deliberative Alignment for Anti-Scheming Training, OpenAI and Apollo Research, 2025-09-19.
- [S110] Gemini 3 Pro Frontier Safety Framework Report, Google DeepMind, 2025-11.
- [S111] Gemini 3.1 Pro Model Card, Google DeepMind, 2026-02.
- [S113] Advanced AI Scaling Framework Version 2, Meta, 2026-04-07.
- [S114] Llama 4 Model Card, Meta, 2025-04-05.
- [S127] NIST AI 600-1 Generative AI Profile, NIST, 2024-07-26.
- [S128] EU General-Purpose AI Code of Practice, European Commission, 2025-07-10.
- [S130] garak, NVIDIA, living.
- [S131] PyRIT, Microsoft, living.
- [S132] promptfoo red teaming docs, promptfoo, living.
- [S224] Kimi K2: Open Agentic Intelligence, Moonshot AI (arXiv 2507.20534), 2025-07-28
- [S214] DeepSeek-R1 incentivizes reasoning in LLMs through reinforcement learning, DeepSeek-AI, Nature 645, 633-638, 2025-09-17
- [S218] CAISI Evaluation of DeepSeek AI Models Finds Shortcomings and Risks, NIST Center for AI Standards and Innovation, 2025-09-30
- [S228] UK AISI / CAISI Preliminary Assessment of Kimi K3's Cyber Capabilities, UK AI Security Institute and US CAISI, 2026-07-23
- [S240] Gemini 3.8 Flash Model Card, Google DeepMind, 2026-09-02
- [S248] Phi-4 model card, Microsoft (Hugging Face), 2024-12-12
- [S249] Phi-4-reasoning-vision-15B model card, Microsoft (Hugging Face), 2026-03-04
- [S251] AI Red Teaming Agent (Microsoft Foundry docs), Microsoft, living
- [S255] Amazon Nova 2: Multimodal Reasoning and Generation Models, technical report and model card, Amazon AGI, 2025-12
- [S256] Evaluating Nova 2.0 Lite model under Amazon's Frontier Model Safety Framework, Krishna et al., Amazon, arXiv 2601.19134, 2026-01-27
- [S265] Grok 4.20 System Card, xAI, 2026-04-07
- [S266] Grok 4.7 Model Card (revision 2026-09-21), xAI (SpaceXAI), 2026-09-21
- [S271] The Cohere Secure AI Frontier Model Framework V1.0, Cohere, 2025-02
- [S267] Frontier AI Risk Assessment, NVIDIA (Simkin, Pope, Derczynski, Parisien), 2025-08
- [S278] Olmo 3 (technical report), Ai2 (Olmo Team), arXiv 2512.13961, 2025-12
- [S284] Solutions Landscape: Red Teaming Taxonomy, OWASP GenAI Security Project, 2026-06-28
- [S288] Measuring tactical intelligence targeting and conventional weapons capabilities of AI models, Anthropic Frontier Red Team, 2026-09-10
