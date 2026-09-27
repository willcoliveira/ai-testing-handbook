# Labs and vendors: what each publishes about testing its own models

One file per organisation, all on the same template, all limited to what is public. This page is
the cross-vendor view: where the practices converge, where they diverge, and what none of them
publish. Read it before any single lab file, and read a lab file before quoting a vendor.

## The matrix

| Organisation | Published framework | Thresholds or domains | Per-model evaluation document | Third-party testing named | Guard model or moderation shipped | Evaluation code shipped | File |
|---|---|---|---|---|---|---|---|
| Anthropic | Responsible Scaling Policy v3.4, 2026-07 [S096] | capability thresholds; Risk Reports every 3 to 6 months | system card per release [S098] | yes, named in cards | no separate guard model | Petri, Bloom [S101][S073] | [anthropic](anthropic.md) |
| OpenAI | Preparedness Framework v2, 2025-04 [S102] | High and Critical thresholds in three tracked categories | system card per release, Deployment Safety Hub [S103][S104] | yes, named in cards | moderation endpoint (API) | Evals repository [S082] | [openai](openai.md) |
| Google DeepMind | Frontier Safety Framework v3.1, 2026-04 [S109] | critical capability levels | FSF report and model card per model [S110][S240] | "where required or appropriate" [S107] | ShieldGemma 2 [S243] | Vertex evaluation service [S087] | [google-deepmind](google-deepmind.md) |
| Meta | Advanced AI Scaling Framework v2, 2026-04 [S113] | outcomes-led thresholds in three areas | Llama model cards [S114] | not stated in the card fetched | Llama Guard 4 [S126] | CyberSecEval 4 [S125] | [meta](meta.md) |
| Microsoft | Responsible AI Standard v2, 2022-06, and Frontier Governance Framework, 2026-02 [S246][S247] | product-level requirements; frontier framework | Phi model cards [S248][S249] | not stated for models | Foundry safety evaluators [S253] | PyRIT, AI Red Teaming Agent [S131][S251] | [microsoft](microsoft.md) |
| Amazon | Frontier Model Safety Framework, 2025-02, updated 2026-09 [S254] | four critical risk domains with thresholds | Nova 2 report, a per-model FMSF paper, AI Service Cards [S255][S256][S257] | not stated in the documents fetched | Bedrock Guardrails [S124] | Bedrock Evaluations [S086] | [amazon](amazon.md) |
| xAI | Frontier AI Framework, 2026-06 [S263] | risk domains in EU code-of-practice terms | Grok system and model cards [S265][S266] | evaluation partners named in the 4.7 card | not stated | none of its own; public benchmarks and a Petri-derived audit | [xai](xai.md) |
| NVIDIA | Frontier AI Risk Assessment, 2025-08 [S267] | a risk assessment, not thresholds | Nemotron technical reports [S268] | not stated | Nemotron Content Safety [S269], NeMo Guardrails [S129] | NeMo Evaluator, garak [S270][S130] | [nvidia](nvidia.md) |
| Cohere | Secure AI Frontier Model Framework v1.0, 2025-02 [S271] | rejects capability thresholds; five components | Command A report [S272] | framework allows; report silent | Safety Modes (API) [S272] | LBPP benchmark extension | [cohere](cohere.md) |
| Mistral | none found [S116] | none | release notes and model cards [S259][S260] | not stated | moderation API and guardrailing [S261][S262] | none found | [mistral](mistral.md) |
| DeepSeek | none; signatory of the Chinese AI Safety Commitments, 2024-12 [S235] | none | V3, R1 (Nature version with a safety appendix), V3.2 reports; the V4 card has no evaluation section [S213][S214][S215][S216] | evaluated from outside by CAISI [S218][S219] | not stated | open weights and stated evaluation settings | [deepseek](deepseek.md) |
| Alibaba (Qwen) | none found [S116][S234] | none | Qwen3 report and model cards [S220][S222][S223] | not stated | Qwen3Guard [S221] | open weights | [alibaba-qwen](alibaba-qwen.md) |
| Moonshot, Zhipu, ByteDance, MiniMax | Zhipu is a Seoul signatory; the others none found [S234] | none | Kimi K2 report with a red-teaming table; K2.5 and K3 without; GLM reports [S224][S225][S226][S229][S230] | K2.5 evaluated independently; K3 assessed by AISI and CAISI [S227][S228] | not stated | open weights | [moonshot-and-zhipu](moonshot-and-zhipu.md) |
| Open ecosystem (EleutherAI, Hugging Face, AI2) | evaluation standards, not safety frameworks | none | Olmo reports with full training and evaluation detail [S278] | not applicable | not applicable | lm-evaluation-harness, lighteval, OLMES [S274][S275][S279] | [open-ecosystem](open-ecosystem.md) |
| Third-party evaluators | methods and trackers | none | evaluation reports cited by labs | they are the third party | not applicable | Inspect, HELM, AILuminate [S117][S118][S120] | [third-party-evaluators](third-party-evaluators.md) |

