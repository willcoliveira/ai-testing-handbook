# Sweep list

Bounded on purpose. Add a line only with a reason, and remove one when you do.

`Register ids` are the rows a page covers: after the sweep, `node scripts/bump-checked.mjs --sweep`
sets their `last_checked` to today (or `--only-group "<group heading>"` for one group). Blank means no
row covers the page yet; add the id when a row is registered from it.

## Lab pages (9)
| Page | Area | Register ids | Notes |
|---|---|---|---|
| https://www.anthropic.com/research | 5, 4 | S038 S072 S073 S100 S101 S287 S288 S422 S423 S431 S432 S460 S469 S487 | research posts; 2026-10-28: a summarising fetch of the listing miscounted (said eleven posts, listed eight); "List every post dated <month> in page order, with its exact date and URL. Do not summarise and do not skip any." returned all twelve October posts |
| https://www.anthropic.com/engineering | 2, 4 | S032 S040 S079 S166 | engineering posts; the featured post at the top shows no date on the listing and changes (2026-05-25 on 2026-10-12, 2026-10-13 a day later), so open it before treating it as new or old; 2026-10-13: note made generic; 2026-10-28: the featured post was at a /research/ URL (Redesigning source control, 2026-10-13, updated 2026-10-15) and the listing now shows its date |
| https://www.anthropic.com/rsp-updates | 5 | S096 S097 | RSP version changes |
| https://deploymentsafety.openai.com/ | 5 | S103 S416 S453 S464 S478 S480 S495 S496 | system cards and safety evaluations; 2026-10-28: listing links are relative to the host, and each card is an HTML page with a View PDF link; the HTML carries the text and tables; 2026-11-01: a card's slug can carry a different date from its Published line (the GPT-6 Luna addendum is at gpt-6-luna-october-28-2026-addendum and says "Published October 29, 2026"), so take the date from the Published line; 2026-11-06: the listing itself shows no Published line, so open each new card for it (both cards this run matched the listing's dates) |
| https://deepmind.google/blog | 5 | S108 S295 | frontier safety framework changes; listing shows month-only dates for recent posts, open a post to confirm its day; 2026-10-13: model launch posts (Gemini 4 Argon) link out to blog.google and developers.googleblog.com, which are not on this list; 2026-11-01: the listing is not in date order (Genie 4, 2026-10-27, sits above Gemini 4 Carbon, 2026-10-28), so a post's position says nothing about its day |
| https://blog.google/innovation-and-ai/models-and-research/gemini-models/rss/ | 5, 7 | S434 S446 S474 | Gemini model launches (and safety posts filed under technology/safety-security, 2026-10-16: S446) (RSS, newest first, full pubDate on every item); 2026-10-13: added on the reviewer's approval because deepmind.google/blog links launches out to blog.google with month-only dates; the listing pages (gemini-models, technology/google-deepmind, products/gemini) show no dates, so the feed is used; tested 2026-10-13, 20 items 2026-08-03 to 2026-10-13, 10 of 20 model launches by title, the rest roundups and showcases to skip |
| https://metr.org/blog | 1, 5 | S015 S285 S286 S387 S413 S455 S458 S497 | third-party evaluation |
| https://www.aisi.gov.uk/blog | 4, 5 | S117 S228 S389 S417 S433 S459 S462 S463 | Inspect and evaluations; the home page carries no dates, replaced by /blog on 2026-09-29 |
| https://www.apolloresearch.ai/science | 5 | S289 S290 S452 | scheming and audit research; /research lagged the /science posts, replaced on 2026-09-29; 2026-10-16: banner items at the top link to undated /blog posts, open each to read its date |

Removed 2026-11-01: https://ai.meta.com/blog (register id S113), no post since 2026-07-27 and nothing accepted in the last four digests, which meets the removal rule; it had been kept on 2026-10-28 as the only Meta item. https://huggingface.co/meta-llama was tested as a replacement on 2026-11-01 and its newest model update is 2025-11-12, so no Meta page replaces it.

