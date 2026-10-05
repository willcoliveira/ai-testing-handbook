---
id: rag-evals
title: RAG evals
area: 2-application-evals
status: draft
last_reviewed: 2026-10-05
sources: [S328, S329, S330, S336, S337, S338, S393, S394, S395, S396, S399, S400, S401, S402, S403, S404, S405, S406, S407, S408, S409, S410, S411]
related: [golden-datasets, criteria-authoring, llm-as-judge, judge-calibration, non-determinism-and-pass-rates, prompt-injection, offline-probes, regression-on-upgrade]
---

# RAG evals

## What
Retrieval-augmented generation answers from documents fetched at query time instead of only from
what the model memorised: a retriever finds passages, a generator writes the answer from them
[S399]. A RAG system is a pipeline (ingest, chunk, embed, index, retrieve, generate), and each
stage can be wrong on its own. RAG evals test the pipeline stage by stage: did ingestion keep the
text, did retrieval find the passages that hold the answer, did the generator stay inside them, and
did it say "the documents do not say" when they do not.

## Why
A RAG answer can be fluent, relevant and wrong, and a single end-to-end score cannot say where.
Retrieval and generation fail differently: a wrong answer with the wrong context is a retrieval
defect, a wrong answer with the right context is a generation defect. The evaluation literature
and the tool vendors split them the same way: Ragas scores "the ability of the retrieval system to
identify relevant and focused context passages" separately from the ability of the model "to
exploit such passages in a faithful way" [S400], ARES scores context relevance, answer
faithfulness and answer relevance [S401], and a survey of RAG evaluation frames it as metrics for
"the Retrieval and Generation components" [S404].

The failure that matters most is the confident answer to a question the documents do not answer.
A study of sufficient context found that larger models "excel at answering queries when the
context is sufficient, but often output incorrect answers instead of abstaining when the context
is not" [S402]. A suite with no unanswerable cases never sees this.

The trade-off: most RAG metrics are LLM judges [S328], so they bring the judge's cost,
non-determinism and bias. Retrieval can be scored without a judge if you label which chunks answer
each question, which costs labelling time up front.

## How
1. **Test ingestion as code, no model.** For a small corpus you wrote yourself: extracted text
   matches the source page; tables and scanned pages survive (OCR output checked against the known
   text); chunk boundaries do not split a rule from its exception; each chunk carries document id,
   version and page. These are deterministic tests that run on every commit. Chunks lose meaning
   when cut from their document: Anthropic found individual chunks can "lack sufficient context"
   and measured retrieval failures fall from 5.7 to 3.7 percent by prepending chunk-specific
   context, and to 1.9 percent with contextual BM25 and reranking [S405].
