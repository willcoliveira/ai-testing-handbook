// The SITE_TEST switch: the type specimen is built only for the visual tests, never in production.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { globSync } from "tinyglobby";
import { ROOT } from "./helpers.mjs";

const { siteOptions, isSiteTest, SPECIMEN, SPECIMEN_SIDEBAR, SRC_EXCLUDE } = await import("../../../.vitepress/config.mjs");
const { buildSidebar } = await import("../../../.vitepress/book.mjs");

const links = (items, out = []) => {
  for (const it of items) {
    if (it.link) out.push(it.link);
    if (it.items) links(it.items, out);
  }
  return out;
};
// the Markdown files VitePress would build with a given srcExclude (same glob library and ignores)
const pages = (srcExclude) => globSync(["**/*.md"], { cwd: ROOT, ignore: ["**/node_modules/**", "**/dist/**", ...srcExclude], expandDirectories: false });

test("the specimen fixture exists", () => assert.ok(existsSync(join(ROOT, SPECIMEN))));

test("only SITE_TEST=1 switches test mode on", () => {
  assert.equal(isSiteTest({ SITE_TEST: "1" }), true);
  for (const env of [{}, { SITE_TEST: "" }, { SITE_TEST: "0" }, { SITE_TEST: "true" }]) assert.equal(isSiteTest(env), false, JSON.stringify(env));
});

test("production: no specimen anywhere (srcExclude, rewrites, sidebar)", () => {
  const o = siteOptions({});
  assert.deepEqual(o.srcExclude, SRC_EXCLUDE);
  assert.ok(!Object.keys(o.rewrites).includes(SPECIMEN));
  assert.ok(Array.isArray(o.sidebar), "production keeps the one book sidebar");
  assert.ok(!links(o.sidebar).some((l) => /specimen/i.test(l)));
  assert.ok(!pages(o.srcExclude).includes(SPECIMEN), "the specimen is excluded from the production build");
});

test("SITE_TEST=1: the specimen is built at /specimen with its own fixed sidebar", () => {
  const o = siteOptions({ SITE_TEST: "1" });
  const built = pages(o.srcExclude);
  assert.ok(built.includes(SPECIMEN), "the specimen is let back in");
  assert.deepEqual(built.filter((f) => f.startsWith("tests/")), [SPECIMEN], "nothing else under tests/ becomes a page");
  assert.equal(o.rewrites[SPECIMEN], "specimen.md");
  assert.deepEqual(Object.keys(o.sidebar), ["/specimen", "/"]);
  assert.equal(o.sidebar["/specimen"], SPECIMEN_SIDEBAR);
  // the book's own sidebar is unchanged, and the specimen is not in it
  assert.deepEqual(o.sidebar["/"], buildSidebar(ROOT));
  assert.ok(!links(o.sidebar["/"]).some((l) => /specimen/i.test(l)));
});

test("the rest of the production config is identical in test mode", () => {
  const prod = siteOptions({});
  const tst = siteOptions({ SITE_TEST: "1" });
  assert.deepEqual(tst.srcExclude.filter((p) => p !== "tests/**/!(specimen).md"), prod.srcExclude.filter((p) => p !== "tests/**"));
  const { [SPECIMEN]: added, ...rest } = tst.rewrites;
  assert.equal(added, "specimen.md");
  assert.deepEqual(rest, prod.rewrites);
});
