import { test, expect } from '@playwright/test';
import { BookPage } from '@pages/book.page';

const RELATED = [
  'LLM-as-judge',
  'Human annotation',
  'Rubrics and pairwise',
  'Statistical treatment of eval scores',
  'Non-determinism and pass rates',
];

test.describe('See also', () => {
  test('judge calibration lists its five related practices, and one opens', async ({ page }) => {
    const book = new BookPage(page);
    await book.goto('practices/3-judging/judge-calibration');
    await expect(book.seeAlsoLinks).toHaveText(RELATED);

    await book.seeAlsoLinks.filter({ hasText: 'Human annotation' }).click();
    await book.expectAt('practices/3-judging/human-annotation');
    await expect(book.heading).toHaveText('Human annotation');
  });
});
