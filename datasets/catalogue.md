# Catalogue of public evaluation datasets met in the area 2 sources

Only sets named in a registered source appear here. Size, licence and date are stated only where the source
states them; "not stated" means the source did not say, not that the fact is unknown elsewhere. The source id
is where the set was met, not necessarily the set's own paper.

| Name | What it is good for | Size | Licence | Date | Source id |
|---|---|---|---|---|---|
| MMLU | Multiple-choice accuracy across 57 tasks from mathematics to law; a general knowledge yardstick, sensitive to answer formatting (about 5 percent) and likely seen in training | 57 tasks; question count not stated | not stated | not stated | [S038] |
| BBQ (Bias Benchmark for QA) | Social bias in question answering across nine social dimensions; scored from -1 (anti-stereotypical) to 1 (stereotypical) | not stated | not stated | not stated | [S038] |
| BIG-bench | Broad capability battery; 204 evaluations from over 450 authors; Anthropic found it hard to run in full | 204 tasks | not stated | not stated | [S038] |
| BIG-bench Hard | The 23 hardest BIG-bench tasks as a smaller battery | 23 tasks | not stated | not stated | [S038] |
| HELM | A suite and harness across many datasets with accuracy, calibration and fairness metrics; slow to iterate ("months") | compilation of datasets | not stated | 2022 per [S037] | [S038], [S037] |
| SWE-bench Verified | Coding-agent tasks graded by outcome; named as a public agent benchmark | not stated | not stated | not stated | [S032] |
| Terminal-Bench | Terminal and shell tasks for agents; the 2.0 card on the Hub is tagged as an RL environment | not stated | not stated | not stated | [S032], [S044] |
| tau-Bench and tau2-Bench | Tool-using conversational agents with a simulated user; pass^k consistency reporting | not stated | not stated | not stated | [S032] |
| BrowseComp | Browsing and research agents | not stated | not stated | not stated | [S032] |
| WebArena | Web-navigation agents in realistic sites | not stated | not stated | not stated | [S032] |
| OSWorld | Computer-use agents on a desktop | not stated | not stated | not stated | [S032] |
| FIB (Factual Inconsistency Benchmark) | Detecting hallucinated summaries; the article uses it for NLI-style factual-consistency evals | not stated | described as permissive in [S037] | 2022 | [S037] |
| USB (Unified Summarization Benchmark) | Multi-task summarisation including factual consistency | not stated | described as permissive in [S037] | 2023 | [S037] |
| CNN/DailyMail | Abstractive news summarisation reference set | not stated | not stated | not stated | [S037] |
| XSum | Single-sentence abstractive summarisation | not stated | not stated | not stated | [S037] |
| Yelp opinion summarisation set | Opinion summarisation with human summaries | 100 instances | not stated | 2019 | [S037] |
| OpinSummEval | Opinion summarisation evaluation | not stated | not stated | 2023 | [S037] |
| WMT test sets | Annual machine-translation evaluation; human ratings from WMT 2017 to 2019 train BLEURT-20 and COMET-20 | varies by year | not stated | annual, 2017 to 2023 referenced | [S037] |
| MLQE-PE | Translation quality estimation and post-editing; used to train COMETKiwi | not stated | not stated | 2020 | [S037] |
| RealToxicityPrompts | Toxicity of generations from web prompts, binned into four toxicity quantiles; scored with Perspective API at p >= 0.5 | not stated | not stated | 2020 | [S037] |
| BOLD | Bias in open-ended generation from Wikipedia prompts about professions, gender, race, religion, ideology | not stated | not stated | 2021 | [S037] |
| BooksCorpus sample (copyright regurgitation) | Exact and near-exact reproduction of book text; the cited study used 1,000 random books plus 20 bestsellers | 1,020 books | not stated | not stated | [S037] |
| Linux kernel functions (copyright regurgitation) | Reproduction of source code; 2,000 random functions | 2,000 functions | GPL per [S037] | not stated | [S037] |
| Prime versus composite question set | Fixed arithmetic probe used to detect drift between model snapshots | 1,000 questions | not stated | 2023 | [S041] |
| Happy-numbers set | Second arithmetic drift probe | 500 questions | not stated | 2023 | [S041] |
| Sensitive-questions set | Refusal rate on harmful requests across snapshots | 100 questions | not stated | 2023 | [S041] |
| OpinionQA | Survey-style opinion questions; response rate as a drift signal | 1,506 questions | not stated | 2023 | [S041] |
| LeetCode problem sample | Directly executable code generation across snapshots | 50 problems | not stated | 2023 | [S041] |
| USMLE questions | Medical licensing exam accuracy across snapshots | not stated | not stated | 2023 | [S041] |
| HotpotQA (via a LangChain agent) | Multi-hop question answering with tools, exact match | not stated | not stated | 2023 | [S041] |
| ARC visual reasoning sample | Abstract visual reasoning across snapshots | 467 samples | not stated | 2023 | [S041] |

Learned metrics met in the same sources, with the licences the source records: BLEURT-20 (Apache-2.0), COMET-20
(Apache-2.0), COMET-22 (non-commercial), COMETKiwi (non-commercial), chrF (character n-gram F-score, no model)
[S037]. Perspective API is a hosted classifier, not a dataset [S037].

For how to build a set of your own, see [README.md](README.md).
