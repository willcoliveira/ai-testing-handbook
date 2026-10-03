import { test, expect } from '@playwright/test';
import { BookPage, TIMEOUT } from '@pages/book.page';

// WebKit allows 100 history.pushState/replaceState calls per 10 seconds per document, and each
// VitePress navigation makes two. The walk reloads the current page (a fresh document) every
// CHUNK pages; every page change is still made with the arrow key.
const CHUNK = 40;

test.describe('Reading the book with the arrow keys', () => {
  test('→ runs from the introduction to the last page in sidebar order, ← runs back', async ({ page }) => {
    test.setTimeout(TIMEOUT.BOOK);
    const book = new BookPage(page);
    await book.goto('./');
    const order = await book.sidebarHrefs();
    test.info().annotations.push({ type: 'pages', description: String(order.length) });

    const forward = [new URL(page.url()).pathname];
    await book.expectAt(order[0]);

    for (let start = 1; start < order.length; start += CHUNK) {
      await book.reload();
      for (let i = start; i < Math.min(start + CHUNK, order.length); i++) {
        await book.pressKey('ArrowRight');
        await book.expectPrevLink(order[i - 1]);
        await book.expectAt(order[i]);
        forward.push(new URL(page.url()).pathname);
      }
    }

    await test.step('The last page has no Next', async () => {
      await expect(book.nextLink).toHaveCount(0);
    });

    expect(forward, 'pages reached with → equal the sidebar links').toEqual(order);
    expect(forward, 'page count equals sidebar link count').toHaveLength(order.length);

    const backward = [new URL(page.url()).pathname];

    for (let end = order.length - 2; end >= 0; end -= CHUNK) {
      await book.reload();
      for (let i = end; i > Math.max(end - CHUNK, -1); i--) {
        await book.pressKey('ArrowLeft');
        await book.expectNextLink(order[i + 1]);
        await book.expectAt(order[i]);
        backward.push(new URL(page.url()).pathname);
      }
    }

    await test.step('The introduction has no Previous', async () => {
      await expect(book.prevLink).toHaveCount(0);
    });

    expect(backward, 'pages reached with ← are the reverse').toEqual([...order].reverse());
  });
});
