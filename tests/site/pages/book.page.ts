import type { Page, Locator } from '@playwright/test';
import { test, expect } from '@playwright/test';

/** Named timeouts (project conventions: no magic numbers). */
export const TIMEOUT = {
  SHORT: 5_000,
  MEDIUM: 10_000,
  /** a walk through every page of the book */
  BOOK: 300_000,
} as const;

/**
 * One page of the book: the VitePress default theme as restyled in .vitepress/theme.
 * Every path is relative to baseURL ('practices/…', never '/practices/…'), so the same
 * specs run against the local preview and the site under /ai-testing-handbook/.
 */
export class BookPage {
  readonly page: Page;
  readonly html: Locator;
  readonly main: Locator;
  readonly heading: Locator;
  readonly notFoundHeading: Locator;

  // sidebar
  readonly sidebar: Locator;
  readonly sidebarLinks: Locator;
  readonly sidebarLabels: Locator;
  readonly collapsedGroupToggles: Locator;
  readonly menuButton: Locator;

  // nav bar
  readonly navMenuButton: Locator;
  readonly navMenu: Locator;
  readonly navExtraButton: Locator;
  readonly navExtraSwitch: Locator;
  readonly themeSwitch: Locator;

  // previous / next
  readonly pager: Locator;
  readonly nextLink: Locator;
  readonly prevLink: Locator;

  // search
  readonly searchButton: Locator;
  readonly searchInput: Locator;
  readonly searchResults: Locator;

  // see also
  readonly seeAlso: Locator;
  readonly seeAlsoLinks: Locator;

  // the `[S0nn]` placeholder that links to the register
  readonly sourceIdPlaceholder: Locator;

  readonly firstTable: Locator;
  readonly stylesheet: Locator;

  // chrome and content boxes for the visual tests
  readonly navBar: Locator;
  readonly localNav: Locator;
  readonly sidebarPanel: Locator;
  readonly article: Locator;

  constructor(page: Page) {
    this.page = page;
    this.html = page.locator('html');
    this.main = page.getByRole('main');
    this.heading = page.getByRole('heading', { level: 1 });
    this.notFoundHeading = page.getByRole('heading', { name: 'Page not found' });

    this.sidebar = page.getByRole('navigation', { name: 'Sidebar Navigation' });
    // CSS on purpose: links in collapsed groups are hidden, and the book order includes them
    this.sidebarLinks = this.sidebar.locator('a');
    this.sidebarLabels = this.sidebar.locator('.VPSidebarItem .text');
    this.collapsedGroupToggles = this.sidebar.locator('.VPSidebarItem.collapsed > .item > .caret');
    this.menuButton = page.getByRole('button', { name: 'Menu', exact: true });

    this.navMenuButton = page.getByRole('button', { name: 'mobile navigation' });
    this.navMenu = page.locator('#VPNavScreen');
    this.navExtraButton = page.getByRole('button', { name: 'extra navigation' });
    this.navExtraSwitch = page.locator('.VPNavBarExtra').getByRole('switch');
    this.themeSwitch = page.getByRole('switch', { name: /^Switch to (dark|light) theme$/ }).filter({ visible: true });

    this.pager = page.getByRole('navigation', { name: 'Pager' });
    this.nextLink = this.pager.locator('a.pager-link.next');
    this.prevLink = this.pager.locator('a.pager-link.prev');

    this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
    this.searchInput = page.locator('.VPLocalSearchBox').getByPlaceholder('Search');
    this.searchResults = page.getByRole('listbox');

    this.seeAlso = page.getByRole('navigation', { name: 'See also' });
    this.seeAlsoLinks = this.seeAlso.getByRole('link');

    this.firstTable = this.main.locator('table').first();
    this.stylesheet = page.locator('link[rel~="stylesheet"][href*="/assets/"]').first();

    this.navBar = page.getByRole('banner');
    // the "Menu / On this page" bar below 1280px
    this.localNav = page.locator('.VPLocalNav');
    this.sidebarPanel = page.locator('aside.VPSidebar');
    // meta line, the page body, See also, edit link and pager: everything the reader reads
    this.article = page.locator('.VPDoc .content-container');

    this.sourceIdPlaceholder = page.getByRole('link', { name: 'A source id: every one is listed in the sources register' }).first();
  }

