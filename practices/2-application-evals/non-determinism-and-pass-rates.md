---
id: non-determinism-and-pass-rates
title: Non-determinism and pass rates
area: 2-application-evals
status: draft
last_reviewed: 2026-10-02
sources: [S031, S032, S033, S034, S036, S041, S047, S049, S068, S308]
related: [statistical-treatment-of-evals, ci-gates-for-llm-apps, regression-on-upgrade, online-evals-and-drift, golden-datasets]
---

# Non-determinism and pass rates

## What
An LLM application gives different outputs for the same input across runs, and different outputs for the
same input across model snapshots. A pass rate is the fraction of trials on a case, or of cases in a suite,
that a grader marks as passing. The practice is to run each case several times, report the rate and its
spread rather than a single boolean, gate on a threshold chosen for the product, and pin the model version
and prompt so a change in the rate can be attributed to something.

## Why
Single-run results mislead in both directions. Anthropic: "Because model outputs vary between runs, we run
multiple trials to produce more consistent results" [S032]. Braintrust's guidance is that trials "smooth out
the noise from non-determinism" and gives a more reliable signal [S049]. The second source of movement is the
provider. Chen, Zaharia and Zou ran fixed sets against March and June 2023 snapshots of the same products at
temperature 0.1: GPT-4 fell from 84.0 to 51.1 percent on 1,000 prime-versus-composite questions, from 52.0 to
10.0 percent directly executable code on 50 LeetCode problems, and from 97.6 to 22.1 percent response rate on
1,506 OpinionQA questions, while GPT-3.5 moved the other way on some tasks [S041]. A suite that ran once, and
against an unpinned model, cannot tell those two causes apart.

The trade-off is cost: N trials cost N times the tokens and wall-clock, so trials go on the cases and graders
that need them, and the threshold is a product decision, not 100 percent: "Your pass rate is a product decision,
depending on the failures you are willing to tolerate" [S036].

## How
1. **Decide per suite whether trials are needed.** Braintrust: if the scorer is deterministic and the task runs
   at temperature 0, "a single trial is fine"; use several trials when the scorer is an LLM judge, temperature is
   above 0, differences between experiments are small, or the decision is a ship decision [S049]. Anthropic's
   consistency criterion asks "How similar do the model's responses need to be for similar types of input?" and
   measures it with cosine similarity across 50 groups of paraphrased FAQs [S031].
2. **Pick N.** "A trial count of 3 to 5 is a reasonable starting point for most use cases" [S049]. In Braintrust
   `trial_count=3` runs each case three times and averages the scores [S049]; in promptfoo `--repeat` sets the
   "Number of times to run each test" [S047].
3. **Pick the statistic for the question.** Anthropic defines two: "pass@k measures the likelihood that an agent
   gets at least one correct solution in k attempts" and "pass^k measures the probability that all k trials
   succeed", with the rule "pass@k for tools where one success matters, pass^k for agents where consistency is
   essential" [S032]. A customer-facing agent is graded on pass^k; a code generator whose output a human reviews
   can be graded on pass@k.
4. **Record the distribution, not the mean alone.** Keep the per-case rate for every version so that a shift in
   spread is visible even when the mean holds. Anthropic's advice for graders applies to rates: read transcripts
   "from many trials" before trusting the number [S032].
5. **Gate on a threshold you can defend.** Regression cases "should have a nearly 100% pass rate" [S032].
   promptfoo's `PROMPTFOO_PASS_RATE_THRESHOLD` defaults to 100 and the eval exits with code 100 when a test
   fails or the rate falls below it [S047]. Set it lower than 100 on purpose, write the reason next to it, and
   keep capability cases out of the gate.
6. **Pin model and prompt as build inputs.** OpenAI's grader docs reference dated snapshot ids such as
   `gpt-4o-2024-08-06` and `o3-2025-04-16` [S034]; use those forms, never an alias, and store the prompt hash
   with the run. The drift paper's own method is the template: same questions, same temperature, two dated
   snapshots [S041].
7. **Alert on shift between versions.** Compare the new distribution against the previous one per case; a case
   that moved from 5 of 5 to 2 of 5 is a finding even if the suite mean passed. OpenAI: "monitor your app to
   identify new cases of nondeterminism" [S033].

