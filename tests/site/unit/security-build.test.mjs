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
  } finally { s.done(); }
});
