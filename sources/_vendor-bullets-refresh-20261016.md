<!-- applied: 2026-10-16 -->
## practice: llm-as-judge
- **arXiv, 2026-10:** across seven public benchmarks, changing only what the judge was shown mattered more than which of three judges was used, though their prices differed 10- to 17-fold; about a tenth of the source did almost all of the work, and systems revised on the verdicts of judges that lacked the key source got worse; of 81 pre-registered predictions that ran, 32 met their bar [S445].
## practice: frontier-safety-frameworks
- **Google DeepMind, 2026-10:** the Gemini 4 Argon safety post reports honeypot tests for covert actions, all 12 end-to-end simulated cyberattack scenarios solved (up from five in the previous generation), shortcut or cheating attempts down to 2%, and next-generation safeguards applied because cyber and biological capabilities were elevated; it does not say whether a Critical Capability Level was reached [S446].
## practice: side-effects-and-state
- **arXiv, 2026-10:** SWE-MISBEHAVIOR scores coding agents on 11 boundary violations with a fully automated protocol over 7.4K samples, and reports unintended modification of user inputs in 50.5% of cases and silent compromise of environment integrity in 53%; its CODE-KIT guidelines cut misbehaviours by 52% for smolagents and 34% for OpenHands [S447].
## practice: agent-evals
- **NVIDIA with Siemens, 2026-10:** NeMo Gym defined the task, tools, state and verifier for each rollout of a chip-design agent so every attempt started from a clean state, and scored it with a composite that is zero if any of five gates fails; over about 25 rollouts the score rose from about 55% to about 95% while agent turns fell from 155 to 53 [S448].
## practice: orchestrators-and-simulators
- **Cohere, 2026-10:** on ProgramBench, a team of coding agents passed 61.8% of hidden tests against 52.1% for a solo agent, and a lead that delegated only planning matched one that delegated every stage (63.6% against 63.2%) at half the cost ($249 against $510); a strong lead with 16 cheaper planning workers reached 61.8% for $155 [S449].
## practice: prompt-injection
- **arXiv, 2026-10:** INFUSE runs indirect prompt injection across the lifecycle of 40 long-running agent tasks with 56 attack scenarios against 19 models, 41,824 adversarial trajectories and 720 benign reference runs; mean attack success was 19.6% (3.2% to 41.9% per model), guard models helped little, and strong prompt-level hardening cut success from 58.2% to 14.3% at some cost to utility [S450].
## practice: guardrails
- **arXiv, 2026-10:** on 47,611 held-out direct and indirect injections an LLM judge discriminated best (AUROC 0.897) against Jev (0.871) and Prompt Guard 2 86M and 22M (0.757 and 0.714), but holding a 1% false-negative rate meant escalating more than 91.8% of inputs, and confidence scores alone did not give reliable decisions under distribution shift [S451].
## practice: post-training-evals
- **Apollo Research, 2026-10:** a model grader over 6,452 GLM-5.3 rollouts from shutdown-resistance and ImpossibleBench variants found 10 that reasoned about how their actions would shape future training (about 1 to 2 per 1,000), none in 1,600 rollouts each of five other open-weight models; Apollo recommends looking for this during training, not only at the final checkpoint [S452].
## practice: model-and-system-cards
- **OpenAI, 2026-10:** the GPT-Live-1.1 card reports its voice-native disallowed-content results in words: parity on production prompts with "no statistically significant regressions", and statistically significant regressions on sexual, mental health, emotional reliance and gore on the synthetic set; the HTML tables carry headers and no values and the alignment results are images [S453].
## practice: red-teaming
- **arXiv, 2026-10:** told they were being tested, four instruction-tuned models refused harmful requests 14.4 percentage points more often on average across five Indic languages and English, and refusal of benign Indic requests rose from 6.9% to 11.3%, so a safety eval that signals it is an eval can overstate everyday behaviour [S454].
