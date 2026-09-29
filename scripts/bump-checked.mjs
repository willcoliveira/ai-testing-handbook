// Sets last_checked on register rows in sources/_*.rows.md, then rebuilds sources.md.
//   node scripts/bump-checked.mjs S066 S071            the named ids
//   node scripts/bump-checked.mjs --sweep              every id in the "Register ids" column of the sweep list
//   node scripts/bump-checked.mjs --sweep --only-group "Tool release pages"   one group of the sweep list
//   --date YYYY-MM-DD overrides today. Unknown ids are reported and exit 1; nothing else fails.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
const root = process.cwd();
const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const date = opt("--date") || new Date().toISOString().slice(0, 10);
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) { console.error(`bad --date ${date}`); process.exit(1); }
const ids = new Set(args.filter((a) => /^S\d{3}$/.test(a)));
if (args.includes("--sweep")) {
  const group = opt("--only-group");
  let inGroup = !group, col = -1;
  for (const line of readFileSync(join(root, ".claude/skills/kb-refresh/references/sweep-list.md"), "utf8").split("\n")) {
    if (line.startsWith("## ")) { inGroup = !group || line.slice(3).startsWith(group); col = -1; continue; }
    if (!inGroup || !line.startsWith("|")) continue;
    const cells = line.split("|").map((c) => c.trim());
    if (col < 0) { col = cells.indexOf("Register ids"); continue; }
    if (cells[col]) for (const m of cells[col].matchAll(/S\d{3}/g)) ids.add(m[0]);
  }
}
if (!ids.size) { console.error("no ids: pass S0nn ids or --sweep"); process.exit(1); }
const seen = new Set();
for (const f of readdirSync(join(root, "sources")).filter((n) => n.endsWith(".rows.md"))) {
  const p = join(root, "sources", f);
  let changed = false;
  const out = readFileSync(p, "utf8").split("\n").map((line) => {
    const m = line.match(/^\|\s*(S\d{3})\s*\|/);
    if (!m || !ids.has(m[1])) return line;
    const c = line.split("|"); // ["", id, title, publisher, published, type, url, areas, last_checked, notes, ""]
    seen.add(m[1]);
    if (c[8].trim() === date) return line;
    c[8] = ` ${date} `; changed = true;
    return c.join("|");
  });
  if (changed) writeFileSync(p, out.join("\n"));
}
const missing = [...ids].filter((id) => !seen.has(id)).sort();
console.log(`last_checked ${date} on ${seen.size} rows${missing.length ? `; not found: ${missing.join(", ")}` : ""}`);
execFileSync("node", [join(root, "scripts/merge-sources.mjs")], { stdio: "inherit" });
process.exit(missing.length ? 1 : 0);
