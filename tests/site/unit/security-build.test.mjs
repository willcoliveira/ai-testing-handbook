// Fixture VitePress builds with the real payloads from the 2026-10-04 security review. Own file
// (own process): VitePress keeps one markdown renderer per process.
import { test } from "node:test";
import assert from "node:assert/strict";
import { site } from "./security-fixture.mjs";

test("with the fixes: mustaches stay text and a title cannot inject markup", { timeout: 120000 }, async () => {
  const s = await site({ safe: true });
  try {
    for (const literal of ["Plain {{ 3*3 }}", "cell {{ 5*5 }}", "code {{ 8*8 }}", "Split {{ 7"]) assert.ok(s.html.includes(literal), `${literal} rendered literally`);
    for (const evaluated of ["Plain 9", "cell 25", "code 64", " 12.", "Split 49", "emphasis 4"]) assert.ok(!s.html.includes(evaluated), `not evaluated: ${evaluated}`);
    assert.ok(!s.html.includes("<img src=x"), "no live <img> from the title");
    assert.ok(s.html.includes("Judge&lt;img"), "title shown as text");
    // adversarial re-test bypasses: no live data-pwn attribute, no evaluated 42, no outside file
    assert.doesNotMatch(s.html, /<[^>]+\sdata-pwn\d*=/, "no live data-pwn attribute");
    // VitePress itself puts v-pre on code blocks; any other directive would be content's doing
    assert.doesNotMatch(s.html, /<[^>]+\s(:|@|v-(?!pre=))[a-z-]+=/i, "no Vue directive on an element");
    assert.ok(!s.html.includes("OUTSIDE-FILE-MARKER"), "no file from outside the repository");
    assert.ok(s.html.includes('class="hb-content"'), "content wrapped for v-pre");
  } finally { s.done(); }
});

test("frontmatter: only the book's keys are accepted (description, layout, prev, next, head rejected)", async () => {
  const { checkFrontmatter, FRONTMATTER_KEYS } = await import("../../../.vitepress/plugins/lockdown.mjs");
  for (const fm of [
    { title: "x", description: 'x"><svg/onload=0><meta name="y' },
    { title: "x", layout: "svg/onload=6*7 data-pwn=1" },
    { title: "x", prev: "x</span><img data-pwn=pager><span>" },
    { title: "x", next: "<img src=x>" },
    { title: "x", head: [["script", {}, "alert(1)"]] },
    { title: "x", editLink: true },
  ]) assert.throws(() => checkFrontmatter(fm, "p.md"), /not allowed/, JSON.stringify(fm));
  assert.doesNotThrow(() => checkFrontmatter(Object.fromEntries(FRONTMATTER_KEYS.map((k) => [k, "v"])), "p.md"));
  assert.doesNotThrow(() => checkFrontmatter({ title: "x", editLink: false }, "p.md"));
  assert.throws(() => checkFrontmatter({ title: "T</script><script>0</script>" }, "p.md"), /title may not contain/);
  assert.doesNotThrow(() => checkFrontmatter({ title: "Humanity's Last Exam: a & b" }, "p.md"));
});

test("a real build fails on a fence whose language is markup (round-two re-test)", { timeout: 120000 }, async () => {
  await assert.rejects(site({ safe: true, extra: "\n```<b></b>\nx\n```\n" }), /not a plain language name/);
  // the round-one code-group tab label payload now fails the build the same way
  await assert.rejects(site({ safe: true, extra: '\n```js [<img :data-pwn="6*7" data-pwn3=tab>]\na\n```\n' }), /not a plain language name/);
});
