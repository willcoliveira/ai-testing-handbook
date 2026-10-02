---
id: add-a-decision-model-to-a-testing-workflow
title: Add a decision model to a testing workflow
sources: [S070, S071, S083]
last_reviewed: 2026-10-02
---

# Add a decision model to a testing workflow

## When
A step in your testing workflow is slow or expensive (an LLM judge, a human review, a re-run) and
someone proposes a cheaper model to replace it, gate it, or run in front of it. Or a tool offers a
"decision model" evaluator [S070] [S071] [S083] and you need to know what it is fit for before you
rely on it.

## What
A decision model wired into the workflow in shadow, with its questions written down, a log of
exactly what it was sent, a calibration against the verdicts you already trust, a set of
constructed discrimination tests, an adoption bar written before the run, and a recorded decision:
replacement, gate, or advisory.

## Why
A decision model answers typed questions about text with probabilities and returns no prose, so it
is fast, cheap and easy to log. Evaluation tools already treat a judge as one evaluator type among
several, next to code checks and human annotation [S071] [S083], and ship ready-made metrics
[S070]. That makes adding one easy. What it does not tell you is
whether the model catches the cases the slow step exists for. A cheap reader that agrees with the
expensive one most of the time can still miss every case that matters, and agreement on easy items
hides that.

## How
1. **Pick the decision.** Name the one decision the model would inform (is this finding real, does
   this answer meet the criterion, which severity) and the step it would sit beside. Write down
   what a wrong answer costs in each direction.
2. **Write typed questions.** One question per signal, each with a declared type (a yes/no
   probability, one of a fixed set, a level on a scale) and a written criterion for every option.
   Ask for the verdict in the same vocabulary your current step uses, so the two can be compared
   item by item. Keep severity and other judgements you already own as separate, advisory questions.
3. **Scrub and log what leaves the machine.** If the model is hosted, send the minimum: the claim
   and its text evidence, not screenshots, logs of the whole session or anyone's reasoning. Run your
   secret redaction first, then cut URLs to paths, replace hostnames and reduce absolute paths to
   file names. Save the exact request next to the result. Write down what the scrub cannot catch
   (IP addresses, single-label hosts, URL paths, free-text names), because a pattern list always
   has gaps. A self-hosted model removes the transmission question but not the logging one.
4. **Run it in shadow.** The current step sees every item exactly as before and never reads the
   model's output. Record both for every item. Nothing is skipped, reordered or shortened yet.
5. **Calibrate against existing verdicts.** Score the model against the step you trust: agreement
   on the binary decision and on the exact verdict, a confusion matrix, precision and recall on the
   rare class across thresholds, confidence against accuracy, and spread across repeats. Report the
   counts, not only percentages, and say what the label is: another model's verdict is a weaker
   label than a human's, and some will later be overruled.
6. **Run constructed discrimination tests.** Alter real items in known ways (swap the evidence for
   another item's, make the steps vague, add a pattern that cannot apply) and measure whether the
   model separates each pair, for example as AUROC. A model that cannot tell a real item from a
   doctored copy is not reading the item.
7. **Set the adoption bar before the run.** Decide in advance what result earns which role, for
   example "no missed case on at least N labelled examples of the rare class" before it may skip
   anything. If the rare class is scarce, the bar says so and the decision waits for more of it.
8. **Decide replacement, gate or advisory.** Replacement needs the bar met on the rare class.
   A gate (skip or shorten the slow step on confident items) needs the same, because the confident
   misses are the costly ones. Anything short of that is advisory: record the output beside the
   verdict, use it as a second reading, and act on nothing.
9. **Fail open.** Whatever role it has, a timeout, an error or a disabled model leaves the workflow
   exactly as it was without the model, and the gap is logged rather than hidden.

## Done when
The questions, the scrub rules and their gaps are written down; every result has its exact request
on disk; the calibration and the constructed tests are reported with counts and their limits; the
adoption bar was written before the run; and the role the model plays matches what the bar allows.

## Related
Practices: [llm-as-judge](../practices/3-judging/llm-as-judge.md),
[judge-calibration](../practices/3-judging/judge-calibration.md),
[rubrics-and-pairwise](../practices/3-judging/rubrics-and-pairwise.md),
[ci-gates-for-llm-apps](../practices/2-application-evals/ci-gates-for-llm-apps.md).
Pattern: [decision-model-triage-before-an-llm-judge](../patterns/decision-model-triage-before-an-llm-judge.md),
the measurement this playbook comes from, kept separate from the general guidance above.
Playbooks: [05 Calibrate the evaluator](05-calibrate-the-evaluator.md),
[12 Run an exploratory session](12-run-an-exploratory-session.md).
