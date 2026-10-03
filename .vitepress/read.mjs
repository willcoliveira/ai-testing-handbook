// Readers shared by gen, book and config: frontmatter, titles, TAXONOMY, the sources register.
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

// The handbook's frontmatter is flat `key: value` lines, the same shape check-sources.mjs reads.
// Not strict YAML: a title may contain a colon. Lists [a, b], booleans and "quoted" strings.
export function parseFlat(block) {
  const fm = {};
  for (const line of block.split("\n")) {
    const k = line.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (!k) continue;
    const v = k[2].trim();
    fm[k[1]] = v.startsWith("[") && v.endsWith("]") ? v.slice(1, -1).split(",").map((s) => s.trim()).filter(Boolean)
      : v === "true" ? true : v === "false" ? false
      : /^".*"$/.test(v) ? JSON.parse(v) : v;
  }
  return fm;
}

export function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  return m ? parseFlat(m[1]) : {};
}

// frontmatter title, else the first H1, else the file name
export function titleOf(path) {
  const text = readFileSync(path, "utf8");
  const fm = frontmatter(text);
  if (fm.title) return fm.title;
  const h = text.replace(/^---\n[\s\S]*?\n---\n/, "").match(/^# (.+)$/m);
  return h ? h[1].trim() : path.split("/").pop().replace(/\.md$/, "");
}

// .md files directly in dir, sorted, without _* files
export function mdFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((n) => n.endsWith(".md") && !n.startsWith("_") && statSync(join(dir, n)).isFile()).sort();
}

export function partDirs(root) {
  const dir = join(root, "practices");
  return readdirSync(dir).filter((n) => /^\d+-/.test(n) && statSync(join(dir, n)).isDirectory())
    .sort((a, b) => parseInt(a) - parseInt(b));
}

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
export const roman = (n) => ROMAN[n] || String(n);

// TAXONOMY.md: areas in order, each with name, question, raw table rows and practice paths
export function parseTaxonomy(text) {
  const areas = [];
  let cur = null;
  for (const line of text.split("\n")) {
    const h = line.match(/^## (\d+)\. (.+?)\. (.+)$/);
    if (h) { cur = { n: Number(h[1]), name: h[2], question: h[3], rows: [], practices: [] }; areas.push(cur); continue; }
    if (!cur || !line.startsWith("|") || /^\|\s*(Sub-area|---)/.test(line)) continue;
    cur.rows.push(line);
    const l = line.match(/\]\((practices\/[^)#]+\.md)\)/);
    if (l) cur.practices.push(l[1]);
  }
  return areas;
}

// sources.md register rows: id -> { title, publisher, date, url }
export function parseSources(text) {
  const out = {};
  for (const line of text.split("\n")) {
    const m = line.match(/^\|\s*(S\d{3})\s*\|(.*)$/);
    if (!m) continue;
    const c = m[2].split("|").map((s) => s.trim());
    out[m[1]] = { title: c[0], publisher: c[1], date: c[2], url: c[4] };
  }
  return out;
}
