---
id: mcp-testing
title: MCP testing
area: 4-agents-and-systems
status: draft
last_reviewed: 2026-10-01
sources: [S123, S136, S355, S356, S357, S358, S359, S360, S361, S362, S363, S364, S365, S366, S367, S368, S369, S371, S372, S373, S374, S375, S376, S377, S378, S379, S381, S382, S383, S384, S385, S386]
related: [tool-use-evals, agent-evals, prompt-injection, red-teaming, genai-tracing, harnesses]
---

# MCP testing

## What
The Model Context Protocol connects an AI application (the host and its clients) to servers that
expose tools, resources and prompts over JSON-RPC 2.0 [S355]. Testing MCP is three jobs. First,
the server as an API: does it honour the protocol contract and its own schemas. Second, the server
as a prompt: are its tool names and descriptions good enough that a model picks the right tool with
the right arguments. Third, the server as an attack surface: tool descriptions and tool results
are untrusted input that reaches the model, so a server can be the attacker or the attacker's
channel. The spec states the trust rule directly: tool annotations are untrusted unless they come
from a trusted server [S357].

## Why
MCP turns every third-party tool into text the model reads. Invariant Labs showed that
instructions hidden in a tool description, "invisible to users but visible to AI models", can steer
an agent, and that "a malicious server can change the tool description after the client has
already approved it" [S364]. Trusted servers are not safe either: a malicious GitHub issue read
through the official GitHub server led an agent to leak private repositories, which Invariant
calls "a fundamental architectural issue" at the agent level [S366]. Benchmarks put numbers on it:
MCPTox found attack success of 72.8 percent for one model across 45 real servers, with more capable
models often more susceptible [S371]. Function testing alone misses all of this, and security
scanning alone is not enough: a study of 64,611 servers found that under half of sampled scanner
alerts were true positives [S374]. The trade-off: MCP testing needs a model in the loop for the
second and third jobs, which brings back non-determinism and cost.

## How
1. **Pin the protocol version you test against.** The current spec is 2026-07-28. It removed the
   `initialize` handshake and protocol-level sessions, made requests stateless with capabilities
   per request, added a required `server/discover`, and deprecated roots, sampling and logging
   [S356]. A server built for 2025-11-25 behaves differently; record which revision each test
   expects.
2. **Contract tests, no model.** For each tool: it appears in `tools/list` (in a deterministic
   order [S356]); `inputSchema` is a valid JSON Schema object; a valid call returns a result that
   conforms to `outputSchema` when one is declared; an unknown tool or malformed request is a
   protocol error; a failing operation returns a tool result with `isError: true` and an actionable
   message [S357]. Per transport: on stdio nothing but MCP messages on stdout [S358]; on Streamable
   HTTP an invalid `Origin` gets 403 and a local server binds to 127.0.0.1 [S359]. If the server
   uses authorization: tokens for another audience are rejected, an expired token gets 401, and
   no token is passed through [S360].
3. **Run them in CI.** The MCP Inspector's CLI runs one method and exits, emits JSON, and maps
   failures to stable exit codes (5 for a tool error or a missing tool) [S362]. promptfoo's `mcp`
   provider calls tools directly and records each call on `metadata.toolCalls` so assertions can
   check routing [S381].
4. **Tool quality, with a model.** Write a golden set of user intents with the expected tool and
   arguments. Measure tool choice and argument accuracy over several runs. Anthropic lists the
   failure modes to grade: the wrong tool, the right tool with wrong parameters, too few calls,
   and mishandled responses; it also reports that naming and namespacing changed its eval results
   and recommends held-out test sets [S377]. DeepEval scores MCP use (primitives and arguments
   chosen against those available) and MCP task completion per interaction [S378][S379]. Test with
   every server the host will load, because the model sees all of their descriptions at once [S369].
5. **Security tests.** Put a malicious test server in the suite and assert on behaviour, not text:
   - tool poisoning: a description carries a hidden instruction; the agent must not follow it [S364];
   - rug pull: the description changes after approval; the client must detect it (pin definitions
     by hash and alert on change [S369]);
   - shadowing: one server's description tries to change how another server's tool is used [S364];
   - indirect injection through results: a tool result or fetched content carries an instruction;
     no exfiltration call may follow [S366];
   - the protocol risks from the spec's security page: confused deputy, token passthrough, SSRF,
     state handle hijacking [S361].
   promptfoo's red-team plugin and guide cover tool metadata injection, parameter injection and
   cross-server scenarios [S382][S383]. Grade attack outcomes blind to the condition: one study
   relabelled 58 "attack" results as authorised benign completions on a treatment-blind regrade
   [S376].
6. **Least privilege in the host.** Expose only the tools an agent needs (OpenAI's SDK has tool
   filters and per-tool approval [S385]; Claude's SDK requires explicit permission for MCP tools
   and does not auto-approve them in accept-edits mode [S386]). Test that a denied tool is really
   unavailable. If an agent combines private data, untrusted content and a way to send data out,
   treat it as unsafe by construction [S123].
7. **Trace MCP calls.** The OpenTelemetry MCP conventions name spans `{mcp.method.name} {target}`,
   propagate trace context in `params._meta`, and set `error.type` when a tool result has
   `isError` [S384]. The span tree then shows which server and which tool a failure came from.

