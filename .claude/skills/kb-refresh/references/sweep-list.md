# Sweep list

Bounded on purpose. Add a line only with a reason, and remove one when you do.

`Register ids` are the rows a page covers: after the sweep, `node scripts/bump-checked.mjs --sweep`
sets their `last_checked` to today (or `--only-group "<group heading>"` for one group). Blank means no
row covers the page yet; add the id when a row is registered from it.

## Lab pages (10)
| Page | Area | Register ids | Notes |
|---|---|---|---|
| https://www.anthropic.com/research | 5, 4 | S038 S072 S073 S100 S101 S287 S288 S422 S423 S431 S432 | research posts |
| https://www.anthropic.com/engineering | 2, 4 | S032 S040 S079 S166 | engineering posts; the featured post at the top shows no date on the listing and changes (2026-05-25 on 2026-10-12, 2026-10-13 a day later), so open it before treating it as new or old; 2026-10-13: note made generic |
| https://www.anthropic.com/rsp-updates | 5 | S096 S097 | RSP version changes |
| https://deploymentsafety.openai.com/ | 5 | S103 S416 | system cards and safety evaluations |
| https://deepmind.google/blog | 5 | S108 S295 | frontier safety framework changes; listing shows month-only dates for recent posts, open a post to confirm its day; 2026-10-13: model launch posts (Gemini 4 Argon) link out to blog.google and developers.googleblog.com, which are not on this list |
| https://blog.google/innovation-and-ai/models-and-research/gemini-models/rss/ | 5, 7 |  S434 | Gemini model launches (RSS, newest first, full pubDate on every item); 2026-10-13: added on the reviewer's approval because deepmind.google/blog links launches out to blog.google with month-only dates; the listing pages (gemini-models, technology/google-deepmind, products/gemini) show no dates, so the feed is used; tested 2026-10-13, 20 items 2026-08-03 to 2026-10-13, 10 of 20 model launches by title, the rest roundups and showcases to skip |
| https://ai.meta.com/blog | 5, 7 | S113 | model releases and evals |
| https://metr.org/blog | 1, 5 | S015 S285 S286 S387 S413 | third-party evaluation |
| https://www.aisi.gov.uk/blog | 4, 5 | S117 S228 S389 S417 S433 | Inspect and evaluations; the home page carries no dates, replaced by /blog on 2026-09-29 |
| https://www.apolloresearch.ai/science | 5 | S289 S290 | scheming and audit research; /research lagged the /science posts, replaced on 2026-09-29 |

## Vendor pages for the labs covered in labs/ (9)
| Page | Area | Register ids | Notes |
|---|---|---|---|
| https://blogs.microsoft.com/on-the-issues/ | 5, 8 | S246 S291 | responsible AI and frontier governance posts |
| https://www.amazon.science/blog | 5, 7 | S254 S255 | Nova reports and the frontier model safety framework |
| https://developer.nvidia.com/blog | 4, 5 | S420 S426 | Nemotron, NeMo Evaluator, guardrails |
| https://cohere.com/blog | 5, 7 | S388 | Command releases and the frontier model framework |
| https://mistral.ai/news | 5, 7 | S259 S262 S292 S412 | model releases and moderation |
| https://huggingface.co/deepseek-ai | 5, 7 | S297 | model cards with dates; the GitHub org page lists no dates; 2026-10-13: Hugging Face org pages show relative dates only ("1 day ago"), so resolve them against the run date, and open a model's `/commits/main` to see whether the card or only code changed |
| https://huggingface.co/Qwen | 5, 7 | S221 S222 S223 | model cards with dates; qwen.ai/blog is script-rendered and returns nothing |
| https://huggingface.co/moonshotai | 5, 7 | S226 | model cards with dates; moonshotai.github.io redirects |
| https://huggingface.co/zai-org | 5, 7 | S430 | model cards with dates; z.ai/blog is a 404 |

