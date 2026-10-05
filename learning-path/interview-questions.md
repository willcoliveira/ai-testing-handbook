# Interview questions for AI QA roles, with answers

Questions that come up for "QA AI engineer", "AI quality" and "LLM evaluation" roles, with the
answer an interviewer is listening for, the follow-up that tests depth, and where to read more.
Every answer rests on a source in the register. The first four came from real interviews.

How to use it: say the short answer first, then one concrete mechanism, then the trade-off. Depth
is the mechanism, not the list.

## Agents and orchestration

### 1. The orchestrator and its subagents went wrong. How do you debug it?
**Short answer.** I make every subagent observable while it runs, not only when it ends: one
trace per request with a span per subagent, a stable id per subagent that leads to its
transcript, progress events, hard budgets, and a typed result at each handoff. Then I replay the
failing subagent alone and turn it into a regression case.
**The mechanism.** Anthropic reports that "Adding full production tracing let us diagnose why
agents failed", and built its research system to "resume from where the agent was when the errors
occurred" [S322]. Subagent context is isolated: only the final message returns to the parent
[S326], so the parent's log cannot tell you what went wrong inside.
**Read.** [13 Debug a multi-agent orchestration](../how-to/13-debug-a-multi-agent-orchestration.md).

### 2. Follow-up: what is the practice to get the status and the context of one subagent?
**Short answer.** Distributed tracing with context propagation, plus persisted per-agent
transcripts addressable by id.
**The mechanism.** The orchestrator opens the root span and passes the trace context down; each
subagent is a child `invoke_agent` span carrying `gen_ai.agent.id` and `gen_ai.conversation.id`
[S323]. Status is the open span and its latest event; context is that span's transcript. Concrete
examples: the Claude Agent SDK tags subagent messages with `parent_tool_use_id`, returns an
`agentId`, and stores each subagent's transcript in its own file [S326]; the OpenAI Agents SDK
nests agent, tool and handoff spans under a trace and accepts a custom processor that receives
spans "as they are ready", which is where a live status view hooks in [S324]; LangGraph
checkpoints state per step under a `thread_id` and can re-run from a checkpoint, with a
namespace per subgraph [S325].
**Trade-off.** Transcripts hold user data, so content capture is opt-in and redacted [S136].

### 3. How do you evaluate an agent, not just its final answer?
**Short answer.** Outcome, trajectory and components. Grade the end state, check the tool calls,
and score each component on its own span.
**The mechanism.** Anthropic evaluates "whether it achieved the correct final state" and uses
checkpoints for long runs [S322]. DeepEval scores tool correctness against expected tools, task
completion over the full trace, and component metrics on spans marked `@observe` [S332][S333][S334].
For reliability use pass^k, "the probability that all k trials succeed", not pass@k [S032].
**Read.** [agent-evals](../practices/4-agents-and-systems/agent-evals.md), [tool-use-evals](../practices/4-agents-and-systems/tool-use-evals.md).

## A chatbot behind an API

### 4. A chatbot runs only in the backend. How do you approach deterministic, non-deterministic, red teaming and performance tests?
**Short answer.** Four layers on four cadences. Deterministic tests with the model stubbed on
every commit; a judged golden set run N times on every prompt or model change; a red team corpus
before release; load tests before scaling. A trace per request throughout.
**The mechanism.** Deterministic: API contract, prompt assembly, session memory, tool parsing,
and real-output assertions such as JSON validity and regex [S045]. Structured outputs guarantee
the schema but not on refusals or `max_tokens` cut-offs, so test those paths [S346][S347].
Non-deterministic: 20 to 50 cases from real failures [S032], a calibrated judge, repeated runs,
paired comparisons [S004]. Red team: OWASP classes [S281], indirect injection, multi-turn
escalation such as Crescendo [S344], and over-refusal. Performance: time to first token [S341],
p95 and p99, cost per turn, warm and cold cache [S342].
**Read.** [14 Test a backend-only chatbot](../how-to/14-test-a-backend-chatbot.md).

### 5. Which latency numbers matter for an LLM API?
**Short answer.** Time to first token for perceived speed, total latency percentiles for the
tail, and output tokens because they drive both.
**The mechanism.** OpenAI's guide: cutting half the output tokens "may cut ~50% of your latency",
cutting half the prompt "may only result in a 1-5% latency improvement" [S343]. Streaming improves
perceived responsiveness, not total time [S341]. Report p95 and p99, not the mean.
**Read.** [load-and-latency](../practices/4-agents-and-systems/load-and-latency.md).

