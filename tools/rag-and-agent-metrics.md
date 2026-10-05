# RAG and agent metrics: DeepEval and Ragas side by side

Both libraries score the same things under slightly different names. This page maps them, says
how each is computed according to its own docs, and says what each needs to run. Checked
2026-09-30; DeepEval recall, relevancy and hallucination rows 2026-10-05. The method behind them
is in [rag-evals](../practices/2-application-evals/rag-evals.md). Harness-level notes are in [harnesses.md](harnesses.md).

## The one idea to keep
Score retrieval and generation separately. A wrong answer with the wrong context is a retrieval
defect; a wrong answer with the right context is a generation defect. DeepEval's contextual
precision is described as measuring "your RAG pipeline's retriever" and faithfulness as measuring
its "generator" [S330][S329]; Ragas splits its RAG metrics the same way [S335].

## Mapping

| What it asks | DeepEval | Ragas | How it is computed (per the docs) | Inputs |
|---|---|---|---|---|
| Is the answer supported by the retrieved context? | Faithfulness [S329] | Faithfulness [S336] | claims in the answer supported by the context / all claims in the answer; DeepEval also returns a reason. DeepEval's page says both that a claim counts if it "does not contradict" the context and that the metric "only rewards claims supported" by it; `penalize_ambiguous_claims` is off by default [S329] | question, answer, retrieved context |
| Does the answer contradict known-true context? | Hallucination [S393] | none named | aligned contexts / all contexts; the page read 2026-10-05 says "Higher is better" and "Use Faithfulness for RAG" | question, answer, curated `context` (not `retrieval_context`) |
| Are the relevant chunks ranked first? | Contextual Precision [S330] | Context Precision [S337] | precision at each rank, weighted toward the top (DeepEval: weighted cumulative precision; Ragas: mean of precision@k) | question, retrieved context, and a reference answer (DeepEval requires it; Ragas has variants with and without) |
| Did retrieval find everything needed? | Contextual Recall [S394] | Context Recall [S338] | statements (DeepEval) or claims (Ragas) in the reference answer attributable to the retrieved context / all of them | reference answer, retrieved context |
| Does the answer address the question? | Answer Relevancy [S396] | Response Relevancy [S339] | DeepEval: statements in the answer relevant to the question / all statements [S396]; Ragas: generate questions from the answer, embed them, cosine similarity to the user input; "without evaluating factual accuracy", and not guaranteed to stay in 0 to 1 | question, answer |
| Is the retrieved context relevant at all? | Contextual Relevancy [S395] | none named; noise sensitivity is closest [S335] | statements in the retrieved context relevant to the question / all statements | question, retrieved context |
| Custom criteria | G-Eval (criteria or evaluation steps, 1 to 5 normalised by token probabilities), DAG [S331][S328] | custom metrics via decorators [S080] | a judge applies your rubric | your fields |
| Right tools called? | Tool Correctness: correctly used tools / tools called, against `expected_tools` [S332] | Tool call accuracy, tool call F1 [S335] | comparison with expected calls; options for order and exact match | tools called, expected tools |
| Did an MCP agent use the server well? | MCP Use (primitives and arguments chosen against those available), MCP Task Completion per interaction [S379][S380] | none named | judge over the MCP calls in the test case | MCP servers and the tools, resources and prompts called [S378] |
| Did the agent finish the task? | Task Completion: an LLM extracts task and outcome from the full trace and scores their alignment [S333] | Agent goal accuracy [S335] | judge over the trajectory | a trace (DeepEval requires tracing) |

## What they need to run
- **A judge model.** "Almost all predefined metrics on deepeval use LLM-as-a-judge", and a metric
  passes when its score is at or above a threshold that defaults to 0.5; `strict_mode` makes the
  score binary [S328]. Ragas metrics are LLM-driven too, with non-LLM variants for context
  precision and recall and a classifier option for faithfulness [S337][S338][S336].
- **Reference answers** for precision and recall. Without them you can measure faithfulness and
  relevancy, not retrieval completeness.
- **Tracing** for agent metrics. DeepEval's task completion reads the trace, and its component
  mode attaches metrics to spans marked with `@observe` so the retriever and the generator are
  scored separately [S333][S334].

## Generating test data
Ragas builds a knowledge graph from your documents and synthesises questions from it, by default
half single-hop specific, a quarter multi-hop abstract and a quarter multi-hop specific [S340].
Treat generated sets as a starting point: review
them, and add cases from real failures, which carry the distribution synthetic sets miss.

## Before you report a number
These are judge scores. A faithfulness of 0.82 means nothing until the judge has been compared
with human labels on your data ([05 Calibrate the evaluator](../how-to/05-calibrate-the-evaluator.md)).
Run each case more than once and report an interval
([non-determinism-and-pass-rates](../practices/2-application-evals/non-determinism-and-pass-rates.md)).
The 0.5 default threshold is a library default, not a product decision.
