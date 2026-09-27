---
id: statistical-treatment-of-evals
title: Statistical treatment of eval scores
area: 1-capability
status: draft
last_reviewed: 2026-09-27
sources: [S002, S004, S005, S006, S010, S014, S015, S017, S021, S024, S220, S224, S225, S228, S229, S265, S267, S268, S272, S278]
related: [capability-benchmarks, benchmark-hygiene, non-determinism-and-pass-rates, judge-calibration]
---

# Statistical treatment of eval scores

## What
An eval score is a sample mean over questions that could have been different questions, answered by a model that could have answered differently. This practice is the set of formulas and reporting habits that turn one number into a number with an error bar: standard errors, clustered standard errors, paired comparisons, resampling, and a power calculation that says how many questions a decision needs.

## Why
Without an error bar, a two-point gain between two model versions is indistinguishable from noise, and a leaderboard order is a coin flip in its middle ranks. The error-bars paper puts it plainly: evaluations are experiments, and the eval literature had largely ignored how other sciences analyse experiments [S004]. BetterBench found 14 of 24 assessed benchmarks did not run multiple evaluations of the same model or report statistical significance [S005]. The trade-off is cost: paired designs, repeated sampling and larger sets all take more inference time, and a power calculation sometimes says the eval you have cannot answer the question you asked.

## How
The formulas below follow the error-bars paper [S004]. `n` is the number of questions, `s_i` the score on question i (0 or 1, or fractional), `s̄` the mean.

1. **Standard error by the central limit theorem.** `SE = sqrt(Var(s) / n)`, with `Var(s) = (1/(n-1)) * sum((s_i - s̄)^2)`. For 0/1 scores this reduces to `sqrt(s̄ (1 - s̄) / n)`. Use the general form for fractional scores such as F1; the paper notes the Llama 3 report applied the 0/1 form to fractional scores, which is wrong [S004].
2. **95% confidence interval.** `s̄ ± 1.96 * SE`. Worked numbers for common set sizes, at a plausible score:

| Set | n | Score | 95% half-width |
|---|---|---|---|
| SWE-bench Verified | 500 | 70% | about 4.0 points |
| GPQA | 448 [S017] | 80% | about 3.7 points |
| Terminal-Bench 2.0 | 89 [S021] | 60% | about 10 points |
| tau-bench airline | 50 [S010] | 50% | about 14 points |
| HELM Capabilities scenario | 1000 [S002] | 60% | about 3.0 points |

   A 3-point gain on Terminal-Bench 2.0 is inside the noise of a single run.
3. **Clustered standard errors when questions share a source.** Reading-comprehension sets ask several questions per passage; translated sets ask the same question in many languages. Add the within-cluster covariance: `SE_clustered^2 = SE^2 + (1/n^2) * sum over clusters c, sum over i != j in c of (s_i - s̄)(s_j - s̄)`. On DROP the clustered error was 3.05 times the naive one [S004]. Report the cluster count next to n.
4. **Paired differences for two models.** Do not subtract two independent intervals. Compute per-question differences `d_i = s_A,i - s_B,i` and `SE_diff = sqrt(Var(d) / n)`. When the two models find the same questions hard, the paired variance is smaller; the paper's example gives a one-third reduction in variance [S004]. Report the difference, its SE, and the correlation between the two models' per-question scores.
5. **Reduce variance with more samples per question, not lower temperature.** Answer each question K times: the sampling part of the variance falls as `sigma_i^2 / K`; going from K=1 to K=2 cut variance by one third in the paper's example, and reading next-token probabilities on multiple-choice removed it entirely, a two-thirds reduction in the same example. Lowering temperature moves variance into bias; the paper advises against it unless the point is to study the model at that temperature [S004].
6. **Power analysis before the run.** For a paired comparison: `n = (z_alpha/2 + z_beta)^2 * (omega^2 + sigma_A^2 / K_A + sigma_B^2 / K_B) / delta^2`, where `omega^2` is the variance of per-question mean scores across questions and `sigma^2` the mean per-question sampling variance. Worked example from the paper: to detect a 3-point absolute difference 80% of the time at a 5% false-positive rate needs about 969 independent questions [S004]. If your set is smaller, say so and either grow it or accept a coarser threshold.
7. **Reliability metrics for agents.** pass^k is `E_task[ C(c, k) / C(n, k) ]`, the chance that all k of k independent trials succeed, with c successes in n trials [S010]. Report the n trials per task. METR fits a logistic curve of success against human task time and bootstraps hierarchically over task families, tasks and attempts to get its intervals [S015].
8. **Reporting.** Under each point estimate print the SE in parentheses, print n and the cluster count, and for comparisons print the paired difference with its correlation [S004]. A decision rule that fits most teams: call a difference real when the paired 95% interval excludes zero; otherwise write "not distinguishable at n=..." and stop arguing about it.

