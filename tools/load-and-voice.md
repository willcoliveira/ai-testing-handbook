# Load testing and voice

Tools for the transport, the timing and the audio around a model. Practices: [load-and-latency](../practices/4-agents-and-systems/load-and-latency.md), [voice-agent-testing](../practices/4-agents-and-systems/voice-agent-testing.md). Matrix: [README](README.md). No vendor below is described from anything but its public docs.

## Grafana k6
- **What it is:** an open-source load testing tool, AGPL-3.0, "optimized for minimal resource consumption and designed for running high-load performance tests", used by "Developers, QA Engineers, SDETs, and SREs" [S076].
- **What it is for:** conversational virtual users over WebSockets (`k6/websockets` is recommended; the experimental module is deprecated); custom Counter, Gauge, Rate and Trend metrics with p(90) and p(95) in the summary; thresholds such as `p(95)<200` that fail the run with a non-zero exit code; `abortOnFail` with `delayAbortEval` for breakpoint runs; TypeScript "enabled by default" since v0.57 through esbuild, which strips types without checking them [S076].
- **What it is not for:** measuring a model vendor's tail. Stub the model behind a perf mode and keep integrations real; see the load-and-latency practice.
- **Version checked:** v2.3.0, 2026-09-21 [S076].

## Twilio ConversationRelay (what its guidance implies for testing)
- **What it is:** Twilio's bridge between a phone call and a text-based LLM application over a WebSocket, with configurable speech-to-text and text-to-speech providers [S074].
- **What to test from the best-practices page:** that tokens are streamed "as soon they become available instead of waiting for the LLM to generate a complete response"; that the final token is sent with `"last": true` "When the LLM indicates that the response is complete"; that speech-to-text provider and model choices hold up in "diverse audio environments"; that language switching works mid-session; and that voice and language set in TwiML are not expected to change over the WebSocket [S074].
- **What the page does not cover:** interruption handling, DTMF, handoff, testing or debugging; those need other pages or real calls.
- **Version checked:** page modified 2026-08-19 [S074].

## VoiceBench
- **What it is:** "the first benchmark designed to provide a multi-faceted evaluation" of LLM-based voice assistants, arXiv 2410.17196 (v3 2024-12-11), CC BY 4.0; the repository (Apache-2.0) tags a TACL 2026 version [S075].
- **What it is for:** speech input under "diverse speaker characteristics, environmental and content factors", with "both real and synthetic spoken instructions" [S075].
- **What it is not for:** telephony behaviour, latency or multi-turn dialogue; the paper does not cover them.

## tau2-bench, voice mode
- **What it is:** the tau2-bench orchestrator in full-duplex mode: "voice full-duplex (simultaneous) evaluation using real-time audio APIs" with OpenAI, Gemini and xAI providers, a `VoiceStreamingUserSimulator`, and ElevenLabs voices for the user simulator [S078].
- **What it is for:** end-to-end scoring of an audio-native agent on the same tasks and state-based rewards as the text benchmark [S078].
- **What it is not for:** a telephony stack; it drives realtime model APIs, not phone calls.
- **Version checked:** v1.0.1, 2026-07 [S078].

## Voice simulation platforms (category)
Agent-to-agent voice testing: a platform places or receives a call with the agent under test, a model-driven caller follows a scenario and persona, the call is recorded, and the result is scored by rules or a judge. Public docs of three vendors define the category; none is endorsed here.

- **Vapi voice testing:** two mechanisms, evals that check "exact matching, a pattern, or an AI judge" at known conversation points, and simulations where "An AI tester acts as the caller and adapts during a complete conversation", over chat or voice; manual real calls are recommended for "background noise, accents, and production recordings" [S093].
- **Roark:** "Hundreds of simulated callers (the angry one, the rambler, the interrupter) built from your real call types"; adversarial callers; 45 languages; background noise; "Load testing up to 250 concurrent calls"; regression runs and CI/CD gates; "Always-on probes call your agent around the clock"; integrations listed for Vapi, Retell, LiveKit, Pipecat, Bland, ElevenLabs, Kore.ai and Google Cloud [S094].
- **Coval:** "Run thousands of realistic conversations" with "background noise, accents, and edge cases" before launch; voice and chat; production call scoring; "human reviewers whose feedback retrains the AI judge"; CI/CD, REST API, CLI, TypeScript and Python SDKs, MCP connector [S095].

What the category is good for: coverage of caller behaviours nobody scripted, and a real audio path end to end. What it is not good for, until proven otherwise on your agent: a release gate. Two probabilistic systems and a judge sit behind one pass rate, so measure stability across sequential runs and across a controlled prompt change, and price the cadence, before adopting. See the orchestrators-and-simulators practice for the gates.
