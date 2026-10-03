import { test, expect } from '@playwright/test';
import { BookPage } from '@pages/book.page';

// Base-relative paths only, so the same tests run after deploy against the live site.
test.describe('Smoke', { tag: ['@smoke'] }, () => {
  let book: BookPage;

  test.beforeEach(async ({ page }) => {
    book = new BookPage(page);
  });

  test('the introduction opens with the sidebar', async () => {
    await book.goto('./');
    await book.expectPage();
    await expect(book.sidebarLinks.first()).toBeAttached();
  });

  test('a chapter opens', async () => {
    await book.goto('practices/3-judging/judge-calibration');
    await expect(book.heading).toHaveText('Judge calibration');
  });

  test('a sources anchor lands on its row', async () => {
    await book.goto('sources#s320');
    await book.expectSourceRowInView('S320');
  });

  test('assets load from under the base path', async ({ page }) => {
    await book.goto('./');
    await book.expectStylesheetServed();
    await expect(page).toHaveURL(/\/ai-testing-handbook\/$/);
  });
});
