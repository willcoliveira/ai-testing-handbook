# AI Testing Handbook

Evals, guardrails, benchmarks and audits for LLM applications and agents. A sourced reference on
how AI models and agents are evaluated and tested, and a learning path for breaking into AI
testing. Every claim about what a lab, a tool or a benchmark does carries a
dated public source. The author's own production work appears as anonymised patterns.

Maintained by [William Oliveira](https://github.com/willcoliveira). Sits beside
[qualiow-exploratory-testing-skills](https://github.com/willcoliveira/qualiow-exploratory-testing-skills)
and [qualiow-playwright-skills](https://github.com/willcoliveira/qualiow-playwright-skills).

## Start here

- **You build agents and need evals:** [learning-path/5-evals-and-testing.md](learning-path/5-evals-and-testing.md)
  is the reading order through the whole reference.
- **You test software and want to move into AI:** [learning-path/README.md](learning-path/README.md),
  six phases, each with line items, a worked example and exercises.
- **You want to do it, step by step:** [how-to/](how-to/README.md), twelve playbooks that say when,
  what, why and how, from deciding what to test through to auditing and reporting.
- **You want one practice:** [TAXONOMY.md](TAXONOMY.md), two hops from a question to a file.
- **You want a worked example of governance:** [patterns/](patterns/), an anonymised production-build pattern.

## The map

| Area | Question it answers | Where |
|---|---|---|
| 1 Capability evaluation | How good is the model, and can I trust the number? | [practices/1-capability](practices/1-capability/), [benchmarks/](benchmarks/) |
| 2 Application evals | Does my product do its job on my distribution? | [practices/2-application-evals](practices/2-application-evals/), [datasets/](datasets/) |
| 3 Judging and scoring | Who decides pass or fail, and how do I know the judge is right? | [practices/3-judging](practices/3-judging/) |
| 4 Agents and systems | How do I test something that acts, over many turns, with tools? | [practices/4-agents-and-systems](practices/4-agents-and-systems/), [tools/](tools/) |
| 5 Safety, security, guardrails | What must it never do, and how do I prove it will not? | [practices/5-safety-and-security](practices/5-safety-and-security/), [labs/](labs/README.md) (fifteen organisations on one template, with a cross-vendor matrix) |
| 6 Observability | What happened in production, and did quality move? | [practices/6-observability](practices/6-observability/) |
| 7 Training and lifecycle | What changes when the model changes, and how do labs gate that? | [practices/7-training-and-lifecycle](practices/7-training-and-lifecycle/), [training/](training/) |
| 8 Governance | Who signs off, and what counts as validated? | [practices/8-governance](practices/8-governance/) |

The [how-to playbooks](how-to/README.md) turn the practices into procedures with templates.
Every practice file has the same seven sections: What, Why, How, Who does it (sourced), Pitfalls,
Pattern from a production build, Sources. [GLOSSARY.md](GLOSSARY.md) defines the terms.
[sources.md](sources.md) is the register every citation resolves to.

## How it is kept current

A manual Claude Code skill, [kb-refresh](.claude/skills/kb-refresh/SKILL.md), sweeps a bounded list
of lab pages, tool releases, arXiv queries and standards pages, writes a dated digest to
[digests/](digests/), and proposes edits as an unstaged diff. It never commits. A human reviews,
runs `npm run check`, and commits. [ROADMAP.md](ROADMAP.md) lists what the author has not done yet,
each with a public deliverable.

[MAINTAINING.md](MAINTAINING.md) is the routine: the pre-push review, the refresh cadence, and how
to add a source, practice, pattern, lab or how-to by hand.

## Checks

```
npm run check
```

runs three scripts: forbidden strings (see [PRIVACY.md](PRIVACY.md)), sources and template
conformance, and link health. CI runs the same on every push and pull request.

## Vendor neutrality

The practices describe industry practice, not one vendor's. Each "Who does it" section cites
several organisations, `scripts/check-balance.mjs` reports where that is thin, and the labs
folder gives every organisation the same template and the same "What is not public" honesty.

## What this is not

Not a claim to know how any lab tests its models beyond what it publishes. Each lab file has a
section titled "What is not public". Not a vendor comparison with scores; the tools matrix records
what each tool's own documentation supports. Not a place for anything from a client engagement
that is not anonymised per [PRIVACY.md](PRIVACY.md).

## Licence

MIT. See [LICENSE](LICENSE).