| Layer | Needs a model | Typical check | Gate |
|---|---|---|---|
| Protocol contract | no | schemas, errors, transport rules, auth | every commit |
| Tool quality | yes | tool and argument accuracy over N runs | every description or tool change |
| Security | yes | no planted instruction followed, no exfiltration, rug pull detected | before release, on schedule |
| Operations | no | latency per tool, error rate, traces | continuous |

## Who does it (sourced)
- **Model Context Protocol project, 2026-07:** the 2026-07-28 specification makes requests stateless, requires `server/discover`, and tells clients to treat tool annotations as untrusted and get user consent before invoking tools [S355][S356][S357]. Anthropic donated MCP to the Agentic AI Foundation under the Linux Foundation in December 2025 [S363].
- **Model Context Protocol project, living:** the MCP Inspector is "the reference developer tool for testing and debugging MCP servers", with a CLI built for CI [S362].
- **Invariant Labs, 2025-04 and 2025-05:** disclosed tool poisoning, rug pulls and tool shadowing, demonstrated exfiltration through WhatsApp and GitHub MCP setups, and released mcp-scan to detect poisoned descriptions and changed tools [S364][S365][S366][S367].
- **OWASP, 2025-11 and living:** the MCP Security Cheat Sheet lists tool poisoning, rug pulls, shadowing, confused deputy and supply chain risks and recommends hashing tool definitions [S369].
- **Anthropic, 2025-09:** evaluates its tools with held-out task sets and reports that refining tool descriptions moved SWE-bench Verified results [S377].
- **promptfoo, living:** an MCP provider for testing servers directly and an MCP red-team plugin [S381][S382].
- **OpenAI, living:** the Agents SDK filters which MCP tools an agent sees, can require approval per tool, and traces tool listing and MCP tool calls [S385].
- **Confident AI, living:** DeepEval MCP use and MCP task completion metrics [S378][S379].
- **OpenTelemetry, living:** MCP semantic conventions for client and server spans and duration metrics [S384].
- **arXiv, 2025-08:** MCPSecBench identifies 17 attack types across four surfaces and finds current protections under 30 percent average success [S372]; MCP-Universe benchmarks agents on 11 real servers with execution-based evaluators [S373].

## Pitfalls
1. Testing only the code. A server can pass every contract test and still be the channel for an injection that leaks data, because the flaw is in what the agent does with the text [S366].
2. Trusting a description once approved. Descriptions can change after approval [S364]; pin and compare them [S369].
3. Testing one server alone. Cross-server attacks and tool confusion appear only when servers are loaded together [S369].
4. Relying on a scanner verdict. Scanner alerts were under half true positives in a large study [S374]; treat them as leads, not results.
5. A prompt-level guardrail as the defence. One study found prompt guardrails can be counterproductive against description poisoning [S375]; enforce limits in the host's permissions.
6. Tests written for the old lifecycle. Initialize-based session tests do not apply to 2026-07-28 servers [S356].
7. Grading attacks with a judge that knows the condition. Treatment leakage inflates attack labels [S376].

## Pattern from a production build
None yet.

## Sources
- [S123] The lethal trifecta for AI agents, Simon Willison, 2025-06-16.
- [S136] Semantic Conventions for Generative AI, OpenTelemetry, living.
- [S355] Model Context Protocol specification 2026-07-28, MCP project, 2026-07-28.
- [S356] Key changes in 2026-07-28, MCP project, 2026-07-28.
- [S357] Tools, MCP specification 2026-07-28.
- [S358] stdio transport, MCP specification 2026-07-28.
- [S359] Streamable HTTP transport, MCP specification 2026-07-28.
- [S360] Authorization, MCP specification 2026-07-28.
- [S361] Security Best Practices, MCP docs 2026-07-28.
- [S362] MCP Inspector, MCP project, living.
- [S363] MCP joins the Agentic AI Foundation, MCP project, 2025-12-09.
- [S364] MCP Security Notification: Tool Poisoning Attacks, Invariant Labs, 2025-04-01.
- [S365] WhatsApp MCP Exploited, Invariant Labs, 2025-04-07.
- [S366] GitHub MCP Exploited, Invariant Labs, 2025-05-26.
- [S367] Introducing MCP-Scan, Invariant Labs, 2025-04-11.
- [S368] Model Context Protocol has prompt injection security problems, Simon Willison, 2025-04-09.
- [S369] MCP Security Cheat Sheet, OWASP, living.
- [S371] MCPTox, arXiv 2508.14925, 2025-08-19.
- [S372] MCPSecBench, arXiv 2508.13220, 2025-08-17.
- [S373] MCP-Universe, arXiv 2508.14704, 2025-08-20.
- [S374] Rethinking MCP Security, arXiv 2607.11086, 2026-07-13.
- [S375] When the Manual Lies, arXiv 2605.24069, 2026-05-22.
- [S376] Labels Are Not Endpoints, arXiv 2608.12880, 2026-08-13.
- [S377] Writing effective tools for AI agents, Anthropic, 2025-09-11.
- [S378] MCP evaluation, DeepEval, living.
- [S379] MCP Use metric, DeepEval, living.
- [S381] MCP Provider, promptfoo, living.
- [S382] MCP Plugin, promptfoo, living.
- [S383] MCP Security Testing Guide, promptfoo, living.
- [S384] Semantic conventions for MCP, OpenTelemetry, living.
- [S385] Model context protocol, OpenAI Agents SDK, living.
- [S386] Connect to external tools with MCP, Claude Agent SDK, living.
