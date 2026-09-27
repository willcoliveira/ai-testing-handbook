---
id: build-a-golden-set
title: Build a golden set
sources: [S031, S036, S039, S044, S048, S052, S154, S155]
last_reviewed: 2026-09-26
---

# Build a golden set

## When
You have a test map (playbook 01) with at least one probabilistic component and no labelled data
to judge it against. Or your eval set is a handful of prompts someone typed, and pass rates move
when nothing changed.

## What
A versioned dataset of cases, each with an input, the context the system saw, the behaviours
expected, tags, provenance, a split label and a labeller. A datasheet describing how it was
built. A held-out portion nobody tunes against.

## Why
Evals are only as good as their cases. Sets that come from a developer's imagination miss the
failure modes real users produce; Hamel Husain's advice is to sample real traces, read them, and
name the failures you find [S036]. Datasets that are never documented get reused for the wrong
purpose, which is what datasheets exist to prevent [S039]. A set that was used to tune the prompt
cannot then measure it: contamination is as real for your own eval set as for public benchmarks
[S154] [S155].

## How
1. **Sample from reality first.** Pull conversations or requests from traces, stratified by the
   failure modes and segments in the test map. Include the boring majority and the rare edge, in
   known proportions. Record the sampling rule.
2. **Fill gaps with synthetic cases, labelled as such.** Generate cases for invariants reality
   has not exercised yet (a Spanish speaker, an opt-out mid-handoff). Tag `origin: synthetic` so
   they can be weighted or excluded.
3. **Label with a rubric, not a feeling.** For each case, write the expected behaviours as
   observable statements (playbook 03). Two labellers on a sample; measure agreement (playbook 05).
4. **Size it by failure mode, not by total.** Start with about 30 cases per failure mode you
   care about, and grow the modes that stay noisy [S052]. Anthropic's guidance is that more cases
   with slightly lower per-case quality beat a few polished ones [S031].
5. **Split and freeze.** Dev set for iterating on prompts and judges; test set held out and
   frozen; record which split each case is in. Never look at test failures to edit a prompt.
6. **Write the datasheet.** Motivation, composition, collection process, labelling, splits,
   licensing, maintenance [S039]. Hugging Face's dataset card template is a usable skeleton
   [S044] [S048].
7. **Version it.** A dataset version is a build input like the model id and the prompt. Change
   the version when cases are added, removed or relabelled, and record it in every run.

Case template:

```yaml
id: enrol-0042
origin: trace            # trace | synthetic
segment: returning-member
input: "yeah it's the one with the blue card, medicare"
context: {state: FL, node: health-plan}
expected:
  - agent narrows to Medicare plans for FL
  - agent does not name a plan absent from the FL list
  - agent confirms the choice before continuing
verbatim: []             # compliance copy that must match byte for byte
tags: [health-plan, narrowing]
split: dev               # dev | test
labelled_by: initials, 2026-09
notes: ""
```

## Done when
Every case has provenance, expected behaviours and a split; two labellers agree above the
threshold you set in playbook 05 on a sample; the datasheet exists; the test split has never been
used to edit a prompt; the version string appears in your run logs.

## Related
Practices: [golden-datasets](../practices/2-application-evals/golden-datasets.md),
[data-contamination](../practices/7-training-and-lifecycle/data-contamination.md),
[model-and-system-cards](../practices/8-governance/model-and-system-cards.md).
[datasets/README](../datasets/README.md) for the longer treatment.
