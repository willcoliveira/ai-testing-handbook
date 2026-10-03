import { test, expect } from '@playwright/test';
import { BookPage } from '@pages/book.page';

// The README links to these folders; none has a README, so each must open its generated intro page.
const FOLDERS = [
  { path: 'practices/1-capability/', heading: /^Part I\. / },
  { path: 'practices/2-application-evals/', heading: /^Part II\. / },
  { path: 'practices/3-judging/', heading: /^Part III\. / },
  { path: 'practices/4-agents-and-systems/', heading: /^Part IV\. / },
  { path: 'practices/5-safety-and-security/', heading: /^Part V\. / },
  { path: 'practices/6-observability/', heading: /^Part VI\. / },
  { path: 'practices/7-training-and-lifecycle/', heading: /^Part VII\. / },
  { path: 'practices/8-governance/', heading: /^Part VIII\. / },
  { path: 'patterns/', heading: /^Patterns\b/ },
];

test.describe('README folder links', () => {
  for (const { path, heading } of FOLDERS) {
    test(`${path} opens its intro page with the chapter list`, async ({ page }) => {
      const book = new BookPage(page);
      await book.goto('./');
      await book.bodyLink(path).click();
      await book.expectAt(path);
      await expect(book.heading).toHaveText(heading);
      const folder = book.url(path);
      const chapters = (await book.listLinkUrls()).filter((u) => u.startsWith(folder) && u !== folder);
      expect(chapters.length, `chapters listed under ${path}`).toBeGreaterThan(0);
    });
  }
});
