---
id: side-effects-and-state
title: Side effects, retries and state ownership
area: 4-agents-and-systems
status: draft
last_reviewed: 2026-10-14
sources: [S078, S166, S322, S325, S357, S435, S436, S437, S438, S439]
related: [tool-use-evals, agent-evals, harnesses, human-in-the-loop, mcp-testing]
---

# Side effects, retries and state ownership

## What
An agent that writes, books, pays or sends can do it twice. This practice tests three things. First, that an action takes effect once, however many times it is retried, replayed or re-called. Second, that irreversible actions wait for an approval that survives a restart. Third, that the system of record, not the model's context, holds the state the agent acts on. The tool is an idempotency key: "a unique key that the server uses to recognize subsequent retries of the same request" [S436]. The tests are mostly fault injection with no model. A small number of agent eval cases check that the model does not re-issue an action after an ambiguous error.

## Why
Duplicates come from at least four places, and only one of them is the model. A network retry: a service can "receive the request, process the request successfully, but fail to send a response", and the retry logic re-sends it [S437]. A workflow engine: "Because Activities may be retried, these functions may be executed more than once" [S438]. A replay: re-running a LangGraph thread from a checkpoint re-executes later nodes "including any LLM calls, API requests" [S325]. And the model itself, calling the same tool again after a timeout it cannot interpret. AWS puts the cost plainly: "Simply retrying the request could result in multiple workloads, which could have dire consequences" [S435]. A green agent eval does not cover this, because the eval grades one clean run. The duplicate appears only when a fault lands between the effect and its acknowledgement. The trade-off: keys need a store, a retention window and a rule for mismatched parameters, and the tests need a fault injector in the tool layer. Without them, the first duplicate payment is found by a customer.

## How
1. **List every tool that changes something.** Classify each one as read-only, idempotent by nature (set a value), needs a key (create, charge, send), or irreversible (delete, transfer, publish). Do not take the classification from the tool's own description. The MCP specification says clients "MUST consider tool annotations to be untrusted unless they come from trusted servers" [S357]. The test checks behaviour, not the hint.
2. **Derive the key from the intent, not from the attempt.** Temporal suggests the Workflow Run ID plus the Activity ID, a value that holds across retries [S438]. Stripe has the client generate the key and suggests V4 UUIDs [S436]. AWS models it as a `ClientToken` field [S435]. Never let the model generate the key: a model that re-calls after a timeout can produce a new key, and the duplicate passes the guard.
3. **Write the no-model tests against the tool layer.** These run per pull request:

| Fault | Test | Expected |
|---|---|---|
| same request twice | send it twice with one key | one effect; the second call returns the first response; Stripe returns the saved status and body, "including `500` errors" [S436] |
| same key, different arguments | change one argument and resend | an error, not a second effect; AWS returns "a validation error indicating a parameter mismatch between idempotent requests" [S435], and Stripe errors when parameters differ [S436] |
| effect done, response lost | drop the response after the commit, let the client retry | one effect [S437] |
| crash after the effect, before the checkpoint | kill the worker, then resume | one effect; the resume re-executes the step [S325] and the key catches it [S438] |
| two concurrent duplicates | fire both at once | one effect; Stripe saves no result when a request "conflicts with another request that's executing concurrently" [S436], so assert on the record count, not on the response |
| retry after the retention window | reuse a key older than the store keeps it | written down as a known limit; Stripe can prune keys after 24 hours and then treats a reused key as a new request [S436] |

