import { test, expect } from '@playwright/test';
import { BookPage } from '@pages/book.page';

// ← / → page only when focus is on the page body, never with modifiers (review note 6).
// Navigation pushes the new URL within the key event, so an unchanged URL right after the press
// means the key was ignored; the control case shows the same press does navigate from the body.
const CHAPTER = 'practices/3-judging/judge-calibration';

test.describe('Arrow keys', () => {
  let book: BookPage;

  test.beforeEach(async ({ page }) => {
    book = new BookPage(page);
  });

  test('are ignored in the open search input', async ({ page }) => {
    await book.goto(CHAPTER);
    await book.search('judge');
    await book.pressKey('ArrowRight');
    await book.pressKey('ArrowLeft');
    await expect(page).toHaveURL(book.url(CHAPTER));
    await expect(book.searchInput).toBeFocused();
  });

  test('are ignored inside a table that scrolls sideways', async ({ page }) => {
    await book.goto('sources');
    await book.expectTableScrollsSideways();
    await book.tableLink().focus();
    await book.pressKey('ArrowRight');
    await book.pressKey('ArrowLeft');
    await expect(page).toHaveURL(book.url('sources'));
  });

  test('are ignored with Shift held, and plain → turns the page', async ({ page }) => {
    await book.goto(CHAPTER);
    const next = (await book.nextLink.getAttribute('href')) ?? '';
    for (const key of ['Shift+ArrowRight', 'Shift+ArrowLeft']) {
      await book.pressKey(key);
      await expect(page, `${key} is ignored`).toHaveURL(book.url(CHAPTER));
    }
    await book.pressKey('ArrowRight');
    await book.expectAt(next);
  });

  test('are ignored with Control held, and plain → turns the page', async ({ page, browserName }) => {
    test.skip(
      browserName === 'webkit',
      'WebKit binds Control+Arrow to history back/forward itself (it goes back on a bare data: page too), so the URL change is not the book',
    );
    await book.goto(CHAPTER);
    const next = (await book.nextLink.getAttribute('href')) ?? '';
    for (const key of ['Control+ArrowRight', 'Control+ArrowLeft']) {
      await book.pressKey(key);
      await expect(page, `${key} is ignored`).toHaveURL(book.url(CHAPTER));
    }
    await book.pressKey('ArrowRight');
    await book.expectAt(next);
  });
});
