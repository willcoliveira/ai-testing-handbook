# Proposed "Who does it (sourced)" bullets, vendor batch 2 (Google, Microsoft, Amazon)

Ids S236 to S258 are in `sources/_vendors-2.rows.md` and must be merged into `sources.md` before these
bullets are applied. S116 is already registered. One block per practice id; each bullet is one sentence
with a date and a source id.

## practice: guardrails
- **Google, living:** the Gemini API exposes four adjustable harm categories with five block thresholds, "the default block threshold is Off for Gemini 2.5 and 3 models", and core harms such as child safety "are always blocked and cannot be adjusted" [S236].
- **Google, 2025-04:** ShieldGemma 2 is a 4B open-weight image classifier for sexually explicit, dangerous and violent content, evaluated on "approximately 500 examples for each harm policy", with the caveat that it "is also highly sensitive to the specific user-provided description of safety principles" [S243].
- **Microsoft, 2026-02:** the Frontier Governance Framework names "harm refusal" and "deployment guidance" as safety mitigations applied "so that the model's risk level remains at low or medium once mitigations have been applied" [S247].
- **Amazon, 2025-12:** the Nova 2 Lite service card describes a runtime pipeline in which "the model filters the prompt to comply with safety, security, and other design goals" and later "filters the completion for safety and other concerns" before returning it [S257].
- **Amazon, 2026-09:** the Frontier Model Safety Framework lists "runtime input and output moderation systems" among its safeguards alongside training data safeguards, alignment training, fine-tuning safeguards and abuse detection classifiers [S254].

## practice: false-positive-protection
- **Google, 2026-09:** the Gemini 3.8 Flash card reports unjustified refusals as a point change against Gemini 3.7 Flash and summarises the result as "low unjustified refusals" [S240].
- **Google, 2026-07:** the Gemma 4 card says safety gains came "while keeping unjustified refusals low" and that "All testing was conducted without safety filters" [S241].
- **Microsoft, 2022-06:** the Responsible AI Standard requires teams to define intended uses where "lower acceptable error rates (including false positive and false negative error rates), are advised" (RS1.5) [S246].
- **Microsoft, 2026-08:** the AI Red Teaming Agent docs warn that attack success is judged by generative models, so "there's always a chance of false positives and we always recommend reviewing results before taking mitigation actions" [S251].
- **Amazon, living:** the Nova responsible use page tells customers who hit moderation to examine prompts against the published guidelines, since "Optimizing the prompts to reduce the likelihood of generating undesired outcomes is the recommended strategy" [S258].

## practice: red-teaming
- **Google, 2026-09:** the Gemini 3.8 Flash card reports "manual red teaming by specialist teams who sit outside of the model development team" with "no egregious concerns" against the Gemini 3.1 Pro baseline [S240].
- **Microsoft, 2024-12:** the Phi-4 card says "the independent AI Red Team (AIRT) at Microsoft" tested "in both average and adversarial user scenarios", the latter with "jailbreaks, encoding-based attacks, multi-turn attacks, and adversarial suffix attacks" [S248].
- **Microsoft, 2026-03:** for Phi-4-reasoning-vision-15B, "Automated red teaming was performed on Azure to assess safety risks including groundedness, jailbreak susceptibility, harmful content generation, and copyright violations for protected material" [S249].
- **Microsoft, 2026-08:** the AI Red Teaming Agent applies 24 PyRIT attack strategies to seed prompts per risk category and scores Attack Success Rate, "the percentage of successful attacks over the number of total attacks" [S251].
- **Amazon, 2025-12:** the Nova 2 report keeps a "three-pillar structure" of "internal Amazon red teaming, automated red teaming, and external third-party red teaming" and names ActiveFence, Innodata, Chatterbox Labs, PrismAI, EnkryptAI, Gray Swan and Aymara [S255].
- **Amazon, 2026-01:** for Nova 2 Lite, Nemesys Insights ran an uplift study with "nearly 800 participants in a rigorous red-teaming exercise" and "concluded that the model remains below the overall CBRN threshold" [S256].

## practice: frontier-safety-frameworks
- **Google, 2026-09:** a Flash-tier card inherits the frontier verdict: Gemini 3.8 Flash "did not reach any Tracked or Critical Capability Levels (T/CCLs)" on the basis of the Gemini 3.7 Flash evaluation under the April 2026 framework [S240].
- **Microsoft, 2026-02:** the Frontier Governance Framework tracks five capabilities, runs a leading indicator assessment "during pre-training, after pre-training is complete, after post-training, and prior to deployment" and "at least every six months", and escalates to a deeper capability assessment scored low, medium, high or critical [S247].
- **Amazon, 2026-09:** the Frontier Model Safety Framework commits that Amazon "will not deploy frontier AI models developed by Amazon that exceed specified risk thresholds without appropriate safeguards in place", with a go/no-go review of "the safeguards evaluation report" by the SVP for model development and the Chief Security Officer [S254].
- **Amazon, 2026-01:** the Nova 2 Lite paper is a per-model framework report with benchmark scores (WMDP-Bio 0.82, ProtocolQA 0.49, VCT 0.29), a third-party uplift study and METR's statement that the model "does not cross the Automated AI R&D Critical Capability Threshold" [S256].
- **METR, living:** the tracker lists Google DeepMind's FSF v3.1 (2026-04-17), Microsoft's Frontier Governance Framework (2026-02, v1.0 2025-02) and Amazon's Frontier Model Safety Framework (2025-02), and states that indexing "should not be considered an endorsement of their substance" [S116].

