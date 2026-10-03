import { test } from '@playwright/test';
import { BookPage, TIMEOUT } from '@pages/book.page';

const WIDTHS = [390, 820, 1280];

// Every page in the sidebar at three widths. Tagged @full: main and weekly only (npm run test:e2e:full).
test.describe('Every page', { tag: ['@full'] }, () => {
  for (const width of WIDTHS) {
    test(`no sideways page scroll at ${width}px`, async ({ page }) => {
      test.setTimeout(TIMEOUT.BOOK);
      await page.setViewportSize({ width, height: 900 });
      const book = new BookPage(page);
      await book.goto('./');
      const order = await book.sidebarHrefs();
      test.info().annotations.push({ type: 'pages', description: String(order.length) });
      for (const href of order) {
        await book.goto(book.url(href));
        await book.expectNoHorizontalScroll(href, true);
      }
    });
  }
});
