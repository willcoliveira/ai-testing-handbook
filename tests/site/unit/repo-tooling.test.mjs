// The refresh and roles skills read pages anyone can publish. These guard the limits that keep a
// prompt injection in a fetched page from reaching files, commands or a commit (review of 2026-10-04).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { outside, changedPaths, PROFILES } from "../../../scripts/check-diff-paths.mjs";
import { tmp, ROOT } from "./helpers.mjs";

const read = (p) => readFileSync(join(ROOT, p), "utf8");
const frontmatter = (text) => Object.fromEntries((text.match(/^---\n([\s\S]*?)\n---/)?.[1] || "").split("\n").map((l) => l.match(/^([\w-]+):\s*(.*)$/)).filter(Boolean).map((m) => [m[1], m[2]]));

test("web-reader has web access only", () => {
  const fm = frontmatter(read(".claude/agents/web-reader.md"));
  assert.deepEqual(fm.tools.split(",").map((s) => s.trim()).sort(), ["WebFetch", "WebSearch"]);
});

test("kb-refresh pre-approves no write, no edit, no open-ended command, no open web", () => {
  const tools = frontmatter(read(".claude/skills/kb-refresh/SKILL.md"))["allowed-tools"].split(/,\s*/);
  for (const t of tools) {
    assert.ok(!/^(Write|Edit|MultiEdit|NotebookEdit|WebSearch|Bash)$/.test(t), `bare ${t}`);
    assert.ok(t !== "WebFetch", "WebFetch must be limited to domains");
    if (t.startsWith("WebFetch(")) assert.match(t, /^WebFetch\(domain:[a-z0-9.-]+\)$/, t);
    // a prefix on a fixed command (git status:*) is fine; a wildcard script, npm run or bare Bash is not
    if (t.startsWith("Bash(")) assert.doesNotMatch(t, /^Bash\(\*|node scripts\/\*|npm (run|exec|x)|^Bash\((node|npx|sh|bash|python3?):\*\)$/, `open-ended: ${t}`);
  }
});

test("refresh and roles fetch through web-reader and never stage everything", () => {
  for (const skill of ["refresh", "roles"]) {
    const s = read(`.claude/skills/${skill}/SKILL.md`);
    assert.match(s, /web-reader/, `${skill} uses web-reader`);
    assert.doesNotMatch(s, /general-purpose/, `${skill} has no general-purpose fetcher`);
    assert.doesNotMatch(s, /git add -A`?,? then|^- `git add -A`/m, `${skill} does not git add -A`);
    assert.match(s, new RegExp(`check-diff-paths\\.mjs ${skill}`), `${skill} checks its diff paths`);
    assert.match(s, /check-forbidden\.mjs --file/, `${skill} checks the PR body`);
  }
});

test("check-diff-paths: only the profile's paths pass", () => {
  assert.deepEqual(outside(["sources.md", "sources/_x.rows.md", "practices/3-judging/a.md", "digests/d.md", "CHANGELOG.md"], PROFILES.refresh), []);
  assert.deepEqual(outside(["scripts/x.mjs", ".github/workflows/site.yml", "package.json", "practicesX/a.md"], PROFILES.refresh), ["scripts/x.mjs", ".github/workflows/site.yml", "package.json", "practicesX/a.md"]);
  assert.deepEqual(outside(["practices/3-judging/a.md"], PROFILES.roles), ["practices/3-judging/a.md"]);
});

test("check-diff-paths: sees modified and untracked files in a real repository", () => {
  const d = tmp({ "sources.md": "a\n", "x.txt": "a\n" });
  try {
    const git = (...a) => execFileSync("git", a, { cwd: d.dir, encoding: "utf8" });
    git("init", "-q"); git("-c", "user.name=t", "-c", "user.email=t@t", "add", "."); git("-c", "user.name=t", "-c", "user.email=t@t", "commit", "-qm", "i");
    writeFileSync(join(d.dir, "sources.md"), "b\n");
    writeFileSync(join(d.dir, "stray.mjs"), "1\n");
    assert.deepEqual(changedPaths(d.dir), ["sources.md", "stray.mjs"]);
    const r = spawnSync(process.execPath, [join(ROOT, "scripts/check-diff-paths.mjs"), "refresh"], { cwd: d.dir, encoding: "utf8" });
    assert.equal(r.status, 1, r.stdout);
    assert.match(r.stdout, /not allowed for refresh: stray\.mjs/);
  } finally { d.done(); }
});

test("check-forbidden --file scans exactly one file (commit messages, PR bodies)", () => {
  const id = ["ACME", "4567"].join("-");
  const d = tmp({ "body.md": `Moved: ${id}\n`, "clean.md": "Moved: nothing\n" });
  try {
    const run = (f) => spawnSync(process.execPath, ["scripts/check-forbidden.mjs", "--file", join(d.dir, f)], { cwd: ROOT, encoding: "utf8", env: { ...process.env, CI: "1" } });
    assert.equal(run("body.md").status, 1);
    const ok = run("clean.md");
    assert.equal(ok.status, 0);
    assert.match(ok.stdout, /across 1 files/);
  } finally { d.done(); }
});

test("the commit-msg hook checks the message", () => {
  assert.match(read(".githooks/commit-msg"), /check-forbidden\.mjs --file "\$1"/);
});
