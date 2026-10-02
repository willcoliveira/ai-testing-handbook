# Roadmap: the gaps, each with a public deliverable

What the author has not done yet, stated plainly, with the deliverable that closes each gap and
the practice file it feeds. An item moves from here to `patterns/` when it is done.

| Gap | Deliverable | Feeds | Target |
|---|---|---|---|
| Fine-tuning evals | A held-out evaluation of a small fine-tune against the base model and against a prompt-only baseline, published as a notebook with the split discipline written down | `fine-tuning-evals`, `post-training-evals` | Q1 2027 |
| Dataset construction | A documented 200-item golden set built from synthetic traces, with a datasheet, a licence and a versioning scheme | `golden-datasets`, `model-and-system-cards` | Q4 2026 |
| Judge calibration study | An agreement study of an LLM judge against about 300 human labels, with kappa reported and the disagreements analysed. A smaller precursor exists (a cheaper judge scored against an LLM judge's verdicts, no human labels, no kappa): [decision-model triage](patterns/decision-model-triage-before-an-llm-judge.md) | `judge-calibration`, `llm-as-judge` | Q4 2026 |
| Benchmark contribution | One accepted pull request to an open evaluation suite (Inspect evals or an agent benchmark) | `capability-benchmarks`, `harnesses` | Q1 2027 |
| Video series | The case walkthrough (1), the how-to playbooks (11), the learning-path phases (6), how the vendors test (4), and 60-second shorts per practice (39); scripts live in `videos/` so the privacy check covers them. Estimated 100 to 125 hours for the full catalogue, 40 to 50 for the case plus the how-tos, using the existing slide-and-narration and one-take pipelines | `how-to/`, `learning-path/`, `labs/` | when the text is stable |
| Voice benchmark participation | A run of a public voice benchmark against an open voice stack, with the harness published | `voice-agent-testing` | 2027 |

The build project (a multimodal detector, index and language layer taken to a production shape
with evals, guardrails and QA at each step) is planned separately and is the vehicle for the first
three rows.
