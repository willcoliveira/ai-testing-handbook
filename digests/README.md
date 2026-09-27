# Digests

One file per run of the `kb-refresh` skill, named `YYYY-MM-DD.md`. A dry run writes
`YYYY-MM-DD.draft.md`, which is gitignored.

A digest has six sections: Moved (a known source changed version or date), New (candidate
sources not yet in `sources.md`), Contradictions (a practice file says something a source now
says differently), Proposed edits (applied to the working tree, unstaged), Skipped (over the cap
or fetch failed), Next steps for the reviewer.

Review it, run `npm run check`, then commit with `docs(refresh): YYYY-MM-DD digest`. Each
accepted digest adds one line to `CHANGELOG.md`. The skill never commits.