### 6. What is a multi-turn jailbreak and why does a single-turn suite miss it?
**Short answer.** Each message looks harmless; the harm is in the trajectory.
**The mechanism.** Crescendo "begins with a general prompt or question about the task and then
gradually escalates the dialogue", and an automated version exists [S344]. Test with scripted
escalations and automated multi-turn attackers (PyRIT, promptfoo) [S131][S132].

## RAG, DeepEval and Ragas

### 7. How do you evaluate a RAG system?
**Short answer.** Retrieval and generation separately. Context precision and recall for the
retriever, faithfulness and answer relevancy for the generator.
**The mechanism.** A wrong answer with bad context is a retrieval defect; with good context it is
a generation defect. DeepEval describes contextual precision as measuring the retriever and
faithfulness the generator [S330][S329]. Faithfulness is claims supported by the context over all
claims [S329][S336]. Recall needs a reference answer [S338].
**Read.** [RAG and agent metrics](../tools/rag-and-agent-metrics.md), [rag-evals](../practices/2-application-evals/rag-evals.md),
[17 Test a RAG application](../how-to/17-test-a-rag-application.md). Questions 26 to 28 go deeper.

### 8. DeepEval or Ragas?
**Short answer.** Overlapping metrics; different shape. DeepEval is pytest-style with test cases,
thresholds, CI runs, agent and component metrics [S070][S328]. Ragas is a metrics library with
experiments and test set generation from your documents [S080][S340]. DeepEval lists a Ragas
metric among its own [S328], so the two combine.
**Follow-up to expect.** "What does 0.5 mean?" It is DeepEval's default threshold [S328], not a
product decision; set your own after calibration.

### 9. Faithfulness versus answer relevancy?
**Short answer.** Faithfulness asks whether the answer is supported by the retrieved context.
Relevancy asks whether it addresses the question. Ragas's relevancy is computed "without evaluating
factual accuracy" [S339]. An answer can be relevant and unfaithful, or faithful and off the point.

### 10. How do you build test data for RAG?
**Short answer.** Real failures first, synthetic to widen coverage. Ragas builds a knowledge
graph from your documents and synthesises single-hop and multi-hop questions [S340]; review them
and keep them versioned. **Read.** [02 Build a golden set](../how-to/02-build-a-golden-set.md).

## Metrics and statistics

### 11. The model is non-deterministic. How do you test it?
**Short answer.** Run each case several times and report a rate with an interval. Pick pass@k
when one success is enough and pass^k when every run must succeed [S032]. Identical runs of one
setup can vary more than two setups differ [S308], so a few runs cannot rank systems.
**Read.** [non-determinism-and-pass-rates](../practices/2-application-evals/non-determinism-and-pass-rates.md).

### 12. How do you say version B is better than version A?
**Short answer.** Same cases, both versions, N runs each, paired difference with a confidence
interval; a difference whose interval crosses zero is not a difference [S004]. With 100 items at
80 percent the standard error alone is about four points.
**Read.** [06 Benchmark your system](../how-to/06-benchmark-your-system.md),
[statistical-treatment-of-evals](../practices/1-capability/statistical-treatment-of-evals.md).

### 13. How do you know your LLM judge is right?
**Short answer.** Calibrate it against human labels and report agreement, not just the score.
**The mechanism.** Cohen's kappa for two raters on categorical labels [S062]; for pairwise judges
the swap test for position bias [S051], with the caveat that such consistency figures are
dominated by close pairs [S320]. **Read.** [judge-calibration](../practices/3-judging/judge-calibration.md),
[05 Calibrate the evaluator](../how-to/05-calibrate-the-evaluator.md).

### 14. What runs in CI and what runs on a schedule?
**Short answer.** Deterministic and small judged smoke sets gate every change; full suites, red
team and load run on a schedule or before release; production traffic is sampled for online
evals. **Read.** [08 Wire the gates](../how-to/08-wire-the-gates.md),
[ci-gates-for-llm-apps](../practices/2-application-evals/ci-gates-for-llm-apps.md).

