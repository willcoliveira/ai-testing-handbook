---
id: tools-red-teaming
title: Red-teaming tools
sources: [S101, S104, S117, S125, S130, S131, S132]
last_reviewed: 2026-09-26
---

# Red-teaming tools

Per-tool notes: what each attacks, what it does not, and where the claim comes from. See the practice
file [red-teaming](../practices/5-safety-and-security/red-teaming.md).

## promptfoo red team
- **What it is:** a scanner that will "generate a wide range of adversarial inputs and evaluate the
  LLM's responses" in three steps: generate inputs per plugin, run them through your application,
  "evaluate the LLM's outputs automatically using deterministic and model-graded metrics" [S132].
- **Plugins named in the docs:** jailbreaking, prompt injection, PII and privacy, harmful content, and
  agent-specific issues such as unauthorized API access and privilege escalation; findings map to the
  OWASP LLM Top 10 [S132].
- **For:** application-level scans that run in CI and re-run as regression; a team that already uses
  promptfoo for evals.
- **Not for:** adaptive human-style attacks; the generated inputs are per-plugin sets, so add your own
  cases from real findings.

## garak (NVIDIA)
- **What it is:** the "Generative AI Red-teaming & Assessment Kit"; "garak checks if an LLM can be made
  to fail in a way we don't want", combining "static, dynamic, and adaptive probes" [S130].
- **Probes:** prompt injection, jailbreaks, hallucination (including package hallucination), data
  leakage, toxicity, malware generation and cross-site scripting, with detectors per probe; Apache 2.0
  [S130].
- **For:** a fast baseline scan of a model endpoint, the way a port scanner gives a baseline of a host.
- **Not for:** testing your application's boundaries or tool calls; garak targets the model or dialog
  system it is pointed at, not your product logic.

## PyRIT (Microsoft)
- **What it is:** "an open source framework" built so that "security professionals and engineers"
  can "proactively identify risks in generative AI systems"; MIT licence [S131]. The Azure/PyRIT
  repository was archived on March 27, 2026 and points to microsoft/PyRIT; the documentation site
  reports version 1.1.0 [S131].
- **In use:** the Microsoft AI Red Team used PyRIT on GPT-5 "scaling stress tests to almost million
  adversarial conversations across the following 18 harm areas", combined with manual red teaming by
  "more than 70 internal security and safety experts" [S104].
- **For:** orchestrating large automated campaigns with your own attack strategies, converters and
  scorers.
- **Not for:** a one-command scan; it is a framework, and the GitHub landing page fetched does not
  enumerate its components, so budget time to read the docs.

## CyberSecEval (Meta)
- **What it is:** a benchmark suite, now version 4, for "cybersecurity vulnerabilities and defensive
  capabilities" of LLMs: MITRE compliance and false refusal rate, secure code generation (instruct and
  autocomplete), textual and visual prompt injection, code interpreter abuse, vulnerability exploitation
  (capture the flag), spear phishing, autonomous offensive cyber operations, AutoPatch, and CyberSOCEval
  [S125].
- **For:** a cyber-specific pass on a model you host, and a ready-made false refusal rate measurement.
- **Not for:** content-safety categories outside cyber; pair with a hazard benchmark.

## Petri (Anthropic)
- **What it is:** an open-source auditing tool where "an automated agent" tests "a target AI system
  through diverse multi-turn conversations involving simulated users and tools", from natural-language
  seed instructions, with judges scoring "multiple safety-relevant dimensions" [S101].
- **For:** behavioural probing (deception, sycophancy, harmful cooperation, self-preservation) across
  models; scenario-driven rather than payload-driven.
- **Not for:** security payload testing; it measures propensity, not injection resistance.

## Inspect (UK AISI)
- **What it is:** an evaluation framework with more than 200 pre-built evaluations, including cyber
  suites such as GDM CTF and Cybench, runnable "against any model with a single command" [S117].
- **For:** running standard capability and safeguard evaluations reproducibly; a harness into which
  your own red-team cases can be written.
- **Not for:** generating attacks by itself; it runs what you give it.

## Sources
- [S101] Petri: an open-source auditing tool, Anthropic, 2025-10-06.
- [S104] GPT-5 System Card, OpenAI, 2025-08-13.
- [S117] Announcing Inspect Evals, UK AI Security Institute, 2024-11-13.
- [S125] CyberSecEval, Meta, living.
- [S130] garak, NVIDIA, living.
- [S131] PyRIT, Microsoft, living.
- [S132] promptfoo red teaming docs, promptfoo, living.
