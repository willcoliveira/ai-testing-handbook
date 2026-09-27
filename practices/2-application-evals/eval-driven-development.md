---
id: eval-driven-development
title: Eval-driven development
area: 2-application-evals
status: draft
last_reviewed: 2026-09-26
sources: [S031, S032, S033, S036, S040, S042, S045, S046]
related: [golden-datasets, criteria-authoring, non-determinism-and-pass-rates, ci-gates-for-llm-apps, llm-as-judge, regression-on-upgrade]
---

# Eval-driven development

## What
Eval-driven development is the loop where every change to a prompt, model version, tool definition or
orchestration step is run against a fixed set of cases before it ships, and the decision is made on the
resulting pass rate rather than on a demo. A case is a task with inputs and a success criterion; an
attempt at it is a trial; a grader scores the trial [S032]. The loop is the LLM-app counterpart of a unit
test suite, with one difference: the same input can pass on one run and fail on the next, so the suite
tracks rates, not booleans [S033].

## Why
Teams do it because model output varies and a hand check of three examples does not tell you what changed.
OpenAI's guide states the problem plainly: "Models sometimes produce different output from the same
input, which makes traditional software testing methods insufficient for AI architectures" [S033].
Anthropic's guidance on agents puts evals in the same place a test suite sits: "Automated evals are
especially useful pre-launch and in CI/CD, running on each agent change and model upgrade as the first
line of defense" [S032]. The practice replaces prompt tweaking by feel with prompt tweaking against a number.

The trade-off is in the name. Hamel Husain's FAQ answers "should I practice eval-driven development" with
"Generally no", meaning the narrow sense of writing evaluators before implementing features, which he says
"creates more problems than it solves"; his alternative is to start with error analysis on real outputs and
build evaluators for the failure modes you actually see [S042]. The loop described here is the wider sense:
measure every change against cases that came from real failures. Do not write graders for behaviour you have
not observed yet.

## How
1. **Write down success criteria before the first eval run.** Anthropic's docs give the shape: a metric, a
   threshold and a set, for example "On a held-out test set of 10,000 diverse Twitter posts, the sentiment
   analysis model should achieve: an F1 score of at least 0.85", plus separate lines for toxicity, error
   severity and latency, because "Most use cases need multidimensional evaluation along several success
   criteria" [S031]. OpenAI's examples have the same form: a ROUGE-L of at least 0.40 and a coherence score of at
   least 80 percent on a held-out set of 1000 reference transcripts [S033].
2. **Seed the first set from failures, not from imagination.** Anthropic: "20-50 simple tasks drawn from real
   failures is a great start" [S032]. Hamel's minimum viable setup is 30 minutes reading 20 to 50 outputs by
   hand whenever you make a significant change, before any infrastructure [S042].
3. **Split the suite into regression and capability cases.** Regression evals "should have a nearly 100% pass
   rate"; capability evals "should start at a low pass rate, targeting tasks the agent struggles with and
   giving teams a hill to climb" [S032]. Only the first kind gates a merge.
4. **Pick the cheapest grader that answers the question.** Exact match after normalising whitespace and case for
   categorical answers; an LLM grader with a 1 to 5 scale and the instruction "Output only the number" for tone;
   binary classification for presence of PHI [S031]. Anthropic's rule of thumb: "Prioritize volume over quality:
   More questions with slightly lower signal automated grading is better than fewer questions with high-quality
   human hand-graded evals" [S031]. Hamel's counter-rule: generic similarity metrics such as ROUGE or cosine
   "are not useful for evaluating LLM outputs in most AI applications" [S042]. Read both as: automate, but
   automate a task-specific check.
5. **Run on every change, and run the expensive layers less often.** Hamel's three levels: unit-test assertions
   on every code change, human and model evaluation on a set cadence, A/B tests only after significant product
   changes [S036]. OpenAI: "Set up continuous evaluation (CE) to run evals on every change, monitor your app to
   identify new cases of nondeterminism, and grow the eval set over time" [S033].