### 15. The provider ships a new model version. What do you do?
**Short answer.** Pin dated snapshot ids, check breaking request changes first, run the same suite
N times on both ids and compare per case, then read the release notes for behaviour changes and
test for them. **Read.** [10 Run a model upgrade](../how-to/10-run-a-model-upgrade.md),
[regression-on-upgrade](../practices/7-training-and-lifecycle/regression-on-upgrade.md).

### 16. Why would a public benchmark score mislead you?
**Short answer.** Contamination and gaming: the test set may be in the training data, and
leaderboards allow selective disclosure [S006][S154]. Use a private, dated golden set on your own
distribution. **Read.** [benchmark-hygiene](../practices/1-capability/benchmark-hygiene.md),
[data-contamination](../practices/7-training-and-lifecycle/data-contamination.md).

## Observability

### 17. What would you put in a trace for an LLM call?
**Short answer.** A span per model and tool call with operation name, provider, model, token
counts, finish reason and errors; message content opt-in and redacted [S136]. For agents, the
agent spans and ids from question 2 [S323].
**Read.** [genai-tracing](../practices/6-observability/genai-tracing.md).

## AI-augmented QA

### 18. How do you gate code or tests written by a coding agent?
**Short answer.** Review against the requirement, not against green, and prove each test can fail.
**The mechanism.** A generated test can assert what the code does rather than what it should do;
review checks requirement fidelity and weakened gates such as skipped tests or lowered thresholds
[S169]. Mutation testing makes it measurable: change the code, and a test that still passes
verifies nothing [S091][S092]. Generated tests start as non-blocking and gate only once reviewed.
**Example.** Changing `>=` to `>` in discount code leaves the agent's test green: the mutant
survives, so the test only checked that a number came back.
**Read.** [ai-generated-tests](../practices/8-governance/ai-generated-tests.md),
[mutation-checking](../practices/4-agents-and-systems/mutation-checking.md).

### 19. How does a production failure become an eval case?
**Short answer.** Trace, find, freeze, gate. The trace shows where it failed; the input and the
expected behaviour become a versioned golden case; the fix ships when that case passes.
**The mechanism.** Score sampled live spans with rules and judges, baseline per model and prompt
version, and treat every failed live case as a candidate for the offline dataset [S140]; spans per
model and tool call make the failure locatable [S136][S322].
**Read.** [online-evals-and-drift](../practices/6-observability/online-evals-and-drift.md).

### 20. You are asked to build an autonomous QA agent. What stops it doing damage?
**Short answer.** A charter enforced in configuration: allowed outputs (draft pull requests only),
a volume cap, no-go paths, least permission, phase gates starting in shadow mode, and a tested kill
switch.
**The mechanism.** Excessive agency is an OWASP top risk [S163]; agents suit problems whose steps
cannot be predicted and need extensive testing first [S166]; deny rules and sandbox allowlists are
the boundary, not prompt text [S167]. Self-healing tests need review too, because a healed step can
hide a real regression.
**Read.** [autonomous-qa-agents](../practices/8-governance/autonomous-qa-agents.md).

### 21. How do you use AI in your own QA work without creating new risk?
**Short answer.** Approved tools per data class, a human decision on anything that ships, and a
record of what the AI did.
**The mechanism.** Permissions live in configuration [S167]; review standards for AI output are
written down [S169]; customer data never goes to an unapproved tool. Note how the labs frame it
for candidates: AI may help you prepare, and some interview formats allow it while others do not
[S349][S350].

