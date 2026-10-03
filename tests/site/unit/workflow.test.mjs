// Guards on .github/workflows/site.yml that actionlint cannot express: the deploy and smoke jobs
// run only on a push to main, and nothing in the workflow can write to the repository.
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

test("deploy runs only on a push to main", () => {
  const deploy = jobBlock(SITE_YML, "deploy");
  assert.ok(deploy, "site.yml has a deploy job");
  assert.equal(jobIf(deploy), PUSH_MAIN);
});

test("deploy needs the test, lint and e2e gates", () => {
  const m = /^ {4}needs:\s*\[(.+)\]\s*$/m.exec(jobBlock(SITE_YML, "deploy"));
  assert.ok(m, "deploy declares needs");
  const needs = m[1].split(",").map((s) => s.trim());
  for (const job of ["test", "lint", "e2e"]) assert.ok(needs.includes(job), `deploy needs ${job}`);
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
  const broken = SITE_YML.replace(`    if: ${PUSH_MAIN}\n    needs: [test, lint, e2e]`, "    if: github.event_name == 'push' || github.event_name == 'pull_request'\n    needs: [test, lint, e2e]");
  assert.notEqual(broken, SITE_YML, "fixture substitution applied");
  assert.notEqual(jobIf(jobBlock(broken, "deploy")), PUSH_MAIN);
});
