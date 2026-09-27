---
id: cohere
title: Cohere
sources: [S006, S116, S271, S272, S273]
last_reviewed: 2026-09-27
---

# Cohere

## Published framework (what governs a release)
The Cohere Secure AI Frontier Model Framework, V1.0, February 2025 [S271]; METR's tracker dates it
February 7, 2025 [S116]. It has five components: risk identification, risk mitigation, risk assurance
mechanisms, transparency, and research and external stakeholder engagement [S271].

It rejects the capability-threshold model used by the other labs in this repository. Frameworks built on
catastrophic thresholds rest on studies that "are limited in their methodological maturity and
transparency"; Cohere's assurance "is focused on risks that are known, measurable, or observable today"
[S271].

The release gate is a regression rule: "We consider models safe and secure to launch when our evaluations
and tests demonstrate no significant regressions compared to our previously launched model versions", and
"This is Cohere's bright line for determining when a model is 'acceptable' from a risk management
perspective and ready to be launched" [S271]. "The final authority to determine if our products are safe,
secure, and ready to be made available to our customers is delegated by Cohere's CEO to Cohere's Chief
Scientist" [S271]. Before significant releases, "an independent third-party penetration test to validate the
security of containers and models" [S271]. Red teaming "may include independent external parties, such as
NIST and Humane Intelligence" [S271].

## What they say they run before a release (sourced, dated)
- **Framework, February 2025:** "When a model is nearing launch, the modeling function at Cohere conducts a
  comprehensive final evaluation, assessing both performance and safety metrics", including "industry-standard
  benchmarks like BOLD", with results published. A red-team exercise on sensitivity to the wording of safety
  instructions produced data that "was used to develop" a standing evaluation, "then run on subsequent model
  versions" [S271].
- **Command A, April 2025, benchmark set:** academic (MMLU, MMLU-Pro, GPQA, IFEval, InFoBench, following
  the simple-evals implementation where applicable), agents (TauBench, BFCL), multilingual (MMMLU, FLoReS,
  MGSM, mArenaHard by LLM-as-judge, mTauBench and others), code (LBPP, HumanEvalPack, MBPP+, Spider, BIRD
  SQL, LiveCodeBench, BigCodeBench, SWE-Bench diff generation, Aider Polyglot), math, safety (XSTest and
  internal sets), long context (RULER). "Wherever possible, we show externally reported results with
  comparable evaluation settings" [S272].
- **Command A, April 2025, safety method:** "Our safety evaluation methodology combines human and automated
  assessments. Due to speed and cost considerations, we mainly rely on automated evaluations." Human labels
  are "triply annotated by an internal team of specialist safety annotators". Relative safety uses "a jury
  of LLM evaluators", which "achieves human agreement scores of 77.7% and Cohen's Kappa of 0.55".
  Over-refusal is graded by an LLM judge because refusal classification is "a much easier task than
  safety" [S272].
- **Command A, April 2025, controllability:** for each safety mode (contextual, strict) two sets, one that
  "should always be answered" and one that "should always be refused"; the over-refusal set "was created by
  red-teaming Command R+ Refresh". XSTest refusal is "under 3%"; "As XSTest is saturated, we also report
  default over-refusal based on our internal test set" [S272].
- **Command A, April 2025, fairness and languages:** a resume-summary bias test run "five times per sample"
  with the distribution of bias rates plotted; safety scored across nine languages on translated prompts
  corrected by annotators, with over-refusal prompts "collected through red teaming with the multilingual
  annotators" [S272].
- **Command A, April 2025, human evaluation:** about 800 single-turn prompts (350 general, 150 reasoning,
  300 code), "curated from scratch by our pool of annotators to avoid accidental contamination for
  competitor models"; pairwise preference with 1 to 5 quality scores and shuffled order; "on average 65
  annotators contribute to a single evaluation run" [S272].
- **Command A, April 2025, on cost:** "while model merging is cheap and fast, evaluating each merge requires
  significant inference time and compute. Evaluation is therefore a significant bottleneck" [S272].
- **Command R and R+, October 2024:** evaluated on BOLD, "nearly 24,000 prompts", with the finding that
  generations are "very rarely toxic" and the caveat that "It is still possible to encounter toxicity,
  especially over long conversations with multiple turns" [S273].
- **Cohere Labs, April 2025:** researchers from Cohere Labs co-authored The Leaderboard Illusion, which
  documents private testing and data asymmetries on Chatbot Arena [S006].

## Public evaluation tooling they ship
- Safety Modes as an API control, "contextual" and "strict", on top of core protections that stay on
  [S272][S271].
- Command A weights for research under "a CC-BY-NC License (Non-Commercial) with an acceptable use
  addendum" [S272].
- The LBPP code benchmark (Less Basic Python Problems) extended to C++, Java, JavaScript, Go and Rust, with
  a dataset update promised [S272].
- No open evaluation harness or red-team tool in the pages fetched.

## What is not public (stated as unknown)
- What "significant regression" means numerically. The bright line has no stated tolerance [S271].
- The internal safety sets, the jury composition, and the safety-mode evaluation sets [S272].
- Red-team reports from NIST or Humane Intelligence. The framework says they "may" take part; no report is
  cited [S271].
- Whether Command A itself received the third-party penetration test. The framework states the rule; the
  report does not mention it [S271][S272].
- Evaluation of Command A Reasoning and Command A Vision. We found no evaluation content on docs.cohere.com
  beyond the responsible-use page [S273].
- The Safety Modes documentation page (fetched, not registered) has no evaluation data.

## Reading order for a newcomer
1. The framework, "Risk Assurance Mechanisms", for the bright line and the delegation of authority [S271].
2. The Command A report, Section 4.6 (safety) and Section 4.11 (human evaluation) [S272].
3. The responsible-use page, for what a published bias result looks like [S273].
4. The Leaderboard Illusion, for why Cohere Labs distrusts one leaderboard [S006].
5. METR's tracker entry, for context against the other frameworks [S116].

## Sources
- [S006] The Leaderboard Illusion, Singh et al. (Cohere Labs and others), 2025-04-29.
- [S116] Frontier AI Safety Policies tracker, METR, living.
- [S271] The Cohere Secure AI Frontier Model Framework V1.0, Cohere, 2025-02.
- [S272] Command A: An Enterprise-Ready Large Language Model, Cohere, 2025-04.
- [S273] Command R and Command R+ model card (responsible use), Cohere docs, living (updated 2024-10-31).
