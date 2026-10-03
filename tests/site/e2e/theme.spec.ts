import { test } from '@playwright/test';
import { BookPage } from '@pages/book.page';

test.describe('Dark mode', () => {
  test('the toggle sets dark, which survives Next and a reload; toggling back clears it', async ({ page }) => {
    const book = new BookPage(page);
    await book.goto('practices/3-judging/judge-calibration');
    await book.expectDark(false);

    await book.toggleTheme();
    await book.expectDark(true);

    const next = (await book.nextLink.getAttribute('href')) ?? '';
    await book.clickNext();
    await book.expectAt(next);
    await book.expectDark(true);

    await book.reload();
    await book.expectDark(true);

    await book.toggleTheme();
    await book.expectDark(false);
  });
});
