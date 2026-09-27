# Auditors

Agentic tools that generate scenarios, run them against a target model, and score the transcripts. They find behaviours; they do not gate releases. Practices: [orchestrators-and-simulators](../practices/4-agents-and-systems/orchestrators-and-simulators.md), [exploratory-testing-of-agents](../practices/4-agents-and-systems/exploratory-testing-of-agents.md). Red-teaming tools proper are in a separate file. Matrix: [README](README.md).

## Petri
- **What it is:** an open-source auditing tool from Anthropic, released 2025-10-06, that "deploys an automated agent to test a target AI system through diverse multi-turn conversations involving simulated users and tools; Petri then scores and summarizes the target's behavior" [S072]. The repository now lives at meridianlabs-ai/inspect_petri, MIT, release 3.1.0 on 2026-08-12 [S072].
- **What it is for:** hypothesis-driven exploration of behaviours such as deception, sycophancy, self-preservation, power-seeking and reward hacking. The pilot ran 111 seed instructions across 14 models; auditor agents "make a plan and interact with the target model in a tool use loop", and "LLM judges" score "each conversation across multiple safety-relevant dimensions" [S072].
- **Who uses it (as stated):** "Early adopters, including MATS scholars, Anthropic Fellows, and the UK AISI, are already using Petri to explore eval awareness, reward hacking, self-preservation, model character, and more"; the UK AISI "used a pre-release version of Petri to build evaluations" [S072].
- **What it is not for:** a regression gate. The output is scored transcripts and hypotheses; turn confirmed findings into fixed cases in a harness.

## Bloom
- **What it is:** "an open source agentic framework for generating behavioral evaluations of frontier AI models", released 2025-12-19, MIT, tag v1.1.0 [S073].
- **What it is for:** a four-stage pipeline, "Understanding, Ideation, Rollout, Judgment"; "A judge model scores each transcript for the presence of the behavior, along with other user-defined qualities, and a meta-judge produces suite-level metrics"; conversation and simenv (tool-calling) modalities; a choice of "whether to expose tools to the target model, whether to simulate a user"; variation dimensions to test behaviour stability; W&B sweeps; "exports Inspect-compatible transcripts" [S073].
- **Who uses it (as stated):** "Early adopters are already using Bloom to evaluate nested jailbreak vulnerabilities, test hardcoding, measure evaluation awareness, and generate sabotage traces" [S073].
- **What it is not for:** product-level application evals. It measures how often and how severely a behaviour occurs in a model, on generated scenarios.

## Reading the two together
- Both simulate the other side of the conversation and both grade with model judges; both therefore carry two sources of noise. Run each scenario more than once and read the transcripts before believing a suite-level number [S072][S073].
- Both export transcripts that a harness can replay. Bloom's are Inspect-compatible [S073]; Petri's repository sits in the Inspect ecosystem by name [S072]. A finding becomes a regression case when it is pinned as a fixed sample with a deterministic or calibrated grader.
- Neither replaces human red teaming. Microsoft's guidance for its own red-teaming agent is "Best used with human-in-the-loop processes" [S088], and the same applies here.

## Side by side

| | Petri | Bloom |
|---|---|---|
| Released | 2025-10-06 [S072] | 2025-12-19 [S073] |
| Licence and version checked | MIT; 3.1.0, 2026-08-12 [S072] | MIT; tag v1.1.0 [S073] |
| Input | seed instructions (111 in the pilot) [S072] | a behaviour description and examples [S073] |
| Other side of the conversation | auditor agent with simulated users and tools [S072] | optional simulated user; conversation or simenv modality [S073] |
| Grading | LLM judges across safety-relevant dimensions [S072] | judge per transcript plus a meta-judge for suite metrics [S073] |
| Output | scored, summarised transcripts [S072] | Inspect-compatible transcripts, W&B runs, a transcript viewer [S073] |

## Running one without fooling yourself
1. Fix the target model version and record it with the run; a suite-level number without a model id is not reproducible.
2. Run each scenario more than once before reading the score; the auditor, the target and the judge all vary.
3. Read the top-scoring transcripts by hand. A judge score is a pointer to a transcript, not a verdict.
4. Pin any confirmed behaviour as a fixed sample in a harness with a deterministic or calibrated grader, and only then track it over releases.
5. Budget the run: auditor turns, target turns and judge calls all bill separately.

## Related, covered elsewhere
- promptfoo red-team plugins target application-level vulnerabilities such as harmful content, BOLA, BFLA and prompt injection [S069]; see the red-teaming tools file.
- Microsoft Foundry's AI red teaming agent runs PyRIT attacks in the cloud, with scheduled red teaming after deployment [S088]; see the red-teaming tools file.