## Vendor pages for the labs covered in labs/ (8)
| Page | Area | Register ids | Notes |
|---|---|---|---|
| https://www.amazon.science/blog | 5, 7 | S254 S255 S456 | Nova reports and the frontier model safety framework; 2026-10-28: the listing is cut at 100,000 characters but runs newest first, so recent posts are in the part read |
| https://developer.nvidia.com/blog | 4, 5 | S420 S426 S448 S494 | Nemotron, NeMo Evaluator, guardrails; 2026-11-06: agent evaluation posts now name NeMo Compass and NeMo Eval Author (S494) rather than NeMo Evaluator, and most posts are infrastructure, so scan titles for eval, agent and safety terms |
| https://cohere.com/blog | 5, 7 | S388 S449 S465 | Command releases and the frontier model framework; 2026-10-28: the listing is not strictly in date order and showed a post dated a day after the run, so read each item's date; 2026-11-06: the listing was cut off on two fetches, so posts may be missed; https://cohere.com/blog/rss.xml was tested and serves the same HTML listing (page 1 of 28, 29 dated posts 2026-03-26 to 2026-11-04, also marked truncated), not a feed, so the listing is kept |
| https://mistral.ai/news | 5, 7 | S259 S262 S292 S412 S479 | model releases and moderation; 2026-10-28: the listing gives relative links, and a post page may show no date (Voxtral 3), so take the date from the listing |
| https://huggingface.co/deepseek-ai | 5, 7 | S297 | model cards with dates; the GitHub org page lists no dates; 2026-10-13: Hugging Face org pages show relative dates only ("1 day ago"), so resolve them against the run date, and open a model's `/commits/main` to see whether the card or only code changed; 2026-10-28: the relative date can be a day off ("12 days ago" for a repo whose commits are all 2026-10-17), so take dates from `/commits/main`, which shows commit titles but not the files changed |
| https://huggingface.co/Qwen | 5, 7 | S221 S222 S223 | model cards with dates; qwen.ai/blog is script-rendered and returns nothing; 2026-10-28: the org page shows only the ten most recently updated models |
| https://huggingface.co/moonshotai | 5, 7 | S226 S490 | model cards with dates; moonshotai.github.io redirects |
| https://huggingface.co/zai-org | 5, 7 | S430 | model cards with dates; z.ai/blog is a 404 |

Removed 2026-11-06: https://blogs.microsoft.com/on-the-issues/ (register ids S246 S291), nothing accepted from it in the 2026-10-16, 2026-10-28, 2026-11-01 or 2026-11-06 digests (newest post 2026-10-27 on this run), which meets the removal rule; the reviewer may restore it as the only Microsoft item.

## Tool release pages (10)
| Repository releases page | Register ids | Register notes to compare |
|---|---|---|
| https://github.com/UKGovernmentBEIS/inspect_ai/releases | S066 | inspect_ai version; compare PyPI inspect-ai and CHANGELOG.md; 2026-10-12: blob/main/CHANGELOG.md returns only page chrome, fetch it with `?plain=1`; 2026-10-13: https://pypi.org/pypi/inspect-ai/json is truncated before the upload times, use https://pypi.org/pypi/inspect-ai/<version>/json for a release date; 2026-11-01: the repo now publishes GitHub releases (0.3.278 onward on page 1, which replaces the earlier "publishes no GitHub releases" note), and tag pages have no v prefix: /releases/tag/0.3.287 works, /releases/tag/v0.3.287 is a 404 although the list renders the tag as "v0.3.287" (tested by this run's fetches) |
| https://github.com/promptfoo/promptfoo/releases | S068 | promptfoo version; 2026-10-12: the register tracks npm, so also fetch https://registry.npmjs.org/promptfoo/latest (it has no publish time; take the date from the GitHub release); 2026-10-28: the releases list cuts notes at "Read more", so open https://github.com/promptfoo/promptfoo/releases/tag/<version> for the full notes |
| https://github.com/confident-ai/deepeval/releases | S070 | deepeval version; 2026-10-13: GitHub releases stop at python-v4.2.4, PyPI is ahead, so compare https://pypi.org/pypi/deepeval/<version>/json (the unversioned JSON is truncated); 2026-10-28: https://pypi.org/project/deepeval/ shows a date for every version, enough when no upload time is needed; 2026-11-01: the newest python-v* GitHub release is still python-v4.2.4, but a "Setup wizard 0.1.0" release (tag setup-v0.1.0, 2026-10-16) sits above it in the list, so compare python-v* tags only |
| https://github.com/langfuse/langfuse/releases | S071 | langfuse version; 2026-10-16: the releases page shows day and month with no year, and several versions can ship on one day; 2026-10-28: page 1 shows ten releases, so when the window is longer than a few days also fetch `?page=2` (tested 2026-10-28: v4.56.0 to v4.64.0, 2026-10-09 to 2026-10-19) |
| https://github.com/safety-research/petri/releases | S072 S101 | petri version (redirects to meridianlabs-ai/inspect_petri) |
| https://github.com/safety-research/bloom/releases | S073 | bloom version; 2026-10-13: the releases page is empty, the v1.1.0 tag is on https://github.com/safety-research/bloom/tags |
| https://github.com/sierra-research/tau2-bench/releases | S012 S078 | tau2 version; 2026-10-28: the v2.0.0 notes defer the full list of changes to the CHANGELOG's "Upgrading from 1.x" section, so read it when the notes do not say what the reward counts |
| https://github.com/open-telemetry/semantic-conventions-genai/releases | S136 S203 | GenAI semconv version (the conventions moved to their own repository); 2026-10-13: there are no releases, and PR #374 (2026-09-22) went unnoticed for three runs because only releases and recent PRs were compared, so also read the metric names in https://raw.githubusercontent.com/open-telemetry/semantic-conventions-genai/main/docs/gen-ai/gen-ai-token-metrics.md and .../docs/gen-ai/client-inference.md (about 116k characters, read in two parts) against the S136 note, and list the new files in https://github.com/open-telemetry/semantic-conventions-genai/tree/main/changelog.d (`*.breaking.md`); 2026-10-28: client-inference.md is now about 124.5k characters with every metric definition in the first 100,000, so one fetch covers the metrics; `gen_ai.client.operation.duration` and its reporting rule are in .../docs/gen-ai/gen-ai-metrics.md and embeddings in .../docs/gen-ai/client-embeddings.md (PR #578), so read those too; the merged-PR list sorts by creation, not merge date, so scan the whole first page; changelog.d shows no dates, so diff the file names against the S136 note; 2026-11-01: https://github.com/open-telemetry/semantic-conventions-genai/pulls?q=is%3Apr+is%3Amerged+sort%3Aupdated-desc showed seven spec PRs merged 2026-10-17 to 2026-10-27 (#195, #447, #490, #543, #525, #452, #444) that the 2026-10-28 run did not record, so use that URL and check every PR on its first page against the S136 note; the changelog.d tree page shows a "View all files" link and may be truncated; gen-ai-metrics.md also defines server, workflow, agent and tool metrics, now listed in the S136 note (tested by this run's fetches) |
| https://github.com/mlcommons/ailuminate/releases | S120 | ailuminate version; 2026-10-12: the repo publishes no GitHub releases, the register's v1.0 and v1.1 are benchmark versions, so a "no releases" page is no change |
| https://github.com/stanford-crfm/helm/releases | S118 | helm version; 2026-11-01: the releases list and tag pages show day and month with no year (v0.5.16, "30 Apr"), so a day-and-month comparison against the window misreads it; take the year from the release sequence and say so |

