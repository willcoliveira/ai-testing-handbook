---
id: golden-datasets
title: Golden datasets
area: 2-application-evals
status: draft
last_reviewed: 2026-09-26
sources: [S031, S032, S033, S036, S038, S039, S041, S042, S043, S044, S048, S050]
related: [eval-driven-development, criteria-authoring, data-contamination, benchmark-hygiene, model-and-system-cards, online-evals-and-drift]
---

# Golden datasets

## What
A golden dataset is the fixed, versioned set of cases an application is measured against: inputs, the
context the app would see, and for each case either a reference answer or a criterion a grader can apply.
It is "golden" because a human has looked at every case and agreed it is representative and gradeable.
Braintrust's docs call datasets "versioned collections of test cases that power repeatable evaluations"
[S050]. The set is split into what may appear in prompts, what is used while tuning graders, and what is
held back for a final check [S042].

## Why
A team needs a stable yardstick because the thing being measured moves. The same model snapshot name can
change behaviour: on 1,000 prime-versus-composite questions GPT-4 went from 84.0 percent in March 2023 to
51.1 percent in June 2023, and directly executable code on 50 LeetCode problems went from 52.0 to 10.0
percent [S041]. Without a fixed set, that shift looks like noise. The set also replaces public benchmarks
for product work: Anthropic's own account of implementing MMLU found a formatting change from "(A)" to
"(1)" moves accuracy by about 5 percent and that "models are more likely to encounter MMLU questions during
training" [S038]. A benchmark tells you about the model; a golden set tells you about your distribution.

The trade-off is cost and staleness. Every case costs a human read, and a set that never changes stops
finding anything: "If everything keeps passing, this is a sign that the eval is less useful and should be
run less often or retired" [S042].

## How
1. **Source cases from production traces first.** Hamel's FAQ: start with 100 diverse traces and annotate
   the first 30 yourself; sample by random draw, clustering, classification and user feedback, and "Keep
   some random traces in every batch" so you still see the unexpected [S042]. Braintrust describes the
   same inputs: "Build datasets from production logs, user feedback, manual curation" [S050]. Anthropic:
   "20-50 simple tasks drawn from real failures is a great start" [S032].
2. **Organise by feature and scenario.** Hamel's structure for Rechat was to "break down the scope of your
   LLM into features and scenarios" and generate inputs per cell, then let a small group of users refine
   the generation strategy [S036]. Anthropic's edge-case list belongs in every grid: irrelevant or nonexistent
   input, overly long input, harmful input, and ambiguous cases "where even humans would find consensus
   difficult" [S031].
3. **Use synthetic generation for coverage, not for truth.** The FAQ's recipe: define the dimensions of
   variation, write about 20 tuples by hand, have an LLM generate more tuples and turn them into natural
   language, run them through the real system to capture full traces, then do error analysis on about 100
   of them [S042]. It also names where synthetic data is unreliable: complex domain-specific content,
   low-resource languages, high-stakes domains, under-represented user groups [S042].
4. **Size by stage, not by a magic number.** Anthropic's docs use 1,000 tweets for exact-match sentiment,
   50 FAQ groups for consistency, 200 articles for summarisation, 100 inquiries for tone, 500 queries for
   PHI, and a 10,000-post held-out set in the criteria example [S031]. OpenAI's example uses a held-out
   set of 1000 transcripts [S033]. For LLM graders, the FAQ asks for 100 to 200 labelled examples per
   failure mode [S042]. Anthropic notes that early on "small sample sizes suffice" because effect sizes
   are large [S032].
5. **Hold out with discipline.** Split into train, dev and test: "Use 10 to 20 percent for train examples
   that may appear in the prompt. Use 40 to 45 percent for dev while refining the judge. Reserve the
   remaining 40 to 45 percent for one final test" [S042]. The test slice is used once, after prompt work
   ends.
6. **Require agreement before a case is golden.** "A good task is one where two domain experts would
   independently reach the same pass/fail verdict" [S032]. Label as pass or fail, not on a scale [S042].
7. **Version and pin.** Braintrust: "Every change is tracked, so experiments can pin to specific versions"
   [S050], and an experiment captures "an immutable snapshot" [S043]. Record the dataset version next to
   the prompt version and model id for every run.