## Who does it (sourced)
- **Anthropic (Evan Miller), 2024-11:** lists five recommendations: CLT standard errors, clustered standard errors for grouped questions, variance reduction by resampling and next-token probabilities, paired inference on question-level differences, and power analysis [S004].
- **Stanford, BetterBench, 2024-11:** scored 24 benchmarks on 46 practices; 14 of 24 did not repeat evaluations or report significance, and 17 of 24 lacked easy-to-run replication scripts [S005].
- **Stanford CRFM, 2025-03:** HELM Capabilities downsamples every scenario to 1,000 instances (GPQA 448) and ranks by mean score [S002].
- **METR, 2025-03:** reports 50% and 80% horizons with intervals from a hierarchical bootstrap over task families, tasks and attempts, and notes substantial model error [S015] [S014].
- **LMSYS, 2024-03:** Chatbot Arena estimates Bradley-Terry coefficients, deploys sandwich intervals because they are smaller in large samples, and samples model pairs in proportion to the expected reduction in interval width, needing 54% fewer samples than random pairing [S024].
- **Sierra, 2024-06:** tau-bench reports pass^k over 8 trials per task, and reports the drop from pass^1 to pass^8 as the reliability signal [S010].
- **Cohere Labs and others, 2025-04:** simulate best-of-N private submission and find that testing 20 variants lifts the maximum observed Arena score by about 50 points; the same checkpoint scored 1052 and 1069 in two submissions [S006].
- **Alibaba Qwen, 2025-05:** "For each question, we sample 64 times and take the average accuracy as the final score" on AIME [S220].
- **Moonshot AI, 2025-07 and 2026-02:** K2 reports AIME 2025 as Avg@64, GPQA-Diamond as Avg@8 and Tau2-Bench as Avg@4; the K2.5 card states avg@32 for AIME and HMMT, avg@8 for GPQA, five independent runs for coding and avg@3 for vision [S224][S225].
- **Zhipu, 2025-08:** GLM-4.5 reports AIME 24 as Avg@32 and GPQA as Avg@8; SWE-bench Verified is a single run under a 100-iteration limit [S229].
- **Context, UK AISI and US CAISI, 2026-07:** "Kimi K3's overall cyber capability has a larger confidence interval than other models because it was estimated from a single benchmark" [S228].
- **AI2, December 2025:** measures variance as the mean standard deviation over "3 runs of 14 models", buckets tasks (GPQA 1.48 high, MATH 0.25 very stable), and reports every number as "the mean of three runs" [S278].
- **NVIDIA, December 2025:** evaluates Nemotron 3 Nano under multiple prompt variants, "mean accuracy across eight seeds" per prompt, and reports the standard deviation of prompt averages as a prompt-sensitivity metric [S268]; its risk framework runs assessments at "50% confidence" during development and "95-99% confidence" for model-card data [S267].
- **Cohere, April 2025:** reports the human agreement (77.7%) and Cohen's kappa (0.55) of its LLM jury for relative safety, and runs the demographic bias test "five times per sample" to plot the distribution [S272].
- **xAI, April 2026:** reports an RMS calibration error over ten confidence bins on Humanity's Last Exam as its overconfidence metric [S265].

## Pitfalls
1. Using the 0/1 standard error on fractional scores, as the Llama 3 report did; it understates the interval [S004].
2. Treating clustered questions as independent; the interval can be more than three times too narrow [S004].
3. Comparing two point estimates by eye. Only a paired difference with its own interval says whether A beat B [S004].
4. Reading a leaderboard's best-of-N submission as an unbiased estimate; selection alone adds tens of points [S006].
5. Reporting pass@1 for an agent that will run thousands of times; pass^k is the number the on-call engineer will feel [S010].
6. Publishing a score without n, so nobody can compute the interval; most benchmarks assessed by BetterBench did not report significance [S005].

## Pattern from a production build
None yet.

## Sources
- [S002] HELM Capabilities v1.0.0, Stanford CRFM, 2025-03-20.
- [S004] Adding Error Bars to Evals, Evan Miller, 2024-11-01.
- [S005] BetterBench, Reuel et al., 2024-11-20.
- [S006] The Leaderboard Illusion, Singh et al., 2025-04-29.
- [S010] tau-bench, Yao et al., Sierra, 2024-06-17.
- [S014] Measuring AI ability to complete long tasks, Kwa et al., METR, 2025-03-18.
- [S015] Measuring AI ability to complete long tasks (blog), METR, 2025-03-19.
- [S017] GPQA, Rein et al., 2023-11-20.
- [S021] Terminal-Bench 2.0, Merrill et al., 2026-01-17.
- [S024] Chatbot Arena, Chiang et al., 2024-03-07.
- [S220] Qwen3 Technical Report, Qwen Team, Alibaba (arXiv 2505.09388), 2025-05-14
- [S224] Kimi K2: Open Agentic Intelligence, Moonshot AI (arXiv 2507.20534), 2025-07-28
- [S225] Kimi K2.5: Visual Agentic Intelligence, Moonshot AI (arXiv 2602.02276), 2026-02-02
- [S229] GLM-4.5: Agentic, Reasoning, and Coding (ARC) Foundation Models, Zhipu AI and Tsinghua University (arXiv 2508.06471), 2025-08-08
- [S228] UK AISI / CAISI Preliminary Assessment of Kimi K3's Cyber Capabilities, UK AI Security Institute and US CAISI, 2026-07-23
- [S278] Olmo 3 (technical report), Ai2 (Olmo Team), arXiv 2512.13961, 2025-12
- [S268] Nemotron 3 Nano: Open, Efficient Mixture-of-Experts Hybrid Mamba-Transformer Model for Agentic Reasoning (technical report), NVIDIA, 2025-12-23
- [S267] Frontier AI Risk Assessment, NVIDIA (Simkin, Pope, Derczynski, Parisien), 2025-08
- [S272] Command A: An Enterprise-Ready Large Language Model (technical report), Cohere, arXiv 2504.00698, 2025-04
- [S265] Grok 4.20 System Card, xAI, 2026-04-07
