---
id: test-a-rag-application
title: Test a RAG application
sources: [S328, S329, S330, S393, S394, S395, S396, S397, S398, S402, S403, S405, S406, S407, S409, S411]
last_reviewed: 2026-10-05
---

# Test a RAG application

## When
A chatbot or assistant answers from documents (uploaded PDFs, a wiki, a requirements set) through
retrieval, and you are asked whether its answers can be trusted. Also when someone shows a RAG
demo with a table of judge scores and asks whether it is ready.

## What
A test plan and a suite that score each stage separately: deterministic ingestion and chunk
tests; retrieval scored against labelled chunk ids; generation scored by calibrated judges; a
golden set with answerable, multi-chunk, unanswerable and conflicting cases, each with an expected
behaviour; security cases for the index; and a report that says, for every failure, whether
retrieval or generation caused it.

## Why
A RAG pipeline has two probabilistic stages, and a single score blends them. A low faithfulness
score says the answer left the context; it does not say whether the right passage was ever
retrieved. Models also answer when they should abstain: they "often output incorrect answers
instead of abstaining when the context is not" sufficient [S402]. And the tools that make RAG
quick to build (Langflow's vector RAG template is a load flow and a retriever flow wired in a
visual editor [S397][S398]) make it equally quick to ship one that nobody has tested past the
last arrow.

## How
1. **Draw the pipeline and name a check per arrow.** Typical shape: upload, parse (text, PDF,
   image via OCR), chunk, embed, store, retrieve top k, assemble prompt, generate, cite. Langflow's
   template splits this into a load flow and a retriever flow [S398]; test both.
2. **Ingestion and chunking, deterministic.** Use a corpus you control, so the truth is known.
   Assert extracted text per page, OCR on the image pages, chunk count and boundaries, metadata on
   every chunk (document, version, page). Snapshot the chunk inventory so a chunker change shows up
   as a diff. Chunks cut from their document lose context [S405], so check that each rule and its
   exception land in one chunk or are both retrieved.
3. **Label the retrieval truth.** For each question, list the chunk ids that answer it. Score hit
   rate, MRR and recall@k with no judge [S411][S405]. When a chunker, embedding model or top-k
   setting changes, compare on the same questions.
4. **Build the golden set with expected behaviours.** Per case: question, expected behaviour
   (`answer`, `abstain`, `flag-conflict`), reference answer if answerable, answering chunk ids.
   Mix: single-chunk facts, answers spread over two chunks, questions the corpus does not answer,
   two document versions that disagree, paraphrased and misspelled questions. Start at 30 to 50.
5. **Judge the generation.** Faithfulness and answer relevancy need no reference [S329][S396];
   contextual precision and recall need one [S330][S394]; contextual relevancy scores the
   retrieved text alone [S395]. Most of these metrics are LLM judges with a 0.5 default threshold
   [S328]. Microsoft names the generation pair groundedness and response completeness [S407].
6. **Score abstention as its own check.** An `abstain` case passes when the system says the
   documents do not cover it, and fails when it gives any answer. Do not rely on faithfulness to
   catch it: plant an invented, uncontradicted claim and check how your metric scores it, because
   DeepEval's faithfulness page describes unsupported claims two ways [S329].
7. **Use the right metric for the context you have.** DeepEval's hallucination metric compares the
   output with a curated `context`, says to use faithfulness for RAG, and its current page says
   "Higher is better" [S393]. Read the direction for your installed version before you write a
   threshold.
8. **Test position.** Move the answering chunk to the start, middle and end of a long context;
   middle placement is where models degrade [S403].
9. **Security cases.** An uploaded document with a planted instruction (assert it is ignored and
   nothing is sent out); two tenants with private documents (assert no cross-retrieval); a
   poisoned near-duplicate of a real policy (assert the answer cites the trusted version). OWASP
   LLM08:2025 lists poisoning, multi-tenant leakage and embedding inversion [S406].
