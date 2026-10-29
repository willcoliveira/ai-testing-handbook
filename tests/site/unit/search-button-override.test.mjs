// The theme swaps VitePress's search button for a copy whose shortcut keys are drawn by CSS and
// aria-hidden (.vitepress/theme/VPNavBarSearchButton.vue, wired in by the alias in config.mjs), so
// the button's visible text is part of its accessible name (axe `label-content-name-mismatch`,
// WCAG 2.5.3; axe compares the text visually on screen, so only moving the K out of the DOM counts).
// The copy must stay the installed component's template plus those two changes, and the built site
// must carry the markup, the K rule and the original's styles. Needs .vitepress/dist (test:site builds first).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./helpers.mjs";

const ORIGINAL = "node_modules/vitepress/dist/client/theme-default/components/VPNavBarSearchButton.vue";
const COPY = ".vitepress/theme/VPNavBarSearchButton.vue";
const read = (p) => readFileSync(join(ROOT, p), "utf8");
function template(sfc, name) {
  const m = sfc.match(/<template>([\s\S]*?)<\/template>/);
  assert.ok(m, `${name}: no <template>`);
  return m[1].replace(/\s+/g, " ").trim();
}

test("the override is the installed button's template with the keys aria-hidden and the K out of the DOM, nothing else", () => {
  const upstream = template(read(ORIGINAL), ORIGINAL);
  const ours = template(read(COPY), COPY);
  const expected = upstream
    .replace('<span class="DocSearch-Button-Keys">', '<span class="DocSearch-Button-Keys" aria-hidden="true">')
    .replace('<kbd class="DocSearch-Button-Key">K</kbd>', '<kbd class="DocSearch-Button-Key"></kbd>');
  assert.notEqual(expected, upstream, "upstream now renders the keys this way itself: delete the override and its alias");
  assert.equal(ours, expected);
  assert.match(read(COPY), /\.DocSearch-Button-Key:last-child:after \{\s*content: 'K';\s*\}/);
});

test("the alias replaces the relative import only, with the theme copy", () => {
  const cfg = read(".vitepress/config.mjs");
  assert.match(cfg, /find: \/\^\\\.\\\/VPNavBarSearchButton\\\.vue\$\//);
  assert.match(cfg, /replacement: fileURLToPath\(new URL\("\.\/theme\/VPNavBarSearchButton\.vue", import\.meta\.url\)\)/);
});

test("the built home page has one search button, keys hidden and empty, the K rule and the original's styles", () => {
  const html = read(".vitepress/dist/index.html");
  const buttons = html.match(/<button[^>]*class="DocSearch DocSearch-Button"[^>]*>/g) || [];
  assert.equal(buttons.length, 1);
  assert.match(buttons[0], /aria-label="Search"/);
  assert.match(html, /<span class="DocSearch-Button-Keys" aria-hidden="true"><kbd class="DocSearch-Button-Key"><\/kbd><kbd class="DocSearch-Button-Key"><\/kbd><\/span>/);
  const cssDir = join(ROOT, ".vitepress/dist/assets");
  const css = readdirSync(cssDir).filter((f) => f.endsWith(".css")).map((f) => readFileSync(join(cssDir, f), "utf8")).join("\n");
  assert.match(css, /--docsearch-primary-color/, "the original component's global styles are missing from the build");
  assert.match(css, /\.DocSearch-Button-Key:first-child:after\{content:["']Ctrl["']/, "the original's key glyph rule is missing");
  assert.match(css, /\.DocSearch-Button-Key:last-child:after\{content:["']K["']\}/, "the K rule is missing");
});
