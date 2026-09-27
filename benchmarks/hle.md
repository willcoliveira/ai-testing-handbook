# Humanity's Last Exam (HLE)

## What it measures
Closed-ended academic questions at the expert frontier across dozens of subjects, built by subject-matter experts worldwide (over 1,150 listed authors). The set has 2,500 questions, each with a known, unambiguous, verifiable answer. At publication frontier models showed low accuracy and low calibration, which the authors present as the gap to the expert frontier on closed-ended questions [S018].

## Format and grader
Multiple-choice and short-answer questions with automated grading against the known answer. Calibration error is reported beside accuracy [S018]. The paper was revised through July 2026 and has a Nature DOI.

## Known issues
- Public set (lastexam.ai); questions are hard, but they are on the internet, so contamination risk grows with time.
- Closed-ended by design; it says nothing about open-ended work, tool use or long tasks.
- Low calibration on it is a separate finding from low accuracy: models were confidently wrong [S018].

## How a team should use it
- Read the calibration column as well as accuracy [S018].
- A model that is wrong and confident on expert questions will be wrong and confident on your expert questions; test calibration on your own set.
- Use n=2,500 for the interval: at 30% accuracy it is about plus or minus 1.8 points.
- Cite the paper version; it was revised through July 2026 [S018].

## Sources
- [S018] Humanity's Last Exam, Phan et al., CAIS and Scale AI, 2025-01-24.
