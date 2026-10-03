// Scans every tracked file (plus digests/) for forbidden strings; --dir <path> scans that
// directory instead (the built site).
// Reads privacy/forbidden-strings.example.txt always, and privacy/forbidden-strings.txt
// unless CI=1. Exits 1 on any hit. Refuses to run if the real list is tracked by git.
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { execSync } from "node:child_process";
import { join, relative, resolve } from "node:path";

const root = process.cwd();
const REAL = join(root, "privacy/forbidden-strings.txt");
const EXAMPLE = join(root, "privacy/forbidden-strings.example.txt");

function tracked() {
  try {
    return execSync("git ls-files --cached --others --exclude-standard", { cwd: root, encoding: "utf8" }).split("\n").filter(Boolean);
  } catch {
    return walk(root).map((p) => relative(root, p));
  }
}
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".git") continue;
    const p = join(dir, name);
    statSync(p).isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
}
if (!process.env.CI && existsSync(REAL)) {
  try {
    execSync("git ls-files --error-unmatch privacy/forbidden-strings.txt", { cwd: root, stdio: "ignore" });
    console.error("REFUSING: privacy/forbidden-strings.txt is tracked by git. Untrack it first.");
    process.exit(2);
  } catch { /* not tracked, good */ }
}
function loadList(path) {
  if (!existsSync(path)) return [];
  return readFileSync(path, "utf8").split("\n").map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => {
      if (l.startsWith("/") && l.lastIndexOf("/") > 0) {
        const last = l.lastIndexOf("/");
        const flags = l.slice(last + 1).replace(/[^i]/g, "");
        return { re: new RegExp(l.slice(1, last), flags), src: l };
      }
      if (l.startsWith("<") && l.endsWith(">")) return null; // placeholder, ignored
      return { re: new RegExp(l.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), src: l };
    }).filter(Boolean);
}
const rules = [...loadList(EXAMPLE), ...(process.env.CI ? [] : loadList(REAL))];
const ALLOW_TOKENS = new Set(existsSync(join(root, "privacy/allowlist.txt"))
  ? readFileSync(join(root, "privacy/allowlist.txt"), "utf8").split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#"))
  : []);
const dirArg = process.argv.indexOf("--dir");
const scanDir = dirArg > 0 ? process.argv[dirArg + 1] : null;
if (dirArg > 0 && (!scanDir || !existsSync(scanDir))) { console.error(`--dir: no such directory ${scanDir || ""}`); process.exit(2); }
const files = new Set(scanDir ? walk(resolve(root, scanDir)).map((p) => relative(root, p)) : tracked());
if (!scanDir && existsSync(join(root, "digests"))) for (const f of readdirSync(join(root, "digests"))) files.add("digests/" + f);
const ALLOW = [/noreply@anthropic\.com/i, /^privacy\/forbidden-strings/, /^scripts\/check-forbidden\.mjs$/, /^package(-lock)?\.json$/];
let hits = 0, scanned = 0;
for (const f of files) {
  if (ALLOW.some((a) => a.test(f))) continue;
  const p = join(root, f);
  if (!existsSync(p) || statSync(p).isDirectory()) continue;
  if (/\.(png|jpg|jpeg|gif|pdf|zip|woff2?)$/i.test(f)) continue;
  if (scanDir && /\.css$/i.test(f)) continue; // built theme styles carry no content
  const text = readFileSync(p, "utf8");
  scanned++;
  text.split("\n").forEach((line, i) => {
    for (const r of rules) {
      const m = line.match(r.re);
      if (!m || ALLOW.some((a) => a.test(line))) continue;
      if (ALLOW_TOKENS.has(m[0])) continue;
      hits++; console.log(`${f}:${i + 1}: matches ${r.src} (${m[0]})`);
    }
  });
}
console.log(`${hits} hits across ${scanned} files (${rules.length} rules${process.env.CI ? ", CI example list only" : ""})`);
process.exit(hits ? 1 : 0);
