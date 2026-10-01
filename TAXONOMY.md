# Taxonomy: a map of AI quality

Eight areas. For the step-by-step procedures, see [how-to/](how-to/README.md). Each sub-area names the practice file that owns it and the three questions an
engineer should be able to answer after reading it. Two hops from any question to the practice.

## 1. Capability evaluation. How good is the model, and can I trust the number?

| Sub-area | Practice | After reading, you can answer |
|---|---|---|
| Public benchmarks and leaderboards | [capability-benchmarks](practices/1-capability/capability-benchmarks.md) | What does each headline benchmark measure? How is it graded? Which ones are saturated? |
| Statistical treatment | [statistical-treatment-of-evals](practices/1-capability/statistical-treatment-of-evals.md) | How wide is the error bar on that score? When is a difference real? How many samples do I need? |
| Benchmark hygiene | [benchmark-hygiene](practices/1-capability/benchmark-hygiene.md) | How does contamination happen? How are leaderboards gamed? What makes a benchmark trustworthy? |

## 2. Application evals. Does my product do its job on my distribution?

| Sub-area | Practice | After reading, you can answer |
|---|---|---|
| Eval-driven development | [eval-driven-development](practices/2-application-evals/eval-driven-development.md) | What is the loop? What goes in the first eval set? How do evals relate to unit tests? |
| Golden datasets | [golden-datasets](practices/2-application-evals/golden-datasets.md) | Where do cases come from? How big? How do I keep a held-out set honest? |
| Criteria authoring | [criteria-authoring](practices/2-application-evals/criteria-authoring.md) | What makes a criterion gradeable? Why do phrase-locked criteria break? When is verbatim right? |
| Non-determinism and pass rates | [non-determinism-and-pass-rates](practices/2-application-evals/non-determinism-and-pass-rates.md) | How many runs? What do I gate on? How do I detect a silent model change? |
| CI gates for LLM apps | [ci-gates-for-llm-apps](practices/2-application-evals/ci-gates-for-llm-apps.md) | What runs per PR, nightly, manually? What must never gate? How do I keep the gate trusted? |
| Offline probes | [offline-probes](practices/2-application-evals/offline-probes.md) | How do I test model-adjacent code against real configuration without a model call? |

## 3. Judging and scoring. Who decides pass or fail, and how do I know the judge is right?

| Sub-area | Practice | After reading, you can answer |
|---|---|---|
| LLM-as-judge | [llm-as-judge](practices/3-judging/llm-as-judge.md) | When is a model judge appropriate? What prompt shape? What are its known biases? |
| Judge calibration | [judge-calibration](practices/3-judging/judge-calibration.md) | How do I measure agreement with humans? What agreement is enough? How often to recalibrate? |
| Human annotation | [human-annotation](practices/3-judging/human-annotation.md) | How do I run a labelling pass? How do I resolve disagreement? What does a label cost? |
| Rubrics and pairwise | [rubrics-and-pairwise](practices/3-judging/rubrics-and-pairwise.md) | Binary or Likert? Pointwise or pairwise? How do I write a rubric a grader can apply? |

## 4. Agents and systems. How do I test something that acts, over many turns, with tools?

| Sub-area | Practice | After reading, you can answer |
|---|---|---|
| Agent evals | [agent-evals](practices/4-agents-and-systems/agent-evals.md) | Outcome or transcript? How do I assert on state? What do agent benchmarks actually measure? |
| Harnesses | [harnesses](practices/4-agents-and-systems/harnesses.md) | What is an eval harness? Which ones exist? How do I pick one? |
| Orchestrators and simulators | [orchestrators-and-simulators](practices/4-agents-and-systems/orchestrators-and-simulators.md) | When does a simulated user help? When does it double the noise? What is agent-to-agent testing good for? |
| Tool-use evals | [tool-use-evals](practices/4-agents-and-systems/tool-use-evals.md) | How do I test function calling without a model? What is a trajectory assertion? |
| Voice agents | [voice-agent-testing](practices/4-agents-and-systems/voice-agent-testing.md) | What is different about voice? What can text harnesses not reach? What are the latency budgets? |
| Load and latency | [load-and-latency](practices/4-agents-and-systems/load-and-latency.md) | What does a load test prove about an LLM app? What do I stub? What do I gate? |
| Exploratory testing of agents | [exploratory-testing-of-agents](practices/4-agents-and-systems/exploratory-testing-of-agents.md) | How do I run a session against a probabilistic system? What is the evidence standard? |
| MCP testing | [mcp-testing](practices/4-agents-and-systems/mcp-testing.md) | How do I test an MCP server? What are tool poisoning and rug pulls? What changed in the 2026-07-28 spec? |
| Mutation checking | [mutation-checking](practices/4-agents-and-systems/mutation-checking.md) | Where does mutation testing apply around a model? What does a surviving mutant mean? |

