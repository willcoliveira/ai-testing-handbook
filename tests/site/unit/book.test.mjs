import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { buildSidebar, flatten, linkOf } from "../../../.vitepress/book.mjs";
import { ROOT, miniRepo } from "./helpers.mjs";

const md = (dir) => readdirSync(join(ROOT, dir)).filter((n) => n.endsWith(".md") && !n.startsWith("_")).sort();
const folder = (dir) => [`/${dir}/`, ...md(dir).filter((f) => f !== "README.md").map((f) => `/${dir}/${f.slice(0, -3)}`)];

test("real repo: sidebar is the plan's reading order", () => {
  const sidebar = buildSidebar(ROOT);
  // practices in the order TAXONOMY.md lists them, each part opening with its intro page
  const taxonomy = readFileSync(join(ROOT, "TAXONOMY.md"), "utf8");
  const parts = [];
  for (const m of taxonomy.matchAll(/\]\((practices\/(\d+-[^/]+)\/[^)]+)\.md\)/g)) {
    if (!parts.includes(m[2])) parts.push(m[2]);
  }
  const practices = parts.flatMap((p) => [`/practices/${p}/`, ...[...taxonomy.matchAll(/\]\((practices\/[^)]+)\.md\)/g)].map((m) => "/" + m[1]).filter((l) => l.startsWith(`/practices/${p}/`))]);
  const expected = [
    "/",
    "/learning-path/", "/learning-path/0-foundations", "/learning-path/1-harness-loop-graph", "/learning-path/2-build-a-harness",
    "/learning-path/3-context-memory-orchestration", "/learning-path/4-production-and-inference", "/learning-path/5-evals-and-testing",
    "/learning-path/knowledge-matrix", "/learning-path/interview-questions", "/learning-path/ai-qa-requirements", "/learning-path/resources",
    "/TAXONOMY",
    "/practices/", ...practices,
    ...folder("how-to"),
    "/patterns/", ...md("patterns").map((f) => `/patterns/${f.slice(0, -3)}`),
    ...folder("labs"), ...folder("tools"), ...folder("benchmarks"), ...folder("datasets"), ...folder("training"),
    "/GLOSSARY", "/sources",
    "/ROADMAP", "/CHANGELOG", ...folder("digests").filter((l) => !l.endsWith(".draft")), "/PRIVACY", "/CONTRIBUTING", "/MAINTAINING",
  ];
  assert.deepEqual(flatten(sidebar), expected);
  assert.equal(parts.length, 8);
  const playbooks = flatten(sidebar).filter((l) => /^\/how-to\/\d\d-/.test(l)).map((l) => l.slice(8, 10));
  assert.deepEqual(playbooks, Array.from({ length: 16 }, (_, i) => String(i + 1).padStart(2, "0")));
});

test("real repo: Parts I to VIII are collapsible groups opening with the intro page", () => {
  const practices = buildSidebar(ROOT).find((g) => g.text === "Practices");
  assert.deepEqual(practices.items.map((p) => p.text.split(".")[0]), ["Part I", "Part II", "Part III", "Part IV", "Part V", "Part VI", "Part VII", "Part VIII"]);
  for (const p of practices.items) {
    assert.equal(typeof p.collapsed, "boolean", `${p.text} is collapsible`);
    assert.match(p.link, /^\/practices\/\d-[^/]+\/$/);
    assert.ok(p.items.length > 0);
  }
});

test("linkOf maps README and _part to the folder", () => {
  assert.equal(linkOf("README.md"), "/");
  assert.equal(linkOf("how-to/README.md"), "/how-to/");
  assert.equal(linkOf("practices/3-judging/_part.md"), "/practices/3-judging/");
  assert.equal(linkOf("practices/3-judging/llm-as-judge.md"), "/practices/3-judging/llm-as-judge");
});

test("fixture: practices follow TAXONOMY order, not file order", () => {
  const r = miniRepo();
  try {
    const part = buildSidebar(r.dir).find((g) => g.text === "Practices").items[0];
    assert.deepEqual(part.items.map((i) => i.link), ["/practices/1-capability/b", "/practices/1-capability/a"]);
  } finally { r.done(); }
});

test("negative fixture: a practice file not in TAXONOMY throws, naming the file", () => {
  const r = miniRepo({ "practices/1-capability/unlisted.md": "---\nid: unlisted\ntitle: U\n---\n# U\n" });
  try {
    assert.throws(() => buildSidebar(r.dir), /practices\/1-capability\/unlisted\.md is not listed in TAXONOMY\.md/);
  } finally { r.done(); }
});

test("negative fixture: a learning-path file with no place in the order throws", () => {
  const r = miniRepo({ "learning-path/stray.md": "# Stray\n" });
  try {
    assert.throws(() => buildSidebar(r.dir), /learning-path\/stray\.md/);
  } finally { r.done(); }
});
