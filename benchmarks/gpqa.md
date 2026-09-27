# GPQA

## What it measures
Graduate-level science questions written by domain experts in biology, physics and chemistry, designed so that web search does not help. The set has 448 four-option questions. Experts with or pursuing PhDs in the field reach 65% (74% discounting clear mistakes); skilled non-experts reach 34% after more than 30 minutes with unrestricted web access; the strongest GPT-4 baseline at publication reached 39% [S017].

## Format and grader
Four-option multiple choice, exact match. The human numbers are the point of the benchmark: a score above the expert rate means the model is beating the people who wrote the field's exams on this item type [S017].

## Known issues
- 448 items is small: at 80% accuracy the 95% interval is about plus or minus 3.7 points, so single-run differences of a few points are noise.
- Public static set from November 2023; contamination risk is high for later models.
- Expert accuracy is itself uncertain (65% versus 74% depending on how mistakes are counted), so "superhuman" claims rest on which figure is used [S017].

## How a team should use it
- Use it as a reasoning screen with the expert baseline (65% or 74%) as the reference line, and always with an interval [S017].
- State whether the full 448-question set or a subset was run; HELM Capabilities uses all 448.
- Treat it as a reason to test harder domain reasoning yourself, not as evidence about your domain.
- Check the prompting regime (chain of thought or direct) beside any score you compare.

## Sources
- [S017] GPQA, Rein et al., 2023-11-20.