2. **Score retrieval against labels.** For each question, label the chunk ids that answer it. Then
   measure without a judge: hit rate and MRR (the OpenAI cookbook's retrieval metrics [S411]),
   recall at k (Anthropic reports 1 minus recall@20 as its failure rate [S405]), or NDCG
   (Microsoft's document retrieval evaluator [S407]). Compare chunking and embedding settings on the
   same questions with a paired test.
3. **Score retrieval with a judge where labels run out.** Contextual precision (relevant chunks
   ranked first) and contextual recall (statements in the reference answer that the retrieved
   context supports) need a reference answer [S330][S394][S337][S338]. Contextual relevancy scores
   how much of the retrieved text is relevant to the question and needs none [S395]. AWS splits the
   same way: context relevance and context coverage in a retrieve-only job [S408][S409].
4. **Score generation.** Faithfulness: claims in the answer supported by the retrieved context over
   all claims [S329][S336]. Answer relevancy: statements in the answer relevant to the question
   [S396]. Microsoft calls the pair groundedness, "the precision aspect of the response", and
   response completeness, "the recall aspect" [S407]. Google's check grounding API returns a support
   score that "loosely approximates the fraction of claims" grounded, plus cited chunks per claim
   [S410]. If the product cites sources, test citations as data: every cited id was retrieved, and
   the cited chunk supports the claim (AWS has citation precision and coverage metrics [S409]).
5. **Write unanswerable cases and expect abstention.** For every few answerable questions, add one
   the corpus does not answer, one it answers only across two chunks, and one where two document
   versions disagree. The expected behaviour of an unanswerable case is "the documents do not say",
   and the case passes when the system abstains. Score abstention as its own check, not as a low
   faithfulness score [S402].
6. **Check your metric before you trust it.** Plant an answer with an invented claim the context
   neither supports nor contradicts and see what the metric does. DeepEval's faithfulness page
   says a claim is truthful if it "does not contradict" the context, and its FAQ says the metric
   "only rewards claims supported by the retrieval_context"; `penalize_ambiguous_claims` defaults to
   off [S329]. Read the direction too: DeepEval's hallucination metric is scored against a curated
   `context`, not `retrieval_context`, and its page now says "Higher is better" [S393].
7. **Test position and length.** Put the answering passage first, in the middle and last of a long
   context. Performance "is often highest when relevant information occurs at the beginning or end
   of the input context" and degrades in the middle [S403].
8. **Test the index as an attack surface.** An uploaded document is untrusted input: plant an
   instruction in one and assert the answer ignores it. In a shared vector store, give two tenants
   different documents and assert neither retrieves the other's. OWASP lists data poisoning,
   "context leakage between users or queries" in multi-tenant stores and embedding inversion
   [S406].
9. **Repeat, calibrate, gate.** Run each case several times and report intervals; calibrate the
   judge against human labels before a threshold means anything (DeepEval's default is 0.5 [S328],
   Microsoft's is 3 on a 1 to 5 scale [S407]). Re-run retrieval evals on any change to the
   chunker, the embedding model or the index, and the full set on any prompt or model change.

| Stage | Failure | Check | Needs a model |
|---|---|---|---|
| Ingestion | text lost, table flattened, OCR error, rule split across chunks | extracted text and chunk inventory against the source | no |
| Retrieval | right chunk not retrieved, or ranked low | hit rate, MRR, recall@k against labelled chunk ids | no |
| Retrieval | noisy context | contextual relevancy, contextual precision | judge |
| Generation | claim not in the context | faithfulness, groundedness, citation checks | judge, citations no |
| Generation | answers when it should abstain | unanswerable cases, abstention check | judge or exact phrase |
| Index | poisoned document, cross-tenant leak | planted instruction, two-tenant test | yes for injection, no for access |

## Who does it (sourced)
- **Anthropic, 2024-09:** evaluates retrieval with 1 minus recall@20 across knowledge domains, and reports contextual embeddings, contextual BM25 and reranking cutting top-20 retrieval failures from 5.7 to 1.9 percent [S405].
- **Microsoft, living:** Foundry ships separate evaluators for retrieval, document retrieval against labels (NDCG, XDCG, holes), groundedness and response completeness [S407].
- **AWS, living:** Bedrock runs retrieve-only and retrieve-and-generate evaluation jobs, with context relevance and coverage for the first and faithfulness, correctness, citation precision and coverage for the second [S408][S409].
- **Google Cloud, living:** the check grounding API scores an answer against supplied facts and returns cited chunks per claim [S410].
- **OpenAI, living:** a cookbook evaluates a RAG pipeline's retrieval with hit rate and MRR and its responses with faithfulness and relevancy evaluators, using LlamaIndex [S411].
- **OWASP, 2025:** LLM08:2025 Vector and Embedding Weaknesses covers poisoning, multi-tenant leakage and embedding inversion [S406].
- **Confident AI and Ragas, living:** DeepEval and Ragas implement contextual precision, recall and relevancy, faithfulness and answer relevancy as LLM-judged metrics [S328][S329][S394][S395][S396][S336][S337][S338].
- **arXiv, 2023 to 2024:** Ragas proposed reference-free RAG metrics [S400]; ARES fine-tunes lightweight judges using "a few hundred human annotations" [S401]; sufficient context separates insufficient retrieval from failure to use the context [S402].

## Pitfalls
1. One end-to-end score. It cannot tell a retrieval defect from a generation defect [S400][S404].
2. No unanswerable cases. Models often answer instead of abstaining when the context is insufficient [S402], and a suite of answerable questions rewards that.
3. A planned failure that is really a missing expected behaviour. If the documents do not answer a question, the test should expect abstention and pass when the system abstains.
4. Trusting the metric's name. DeepEval's hallucination metric expects curated `context`, and its page says not to use it "on a live RAG system" [S393]; the faithfulness page describes unsupported claims two ways [S329]. Plant a known-bad answer and check.
5. Asking "did retrieval provide the right context?" and measuring only faithfulness. Faithfulness says nothing about chunks that were never retrieved; measure recall [S394][S338].
6. Judge scores to two decimals from one run of five cases. Report the number of cases, runs and an interval, and calibrate the judge first.
7. Re-indexing without re-testing. A new chunker or embedding model changes what is retrieved, so it is a regression event like a model upgrade.
8. Treating uploaded files as trusted. A document can carry an instruction or another tenant's data [S406].

## Pattern from a production build
None yet. The [RAG build project](../../learning-path/rag-build-project.md) is the exercise that
builds one.

## Sources
- [S328] Introduction to LLM evaluation metrics, DeepEval, living.
- [S329] Faithfulness metric, DeepEval, living.
- [S330] Contextual Precision metric, DeepEval, living.
- [S336] Faithfulness, Ragas, living.
- [S337] Context Precision, Ragas, living.
- [S338] Context Recall, Ragas, living.
- [S393] Hallucination metric, DeepEval, living.
- [S394] Contextual Recall metric, DeepEval, living.
- [S395] Contextual Relevancy metric, DeepEval, living.
- [S396] Answer Relevancy metric, DeepEval, living.
- [S399] Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks, arXiv 2005.11401, 2020-05-22.
- [S400] Ragas: Automated Evaluation of Retrieval Augmented Generation, arXiv 2309.15217, 2023-09-26.
- [S401] ARES, arXiv 2311.09476, 2023-11-16.
- [S402] Sufficient Context, arXiv 2411.06037, 2024-11-09.
- [S403] Lost in the Middle, arXiv 2307.03172, 2023-07-06.
- [S404] Evaluation of Retrieval-Augmented Generation: A Survey, arXiv 2405.07437, 2024-05-13.
- [S405] Introducing Contextual Retrieval, Anthropic, 2024-09-19.
- [S406] LLM08:2025 Vector and Embedding Weaknesses, OWASP, 2025 list (page undated).
- [S407] RAG evaluators, Microsoft Foundry, living.
- [S408] Evaluate the performance of RAG sources, Amazon Bedrock, living.
- [S409] Use metrics to understand RAG system performance, Amazon Bedrock, living.
- [S410] Check grounding with RAG, Google Cloud, living.
- [S411] Evaluate RAG with LlamaIndex, OpenAI Cookbook, living.
