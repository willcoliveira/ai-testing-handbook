<!-- applied: 2026-09-28 -->
## practice: llm-as-judge
- **DeepEval, 2026-09:** version 4.2.4 added a decision-model judge (TypeSafe's Jev) that returns bounded verdicts instead of generated text, presented as less flaky, cheaper and faster [S070].
- **Langfuse, 2026-08 and 2026-09:** versions 4.42 to 4.44 surfaced decision-model evaluators in the template gallery and added them as a judge option [S071].
- **arXiv, 2026-09:** a model used as a document auditor at scale fabricated findings and degraded as batch size grew, a warning for any judge asked to review many items in one call [S303].
## practice: judge-calibration
- **arXiv, 2026-09:** auditor models degraded with batch size and invented findings, so calibrate a judge at the batch size you will run it at [S303].
## practice: voice-agent-testing
- **promptfoo, 2026-09:** version 0.123.0 added native audio grading through the rubric assertion and support for live voice sessions, so the audio can be graded and not only its transcript [S068].
## practice: genai-tracing
- **promptfoo, 2026-08:** version 0.122.1 added tracing on the OpenTelemetry GenAI conventions and fetches external traces from Braintrust, Langfuse and Tempo [S068].
## practice: non-determinism-and-pass-rates
- **promptfoo, 2026-08:** version 0.121.19 added a per-test repeat option, which makes N runs a first-class setting [S068].
## practice: agent-evals
- **arXiv, 2026-09:** SWE-Serve's 53 production inference-serving tasks found that serving end-to-end tests reject about a third of patches that pass every other test, a measured gap between local completion and production correctness [S298].
- **arXiv, 2026-09:** a benchmark of parallel coding agents found high interference in constructed scenarios and few conflicts in real pull-request pairs, so coordination is best measured on real pairs [S300].
- **arXiv, 2026-09:** enterprise agents struggled most on questions that require disambiguation among similar records [S306].
## practice: ci-gates-for-llm-apps
- **arXiv, 2026-09:** selecting a benchmark subset from agent action-trajectory embeddings cut regression-testing cost by 90 percent in the paper's setting, at an accepted error rate [S299].
## practice: regression-on-upgrade
- **arXiv, 2026-09:** trajectory-aware subset selection is one way to keep a per-version regression replay affordable [S299].
## practice: data-contamination
- **arXiv, 2026-08:** a taxonomy of contamination organised by which mitigation each type defeats, with a disclosure protocol for reporting contamination status beside a score [S301].
- **arXiv, 2026-09:** a synthetic-data screen for training corpora that measures lexical-diversity collapse and n-gram tail truncation [S304].
- **arXiv, 2026-08:** residual-stream probing for contamination carried more variance than its baseline and gave no definitive verdicts, so activation probes are not reliable detectors [S305].
## practice: benchmark-hygiene
- **arXiv, 2026-09:** a contamination-controlled private suite found no consistent advantage between vendor-native and neutral harnesses in agentic coding, which separates the harness effect from the model effect [S302].
## practice: harnesses
- **arXiv, 2026-09:** "harness or model" measured with a private suite: no consistent advantage for vendor-native harnesses over neutral ones [S302].
