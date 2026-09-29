// Every practice, lab and pattern file cites at least one source id that resolves in
// sources.md with a date; practice files carry the seven headings in order; every
// sub-area in TAXONOMY.md links to an existing file; no two register rows share a url unless
// listed in sources/known-duplicate-urls.txt; no pattern stays "pending" unless
// --allow-pending. Exits 1 on any violation.
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, dirname, resolve } from "node:path";

const root = process.cwd();
const allowPending = process.argv.includes("--allow-pending");
const errors = [];

function walkMd(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkMd(p, out);
    else if (name.endsWith(".md") && !name.startsWith("_")) out.push(p);
  }
  return out;
}
// sources.md register
const reg = new Map();
if (existsSync(join(root, "sources.md"))) {
  for (const line of readFileSync(join(root, "sources.md"), "utf8").split("\n")) {
    const m = line.match(/^\|\s*(S\d{3})\s*\|(.*)$/);
    if (!m) continue;
    const cells = m[2].split("|").map((c) => c.trim());
    // title | publisher | published | type | url | areas | last_checked | notes
    reg.set(m[1], { published: cells[2], url: cells[4], last_checked: cells[6] });
  }
}
for (const [id, r] of reg) {
  const dated = /^\d{4}-\d{2}(-\d{2})?$/.test(r.published) || r.published === "living" || r.published === "unknown";
  if (!dated) errors.push(`sources.md ${id}: published must be YYYY-MM[-DD], "living" or "unknown" (got "${r.published}")`);
  if ((r.published === "living" || r.published === "unknown") && !/^\d{4}-\d{2}-\d{2}$/.test(r.last_checked)) errors.push(`sources.md ${id}: a living or undated source needs last_checked`);
  if (!/^https?:\/\//.test(r.url)) errors.push(`sources.md ${id}: url missing`);
}
// one row per URL, except the groups listed in sources/known-duplicate-urls.txt
const knownDup = new Set();
const dupFile = join(root, "sources", "known-duplicate-urls.txt");
if (existsSync(dupFile)) {
  for (const line of readFileSync(dupFile, "utf8").split("\n")) {
    if (!line.trim() || line.startsWith("#")) continue;
    knownDup.add(line.trim().split(/\s+/).sort().join(" "));
  }
}
const byUrl = new Map();
for (const [id, r] of reg) {
  const u = r.url.replace(/\/+$/, "").toLowerCase();
  byUrl.set(u, [...(byUrl.get(u) || []), id]);
}
for (const [u, ids] of byUrl) {
  if (ids.length < 2) continue;
  const key = ids.sort().join(" ");
  if (!knownDup.has(key)) errors.push(`sources.md ${ids.join(", ")}: same url ${u}; reuse the existing id, or list the group in sources/known-duplicate-urls.txt`);
}
function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split("\n")) {
    const k = line.match(/^([a-z_]+):\s*(.*)$/);
    if (k) fm[k[1]] = k[2].trim();
  }
  return fm;
}
function idsIn(s) { return (s || "").match(/S\d{3}/g) || []; }
const HEADINGS = ["## What", "## Why", "## How", "## Who does it (sourced)", "## Pitfalls", "## Pattern from a production build", "## Sources"];
const HOWTO_HEADINGS = ["## When", "## What", "## Why", "## How", "## Done when", "## Related"];
const groups = [
  ["practices", walkMd(join(root, "practices"))],
  ["labs", walkMd(join(root, "labs"))],
  ["patterns", walkMd(join(root, "patterns"))],
  ["how-to", walkMd(join(root, "how-to"))],
];
let checked = 0;
for (const [kind, files] of groups) {
  for (const f of files) {
    const rel = relative(root, f);
    if (rel.endsWith("README.md")) continue;
    const text = readFileSync(f, "utf8");
    const fm = frontmatter(text);
    checked++;
    if (!fm) { errors.push(`${rel}: missing frontmatter`); continue; }
    const fmIds = idsIn(fm.sources);
    if (!fmIds.length) errors.push(`${rel}: frontmatter sources is empty`);
    for (const id of fmIds) if (!reg.has(id)) errors.push(`${rel}: ${id} not in sources.md`);
    const body = text.slice(text.indexOf("\n---", 4) + 4);
    for (const id of new Set(idsIn(body))) if (!fmIds.includes(id)) errors.push(`${rel}: body cites ${id} but frontmatter does not list it`);
    if (kind === "practices" || kind === "how-to") {
      let pos = -1;
      for (const h of (kind === "how-to" ? HOWTO_HEADINGS : HEADINGS)) {
        const i = text.indexOf("\n" + h);
        if (i < 0) errors.push(`${rel}: missing heading "${h}"`);
        else if (i < pos) errors.push(`${rel}: heading "${h}" out of order`);
        else pos = i;
      }
    }
    if (kind === "patterns" && !allowPending && fm.anonymisation !== "reviewed") errors.push(`${rel}: anonymisation is "${fm.anonymisation || "unset"}", must be "reviewed" to publish (use --allow-pending locally)`);
  }
}
// taxonomy links
if (existsSync(join(root, "TAXONOMY.md"))) {
  const tax = readFileSync(join(root, "TAXONOMY.md"), "utf8");
  for (const m of tax.matchAll(/\]\(([^)]+\.md)\)/g)) {
    const target = resolve(root, m[1].split("#")[0]);
    if (!existsSync(target)) errors.push(`TAXONOMY.md: link to missing file ${m[1]}`);
  }
}
for (const e of errors) console.log(e);
console.log(`${errors.length ? "FAIL" : "ok"}: ${checked} files checked, ${reg.size} sources in register, ${errors.length} problems`);
process.exit(errors.length ? 1 : 0);