### 22. How is an evaluation role at an AI lab different from AI QA in a product team?
**Short answer.** Labs measure the model during training and before release; product teams test a
product built on a model. The habits are shared: distrust a single number, read transcripts, turn
failures into cases, measure over- and under-refusal.
**The mechanism.** Anthropic's Safeguards team tests violations, ambiguous contexts and long
multi-turn conversations with model grading and human review [S351]; OpenAI pairs automated
evaluations with expert-led deep dives [S354]. On hiring: "We care about what you can do, not where
you learned to do it" [S348]; "We are not credential-driven" [S350].
**Read.** [AI QA requirements](ai-qa-requirements.md#evaluation-roles-at-ai-labs).

## MCP

### 23. How would you test an MCP server?
**Short answer.** In layers. Contract tests with no model (discovery, tool schemas, errors,
transport and auth rules) in CI; a tool-quality set that measures whether a model picks the right
tool with the right arguments; a security suite with a malicious test server; and tracing.
**The mechanism.** Protocol errors versus tool execution errors with `isError: true` [S357]; the
Inspector CLI runs one method per call with stable exit codes [S362]; promptfoo's MCP provider
records tool calls for routing assertions [S381]; OpenTelemetry has MCP span conventions [S384].
**Follow-up to expect.** "What changed in the protocol?" The 2026-07-28 revision removed the
`initialize` handshake and sessions and requires `server/discover` [S356]; older material
describes the handshake.
**Read.** [15 Test an MCP server](../how-to/15-test-an-mcp-server.md).

### 24. What is tool poisoning, and how do you test for it?
**Short answer.** Instructions hidden in a tool's description, invisible to the user and visible
to the model [S364]. Test by loading a test server whose description plants an instruction and
asserting on actions: the planted call never happens. Add the variants: a rug pull (description
changed after approval) and shadowing (one server redirects another's tool) [S364].
**The mechanism.** The model sees every connected server's descriptions [S369]; MCPTox measured
72.8 percent attack success for one model on real servers, with more capable models often more
susceptible [S371]. Defences: pin definitions by hash [S369], least-privilege tool access in the
host [S386], and blind grading of attack outcomes [S376]. Scanners help find candidates, but under
half of sampled alerts were true positives in a large study [S374].

### 25. Why are tool names and descriptions a testing concern?
**Short answer.** They are the prompt the model uses to choose a tool. Anthropic found naming and
namespacing changed its eval results and that refining descriptions moved SWE-bench Verified
scores [S377]. So a description change is a behaviour change: rerun the tool-quality set.
**The mechanism.** Grade the four failure modes: wrong tool, wrong parameters, too few calls,
mishandled responses [S377]; use held-out cases so you do not tune to the test set [S377].

## RAG in practice

### 26. The documents do not answer the question. What should the test expect?
**Short answer.** Abstention. Write the case with expected behaviour `abstain`; it passes when the
system says the documents do not cover it and fails on any answer. A demo that marks this case as
an intended failure has the test inverted: the invented answer is the bug.
**The mechanism.** Larger models "often output incorrect answers instead of abstaining when the
context is not" sufficient [S402]. Score abstention as its own check, not as low faithfulness,
and keep about one unanswerable case for every few answerable ones.
**Follow-up to expect.** "Would faithfulness catch the invented answer?" Not reliably: DeepEval's
faithfulness page says a claim counts if it "does not contradict" the context and also that only
supported claims count [S329]. Plant an invented claim and see.
**Read.** [17 Test a RAG application](../how-to/17-test-a-rag-application.md).

### 27. Faithfulness or hallucination metric?
**Short answer.** Faithfulness for RAG. DeepEval's hallucination metric compares the output with a
curated `context` you supply, not the `retrieval_context` the retriever fetched, and its page says
to use faithfulness for RAG and not to use hallucination "on a live RAG system" [S393].
**Follow-up to expect.** "Is a higher hallucination score better?" On the page read 2026-10-05,
yes: "Higher is better" [S393]. Older material says the opposite, so read the docs for the version
you run before you set a threshold.

### 28. How do you test retrieval without an LLM judge?
**Short answer.** Label the chunk ids that answer each question and compute hit rate, MRR or
recall@k. The OpenAI cookbook uses hit rate and MRR [S411]; Anthropic reports 1 minus recall@20
as its retrieval failure rate [S405]; Microsoft's document retrieval evaluator reports NDCG
against labels [S407].
**The mechanism.** Labels make retrieval deterministic to score, so it can run on every commit and
compare chunkers and embedding models on the same questions. Anthropic's contextual retrieval
cut top-20 failures from 5.7 to 1.9 percent with contextual embeddings, BM25 and reranking [S405].
**Read.** [RAG build project](rag-build-project.md), stage 2.


Phase 5 of this path, then playbooks 01 to 08 and 13 to 17, then the
[AI QA requirements](ai-qa-requirements.md) page for what roles ask for. Know one tool well enough to write a
test in it live (DeepEval or promptfoo), and be ready to explain one number you reported with
its interval.