## arXiv queries (4), top 5 by date each (top 10 when `--since` is more than seven days back), one at a time

2026-10-13: arXiv announces with a lag; papers submitted Friday to Monday appear on Tuesday evening, so a run early in the week sees nothing from the last few days and the next run gets overlap hits. 2026-10-28: over a twelve-day window the top 5 by date reached back only to 2026-10-21 (reward hacking), 2026-10-23 (agent benchmark, prompt injection) and 2026-10-25 (judge), so earlier papers in the window were not seen; changed 2026-10-29: `max_results=10` when `--since` is more than seven days back (kb-refresh step 2, refresh step 2). A result submitted in the three days before `--since` that is in neither the register nor the previous digest was never seen; it is in the window (kb-refresh step 2, changed 2026-10-13). 2026-11-01: with `--since` four days back the arXiv window (from 2026-10-25) was seven days, so `max_results=5` applied, and the top 5 of the judge and prompt-injection queries reached back only to 2026-10-26T05:45Z and 2026-10-26T18:20Z; both were re-run with `max_results=10` (oldest results 2026-10-22 and 2026-10-21) and found nothing new in the window, but five papers from 2026-10-21 to 2026-10-23 that neither run had seen (listed in the 2026-11-01 digest); a change to the rule is proposed there, since it lives in kb-refresh step 2.

- `cat:cs.CL AND abs:"LLM-as-a-judge"` (2026-10-12: replaces `cat:cs.CL AND (ti:"LLM-as-a-judge" OR ti:evaluator)`, whose title search stems `evaluator` to "Evaluation" and returned no judge papers; tested 2026-10-12, 3 of 5 on-target, 1 partly, all from the past ten days)
- `cat:cs.SE AND ti:agent AND ti:benchmark`
- `cat:cs.CR AND ti:"prompt injection"`
- `(cat:cs.AI OR cat:cs.LG OR cat:cs.SE) AND (ti:"reward hacking" OR abs:"evaluation awareness")` (2026-10-12: added for evaluation integrity, agents gaming graders and tests, the theme of S387, S418 and S423; tested 2026-10-12, 5 of 5 on-target, 2026-10-03 to 2026-10-09)

Removed 2026-11-01: `(cat:cs.CL OR cat:cs.LG) AND (ti:"data contamination" OR ti:"benchmark contamination" OR ti:"test set contamination")`, nothing in the window on 2026-10-16, 2026-10-28 or 2026-11-01 (newest result 2026-09-11) and nothing accepted in those three digests, which meets the removal rule; the rewrites tested on 2026-10-13 (1 of 5 and 0 of 5 on-target) and 2026-10-28 (0 of 5) did no better, so the data-contamination practice has no sweep item until a form tests on-target.

Query form: `https://export.arxiv.org/api/query?search_query=<query>&sortBy=submittedDate&sortOrder=descending&max_results=5` (`max_results=10` when `--since` is more than seven days back)

## Standards (3)
| Page | Register ids |
|---|---|
| https://genai.owasp.org/resources/ | S121 S122 S163 S281 S282 S283 S284 S457 S470 S493 |
| https://www.nist.gov/itl/ai-risk-management-framework | S127 S159 |
| https://code-of-practice.ai/ | S128 S161 |

## Checked by hand, not fetched
- https://x.ai/news: returned HTTP 403 to WebFetch on 2026-09-28 and 2026-09-29. Grok cards (S263 to
  S266) are PDFs on data.x.ai and media.x.ai; read them by hand and record the result in the digest.
