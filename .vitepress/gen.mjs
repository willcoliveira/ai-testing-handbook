// Prebuild: writes the part intro pages (practices/_part.md, practices/N-*/_part.md,
// patterns/_part.md) and .vitepress/data/{sources,ids}.json. All outputs are gitignored and
// byte-identical across runs. _part.md is skipped by check-sources and apply-bullets.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname, posix } from "node:path";
import { fileURLToPath } from "node:url";
import { frontmatter, titleOf, mdFiles, partDirs, parseTaxonomy, parseSources, roman } from "./read.mjs";

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
  const ids = {};
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
    const used = (fm.practices || []).filter((id) => ids[id])
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

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  const out = generate(root);
  write(root, out);
  console.log(`gen: ${out.size} files (${[...out.keys()].filter((k) => k.endsWith("_part.md")).length} part pages)`);
}
