import { test } from "node:test";
import assert from "node:assert/strict";
import { createMarkdownRenderer } from "vitepress";
import linksPlugin, { resolveHref, pageTest, globToRe, REPO } from "../../../.vitepress/plugins/links.mjs";
import { tmp, ROOT } from "./helpers.mjs";

const fx = tmp({
  "README.md": "# Intro\n", "LICENSE": "MIT\n",
  "how-to/README.md": "# How\n", "how-to/01-x.md": "# X\n",
  "practices/3-judging/_part.md": "# Part\n", "practices/3-judging/llm-as-judge.md": "# Judge\n",
  ".claude/skills/kb-refresh/SKILL.md": "# Skill\n", "labs/_TEMPLATE.md": "# T\n",
});
const exclude = [".claude/**", "**/_TEMPLATE.md"];
const opts = { root: fx.dir, isPage: pageTest(fx.dir, exclude) };
const md = await createMarkdownRenderer(fx.dir, { html: false, config: (m) => m.use(linksPlugin, { root: fx.dir, exclude }) }, "/ai-testing-handbook/");
const hrefs = (src, relativePath = "README.md") => [...md.render(src, { relativePath, cleanUrls: true }).matchAll(/href="([^"]*)"/g)].map((m) => m[1]);
test.after(() => fx.done());

test("x/README.md -> /x/, rendered under the base path", () => {
  assert.equal(resolveHref("how-to/README.md", "README.md", opts), "/how-to/");
  assert.deepEqual(hrefs("[how](how-to/README.md)"), ["/ai-testing-handbook/how-to/"]);
});

test("#fragment is kept on folder links", () => {
  assert.equal(resolveHref("../how-to/README.md#when", "learning-path/x.md", opts), "/how-to/#when");
  assert.deepEqual(hrefs("[w](../how-to/README.md#when)", "learning-path/x.md"), ["/ai-testing-handbook/how-to/#when"]);
});

test("folder links with no README resolve to the generated intro page", () => {
  assert.equal(resolveHref("practices/3-judging/", "README.md", opts), "/practices/3-judging/");
  assert.equal(resolveHref("../README.md", "how-to/01-x.md", opts), "/");
});

test("non-site targets go to GitHub blob/main", () => {
  assert.equal(resolveHref("LICENSE", "README.md", opts), `${REPO}/blob/main/LICENSE`);
  assert.equal(resolveHref(".claude/skills/kb-refresh/SKILL.md", "README.md", opts), `${REPO}/blob/main/.claude/skills/kb-refresh/SKILL.md`);
  assert.equal(resolveHref("../labs/_TEMPLATE.md", "how-to/01-x.md", opts), `${REPO}/blob/main/labs/_TEMPLATE.md`);
  assert.deepEqual(hrefs("[MIT](LICENSE)"), [`${REPO}/blob/main/LICENSE`]);
});

test("external, fragment-only, absolute and ordinary page links are untouched", () => {
  for (const h of ["https://example.com/a", "mailto:a@b.c", "#why", "/sources"]) assert.equal(resolveHref(h, "README.md", opts), null);
  assert.equal(resolveHref("01-x.md", "how-to/README.md", opts), null);
  assert.deepEqual(hrefs("[e](https://example.com/a)"), ["https://example.com/a"]);
});

test("negative: a link to a missing file is left for the dead-link check", () => {
  assert.equal(resolveHref("missing.md", "README.md", opts), null);
  assert.equal(resolveHref("nowhere/", "README.md", opts), null);
});

test("globToRe matches srcExclude globs", () => {
  assert.ok(globToRe("**/_TEMPLATE.md").test("_TEMPLATE.md"));
  assert.ok(globToRe("**/_TEMPLATE.md").test("labs/_TEMPLATE.md"));
  assert.ok(globToRe("digests/*.draft.md").test("digests/2026-09-26.draft.md"));
  assert.ok(!globToRe("digests/*.draft.md").test("digests/2026-09-26.md"));
});

test("a malformed % escape is left alone instead of crashing the build", () => {
  assert.equal(resolveHref("bad%zz.md", "practices/3-judging/x.md", { root: ROOT, isPage: () => true }), null);
});
