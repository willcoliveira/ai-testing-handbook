<!-- applied: 2026-10-12 -->
## practice: guardrails
- **NVIDIA, 2026-09:** OpenShell 0.1.0 enforces agent permissions outside the agent: a Supervisor inspects HTTP, GraphQL and MCP requests, can allow a read while blocking a write to the same API, and logs decisions to an audit trail; real credentials are substituted only for authorised endpoints, and policy changes an agent proposes wait for human review; NVIDIA reports that frontier agents with reduced safeguards spent up to two hours trying to persuade an AI reviewer to grant write access and no protected repository writes occurred, without giving the test setup [S426].
## practice: rubrics-and-pairwise
- **arXiv, 2026-10:** comparing 10 reasoning models as judges on rating and classification tasks, the rating scale shifted measured bias by up to 0.93 points on a 1-7 scale, detailed prompts cut leniency by 28.9 percentage points, and switching the judge model moved leniency by up to 56.1 percentage points [S427].
## practice: judge-calibration
- **arXiv, 2026-10:** an audit of six frontier LLM judges across four benchmarks, five prompt formats, two presentation orders, three temperatures and ten repetitions per condition found the most deterministic judge agreed with ground truth only 51 percent of the time, and proposes a trustworthy verdict rate combining reproducibility, order invariance and accuracy [S429].
## practice: agent-evals
- **arXiv, 2026-10:** RH-Detect unifies reward-hacking data from eleven public datasets into 5,021 evaluation units; the best of six off-the-shelf detectors reached a pooled AUROC of 0.962, but the four strongest were 10.7 to 15.9 percentage points less accurate on the multi-turn tool-use sources MALT and TRACE [S428].
