# AgentBench

## What it measures
An LLM acting as an agent across eight interactive environments, testing reasoning and decision-making over multiple turns. The paper's headline finding was a large gap between top API models and open models of 70B or smaller, and it names poor long-term reasoning, decision-making and instruction following as the main obstacles [S019].

## Format and grader
Each environment defines its own interaction loop and success metric; the paper reports per-environment scores and an overall figure. The datasets, environments and an integrated evaluation package are released by Tsinghua's THUDM group. The paper first appeared in August 2023, reached v3 in October 2025, and was published at ICLR 2024 [S019].

## Known issues
- Public since 2023, so contamination risk is high for current models.
- Eight heterogeneous environments give one overall number; the per-environment columns are the useful part.
- Newer agent benchmarks (tau2, Terminal-Bench, SWE-Bench Pro) score outcomes on state or tests with tighter task definitions; AgentBench is older and its findings describe 2023-era models.

## How a team should use it
- Use it as a historical reference for what "agent" evaluation meant in 2023 and as a source of environment designs [S019].
- Read the per-environment columns; the overall number averages unlike tasks.
- For a current model choice, prefer a benchmark whose task format matches your product (tau2 for policy-bound conversations, Terminal-Bench for command-line work, SWE-Bench Pro for repositories).
- If you quote it, quote the paper version (v3, 2025-10) and the model date, since the headline gap describes 2023 models [S019].

## Sources
- [S019] AgentBench, Liu et al., Tsinghua THUDM, 2023-08-07.
