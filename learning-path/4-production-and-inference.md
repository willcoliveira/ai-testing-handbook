# Phase 4: Production and inference

Outcome: you can set a latency budget, a cost budget and a load test for an LLM application, and
say what each one proves.

## What you learn to build
A deployed agent with tracing, a latency budget per turn, a cost ceiling, and a load test where a
virtual user is one real conversation. Inference literacy: prompt length, time to first token,
key-value cache, tool latency, and why the tail is where the pain is.

## What a tester takes from it
A load test proves nothing about answer quality. It proves turn-taking holds, connections stay up,
data persists, and it shows where the tail comes from. Gate the median, report the tail with the
reason, publish a ceiling with headroom.

## Line items

| Item | Know | Do | Prove it |
|---|---|---|---|
| Time to first token | the user feels the first token, not the last | measure it per turn | plot it against prompt length |
| Prompt caching | a cached prefix is cheaper and faster | enable it | show the cost and latency difference on a repeated prefix |
| Tool latency stacking | integration calls add in series | trace a turn with two tool calls | show the tail moving with the slowest call |
| Stubbing for load | stub the model, keep the integrations | build a perf mode | show the service refusing to boot in perf mode on production |
| Correctness under load | a fast run that drops answers has failed | read every answer back after the run | gate on data accuracy equal to one |
| Median versus tail | a gate every run fails is a gate people disable | gate p50, report p95 and p99 | write the reason next to the threshold |
| Cost | credits or tokens per run, per cadence | do the monthly arithmetic | put a cost gate in the adoption decision |
| Tracing | GenAI span conventions; route LLM spans separately | send LLM spans to one store, app traces to another | follow one conversation across both |

## Worked example
A voice agent over a WebSocket relay. A k6 virtual user speaks the same protocol as the chat
client, so a user is one call without a phone or a model. Run the forecast peak with the model
stubbed and the integrations real, read every answer back, then run the real model for the tail.
Report the median and the tail separately against the target, find the breakpoint by ramping past
peak, and recommend a ceiling with headroom in one sentence.

## Exercises
1. Instrument time to first token and total turn latency. Plot both against prompt length.
2. Build a perf mode with a stubbed model. Run 15 virtual users. Read every answer back.
3. Write the thresholds file: what gates, what is reported, and why, in sentences.

## Read next
[load-and-latency](../practices/4-agents-and-systems/load-and-latency.md),
[genai-tracing](../practices/6-observability/genai-tracing.md),
[ci-gates-for-llm-apps](../practices/2-application-evals/ci-gates-for-llm-apps.md).

## Resources
[S182] a million lines of code, zero keystrokes; [S183] the stack behind coding agents;
[S184] how AWS thinks about agent harnesses; [S185] SE Radio on harness engineering.