6. **Attach the assertion to the case, not to the pipeline.** In promptfoo an `assert` array sits on each test
   case, each assertion has a `type`, an optional `threshold` and a `weight` defaulting to 1.0, and the case score
   is the weighted average [S045]. A CI job then runs on pull requests that touch `prompts/**` or the config
   file [S046].
7. **Keep results outside CI with the prompt version.** "If you use CI, you should collect metrics along with
   versions of your tests/prompts outside your CI system for easy analysis and tracking" [S036].
8. **Add complexity only when the number moves.** "Start with simple prompts, optimize them with comprehensive
   evaluation, and add multi-step agentic systems only when simpler solutions fall short" [S040].

Decision table for what gates and what informs:

| Layer | Runs when | Gates? | Source |
|---|---|---|---|
| Deterministic assertions | every code change | yes, near 100 percent | [S036], [S032] |
| LLM-graded regression cases | every change, with repeats | yes, on a rate | [S033], [S032] |
| Capability cases | every change | no, reported | [S032] |
| Human review of traces | on a cadence | no, feeds new cases | [S036], [S042] |

## Who does it (sourced)
- **Anthropic, 2026-01-09:** says its agent evals run "on each agent change and model upgrade", that
  "20-50 simple tasks drawn from real failures is a great start", and that "The people closest to product
  requirements and users are best positioned to define success", so product and customer staff contribute
  tasks [S032].
- **Anthropic, living docs (checked 2026-09-26):** describes the cycle test cases, preliminary prompt,
  iterative refinement, final validation, ship, and says "This cycle is central to prompt engineering" [S031].
- **Anthropic, 2024-12-19:** says complexity should be added "only when it demonstrably improves outcomes" and
  that prompts are optimised "with comprehensive evaluation" first [S040].
- **OpenAI, living docs (checked 2026-09-26):** recommends continuous evaluation on every change and gives
  per-architecture eval lists: instruction following and functional correctness for single-turn, tool selection
  and data precision for single agents, handoff accuracy for multi-agent [S033].
- **Hamel Husain on Rechat, 2024-03-29:** says the team ran assertion-level tests through GitHub Actions on
  every change, tracked results over time in Metabase, and that "Your pass rate is a product decision" [S036].
- **Hamel Husain, living FAQ (checked 2026-09-26):** says to start with error analysis rather than evaluators,
  and to retire evals that always pass [S042].
- **promptfoo, docs dated 2026-09-26:** documents a GitHub Action that runs evals on pull requests and fails the
  build below a pass-rate threshold [S046].

## Pitfalls
1. **Writing graders before seeing failures.** The FAQ's objection to eval-first development is that evaluators
   written from imagination test the wrong thing; do error analysis on real traces first [S042].
2. **Treating a single run as the answer.** Outputs vary between runs; OpenAI's guide says to monitor for new
   cases of nondeterminism and Anthropic runs multiple trials per task [S033], [S032]. See
   [non-determinism-and-pass-rates](non-determinism-and-pass-rates.md).
3. **Gating on capability cases.** They are meant to start low; putting them in the merge gate makes every PR
   red [S032].
4. **Letting the suite go stale.** "If everything keeps passing, this is a sign that the eval is less useful
   and should be run less often or retired" [S042]; an eval suite "is a living artifact that needs ongoing
   attention and clear ownership" [S032].

## Pattern from a production build
None yet.

## Sources
- [S031] Create strong empirical evaluations, Anthropic Claude Platform docs, living (checked 2026-09-26).
- [S032] Demystifying evals for AI agents, Anthropic engineering, 2026-01-09.
- [S033] Evaluation best practices, OpenAI developer docs, living (checked 2026-09-26).
- [S036] Your AI product needs evals, Hamel Husain, 2024-03-29.
- [S040] Building effective agents, Anthropic engineering, 2024-12-19.
- [S042] Frequently asked questions (and answers) about AI evals, Hamel Husain, living (checked 2026-09-26).
- [S045] Assertions and metrics, promptfoo docs, living (checked 2026-09-26).
- [S046] CI/CD integration, promptfoo docs, living (checked 2026-09-26).
