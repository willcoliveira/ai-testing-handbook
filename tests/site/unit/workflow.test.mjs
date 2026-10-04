// Guards on the workflows that actionlint cannot express: build, deploy and smoke run only on a push
// to main, deploy runs no repository code, checkouts keep no credentials, every job has a timeout,
// and nothing can write to the repository.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./helpers.mjs";

const SITE_YML = readFileSync(join(ROOT, ".github/workflows/site.yml"), "utf8").replace(/\r\n/g, "\n");

// the lines of one top-level job (two-space key under `jobs:`), up to the next job
export function jobBlock(yml, name) {
  const lines = yml.split("\n");
  const start = lines.findIndex((l) => l === `  ${name}:`);
  if (start === -1) return null;
  const end = lines.findIndex((l, i) => i > start && /^ {2}[A-Za-z0-9_-]+:\s*$/.test(l));
  return lines.slice(start, end === -1 ? undefined : end).join("\n");
}

// the job-level `if:` (four-space indent), or null
export function jobIf(block) {
  const m = /^ {4}if:\s*(.+)$/m.exec(block ?? "");
  return m ? m[1].trim() : null;
}

const PUSH_MAIN = "github.event_name == 'push' && github.ref == 'refs/heads/main'";

test("build and deploy run only on a push to main", () => {
  for (const name of ["build", "deploy"]) {
    const job = jobBlock(SITE_YML, name);
    assert.ok(job, `site.yml has a ${name} job`);
    assert.equal(jobIf(job), PUSH_MAIN, `${name} if`);
  }
});

test("build needs the test, lint and e2e gates; deploy needs build", () => {
  const m = /^ {4}needs:\s*\[(.+)\]\s*$/m.exec(jobBlock(SITE_YML, "build"));
  assert.ok(m, "build declares needs");
  const needs = m[1].split(",").map((s) => s.trim());
  for (const job of ["test", "lint", "e2e"]) assert.ok(needs.includes(job), `build needs ${job}`);
  assert.match(jobBlock(SITE_YML, "deploy"), /^ {4}needs:\s*\[build\]\s*$/m);
});

// security review 2026-10-04: the job holding Pages and OIDC permissions runs no repository or
// dependency code, and the job that builds holds no write permission
test("deploy runs only deploy-pages; build has no write or id-token permission", () => {
  const deploy = jobBlock(SITE_YML, "deploy");
  assert.doesNotMatch(deploy, /^\s+(- )?run:/m, "no run steps in deploy");
  assert.deepEqual([...deploy.matchAll(/uses:\s*(\S+)/g)].map((m) => m[1].split("@")[0]), ["actions/deploy-pages"]);
  const build = jobBlock(SITE_YML, "build");
  assert.doesNotMatch(build, /pages:\s*write|id-token:\s*write/);
  assert.match(build, /npm ci --ignore-scripts/);
});

test("every checkout drops its credentials, in both workflows", () => {
  for (const file of ["site.yml", "ci.yml"]) {
    const yml = readFileSync(join(ROOT, ".github/workflows", file), "utf8").replace(/\r\n/g, "\n");
    const checkouts = [...yml.matchAll(/- uses: actions\/checkout@\S+\n((?: {8}.*\n)*)/g)];
    assert.ok(checkouts.length > 0, `${file} has checkouts`);
    for (const c of checkouts) assert.match(c[1], /persist-credentials: false/, `${file}: ${c[0].split("\n")[0]}`);
  }
});

test("every job has a timeout", () => {
  const names = [...SITE_YML.matchAll(/^ {2}([A-Za-z0-9_-]+):\s*$/gm)].map((m) => m[1]).filter((n) => jobBlock(SITE_YML, n).includes("runs-on"));
  for (const n of names) assert.match(jobBlock(SITE_YML, n), /^ {4}timeout-minutes:\s*\d+/m, `${n} has timeout-minutes`);
});

test("smoke runs only after deploy", () => {
  const smoke = jobBlock(SITE_YML, "smoke");
  assert.ok(smoke, "site.yml has a smoke job");
  assert.match(smoke, /^ {4}needs:\s*deploy\s*$/m);
  const cond = jobIf(smoke);
  assert.ok(cond === null || cond === PUSH_MAIN, `smoke if must be absent or push-on-main, got: ${cond}`);
});

test("nothing in site.yml can push or commit", () => {
  assert.doesNotMatch(SITE_YML, /contents:\s*write/);
  assert.doesNotMatch(SITE_YML, /git (push|commit)/);
  assert.doesNotMatch(SITE_YML, /auto-commit|create-pull-request/i);
});

test("the guards reject a deploy that also runs on pull_request", () => {
  const broken = SITE_YML.replace(`    if: ${PUSH_MAIN}\n    needs: [build]`, "    if: github.event_name == 'push' || github.event_name == 'pull_request'\n    needs: [build]");
  assert.notEqual(broken, SITE_YML, "fixture substitution applied");
  assert.notEqual(jobIf(jobBlock(broken, "deploy")), PUSH_MAIN);
});