| Situation | Trials | Statistic | Gate | Source |
|---|---|---|---|---|
| Deterministic grader, temperature 0 | 1 | pass | 100 percent | [S049] |
| LLM grader or temperature above 0 | 3 to 5 | mean of trials | product threshold | [S049], [S036] |
| Agent must succeed every time | k | pass^k | near 100 percent | [S032] |
| One good draft is enough | k | pass@k | product threshold | [S032] |

## Who does it (sourced)
- **Anthropic, 2026-01-09:** says it runs multiple trials per task, reports pass@k and pass^k, and holds
  regression suites near 100 percent while capability suites start low [S032].
- **Anthropic, living docs (checked 2026-09-26):** lists consistency as a success criterion and measures it with
  embedding similarity over paraphrase groups [S031].
- **OpenAI, living docs (checked 2026-09-26):** says models "sometimes produce different output from the same
  input" and tells teams to monitor for new nondeterminism as part of continuous evaluation [S033]; its grader
  docs use dated model snapshot ids [S034].
- **Braintrust, living docs (checked 2026-09-26):** runs each case `trial_count` times, averages, and suggests 3 to
  5 trials as a starting point [S049].
- **promptfoo, docs dated 2026-09-26:** provides `--repeat`, a pass-rate threshold variable defaulting to 100,
  and a distinct exit code for threshold failure [S047].
- **Chen, Zaharia and Zou, 2023-10-31 (v3):** measured the same prompts against two dated snapshots and
  conclude on "the need to continuously monitor LLMs' behavior over time" [S041].
- **Hamel Husain on Rechat, 2024-03-29:** says the pass rate is a product decision and not necessarily 100
  percent [S036].
- **promptfoo, 2026-08:** version 0.121.19 added a per-test repeat option, which makes N runs a first-class setting [S068].
- **arXiv, 2026-09:** in 584 runs of coding agents on open-weight models, identical runs of one pairing varied more than different pairings differed, so rankings from a few runs were unreliable [S308].

## Pitfalls
1. **One run per case.** A single boolean hides variance that a 3 to 5 trial run would show [S049], [S032].
2. **Using pass@k for a consistency question.** pass@k rises with k by construction; a customer-facing agent
   is a pass^k question [S032].
3. **Unpinned model aliases.** Behaviour of a product name moved by tens of points between dated snapshots
   within three months [S041].
4. **A threshold of 100 percent by default.** promptfoo's default is 100 [S047]; leaving it there for LLM-graded
   cases turns every flaky case into a red build. See [ci-gates-for-llm-apps](ci-gates-for-llm-apps.md).
5. **Reporting the mean without the spread.** A shift in the per-case distribution is the earliest signal of a
   silent model change [S041], [S033].

## Pattern from a production build
A decision model asked the same 18 claim cards three times varied by a mean per-question
standard deviation of 0.005, so repeats said little; the variance that mattered was in the
labels, three refutations in sixteen. See [decision-model-triage-before-an-llm-judge](../../patterns/decision-model-triage-before-an-llm-judge.md).

## Sources
- [S031] Create strong empirical evaluations, Anthropic Claude Platform docs, living (checked 2026-09-26).
- [S032] Demystifying evals for AI agents, Anthropic engineering, 2026-01-09.
- [S033] Evaluation best practices, OpenAI developer docs, living (checked 2026-09-26).
- [S034] Graders, OpenAI developer docs, living (checked 2026-09-26).
- [S036] Your AI product needs evals, Hamel Husain, 2024-03-29.
- [S041] How is ChatGPT's behavior changing over time?, Chen, Zaharia, Zou, arXiv v3 2023-10-31.
- [S047] Command line reference, promptfoo docs, living (checked 2026-09-26).
- [S049] How to deal with nondeterminism, Braintrust foundations, living (checked 2026-09-26).
- [S068] promptfoo documentation, intro, promptfoo, living
- [S308] Identical Runs, Different Results: benchmarking AI coding agents on open-weight models, arXiv 2609.33812, 2026-09-27
