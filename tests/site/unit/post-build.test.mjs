import { test } from "node:test";
import assert from "node:assert/strict";
import { check, BUDGETS } from "../post-build.mjs";
import { tmp, ROOT } from "./helpers.mjs";

// an example-list pattern, assembled so this file does not trip the repo scan itself
const AWS = ["arn", "aws", ""].join(":");

const B = "/ai-testing-handbook/";
const page = (body) => `<!doctype html><html><head><script type="module" src="${B}assets/app.js"></script></head><body>${body}</body></html>`;
const sidebar = [{ text: "Intro", link: "/" }, { text: "A", link: "/a" }, { text: "Sources", link: "/sources" }];

// a minimal good dist; overrides replace or add files
function dist(over = {}) {
  return tmp({
    "index.html": page(`<a href="${B}a">A</a> <a href="${B}a#why">why</a> <a class="cite" href="${B}sources#s001" aria-label="Source S001: x" data-tip="x">S001</a> <a href="https://example.com/">out</a>`),
    "a.html": page(`<h2 id="why">Why</h2><a href="#why">self</a>`),
    "sources.html": page(`<table><tr id="s001"><td>S001</td></tr></table>`),
    "404.html": page("not found"),
    "assets/app.js": "console.log(1)\n",
    "assets/chunks/@localSearchIndexroot.abc.js": "export default {}\n",
    ...over,
  });
}
const run = (d, opts = {}) => check({ dist: d.dir, base: B, sidebar, forbidden: false, root: ROOT, ...opts });
function fails(over, re, opts) {
  const d = dist(over);
  try {
    const { errors } = run(d, opts);
    assert.ok(errors.some((e) => re.test(e)), `expected ${re}, got:\n${errors.join("\n")}`);
  } finally { d.done(); }
}

test("a clean dist passes", () => {
  const d = dist();
  try {
    const r = run(d);
    assert.deepEqual(r.errors, []);
    assert.equal(r.cites, 1);
  } finally { d.done(); }
});

test("negative: dead internal href fails", () => fails({ "a.html": page(`<a href="${B}nowhere">x</a>`) }, /dead internal href/));
test("negative: missing #fragment fails", () => fails({ "a.html": page(`<a href="${B}index#nope">x</a>`) }, /missing fragment/));
test("negative: cite to a missing register anchor fails", () => fails({ "sources.html": page("<table></table>") }, /missing fragment .*sources#s001/));
test("negative: cite pointing somewhere other than the register fails", () => fails({ "a.html": page(`<h2 id="why">Why</h2><a class="cite" href="${B}a#why">S001</a>`) }, /citation does not point at a register row/));
test("negative: a page missing from the sidebar fails", () => fails({ "b.html": page("orphan") }, /\/b\.html appears 0 times/));
test("negative: the specimen outside the sidebar fails a production check", () => fails({ "specimen.html": page("specimen") }, /\/specimen\.html appears 0 times/));
test("SITE_TEST: the specimen may sit outside the sidebar", () => {
  const d = dist({ "specimen.html": page("specimen") });
  try { assert.deepEqual(run(d, { siteTest: true }).errors, []); } finally { d.done(); }
});
test("negative: SITE_TEST exempts only the specimen, another orphan still fails", () => fails({ "specimen.html": page("specimen"), "b.html": page("orphan") }, /\/b\.html appears 0 times/, { siteTest: true }));
test("negative: a page twice in the sidebar fails", () => fails({}, /appears 2 times/, { sidebar: [...sidebar, { text: "again", link: "/a" }] }));
test("negative: a sidebar link with no page fails", () => fails({}, /sidebar: \/gone has no built page/, { sidebar: [...sidebar, { text: "gone", link: "/gone" }] }));
test("negative: a third-party <script src> fails", () => fails({ "a.html": `<html><head><script src="https://cdn.example.com/x.js"></script></head><body><h2 id="why">Why</h2></body></html>` }, /third-party host: https:\/\/cdn\.example\.com/));
test("negative: a third-party stylesheet or font in CSS fails", () => fails({ "assets/style.css": "@import url(https://fonts.googleapis.com/css2?family=X);" }, /CSS loads from a third-party host/));
test("negative: JS over the budget fails", () => fails({ "assets/big.js": "x".repeat(BUDGETS.JS_MAX_BYTES + 1) }, /budget: JS/));
test("negative: search index over the budget fails", () => fails({ "assets/chunks/@localSearchIndexroot.abc.js": "x".repeat(BUDGETS.SEARCH_INDEX_MAX_BYTES + 1) }, /budget: search index/));

test("negative: a forbidden string in the built HTML fails", () => {
  const d = dist({ "a.html": page(`<h2 id="why">Why</h2><p>${AWS}iam::role</p>`) });
  try {
    const { errors } = run(d, { forbidden: true });
    assert.ok(errors.some((e) => /forbidden strings/.test(e)), errors.join("\n"));
  } finally { d.done(); }
});

test("budgets are named constants", () => {
  assert.deepEqual(Object.keys(BUDGETS), ["SEARCH_INDEX_MAX_BYTES", "JS_MAX_BYTES", "PAGE_CHUNK_MAX_BYTES"]);
  assert.equal(BUDGETS.SEARCH_INDEX_MAX_BYTES, 3 * 1024 * 1024);
  assert.equal(BUDGETS.JS_MAX_BYTES, 2 * 1024 * 1024);
});
