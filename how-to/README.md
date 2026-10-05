# How to: the playbooks

The practices say what a thing is and who does it. The patterns show it done once. These
playbooks say **when** to do it, **what** you produce, **why** it matters, and **how**, step by
step, with templates. Read them in order the first time; after that, start from the table.

| You have | Go to |
|---|---|
| a new LLM feature, agent, or an inherited system, and no test map | [01 Decide what to test](01-decide-what-to-test.md) |
| a system and no evaluation data | [02 Build a golden set](02-build-a-golden-set.md) |
| cases but no way to say pass or fail | [03 Write criteria and rubrics](03-write-criteria-and-rubrics.md) |
| criteria but nothing that applies them | [04 Build an evaluator](04-build-an-evaluator.md) |
| an evaluator you have not proven | [05 Calibrate the evaluator](05-calibrate-the-evaluator.md) |
| a question like "is version B better" or "is it fast enough" | [06 Benchmark your system](06-benchmark-your-system.md) |
| a guardrail, a safety requirement, or a regulated keyword | [07 Test guardrails and safety](07-test-guardrails-and-safety.md) |
| a suite and no idea where it should run | [08 Wire the gates](08-wire-the-gates.md) |
| a system to sign off, a suite to trust, or a model to audit | [09 Audit](09-audit.md) |
| a model version change or a deprecation notice | [10 Run a model upgrade](10-run-a-model-upgrade.md) |
| results and a reader | [11 Report results](11-report-results.md) |
| a green suite and a feeling it is measuring the wrong thing | [12 Run an exploratory session](12-run-an-exploratory-session.md) |
| an orchestrator and subagents that fail and nobody can say which one | [13 Debug a multi-agent orchestration](13-debug-a-multi-agent-orchestration.md) |
| a chatbot that exists only as an API | [14 Test a backend-only chatbot](14-test-a-backend-chatbot.md) |
| an MCP server to build, adopt or connect to an agent | [15 Test an MCP server](15-test-an-mcp-server.md) |
| a cheaper model proposed to replace, gate or sit in front of a slow evaluation step | [16 Add a decision model to a testing workflow](16-add-a-decision-model-to-a-testing-workflow.md) |
| an assistant that answers from documents through retrieval, or a RAG demo with a table of judge scores | [17 Test a RAG application](17-test-a-rag-application.md) |

Each playbook has six sections: When (the trigger), What (the artefact you leave behind), Why
(what goes wrong without it), How (numbered steps and templates), Done when (exit criteria you can
check), Related (practices, patterns, tools). Every step that rests on a source cites it.

The order is not accidental. Deciding what to test comes before data, data before criteria,
criteria before evaluators, evaluators before calibration, and calibration before any number is
reported. Benchmarking, guardrails and gates use all of the above. Auditing checks that the above
was done honestly. Upgrades and reports are what you do repeatedly once the rest exists. An
exploratory session is how you find what none of it measures.
