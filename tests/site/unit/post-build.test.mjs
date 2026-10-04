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
test("negative: markup in a sidebar label fails (title XSS, security review 2026-10-04)", () => fails({ "a.html": page(`<p class="text" data-v-1>Judge<img src=x onerror=alert(1)></p>`) }, /label contains markup/));
test("negative: markup in a prev/next label fails", () => fails({ "a.html": page(`<span class="title" data-v-1>x<svg onload=alert(1)></span>`) }, /label contains markup/));
test("negative: an inline event handler anywhere fails", () => fails({ "a.html": page(`<div onclick="alert(1)">x</div>`) }, /inline event handler/));
// bypasses of the regex guard found in the adversarial re-test, now parsed
test("negative: a slash-separated handler (<svg/onload=) fails", () => fails({ "a.html": page(`<svg/onload=0></svg>`) }, /inline event handler onload/));
test("negative: a label closed early (x</span><img>) fails", () => fails({ "a.html": page(`<span class="title" data-v-1>x<img data-pwn=pager></span>`) }, /label contains markup/));
test("negative: a group heading label with markup fails", () => fails({ "a.html": page(`<h2 class="text" data-v-1>x<b>y</b></h2>`) }, /label contains markup/));
test("negative: an unquoted third-party src fails", () => fails({ "a.html": page(`<img src=//e.invalid/x>`) }, /third-party host: \/\/e\.invalid\/x/));
test("negative: a third-party srcset fails", () => fails({ "a.html": page(`<img srcset="/ok.png 1x, https://e.invalid/x.png 2x">`) }, /third-party host: https:\/\/e\.invalid/));
test("negative: an iframe fails", () => fails({ "a.html": page(`<iframe srcdoc="x"></iframe>`) }, /<iframe> is not allowed/));
test("negative: a meta refresh fails", () => fails({ "a.html": page(`<meta http-equiv=refresh content="0;url=https://e.invalid">`) }, /meta refresh/));
test("negative: a javascript: URL fails", () => fails({ "a.html": page(`<a href="javascript:alert(1)">x</a>`) }, /javascript: URL/));
// round-two re-test: markup reached page content through a fence language
const content = (inner) => page(`<div class="hb-content"><p>x</p>${inner}</div>`);
test("negative: a <script> inside page content fails", () => fails({ "a.html": content(`<span class="lang"><script>0===0</script></span>`) }, /<script> is not allowed in page content/));
test("negative: <svg>, <style> or <b> inside page content fails", () => {
  for (const inner of ["<svg></svg>", "<style>p{}</style>", "<b>x</b>"]) fails({ "a.html": content(inner) }, /is not allowed in page content/);
});
test("negative: a src with a scheme but no slashes fails", () => fails({ "a.html": page(`<img src="http:evil.example/x.png">`) }, /third-party host: http:evil/));
test("negative: a data: URL fails", () => fails({ "a.html": page(`<img src="data:image/svg+xml,x">`) }, /data: URL/));
test("negative: a style attribute loading a URL fails", () => fails({ "a.html": page(`<p style="background:url(https://e.invalid/x)">x</p>`) }, /style attribute loads a URL/));
test("the tags plain Markdown produces pass inside page content", () => {
  const d = dist({ "a.html": content(`<h2 id="why">Why</h2><ul><li><strong>a</strong> <em>b</em> <code>c</code></li></ul><table><thead><tr><th>h</th></tr></thead><tbody><tr><td>d</td></tr></tbody></table><div class="language-ts"><button title="Copy"></button><span class="lang">ts</span><pre><code><span>x</span></code></pre></div>`) });
  try { assert.deepEqual(run(d).errors, []); } finally { d.done(); }
});
test("negative: target=_blank without rel fails", () => fails({ "a.html": page(`<a href="https://example.com" target="_blank">x</a>`) }, /target=_blank> without rel/));
test("escaped labels pass", () => {
  const d = dist({ "a.html": page(`<h2 id="why">Why</h2><p class="text" data-v-1>Judge&lt;img src=x&gt;</p>`) });
  try { assert.deepEqual(run(d).errors, []); } finally { d.done(); }
});
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
