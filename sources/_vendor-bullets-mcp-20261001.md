<!-- applied: 2026-10-01 -->
## practice: tool-use-evals
- **Anthropic, 2025-09:** evaluates its tools with held-out task sets and grades four failure modes: the wrong tool, the right tool with wrong parameters, too few calls, and mishandled responses; it reports that tool naming and namespacing changed its eval results [S377].
- **arXiv, 2025-08:** MCP-Universe benchmarks agents on 11 real MCP servers with execution-based evaluators; the best model reached 43.72 percent [S373].
## practice: prompt-injection
- **Invariant Labs, 2025-04 and 2025-05:** tool poisoning hides instructions in MCP tool descriptions, and a malicious public GitHub issue read through a trusted MCP server led an agent to leak private repositories [S364][S366].
- **arXiv, 2025-08:** MCPTox measured tool poisoning on 45 real MCP servers and found attack success of 72.8 percent for one model, with more capable models often more susceptible [S371].
## practice: red-teaming
- **promptfoo, living:** an MCP red-team plugin covers tool metadata injection, parameter injection, excessive function calling and privilege escalation, with a guide for multi-server poisoning scenarios [S382][S383].
## practice: genai-tracing
- **OpenTelemetry, 2026-10:** MCP semantic conventions name spans `{mcp.method.name} {target}`, propagate trace context in `params._meta`, and set `error.type` when a tool result has `isError` [S384].
