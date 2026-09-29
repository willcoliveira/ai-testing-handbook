# Sweep list

Bounded on purpose. Add a line only with a reason, and remove one when you do.

`Register ids` are the rows a page covers: after the sweep, `node scripts/bump-checked.mjs --sweep`
sets their `last_checked` to today (or `--only-group "<group heading>"` for one group). Blank means no
row covers the page yet; add the id when a row is registered from it.

## Lab pages (9)
| Page | Area | Register ids | Notes |
|---|---|---|---|
| https://www.anthropic.com/research | 5, 4 | S038 S072 S073 S100 S101 S287 S288 | research posts |
| https://www.anthropic.com/engineering | 2, 4 | S032 S040 S079 S166 | engineering posts |
| https://www.anthropic.com/rsp-updates | 5 | S096 S097 | RSP version changes |
| https://deploymentsafety.openai.com/ | 5 | S103 | system cards and safety evaluations |
| https://deepmind.google/blog | 5 | S108 S295 | frontier safety framework changes; listing shows month-only dates for recent posts, open a post to confirm its day |
| https://ai.meta.com/blog | 5, 7 | S113 | model releases and evals |
| https://metr.org/blog | 1, 5 | S015 S285 S286 | third-party evaluation |
| https://www.aisi.gov.uk/blog | 4, 5 | S117 S228 | Inspect and evaluations; the home page carries no dates, replaced by /blog on 2026-09-29 |
| https://www.apolloresearch.ai/science | 5 | S289 S290 | scheming and audit research; /research lagged the /science posts, replaced on 2026-09-29 |

## Vendor pages for the labs covered in labs/ (9)
| Page | Area | Register ids | Notes |
|---|---|---|---|
| https://blogs.microsoft.com/on-the-issues/ | 5, 8 | S246 S291 | responsible AI and frontier governance posts |
| https://www.amazon.science/blog | 5, 7 | S254 S255 | Nova reports and the frontier model safety framework |
| https://developer.nvidia.com/blog | 4, 5 | | Nemotron, NeMo Evaluator, guardrails |
| https://cohere.com/blog | 5, 7 | | Command releases and the frontier model framework |
| https://mistral.ai/news | 5, 7 | S259 S262 S292 | model releases and moderation |
| https://huggingface.co/deepseek-ai | 5, 7 | S297 | model cards with dates; the GitHub org page lists no dates |
| https://huggingface.co/Qwen | 5, 7 | S221 S222 S223 | model cards with dates; qwen.ai/blog is script-rendered and returns nothing |
| https://huggingface.co/moonshotai | 5, 7 | S226 | model cards with dates; moonshotai.github.io redirects |
| https://huggingface.co/zai-org | 5, 7 | | model cards with dates; z.ai/blog is a 404 |

## Tool release pages (10)
| Repository releases page | Register ids | Register notes to compare |
|---|---|---|
| https://github.com/UKGovernmentBEIS/inspect_ai/releases | S066 | inspect_ai version; the repo publishes no GitHub releases, compare PyPI inspect-ai and CHANGELOG.md |
| https://github.com/promptfoo/promptfoo/releases | S068 | promptfoo version |
| https://github.com/confident-ai/deepeval/releases | S070 | deepeval version |
| https://github.com/langfuse/langfuse/releases | S071 | langfuse version |
| https://github.com/safety-research/petri/releases | S072 S101 | petri version (redirects to meridianlabs-ai/inspect_petri) |
| https://github.com/safety-research/bloom/releases | S073 | bloom version |
| https://github.com/sierra-research/tau2-bench/releases | S012 S078 | tau2 version |
| https://github.com/open-telemetry/semantic-conventions-genai/releases | S136 S203 | GenAI semconv version (the conventions moved to their own repository) |
| https://github.com/mlcommons/ailuminate/releases | S120 | ailuminate version |
| https://github.com/stanford-crfm/helm/releases | S118 | helm version |

## arXiv queries (4), top 5 by date each
- `cat:cs.CL AND (ti:"LLM-as-a-judge" OR ti:evaluator)`
- `cat:cs.SE AND ti:agent AND ti:benchmark`
- `cat:cs.CL AND ti:contamination`
- `cat:cs.CR AND ti:"prompt injection"`

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
