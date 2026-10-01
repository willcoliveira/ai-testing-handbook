---
id: test-an-mcp-server
title: Test an MCP server
sources: [S123, S356, S357, S358, S359, S360, S361, S362, S364, S366, S369, S371, S374, S376, S377, S379, S381, S382, S384, S386]
last_reviewed: 2026-10-01
---

# Test an MCP server

## When
You build or adopt an MCP server, add one to an agent's configuration, or are asked in an
interview how you would test one. Also when an agent misbehaves and an MCP tool is in its trace.

## What
A suite in four layers: protocol contract tests with no model, run in CI; a tool-quality set
that measures whether a model picks the right tool with the right arguments; a security suite
built around a malicious test server; and tracing for MCP calls. Plus a pinned record of every
tool definition so a change is detected.

## Why
An MCP server is an API, a prompt and an attack surface at once. Contract tests catch broken
schemas and transports. Only a model in the loop shows whether descriptions lead to the right
calls, which Anthropic found mattered enough to move its eval results [S377]. Only adversarial
tests show whether planted instructions in descriptions or results are followed: tool poisoning
succeeded 72.8 percent of the time against one model in MCPTox [S371], and a trusted server can
still carry an injection that leaks data [S366].

## How
1. **Inventory and pin.** List every server the host loads, its transport, its spec revision,
   and every tool definition. Hash each definition and store the hashes; any change fails a check
   until reviewed [S369]. Note the revision: 2026-07-28 removed `initialize` and sessions and
   requires `server/discover` [S356].
2. **Contract tests (every commit, no model).**
   - discovery: `server/discover` answers with versions and capabilities [S356];
   - `tools/list` returns every tool in a stable order with a valid `inputSchema` [S357][S356];
   - each tool: valid input returns a result matching `outputSchema`; invalid input is rejected;
     a domain failure returns `isError: true` with a message a model can act on; an unknown tool is
     a protocol error [S357];
   - transport: stdio writes only MCP messages to stdout [S358]; HTTP rejects a bad `Origin` with
     403 and binds locally to 127.0.0.1 [S359];
   - auth, if used: wrong-audience and expired tokens refused, 401 on invalid, no passthrough [S360].
   Drive them with the Inspector CLI (one method per run, JSON output, exit code 5 on a tool error)
   [S362] or promptfoo's `mcp` provider [S381].
3. **Tool-quality set (every description or tool change).** 30 to 50 user intents, each with the
   expected tool and key arguments, including near-misses between similar tools. Load all servers
   the host will load. Run each intent five times; report tool accuracy, argument accuracy and
   call count. Grade the four failure modes: wrong tool, wrong parameters, too few calls, response
   mishandled [S377]. DeepEval's MCP use metric judges primitives and arguments [S379]; promptfoo
   records calls on `metadata.toolCalls` for deterministic routing assertions [S381].
4. **Security suite (before release and on a schedule).** Add a test server you control that
   misbehaves on purpose, then assert on actions:
   - a tool description with a hidden instruction (for example to read a key file and pass it as
     an argument): the agent does not comply [S364];
   - the same tool's description changed after first listing: the pinning check fails [S369];
   - a description that tries to redirect another server's tool: the other tool's calls are
     unchanged [S364];
   - a tool result containing an instruction to send data elsewhere: no send call follows [S366];
   - the spec's own threats where they apply: confused deputy, token passthrough, SSRF [S361].
   promptfoo's MCP plugin generates related attacks [S382]. Grade blind to the condition [S376].
5. **Host limits.** Assert the agent can call only allowed tools, and that a removed permission
   really blocks a call (in Claude's SDK, MCP tools need explicit permission [S386]). If the agent
   has private data, untrusted content and an outbound channel together, redesign before you test
   [S123].
6. **Trace.** Emit MCP spans per the OpenTelemetry conventions (`{mcp.method.name} {target}`,
   trace context in `params._meta`, `error.type` on `isError`) and record per-tool latency and
   error rate [S384].
7. **Use scanners as leads.** Run a scanner over configurations, then confirm each finding by
   hand; scanner alerts were under half true positives in a large study [S374].

MCP test plan template:

```
servers: <name> (<transport>, spec <revision>, <n> tools), ... ; definition hashes stored: yes
contract (CI, no model): discover, tools/list order and schemas, per-tool valid/invalid/isError,
  transport rules, auth rules; runner: inspector --cli | promptfoo mcp provider
tool quality: <n> intents x 5 runs, all servers loaded; tool acc <x>, arg acc <y>, near-miss set <k>
security: malicious test server with poisoning, rug pull, shadowing, result injection;
  no-follow and no-exfiltration assertions; blind grading; pin check
host limits: allowed tools <list>; denied tool really blocked: yes
tracing: MCP spans and duration metrics; per-tool p95 <s>, error rate <r>
```

## Done when
Every tool definition is pinned; contract tests run in CI without a model; a tool-quality set with
repeated runs reports tool and argument accuracy with all servers loaded; a malicious test server
exercises poisoning, rug pull, shadowing and result injection with assertions on actions; denied
tools are proven unavailable; and MCP calls appear as spans with latency and errors.

## Related
Practices: [mcp-testing](../practices/4-agents-and-systems/mcp-testing.md),
[tool-use-evals](../practices/4-agents-and-systems/tool-use-evals.md),
[prompt-injection](../practices/5-safety-and-security/prompt-injection.md),
[red-teaming](../practices/5-safety-and-security/red-teaming.md),
[genai-tracing](../practices/6-observability/genai-tracing.md).
Playbooks: [07 Test guardrails and safety](07-test-guardrails-and-safety.md),
[13 Debug a multi-agent orchestration](13-debug-a-multi-agent-orchestration.md),
[14 Test a backend-only chatbot](14-test-a-backend-chatbot.md).
