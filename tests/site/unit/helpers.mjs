// Temp-dir fixtures for the site unit tests.
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, realpathSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../../..");

// inRepo: under node_modules/.cache, so a fixture VitePress build resolves vue and vitepress
export function tmp(files = {}, { inRepo = false } = {}) {
  const parent = inRepo ? join(ROOT, "node_modules/.cache") : tmpdir();
  mkdirSync(parent, { recursive: true });
  const dir = realpathSync(mkdtempSync(join(parent, "hb-site-")));
  for (const [rel, text] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, rel)), { recursive: true });
    writeFileSync(join(dir, rel), text);
  }
  return { dir, done: () => rmSync(dir, { recursive: true, force: true }) };
}

// the smallest repo book.mjs and gen.mjs accept: one area, one practice
export function miniRepo(extra = {}) {
  return tmp({
    "README.md": "# Intro\n",
    "TAXONOMY.md": "# Taxonomy\n\n## 1. Capability evaluation. How good is it?\n\n| Sub-area | Practice | After reading, you can answer |\n|---|---|---|\n| B | [b](practices/1-capability/b.md) | Q? |\n| A | [a](practices/1-capability/a.md) | Q? |\n",
    "practices/1-capability/a.md": "---\nid: a\ntitle: Practice A\n---\n\n# Practice A\n",
    "practices/1-capability/b.md": "---\nid: b\ntitle: Practice B\nrelated: [a]\n---\n\n# Practice B\n",
    "patterns/p.md": "---\nid: p\ntitle: Pattern P\npractices: [a]\n---\n\n# Pattern P\n",
    "learning-path/README.md": "# LP\n",
    "learning-path/0-foundations.md": "# Foundations\n",
    "how-to/README.md": "# How\n",
    "how-to/01-first.md": "# First\n",
    ...Object.fromEntries(["labs", "tools", "benchmarks", "datasets", "training", "digests"].map((d) => [`${d}/README.md`, `# ${d}\n`])),
    ...Object.fromEntries(["GLOSSARY", "ROADMAP", "CHANGELOG", "PRIVACY", "CONTRIBUTING", "MAINTAINING"].map((n) => [`${n}.md`, `# ${n}\n`])),
    "sources.md": "# Sources\n\n| id | title | publisher | published | type | url | areas | last_checked | notes |\n|----|-------|-----------|-----------|------|-----|-------|--------------|-------|\n| S001 | First \"source\" <x> | Pub | 2026-01-01 | paper | https://example.com/1 | 1 | 2026-01-02 | n |\n",
    ...extra,
  });
}
