---
id: voice-agent-testing
title: Voice agent testing
area: 4-agents-and-systems
status: draft
last_reviewed: 2026-09-26
sources: [S074, S075, S078, S093, S094, S095, S070, S076]
related: [orchestrators-and-simulators, load-and-latency, exploratory-testing-of-agents, agent-evals, regulated-domain-checks]
---

# Voice agent testing

## What
A voice agent wraps the model in speech-to-text, text-to-speech, a streaming transport and telephony. Testing it means testing four layers plus the timing between them. Twilio's ConversationRelay guidance is a good map of the layers: the application streams text tokens over a WebSocket, marks the final token, chooses a speech-to-text provider and model per call, and can switch language mid-session [S074]. The parts a text harness cannot reach are the ones that only exist in audio and on the wire: interruption (barge-in), hold and whisper transitions, cold handoff to a human, and speech under noise and accents. Vapi's own testing docs say as much: simulations run over chat or voice, and manual real calls are still recommended for "background noise, accents, and production recordings" [S093].

## Why
Latency is the product. Twilio: "Most applications should stream these text tokens to Conversation Relay as soon they become available instead of waiting for the LLM to generate a complete response", because waiting "can introduce significant latency" [S074]. Speech is the other half. VoiceBench was built because voice assistants have to cope with "diverse speaker characteristics, environmental and content factors", not clean read speech [S075]. The trade-off is monotonic: the closer a test gets to real audio on a real call, the slower, costlier and noisier it is. A layered plan puts each check at the cheapest layer that can see the defect.

## How
| Layer | What to check | How | Cost and noise |
|---|---|---|---|
| Protocol | the WebSocket contract, turn latency, token fragmentation, concurrency | load test with the model and guardrails stubbed, integrations real [S076] | low, deterministic |
| Dialogue and state | state machine, data readback, required phrases | text harness against a chat simulator with a state or data oracle | low |
| Speech | speech-to-text under accents and noise | public benchmark items [S075], vendor simulation with noise and accents [S094][S095] | medium |
| Telephony | barge-in, DTMF, hold, whisper, handoff | real PSTN calls, manual, with recordings kept as evidence | high, manual |
| Two agents | end-to-end on a real call with a simulated caller | agent-to-agent platform behind a stability gate and a cost gate | high, noisy |

1. Test the dialogue in text first. Most defects are in state and data, and a text harness finds them at a fraction of the cost.
2. Define the turn-latency budget and measure it at the protocol layer with the model stubbed, so the number is about your system and not about the vendor's tail. Gate the median; report the tail with a written reason.
3. Verify streaming behaviour explicitly: tokens sent as they arrive, and the final token flagged with `"last": true` "When the LLM indicates that the response is complete" [S074].
4. Run speech checks with variation, not one clean voice. VoiceBench mixes "real and synthetic spoken instructions" across speaker, environment and content variations [S075]; vendor simulators add "background noise, accents, and edge cases" [S095].
5. Make real calls for what audio-only behaviour needs: interrupt the agent mid-sentence, press keys, ask for a human, go silent. Keep the recording and the call id as evidence.
6. Treat agent-to-agent testing as a candidate, not a gate, until it passes a stability test across sequential runs and a controlled prompt change (see `orchestrators-and-simulators`).
7. Assert on the audio when the defect is in the audio. If the platform captures two-channel audio but grades the transcript, the speech layer is untested [S093][S094].

## Who does it (sourced)
- **Twilio, page modified 2026-08:** stream tokens as they arrive, mark the last token, pick speech-to-text providers and models per use, and "Evaluate and optimize Speech-to-Text performance for diverse audio environments" [S074].
- **Chen et al., VoiceBench, 2024-10:** "the first benchmark designed to provide a multi-faceted evaluation" of LLM-based voice assistants, with real and synthetic spoken instructions; CC BY 4.0; the repository tags a TACL 2026 version [S075].
- **Sierra Research, tau2-bench, 2026-07:** "voice full-duplex (simultaneous) evaluation using real-time audio APIs" with OpenAI, Gemini and xAI providers, a `VoiceStreamingUserSimulator`, and ElevenLabs voices for the simulated user [S078].
- **Vapi, living docs:** evals at known conversation points using "exact matching, a pattern, or an AI judge", and simulations over chat or voice; manual calls recommended for noise and accents [S093].
- **Roark, living product page:** simulated callers with background noise and 45 languages, an example scenario "Interrupts mid-disclosure" scored as a fail, load testing to 250 concurrent calls, and "Always-on probes" that call the agent around the clock [S094].
- **Coval, living docs:** simulations "with background noise, accents, and edge cases", production call scoring, and human review that retrains the judge [S095].
- **Confident AI, DeepEval, 2026-09:** lists voice among its evaluation targets and ships "voice" metrics [S070].

## Pitfalls
1. Grading the transcript when the channel was audio. A platform can capture real two-channel audio and still assert on the transcript, so speech defects cannot fail a run.
2. Gating on an unstable simulator. Zero reliably stable scenarios after days of tuning, and scenarios at 100 percent that regress on the team's own prompt change, are the signal to set a stability gate first.
3. Load testing with real speech and a real model. Cost and rate limits dominate, and the result measures the vendor. Stub the model and guardrails and keep integrations real, as the k6 pattern did.
4. Assuming a text harness covers barge-in, whisper and handoff. Those live in telephony; the exploratory pattern reached them only with real PSTN calls.
5. Measuring latency on a buffered response when production streams. The number will be wrong in the direction that hides the problem [S074].

## Pattern from a production build
None yet.

## Sources
- [S074] ConversationRelay best practices, Twilio, living (modified 2026-08-19).
- [S075] VoiceBench: Benchmarking LLM-Based Voice Assistants, Chen et al., arXiv, 2024-10.
- [S078] tau2-bench repository, Sierra Research, living (v1.0.1, 2026-07).
- [S093] Voice testing, Vapi docs, living.
- [S094] Simulation testing for voice AI agents, Roark, living.
- [S095] Coval documentation, Coval, living.
- [S070] DeepEval documentation, Confident AI, living (4.2.6, 2026-09-24).
- [S076] Grafana k6 documentation, Grafana Labs, living (v2.3.0, 2026-09-21).
