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
  try { assert.throws(() => lintAll(d.dir), /deep\/bad\.md: <!--@include--> is not allowed/); } finally { d.done(); }
});

test("the real repository has no include", () => {
  assert.ok(lintAll(ROOT) > 100, "pages linted");
});
