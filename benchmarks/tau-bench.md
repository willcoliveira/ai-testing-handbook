# tau-bench and tau2-bench

## What it measures
Whether an agent can complete a customer-service task while following a domain policy, using tools, and talking to a simulated user. tau-bench has 115 retail tasks and 50 airline tasks; retail carries 500 users, 50 products and 1,000 orders with 7 write and 8 read tools, airline 500 users, 300 flights and 2,000 reservations with 6 write and 7 read tools [S010]. tau2-bench adds a telecom dual-control domain, modelled as a Dec-POMDP, where the user also has tools and the agent must guide the user through actions on their side [S011]. The repository, now labelled tau3-bench at v1.0.1 (July 2026), lists mock, airline, retail, telecom and banking_knowledge domains and a leaderboard at taubench.com with voice and knowledge results [S012].

## Format and grader
The agent gets the policy, the tools and a conversation with a language-model user whose next message is sampled from the chat history. Grading compares the database state at the end of the conversation with an annotated goal state; some tasks also check required actions [S010] [S012]. The reliability metric is pass^k = E_task[C(c,k)/C(n,k)], the chance that all k of k trials succeed. gpt-4o scored 61.2 pass^1 on retail and 35.2 on airline, and below 25 pass^8 on retail [S010].

## Known issues
- The user is a stochastic model; part of the variance is the simulator, not the agent.
- pass^1 and pass^k tell different stories on the same tasks; a leaderboard showing only pass^1 hides the reliability gap [S010].
- Versions are not interchangeable: results from before v1.0.1 are not comparable on banking_knowledge, and the repo records over 75 task fixes [S012].
- Tasks and policies are public, so an agent can be tuned to them.

## How a team should use it
Use it as the shape for your own policy-following eval: a policy document, real tools against a seeded database, a simulated user, and grading on the final state. Run at least 8 trials per task and report pass^k for the k that matches how often the task runs in production. Pin the version and re-run when it changes.

## Sources
- [S010] tau-bench, Yao et al., Sierra, 2024-06-17.
- [S011] tau2-bench, Barres et al., Sierra, 2025-06-09.
- [S012] tau2-bench repository and leaderboard, sierra-research, living.
