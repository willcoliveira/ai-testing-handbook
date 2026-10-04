// Prebuild: writes the part intro pages (practices/_part.md, practices/N-*/_part.md,
// patterns/_part.md) and .vitepress/data/{sources,ids}.json. All outputs are gitignored and
// byte-identical across runs. _part.md is skipped by check-sources and apply-bullets.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, posix } from "node:path";
import { fileURLToPath } from "node:url";
import { frontmatter, titleOf, mdFiles, partDirs, parseTaxonomy, parseSources, roman } from "./read.mjs";
import { lintSource } from "./plugins/lockdown.mjs";

const head = (title) => `---\ntitle: ${JSON.stringify(title)}\neditLink: false\n---\n\n# ${title}\n\n`;

// rewrite relative links in a TAXONOMY row so they resolve from dir
function relink(row, dir) {
  return row.replace(/\]\(([^)#\s]+)(#[^)]*)?\)/g, (m, target, hash = "") =>
    /^[a-z]+:/i.test(target) ? m : `](${posix.relative(dir, target) || "."}${hash})`);
}

export function generate(root) {
  const out = new Map();
  const areas = parseTaxonomy(readFileSync(join(root, "TAXONOMY.md"), "utf8"));
  const parts = partDirs(root);

  // practices/_part.md
  let all = head("Practices");
  all += "Eight parts, one per area of the [taxonomy](../TAXONOMY.md). Each part opens with the question it answers.\n\n";
  for (const dir of parts) {
    const a = areas.find((x) => x.n === parseInt(dir));
    all += `- [Part ${roman(parseInt(dir))}. ${a ? a.name : dir}](${dir}/)${a ? `: ${a.question}` : ""}\n`;
  }
  out.set("practices/_part.md", all);

  // practices/N-*/_part.md
  for (const dir of parts) {
    const n = parseInt(dir);
    const a = areas.find((x) => x.n === n);
    const rel = `practices/${dir}`;
    let s = head(`Part ${roman(n)}. ${a ? a.name : dir}`);
    if (a) {
      s += `${a.question}\n\n| Sub-area | Practice | After reading, you can answer |\n|---|---|---|\n`;
      s += a.rows.map((r) => relink(r, rel)).join("\n") + "\n\n";
    }
    const files = mdFiles(join(root, rel));
    const order = a ? a.practices.map((p) => p.split("/").pop()) : [];
    files.sort((x, y) => (order.indexOf(x) + 1 || 1e9) - (order.indexOf(y) + 1 || 1e9) || x.localeCompare(y));
    s += "## Chapters\n\n" + files.map((f, i) => `${i + 1}. [${titleOf(join(root, rel, f))}](${f})`).join("\n") + "\n";
    out.set(`${rel}/_part.md`, s);
  }

  // practice id -> path
  const ids = Object.create(null);
  for (const dir of parts) for (const f of mdFiles(join(root, "practices", dir))) {
    const p = `practices/${dir}/${f}`;
    const id = frontmatter(readFileSync(join(root, p), "utf8")).id || f.replace(/\.md$/, "");
    if (ids[id]) throw new Error(`gen: duplicate practice id ${id} in ${p} and ${ids[id]}`);
    ids[id] = p;
  }

  // patterns/_part.md
  let pat = head("Patterns");
  pat += "Worked examples from production builds, anonymised per [PRIVACY.md](../PRIVACY.md). Each names the practices it puts to work.\n\n";
  for (const f of mdFiles(join(root, "patterns"))) {
    const fm = frontmatter(readFileSync(join(root, "patterns", f), "utf8"));
    const used = (fm.practices || []).filter((id) => Object.hasOwn(ids, id))
      .map((id) => `[${titleOf(join(root, ids[id]))}](${posix.relative("patterns", ids[id])})`);
    pat += `- [${titleOf(join(root, "patterns", f))}](${f})${used.length ? `. Practices: ${used.join(", ")}` : ""}\n`;
  }
  out.set("patterns/_part.md", pat);

  const sorted = (o) => Object.fromEntries(Object.keys(o).sort().map((k) => [k, o[k]]));
  const sources = parseSources(readFileSync(join(root, "sources.md"), "utf8"));
  out.set(".vitepress/data/sources.json", JSON.stringify(sorted(sources), null, 2) + "\n");
  out.set(".vitepress/data/ids.json", JSON.stringify(sorted(ids), null, 2) + "\n");
  return out;
}

export function write(root, out) {
  for (const [rel, text] of out) {
    const p = join(root, rel);
    mkdirSync(dirname(p), { recursive: true });
    if (!existsSync(p) || readFileSync(p, "utf8") !== text) writeFileSync(p, text);
  }
}

// Every Markdown file VitePress could build is checked before it expands includes, at any depth
// (round four: a nested `sources/` folder was built but never linted). Content folders hold Markdown
// only: code, VitePress route and data loaders (`[param].md`, `*.paths.js`, `*.data.js`) and a
// `public/` folder all run or publish something no reviewer reads as content, so they fail here.
const ROOT_SKIP = new Set([".git", "node_modules", "sources", ".claude", ".vitepress", "test-results", "playwright-report", "blob-report"]);
const CODE_ROOTS = new Set([".vitepress", "scripts", "tests", ".githooks", ".github", ".claude", "node_modules"]);
const ROOT_CODE_FILES = new Set(["playwright.config.ts", "eslint.config.mjs"]);
const CODE = /\.(m?js|cjs|m?ts|cts|jsx|tsx|vue|svelte|wasm)$/i;
export function lintAll(root, dir = root, n = { files: 0 }) {
  const top = dir === root;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const rel = p.slice(root.length + 1).split("\\").join("/");
    if (statSync(p).isDirectory()) {
      if (name === "node_modules" || (top && ROOT_SKIP.has(name))) continue;
      if (name === "public") throw new Error(`${rel}: a public/ folder is published as-is; it is not allowed`);
      if (top && CODE_ROOTS.has(name)) continue;
      lintAll(root, p, n);
      continue;
    }
    if (/[[\]]/.test(name)) throw new Error(`${rel}: a [param] file is a VitePress dynamic route; not allowed in content`);
    if (/\.(paths|data)\.[a-z]+$/i.test(name)) throw new Error(`${rel}: a VitePress paths or data loader runs code at build time; not allowed in content`);
    if (CODE.test(name) && !(top && ROOT_CODE_FILES.has(name))) throw new Error(`${rel}: code is not allowed in content folders`);
    if (!name.endsWith(".md")) continue;
    lintSource(readFileSync(p, "utf8"), rel);
    n.files++;
  }
  return n.files;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  lintAll(root);
  const out = generate(root);
  write(root, out);
  console.log(`gen: ${out.size} files (${[...out.keys()].filter((k) => k.endsWith("_part.md")).length} part pages)`);
}
