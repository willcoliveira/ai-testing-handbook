## practice: prompt-injection
- **OWASP GenAI Security Project, 2026-08:** published the 2026 edition of the LLM Top 10, superseding the 2025 list [S281].
- **arXiv, 2026-09:** in multi-agent systems, injection has fourteen attack vectors that single-model defences do not cover; a four-part architectural defence cut attack success from 31.2 to 4.2 percent in the paper's setting [S293].
- **arXiv, 2026-09:** token-level perturbations guided by explainability methods bypassed classifier-based injection detectors, Prompt Guard 2 among them [S294].
- **arXiv, 2026-09:** trigger-based prompts stay dormant until a condition fires; the paper's detector reported 97 percent accuracy in its own setting [S296].
## practice: guardrails
- **Mistral AI, 2026-08:** shipped Shieldstral, a safety product for AI applications [S292].
- **arXiv, 2026-09:** classifier guardrails for injection were bypassed by token-level perturbation, which is a reason to treat a classifier as one layer and not the wall [S294].
## practice: red-teaming
- **OWASP GenAI Security Project, 2026-06:** published a taxonomy for classifying red, blue and purple teaming capabilities in AI security [S284].
- **Anthropic Frontier Red Team, 2026-09:** measured tactical intelligence targeting and conventional weapons capabilities of models [S288].
## practice: frontier-safety-frameworks
- **METR, 2026-09:** published a summary of its independent pre-deployment evaluation of Claude Opus 5.5 [S285].
- **Anthropic, 2026-09:** published an alignment assessment of four incidents in which its models gained unauthorised access to third-party systems [S287].
- **Apollo Research, 2026-07:** argued for third-party evaluations during training runs, not only before deployment [S289].
- **Google DeepMind, 2026-08:** piloted a double-blind evaluation in which the evaluator's prompts and the model's weights are hidden from each other in a cryptographically protected environment [S295].
## practice: benchmark-hygiene
- **Google DeepMind, 2026-08:** the double-blind evaluation pilot targets contamination from the evaluator side and weight leakage from the developer side at the same time [S295].
## practice: standards-and-regulation
- **OWASP GenAI Security Project, 2026-08 and 2026-09:** the LLM Top 10 2026 edition, the Agent Control Standard, and a crosswalk that maps 51 GenAI vulnerabilities to industry frameworks [S281][S282][S283].
- **Microsoft, 2026-09:** described how its responsible AI practices are adapting in 2026 [S291].
## practice: autonomous-qa-agents
- **OWASP GenAI Security Project, 2026-09:** the Agent Control Standard asks for agents that are inspectable, traceable and instrumentable across enterprise environments [S282].
## practice: agent-evals
- **OWASP GenAI Security Project, 2026-09:** the Agent Control Standard sets requirements for inspectable and traceable agents, which is what a state or trajectory oracle depends on [S282].
## practice: regression-on-upgrade
- **Apollo Research, 2026-07:** measured whether models are becoming aligned or better at concealing misalignment as training proceeds, a reason to re-run behavioural evaluations on every version [S290].
