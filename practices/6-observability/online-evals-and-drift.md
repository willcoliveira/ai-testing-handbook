---
id: online-evals-and-drift
title: Online evals and drift
area: 6-observability
status: draft
last_reviewed: 2026-09-27
sources: [S136, S138, S140, S149, S237, S247, S251, S254, S257]
related: [genai-tracing, non-determinism-and-pass-rates, judge-calibration, regression-on-upgrade, llm-as-judge]
---

# Online evals and drift

## What
Online evaluation scores a sample of live production traces, after the fact, with a model judge, a rule, or end-user feedback, and stores the score next to the trace. Drift detection watches those scores, and the operational signals under them (token counts, finish reasons, refusals, latency), for a shift between model versions, prompt releases, or weeks. Offline evaluation, on a fixed dataset before a change ships, is the other half; see [eval-driven-development](../2-application-evals/eval-driven-development.md).

## Why
Offline suites cover the distribution you wrote down. Production covers the one you did not: new intents, new languages, longer sessions, a provider that changed the model under the same name. Chen, Zaharia and Zou compared GPT-4's March and June 2023 snapshots and found prime-number identification went from 84% to 51% on 1,000 questions and directly executable code from 52% to 10% on 50 LeetCode problems; they conclude that "the behavior of the 'same' LLM service can change substantially in a relatively short amount of time, highlighting the need for continuous monitoring of LLMs" [S149]. Online scoring is how a team notices that in days rather than at the next review. The trade-off: every online judge call costs tokens and adds a second model whose own drift can look like yours, and a judge without ground truth can only score properties visible in the trace.

## How
1. **Pick the unit.** Score observations (individual LLM or tool spans), not whole traces, for live data. Langfuse states "Observation-level evaluators are the recommended target for live production data" and marks trace-level evaluators deprecated in v4, with cloud support ending 2026-11-16 [S140]. Datadog lets a custom judge target a span, a trace or a session, filtered with its query syntax; `@parent_id:undefined` selects root spans only [S138].
2. **Filter, then sample.** Stack observation filters (type, name, metadata) with trace filters (user id, session id, tags, version), then set a sampling rate on the evaluator. Both tools expose the rate as a cost control and neither states a default, so write yours down [S140] [S138]. Choose enough volume that a five-point move in a pass rate is visible within a day; see [statistical-treatment-of-evals](../1-capability/statistical-treatment-of-evals.md).
3. **Choose score types that can be alerted on.** Langfuse scores are numeric, categorical or boolean, with free text for notes; Datadog outputs boolean, score with a min and max, categorical, or JSON with a post-processing function [S140] [S138]. A boolean per criterion aggregates to a pass rate; a single 1 to 5 scale hides which criterion moved.
4. **Score what the trace can show.** Without ground truth a judge can still check language match, refusal, format compliance, tool selection against the user request, presence of sensitive data, and a rubric. Datadog's managed evaluations page listed Language Mismatch and Sensitive Data Scanning when checked; the rest is custom judge prompts [S138]. Langfuse offers templates or a blank judge prompt, with variables mapped from the observation's input, output, metadata or tool calls [S140].
5. **Collect user feedback as its own score.** Thumbs, accepted edits and free-text comments are a separate signal with a different bias; keep them in the same score table but never average them with judge scores [S140] [S138].
6. **Emit scores as telemetry.** The OTel `gen_ai.evaluation.result` event (Development status) is the vendor-neutral shape for a score attached to a span [S136].
7. **Baseline per version, alert on shift.** Record the score distribution for each model id and prompt version, not one mean. Langfuse alerts "when a metric crosses a threshold"; Datadog exposes results as `@evaluation.<name>.value` so monitors can "alert on performance changes or regression" [S140] [S138]. Pair the online distribution with the offline pass-rate distribution for the same version; see [regression-on-upgrade](../7-training-and-lifecycle/regression-on-upgrade.md).
8. **Close the loop.** Every failed online case is a candidate for the offline dataset; Langfuse keeps datasets as reusable test cases and its GitHub Actions integration can "Block deploys on regressions" [S140].