  /** A citation link such as [S320]; its accessible name is "Source S320: <title>". */
  citation(id: string): Locator {
    return this.main.getByRole('link', { name: new RegExp(`^Source ${id}:`) }).first();
  }

  /** The register row a citation points at. */
  sourceRow(id: string): Locator {
    return this.page.locator(`tr#${id.toLowerCase()}`);
  }

  /** A link in the page body whose href ends with the given site path. */
  bodyLink(path: string): Locator {
    return this.main.locator(`a[href$="/${path}"]`).first();
  }

  /** Absolute URLs of the links in the page's lists (the chapter list on a part intro page). */
  async listLinkUrls(): Promise<string[]> {
    return test.step('Read the list links', async () => {
      await expect(this.main.getByRole('listitem').getByRole('link').first()).toBeVisible();
      return this.main
        .getByRole('listitem')
        .getByRole('link')
        .evaluateAll((links) => links.map((a) => (a as HTMLAnchorElement).href));
    });
  }

  /** A search result that links to the given site path. */
  searchResult(path: string): Locator {
    return this.searchResults.locator(`a[href*="/${path}"]`).first();
  }

  /** A link inside a table on a wide page (the tables there scroll in their own box). */
  tableLink(): Locator {
    return this.main.locator('table a').first();
  }

  /** The absolute URL of a site path ('sources') or a sidebar href ('/ai-testing-handbook/sources'). */
  url(href: string): string {
    return new URL(href, test.info().project.use.baseURL ?? this.page.url()).href;
  }

  async goto(path = './') {
    await test.step(`Open ${path}`, async () => {
      await this.page.goto(path);
      await expect(this.heading).toBeVisible();
      await this.waitForApp();
    });
  }

  /**
   * The HTML arrives server-rendered, so the h1 shows before Vue hydrates; keys and clicks sent
   * earlier reach no handler. Vue sets #app.__vue_app__ once mounting (and onMounted) is done.
   */
  async waitForApp() {
    await expect
      .poll(() => this.page.evaluate(() => '__vue_app__' in (document.getElementById('app') ?? {})), { message: 'the app hydrated' })
      .toBe(true);
  }

  async reload() {
    await test.step('Reload the page', async () => {
      await this.page.reload();
      await this.expectPage();
      await this.waitForApp();
    });
  }

  /** The book order: every sidebar href, in sidebar order. */
  async sidebarHrefs(): Promise<string[]> {
    return test.step('Read the sidebar order', async () => {
      await expect(this.sidebarLinks.first()).toBeAttached();
      return this.sidebarLinks.evaluateAll((links) => links.map((a) => a.getAttribute('href') ?? ''));
    });
  }

  async expandSidebar() {
    await test.step('Expand every sidebar group', async () => {
      // nested groups appear as their parent opens; each click removes one toggle from the set
      while ((await this.collapsedGroupToggles.count()) > 0) {
        await this.collapsedGroupToggles.first().click();
      }
    });
  }

  /**
   * Each sidebar label with the lines it renders in, and the lines its full text would need
   * (more than rendered means style.css clamped it and the label ends in an ellipsis).
   */
  async sidebarLabelLines(): Promise<{ label: string; lines: number; fullLines: number }[]> {
    return test.step('Measure sidebar labels', async () =>
      this.sidebarLabels.evaluateAll((els) =>
        els.map((el) => {
          const lh = parseFloat(getComputedStyle(el).lineHeight);
          return {
            label: el.textContent?.trim() ?? '',
            lines: Math.round(el.getBoundingClientRect().height / lh),
            fullLines: Math.round(el.scrollHeight / lh),
          };
        }),
      ));
  }

  /** Show the sidebar: always there from 960px, behind the Menu button below that. */
  async showSidebar() {
    await test.step('Show the sidebar', async () => {
      // eslint-disable-next-line playwright/no-conditional-in-test -- below 960px the sidebar sits behind the Menu button
      if (await this.menuButton.isVisible()) await this.openMenu();
      await expect(this.sidebarPanel).toBeVisible();
      await expect(this.sidebarPanel).toBeInViewport({ ratio: 1 });
    });
  }

  /** Web fonts (the self-hosted serif) finished loading, so text renders in its final face. */
  async expectFontsLoaded() {
    await test.step('Verify the web fonts loaded', async () => {
      await expect
        .poll(() => this.page.evaluate(async () => (await document.fonts.ready).status), { message: 'document.fonts.status' })
        .toBe('loaded');
    });
  }

