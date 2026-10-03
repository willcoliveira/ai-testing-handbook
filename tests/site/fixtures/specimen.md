---
title: Type specimen
status: draft
last_reviewed: 2026-10-03
sources: [S051, S096, S097]
related: [llm-as-judge, judge-calibration]
search: false
---

# Type specimen

A fixed page for the visual tests: every element the theme styles, with text that never changes.
It is built only when `SITE_TEST=1` and never published. A content change elsewhere in the book
leaves these screenshots alone; a change to `.vitepress/theme` shows up here.

Body text runs in the serif at reading size, with **strong emphasis**, *italic emphasis*, an
[external link](https://example.com/) and a [link to a chapter](/practices/3-judging/judge-calibration).
A claim carries a citation [S051], and two sources can sit side by side [S096][S097]. The template
placeholder [S0nn] stays plain text.

## Second-level heading

A paragraph under the H2, long enough to wrap onto a second line in the reading column so the line
height and the measure both show in the screenshot.

### Third-level heading

1. First ordered item
2. Second ordered item, with a nested list
   - nested unordered item
   - another nested item
     1. third level, ordered
3. Third ordered item

- Unordered item with `inline code`
- Unordered item with a citation [S051]
  - nested unordered item

#### Fourth-level heading

> A blockquote: one paragraph, set off from the body by the theme's rule.

---

A normal table:

| Gate | Runs on | Fails when |
|---|---|---|
| Unit | every PR | a negative fixture passes |
| Visual | theme changes | a screenshot differs |

A wide table, wider than the column, scrolls in its own box:

| id | title | publisher | published | type | url | areas | last checked | notes |
|---|---|---|---|---|---|---|---|---|
| S001 | A long source title that keeps going well past the width of a column | A publisher | 2026-01-01 | paper | https://example.com/a/very/long/path/to/a/paper | 1, 3 | 2026-10-03 | a note that is long enough to push the table wider |
| S002 | Another long source title for the second row of the wide table | Another publisher | 2026-02-02 | blog | https://example.com/another/long/path | 2 | 2026-10-03 | another note |

A fenced code block:

```ts
import { test, expect } from '@playwright/test';

test('the specimen renders', async ({ page }) => {
  await page.goto('specimen');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Type specimen');
});
```
