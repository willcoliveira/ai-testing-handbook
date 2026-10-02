---
id: decision-model-triage-before-an-llm-judge
title: Decision-model triage before an LLM judge
practices: [llm-as-judge, judge-calibration, rubrics-and-pairwise, exploratory-testing-of-agents, ci-gates-for-llm-apps, non-determinism-and-pass-rates]
sources: [S210]
anonymisation: reviewed
---

# Decision-model triage before an LLM judge

## Context (anonymised)
Exploratory testing of payment features with an AI exploratory-testing framework, in September
2026. Every candidate bug an agent session found went to an adversarial LLM judge before it
shipped: a separate sub-agent [S210] on the strongest available model, given only a claim card
(title, steps, expected and actual behaviour, evidence), whose job was to refute the claim by
re-running the steps in its own browser. The judge cost minutes of that model per claim.
The question was whether a decision model, a model that answers typed questions about text with
probabilities and no prose, could replace the judge, gate it, or sit beside it as an advisory
line. Two were tried: a hosted decision model and an open, self-hosted decision model.

## What was built
- A claim-card triage: one request per claim with a fixed set of typed questions. Five yes/no
  probabilities (does the evidence show the actual behaviour, are the steps sufficient, is it
  plausibly by design, is there an alternative explanation, does the behaviour support the
  stated impact), one yes/no per known false-positive pattern, a severity choice worded from the
  severity guide, and a predicted-verdict choice in the judge's own vocabulary.
- A scrub before anything left the machine: the secret-redaction list, then URLs cut to their
  path, hostnames replaced, absolute paths reduced to file names and storage-state references
  removed, with the exact request saved next to the judge's verdict. Screenshots, the session log
  and the finder's reasoning were never sent.
- Shadow mode: the judge saw every claim at full budget and never read the triage output, so
  every claim kept both labels.
- A calibration harness that scored the predictions against the judge's verdicts: agreement, a
  precision and recall sweep over the refutation threshold, severity fit, confidence against
  accuracy, self-consistency across repeats, cost and latency.
- Constructed discrimination tests built from the real claims: the same claim with its evidence
  swapped for another claim's, the same claim with vague steps, and a false-positive pattern that
  cannot apply. A model that reads the claim should separate each pair.
- A fine-tune of the open model on folds of those constructed items, held out by session.

## Numbers
- Calibration set: 18 claim cards, each asked 3 times. 16 carried a usable judge label: 10
  confirmed, 3 confirmed with an adjusted severity and 3 refuted; 2 unverified claims were
  excluded. The label is the judge's verdict, and the finding session later overruled one of the
  three refutations.
- Hosted decision model against the judge: 13 of 16 on confirm versus refute, 10 of 16 on the
  exact verdict.
- It predicted 0 of the 3 refutations, each with high confidence in "confirmed". No threshold on
  its refutation probability between 0.20 and 0.60 caught one.
- Calibration cost and latency: about 300 ms and well under a tenth of a cent per claim, with a mean per-question
  standard deviation of 0.005 across the three repeats. In one live session the same service took
  47 seconds for four claims, with one server error after retries; the failed claim went to the
  full judge and nothing was lost.
- Two live sessions with 7 and 4 claims, the first in shadow, the second applying the triage's
  routing with every shortened claim re-judged at full budget afterwards: 10 of 10 on confirm versus
  refute and 9 of 10 on the exact verdict, over the claims it answered. Neither session produced a refutation, so
  they could not test the one thing the calibration showed it missing.
- Open model, zero-shot, on the same 16 labels: 5 of 16 on confirm versus refute. Its yes/no
  answers sat near 0.95 for almost every question on every claim.
- Constructed tests on 43 comparable claims, as AUROC (0.5 is chance): the hosted model 0.92 on
  the evidence swap and 0.96 on vague steps; the open model 0.49 to 0.54 and 0.51 to 0.58 across
  three prompt variants.
- The open model after fine-tuning, on 29 held-out claims from 2 of 3 planned folds: 0.67 and 0.79.
- Limits: one application under test, one judge model, three refutations, a fine-tune that covered
  two of its three folds. Measurements from September and October 2026.

## Decision and the trade-off accepted
Neither model replaces the judge or gates it. The hosted one tells a coherent claim from an
incoherent one well, as the constructed tests show, and is weak at exactly what the judge is for.
A refuted claim is usually internally coherent: the finder missed something on the page, a dialog
or a keyboard mode, and only re-running the steps shows it. An evidence-only reading sees
coherence and says "confirmed". So it ships as an opt-in advisory line before the judge, recorded
and never acted on: a second severity reading, a weak-evidence flag and an audit trail, at a cost
too small to argue about. The open model is not fit to route anything zero-shot; it stays
available as a side-by-side provider because it is cheap, local and sends nothing off the
machine. The trade-off accepted: the judge's full cost stays. A tool that agrees with the judge
most of the time earns no authority over it, because the cases it misses are the expensive ones.

## What I would do differently
- Collect refutations before measuring a refutation predictor. Three is too few: every conclusion
  about missed refutations rests on them, and the live sessions added none.
- Write the adoption bar before the run, for example no missed refutation across a stated number
  of labelled refutations, rather than reading the results first. The fine-tune had one; the
  hosted model's calibration did not.
- Use human labels as well as the judge's and report agreement with chance correction. Here the
  label is another model's verdict, and one of them was overruled.
- Give the judge a reliably authenticated browser session that can change state. In the live
  sessions several judge verdicts were evidence-only for permission reasons, which weakens the
  label the triage was scored against.
- Finish the fine-tune across all folds before reading anything into 0.67 and 0.79.

## Which practices this evidences
[LLM as judge](../practices/3-judging/llm-as-judge.md): an adversarial judge working from a claim
card, and what a second, cheaper reader can and cannot add.
[Judge calibration](../practices/3-judging/judge-calibration.md): scoring a candidate judge
against existing verdicts, with the weakness of the label stated.
[Rubrics and pairwise](../practices/3-judging/rubrics-and-pairwise.md): typed questions with
written criteria in place of a free-text verdict.
[Exploratory testing of agents](../practices/4-agents-and-systems/exploratory-testing-of-agents.md):
verifying every candidate finding before it ships.
[CI gates for LLM apps](../practices/2-application-evals/ci-gates-for-llm-apps.md): why a
probabilistic signal stays advisory and fails open instead of gating.
[Non-determinism and pass rates](../practices/2-application-evals/non-determinism-and-pass-rates.md):
repeats that barely moved, against labels where the rare class was three items.