8. **Document with a datasheet or card.** Gebru et al. propose seven sections: motivation, composition,
   collection process, preprocessing/cleaning/labeling, uses, distribution, maintenance [S039]. Hugging
   Face's card template adds Direct Use, Out-of-Scope Use, Personal and Sensitive Information, and Bias,
   Risks and Limitations [S048], and its YAML metadata carries `license`, `language` and `task_categories`
   [S044]. See [datasets/README.md](../../datasets/README.md).
9. **Refresh on a cadence.** Re-run error analysis every 2 to 4 weeks on 100 or more fresh traces and
   retire cases that always pass [S042]. Anthropic: "Eval saturation occurs when an agent passes all of
   the solvable tasks, leaving no room for improvement" [S032].

## Who does it (sourced)
- **Anthropic, 2026-01-09:** says it seeds agent eval sets from real failures at 20 to 50 tasks, keeps
  separate regression and capability sets, and treats the suite as "a living artifact" with an owner
  [S032].
- **Anthropic, 2023-10-04:** says implementing MMLU exposed formatting sensitivity of about 5 percent and
  probable training contamination, and that BBQ took one engineer one uninterrupted week to implement
  [S038].
- **OpenAI, living docs (checked 2026-09-26):** states criteria against held-out sets and says to "grow the
  eval set over time" [S033].
- **Hamel Husain on Rechat, 2024-03-29:** says cases were organised by feature and scenario, generated
  synthetically with an LLM, and refined from early user traffic [S036].
- **Hamel Husain, living FAQ (checked 2026-09-26):** gives the 100-trace start, the 30 self-annotated, the
  100 to 200 per failure mode, the 10-20 / 40-45 / 40-45 split, and the 2 to 4 week refresh [S042].
- **Braintrust, living docs (checked 2026-09-26):** says datasets are versioned, pinnable by experiment,
  and built from production logs and feedback [S050], [S043].
- **Chen, Zaharia and Zou, 2023-10-31 (v3):** ran fixed question sets against March and June 2023 snapshots
  at temperature 0.1 and conclude on "the need to continuously monitor LLMs' behavior over time" [S041].

## Pitfalls
1. **Tuning the prompt on the test slice.** The final slice is reserved "for one final test"; using it
   during iteration turns a held-out set into a training set [S042].
2. **Cases nobody agrees on.** If two experts would not reach the same verdict, the case measures the
   grader, not the app [S032].
3. **Only synthetic inputs.** Synthetic data misses domain detail, minority users and high-stakes cases
   [S042]; production traces must stay in the mix [S036].
4. **Reusing a public benchmark as the product set.** Formatting sensitivity and training contamination
   make the number unstable and unrepresentative [S038].
5. **No version pin.** A result without dataset, prompt and model version cannot be compared with the next
   one [S050], [S043].

## Pattern from a production build
None yet.

## Sources
- [S031] Create strong empirical evaluations, Anthropic Claude Platform docs, living (checked 2026-09-26).
- [S032] Demystifying evals for AI agents, Anthropic engineering, 2026-01-09.
- [S033] Evaluation best practices, OpenAI developer docs, living (checked 2026-09-26).
- [S036] Your AI product needs evals, Hamel Husain, 2024-03-29.
- [S038] Challenges in evaluating AI systems, Anthropic, 2023-10-04.
- [S039] Datasheets for Datasets, Gebru et al., arXiv v8 2021-12 (CACM December 2021).
- [S041] How is ChatGPT's behavior changing over time?, Chen, Zaharia, Zou, arXiv v3 2023-10-31.
- [S042] Frequently asked questions (and answers) about AI evals, Hamel Husain, living (checked 2026-09-26).
- [S043] Evaluate (overview), Braintrust docs, living (checked 2026-09-26).
- [S044] Dataset Cards, Hugging Face Hub docs, living (checked 2026-09-26).
- [S048] Dataset card template, Hugging Face huggingface_hub repository, living (checked 2026-09-26).
- [S050] Datasets (guide), Braintrust docs, living (checked 2026-09-26).
