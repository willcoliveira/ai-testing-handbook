// Rebuilds sources.md from its header (everything up to and including the table header rows)
// plus every row in sources/_*.rows.md, sorted by id. Idempotent. Duplicate ids fail.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
const root = process.cwd();
const src = readFileSync(join(root, "sources.md"), "utf8");
const headerEnd = src.indexOf("|----|");
const headerLineEnd = src.indexOf("\n", headerEnd);
const header = src.slice(0, headerLineEnd + 1);
const rows = new Map();
for (const f of readdirSync(join(root, "sources")).filter((n) => n.endsWith(".rows.md")).sort()) {
  for (const line of readFileSync(join(root, "sources", f), "utf8").split("\n")) {
    const m = line.match(/^\|\s*(S\d{3})\s*\|/);
    if (!m) continue;
    if (rows.has(m[1])) { console.error(`duplicate id ${m[1]} in ${f}`); process.exit(1); }
    rows.set(m[1], line.trim());
  }
}
const body = [...rows.keys()].sort().map((k) => rows.get(k)).join("\n") + "\n";
writeFileSync(join(root, "sources.md"), header + body);
console.log(`sources.md rebuilt: ${rows.size} rows`);
