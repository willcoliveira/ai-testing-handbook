---
id: genai-tracing
title: GenAI tracing
area: 6-observability
status: draft
last_reviewed: 2026-09-28
sources: [S068, S136, S137, S138, S139, S141]
related: [online-evals-and-drift, redaction-in-telemetry, load-and-latency, agent-evals]
---

# GenAI tracing

## What
GenAI tracing records every model call, tool execution and agent run as a span with a shared vocabulary: which operation, which provider and model, which parameters, how many tokens in and out, how long, and why generation stopped. The OpenTelemetry GenAI semantic conventions define that vocabulary as spans, metrics and events [S136]. Backends such as Langfuse and Datadog ingest it, and OpenInference is a second vocabulary from Arize that many backends also accept [S139] [S138] [S141]. Message content is a separate, opt-in layer on top.

## Why
An LLM feature fails in ways a request log cannot explain: a slow answer may be one long model call, three retries, or a tool that hung; a wrong answer may be a different model version, a truncated context, or a finish reason of "length". A span per operation with token counts and finish reasons answers those questions without reading transcripts. It replaces print statements and per-vendor SDK logs with one schema across providers. The trade-off is that the most useful field, the messages themselves, is also the most sensitive, and the conventions make it opt-in for that reason [S136]. The conventions are also still in Development status, so attribute names can change between releases [S136].

## How
1. **Span per operation.** Name the span `{gen_ai.operation.name} {gen_ai.request.model}` and set kind CLIENT (INTERNAL is allowed for models running in the same process) [S136].
2. **Required attributes.** `gen_ai.operation.name` and `gen_ai.provider.name` are required. `gen_ai.request.model`, `error.type`, `gen_ai.conversation.id` and `gen_ai.output.type` are conditionally required. Recommended: `gen_ai.response.model`, `gen_ai.response.id`, `gen_ai.usage.input_tokens`, `gen_ai.usage.output_tokens`, `gen_ai.request.temperature`, `gen_ai.request.max_tokens`, `gen_ai.request.stream`, `gen_ai.response.finish_reasons` [S136].
3. **Operation names.** Use the enum: `chat`, `generate_content`, `text_completion`, `embeddings`, `execute_tool`, `create_agent`, `invoke_agent`, plus `plan`, `retrieval` and the memory operations [S136]. An agent run is a root `invoke_agent` span with child `chat` spans per model call and `execute_tool` spans per tool call [S137].
4. **Metrics.** Emit `gen_ai.client.operation.duration` (histogram, seconds) and `gen_ai.client.token.usage` (histogram, tokens, attribute `gen_ai.token.type` = input or output). Streaming adds `gen_ai.client.operation.time_to_first_chunk` and `gen_ai.client.operation.time_per_output_chunk`. Server-side conventions add `gen_ai.server.request.duration`, `gen_ai.server.time_to_first_token` and `gen_ai.server.time_per_output_token`. Recommended duration buckets run from 0.01 s, doubling, to 81.92 s [S136].
5. **Content.** `gen_ai.input.messages`, `gen_ai.output.messages` and `gen_ai.system_instructions` are Opt-In and carry the warning that they are likely to contain PII. Two events exist: `gen_ai.client.inference.operation.details` for the full call and `gen_ai.evaluation.result` for scores. Messages are structured as a role plus parts of type text, tool_call or tool_call_response [S136]. Read [redaction-in-telemetry](redaction-in-telemetry.md) before enabling any of these.
6. **Route to a backend.** Langfuse accepts OTLP over HTTP at `/api/public/otel` (no gRPC), authenticates with Basic auth built from the project keys, and needs the header `x-langfuse-ingestion-version: 4` or data can lag by up to ten minutes. It maps `gen_ai.*`, `llm.*`, OpenInference `input.value` and `output.value`, and gives `langfuse.*` attributes precedence [S139]. Datadog states native support for the GenAI conventions and models spans as llm, workflow, agent, tool, task, embedding or retrieval, billed per LLM span ingested [S138]. OpenInference instrumentations export to Phoenix, Arize or any OTel collector and tag spans with `openinference.span.kind` (LLM, CHAIN, AGENT, TOOL, RETRIEVER, EMBEDDING, RERANKER, GUARDRAIL, EVALUATOR) [S141].
7. **Propagate trace-level fields.** Put user id, session id, version, release and tags on every span, not only the root, or the backend cannot filter by them [S139].
8. **Pin the convention version** in the instrumentation dependency and record it in the build, because the status is Development [S136].

