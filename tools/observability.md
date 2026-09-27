# Observability tools

Four things an LLM team meets when it wants to see what happened in production: one vocabulary standard, one older vocabulary that many tools still emit, and two backends. Each row says what it is for and what it is not for, with the source id. Practices: [genai-tracing](../practices/6-observability/genai-tracing.md), [online-evals-and-drift](../practices/6-observability/online-evals-and-drift.md), [redaction-in-telemetry](../practices/6-observability/redaction-in-telemetry.md).

| Tool | What it is | For | Not for | Source |
|---|---|---|---|---|
| OpenTelemetry GenAI semantic conventions | span, metric and event definitions for model calls, tool execution and agent runs | a vendor-neutral schema; token and duration metrics; a shared span tree | judging output quality; a stable API, it is Development status | [S136] |
| OpenInference | Arize's conventions and instrumentations, complementary to OpenTelemetry | framework auto-instrumentation with `openinference.span.kind`; export to Phoenix, Arize or any OTel collector | a replacement for the OTel conventions; the two coexist and backends map both | [S141] |
| Langfuse | an LLM trace store with datasets, scores, online judges and prompt management | OTLP ingestion over HTTP; observation-level online evaluation; SDK-side masking | gRPC ingestion; application-wide APM | [S139] [S140] |
| Datadog LLM Observability | Datadog's LLM product, now titled Agent Observability, inside its APM | one platform for app and LLM traces; managed and custom judge evaluations; monitors on evaluation results | a free tier for high-volume agent loops, it bills per LLM span | [S138] |

## OpenTelemetry GenAI semantic conventions

The conventions define a CLIENT span per operation named `{gen_ai.operation.name} {gen_ai.request.model}`, with `gen_ai.operation.name` and `gen_ai.provider.name` required, token counts and finish reasons recommended, and message content (`gen_ai.input.messages`, `gen_ai.output.messages`, `gen_ai.system_instructions`) Opt-In with a PII warning [S136]. Metrics are histograms in seconds and tokens: `gen_ai.client.operation.duration`, `gen_ai.client.token.usage`, time-to-first-chunk and time-per-output-chunk, and server-side equivalents [S136]. Two events exist, `gen_ai.client.inference.operation.details` and `gen_ai.evaluation.result` [S136]. Everything is Development status and lives in its own repository since the move out of the main semantic-conventions repo; pin the instrumentation version [S136]. The 2026 OpenTelemetry blog walkthrough shows VS Code Copilot emitting the conventions and Claude Code exporting metrics and log events, with content capture off by default [S137].

Use it for: the schema every instrumentation and backend should agree on. Do not use it for: evaluation logic (the event is a container for a score, not a scorer), or as a promise of attribute stability.

## OpenInference

OpenInference is "a set of conventions and plugins that is complementary to OpenTelemetry" from Arize, with span kinds LLM, CHAIN, AGENT, TOOL, RETRIEVER, EMBEDDING, RERANKER, GUARDRAIL and EVALUATOR on the `openinference.span.kind` attribute, `input.value` and `output.value` for content, and instrumentations in Python, JavaScript, Java and Go [S141]. `OPENINFERENCE_HIDE_*` environment variables drop inputs or outputs before export [S141].

Use it for: framework instrumentations that already exist (LangChain, LlamaIndex, Bedrock, the OpenAI and Anthropic SDKs) and the Phoenix backend. Do not use it as: the only vocabulary in a pipeline that also carries GenAI-convention spans without a mapping; Langfuse maps both, your own queries must too [S139] [S141].

## Langfuse

Langfuse stores traces as observations (spans, generations, events) under sessions and users, ingests native SDK data and OTLP over HTTP at `/api/public/otel` with Basic auth and the `x-langfuse-ingestion-version: 4` header, and maps `gen_ai.*`, `llm.*`, OpenInference and MLflow attributes [S139]. Masking is an SDK function (`mask_otel_spans` in Python, `mask` on `LangfuseSpanProcessor` in JS) that runs before data leaves the process [S139]. Evaluation runs online on live traces and offline on datasets; observation-level judges are recommended for production, trace-level judges are deprecated in v4 with cloud support ending 2026-11-16; scores are numeric, categorical or boolean; alerts fire when a metric crosses a threshold and a GitHub Actions integration can block deploys on regression [S140].

Use it for: the LLM-specific trace tree, datasets and scores in one place, online judging with sampling. Do not use it for: gRPC OTLP (not supported when checked), or as the home for application traces that belong in an APM [S139].

## Datadog LLM Observability

Datadog models a trace as spans of kind llm, workflow, agent, tool, task, embedding or retrieval, each with inputs and outputs, metadata such as `temperature` and `max_tokens`, `input_tokens` and `output_tokens` metrics, and tags; the Python SDK auto-instruments OpenAI, LangChain, Bedrock and Anthropic; it states native support for the OTel GenAI conventions [S138]. Evaluations are managed (Language Mismatch and Sensitive Data Scanning listed when checked), custom LLM-as-a-judge against spans, traces or sessions with an optional sampling rate and boolean, score, categorical or JSON outputs, end-user feedback, and external scores via API; results are queryable as `@evaluation.<name>.value` and monitors alert on them [S138]. It is "metered and billed on the number of LLM spans ingested" [S138].

Use it for: one place for application and LLM traces when the team already runs Datadog, and alerting on evaluation results with the same monitors as everything else. Do not use it without: a sampling policy, since a chatty agent multiplies LLM spans, and a redaction step upstream, since the scanner flags sensitive data after it is stored [S138].

## Sources

- [S136] Semantic Conventions for Generative AI, OpenTelemetry, living, checked 2026-09-26.
- [S137] Inside the LLM Call: GenAI Observability with OpenTelemetry, OpenTelemetry blog, 2026-05-14.
- [S138] LLM Observability (Agent Observability) documentation, Datadog, living, checked 2026-09-26.
- [S139] Observability and OpenTelemetry documentation, Langfuse, living, checked 2026-09-26.
- [S140] Evaluation documentation, Langfuse, living, checked 2026-09-26.
- [S141] OpenInference specification and instrumentations, Arize AI, living, checked 2026-09-26.
