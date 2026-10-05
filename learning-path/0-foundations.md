# Phase 0: Foundations

For someone who has never called a model from code. Outcome: you can explain why the same prompt
gives different answers, and you can name what to pin so a change is attributable.

## What you learn to build
A prompt that returns structured output (a JSON object with a schema), a single tool call, and a
retrieval step that puts a document into the context. Nothing more.

## What a tester takes from it
Everything around the model is code and behaves like code. The model's wording is a sample from a
distribution. Testing therefore splits in two: deterministic checks on the code, and statistical
checks on the model.

## Line items

| Item | Know | Do | Prove it |
|---|---|---|---|
| Tokens and context window | text is split into tokens; the window is finite; cost and latency scale with tokens | count tokens for a prompt with the provider's tokenizer | show the same prompt costing more after you add a document |
| Sampling and temperature | temperature 0 is not deterministic across versions; top-p and seeds exist | run one prompt 10 times at temperature 0 and at 1 | report the spread of outputs at each setting |
| Structured output | a schema constrains shape, not truth | ask for JSON with a schema and validate it | inject a field the schema forbids and show it rejected |
| Tool calling | the model emits a call; your code runs it; the result goes back in | wire one tool with typed arguments | assert the arguments, not the prose around them |
| Embeddings and retrieval | a vector index returns nearest neighbours, not answers | index 20 documents and query them | show a wrong-but-similar document ranking first |
| Guardrails, first contact | a managed guardrail filters input and output by category | send one blocked and one allowed input through one | write a case that must not block |
| Model and prompt as inputs | the model id, the prompt and the tool set define the system under test | record all three in a run log | change one, rerun, attribute the difference |

## Worked example
Ask a model to extract a name, a date and a phone number from a paragraph into JSON. Run it ten
times. The JSON shape is stable because the schema is enforced. The date normalisation is not
always stable. That difference is the whole subject.

## Exercises
1. Write a script that runs one prompt N times and prints the distinct outputs with counts.
2. Add a JSON schema and a validator. Make the validator fail on purpose.
3. Add one tool. Log every call with its arguments. Assert the arguments in a test.
4. Start the [RAG build project](rag-build-project.md): write the corpus (stage 0) and test
   ingestion and chunking (stage 1).

## Read next
[non-determinism-and-pass-rates](../practices/2-application-evals/non-determinism-and-pass-rates.md),
[tool-use-evals](../practices/4-agents-and-systems/tool-use-evals.md),
[guardrails](../practices/5-safety-and-security/guardrails.md).

## Resources
3Blue1Brown on transformers [S186]; the Claude API docs [S187] and the OpenAI API docs [S188] for
structured output and tool calling.