  async openMenu() {
    await test.step('Open the sidebar menu', async () => {
      await this.menuButton.click();
    });
  }

  async pressKey(key: string) {
    await test.step(`Press ${key}`, async () => {
      await this.page.keyboard.press(key);
    });
  }

  async clickNext() {
    await test.step('Click Next', async () => {
      await this.nextLink.click();
    });
  }

  async openSearch() {
    await test.step('Open search', async () => {
      await this.searchButton.click();
      await expect(this.searchInput).toBeFocused();
    });
  }

  async search(query: string) {
    await test.step(`Search for "${query}"`, async () => {
      await this.openSearch();
      await this.searchInput.fill(query);
    });
  }

  async chooseSearchResult(path: string) {
    await test.step(`Choose the result for ${path}`, async () => {
      await this.searchResult(path).click();
    });
  }

  /**
   * Flip light/dark with the nav switch. It sits in the nav bar from 1280px, in the "extra
   * navigation" flyout from 768px and in the nav menu below that; whatever was opened is closed again.
   */
  async toggleTheme() {
    await test.step('Toggle the colour theme', async () => {
      const inMenu = await this.navMenuButton.isVisible();
      const inFlyout = await this.navExtraButton.isVisible();
      // eslint-disable-next-line playwright/no-conditional-in-test -- below 768px the switch sits in the nav menu
      if (inMenu) await this.navMenuButton.click();
      // eslint-disable-next-line playwright/no-conditional-in-test -- the flyout opens on hover (a click would toggle it shut)
      if (inFlyout) await this.navExtraButton.hover();
      await this.themeSwitch.click();
      // eslint-disable-next-line playwright/no-conditional-in-test -- close the menu again so the page is usable
      if (inMenu) await this.navMenuButton.click();
      // eslint-disable-next-line playwright/no-conditional-in-test -- leaving the flyout closes it
      if (inFlyout) await this.page.mouse.move(0, 0);
      // menu and flyout fade out; wait until they are gone so nothing reads the page mid-transition
      await expect(this.navMenu).toBeHidden();
      await expect(this.navExtraSwitch).toBeHidden();
    });
  }

  /** Switch to the light or dark theme with the toggle (no-op when already there). */
  async useTheme(theme: 'light' | 'dark') {
    await test.step(`Use the ${theme} theme`, async () => {
      await expect(this.html).toBeAttached();
      const dark = await this.html.evaluate((el) => el.classList.contains('dark'));
      // eslint-disable-next-line playwright/no-conditional-in-test -- the default follows the system scheme
      if (dark !== (theme === 'dark')) await this.toggleTheme();
      await this.expectDark(theme === 'dark');
    });
  }

  async hoverCitation(id: string) {
    await test.step(`Hover ${id}`, async () => {
      await this.citation(id).hover();
    });
  }

  /** Reach the citation with the keyboard: focus it, step back one stop, Tab forward again. */
  async tabToCitation(id: string) {
    await test.step(`Tab to ${id}`, async () => {
      await this.citation(id).focus();
      await this.page.keyboard.press('Shift+Tab');
      await this.page.keyboard.press('Tab');
    });
  }

  async clickCitation(id: string) {
    await test.step(`Follow ${id}`, async () => {
      await this.citation(id).click();
    });
  }

  async expectPage() {
    await test.step('Verify the page rendered (an h1, not the 404)', async () => {
      await expect(this.heading).toBeVisible();
      await expect(this.notFoundHeading).toBeHidden();
    });
  }

  /** The page at href rendered: URL, h1, not the 404. */
  async expectAt(href: string) {
    await test.step(`Verify the page at ${href}`, async () => {
      await expect(this.page).toHaveURL(this.url(href));
      await this.expectPage();
    });
  }

  /**
   * The pager of the page now shown points back (or on) to href. The pager comes from the new
   * page's data, so this also proves the new page rendered, not only that the URL changed.
   */
  async expectPrevLink(href: string) {
    await expect(this.prevLink, 'Previous link').toHaveAttribute('href', href);
  }

  async expectNextLink(href: string) {
    await expect(this.nextLink, 'Next link').toHaveAttribute('href', href);
  }

