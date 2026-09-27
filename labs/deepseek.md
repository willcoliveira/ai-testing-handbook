---
id: deepseek
title: DeepSeek
sources: [S116, S153, S213, S214, S215, S216, S217, S218, S219, S232, S234, S235]
last_reviewed: 2026-09-27
---

# DeepSeek

## Published framework (what governs a release)
No frontier safety framework has been published. METR's tracker of published frontier safety
policies lists no Chinese developer, DeepSeek included, as of 2026-09-27 [S116]. DeepSeek is not a
signatory of the Seoul Frontier AI Safety Commitments [S234]. What exists instead:
- **December 2024:** a signature on the Chinese "Artificial Intelligence Safety Commitments", convened
  by CAICT with the AI Industry Alliance, alongside 16 other companies. Carnegie's summary: promises of
  red-teaming for severe threats, transparency about capabilities and limitations, and organisational
  security, with no explicit risk thresholds [S235]. We did not fetch the commitment text.
- **January 2025, peer-reviewed September 2025, revised January 2026:** an "Ethics and Safety
  Statement" and a "DeepSeek-R1 Safety Report" inside the R1 paper (Supplementary Information section
  4.3 in Nature, Appendix D.3 in the arXiv v2). The only DeepSeek document fetched that describes a
  safety evaluation [S153][S214].
- **April 2026:** a "Technical Documentation" model card for DeepSeek V4 covering provider, release
  date (2026-04-24), architecture, sizes, distribution, licence, acceptable use, intended use and
  training data. No evaluation, benchmark, safety or red-teaming section. API access "is governed by
  the DeepSeek Open Platform Terms of Service"; weights and code are MIT [S216].

The vocabulary of the R1 report: a "risk control system" of "Potential Risky Dialogue Filtering" and
"Model-based Risk Review", the latter using safety reward models over dimensions such as
discrimination, illegal behaviour and harmful content [S153]. Without that system, "the inherent
safety level of the DeepSeek-R1 model, compared with other state-of-the-art models, is generally at a
moderate level (comparable with GPT-4o (2024-05-13))"; with it, "the safety level of the model is
increased to a superior standard" [S214]. The trade-off to hold: the risk control system sits in
DeepSeek's products, and open weights ship without it.

## What they say they run before a release (sourced, dated)
- **DeepSeek-V3, December 2024:** capability benchmarks only. The base model by perplexity (HellaSwag,
  PIQA, WinoGrande, RACE, MMLU) and by generation (TriviaQA, DROP, MATH, GSM8K, HumanEval, MBPP,
  LiveCodeBench-Base): MMLU 87.1 (5-shot), MMLU-Pro 64.4, GSM8K 89.3 (8-shot), MATH 61.6 (4-shot),
  HumanEval 65.2, C-Eval 90.1. The chat model on Arena-Hard 85.5 and AlpacaEval 2.0 70.0, plus a
  section using "DeepSeek-V3 as a Generative Reward Model". No safety evaluation, red teaming or
  contamination check appears in the report [S213].
- **DeepSeek-R1, January 2025 (arXiv) and September 2025 (Nature):** pass@1 on AIME 2024 79.8,
  MATH-500 97.3, GPQA Diamond 71.5, MMLU 90.8, SWE-bench Verified 49.2; ArenaHard 92.3 with GPT-4-1106
  as judge; AlpacaEval 2.0 length-controlled 87.6 [S153]. Safety: "a comprehensive safety report from
  several perspectives, including performance on open-source and in-house safety evaluation
  benchmarks, and safety levels across several languages and against jailbreak attacks" [S214]. The
  arXiv v2 adds the risk control system, multilingual results and a section on resistance to
  jailbreaking [S153]. The ethics statement concedes that "R1 can be subject to jailbreak attacks,
  leading to the generation of dangerous content such as explosive manufacturing plans" [S214].
  Contamination: the arXiv v2 points to a pre-training decontamination procedure in an appendix and
  says web pages with OpenAI-model-generated answers were present without the team intentionally
  adding synthetic OpenAI data [S153].
- **DeepSeek-V3.2, December 2025:** capability and agent benchmarks, no safety section. "We set the
  temperature to 1.0, and the context window to 128K tokens"; maths with a fixed prompt template and a
  boxed answer; tool use "using the standard function call format, wherein models are configured to
  thinking mode"; olympiad runs with "No tools or internet access" under contest limits. Reported:
  MMLU-Pro 85.0, GPQA Diamond 82.4, AIME 2025 93.1, LiveCodeBench 83.3, SWE-bench Verified 73.1,
  Terminal Bench 2.0 46.4 ("achieved using the Claude Code framework"), BrowseComp 67.6 with context
  management and 51.4 without, tau2-Bench 80.3, MCP-Universe 45.9. RL rewards for general tasks come
  from "a generative reward model where each prompt has its own rubrics for evaluation"; training used
  over 1,800 synthetic agent environments and 85,000 prompts. Nothing on safety, red teaming, jailbreaks
  or contamination [S215].
