// Site config as the plan states it. Needs gen output (.vitepress/data), which docs:build writes.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./helpers.mjs";

const { default: config, SRC_EXCLUDE, WIDE } = await import("../../../.vitepress/config.mjs");

test("base, cleanUrls, raw HTML off, no git lastUpdated, no ignoreDeadLinks", () => {
  assert.equal(config.base, "/ai-testing-handbook/");
  assert.equal(config.cleanUrls, true);
  assert.equal(config.markdown.html, false);
  assert.ok(!config.lastUpdated);
  assert.equal(config.ignoreDeadLinks, undefined);
  assert.doesNotMatch(readFileSync(join(ROOT, ".vitepress/config.mjs"), "utf8"), /ignoreDeadLinks/);
});

test("the five rewrites", () => {
  assert.deepEqual(config.rewrites, {
    "README.md": "index.md",
    ":dir/README.md": ":dir/index.md",
    "practices/:part/_part.md": "practices/:part/index.md",
    "patterns/_part.md": "patterns/index.md",
    "practices/_part.md": "practices/index.md",
  });
});

test("srcExclude list", () => {
  assert.deepEqual(SRC_EXCLUDE, ["sources/**", "**/_TEMPLATE.md", "digests/*.draft.md", ".claude/**", "node_modules/**", "scripts/**", "tests/**", "test-results/**", "playwright-report/**", "blob-report/**"]);
  assert.deepEqual(config.srcExclude, SRC_EXCLUDE);
});

test("local search keeps the register and digests out of the index", () => {
  const { provider, options } = config.themeConfig.search;
  assert.equal(provider, "local");
  const md = { render: () => "<p>x</p>" };
  assert.equal(options._render("", { relativePath: "sources.md", frontmatter: {} }, md), "");
  assert.equal(options._render("", { relativePath: "digests/2026-10-03.md", frontmatter: {} }, md), "");
  assert.equal(options._render("", { relativePath: "practices/3-judging/llm-as-judge.md", frontmatter: {} }, md), "<p>x</p>");
});

test("editLink, sitemap, appearance toggle, sidebar", () => {
  assert.match(config.themeConfig.editLink.pattern, /github\.com\/willcoliveira\/ai-testing-handbook\/edit\/main\/:path/);
  assert.equal(config.sitemap.hostname, "https://willcoliveira.github.io/ai-testing-handbook/");
  assert.notEqual(config.appearance, false);
  assert.ok(Array.isArray(config.themeConfig.sidebar) && config.themeConfig.sidebar.length > 5);
});

test("wide pages get no outline, full width; meta line and See also from frontmatter", () => {
  assert.deepEqual(WIDE, ["sources.md", "tools/README.md", "labs/README.md", "learning-path/knowledge-matrix.md"]);
  const wide = { filePath: "sources.md", frontmatter: {} };
  config.transformPageData(wide);
  assert.deepEqual(wide.frontmatter, { aside: false, outline: false, pageClass: "hb-wide" });
  const p = config.transformPageData({ filePath: "practices/x.md", frontmatter: { status: "draft", last_reviewed: "2026-10-03", sources: Array(12).fill("S001"), related: ["llm-as-judge"] } });
  assert.equal(p.handbook.meta, "draft · reviewed 2026-10-03 · 12 sources");
  assert.deepEqual(p.handbook.seeAlso, [{ text: "LLM-as-judge", link: "/practices/3-judging/llm-as-judge" }]);
  assert.equal(config.transformPageData({ filePath: "GLOSSARY.md", frontmatter: {} }).handbook.meta, "");
});

test("negative: a related id that is not a practice throws", () => {
  assert.throws(() => config.transformPageData({ filePath: "practices/x.md", frontmatter: { related: ["no-such-practice"] } }), /no-such-practice/);
});

test("canonical and Open Graph head tags", () => {
  const head = config.transformHead({ pageData: { relativePath: "how-to/index.md", title: "How", description: "" } });
  assert.deepEqual(head[0], ["link", { rel: "canonical", href: "https://willcoliveira.github.io/ai-testing-handbook/how-to/" }]);
  assert.ok(head.some(([, a]) => a.property === "og:title" && a.content === "How"));
});
