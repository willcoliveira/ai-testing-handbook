---
id: test-a-backend-chatbot
title: Test a backend-only chatbot
sources: [S004, S032, S045, S049, S076, S121, S123, S130, S131, S132, S136, S281, S308, S328, S331, S341, S342, S343, S344, S345, S346, S347]
last_reviewed: 2026-09-30
---

# Test a backend-only chatbot

## When
A chatbot exists only as an API (a chat endpoint with a session id, no UI of its own), and you
are asked how you would test it: the deterministic parts, the non-deterministic parts, red
teaming, and performance. The same plan applies when the UI belongs to another team.

## What
A four-layer plan run against the API: deterministic tests on every commit with the model
stubbed; a golden set judged on every prompt or model change, run N times with intervals; a red
team corpus that grows from findings; and a load test that reports time to first token, total
latency percentiles, token cost per turn and behaviour when the provider is slow. Plus a trace
per request so any failure is explainable.

## Why
The API is the whole test surface, so it has to carry every kind of test. The layers fail in
different ways and cost different amounts: code around the model is deterministic and cheap to
test; the model is not, and one run is a sample [S004][S308]; attacks are adversarial and change
over time [S281]; and LLM latency depends on tokens, not only on request count [S343]. Mixing
them gives either a flaky commit gate or a slow one.

## How
1. **Deterministic layer, model stubbed.** Replace the model with a stub that returns fixed
   outputs and test everything else: request and response schema, status codes, auth, rate
   limits, empty and oversized messages, bad session ids; prompt assembly (system prompt,
   history, retrieved context) as a snapshot; session memory (turn 3 sees turns 1 and 2, history
   truncates at the limit); tool call parsing and each tool function. These run on every commit.
2. **Deterministic assertions on real outputs.** Some checks need the real model but not a judge:
   valid JSON, contains, does not contain, regex, length, cost and latency ceilings [S045]. If the
   API uses structured outputs, the schema is enforced by constrained decoding [S346], but test the
   two cases the vendors name as exceptions: a refusal, which "takes precedence over schema
   constraints", and a response cut off at `max_tokens` [S346][S347]. Schema-valid is not correct:
   still check the values.
3. **Non-deterministic layer: a golden set, judged, repeated.** Start from 20 to 50 cases drawn
   from real failures [S032]. Grade with deterministic checks first, then an LLM judge on written
   criteria (G-Eval takes either criteria or explicit evaluation steps [S331]; most DeepEval
   metrics are LLM-judged with a 0.5 default threshold [S328]). Calibrate the judge against human
   labels before trusting its score. Run each case several times [S049], report the pass rate with
   an interval, and compare versions with a paired test on the same cases [S004]. Identical runs
   can vary more than two setups differ [S308].
4. **Multi-turn.** Script conversations for known flows; use a simulated user for coverage and
   grade the end state, not the wording. Keep scripted flows in the gate and simulated ones in a
   scheduled job until they prove stable.
5. **Red team.** Cover the OWASP LLM Top 10 classes that apply [S121][S281]: direct and indirect
   prompt injection, system prompt and data leakage across sessions, excessive agency if it has
   tools, harmful and off-scope content. Include multi-turn escalation: Crescendo starts benign
   and "gradually escalates the dialogue", which single-turn tests miss [S344]. Generate attacks
   with promptfoo red team, garak or PyRIT [S132][S130][S131]. If the bot combines private data,
   untrusted content and a way to send data out, treat it as unsafe by construction [S123].
   Measure over-refusal too: refusing a legitimate question is a defect. Every finding becomes a
   fixed regression case.
6. **Performance.** Measure time to first token, defined as the time from sending the prompt to
   the first token [S341], and total latency, as p50, p95 and p99. One virtual user is one
   conversation: k6 or Locust (a Locust user class "represents one type of user/scenario") with
   think time between turns [S076][S345]. Stub the model for volume tests of your own code; use
   the real model for the tail. Output length drives latency far more than prompt length [S343],
   so test long answers and long conversations separately. If the API uses prompt caching, run
   warm and cold: a prompt below the minimum length is processed "without caching, and no error is
   returned", and the usage fields show whether a request hit the cache [S342]. Test provider
   slowness and errors (timeouts, 429s, fallback model).
7. **Trace every request.** Emit a span per model and tool call with token counts and finish
   reasons [S136], so a slow or wrong answer can be explained from the trace, not reproduced.
8. **Wire the layers to cadences.** Deterministic: every commit. Golden set: every prompt, model or
   retrieval change, as a gate. Red team: before release and on a schedule. Load: before scaling
   events and on a schedule. Production: sample live traffic for online evals and watch drift.

Plan template:

```
system: chat API <endpoint>, model <id>, tools <list>, RAG <yes/no>
deterministic (every commit, model stubbed): <n> contract, <n> prompt assembly, <n> session, <n> tool
real-output assertions: schema, refusal path, max_tokens path, length, cost ceiling
golden set: <n> cases v<k>, judge <id> calibrated kappa <x>, N=<runs>, gate: pass >= <p>, no paired regression
red team: OWASP classes <list>, multi-turn yes, tool <name>, over-refusal set <n>
performance: TTFT p95 <= <s>, total p95 <= <s> at <c> concurrent, cost per turn <= <$>, cold vs warm cache
tracing: span per model and tool call, sampled content with redaction
```

## Done when
The four layers exist and run on stated cadences; the commit gate uses a stubbed model; refusal
and truncation paths are tested; the golden set reports intervals and paired differences with a
calibrated judge; the red team corpus includes multi-turn and over-refusal cases; load results
state TTFT and total latency percentiles, concurrency and cost; and every request is traced.

## Related
Practices: [ci-gates-for-llm-apps](../practices/2-application-evals/ci-gates-for-llm-apps.md),
[non-determinism-and-pass-rates](../practices/2-application-evals/non-determinism-and-pass-rates.md),
[red-teaming](../practices/5-safety-and-security/red-teaming.md),
[prompt-injection](../practices/5-safety-and-security/prompt-injection.md),
[false-positive-protection](../practices/5-safety-and-security/false-positive-protection.md),
[load-and-latency](../practices/4-agents-and-systems/load-and-latency.md).
Playbooks: [02 Build a golden set](02-build-a-golden-set.md), [05 Calibrate the evaluator](05-calibrate-the-evaluator.md),
[06 Benchmark your system](06-benchmark-your-system.md), [07 Test guardrails and safety](07-test-guardrails-and-safety.md),
[08 Wire the gates](08-wire-the-gates.md).
