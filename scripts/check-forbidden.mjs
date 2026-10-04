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
        return { re: new RegExp(l.slice(1, last), flags), global: new RegExp(l.slice(1, last), flags + "g"), src: l };
      }
      if (l.startsWith("<") && l.endsWith(">")) return null; // placeholder, ignored
      const esc = l.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return { re: new RegExp(esc, "i"), global: new RegExp(esc, "gi"), src: l };
    }).filter(Boolean);
}
const rules = [...loadList(EXAMPLE), ...(process.env.CI ? [] : loadList(REAL))];
const ALLOW_TOKENS = new Set(existsSync(join(root, "privacy/allowlist.txt"))
  ? readFileSync(join(root, "privacy/allowlist.txt"), "utf8").split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#"))
  : []);
const dirArg = process.argv.indexOf("--dir");
const scanDir = dirArg > 0 ? process.argv[dirArg + 1] : null;
if (dirArg > 0 && (!scanDir || !existsSync(scanDir))) { console.error(`--dir: no such directory ${scanDir || ""}`); process.exit(2); }
// label (forward slashes, for rules and output) -> absolute path. Absolute paths are kept because
// relative() across Windows drives (repo on D:, temp dir on C:) returns a path join() cannot rebuild.
const label = (abs) => relative(root, abs).split("\\").join("/");
const files = new Map((scanDir ? walk(resolve(root, scanDir)) : tracked().map((f) => join(root, f))).map((abs) => [label(abs), abs]));
if (!scanDir && existsSync(join(root, "digests"))) for (const f of readdirSync(join(root, "digests"))) files.set("digests/" + f, join(root, "digests", f));
// files never scanned (by path only). The noreply address is removed from a line before matching,
// so it cannot hide anything else on that line (security review 2026-10-04).
const ALLOW_PATHS = [/^privacy\/forbidden-strings/, /^scripts\/check-forbidden\.mjs$/, /^package(-lock)?\.json$/];
const ALLOW_SUBSTRINGS = [/noreply@anthropic\.com/gi];
// the whole token around a match, so an allowlisted id (BUG-123) is compared in full, not by the
// prefix a rule happened to match (BUG-1)
const DELIM = /[\s`'"()[\]<>{},;|*]/;
function tokenAt(line, start, end) {
  let a = start, b = end;
  while (a > 0 && !DELIM.test(line[a - 1])) a--;
  while (b < line.length && !DELIM.test(line[b])) b++;
  return line.slice(a, b).replace(/[.:!?]+$/, "");
}
let hits = 0, scanned = 0;
for (const [f, p] of files) {
  if (ALLOW_PATHS.some((a) => a.test(f))) continue;
  if (!existsSync(p) || statSync(p).isDirectory()) continue;
  if (/\.(png|jpg|jpeg|gif|pdf|zip|woff2?)$/i.test(f)) continue;
  if (scanDir && /\.css$/i.test(f)) continue; // built theme styles carry no content
  const text = readFileSync(p, "utf8");
  scanned++;
  text.split("\n").forEach((raw, i) => {
    const line = ALLOW_SUBSTRINGS.reduce((l, a) => l.replace(a, (s) => " ".repeat(s.length)), raw);
    for (const r of rules) {
      // every match, not just the first: one allowlisted token must not mask a later hit
      // (built page chunks are a single line each)
      for (const m of line.matchAll(r.global)) {
        if (!m[0]) continue;
        if (ALLOW_TOKENS.has(m[0]) || ALLOW_TOKENS.has(tokenAt(line, m.index, m.index + m[0].length))) continue;
        hits++; console.log(`${f}:${i + 1}: matches ${r.src} (${m[0]})`);
      }
    }
  });
}
console.log(`${hits} hits across ${scanned} files (${rules.length} rules${process.env.CI ? ", CI example list only" : ""})`);
process.exit(hits ? 1 : 0);