## 5. Safety, security and guardrails. What must it never do, and how do I prove it will not?

| Sub-area | Practice | After reading, you can answer |
|---|---|---|
| Frontier safety frameworks | [frontier-safety-frameworks](practices/5-safety-and-security/frontier-safety-frameworks.md) | What do the labs say they run before a release? What is a system card? What is not public? |
| Red teaming | [red-teaming](practices/5-safety-and-security/red-teaming.md) | Automated or human? What tools? How do I turn findings into regression cases? |
| Prompt injection | [prompt-injection](practices/5-safety-and-security/prompt-injection.md) | What is the threat model? What is the lethal trifecta? How do I test boundaries? |
| Guardrails | [guardrails](practices/5-safety-and-security/guardrails.md) | Where do guardrails belong? Managed filters, classifiers, prompt rules: which for what? |
| False-positive protection | [false-positive-protection](practices/5-safety-and-security/false-positive-protection.md) | Why is an over-blocking guardrail a defect? How do I write must-not-block cases? |
| Regulated-domain checks | [regulated-domain-checks](practices/5-safety-and-security/regulated-domain-checks.md) | What is verbatim by law? How do I test opt-out and consent across every state? |

## 6. Observability and production feedback. What happened in production, and did quality move?

| Sub-area | Practice | After reading, you can answer |
|---|---|---|
| GenAI tracing | [genai-tracing](practices/6-observability/genai-tracing.md) | What are the OpenTelemetry GenAI conventions? What goes on a span? Where do LLM traces go? |
| Online evals and drift | [online-evals-and-drift](practices/6-observability/online-evals-and-drift.md) | How do I sample production? What do I score online? What alerts on drift? |
| Redaction in telemetry | [redaction-in-telemetry](practices/6-observability/redaction-in-telemetry.md) | Where does PII or PHI leak in a trace pipeline? What must be redacted before export? |

## 7. Training and model lifecycle. What changes when the model changes, and how do labs gate that?

| Sub-area | Practice | After reading, you can answer |
|---|---|---|
| Post-training evals | [post-training-evals](practices/7-training-and-lifecycle/post-training-evals.md) | What are SFT, RLHF, DPO and RL with verifiable rewards? What is evaluated at each stage? |
| Fine-tuning evals | [fine-tuning-evals](practices/7-training-and-lifecycle/fine-tuning-evals.md) | How do I know a fine-tune beat the base model and a prompt? What is held out? |
| Regression on upgrade | [regression-on-upgrade](practices/7-training-and-lifecycle/regression-on-upgrade.md) | What do I run before switching model versions? How do I pin? What do deprecations mean? |
| Data contamination | [data-contamination](practices/7-training-and-lifecycle/data-contamination.md) | How does eval data leak into training? How do I detect it? How do I keep my set clean? |

## 8. Governance and process. Who signs off, and what counts as validated?

| Sub-area | Practice | After reading, you can answer |
|---|---|---|
| Human in the loop | [human-in-the-loop](practices/8-governance/human-in-the-loop.md) | Where does a human sit? What does "agents propose, humans merge" mean in practice? |
| AI-generated tests | [ai-generated-tests](practices/8-governance/ai-generated-tests.md) | When is a generated test validated? How does it graduate into the trusted suite? |
| Autonomous QA agents | [autonomous-qa-agents](practices/8-governance/autonomous-qa-agents.md) | What caps and no-go layers? What is the charter? What may it never touch? |
| Model and system cards | [model-and-system-cards](practices/8-governance/model-and-system-cards.md) | What is in a model card, a system card, a datasheet? How do I read one? |
| Standards and regulation | [standards-and-regulation](practices/8-governance/standards-and-regulation.md) | What do NIST, ISO 42001, the EU code of practice and OWASP ask for? |
