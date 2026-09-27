# Terminal-Bench 2.0

## What it measures
Whether an agent can complete real workflow tasks in a command-line environment. The 2.0 release has 89 tasks; each has its own environment, a human-written solution and tests for verification. Frontier models and agents score under 65%, and the paper includes an error analysis of failure types. The dataset and harness are published at tbench.ai [S021].

## Format and grader
The agent works inside the task's container; the tests run at the end and decide pass or fail. The human solution lets maintainers check that the tests accept a known-good answer, which is the validity check SWE-bench Verified lacked. The paper was submitted in January 2026 with 85 authors [S021].

## Known issues
- 89 tasks is small: at 60% the 95% interval is about plus or minus 10 points, so a few points between agents is noise.
- The harness and agent scaffold are part of the score; compare only within one scaffold.
- Public tasks released in 2026; contamination risk is medium now and rises with time.

## How a team should use it
- Use it when the product is a coding or ops agent that runs commands [S021].
- Read the error analysis categories to see which failure modes dominate for the model you are considering.
- Write your own tasks in the same shape: environment, human solution, tests, so a known-good answer validates the tests.
- Quote the scaffold and the interval; 89 tasks gives a wide one.

## Sources
- [S021] Terminal-Bench 2.0, Merrill et al., 2026-01-17.