- **DeepSeek V4, April 2026:** the card names the models, the release date, the sizes (Pro 1.6T total,
  49B active; Flash 285B total, 13B active), a 1M context and three reasoning modes, and describes
  training-data handling, including "conduct tests before using the data for training". No benchmark
  and no safety test [S216]. The API docs list deepseek-v4-pro as DeepSeek-V4-Pro-0813 and route the
  deepseek-flash alias to DeepSeek-V4.1-Flash, with no evaluation notes [S217].

Third-party testing after release, for context and not as evidence of DeepSeek's own process: CAISI
ran 19 benchmarks over R1, R1-0528 and V3.1 in September 2025 and reported that R1-0528 "responded to
94% of overtly malicious requests" under common jailbreaks against 8% for US reference models, and was
12 times more likely to follow malicious instructions in an agent-hijacking setting [S218]. In May
2026 CAISI placed V4 Pro about eight months behind the frontier on a nine-benchmark capability index
[S219]. Concordia AI's 2026 survey: "only five of ten leading foundation-model developers reported
safety evaluation results when releasing models this past year. No company did so consistently" [S232].

## Public evaluation tooling they ship
- Open weights and code: V3 code under MIT with weights under a model licence; V4 weights and code
  under MIT; distributed through GitHub and Hugging Face [S213][S216].
- The evaluation settings stated in the V3.2 report (temperature, context, the boxed-answer prompt,
  the function-call format, tool outputs in the tool role), which a reader can reproduce [S215].
- The R1 recipe's rule-based verifiers, accuracy and format rewards used in place of learned reward
  models because those are "susceptible to reward hacking" [S153]. Described, not shipped as code.
- No guard model, red-teaming tool or evaluation harness was found. The V3 repository ships an
  inference demo only [S213].

## What is not public (stated as unknown)
- Any pre-deployment safety process for V3, V3.2 or V4. None is described; absence from a report is
  not evidence either way [S213][S215][S216].
- The R1 in-house safety benchmark: its size, taxonomy and per-language scores sit in the Supplementary
  Information, which we did not fetch [S214].
- The production risk control system: which filters, which reward models, what thresholds, and whether
  it covers the API as well as the consumer app [S153]. It cannot apply to weights others host.
- Red-team rosters, hours or external testers. None are named [S153][S214].
- Frontier-risk evaluations (CBRN, cyber, autonomy). None are described by DeepSeek; the only such
  measurements are third-party [S218][S219].
- Contamination checks for V3.2 and V4, and whether V4 or the API's V4.1-Flash has a technical report;
  none was found [S215][S216][S217].

## Reading order for a newcomer
1. The R1 Nature paper's ethics statement, then Supplementary Information section 4.3 [S214][S153].
2. The V3.2 report's evaluation section, for the settings a lab states and those it leaves out [S215].
3. The V4 model card, to see what a transparency document covers with no evaluation section [S216].
4. CAISI's two evaluations, for what an outside tester measured and how [S218][S219].
5. Carnegie on the Chinese commitments, and the METR tracker for the absence of a framework
   [S235][S116].

## Sources
- [S116] Frontier AI Safety Policies tracker, METR, living.
- [S153] DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning, DeepSeek-AI, 2025-01-22 (v2 2026-01-04).
- [S213] DeepSeek-V3 Technical Report, DeepSeek-AI, 2024-12-27.
- [S214] DeepSeek-R1 incentivizes reasoning in LLMs through reinforcement learning, Nature, 2025-09-17.
- [S215] DeepSeek-V3.2: Pushing the Frontier of Open Large Language Models, DeepSeek-AI, 2025-12-02.
- [S216] DeepSeek V4 Technical Documentation (model card), DeepSeek AI, 2026-04-27.
- [S217] DeepSeek API docs: Models and Pricing, DeepSeek, living.
- [S218] CAISI Evaluation of DeepSeek AI Models Finds Shortcomings and Risks, NIST, 2025-09-30.
- [S219] CAISI Evaluation of DeepSeek V4 Pro, NIST, 2026-05-01.
- [S232] State of AI Safety in China (2026), Concordia AI, 2026-07.
- [S234] Frontier AI Safety Commitments, AI Seoul Summit 2024, UK DSIT, 2024-05-21.
- [S235] DeepSeek and Other Chinese Firms Converge with Western Companies on AI Promises, Carnegie, 2025-01-28.
