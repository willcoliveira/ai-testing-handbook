// The Markdown lockdown (.vitepress/plugins/lockdown.mjs): fence info, includes, the v-pre wrapper.
// Fence payloads are from the round-two adversarial re-test of 2026-10-04.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createMarkdownRenderer } from "vitepress";
import lockdown, { lintSource, FENCE_INFO } from "../../../.vitepress/plugins/lockdown.mjs";
import { lintAll } from "../../../.vitepress/gen.mjs";
import { tmp, ROOT } from "./helpers.mjs";

const md = await createMarkdownRenderer(ROOT, { html: false, attrs: { disable: true }, gfmAlerts: false, config: (m) => m.use(lockdown) }, "/");
const fence = (info) => "```" + info + "\nx\n```\n";

test("a fence whose language is markup fails the build", () => {
  for (const info of ["<b></b>", "<img\tsrc=x\tdata-pwn=1>", "js<b>", "<script>0===0;</script>", "ts:line-numbers=<b>"]) {
    assert.throws(() => md.render(fence(info), { relativePath: "p.md" }), /not a plain language name/, info);
  }
});

test("the languages the book uses still render", () => {
  for (const info of ["yaml", "json", "text", "python", "ts", ""]) {
    assert.ok(FENCE_INFO.test(info), info);
    assert.match(md.render(fence(info), { relativePath: "p.md" }), /<pre/, info);
  }
});

test("content is wrapped for v-pre, and containers and snippets stay text", () => {
  const html = md.render("::: code-group\nx\n:::\n\n<<< /etc/hosts\n", { relativePath: "p.md" });
  assert.match(html, /^<div class="hb-content" v-pre>/);
  assert.match(html, /::: code-group/);
  assert.match(html, /&lt;&lt;&lt; \/etc\/hosts/);
});

test("an include fails before the build, in any page", () => {
  assert.throws(() => lintSource("a\n<!--@include: ../../../etc/hosts-->\n", "p.md"), /@include/);
  assert.throws(() => lintSource("<!-- @include: ./x.md -->", "p.md"), /@include/);
  assert.doesNotThrow(() => lintSource("<!-- a plain comment -->", "p.md"));
  const d = tmp({ "ok.md": "# ok\n", "deep/bad.md": "<!--@include: ./ok.md-->\n" });
  try { assert.throws(() => lintAll(d.dir), /deep\/bad\.md: an @include directive is not allowed/); } finally { d.done(); }
});

test("the real repository has no include", () => {
  assert.ok(lintAll(ROOT) > 100, "pages linted");
});

// round-three re-test
test("frontmatter must open with a plain --- line", () => {
  for (const head of ["---js\n({})\n---\n", "---json\n{}\n---\n", "--- js\n({})\n---\n", "\uFEFF---javascript\n({})\n---\n"]) {
    assert.throws(() => lintSource(head + "# x\n", "p.md"), /plain --- line/, JSON.stringify(head));
  }
  assert.doesNotThrow(() => lintSource("---\ntitle: x\n---\n# x\n", "p.md"));
});

test("only VitePress's include directive is rejected, not a mention of it", () => {
  assert.throws(() => lintSource("<!--@include: ./x.md-->", "p.md"), /@include/);
  assert.doesNotThrow(() => lintSource("includes (`<!--@include-->`) are rejected", "p.md"));
});

test("images are off: ![x](y) does not become an <img>", () => {
  assert.doesNotMatch(md.render("![o](../outside.png)\n", { relativePath: "p.md" }), /<img/);
});

test("frontmatter values must have the expected types", async () => {
  const { checkFrontmatter } = await import("../../../.vitepress/plugins/lockdown.mjs");
  for (const fm of [{ title: true }, { related: "x" }, { sources: [1] }, { search: "no" }, { status: ["a"] }]) {
    assert.throws(() => checkFrontmatter(fm, "p.md"), /must be/, JSON.stringify(fm));
  }
});

test("a title with a long whitespace run is labelled quickly", async () => {
  const { shortLabel } = await import("../../../.vitepress/book.mjs");
  const t0 = performance.now();
  assert.equal(shortLabel("a" + " ".repeat(80000) + "b"), "a b");
  assert.ok(performance.now() - t0 < 200, "under 200 ms");
});

// round four: content folders hold Markdown only, linted at any depth
test("content folders reject code, route and data loaders, public/, and lint nested folders", () => {
  for (const [files, re] of [
    [{ "how-to/_[n].md": "x" }, /dynamic route/],
    [{ "how-to/_n.paths.js": "export default {}" }, /paths or data loader/],
    [{ "how-to/x.data.mjs": "export default {}" }, /paths or data loader/],
    [{ "how-to/x.js": "1" }, /code is not allowed/],
    [{ "public/a.js": "1" }, /public\/ folder/],
    [{ "how-to/sources/x.md": "<!--@include: ../../../m.txt-->" }, /@include directive/],
  ]) {
    const d = tmp({ "ok.md": "# ok\n", ...files });
    try { assert.throws(() => lintAll(d.dir), re, JSON.stringify(files)); } finally { d.done(); }
  }
  const ok = tmp({ "ok.md": "# ok\n", "playwright.config.ts": "x", "tests/site/a.ts": "x", "sources/_x.rows.md": "| S001 |" });
  try { assert.doesNotThrow(() => lintAll(ok.dir)); } finally { ok.done(); }
});
