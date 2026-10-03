import { test, expect } from '@playwright/test';
import { BookPage } from '@pages/book.page';

const CHAPTER = 'practices/3-judging/judge-calibration';
const ID = 'S320';

test.describe('Citations', () => {
  let book: BookPage;

  test.beforeEach(async ({ page }) => {
    book = new BookPage(page);
  });

  test(`[${ID}] carries a "Source ${ID}:" label`, async () => {
    await book.goto(CHAPTER);
    await book.expectCitationLabel(ID);
  });

  test(`[${ID}] shows its tooltip on hover`, async ({ hasTouch }) => {
    test.skip(hasTouch, 'touch screens have no hover; the tooltip is skipped there by design and a tap goes to the source');
    await book.goto(CHAPTER);
    await book.hoverCitation(ID);
    await book.expectCitationTooltip(ID);
  });

  test(`[${ID}] shows its tooltip on keyboard focus`, async ({ hasTouch }) => {
    test.skip(hasTouch, 'touch screens have no Tab key; keyboard focus is covered on desktop');
    await book.goto(CHAPTER);
    await book.tabToCitation(ID);
    await book.expectCitationFocusVisible(ID);
    await book.expectCitationTooltip(ID);
  });

  test(`[${ID}] lands on its register row`, async () => {
    await book.goto(CHAPTER);
    await book.clickCitation(ID);
    await book.expectSourceRowInView(ID);
  });

  test('the [S0nn] placeholder opens the sources register', async () => {
    await book.goto('CONTRIBUTING');
    await book.sourceIdPlaceholder.click();
    await book.expectAt('sources');
    await expect(book.heading).toHaveText('Sources register');
  });
});
