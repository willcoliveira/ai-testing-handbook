# Evaluation datasets: how a set is built

This folder is about the sets an application is measured against, not about public benchmarks. The
[catalogue](catalogue.md) lists public sets met in the sources for area 2. Every claim below carries a source
id that resolves in the [register](../sources.md).

## Where cases come from

**Production traces first.** The cheapest honest case is one a user already produced. Hamel Husain's FAQ says
to start with 100 diverse traces and annotate the first 30 yourself, then sample by random draw, clustering,
classification and user feedback, and to "Keep some random traces in every batch" so unexpected failures still
surface [S042]. Braintrust describes the same feeds: "Build datasets from production logs, user feedback, manual
curation" [S050]. OpenAI's agent docs say to "start with traces when you are still debugging behavior" and move
to datasets and eval runs for benchmarking changes over time [S035]. Anthropic's advice for agents is
"20-50 simple tasks drawn from real failures is a great start" [S032].

**Failures over successes.** A case that already passes tells you little. Hamel: "One signal you are writing
good tests and assertions is when the model struggles to pass them" [S036]. Anthropic separates capability
cases, which "should start at a low pass rate", from regression cases, which "should have a nearly 100% pass
rate" [S032].

**Feature by scenario.** Rechat's set was built by breaking "the scope of your LLM into features and
scenarios" and generating inputs for each cell [S036]. Anthropic's edge-case list belongs in every grid:
irrelevant or nonexistent input, overly long input, harmful input, ambiguous cases "where even humans would
find consensus difficult" [S031].

## Synthetic generation and its limits

Synthetic inputs fill cells the traffic has not reached yet. Hamel's Rechat post: "You don't need to wait for
production data to test your system", generate inputs with an LLM from domain-specific prompts, then "let a
small set of users use your product and let their usage refine your synthetic data generation strategy" [S036].

The FAQ gives a recipe: define the dimensions of variation; write about 20 tuples by hand; have an LLM generate
structured tuples and convert them to natural language; run them through the real system to capture full
traces; do error analysis on about 100 of the resulting traces [S042]. It also names where synthetic data is
unreliable: complex domain-specific content, low-resource languages, high-stakes domains, and under-represented
user groups [S042]. Treat synthetic cases as coverage, and keep production traces as the ground.

## Held-out discipline

The set is split by purpose. Hamel's FAQ: "Use 10 to 20 percent for train examples that may appear in the
prompt. Use 40 to 45 percent for dev while refining the judge. Reserve the remaining 40 to 45 percent for one
final test" [S042]. The test slice is touched once, after prompt work ends. Anthropic's criteria example is
phrased "On a held-out test set of 10,000 diverse Twitter posts" [S031]; OpenAI's is "On a held-out set of 1000
reference transcripts" [S033]. A number reported without saying which slice it came from is not a result.

## Size guidance from the sources

| Purpose | Size | Source |
|---|---|---|
| First agent eval set, from real failures | 20 to 50 tasks | [S032] |
| First manual review before any infrastructure | 20 to 50 outputs, 30 minutes | [S042] |
| Error discovery | 100 or more traces, first 30 annotated yourself | [S042] |
| Judge-alignment rounds | 25 to 50 examples per round | [S036] |
| Validating an LLM judge | 100 to 200 labelled examples per failure mode | [S042] |
| Repeatable regression set | 100 or more cases | [S042] |
| Exact-match classification example | 1,000 tweets; 10,000 held out in the criteria example | [S031] |
| Consistency, summarisation, tone, PHI, context examples | 50 groups, 200 articles, 100 inquiries, 500 queries, 100 conversations | [S031] |
| Summarisation reference set | 1000 transcripts | [S033] |
| NLI factual-consistency eval | "a thousand samples or more" | [S037] |
| Repeats per case when the grader is a model | 3 to 5 trials | [S049] |

Anthropic notes that early in development "small sample sizes suffice" because effect sizes are large [S032].

## Labelling

Labels are binary. "Binary evaluations force clearer thinking and more consistent labeling. Likert scales
introduce significant challenges" [S042]; Hamel found granular ratings "more onerous to manage than binary
ratings" [S036]. The gradeability test is agreement: "A good task is one where two domain experts would
independently reach the same pass/fail verdict" [S032]. Collect the labeller's critique with the label; Rechat
used it to align the model grader, in rounds of 25 to 50 examples, and tracked the grader's precision and recall
separately [S036]. Anthropic: "LLM-based rubrics should be frequently calibrated against expert human judgment"
[S032]. Reference answers are not required before annotating; the FAQ treats them as optional [S042].

## Documentation: datasheets and dataset cards

Gebru et al. propose a datasheet for every dataset with seven sections: motivation, composition, collection
process, preprocessing/cleaning/labeling, uses, distribution, maintenance, answered by the dataset's creators
before release [S039]. Sample questions: "For what purpose was the dataset created?", "How many instances are
there in total?", "Is the raw data saved in addition to the preprocessed/cleaned/labeled data?", "Will the
dataset be updated? If so, how often and by whom?" [S039].

Hugging Face's dataset card is the same idea as a `README.md` rendered on the Hub [S044]. Its template carries
Dataset Details, Uses (Direct Use, Out-of-Scope Use), Dataset Structure, Dataset Creation (Curation Rationale,
Source Data, Annotations, Personal and Sensitive Information), Bias, Risks and Limitations, and Citation [S048].
The YAML header holds `language`, `pretty_name`, `tags`, `license` and `task_categories`, and a linked paper
becomes an `arxiv:` tag [S044]. An internal golden set deserves the same file, and the Personal and Sensitive
Information section is where a set built from production traces says what was redacted.

## Licensing

Say what the cases may be used for. On the Hub the licence is a metadata field and is displayed when it uses a
listed identifier [S044]; a datasheet answers it under distribution [S039]. Learned metrics carry licences too:
Eugene Yan records BLEURT-20 and COMET-20 as Apache-2.0 and COMET-22 and COMETKiwi as non-commercial [S037]. A
set built from customer traffic is not redistributable by default; write that down in the card.

## Versioning

A result is comparable only if it names the dataset version, the prompt version and the model snapshot.
Braintrust: datasets are "versioned collections of test cases" and "Every change is tracked, so experiments can
pin to specific versions" [S050]; an experiment is "an immutable snapshot" [S043]. Hamel: "collect metrics along
with versions of your tests/prompts outside your CI system" [S036]. Model snapshots are dated ids of the form
`gpt-4o-2024-08-06` [S034], never an alias, because the alias moved by tens of points within three months in
the drift study [S041].

## Contamination and staleness

Two ways a set stops measuring. First, leakage: Anthropic reports that "models are more likely to encounter
MMLU questions during training", and that a formatting change moved MMLU accuracy by about 5 percent [S038]. The
internal equivalent is a test slice that leaked into the prompt or into fine-tuning data; the split above is the
control [S042]. Second, saturation: "Eval saturation occurs when an agent passes all of the solvable tasks,
leaving no room for improvement" [S032], and "If everything keeps passing, this is a sign that the eval is less
useful and should be run less often or retired" [S042]. Re-run error analysis every 2 to 4 weeks on 100 or more
fresh traces and review 10 to 20 traces weekly, focusing on outliers [S042]. An eval suite "is a living artifact
that needs ongoing attention and clear ownership to remain useful" [S032].

## Sources cited here

[S031] [S032] [S033] [S034] [S035] [S036] [S037] [S038] [S039] [S041] [S042] [S043] [S044] [S048] [S049] [S050],
all in the [register](../sources.md).
