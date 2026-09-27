---
id: load-and-latency
title: Load and latency
area: 4-agents-and-systems
status: draft
last_reviewed: 2026-09-26
sources: [S076, S074, S094, S088, S089]
related: [voice-agent-testing, ci-gates-for-llm-apps, non-determinism-and-pass-rates, genai-tracing]
---

# Load and latency

## What
A load test of an LLM application measures the application's own behaviour under concurrency: connection handling, queueing, integration calls, and the latency of one conversational turn as the user sees it. It does not measure the model vendor's throughput unless you choose to pay for that, and it should not, because a vendor's tail is not something your pull request can fix. The tool of record for this area is k6: "Thresholds are the pass/fail criteria that you define for your test metrics", and "If the performance of the system under test (SUT) does not meet the conditions of your threshold, the test finishes with a failed status" [S076].

## Why
An LLM app has two latency budgets: the model's, which you can only choose, and everything around it, which you own. Twilio's guidance for voice makes the second one visible: stream tokens as they arrive, because waiting for the whole response "can introduce significant latency" [S074]. A load test with the model stubbed isolates what you own, and it turns a vague "it feels slow" into a median, a tail and a breakpoint. The trade-off: a stubbed model cannot reveal a vendor rate limit or a slow tokeniser, so real-model runs still exist, just not as a gate.

## How
1. Make the virtual user a conversation. One VU is one call or one chat session speaking the same protocol as the real client. For WebSocket transports, k6 recommends `k6/websockets` for new tests; the experimental module is deprecated [S076].
2. Stub the model and guardrails behind a perf mode that returns realistic-shaped responses with realistic delay. Keep integrations (database, queues, CRM, telephony webhooks) real. That is the boundary between "our system" and "their system".
3. Reuse the fixture the end-to-end suite already uses, so the load test exercises the same steps the functional test does and stays in step when the flow changes.
4. Record custom metrics. k6 has "Counter, Gauge, Rate, and Trend" constructors; a Trend "add" call records a value and the summary prints avg, min, med, max, p(90) and p(95) [S076]. Useful ones: turn latency as a Trend, message fragmentation as a Counter, and a data-accuracy readback as a Rate, so a fast wrong answer still fails.
5. Gate on the median and report the tail. A threshold like `p(95)<2000` fails the run and returns a non-zero exit code [S076]; that is right for an HTTP API you own and wrong for a turn whose tail is the vendor's. Gate the median, publish p95, and write the reason next to the number.
6. Run in stages: a smoke per pull request (a handful of VUs, thresholds on errors and median), the forecast peak on a schedule, a breakpoint ramp until failure, and a soak. Use `abortOnFail` on the breakpoint run so it stops when the threshold fails [S076].
7. Write the ceiling. The output of a breakpoint run is a number: the concurrency at which the first threshold failed, and a recommended production ceiling below it.

| Metric | Type | Gate? | Why |
|---|---|---|---|
| turn latency, median | Trend | yes | measures what you own, stable |
| turn latency, p95 | Trend | report | tail is partly the vendor's; write the reason |
| errors and dropped connections | Rate | yes | deterministic |
| readback accuracy under load | Rate | yes | a fast wrong answer is a failure |
| fragmentation (token gaps) | Counter | report | a signal, not a contract |

| Stage | When | Virtual users | Gate |
|---|---|---|---|
| smoke | every pull request | a handful | errors, median latency |
| forecast peak | nightly or weekly | the forecast concurrency | errors, median, readback accuracy |
| breakpoint | before a launch or a capacity change | ramp until a threshold fails, with `abortOnFail` | none; the output is the ceiling |
| soak | before a launch | forecast peak, for hours | errors, memory, connection leaks |
| real model | manual, on demand | few | none; a check on how realistic the stub is |

## Who does it (sourced)
- **Grafana Labs, k6 v2.3.0, 2026-09:** thresholds with percentile syntax, non-zero exit on failure, `abortOnFail` with `delayAbortEval`, custom metrics created in init context "to ensure that k6 can validate that all thresholds are evaluating defined metrics", and TypeScript "enabled by default" since v0.57 via esbuild [S076].
- **Twilio, 2026-08:** stream tokens to the transport as they arrive; waiting for the full response adds latency [S074].
- **Roark, living product page:** "Load testing up to 250 concurrent calls" for voice agents, alongside regression runs [S094].
- **Microsoft Foundry, 2026-07:** production dashboards tracking "token consumption, latency, error rates, and quality scores", with alerts when outputs fail thresholds [S088].
- **UC Berkeley, BFCL V4, 2026-04:** reports cost and latency next to accuracy, so model choice can be made on all three [S089].

## Pitfalls
1. Gating p95 on a system whose tail belongs to the vendor. Report the tail as a miss with the reason written down and gate the median; a gate that fails every run stops being trusted.
2. Load testing with the real model and real speech. The bill and the rate limits arrive before the result does, and the result is about the vendor.
3. A virtual user that is not a conversation. Hammering one HTTP endpoint tells you about that endpoint, not about a 24-step call.
4. No accuracy oracle under load. Latency thresholds pass while the agent reads back the wrong date; add a readback check as a Rate metric [S076].
5. Thresholds on metrics k6 cannot see. Custom metrics "must be created in init context" or the threshold has nothing to evaluate [S076].

## Pattern from a production build
None yet.

## Sources
- [S076] Grafana k6 documentation, Grafana Labs, living (v2.3.0, 2026-09-21).
- [S074] ConversationRelay best practices, Twilio, living (modified 2026-08-19).
- [S094] Simulation testing for voice AI agents, Roark, living.
- [S088] Observability in Generative AI, Microsoft Foundry, 2026-07-31.
- [S089] Berkeley Function Calling Leaderboard, UC Berkeley, living (V4, 2026-04-12).
