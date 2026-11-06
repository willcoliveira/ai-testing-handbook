---
id: generate-tests-from-manual-cases
title: Generate tests from manual cases
sources: [S091, S169, S471, S499, S500, S501, S502, S503, S504, S505, S506, S507, S508]
last_reviewed: 2026-11-06
---

# Generate tests from manual cases

## When
A team has a large manual suite (hundreds or thousands of written test cases), an automation
framework with an existing step library, and a plan to have an LLM turn the manual cases into
automated tests, often in Gherkin. Typical pressure: a deadline, a test environment that takes
hours to set up, and part of the existing automation already stale.

## What
A generation pipeline with cheap gates in front of the expensive environment, a fixed evaluation
set of manual cases with accepted tests, a meaning check between each generated test and its
source case, per-stage rates you report on every prompt or model change, and a review status on
every generated test before it gates anything.

## Why
A generated test can be syntactically perfect and test something else. Three things go wrong in
practice. The model invents steps that look right but match nothing, and Cucumber marks a step
with no matching definition "undefined" and skips "all subsequent steps in the scenario" [S500].
The model paraphrases the case and drops a precondition or softens an expected result, and the
test still reads well. And the test passes without being able to fail: a passing test proves
nothing until it has been seen to fail, which is what mutation testing checks [S091][S501][S505].
Published results show the gap between "runs" and "tests the right thing": on Req2Test-Bench the
best configuration produced passing tests for 82.8% of instances but only 33.8% were behaviourally
adequate [S471]; a large study of LLM unit-test generation reports "compilation failure rates
reaching 86%" [S506]; the best model on TestGenEval reached "an average coverage of only 35.2%"
[S507]. Industrial use can still pay: in one case study users found generated Gherkin scenarios
helpful "95% of the time", while 24% of generated Cypress tests "needed to be regenerated with
additional inputs" [S503].

## How
Steps marked **hypothesis** have no published evaluation behind them yet. Each says how to check
it on your own data before you rely on it. This is also the shape interviewers listen for: "I'd try
X, because LLMs tend to do Y, and I'd check it by Z."

1. **Triage the source cases before generating anything.** Mark each manual case current, stale
   or unknown, using the requirement, the last execution date and whether the feature still exists.
   Old suites carry dead weight: in a study of 24,431 deleted Java tests, "91.4% of deleted tests in
   six projects are obsolete tests" [S508]. A stale case converted perfectly is still a stale test.
   Start with one subsystem whose cases are current.
2. **Index the step library.** Export every step definition with its expression and parameter
   types. A step definition is "a method with an expression that links it to one or more Gherkin
   steps", written as a Cucumber Expression or a regular expression [S499]. Mark stale step
   definitions (no passing use in recent runs) so they are not offered to the model.
3. **Assemble the context per case (hypothesis).** Give the model the manual case, the 20 to 50
   step definitions most similar to it (retrieved from the index, with exact expressions), two or
   three reviewed tests from the same subsystem as examples, and the domain glossary. Few-shot
   examples raised accuracy in a BDD generation study [S502]; retrieval of step definitions has no
   published evaluation. Why: given free choice the model writes plausible new steps; given the
   whole library it picks worse. Check it by running the same 50 cases with and without retrieval
   and comparing the undefined-step rate from step 4.
4. **Gate cheaply, before the environment.** In order: Gherkin parses; a dry run, which checks
   "whether all feature file steps have corresponding step definitions" without running them
   [S500]; no new step definition unless a reviewer approves it; the meaning check of step 5. Only
   tests that pass all four book environment time.
5. **Check the meaning against the source case (hypothesis).** Two layers. First, deterministic:
   extract the entities and values from both (equipment ids, zones, speeds, thresholds, expected
   states) and compare them as sets; any value in the case missing from the test is a fail. Second,
   a round trip: a second model, which never saw the original, rewrites the generated test as a
   manual case, and a judge compares it with the original step by step (preconditions, actions,
   expected results). Why: models paraphrase confidently and drop or soften steps. Check it by
   planting differences in 30 known pairs (a deleted precondition, a changed threshold, a swapped
   order, a weaker expected result) and counting how many the check catches, then by measuring its
   agreement with a human on 50 real pairs. Judges of Gherkin tests are measurable for accuracy,
   reliability and cost per model [S504]; calibrate yours the same way before it gates.
6. **Prove each test can fail.** Change the expected value, or break the behaviour in a stub or a
   simulator, and confirm the test turns red. Coverage "does not check that your tests are actually
   able to detect faults in the executed code" [S501]; methods can be "covered by the test suite, yet
   no test case fails when the method body is removed" [S505]. Watch for an expected value that
   equals the system's default or initial state: the test goes green whether or not the step under
   test did anything. Set a non-default starting value, or assert the change, not the end state.
7. **Account for the environment.** For each test, record which equipment, simulators and data it
   needs, and check them against what the test environment actually has. A test that needs a
   missing unit is `blocked`, not `failed`, and is reported apart so it does not pass as a product
   bug or vanish as a skip.
8. **Measure the pipeline on a fixed set.** Keep 50 to 100 manual cases with tests a person has
   accepted. On every prompt, model or retrieval change, run the pipeline on that set (each case
   several times, since output varies) and report the rate at each gate: parses, no undefined
   steps, meaning check passed, can fail (step 6), green in the environment, accepted by a reviewer
   without edits. The gate where the rate drops is where to work next.
9. **Review and graduate.** Every generated test starts as `generated` and non-blocking, and gates
   only once a person has read it against the case and seen it fail; see
   [ai-generated-tests](../practices/8-governance/ai-generated-tests.md). Reviewers check
   requirement fidelity, not the model's plausible reading [S169].

Pipeline template:

```
scope: subsystem <name>, <n> manual cases (current <n>, stale <n>, unknown <n>)
step library: <n> definitions indexed, <n> marked stale; new steps need approval from <owner>
context: case + top <k> step definitions + <n> examples + glossary v<k>; model <id>, prompt v<k>
gates (before environment): parse, dry run (0 undefined), entity/value diff, round-trip judge (kappa <x> on <n> pairs)
can-fail check: expected value changed or behaviour broken -> red; default-value review
environment: needs list per test; blocked != failed
fixed set v<k>: <n> cases x <runs> runs; rates per gate; reviewer acceptance without edits <x>%
status: generated -> reviewed -> trusted; only trusted gates
```

## Done when
Source cases are triaged and only current ones are converted; the step library is indexed and the
dry run shows no undefined steps; every test passes the meaning check and has been seen to fail;
blocked tests are reported apart from failures; the pipeline's per-gate rates are measured on a
fixed set and reported on every change; and only reviewed tests gate a merge.

## Related
Practices: [ai-generated-tests](../practices/8-governance/ai-generated-tests.md),
[mutation-checking](../practices/4-agents-and-systems/mutation-checking.md),
[judge-calibration](../practices/3-judging/judge-calibration.md),
[golden-datasets](../practices/2-application-evals/golden-datasets.md),
[non-determinism-and-pass-rates](../practices/2-application-evals/non-determinism-and-pass-rates.md).
Playbooks: [05 Calibrate the evaluator](05-calibrate-the-evaluator.md),
[08 Wire the gates](08-wire-the-gates.md).
Interview questions: [35 to 38](../learning-path/interview-questions.md#generating-tests-from-manual-cases).
