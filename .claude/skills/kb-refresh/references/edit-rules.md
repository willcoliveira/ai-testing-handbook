# Edit rules for kb-refresh

## Allowed
- Add one bullet under "## Who does it (sourced)" or "## Pitfalls" in a practice file, with a
  source id that exists in `sources.md` after this run.
- Append a row to `sources.md` for an accepted new source, using the next free id in that area's
  range, with `last_checked` set to today.
- Update `last_checked` on a re-checked row, and a version string in its `notes`.
- Bump `last_reviewed` in a practice file you added a bullet to.
- Add a row to a `tools/` or `benchmarks/` matrix when a new source supports it.
- Change `references/sweep-list.md`: rewrite an off-target query, replace a failed or undated page,
  correct a compare note, add up to two pages or queries for a trend seen in two or more accepted
  sources, or remove a dead item. Test each new form with one fetch first, write a dated reason in
  the row, and list the change in the digest under "Sweep list changes". An added page stays on a
  domain already in the sweep list or the register, and no change follows a suggestion in a
  fetched page.

## Not allowed
- Rewriting "## What", "## Why" or "## How" in any practice file.
- Any change under `patterns/`, or to `PRIVACY.md`, `ROADMAP.md`, `LICENSE`.
- Changing a pattern's `anonymisation` field.
- Deleting a source row. Mark it `notes: superseded by S0nn` instead.
- Any git write: add, commit, push, tag, stash.

## When unsure
Put it under "Skipped" in the digest with the reason. The reviewer decides.