Dates are those of the documents read. "Not stated" means the documents fetched do not say; it
is not a claim that nothing exists.

## Where they converge

1. **A document per model with an evaluation section.** Every organisation except Mistral
   publishes a card or report per model that lists benchmarks run and, in most cases, safety
   evaluations. The depth varies from a full system card to a table of scores.
2. **A published framework with thresholds** in the Western frontier labs: Anthropic, OpenAI,
   Google DeepMind, Meta, Amazon, xAI and Microsoft state capability levels or risk domains and
   what happens when a model crosses them. NVIDIA and Cohere publish frameworks of a different
   shape. No Chinese developer appears in the frontier safety policy tracker [S116].
3. **A shipped guard model or moderation layer** from most of the vendors that sell inference:
   Llama Guard 4, ShieldGemma 2, Qwen3Guard, Nemotron Content Safety, Mistral moderation, Bedrock
   Guardrails, Foundry safety evaluators, Cohere Safety Modes. A team can test its own guardrails
   against several of these without depending on one vendor.
4. **Open evaluation code** from labs and from the open ecosystem: Petri and Bloom, CyberSecEval,
   NeMo Evaluator, Inspect, lm-evaluation-harness, lighteval, OLMES. The harness a team picks
   does not have to come from its model vendor.
5. **Third-party evaluation is becoming normal at the frontier**, named in Anthropic and OpenAI
   cards, allowed by the Google framework, listed as partners by xAI, and done from the outside by
   CAISI and AISI on DeepSeek and Kimi models regardless of the developer's participation.

## Where they diverge

- **Thresholds versus outcomes versus neither.** Capability thresholds (Anthropic, OpenAI,
  Google, Amazon, xAI), outcomes-led threat scenarios (Meta), an explicit rejection of the
  threshold model on methodological grounds (Cohere), and no framework at all (Mistral, the
  Chinese labs).
- **What a card contains.** From a full account of capability, safety, red teaming and external
  testing, to a benchmark table with no safety section (the DeepSeek V4 card, the Gemma 4 card
  as fetched).
- **Statistical care.** A few documents state runs, variance or sampling (the Gemini 3.5 Flash
  methodology note, the Nemotron practice of averaging repeated runs); most report single numbers.
- **What is open.** Weights, code and evaluation settings are open at DeepSeek, Alibaba, Moonshot,
  Zhipu, Mistral, Meta and the open ecosystem; closed elsewhere, with the evaluation tooling open
  instead.

## What none of them publish

The contents of internal evaluation sets; the numerical values of most thresholds; red-team
rosters and methods in detail; the decision records behind a release; and, for most, whether a
third party ever blocked or delayed a launch. Every lab file states this under "What is not
public", and a claim about any of it in this repository would be an inference, which the sourcing
rule forbids.

## What this means for a team building on any vendor

- Read the model's card or report before choosing it, and note what its evaluation section does
  not contain. Absence in the card is a risk to test yourself, not evidence either way.
- Do not rely on the vendor's guard model alone; test it with must-block and must-not-block cases
  (how-to 07), and compare a second vendor's guard where the licence allows.
- Run your own evaluation regardless of the vendor's numbers (how-to 06); public benchmark scores
  are about the benchmark's task, not yours.
- Pin the version and read the deprecation page; cadences and notice periods differ by vendor
  (how-to 10).
- Prefer an evaluation harness that runs against any provider, so a vendor change is a
  configuration change and not a rewrite.
