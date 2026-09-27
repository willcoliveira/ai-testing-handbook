# Berkeley Function Calling Leaderboard (BFCL)

## What it measures
Whether a model calls functions correctly given tool schemas. BFCL V4 covers simple, multiple and parallel calls, multi-turn interactions, relevance detection (calling nothing when nothing fits), agentic evaluation, web search, memory, and format sensitivity for prompt-based models. The versions built up: V1 introduced AST matching as the metric, V2 added enterprise functions, V3 added multi-turn, V4 aims at holistic agentic evaluation. The page was last updated 2026-04-12 and the paper appeared at ICML 2025 [S013].

## Format and grader
Input is a prompt plus function definitions. The output call is graded by abstract-syntax-tree matching against the expected call, by executing it and comparing results, or, for multi-turn, by checking state [S013]. The test-case count per category is not stated on the leaderboard page as read.

## Known issues
- AST matching rewards the expected argument form; a semantically equivalent call in a different form can be marked wrong.
- The test set is public, so a model can be trained to its schemas.
- The category mix changes with each version; a V3 score and a V4 score are different measurements [S013].

## How a team should use it
- Use the category breakdown, not the overall rank: relevance detection and multi-turn are the columns that predict whether an agent will make spurious or wrong calls in your product [S013].
- Note the version beside every number; the categories changed between V3 and V4.
- For your own tools, write cases in the same shape (prompt, schemas, expected call) and grade the call structure without a model in the loop; see `practices/4-agents-and-systems/tool-use-evals.md`.
- Where a call has side effects, prefer state-based grading over AST matching, as BFCL does for multi-turn [S013].

## Sources
- [S013] Berkeley Function Calling Leaderboard, UC Berkeley Gorilla team, living, last checked 2026-09-26.
