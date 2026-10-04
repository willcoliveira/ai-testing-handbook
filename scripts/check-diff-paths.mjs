// Fails when the working tree changes anything outside the paths a skill may touch. Run by /refresh
// and /roles before staging, so a stray file a subagent or a fetched page produced cannot reach the
// commit (security review, 2026-10-04). Usage: node scripts/check-diff-paths.mjs <refresh|roles>
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export const PROFILES = {
  refresh: ["sources.md", "sources/", "practices/", "digests/", "CHANGELOG.md", ".claude/skills/kb-refresh/references/sweep-list.md"],
  roles: ["learning-path/ai-qa-requirements.md", "learning-path/interview-questions.md", "sources.md", "sources/", "CHANGELOG.md"],
};

export function outside(paths, allowed) {
  return paths.filter((p) => !allowed.some((a) => (a.endsWith("/") ? p.startsWith(a) : p === a)));
}

export function changedPaths(cwd = process.cwd()) {
  const git = (...args) => execFileSync("git", args, { cwd, encoding: "utf8" }).split("\n").filter(Boolean);
  return [...new Set([...git("diff", "--name-only", "HEAD"), ...git("ls-files", "--others", "--exclude-standard")])].sort();
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const profile = process.argv[2];
  if (!PROFILES[profile]) { console.error(`usage: check-diff-paths.mjs <${Object.keys(PROFILES).join("|")}>`); process.exit(2); }
  const changed = changedPaths();
  const bad = outside(changed, PROFILES[profile]);
  for (const p of bad) console.log(`not allowed for ${profile}: ${p}`);
  console.log(`${changed.length} changed paths, ${bad.length} outside the ${profile} allowlist`);
  process.exit(bad.length ? 1 : 0);
}
