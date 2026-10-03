import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { BookPage } from '@pages/book.page';

// Six representative pages, light and dark. Fails on serious or critical violations.
// No rules are disabled and nothing is excluded.
const PAGES = [
  './',
  'practices/3-judging/',
  'practices/3-judging/judge-calibration',
  'how-to/01-decide-what-to-test',
  'sources',
  'learning-path/knowledge-matrix',
];
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

test.describe('Accessibility (axe)', () => {
  for (const theme of ['light', 'dark'] as const) {
    for (const path of PAGES) {
      test(`${path} in ${theme} has no serious or critical violations`, async ({ page }) => {
        const book = new BookPage(page);
        await book.goto(path);
        await book.useTheme(theme);

        const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
        const blocking = violations
          .filter((v) => v.impact === 'serious' || v.impact === 'critical')
          .map((v) => `${v.impact} ${v.id}: ${v.help} (${v.nodes.length}x, e.g. ${v.nodes[0]?.target.join(' ')})`);
        expect(blocking, `${path} (${theme})`).toEqual([]);
      });
    }
  }
});