| Property | Scoreable online without ground truth | Source of the signal |
|---|---|---|
| Language of reply matches the user | yes | managed evaluation [S138] |
| Sensitive data present in input or output | yes | managed evaluation [S138] |
| Refusal, and whether the request warranted one | yes, with a rubric | custom judge [S140] [S138] |
| Output format and schema compliance | yes | rule or judge [S140] |
| Tool chosen matches the request | yes, from tool calls on the observation | custom judge with tool-call variables [S140] |
| Factual correctness | no | needs a reference; offline dataset [S140] |
| Task completion across a session | partly | session-level target in Datadog [S138] |

Cadence: score continuously, review the distribution weekly, and re-baseline on every model id or prompt version change. A version change without a new baseline is the most common way a real regression is read as noise.

## Who does it (sourced)
- **Langfuse, living (checked 2026-09-26):** evaluation "runs across most of the AI engineering loop", online on live traces and offline before a change; observation-level judges are recommended for production; scores are numeric, categorical or boolean [S140].
- **Datadog, living (checked 2026-09-26):** custom LLM-as-a-judge evaluations against spans, traces or sessions with an optional sampling rate; results "available across Agent Observability in near-real-time"; provider accounts for OpenAI, Azure OpenAI, Anthropic, Amazon Bedrock, Vertex AI and AI Gateway; a token-usage dashboard for the judge itself [S138].
- **Chen, Zaharia and Zou, 2023-07-18 (v3 2023-10-31):** eight tasks across GPT-3.5 and GPT-4 March and June 2023 snapshots; sample sizes 1,000 primes, 500 happy numbers, 100 sensitive questions, 1,506 OpinionQA items, 50 LeetCode problems, 467 ARC samples [S149].
- **OpenTelemetry, living (checked 2026-09-26):** `gen_ai.evaluation.result` is defined as an event in Development status [S136].
- **Amazon, 2026-09:** beyond pre-deployment work, Amazon runs "lighter-touch automated benchmark assessments on a recurring basis, including after model launch, to monitor emerging risks" [S254].
- **Amazon, 2025-12:** on "Performance Drift", "customers should consider periodically retesting the performance of Amazon Nova 2 Lite and adjust their workflow if necessary" [S257].
- **Microsoft, 2026-08:** post-deployment, teams can "Monitor your Gen AI applications and agents after deployment with scheduled continuous red teaming runs on synthetic adversarial data" [S251].
- **Microsoft, 2026-02:** Microsoft says it is "progressing work to further study models when in use and assess the real-world effectiveness of mitigations" [S247].
- **Google, living:** the safety guidance page asks developers to plan "how you'll spot and deal with problems that arise" through feedback channels and user studies with "a diverse mix of users" [S237].

## Pitfalls
1. **Judging whole traces.** The judge sees the final output and misses which step failed; the trace-centric evaluator is also deprecated in Langfuse v4 [S140].
2. **Sampling for cost until nothing fires.** A 1% sample of a low-volume feature yields a handful of scores per day and the alert threshold is never reached [S138].
3. **Judge drift read as product drift.** The judge is a model too, and its provider can change it; pin the judge model id and recalibrate on a fixed set. See [judge-calibration](../3-judging/judge-calibration.md) and [S149].
4. **Alerting on the mean.** A failure in one intent barely moves the average; alert on the pass rate per criterion and per segment [S149].
5. **Online as the only eval.** Production traffic cannot cover cases that have not happened yet; offline datasets remain the gate [S140].

## Pattern from a production build
None yet.

## Sources
- [S136] Semantic Conventions for Generative AI, OpenTelemetry, living, checked 2026-09-26.
- [S138] LLM Observability (Agent Observability) documentation, Datadog, living, checked 2026-09-26.
- [S140] Evaluation documentation, Langfuse, living, checked 2026-09-26.
- [S149] How Is ChatGPT's Behavior Changing over Time?, Chen, Zaharia and Zou, 2023-07-18.
- [S254] Amazon's Frontier Model Safety Framework (September 2026 update), Amazon, 2026-09-17
- [S257] Amazon Nova 2 Lite, AWS AI Service Card, AWS, living
- [S251] AI Red Teaming Agent (Microsoft Foundry docs), Microsoft, living
- [S247] Frontier Governance Framework, Microsoft, 2026-02
- [S237] Safety guidance (Gemini API docs), Google, living
