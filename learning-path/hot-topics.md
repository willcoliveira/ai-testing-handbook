# Hot topics: what QA communities discuss about testing AI

This page counts the topics that come up in QA community posts about testing AI and LLM systems,
and shows where the handbook covers each one. `/pulse` reads recent posts on dev.to, Ministry of
Testing and Hacker News and updates the page. Posts are a signal of what people ask about, not a
source: the page keeps no usernames, quotes or links to posts, and no claim in the handbook cites
one. A gap here becomes a proposal, covered later from primary sources.

**Basis:** 2026-10-08 to 2026-11-07. Posts kept: dev.to 12 of 30 (testing tag, top of week and
month, main feed only), Ministry of Testing 5 (search, creation dates), Hacker News 30 (search by
date, capped; about 11 more relevant stories, mostly on hallucination, were left out by the cap).
Classified from titles and short excerpts, not full posts. Ministry of Testing posts in the window
were about using AI in testing work; none was about testing an AI system.

## Topics

Counts are posts per topic per source in the window; a post can count under more than one topic.
Coverage is `covered` (a page answers it), `partial` (a page touches it) or `gap` (no page yet).

| Topic | dev.to | MoT | HN | Total | Coverage | Handbook page |
|---|---|---|---|---|---|---|
| T1 Benchmarks and benchmark validity | 1 | 0 | 16 | 17 | covered | [capability benchmarks](../practices/1-capability/capability-benchmarks.md), [benchmark hygiene](../practices/1-capability/benchmark-hygiene.md) |
| T2 Agent testing (tools, multi-step) | 2 | 0 | 14 | 16 | covered | [agent evals](../practices/4-agents-and-systems/agent-evals.md), [tool-use evals](../practices/4-agents-and-systems/tool-use-evals.md) |
| T3 LLM-as-judge and eval metrics | 3 | 0 | 3 | 6 | covered | [LLM as judge](../practices/3-judging/llm-as-judge.md), [judge calibration](../practices/3-judging/judge-calibration.md) |
| T4 Safety and alignment evaluation | 0 | 0 | 4 | 4 | covered | [frontier safety frameworks](../practices/5-safety-and-security/frontier-safety-frameworks.md) |
| T5 Red teaming and prompt injection | 2 | 0 | 1 | 3 | covered | [red teaming](../practices/5-safety-and-security/red-teaming.md), [prompt injection](../practices/5-safety-and-security/prompt-injection.md) |
| T6 Observability and evals on production traffic | 1 | 0 | 2 | 3 | covered | [GenAI tracing](../practices/6-observability/genai-tracing.md), [online evals and drift](../practices/6-observability/online-evals-and-drift.md) |
| T7 AI-generated tests | 2 | 0 | 0 | 2 | covered | [AI-generated tests](../practices/8-governance/ai-generated-tests.md), [playbook 18](../how-to/18-generate-tests-from-manual-cases.md) |
| T8 Regressions when the model or prompt changes | 1 | 0 | 1 | 2 | covered | [regression on upgrade](../practices/7-training-and-lifecycle/regression-on-upgrade.md) |
| T9 Eval-to-production gap (what a passing eval does not prove) | 1 | 0 | 1 | 2 | partial | [online evals and drift](../practices/6-observability/online-evals-and-drift.md) |
| T10 AI-drafted bug reports | 0 | 2 | 0 | 2 | gap | none |
| T11 Hallucination detection | 1 | 0 | 0 | 1 | partial | [RAG evals](../practices/2-application-evals/rag-evals.md) |
| T12 RAG evaluation | 1 | 0 | 0 | 1 | covered | [RAG evals](../practices/2-application-evals/rag-evals.md) |
| T13 Deciding what counts as a correct output | 1 | 0 | 0 | 1 | covered | [criteria authoring](../practices/2-application-evals/criteria-authoring.md) |
| T14 Agent memory and state drift | 1 | 0 | 0 | 1 | partial | [side effects and state](../practices/4-agents-and-systems/side-effects-and-state.md) |
| T15 Experiments versus regression suites | 1 | 0 | 0 | 1 | covered | [eval-driven development](../practices/2-application-evals/eval-driven-development.md) |
| T16 Evals in CI | 0 | 0 | 1 | 1 | covered | [CI gates](../practices/2-application-evals/ci-gates-for-llm-apps.md) |
| T17 AI test automation tools (self-healing, AI in UI tests) | 0 | 0 | 1 | 1 | gap | none |
| T18 Cost of running evals | 0 | 0 | 1 | 1 | partial | [agent evals](../practices/4-agents-and-systems/agent-evals.md) |
| T19 Skills and roles for testers in AI | 0 | 1 | 0 | 1 | covered | [AI QA requirements](ai-qa-requirements.md) |
| T20 AI in requirements analysis | 0 | 1 | 0 | 1 | gap | none |
| T21 Data privacy when testers use AI tools | 0 | 1 | 0 | 1 | partial | [redaction in telemetry](../practices/6-observability/redaction-in-telemetry.md) |

## For the reviewer

Gaps and partial topics from the last run, with what a page would need and where it would go.
These are proposals; any page is written from primary sources.

- T10 AI-drafted bug reports (gap): how to check an AI-written defect report against the session
  it came from (steps, expected and actual, severity). A section in
  [AI-generated tests](../practices/8-governance/ai-generated-tests.md) or a playbook.
- T17 AI test automation tools (gap): what to verify when a tool heals locators or writes UI
  steps (false passes, silent locator drift). A pitfall set in AI-generated tests, or a playbook.
- T20 AI in requirements analysis (gap): one post; watch before writing anything.
- T9 Eval-to-production gap (partial): a How step on why a passing offline eval does not carry to
  production, and evaluation awareness, linking red teaming and online evals.
- T11 Hallucination detection (partial): covered for RAG only; a practice-level page on detecting
  unsupported claims outside retrieval. The Hacker News cap hid most of this topic; raise the cap
  or query it separately next run.
- T14 Agent memory and state drift (partial): side effects covers state, not memory that changes
  meaning over time.
- T18 Cost of running evals (partial): a How step on budgeting eval runs (samples, judge calls).
- T21 Data privacy when testers use AI tools (partial): redaction covers telemetry, not test data
  pasted into AI tools.
