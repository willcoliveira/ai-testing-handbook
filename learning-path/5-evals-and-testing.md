# Phase 5: Evals and testing

Outcome: you can build an evaluation suite that gates a release, and you know where every practice
in this reference sits.

## What you learn to build
A golden set sampled from real traces, criteria written as behaviours, an LLM judge calibrated
against human labels, a per-build guardrail suite with must-not-block cases, N-run pass-rate
gating, a regression check for model upgrades, and the governance around who merges what.

## What a tester takes from it
The whole reference, in this reading order.

## Doing order

Work through [how-to/](../how-to/README.md) 01 to 12 against your own agent. Each playbook ends
with a "Done when" you can check. The reading order below is the theory behind each step. If
your system answers from documents, add [17 Test a RAG application](../how-to/17-test-a-rag-application.md)
and stages 4 to 8 of the [RAG build project](rag-build-project.md).

## Reading order

| Step | Read | Then you can |
|---|---|---|
| 1 | [eval-driven-development](../practices/2-application-evals/eval-driven-development.md) | describe the loop and start a first eval set |
| 2 | [golden-datasets](../practices/2-application-evals/golden-datasets.md), [datasets/README](../datasets/README.md) | sample, label, document and version a set |
| 3 | [criteria-authoring](../practices/2-application-evals/criteria-authoring.md) | write criteria a grader can apply |
| 4 | [llm-as-judge](../practices/3-judging/llm-as-judge.md), [judge-calibration](../practices/3-judging/judge-calibration.md), [rubrics-and-pairwise](../practices/3-judging/rubrics-and-pairwise.md) | choose a judge and prove it agrees with humans |
| 5 | [non-determinism-and-pass-rates](../practices/2-application-evals/non-determinism-and-pass-rates.md) | gate on distributions |
| 6 | [guardrails](../practices/5-safety-and-security/guardrails.md), [false-positive-protection](../practices/5-safety-and-security/false-positive-protection.md), [prompt-injection](../practices/5-safety-and-security/prompt-injection.md), [red-teaming](../practices/5-safety-and-security/red-teaming.md) | build the binary safety suite |
| 7 | [agent-evals](../practices/4-agents-and-systems/agent-evals.md), [tool-use-evals](../practices/4-agents-and-systems/tool-use-evals.md), [harnesses](../practices/4-agents-and-systems/harnesses.md), [tools/README](../tools/README.md), [rag-evals](../practices/2-application-evals/rag-evals.md) | pick a harness, assert on trajectories and state, and score retrieval and generation separately |
| 8 | [ci-gates-for-llm-apps](../practices/2-application-evals/ci-gates-for-llm-apps.md), [load-and-latency](../practices/4-agents-and-systems/load-and-latency.md) | decide what runs where |
| 9 | [genai-tracing](../practices/6-observability/genai-tracing.md), [online-evals-and-drift](../practices/6-observability/online-evals-and-drift.md), [redaction-in-telemetry](../practices/6-observability/redaction-in-telemetry.md) | close the loop from production |
| 10 | [regression-on-upgrade](../practices/7-training-and-lifecycle/regression-on-upgrade.md), [fine-tuning-evals](../practices/7-training-and-lifecycle/fine-tuning-evals.md), [post-training-evals](../practices/7-training-and-lifecycle/post-training-evals.md), [data-contamination](../practices/7-training-and-lifecycle/data-contamination.md), [training/README](../training/README.md) | handle a model change and a fine-tune |
| 11 | [capability-benchmarks](../practices/1-capability/capability-benchmarks.md), [statistical-treatment-of-evals](../practices/1-capability/statistical-treatment-of-evals.md), [benchmark-hygiene](../practices/1-capability/benchmark-hygiene.md), [benchmarks/README](../benchmarks/README.md) | read a leaderboard without being fooled |
| 12 | [frontier-safety-frameworks](../practices/5-safety-and-security/frontier-safety-frameworks.md), [labs/](../labs/) | say what the labs publish about testing their own models, and what is not public |
| 13 | [human-in-the-loop](../practices/8-governance/human-in-the-loop.md), [ai-generated-tests](../practices/8-governance/ai-generated-tests.md), [autonomous-qa-agents](../practices/8-governance/autonomous-qa-agents.md), [model-and-system-cards](../practices/8-governance/model-and-system-cards.md), [standards-and-regulation](../practices/8-governance/standards-and-regulation.md) | write the governance down |
| 14 | [exploratory-testing-of-agents](../practices/4-agents-and-systems/exploratory-testing-of-agents.md), [mutation-checking](../practices/4-agents-and-systems/mutation-checking.md), [offline-probes](../practices/2-application-evals/offline-probes.md) | find what the suite does not |

## Worked example
A release candidate changes the system prompt. The pipeline runs the criteria-based smoke suite
ten times, compares the pass-rate distribution with the previous version, runs the 24-case
guardrail suite as a binary check, replays the golden set through the judge, and checks that judge
agreement with the human labels has not moved. A human reads the digest and merges.

## Exercises
1. Build a 50-case golden set from your phase 3 agent's traces. Write a datasheet for it.
2. Write criteria for 10 of them as behaviours. Calibrate a judge on 30 human labels. Report kappa.
3. Wire the N-run gate and the guardrail suite into CI. Change the prompt on purpose and watch it.

## Resources
The reference itself. [resources.md](resources.md) lists every source with its phase.
