<!-- applied: 2026-09-30 -->
## practice: agent-evals
- **Anthropic, 2025-06:** its multi-agent research system evaluates "whether it achieved the correct final state" and breaks long runs into checkpoints where specific state changes should have occurred; the post says full production tracing let the team diagnose why agents failed [S322].
## practice: orchestrators-and-simulators
- **Anthropic, 2026-09:** in the Claude Agent SDK a subagent's intermediate tool calls stay inside it and only its final message returns to the parent; transcripts are stored per subagent, and depth, concurrency and budget are capped [S326].
- **LangChain, 2026-09:** LangGraph checkpoints graph state at each super-step under a thread id, lists the history, and can re-run from a prior checkpoint, re-executing later nodes including LLM and API calls [S325].
## practice: genai-tracing
- **OpenTelemetry, 2026-09:** the agent span conventions add `invoke_workflow` for multi-agent processes, reported even when nested, with `gen_ai.agent.id` and `gen_ai.conversation.id` for correlation [S323].
- **OpenAI, 2026-09:** the Agents SDK nests agent, generation, function, handoff and guardrail spans under a trace, links traces of one conversation with `group_id`, and accepts custom trace processors [S324].
- **LangChain, 2026-09:** LangSmith treats a run as a span, binds runs to a trace id, caps a trace at 25,000 runs, and groups traces into threads with a `thread_id` [S327].
## practice: red-teaming
- **Microsoft Research, 2024-04:** Crescendo is a multi-turn jailbreak that starts benign and gradually escalates; the paper reports high attack success across the evaluated models and an automated version, Crescendomation [S344].
## practice: load-and-latency
- **Anthropic, 2026-09:** the latency guide defines time to first token and says streaming improves perceived responsiveness; the prompt caching docs say a prompt below the minimum length is processed without caching and without an error, and usage fields show whether a request hit the cache [S341][S342].
- **OpenAI, 2026-09:** the latency guide lists seven principles and says halving output tokens may cut about half the latency while halving the prompt may give 1 to 5 percent [S343].
- **Locust, 2026-09:** load scenarios are plain Python user classes, one per type of user, run headless with a user count and spawn rate [S345].
## practice: ci-gates-for-llm-apps
- **Anthropic and OpenAI, 2026-09:** both structured-output docs guarantee schema adherence but name the exceptions: a refusal can take precedence over the schema, and a response cut off at the token limit may not match it [S346][S347].