4. **Count effects, not calls.** Assert on the end state: rows written, messages sent, charges made. tau2-bench grades the database end state, so any trajectory that leaves an equivalent state passes [S078]. The same check, inverted, catches a duplicate that a trajectory grader scores as a retry.
5. **Add model-level cases for ambiguous errors.** In the agent eval, make the tool perform the effect and then return a timeout. Grade the end state for one effect. Grade the trajectory for a status check before any second call. Run it N times, because the model's choice to retry is probabilistic and a single pass proves little.
6. **Pause irreversible actions and test the pause.** The MCP specification says there "SHOULD always be a human in the loop with the ability to deny tool invocations" [S357]. The OpenAI Agents SDK pauses a run when `needs_approval` applies and no decision is stored. The pending call and its arguments go into `RunResult.interruptions`, and the serialised `RunState` "contains execution state, including approval decisions, pending tool calls, and tool arguments" [S439]. Test it four ways. A rejection leaves no effect. An approval executes exactly once after a resume. The approval survives a process restart. Approving one call does not approve a later call with different arguments.
7. **Keep authoritative state out of the context window.** The model reads state through tools and writes it through tools. Anthropic's subagents "store their work in external systems, then pass lightweight references back" [S322]. Test it three ways. Seed a conversation that claims an order is cancelled while the database says it is open, and assert the agent acts on the database. Compact or truncate the context mid-task, and assert no committed action is repeated. Resume from a checkpoint after the record changed underneath, and assert the agent reads the current record, not the checkpointed copy [S325].
8. **Replay against stubs or a sandbox, never live services.** A replay that re-executes "API requests" [S325] against production is a duplicate you caused on purpose.

## Who does it (sourced)
- **Amazon, AWS Builders' Library, living:** models the unique client request identifier as a `ClientToken` field, returns a semantically equivalent response for a repeated identifier, and rejects a reused identifier with different parameters as a parameter mismatch [S435].
- **Microsoft, Azure Architecture Center, 2024-07:** "Consider whether the operation is idempotent. If so, it's inherently safe to retry. Otherwise, retries could cause the operation to be executed more than once, with unintended side effects" [S437].
- **OpenAI, Agents SDK, living:** tool approval with `needs_approval`, interruptions that carry the tool name and arguments, and a serialisable run state that can be stored "in a database or queue" and resumed later [S439].
- **Anthropic, 2024-12 and 2025-06:** agents with "checkpoints for human feedback" and sandboxed testing [S166]; a research system whose subagents keep their work in external systems and that resumes "from where the agent was when the errors occurred" [S322].
- **Model Context Protocol project, 2026-07:** a human in the loop who can deny tool invocations, confirmation prompts for sensitive operations, and tool annotations treated as untrusted unless the server is trusted [S357].
- **Sierra Research, tau2-bench, living:** the default reward hashes the database end state, so equivalent end states pass whatever path produced them [S078].
- **Stripe, living:** client-generated idempotency keys, accepted on every `POST`; the first response is saved and replayed, errors included; parameters are compared on reuse; keys may be pruned after 24 hours [S436].
- **Temporal, living:** "Temporal recommends that Activities be idempotent", with a key built from the Workflow Run ID and the Activity ID and enforced by the external service [S438].
- **LangChain, LangGraph, living:** checkpoints per super-step keyed by `thread_id`, with replay from a prior checkpoint that re-executes later nodes, API requests included [S325].

## Pitfalls
1. Counting tool calls instead of effects. A retry with a valid key is two calls and one effect, and that is correct. A trajectory grader that fails it is wrong, and one that passes a second effect is worse [S078].
2. A key per attempt. A key generated inside the retry loop, or by the model, is a new request every time and guards nothing [S436] [S438].
3. Trusting a tool's self-description. An annotation that says a tool is safe to repeat is a claim from the server, and the specification says to treat it as untrusted [S357].
4. Testing only the happy retry. The dangerous case is the effect that committed while the response was lost [S437]. That needs a fault injector, not a second call.
5. Replaying a checkpoint against live integrations [S325].
6. An approval held only in memory. If a restart loses the pending decision, the agent either asks again or acts without asking. Store it with the run state and test the restart [S439].

## Pattern from a production build
None yet.

## Sources
- [S435] Making retries safe with idempotent APIs, Amazon Builders' Library, living (checked 2026-10-14).
- [S436] Idempotent requests, Stripe API reference, living (checked 2026-10-14).
- [S437] Retry pattern, Azure Architecture Center, Microsoft, 2024-07-18.
- [S438] Activity Definition, Temporal documentation, living (checked 2026-10-14).
- [S439] Human-in-the-loop, OpenAI Agents SDK, living (checked 2026-10-14).
- [S357] Tools, Model Context Protocol specification 2026-07-28.
- [S325] Checkpointers, LangGraph, LangChain, living.
- [S322] How we built our multi-agent research system, Anthropic engineering, 2025-06-13.
- [S166] Building effective agents, Anthropic, 2024-12-19.
- [S078] tau2-bench repository and evaluation docs, Sierra Research, living.