## practice: model-and-system-cards
- **Google, living:** the model cards index describes cards as "Simple, structured overviews of how an advanced AI model was designed and evaluated" and lists cards per Gemini, Gemma, generative and robotics release with dates [S238].
- **Google, 2026-05:** the Gemini 3.5 Flash methodology note accompanies the card and states which scores are self-computed, which are "sourced from providers' self reported numbers", and the run counts behind each benchmark [S239].
- **Microsoft, 2022-06:** the Responsible AI Standard makes a Transparency Note mandatory for platform services, carrying "intended uses" and "evidence that the system is fit for purpose" (A3.6) and the reliability evaluation outputs (RS1.9) [S246].
- **Microsoft, 2026-07:** the Foundry safety evaluations Transparency Note states that models sold by Azure "have been evaluated by Microsoft based on Microsoft's Responsible AI standards" while third-party and open models "have not been evaluated by Microsoft" [S252].
- **Amazon, 2025-12:** an AWS AI Service Card covers intended uses, a test-driven methodology, per-dimension results with dataset sizes and pass rates, and a downloadable training data summary, and is dated to a release ("current as of December 2, 2025") [S257].
- **Amazon, 2026-09:** the framework commits that "Amazon will publish, in connection with the launch of a frontier AI model, information about the frontier model evaluation for safety and security" [S254].

## practice: capability-benchmarks
- **Google, 2026-05:** "All Gemini scores are pass @1 except where otherwise noted", "'Single attempt' settings allow no majority voting or parallel test-time compute", and "To reduce variance, we average over multiple trials for smaller benchmarks", with SWE-Bench Pro "averaged over 5x runs" [S239].
- **Google, 2026-07:** the Gemma 4 card tables MMLU Pro, AIME 2026, LiveCodeBench v6, GPQA Diamond, Tau2, HLE, MMMU Pro, OmniDocBench and MRCR v2 across five sizes from E2B to 31B [S241].
- **Microsoft, 2026-02:** a benchmark enters the leading-indicator suite only if it has "low saturation (i.e., the best performing models typically score lower than 70%)", measures "an advanced capability", and has "a sufficient number of prompts to account for non-determinism in model output" [S247].
- **Microsoft, 2024-12:** the Phi-4 card reports MMLU, MATH, GPQA, DROP, MGSM, HumanEval and SimpleQA "using OpenAI's SimpleEval" [S248].
- **Amazon, 2025-12:** the Nova 2 report lists the API parameters used per benchmark in an appendix (temperatures of 0.7, 0.6 and 0.001 appear) and marks models it "was unable to benchmark" [S255].

## practice: post-training-evals
- **Microsoft, 2026-02:** frontier models are screened "after post-training" as one of four fixed checkpoints, and again if there is "significant fine-tuning that might affect tracked high-risk capabilities" [S247].
- **Microsoft, 2024-12:** Phi-4's safety post-training used "SFT (Supervised Fine-Tuning) and iterative DPO" and was then assessed by the AI Red Team [S248].
- **Google, 2026-07:** the Gemma 4 report pairs "post-training evaluations and train-time mitigations" and reports "minimal policy violations" across sizes and modalities [S242].
- **Amazon, 2025-12:** Nova 2 was evaluated "in reasoning and non-reasoning modes" and red-teaming insights "directly informed model refinements prior to release" [S255].

## practice: fine-tuning-evals
- **Microsoft, 2026-02:** a leading indicator assessment is triggered when Microsoft "substantially fine-tunes first- or third-party models, where the compute used for fine-tuning is more than 1/3 of the base model", defaulting to a third of 10^25 FLOPs when base compute is unknown [S247].
- **Amazon, 2025-12:** the service card says customization "can impact safety, fairness and other properties of the new model", that Amazon's adaptation method aims to minimise changes to built-in protections, and that "After any customization, customers should test their model according to their own responsible AI policies" [S257].
- **Amazon, 2026-09:** the framework lists "Fine-tuning Safeguards" and says Amazon observes "signals in the fine-tuning recipe" that could raise misalignment and takes "corrective actions" [S254].

