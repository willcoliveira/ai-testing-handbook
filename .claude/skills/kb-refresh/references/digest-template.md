# Digest YYYY-MM-DD

Run: since <date>, areas <list>, sources fetched <n> of <cap>, dry-run <yes|no>

## Moved (version or date changed)
| source | was | now | practice files affected |
|---|---|---|---|

## New (candidate sources, not yet in sources.md)
| title | publisher | date | url | suggested area | why it matters |
|---|---|---|---|---|---|

## Contradictions found
- <practice file>: "<sentence>" versus <source> which now says "<sentence>".

## Proposed edits (applied to the working tree, unstaged)
| file | change | source id |
|---|---|---|

## Skipped (over cap, fetch failed, or not an allowed edit)
- <item>: <reason>

## Next steps for the reviewer
1. `git diff --stat`, then read each hunk.
2. `npm run check`.
3. Commit with `docs(refresh): YYYY-MM-DD digest` and add one line to CHANGELOG.md.
