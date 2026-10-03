import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { generate, write } from "../../../.vitepress/gen.mjs";
import { ROOT, miniRepo } from "./helpers.mjs";

test("real repo: 10 intro pages, sources.json and ids.json", () => {
  const out = generate(ROOT);
  const parts = [...out.keys()].filter((k) => k.endsWith("_part.md")).sort();
  assert.equal(parts.length, 10);
  assert.ok(parts.includes("practices/_part.md") && parts.includes("patterns/_part.md"));
  const rows = readFileSync(join(ROOT, "sources.md"), "utf8").split("\n").filter((l) => /^\| S\d{3} /.test(l)).length;
  const sources = JSON.parse(out.get(".vitepress/data/sources.json"));
  assert.equal(Object.keys(sources).length, rows);
  for (const s of Object.values(sources)) assert.deepEqual(Object.keys(s), ["title", "publisher", "date", "url"]);
  const practiceFiles = readdirSync(join(ROOT, "practices")).filter((d) => /^\d-/.test(d))
    .flatMap((d) => readdirSync(join(ROOT, "practices", d)).filter((f) => f.endsWith(".md") && !f.startsWith("_")).map((f) => `practices/${d}/${f}`));
  const ids = JSON.parse(out.get(".vitepress/data/ids.json"));
  assert.deepEqual(Object.values(ids).sort(), practiceFiles.sort());
});

test("real repo: a part page has heading, its TAXONOMY rows and every chapter", () => {
  const page = generate(ROOT).get("practices/3-judging/_part.md");
  assert.match(page, /^---\ntitle: "Part III\. Judging and scoring"\neditLink: false\n---\n\n# Part III\. Judging and scoring\n/);
  assert.match(page, /\| LLM-as-judge \| \[llm-as-judge\]\(llm-as-judge\.md\) \|/);
  for (const f of readdirSync(join(ROOT, "practices/3-judging")).filter((f) => !f.startsWith("_"))) assert.ok(page.includes(`](${f})`), f);
});

test("output is byte-identical across runs, and write() is idempotent", () => {
  const a = generate(ROOT), b = generate(ROOT);
  assert.deepEqual([...a.entries()], [...b.entries()]);
  const r = miniRepo();
  try {
    write(r.dir, generate(r.dir));
    const first = [...generate(r.dir).keys()].map((k) => readFileSync(join(r.dir, k), "utf8"));
    write(r.dir, generate(r.dir));
    const second = [...generate(r.dir).keys()].map((k) => readFileSync(join(r.dir, k), "utf8"));
    assert.deepEqual(first, second);
  } finally { r.done(); }
});

test("fixture: chapter list follows TAXONOMY order; patterns page links its practices", () => {
  const r = miniRepo();
  try {
    const out = generate(r.dir);
    assert.match(out.get("practices/1-capability/_part.md"), /1\. \[Practice B\]\(b\.md\)\n2\. \[Practice A\]\(a\.md\)/);
    assert.match(out.get("patterns/_part.md"), /\[Pattern P\]\(p\.md\)\. Practices: \[Practice A\]\(\.\.\/practices\/1-capability\/a\.md\)/);
    assert.deepEqual(JSON.parse(out.get(".vitepress/data/sources.json")).S001, { title: 'First "source" <x>', publisher: "Pub", date: "2026-01-01", url: "https://example.com/1" });
  } finally { r.done(); }
});

test("negative fixture: two practices with one id throw", () => {
  const r = miniRepo({ "practices/1-capability/c.md": "---\nid: a\ntitle: Dup\n---\n# Dup\n" });
  try {
    assert.throws(() => generate(r.dir), /duplicate practice id a/);
  } finally { r.done(); }
});
