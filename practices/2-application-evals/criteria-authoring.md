---
id: criteria-authoring
title: Criteria authoring
area: 2-application-evals
status: draft
last_reviewed: 2026-09-26
sources: [S031, S032, S033, S034, S036, S037, S042, S045]
related: [llm-as-judge, judge-calibration, rubrics-and-pairwise, golden-datasets, regulated-domain-checks]
---

# Criteria authoring

## What
A criterion is the sentence a grader applies to one output to decide pass or fail. Criteria authoring is
the work of writing those sentences so that a code grader, a model grader or a second human reaches the
same verdict as the first human. Anthropic's test for a good task applies to each criterion: "A good task
is one where two domain experts would independently reach the same pass/fail verdict" [S032]. A criterion
describes a behaviour the output must show, names who shows it and when, and is verbatim only where the
words themselves are the requirement.

## Why
Grader output is only as stable as the criterion it is given. Anthropic's rule for agents is "It's often
better to grade what the agent produced, not the path it took", because path-locked tests are brittle
[S032]. Hamel's FAQ argues for binary criteria over scales: "Binary evaluations force clearer thinking and
more consistent labeling. Likert scales introduce significant challenges: the difference between adjacent
points (like 3 vs 4) is subjective and inconsistent across annotators" [S042]. Well-written criteria replace
two things: a checklist of phrases the bot must say, which breaks on every prompt change, and a vague
"is this good" question, which a model grader answers differently each time.

The trade-off is precision against coverage. A criterion tight enough to be gradeable covers one behaviour,
so a full rubric needs many of them, and each one needs its own labelled examples to check the grader:
100 to 200 per failure mode in Hamel's guidance [S042].

## How
1. **One behaviour per criterion, phrased as a check.** OpenAI's per-architecture list is a model of the
   form: "Tool selection: Evaluations that test whether the agent is able to select the correct tool to use";
   "Data precision: Evaluations that verify the agent calls the tool with the correct arguments" [S033]. Each
   is a single yes-or-no question about one thing.
2. **Choose the grader by the kind of answer.** Anthropic's docs: exact match "after normalizing whitespace and
   case" for categorical answers; a binary LLM classification for whether a response contains PHI; a 1 to 5
   scale only for "nuanced aspects like empathy, professionalism, or patience" [S031]. OpenAI's grader types
   give the same ladder in API form: `string_check` with `eq`, `neq`, `like`, `ilike`; `text_similarity` with
   `fuzzy_match`, `bleu`, `gleu`, `meteor`, `cosine` and `rouge_1` to `rouge_l`; `score_model` with a
   `pass_threshold`; `python` for anything computable; `multi` to combine [S034]. promptfoo splits the same way
   into deterministic assertions (`equals`, `contains`, `regex`, `is-json`, `latency`, `cost`) and model-graded
   ones (`llm-rubric`, `g-eval`, `factuality`, `answer-relevance`, `context-faithfulness`) [S045].
3. **Prefer binary, and combine binaries into a pass-all rate.** The FAQ's aggregation: report the percentage of
   cases that pass every check, with drill-down to each criterion's own rate [S042]. Hamel's earlier post
   says the same from practice: "assigning scores or more granular ratings is more onerous to manage than
   binary ratings" [S036].
4. **Write the model-grader prompt as a form, not a conversation.** Anthropic's Likert example ends with
   "Output only the number"; its binary example asks one question with two labels [S031]. OpenAI's graders
   expose `item` (the case) and `sample` (the output, as `output_text`, `output_json`, `output_tools`) as
   template variables so the criterion refers to fields, not to prose [S034].
5. **Reserve verbatim for text that must be verbatim.** A string check is right when the words are the
   requirement, for example regulated disclosure copy. For everything else, a phrase check fails when the
   wording changes and the behaviour does not. Flag verbatim criteria as such so a prompt change is reviewed
   against them.
