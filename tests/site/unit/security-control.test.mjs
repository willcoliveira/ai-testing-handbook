// Control for security-build.test.mjs, in its own process (VitePress keeps one markdown renderer
// per process): without the fixes the same payloads do evaluate and inject, so the fixed test means something.
import { test } from "node:test";
import assert from "node:assert/strict";
import { site } from "./security-fixture.mjs";

test("control, without the fixes: the same payloads do evaluate and inject ", { timeout: 120000 }, async () => {
  const s = await site({ safe: false });
  try {
    assert.ok(s.html.includes("Plain 9"), "VitePress evaluates {{ }} by default");
    assert.ok(s.html.includes(" 12."), "and runs the Function constructor");
    assert.ok(s.html.includes("<img src=x"), "VitePress renders sidebar labels as HTML");
  } finally { s.done(); }
});
