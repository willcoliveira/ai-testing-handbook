// Applies proposed "Who does it (sourced)" bullets from sources/_vendor-bullets-*.md to the
// practice files. Each block starts "## practice: <id>" and holds "- **Org, date:** ... [S0nn]"
// lines. A bullet is appended to the end of the practice's "Who does it (sourced)" section,
// the ids are added to the file's frontmatter sources, and last_reviewed is set to today.
// Skips bullets whose ids are not in sources.md, and bullets already present. Report on stdout.
// A bullet file is applied once: afterwards it is stamped "<!-- applied: YYYY-MM-DD -->" and later
// runs skip it, so a bullet rewritten by hand in a practice file is not re-added in its old wording.
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
const root = process.cwd();
const today = new Date().toISOString().slice(0, 10);
const regRows = new Map();
for (const line of readFileSync(join(root, "sources.md"), "utf8").split("\n")) {
  const m = line.match(/^\|\s*(S\d{3})\s*\|(.*)$/); if (!m) continue;
  const c = m[2].split("|").map((x) => x.trim());
  regRows.set(m[1], `- [${m[1]}] ${c[0]}, ${c[1]}, ${c[2]}`);
}
const reg = new Set(regRows.keys());
function walk(dir, out = []) { for (const n of readdirSync(dir)) { const p = join(dir, n); statSync(p).isDirectory() ? walk(p, out) : n.endsWith(".md") && out.push(p); } return out; }
const byId = new Map();
for (const f of walk(join(root, "practices"))) { const m = readFileSync(f, "utf8").match(/^id:\s*(\S+)/m); if (m) byId.set(m[1], f); }
const files = readdirSync(join(root, "sources")).filter((n) => /^_vendor-bullets-.*\.md$/.test(n)).sort();
let applied = 0, skipped = 0;
const STAMP = /^<!-- applied: \d{4}-\d{2}-\d{2} -->$/m;
for (const bf of files) {
  const bfPath = join(root, "sources", bf);
  const bfText = readFileSync(bfPath, "utf8");
  if (STAMP.test(bfText)) { console.log(`skip file (already applied): ${bf}`); continue; }
  let current = null, pending = 0;
  for (const line of bfText.split("\n")) {
    const h = line.match(/^## practice:\s*(\S+)/);
    if (h) { current = h[1]; if (!byId.has(current)) { console.log(`skip block: unknown practice ${current} (${bf})`); current = null; pending++; } continue; }
    if (!current || !line.trim().startsWith("-")) continue;
    const ids = [...line.matchAll(/S\d{3}/g)].map((m) => m[0]);
    if (!ids.length || ids.some((id) => !reg.has(id))) { skipped++; pending++; console.log(`skip (id not in register): ${line.slice(0, 80)}`); continue; }
    const f = byId.get(current); let text = readFileSync(f, "utf8");
    if (text.includes(line.trim())) { skipped++; continue; }
    const a = text.indexOf("\n## Who does it (sourced)"); const b = text.indexOf("\n## Pitfalls");
    if (a < 0 || b < 0) { skipped++; pending++; console.log(`skip (headings): ${relative(root, f)}`); continue; }
    const section = text.slice(a, b).replace(/\s+$/, "");
    text = text.slice(0, a) + section + "\n" + line.trim() + "\n\n" + text.slice(b + 1);
    const fm = text.match(/^sources:\s*\[([^\]]*)\]/m);
    const have = new Set((fm ? fm[1] : "").split(",").map((s) => s.trim()).filter(Boolean));
    for (const id of ids) have.add(id);
    text = text.replace(/^sources:\s*\[[^\]]*\]/m, `sources: [${[...have].sort().join(", ")}]`);
    text = text.replace(/^last_reviewed:.*$/m, `last_reviewed: ${today}`);
    for (const id of ids) {
      if (!text.includes(`- [${id}]`)) {
        const si = text.lastIndexOf("\n## Sources");
        if (si >= 0) text = text.replace(/\s*$/, "") + "\n" + regRows.get(id) + "\n";
      }
    }
    writeFileSync(f, text); applied++;
  }
  // Stamp only when every bullet resolved; a file with unregistered ids is retried next run.
  if (!pending) writeFileSync(bfPath, `<!-- applied: ${today} -->\n` + bfText);
  else console.log(`not stamped (${pending} bullets unresolved: unknown practice, missing heading or unregistered id): ${bf}`);
}
console.log(`${applied} bullets applied, ${skipped} skipped`);