  async expectCitationTooltip(id: string) {
    await test.step(`Verify the ${id} tooltip shows its data-tip`, async () => {
      const cite = this.citation(id);
      await expect(cite, `${id} carries a data-tip`).toHaveAttribute('data-tip', /\S/);
      const tip = await cite.getAttribute('data-tip');
      await expect
        .poll(() => cite.evaluate((el) => getComputedStyle(el, '::after').content), { message: `${id} ::after content` })
        .toBe(JSON.stringify(tip));
    });
  }

  async expectCitationFocusVisible(id: string) {
    await test.step(`Verify ${id} has keyboard focus (:focus-visible)`, async () => {
      const cite = this.citation(id);
      await expect(cite).toBeFocused();
      await expect.poll(() => cite.evaluate((el) => el.matches(':focus-visible')), { message: `${id} matches :focus-visible` }).toBe(true);
    });
  }

  async expectCitationLabel(id: string) {
    await test.step(`Verify the ${id} aria-label`, async () => {
      await expect(this.citation(id)).toHaveAttribute('aria-label', new RegExp(`^Source ${id}: \\S`));
    });
  }

  async expectSourceRowInView(id: string) {
    await test.step(`Verify the register row ${id} is in view`, async () => {
      await expect(this.page).toHaveURL(new RegExp(`/sources#${id.toLowerCase()}$`));
      await expect(this.sourceRow(id)).toBeInViewport();
    });
  }

  async expectDark(dark: boolean) {
    await test.step(`Verify the ${dark ? 'dark' : 'light'} theme`, async () => {
      await expect.poll(() => this.html.evaluate((el) => el.classList.contains('dark')), { message: 'html.dark' }).toBe(dark);
    });
  }

  async expectTableScrollsSideways() {
    await test.step('Verify the first table scrolls sideways in its own box', async () => {
      await expect
        .poll(() => this.firstTable.evaluate((t) => t.scrollWidth - t.clientWidth), { message: 'table overflow in px' })
        .toBeGreaterThan(0);
    });
  }

  async expectStylesheetServed() {
    await test.step('Verify the theme stylesheet is served from under the base path', async () => {
      const href = (await this.stylesheet.getAttribute('href')) ?? '';
      expect(href, 'stylesheet sits under the base path').toMatch(/^\/ai-testing-handbook\/assets\/.+\.css$/);
      const res = await this.page.request.get(this.url(href));
      expect(res.status(), `${href} status`).toBe(200);
      expect(res.headers()['content-type'], `${href} content type`).toContain('text/css');
    });
  }

  /**
   * Content blocks (and their text) whose right edge passes the left edge of the "On this page"
   * outline. Empty when the outline is hidden (below 1280px) or nothing overlaps. Text is measured
   * with a Range, because a block can stay inside the column while its text overflows it.
   */
  async contentOverlappingOutline(): Promise<string[]> {
    return test.step('Measure content against the outline', async () =>
      this.page.evaluate(() => {
        const outline = document.querySelector('.VPDocAsideOutline');
        if (!outline || outline.getBoundingClientRect().width === 0) return [];
        const limit = outline.getBoundingClientRect().left;
        const blocks = document.querySelectorAll(
          '.vp-doc .hb-content > :is(p, h1, h2, h3, ul, ol, blockquote, table, div[class*="language-"]), .hb-meta, .hb-see-also',
        );
        const hits: string[] = [];
        for (const el of blocks) {
          // tables and code blocks scroll inside their own box: text past the box is clipped, not overlapping
          const clips = getComputedStyle(el).overflowX !== 'visible' || el.querySelector('pre') !== null;
          const range = document.createRange();
          range.selectNodeContents(el);
          const box = el.getBoundingClientRect().right;
          const right = clips ? box : Math.max(box, range.getBoundingClientRect().right);
          if (right > limit + 0.5) {
            hits.push(
              `${el.tagName.toLowerCase()} "${(el.textContent ?? '').trim().slice(0, 40)}" ends at ${Math.round(right)}px, outline starts at ${Math.round(limit)}px`,
            );
          }
        }
        return hits;
      }));
  }

  async expectNoHorizontalScroll(label: string, soft = false) {
    const width = this.page.viewportSize()?.width ?? 0;
    await expect
      .configure({ soft })
      .poll(() => this.page.evaluate(() => document.documentElement.scrollWidth), {
        message: `${label}: page scrolls sideways at ${width}px`,
      })
      .toBeLessThanOrEqual(width);
  }
}
