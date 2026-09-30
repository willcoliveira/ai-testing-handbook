<!-- applied: 2026-09-30 -->
## practice: judge-calibration
- **arXiv, 2026-09:** position bias, transitivity and pairwise agreement were dominated by pairs close in rank and correlated only weakly with ranking accuracy against gold; the authors propose rank-gap-conditional metrics, ideally against human rankings [S320].
## practice: tool-use-evals
- **arXiv, 2026-09:** treating each tool's advertised interface as an executable contract confirmed seven tool defects and one evaluator property across 34 tools in four agent benchmarks, including a tau2-bench telecom case where the evaluator rewards refuelling a suspended line and fails the repaired tool [S319].
## practice: agent-evals
- **arXiv, 2026-09:** WitnessGym injects bugs into test-reached paths of real Java projects (1,300 cases); across six framework and model pairings, building an executable bug witness stayed difficult even when the bug pattern was known [S315].
- **arXiv, 2026-09:** on 721 multi-turn text-to-Cypher sessions the best model reached 64.7 percent execution accuracy while session-level correctness stayed below 5 percent, and the leaderboard top reordered between a guided and a fully autonomous protocol [S317].
## practice: capability-benchmarks
- **arXiv, 2026-09:** LoLBench pairs long enhancement proposals with systems averaging 2.4M lines of code; the best of 28 agents resolved 14 percent of tasks, with incomplete code localisation named as a major bottleneck [S318].
## practice: prompt-injection
- **arXiv, 2026-09:** a toolkit of 13 attacks, 16 channels and 12 defences found prevention strategies on a coding agent cut attack success by 71.8 percent relative, and offline detectors had perfect precision but low recall [S316].
- **arXiv, 2026-09:** subtracting a fitted activation direction from tool-result tokens cut AgentDojo compromise from 0.10-0.49 to 0.006-0.079 at 93 to 100 percent benign utility on five open-weights models; attacker-chosen arguments in legitimate calls were only partly resisted [S314].
## practice: guardrails
- **arXiv, 2026-09:** injection compliance was localised to a late-layer bottleneck, and a detector at that layer held up where early-layer classifiers degraded under surface obfuscation such as leetspeak [S321].
## practice: llm-as-judge
- **Inspect AI, 2026-09:** version 0.3.273 fixed `self_critique()`, and `model_graded_qa()` and `model_graded_fact()` with `model_role=None`, which did not grade with the correct model when one task was evaluated against several models [S066].
## practice: genai-tracing
- **OpenTelemetry, 2026-09:** the GenAI conventions added `gen_ai.skill.*` attributes (name, description, source URI, resource name) on the `execute_tool` span, so loading an agent skill, reading its resources or running its scripts is recorded as a tool execution; still Development status, no release [S136].
