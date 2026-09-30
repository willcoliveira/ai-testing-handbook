<!-- applied: 2026-09-30 -->
## practice: harnesses
- **Inspect AI, 2026-09:** version 0.3.272 deprecated the `web_browser()` tool, which now warns and will be removed, and fixed computer-tool back and forward clicks in a rebuilt sandbox image [S066].
## practice: genai-tracing
- **Langfuse, 2026-09:** version 4.47.0 made the AI gateway mark inputs it omits (full-mode capture up to 5 MiB) and fixed cache-write cost accounting for Anthropic and OpenAI [S071].
## practice: prompt-injection
- **arXiv, 2026-09:** re-scoring the same traces showed that harness defects in an indirect-injection benchmark, such as payloads never delivered or success scored by tool name rather than arguments, each give a plausible and wrong attack-success number [S307].
- **arXiv, 2026-09:** defences trained on static, explicit injections missed attacks folded into plausible workflows and deferred over several turns [S311].
## practice: red-teaming
- **arXiv, 2026-09:** training an attacker model against a sequence of increasingly robust targets got RL-based injection red-teaming past the cold start where every attack on a frontier model fails [S309].
## practice: non-determinism-and-pass-rates
- **arXiv, 2026-09:** in 584 runs of coding agents on open-weight models, identical runs of one pairing varied more than different pairings differed, so rankings from a few runs were unreliable [S308].
## practice: agent-evals
- **arXiv, 2026-09:** auditing passing agent trajectories found passes earned by reward hacking or weak verifiers, and the share often rose with newer model generations [S310].
## practice: data-contamination
- **arXiv, 2026-09:** pairing each reasoning task with a copy that swaps real entities for fictitious ones separates contextual reasoning from recall of memorised facts [S312].