6. **Bound the criterion in time and speaker.** For multi-turn agents Anthropic notes evaluation "often
   require[s] a second LLM to simulate the user" [S032]; a criterion that does not say which party and which
   turn it applies to cannot be graded on such a transcript.
7. **Validate the grader on labelled cases and measure both error types.** "You should typically measure
   precision and recall separately to get a more accurate picture of your judge's alignment" [S036]. Hamel
   aligned a critique model in rounds of 25 to 50 examples graded by a domain expert [S036]. Anthropic:
   "LLM-based rubrics should be frequently calibrated against expert human judgment" [S032]. For classification
   tasks Eugene Yan's guidance is recall, precision and ROC-AUC, with 0.5 meaning a coin flip [S037].
8. **Weight and threshold explicitly.** In promptfoo each assertion has a `weight` (default 1.0) and the case
   score is the weighted average; a test-level `threshold` decides pass [S045]. OpenAI's `pass_threshold` does
   the same per grader [S034]. Write the number down in the config, not in someone's head.

| Shape | Example | Grader | Source |
|---|---|---|---|
| Behaviour | The agent asks for the member id before quoting a balance | model, binary | [S033], [S042] |
| Structural | Output parses as JSON with keys `plan` and `reason` | code, `is-json` | [S045] |
| Verbatim (flagged) | The recorded-line notice is spoken word for word before any question | string check | [S034] |

## Who does it (sourced)
- **Anthropic, 2026-01-09:** says its graders are code-based (string matching, static analysis, outcome
  verification), model-based (rubric scoring, natural language assertions) and human, that model grading
  "often takes careful iteration to validate accuracy", and that "You won't know if your graders are working
  well unless you read the transcripts and grades from many trials" [S032].
- **Anthropic, living docs (checked 2026-09-26):** publishes exact-match, cosine, ROUGE-L, Likert, binary and
  ordinal grading examples with sample prompts [S031].
- **OpenAI, living docs (checked 2026-09-26):** documents five grader types with a 2-minute execution limit
  per grade; the page carries a deprecation notice for graders in its evals and fine-tuning workflows [S034].
- **Hamel Husain on Rechat, 2024-03-29:** says labels were binary, critiques were collected from the labeller,
  and precision and recall of the judge were tracked separately [S036].
- **Hamel Husain, living FAQ (checked 2026-09-26):** says binary over Likert, 100 to 200 labelled examples per
  failure mode, and that generic metrics "are not useful for evaluating LLM outputs in most AI applications"
  [S042].
- **Eugene Yan, 2024-03:** says summarisation factual consistency can be graded with an NLI model and that
  "Human evaluation remains the gold standard" for complex tasks [S037].

## Pitfalls
1. **Phrase-locked criteria.** A criterion that names the sentence rather than the behaviour fails on wording
   changes; grade "what the agent produced, not the path it took" [S032].
2. **Scales where a binary would do.** Adjacent Likert points are "subjective and inconsistent across
   annotators" [S042].
3. **A grader nobody checked.** Model grading "often takes careful iteration to validate accuracy" [S032];
   measure precision and recall against human labels [S036].
4. **Generic similarity as a quality score.** Cosine, ROUGE and BERTScore rarely track the property you care
   about [S042]; the OpenAI grader docs offer them as options, not as defaults [S034].

## Pattern from a production build
None yet.

## Sources
- [S031] Create strong empirical evaluations, Anthropic Claude Platform docs, living (checked 2026-09-26).
- [S032] Demystifying evals for AI agents, Anthropic engineering, 2026-01-09.
- [S033] Evaluation best practices, OpenAI developer docs, living (checked 2026-09-26).
- [S034] Graders, OpenAI developer docs, living (checked 2026-09-26).
- [S036] Your AI product needs evals, Hamel Husain, 2024-03-29.
- [S037] Task-specific LLM evals that do and don't work, Eugene Yan, 2024-03.
- [S042] Frequently asked questions (and answers) about AI evals, Hamel Husain, living (checked 2026-09-26).
- [S045] Assertions and metrics, promptfoo docs, living (checked 2026-09-26).