## Tool release pages (10)
| Repository releases page | Register ids | Register notes to compare |
|---|---|---|
| https://github.com/UKGovernmentBEIS/inspect_ai/releases | S066 | inspect_ai version; the repo publishes no GitHub releases, compare PyPI inspect-ai and CHANGELOG.md; 2026-10-12: blob/main/CHANGELOG.md returns only page chrome, fetch it with `?plain=1`; 2026-10-13: https://pypi.org/pypi/inspect-ai/json is truncated before the upload times, use https://pypi.org/pypi/inspect-ai/<version>/json for a release date |
| https://github.com/promptfoo/promptfoo/releases | S068 | promptfoo version; 2026-10-12: the register tracks npm, so also fetch https://registry.npmjs.org/promptfoo/latest (it has no publish time; take the date from the GitHub release) |
| https://github.com/confident-ai/deepeval/releases | S070 | deepeval version; 2026-10-13: GitHub releases stop at python-v4.2.4, PyPI is ahead, so compare https://pypi.org/pypi/deepeval/<version>/json (the unversioned JSON is truncated) |
| https://github.com/langfuse/langfuse/releases | S071 | langfuse version |
| https://github.com/safety-research/petri/releases | S072 S101 | petri version (redirects to meridianlabs-ai/inspect_petri) |
| https://github.com/safety-research/bloom/releases | S073 | bloom version; 2026-10-13: the releases page is empty, the v1.1.0 tag is on https://github.com/safety-research/bloom/tags |
| https://github.com/sierra-research/tau2-bench/releases | S012 S078 | tau2 version |
| https://github.com/open-telemetry/semantic-conventions-genai/releases | S136 S203 | GenAI semconv version (the conventions moved to their own repository); 2026-10-13: there are no releases, and PR #374 (2026-09-22) went unnoticed for three runs because only releases and recent PRs were compared, so also read the metric names in https://raw.githubusercontent.com/open-telemetry/semantic-conventions-genai/main/docs/gen-ai/gen-ai-token-metrics.md and .../docs/gen-ai/client-inference.md (about 116k characters, read in two parts) against the S136 note, and list the new files in https://github.com/open-telemetry/semantic-conventions-genai/tree/main/changelog.d (`*.breaking.md`) |
| https://github.com/mlcommons/ailuminate/releases | S120 | ailuminate version; 2026-10-12: the repo publishes no GitHub releases, the register's v1.0 and v1.1 are benchmark versions, so a "no releases" page is no change |
| https://github.com/stanford-crfm/helm/releases | S118 | helm version |

## arXiv queries (5), top 5 by date each, one at a time

2026-10-13: arXiv announces with a lag; papers submitted Friday to Monday appear on Tuesday evening, so a run early in the week sees nothing from the last few days and the next run gets overlap hits. A result submitted in the three days before `--since` that is in neither the register nor the previous digest was never seen; it is in the window (kb-refresh step 2, changed 2026-10-13).

- `cat:cs.CL AND abs:"LLM-as-a-judge"` (2026-10-12: replaces `cat:cs.CL AND (ti:"LLM-as-a-judge" OR ti:evaluator)`, whose title search stems `evaluator` to "Evaluation" and returned no judge papers; tested 2026-10-12, 3 of 5 on-target, 1 partly, all from the past ten days)
- `cat:cs.SE AND ti:agent AND ti:benchmark`
- `(cat:cs.CL OR cat:cs.LG) AND (ti:"data contamination" OR ti:"benchmark contamination" OR ti:"test set contamination")` (2026-10-13: replaces `cat:cs.CL AND ti:contamination`, 2 of 5 on-target, where "contamination" mostly meant prompt distractors or false premises, and nothing accepted in three digests; `cat:cs.CL AND (abs:"data contamination" OR abs:"benchmark contamination")` tested 1 of 5 and `(cat:cs.CL OR cat:cs.LG) AND ti:contamination AND (abs:benchmark OR abs:"training data")` 0 of 5; this form tested 3 of 5 on-target, 2026-08-11 to 2026-09-11)
- `cat:cs.CR AND ti:"prompt injection"`
- `(cat:cs.AI OR cat:cs.LG OR cat:cs.SE) AND (ti:"reward hacking" OR abs:"evaluation awareness")` (2026-10-12: added for evaluation integrity, agents gaming graders and tests, the theme of S387, S418 and S423; tested 2026-10-12, 5 of 5 on-target, 2026-10-03 to 2026-10-09)

Query form: `https://export.arxiv.org/api/query?search_query=<query>&sortBy=submittedDate&sortOrder=descending&max_results=5`

## Standards (3)
| Page | Register ids |
|---|---|
| https://genai.owasp.org/resources/ | S121 S122 S163 S281 S282 S283 S284 |
| https://www.nist.gov/itl/ai-risk-management-framework | S127 S159 |
| https://code-of-practice.ai/ | S128 S161 |

## Checked by hand, not fetched
- https://x.ai/news: returned HTTP 403 to WebFetch on 2026-09-28 and 2026-09-29. Grok cards (S263 to
  S266) are PDFs on data.x.ai and media.x.ai; read them by hand and record the result in the digest.
