import { test, expect } from '@playwright/test';
import { BookPage } from '@pages/book.page';

// A fixed sample on PRs; the every-page sweep (sweep.spec.ts, @full) runs on main and weekly.
const SAMPLE = [
  './',
  'practices/3-judging/',
  'practices/3-judging/judge-calibration',
  'how-to/01-decide-what-to-test',
  'sources',
  'tools/',
  'labs/',
  'learning-path/knowledge-matrix',
];
export const WIDTHS = [390, 820, 1280];

test.describe('Layout', () => {
  for (const width of WIDTHS) {
    test(`no sideways page scroll at ${width}px on the sample pages`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const book = new BookPage(page);
      for (const path of SAMPLE) {
        await book.goto(path);
        await book.expectNoHorizontalScroll(path, true);
      }
    });
  }

  for (const width of [1280, 1440, 1920]) {
    test(`content stays clear of the "On this page" outline at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const book = new BookPage(page);
      for (const path of [...SAMPLE, 'learning-path/0-foundations']) {
        await book.goto(path);
        expect.soft(await book.contentOverlappingOutline(), `${path}: content under the outline`).toEqual([]);
      }
    });
  }

  test('narrow screens hide the sidebar behind the Menu button', async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 0) >= 960, 'the sidebar is always shown from 960px');
    const book = new BookPage(page);
    await book.goto('practices/3-judging/judge-calibration');
    await expect(book.menuButton).toBeVisible();
    await expect(book.sidebar).not.toBeInViewport();
    await book.openMenu();
    await expect(book.sidebar).toBeInViewport();
  });

  test('wide screens show the sidebar and no Menu button', async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 0) < 960, 'below 960px the sidebar sits behind the Menu button');
    const book = new BookPage(page);
    await book.goto('practices/3-judging/judge-calibration');
    await expect(book.sidebar).toBeInViewport();
    await expect(book.menuButton).toBeHidden();
  });

  test('every sidebar label fits in two lines at 1280px', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    const book = new BookPage(page);
    await book.goto('./');
    await book.expandSidebar();
    const labels = await book.sidebarLabelLines();
    expect(labels.length, 'labels measured').toBeGreaterThan(100);
    // fullLines is the unclamped height (scrollHeight), so the CSS line-clamp in style.css cannot
    // hide a label that is too long: shortLabel in book.mjs has to make it fit.
    const tooLong = labels.filter((l) => l.fullLines > 2 || l.lines > 2).map((l) => `${l.label} (${Math.max(l.fullLines, l.lines)} lines)`);
    expect(tooLong, 'sidebar labels that need more than two lines').toEqual([]);
  });
});