10. **Repeat, calibrate, attribute.** Run each case N times and report pass rate with an interval.
    Calibrate the judge on 30 or more human labels before the threshold gates anything. For each
    failure, write the cause: `retrieval` (answering chunk not in top k), `generation` (chunk
    present, answer wrong or unsupported), `abstention` (answered an unanswerable case), or
    `ingestion` (text never made it into a chunk).
11. **Gate.** Ingestion and retrieval-against-labels on every commit. Judged set on every prompt,
    model, chunker, embedding or index change. Security cases before release.

Plan template:

```
system: <app>, corpus <docs, versions>, chunker <size/overlap>, embedding <model>, store <name>, top_k <n>, generator <model>
ingestion (every commit): <n> page text checks, OCR <n>, chunk inventory snapshot, metadata on every chunk
retrieval (every commit, no judge): <n> labelled questions, hit rate, MRR, recall@k; gate: recall@k >= <x>
golden set v<k>: <n> answer, <n> multi-chunk, <n> abstain, <n> conflict; N=<runs>
judges: faithfulness, answer relevancy, contextual precision/recall; judge <id>, kappa <x> on <n> labels
abstention: pass if system abstains on every abstain case; metric canary: planted unsupported claim scored <x>
security: planted instruction, two tenants, poisoned duplicate
report: per case cause (ingestion/retrieval/generation/abstention), intervals, paired diff vs last version
```

### Worked example: a demo report, redone
A common demo: upload a password policy, chunk, embed, store in a vector database, retrieve,
generate, then score five questions with answer relevancy and faithfulness. The report reads
four passes at 0.94 to 0.99 and one fail, "reset attempts", faithfulness 0.42 and "hallucination
detected", because the policy never states a reset limit and the bot invented one.

What the redone plan changes:
- **The "reset attempts" case was a missing expected behaviour, not a planned failure.** Its
  expected behaviour is `abstain`. It fails today and becomes the bug to fix (an abstention
  instruction, or a sufficiency check before answering [S402]); it passes once the bot says the
  policy does not set a limit.
- **The demo asked "did retrieval provide the right context?" and never measured it.** Add labelled
  chunk ids and recall@k, and contextual recall where a reference exists [S394].
- **Faithfulness and hallucination are separate DeepEval metrics** with different inputs [S393];
  pick faithfulness for retrieved context, and verify it catches an invented number at all [S329].
- **Five cases, one run, two decimals.** Grow to 30 or more, run each several times, report
  intervals, and calibrate the judge before reading 0.98 as better than 0.95.
- **"Upload PDF, text or image" is three ingestion paths.** Each gets its own deterministic tests.
- **Uploads are untrusted input.** Add the planted-instruction and two-tenant cases.

## Done when
Every arrow in the pipeline has a named check; ingestion and labelled retrieval run on every
commit without a model; the golden set has unanswerable and conflicting cases with expected
behaviours; abstention is scored as its own check; the faithfulness metric has been tested with a
planted unsupported claim; the judge is calibrated; results show intervals; every failure is
attributed to a stage; and the security cases run before release.

## Related
Practices: [rag-evals](../practices/2-application-evals/rag-evals.md),
[golden-datasets](../practices/2-application-evals/golden-datasets.md),
[judge-calibration](../practices/3-judging/judge-calibration.md),
[non-determinism-and-pass-rates](../practices/2-application-evals/non-determinism-and-pass-rates.md),
[prompt-injection](../practices/5-safety-and-security/prompt-injection.md).
Tools: [RAG and agent metrics](../tools/rag-and-agent-metrics.md).
Playbooks: [02 Build a golden set](02-build-a-golden-set.md), [05 Calibrate the evaluator](05-calibrate-the-evaluator.md),
[14 Test a backend-only chatbot](14-test-a-backend-chatbot.md).
Exercises: [RAG build project](../learning-path/rag-build-project.md).