## practice: regression-on-upgrade
- **Google, 2026-09:** the Gemini 3.8 Flash card reports each safety and tone suite as a signed point change against Gemini 3.7 Flash rather than as an absolute score [S240].
- **Amazon, 2025-12:** "When we release new versions of Amazon Nova 2 Lite, customers may experience changes in performance on their use cases", so customers "should consider retesting the performance of the new Amazon Nova 2 Lite models on their use cases" [S257].
- **Amazon, 2026-09:** Amazon "will re-evaluate deployed models prior to any major updates that could meaningfully enhance underlying capabilities" [S254].
- **Microsoft, 2026-08:** the AI Red Teaming Agent is positioned for the development stage of "Upgrading models within your application or creating fine-tuned models" as well as pre-deployment [S251].

## practice: llm-as-judge
- **Microsoft, 2026-07:** Foundry "provisions a fine-tuned Azure OpenAI GPT-4o model" to generate adversarial prompts and "another GPT-4o model to annotate your test dataset", returning a label (Very low, Low, Medium, High) "and reasoning for the AI-generated label" [S252].
- **Microsoft, 2026-04:** hosted safety evaluators score on a 0 to 7 scale and, "Given a numerical threshold (default 3), the evaluator outputs pass if the score is less than or equal to the threshold, or fail otherwise" [S253].
- **Amazon, 2025-12:** the Nova 2 report evaluates its own models as content moderation classifiers, reporting F1 on Aegis, WildGuard and Jigsaw against Claude, Gemini and GPT baselines [S255].

## practice: judge-calibration
- **Microsoft, 2026-07:** the safety-evaluator judge was checked against human labels on "500 English, single-turn texts, 250 single-turn text-to-image generations, and 250 multi-modal text with image-to-text generations" per risk area on a 0 to 7 scale at 0, 1 and 2-level tolerance, with lower agreement for violence and hate because the human and automated guidelines "have since diverged" [S252].
- **Microsoft, 2026-08:** red-teaming runs "use generative models to evaluate Attack Success Rates (ASR) and can be non-deterministic, non-predictive" [S251].
- **Amazon, 2025-12:** the service card tells customers to establish an effectiveness score from "human judgements (with multiple judgements per test prompt)", and the Nova 2 report's image quality study was "performed by a third-party" in a single-blind design [S257][S255].

## practice: agent-evals
- **Microsoft, 2026-08:** agent-only red-teaming categories (prohibited actions, sensitive data leakage, task adherence) check "tool outputs for unsafe or risky behavior", run cloud-only in "a minimally sandboxed environment", and are limited to "Single-turn, English-only; synthetic data" [S251].
- **Amazon, 2026-01:** cyber evaluation of Nova 2 Lite used Hack The Box environments with "a custom agent deployed on a Kali Linux EC2 instance" in "fully autonomous mode", scenario-based testing and human-in-the-loop phases [S256].
- **Amazon, 2026-09:** framework evaluations run "both with and without 'agentic scaffoldings,' environments that grant the model access to external tools such as code interpreters, web browsers, and file systems" [S254].
- **Google, 2026-05:** OSWorld-Verified scores are "averaged over 5 runs with a single attempt per run" with "max step length of 100" and pyautogui actuation [S239].

## practice: online-evals-and-drift
- **Amazon, 2026-09:** beyond pre-deployment work, Amazon runs "lighter-touch automated benchmark assessments on a recurring basis, including after model launch, to monitor emerging risks" [S254].
- **Amazon, 2025-12:** on "Performance Drift", "customers should consider periodically retesting the performance of Amazon Nova 2 Lite and adjust their workflow if necessary" [S257].
- **Microsoft, 2026-08:** post-deployment, teams can "Monitor your Gen AI applications and agents after deployment with scheduled continuous red teaming runs on synthetic adversarial data" [S251].
- **Microsoft, 2026-02:** Microsoft says it is "progressing work to further study models when in use and assess the real-world effectiveness of mitigations" [S247].
- **Google, living:** the safety guidance page asks developers to plan "how you'll spot and deal with problems that arise" through feedback channels and user studies with "a diverse mix of users" [S237].

## practice: standards-and-regulation
- **Microsoft, 2026-02:** the Frontier Governance Framework scopes itself to models covered by "the EU AI Act, California's Transparency in Frontier AI Act (TFAIA), and New York's Responsible AI Safety and Education (RAISE) Act", cites NIST SP 800-53 and NIST 800-218 for security, and logs its 2026 changes against the EU Code of Practice [S247].
- **Microsoft, living:** the 2026 transparency report aligns the programme to "the NIST AI Risk Management Framework (RMF) functions of Govern, Map, Measure, and Manage" and reports reviewing "100+ enacted and proposed laws" [S250].
- **Amazon, 2025-12:** the Nova 2 Lite service card states the model "is not intended to support any prohibited practices under the EU AI Act" and provides a complaints channel under the EU Code of Practice for General-Purpose AI Models [S257].
- **Amazon, 2026-09:** the framework update was made to "account for relevant laws and regulations" and will be revisited "at least annually" [S254].
- **Google, living:** SAIF maps 15 AI security risks to named controls, with the caveat that the site "is not a reflection of Google's current technical implementations" [S244].
