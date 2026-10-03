import { test, expect } from '@playwright/test';
import { BookPage } from '@pages/book.page';

const TARGET = 'practices/3-judging/judge-calibration';

test.describe('Search', () => {
  test('"position consistency" finds judge calibration, and the result opens it', async ({ page }) => {
    const book = new BookPage(page);
    await book.goto('./');
    await book.search('position consistency');
    await expect(book.searchResult(TARGET)).toBeVisible();

    await book.chooseSearchResult(TARGET);
    await expect(page).toHaveURL(new RegExp(`/${TARGET}(#|$)`));
    await expect(book.heading).toHaveText('Judge calibration');
    await expect(book.searchInput).toBeHidden();
  });
});
