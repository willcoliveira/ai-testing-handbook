# Resources

Every video, talk and document in the learning path, with its phase, what it teaches, and the
testing counterpart: what a tester should take from it and how that layer is tested. Titles and
dates verified on 2026-09-26. Ids resolve in [sources.md](../sources.md).

| Id | Phase | Resource | Teaches | Testing counterpart |
|---|---|---|---|---|
| S186 | 0 | 3Blue1Brown, But what is a GPT? | what a transformer does with tokens | why outputs are samples; what temperature does not fix |
| S187 | 0 | Claude API docs | structured output, tool use, the model catalogue | schema validation as a test; pinning a model id |
| S188 | 0 | OpenAI API docs | the same primitives on another provider | the same tests should pass on both |
| S171 | 1 | Learn AI harness engineering in 14 minutes (Edward Donner) | the harness as the code around the model | the harness is where assertions live |
| S172 | 1 | Real AI agent stack: harness, loop, graph (Cloud Codes) | the three layers and their split | which layer a failure belongs to |
| S173 | 1 | AI agent graph engineering in 21 minutes (Sean's AI Stories) | states and transitions | a test per transition; terminal versus hold states |
| S174 | 1 | Loop engineering, graph engineering in 18 minutes (Dr. Maryam Miradi) | budgets and stop conditions | budget tests; replay from a recorded trajectory |
| S175 | 2 | Claude Agent SDK full workshop (Thariq Shihipar, Anthropic) | sessions, tools, permissions, hooks | hooks as test points; a stub model behind a flag |
| S176 | 2 | Build agents that run for hours (Ash Prabaker, Andrew Wilson, Anthropic) | checkpoints and resumption | kill and resume as a test |
| S177 | 2 | Harness engineering: the production cage (Mike Chambers, AWS) | allow-lists, budgets, no-go actions | the deny path as a test; the audit log as evidence |
| S178 | 3 | When to build your own agent harness (Harrison Chase) | frameworks versus control | what the framework was doing for you, listed |
| S179 | 3 | Context engineering our way to long-horizon agents (Harrison Chase) | what goes in the window and why | the assembled prompt printed and inspected per turn |
| S180 | 3 | Building an AI agent from scratch in Python (The Carbon Layer) | the loop with no framework | a loop you can unit test |
| S181 | 3 | What if the harness mattered more than the model? (Aditya Bhargava, Etsy) | harness quality as the lever | test the harness before you tune the prompt |
| S182 | 4 | One million lines of code, zero keystrokes (Ai++) | coding agents at scale | governance: who merges |
| S183 | 4 | The stack behind Antigravity, Claude Code and Cursor (Google Cloud Tech) | production coding-agent stacks | where tracing and budgets sit |
| S184 | 4 | How AWS thinks about agent harnesses (ShiftMag) | a cloud provider's harness view | latency and cost as budgets |
| S185 | 4 | SE Radio 730: Birgitta Boeckeler on harness engineering | an engineering-practice view | the harness as a testable artefact |
| S189 | 2 | Claude Agent SDK documentation | the SDK reference | the hooks and permissions your tests rely on |

Practices and their sources are listed per file under `practices/`. Labs, benchmarks and tools have
their own folders.
