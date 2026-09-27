// HEAD (then GET) every URL in sources.md and the learning path. 10 concurrent, 15 s timeout,
// one retry. Known bot-blockers are reported but not counted. --report-only never exits 1.
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const reportOnly = process.argv.includes("--report-only");
const ALLOW = [/arxiv\.org\/pdf/, /linkedin\.com/, /youtube\.com/, /youtu\.be/, /openai\.com/, /iso\.org/, /x\.com/, /twitter\.com/];
const files = ["sources.md", "learning-path/resources.md"].map((f) => join(root, f)).filter(existsSync);
const urls = new Set();
for (const f of files) for (const m of readFileSync(f, "utf8").matchAll(/https?:\/\/[^\s|)>\]]+/g)) urls.add(m[0].replace(/[.,;:]+$/, ""));
const list = [...urls];
let broken = 0, soft = 0, ok = 0;
async function probe(url) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 15000);
  try {
    let r = await fetch(url, { method: "HEAD", redirect: "follow", signal: ctl.signal, headers: { "user-agent": "Mozilla/5.0 (link-check)" } });
    if (r.status >= 400 || r.status === 0) r = await fetch(url, { method: "GET", redirect: "follow", signal: ctl.signal, headers: { "user-agent": "Mozilla/5.0 (link-check)" } });
    return r.status;
  } catch (e) { return 0; } finally { clearTimeout(t); }
}
let i = 0;
async function worker() {
  while (i < list.length) {
    const url = list[i++];
    let s = await probe(url);
    if (s === 0 || s >= 400) s = await probe(url);
    if (s >= 200 && s < 400) ok++;
    else if (ALLOW.some((a) => a.test(url))) { soft++; console.log(`soft ${s} ${url}`); }
    else { broken++; console.log(`BROKEN ${s} ${url}`); }
  }
}
await Promise.all(Array.from({ length: 10 }, worker));
console.log(`${ok} ok, ${soft} soft (allow-listed hosts), ${broken} broken of ${list.length} urls`);
process.exit(broken && !reportOnly ? 1 : 0);