A minimal chat span, as the conventions describe it [S136]:

```text
name:  chat gpt-4.1-2025-04-14
kind:  CLIENT
attributes:
  gen_ai.operation.name        chat
  gen_ai.provider.name         openai
  gen_ai.request.model         gpt-4.1-2025-04-14
  gen_ai.response.model        gpt-4.1-2025-04-14
  gen_ai.response.id           chatcmpl-...
  gen_ai.usage.input_tokens    812
  gen_ai.usage.output_tokens   96
  gen_ai.response.finish_reasons ["stop"]
  gen_ai.conversation.id       <session id>
  # gen_ai.input.messages and gen_ai.output.messages: Opt-In, absent by default
```

| Decision | Choose | Because |
|---|---|---|
| One trace for app and LLM, or two | Two, linked | Application backends bill per span and keep short retention; LLM backends want the full agent tree. An OTel Link on the LLM root points back at the application trace. |
| Content on or off | Off by default, on per environment with redaction | The conventions mark content Opt-In [S136]; VS Code Copilot ships with it off [S137]. |
| Sampling | Head-sample application traces; sample GenAI spans separately | Token and duration histograms need volume; content-bearing spans need less and cost more to store. |

## Who does it (sourced)
- **OpenTelemetry, living (checked 2026-09-26):** the GenAI conventions moved to a dedicated `semantic-conventions-genai` repository; all span, metric and event conventions are marked Development; content attributes are Opt-In [S136].
- **OpenTelemetry blog, 2026-05-14:** "VS Code Copilot emits traces, metrics, and events for every agent interaction" and "Claude Code exports metrics and log events via OTel, with trace support in beta"; "By default, no prompt content or tool arguments are captured with GenAI telemetry, as these can contain sensitive data" [S137].
- **Datadog, living (checked 2026-09-26):** the product page, now titled Agent Observability, says it "natively supports OpenTelemetry GenAI Semantic Conventions"; its Python SDK auto-instruments OpenAI, LangChain, Bedrock and Anthropic; it is "metered and billed on the number of LLM spans ingested" [S138].
- **Langfuse, living (checked 2026-09-26):** OTLP over HTTP only, gRPC "not supported yet"; the v4 ingestion header; SDKs "send tracing data asynchronously in the background" so tracing does not add request latency [S139].
- **Arize, living (checked 2026-09-26):** OpenInference is "a set of conventions and plugins that is complementary to OpenTelemetry", with Python, JavaScript, Java and Go instrumentations, and honours `OPENINFERENCE_HIDE_*` variables [S141].
- **promptfoo, 2026-08:** version 0.122.1 added tracing on the OpenTelemetry GenAI conventions and fetches external traces from Braintrust, Langfuse and Tempo [S068].

## Pitfalls
1. **Treating Development names as stable.** A rename between convention releases leaves dashboards keyed on the old attribute blank; pin the instrumentation version and diff on upgrade [S136].
2. **Content on in every environment.** The conventions make messages Opt-In for a reason; turning them on globally puts PII in whatever the collector exports to [S136] [S137].
3. **User and session only on the root span.** Langfuse filters need those attributes on every span in the trace [S139].
4. **Mixing vocabularies without a map.** A framework instrumentation may emit OpenInference while a raw SDK emits GenAI conventions; the backend may map both, but your own queries must know which field holds the model name [S139] [S141].
5. **Paying per span without a sampling policy.** Datadog bills per LLM span, so an agent with many tool loops multiplies cost; decide the sampling rule before the first production release [S138].
6. **A debug exporter left in a nonprod collector.** Content-bearing spans end up in the log platform.

## Pattern from a production build
None yet.

## Sources
- [S136] Semantic Conventions for Generative AI, OpenTelemetry, living, checked 2026-09-26.
- [S137] Inside the LLM Call: GenAI Observability with OpenTelemetry, OpenTelemetry blog, 2026-05-14.
- [S138] LLM Observability (Agent Observability) documentation, Datadog, living, checked 2026-09-26.
- [S139] Observability and OpenTelemetry documentation, Langfuse, living, checked 2026-09-26.
- [S141] OpenInference specification and instrumentations, Arize AI, living, checked 2026-09-26.
- [S068] promptfoo documentation, intro, promptfoo, living
