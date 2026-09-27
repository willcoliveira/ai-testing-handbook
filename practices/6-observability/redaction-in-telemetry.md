---
id: redaction-in-telemetry
title: Redaction in telemetry
area: 6-observability
status: draft
last_reviewed: 2026-09-26
sources: [S136, S137, S138, S139, S141, S142]
related: [genai-tracing, online-evals-and-drift, regulated-domain-checks, guardrails, offline-probes]
---

# Redaction in telemetry

## What
Redaction in telemetry is the set of controls that keep personal data (PII) and protected health information (PHI) out of traces, metrics, events and logs, or replace it with placeholders before it leaves the application. In an LLM system the prompt and the completion are the data, so a trace pipeline that captures content is a copy of every conversation. This practice covers where that copy is made, where it can be stripped, and how to test that it was.

## Why
The OpenTelemetry GenAI conventions mark every content attribute Opt-In with the warning that it "is likely to contain sensitive information including user/PII data" [S136]. OWASP's logging guidance says "Never log data unless it is legally sanctioned" and lists health data and government identifiers among data to remove, mask, sanitise, hash or encrypt [S142]. The trade-off is direct: content is what makes a trace useful for debugging a wrong answer and for online evaluation, so the choice is never on or off but where, for whom, and with what replaced. Redacting at the SDK is the only point that keeps the raw text off the wire; redacting at the collector is a second line that already trusts the network and the collector's own outputs [S139].

## How
1. **Inventory every place content lands.** Span attributes `gen_ai.input.messages`, `gen_ai.output.messages`, `gen_ai.system_instructions` and tool-call arguments inside message parts; the `gen_ai.client.inference.operation.details` event; the OpenInference `input.value` and `output.value` fields; backend input and output fields; the judge prompt of every online evaluator, which is a second copy sent to a provider account; and any collector exporter that writes to stdout or a file [S136] [S141] [S138].
2. **Default to off.** Content capture is Opt-In in the conventions and VS Code Copilot ships with "no prompt content or tool arguments" captured until a user enables it [S136] [S137]. Enable per environment and per pipeline, never globally.
3. **Redact in the application.** Langfuse's Python SDK takes a `mask_otel_spans` function and the JS SDK takes `mask` on `LangfuseSpanProcessor`, applied to "input, output, and metadata of every observation" before the data leaves the process [S139]. OpenInference instrumentations honour `OPENINFERENCE_HIDE_*` environment variables to drop inputs or outputs entirely [S141]. With a raw OTel SDK, a span processor that rewrites the content attributes plays the same role.
4. **Redact in the collector as a second line.** Langfuse documents both options and notes that collector-side masking "happens after telemetry leaves the application" [S139]. Never attach a debug or stdout exporter to a pipeline that carries content; the collector's own logs are a third copy.
5. **Decide what is replaced.** OWASP's list: passwords, session identifiers, access tokens, encryption keys, database connection strings, bank account and payment card data, sensitive personal data such as health information and government identifiers; names, phone numbers and e-mail addresses get "deletion, scrambling or pseudonymization" when identity is not required [S142]. Use a stable placeholder such as `[PHONE]` so a trace stays readable and a redacted field is distinguishable from an empty one.
6. **Keep the metrics.** Token counts, durations, finish reasons and model ids carry no content; they stay on every span so dashboards work with content off [S136].
7. **Detect at the backend as a check, not a control.** Datadog's Sensitive Data Scanning evaluation "flags the presence of sensitive or regulated information in model inputs or outputs"; treat a hit as a redaction bug upstream [S138].
8. **Test it.** An offline probe sends a message with a synthetic identifier and asserts the exported span carries the placeholder; a nonprod check searches the log platform for the same canary. See [offline-probes](../2-application-evals/offline-probes.md).

The shape of an SDK-side mask, per the Langfuse docs [S139]:

```python
def mask_otel_spans(data):
    # runs in process on input, output and metadata before export
    return redact_identifiers(data)   # names, phones, e-mails, record ids -> [PLACEHOLDER]

langfuse = Langfuse(mask_otel_spans=mask_otel_spans)
```

| Layer | Control | Sees raw text | Notes |
|---|---|---|---|
| SDK or span processor | mask function, hide variables | yes, in process | the only point that keeps raw text off the wire [S139] [S141] |
| Collector | attribute or redaction processor | yes, on the collector host | after transmission; its own stdout is a leak path [S139] |
| Backend | scanner evaluation | yes, stored | detection only [S138] |
| Online judge | provider account | yes, sent again | a second copy; include it in the inventory [S138] |

## Who does it (sourced)
- **OpenTelemetry, living (checked 2026-09-26):** content attributes are Opt-In; "Instrumentations MAY provide a way for users to filter or truncate input/output messages" [S136].
- **OpenTelemetry blog, 2026-05-14:** "By default, no prompt content or tool arguments are captured with GenAI telemetry, as these can contain sensitive data"; enabling it is an explicit setting [S137].
- **Langfuse, living (checked 2026-09-26):** "Use masking functions to redact sensitive information before trace data leaves your application"; `mask_otel_spans` in Python, `mask` on the span processor in JS; collector-side masking documented as the alternative [S139].
- **Arize, living (checked 2026-09-26):** OpenInference instrumentations honour `OPENINFERENCE_HIDE_*` variables [S141].
- **Datadog, living (checked 2026-09-26):** Sensitive Data Scanning as a managed evaluation that flags regulated information in inputs and outputs; the product page says it can "scan and redact any sensitive data" [S138].
- **OWASP, living (checked 2026-09-26):** the Logging Cheat Sheet's list of data never to log and data to sanitise [S142].

## Pitfalls
1. **Collector-only redaction.** The raw text has already crossed the network and sits in the collector's memory and logs [S139].
2. **A debug exporter in nonprod.** Nonprod often carries real data from testers; a stdout exporter turns every span into a log line.
3. **Masking input and output but not metadata or tool arguments.** Tool-call arguments live inside message parts and metadata can carry the user record; Langfuse masks all three for that reason [S139] [S136].
4. **The judge is a second copy.** Online evaluation sends the same content to a provider account; the redaction boundary must sit before the judge, not only before the trace store [S138].
5. **Detection mistaken for prevention.** A scanner that flags PHI in stored traces proves the leak happened; it does not undo it [S138] [S142].

## Pattern from a production build
None yet.

## Sources
- [S136] Semantic Conventions for Generative AI, OpenTelemetry, living, checked 2026-09-26.
- [S137] Inside the LLM Call: GenAI Observability with OpenTelemetry, OpenTelemetry blog, 2026-05-14.
- [S138] LLM Observability (Agent Observability) documentation, Datadog, living, checked 2026-09-26.
- [S139] Observability and OpenTelemetry documentation, Langfuse, living, checked 2026-09-26.
- [S141] OpenInference specification and instrumentations, Arize AI, living, checked 2026-09-26.
- [S142] Logging Cheat Sheet, OWASP Cheat Sheet Series, living, checked 2026-09-26.
