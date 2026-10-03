import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { BookPage } from '@pages/book.page';

// Visual regression on the theme, not on the content. Every shot is an element screenshot of the
// type specimen (tests/site/fixtures/specimen.md, built only with SITE_TEST=1) or of the chrome
// around it (nav bar, sidebar, pager); the specimen has a fixed sidebar of its own, so a refresh
// that adds bullets or pages to the book changes none of these images.
// Run with `npm run test:visual` (Linux baselines: generate them in tests/site/Dockerfile, see MAINTAINING).
// Projects: chromium (1280), tablet (820), mobile-chrome (Pixel 7); mobile-safari ignores this file.

const SPECIMEN = 'specimen';
// hides the fixed nav bars during the specimen content shot (see the file for why)
const HIDE_FIXED_CHROME = fileURLToPath(new URL('../fixtures/hide-fixed-chrome.css', import.meta.url));
// a missing page is a build without SITE_TEST=1, not a visual change
const NO_SPECIMEN = 'no /specimen page: build with SITE_TEST=1 npm run docs:build (npm run test:visual does)';

for (const theme of ['light', 'dark'] as const) {
  test.describe(`Visual: ${theme}`, { tag: ['@visual'] }, () => {
    // the theme comes from the system scheme on first load, so no toggle animation is captured
    test.use({ colorScheme: theme });

    let book: BookPage;

    test.beforeEach(async ({ page }) => {
      book = new BookPage(page);
      await page.goto(SPECIMEN);
      await expect(book.notFoundHeading, NO_SPECIMEN).toBeHidden();
      await expect(book.heading, NO_SPECIMEN).toHaveText('Type specimen');
      await book.waitForApp();
      await book.expectDark(theme === 'dark');
      await book.expectFontsLoaded();
    });

    test('specimen page content', async () => {
      await expect(book.article).toHaveScreenshot(`specimen-${theme}.png`, { stylePath: HIDE_FIXED_CHROME });
    });

    // Chrome shots mask the page body (main). A mask is painted on top of everything, so it is
    // only given where the chrome sits beside or above the body, never where the chrome covers it.
    test('nav bar', async () => {
      await expect(book.navBar).toHaveScreenshot(`nav-${theme}.png`, { mask: [book.main] });
    });

    test('sidebar', async () => {
      // from 960px the sidebar sits beside the body; below that it slides in over it, and a mask
      // over the covered body would paint over the sidebar itself
      const besideBody = !(await book.menuButton.isVisible());
      await book.showSidebar();
      await expect(book.sidebarPanel).toHaveScreenshot(`sidebar-${theme}.png`, { mask: besideBody ? [book.main] : [] });
    });

    test('pager', async () => {
      await expect(book.pager).toHaveScreenshot(`pager-${theme}.png`, { mask: [book.main] });
    });
  });
}
