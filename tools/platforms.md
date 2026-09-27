# Platforms and managed services

Hosted or self-hosted products that combine datasets, experiments, judges and production traces. Practices: [agent-evals](../practices/4-agents-and-systems/agent-evals.md), [harnesses](../practices/4-agents-and-systems/harnesses.md). Matrix: [README](README.md).

## Braintrust
- **What it is:** a hosted platform to "Measure AI application quality, detect regressions before they reach production, and build confidence that your system is improving over time"; the SDK is Apache-2.0 and the autoevals scorer library is MIT [S081].
- **What it is for:** scorers and classifiers, built-in autoevals, LLM-as-a-judge or custom code; tasks from single calls to multi-step agents with remote evals and sandboxes; evals on every pull request; online scoring of production traces [S081]. Anthropic's post describes it as combining "offline evaluation with production observability and experiment tracking" [S079].
- **What it is not for:** air-gapped deployments; the platform is hosted.
- **Version checked:** braintrust SDK 3.35.0, 2026-09-23 [S081].

## Langfuse
- **What it is:** an open-source, self-hostable LLM engineering platform; Anthropic's post calls it a "Self-hosted open-source alternative" to LangSmith [S079][S071].
- **What it is for:** scoring production traces and datasets with LLM-as-a-judge, human annotation, code evaluators or custom workflows via API; score trending and human-versus-AI agreement; a GitHub Action to block deploys on regressions [S071].
- **What it is not for:** the source does not describe agent-specific graders or red teaming.
- **Version checked:** v4.46.0, 2026-09-25 [S071].

## LangSmith
- **What it is:** LangChain's platform for "tracing, offline and online evaluations, and dataset management" [S079].
- **What it is for:** code evaluators, LLM-as-judge, decision model evaluators, pairwise comparison and annotation queues; threads for multi-turn; offline for pre-deployment, online for production; agent checks on "correct tool selection and proper argument formatting or trajectory that the agent took" [S083].
- **What it is not for:** the source gives no licence, version or CI statement.
- **Version checked:** unknown [S083].

## Arize Phoenix
- **What it is:** "an open-source AI observability platform" under the Elastic License 2.0, with tracing, evaluation, datasets, experiments, playground and prompt management [S084]. Arize AX is the hosted extension [S079].
- **What it is for:** OpenTelemetry tracing across Python, TypeScript, Java and Go integrations, including OpenAI Agents SDK and Claude Agent SDK; evals packages in Python and TypeScript (alpha) [S084].
- **What it is not for:** teams that need an OSI-approved licence; ELv2 is source-available.
- **Version checked:** arize-phoenix 20.16.0, 2026-09-23 [S084].

## Weights & Biases Weave
- **What it is:** a toolkit for "evaluation-driven LLM application development", Apache-2.0 SDK with a hosted platform [S085].
- **What it is for:** an `Evaluation` over a Dataset or a list of dicts, scorers that take an `output` and return a dictionary of scores, a `trials` parameter for repeats, and a UI with filtering and saved views [S085].
- **What it is not for:** the evaluations page does not describe multi-turn, agents or CI; Bloom uses W&B for sweeps rather than for grading [S073].
- **Version checked:** weave 0.53.11, 2026-09-25 [S085].

## Google Cloud, Vertex AI Gen AI evaluation service
- **What it is:** a managed service whose "defining feature" is "adaptive rubrics, a set of tailored pass or fail tests for each individual prompt" [S087].
- **What it is for:** adaptive rubrics (recommended), static rubrics, computation-based metrics such as ROUGE and BLEU, and custom Python functions; datasets from upload, "directly from production logs", or synthetic generation; console and SDK; agent evaluation and AutoSxS pipelines [S087].
- **What it is not for:** portability; the rubric generation is a managed feature.
- **Version checked:** docs updated 2026-09-25 [S087].

## Microsoft Foundry evaluation
- **What it is:** built-in evaluators and observability for Azure-hosted AI apps, described in three lifecycle stages: base model selection, pre-production evaluation, post-production monitoring [S088].
- **What it is for:** quality, RAG, safety and agent evaluators ("tool call accuracy, task completion"), custom evaluators, an AI red teaming agent on PyRIT, continuous evaluation of sampled production traffic, scheduled evaluation for drift, OpenTelemetry tracing into Application Insights, and "automated quality gates into CI/CD pipelines" [S088].
- **What it is not for:** free experimentation; playground evaluations are on by default and billed on consumption [S088].
- **Version checked:** docs 2026-07-31; azure-ai-evaluation 1.18.7, 2026-09-25 [S088].

## Amazon Bedrock Evaluations
- **What it is:** a managed job where "Amazon Bedrock uses an LLM to score another model's responses and provide an explanation of how it scored each prompt and response pair" [S086].
- **What it is for:** a generator model and an evaluator model, built-in metrics with a prompt per metric, custom metrics, and bring-your-own responses so non-Bedrock outputs can be judged; judge models include Nova, Claude, GPT-5.4 and GPT-5.5, Llama 3.1 70B and Mistral Large; reports land in S3 [S086].
- **What it is not for:** agent trajectories or multi-turn grading; the page describes prompt-response pairs.
- **Version checked:** living docs [S086].
