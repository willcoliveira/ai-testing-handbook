// Static checks on the theme: the pieces a browser test (stage B) will exercise.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./helpers.mjs";

const css = readFileSync(join(ROOT, ".vitepress/theme/style.css"), "utf8");
const vue = readFileSync(join(ROOT, ".vitepress/theme/Layout.vue"), "utf8");
const index = readFileSync(join(ROOT, ".vitepress/theme/index.mjs"), "utf8");
const block = (re) => { const m = css.match(re); assert.ok(m, String(re)); return m[0]; };

test("arrow keys: no modifiers, not in inputs, search, dialogs or sideways-scrolling boxes", () => {
  for (const g of ["e.altKey", "e.ctrlKey", "e.metaKey", "e.shiftKey", "e.isComposing", "e.defaultPrevented", "isContentEditable", "scrollsX(t)", ".VPLocalSearchBox"]) assert.ok(vue.includes(g), g);
  assert.match(vue, /EDITABLE = 'input, textarea, select/);
  assert.match(vue, /\.pager-link\.\$\{e\.key === "ArrowLeft" \? "prev" : "next"\}/);
});

test("progress line is aria-hidden", () => {
  assert.match(vue, /<div class="hb-progress" aria-hidden="true">/);
});

test("Source Serif 4 self-hosted, body face from one variable", () => {
  assert.match(index, /@fontsource\/source-serif-4\/400\.css/);
  assert.match(index, /vitepress\/theme-without-fonts/);
  assert.match(css, /--hb-font-body: "Source Serif 4"/);
  assert.equal((css.match(/Source Serif 4/g) || []).length, 1);
});

test("no accent: brand tokens mapped to black and white; links underlined; no shadows", () => {
  assert.match(css, /--vp-c-brand-1: var\(--hb-fg\)/);
  assert.match(css, /\.vp-doc a \{[^}]*text-decoration: underline/);
  assert.match(css, /box-shadow: none !important/);
  assert.match(css, /border-radius: 0 !important/);
});

test("citations grey, black on hover and focus, tooltip on hover and focus-visible", () => {
  assert.match(css, /\.vp-doc a\.cite \{[^}]*color: var\(--hb-muted\)/);
  assert.match(css, /\.vp-doc a\.cite:hover, \.vp-doc a\.cite:focus-visible \{ color: var\(--hb-fg\)/);
  assert.match(css, /a\.cite:hover::after, \.vp-doc a\.cite:focus-visible::after \{\s*content: attr\(data-tip\)/);
  assert.match(css, /:focus-visible \{ outline: 2px solid var\(--hb-fg\)/);
});

test("dark mode redefines the tokens under .dark", () => {
  const dark = block(/\n\.dark \{[^}]*\}/);
  for (const k of ["bg", "fg", "muted", "rule", "soft"]) assert.match(dark, new RegExp(`--hb-${k}:`));
});

test("print: chapter only, URLs after links", () => {
  const print = css.slice(css.indexOf("@media print"));
  for (const s of [".VPNav", ".VPSidebar", ".VPDocFooter", ".VPDocAsideOutline"]) assert.ok(print.includes(s), s);
  assert.match(print, /display: none !important/);
  assert.match(print, /content: " \(" attr\(href\) "\)"/);
});

test("wide pages: full width, scrolling tables, sticky header", () => {
  assert.match(css, /\.hb-wide \.VPDoc \.container[^{]*\{ max-width: none !important; \}/);
  assert.match(css, /\.hb-wide \.vp-doc table \{[^}]*overflow: auto/);
  assert.match(css, /\.hb-wide \.vp-doc thead th \{ position: sticky; top: 0/);
});

test("typography: 18px body, 17px under 768px, line-height 1.65, 68ch column, 16px phone gutters", () => {
  assert.match(css, /--hb-body-size: 18px/);
  assert.match(css, /--hb-measure: 68ch/);
  assert.match(css, /\.vp-doc \{[^}]*line-height: 1\.65/);
  const phone = block(/@media \(max-width: 767px\) \{[\s\S]*?\n\}/);
  assert.match(phone, /--hb-body-size: 17px/);
  assert.match(phone, /padding-left: 16px !important; padding-right: 16px !important/);
});
