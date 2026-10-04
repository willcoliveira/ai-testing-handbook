// Guards on the workflows that actionlint cannot express, checked on the parsed YAML (a regex
// version was bypassed seven ways in the adversarial re-test of 2026-10-04). Each rule returns a
// list of problems; the real workflows must return none, and each known bypass must return some.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { ROOT } from "./helpers.mjs";

const load = (file) => parse(readFileSync(join(ROOT, ".github/workflows", file), "utf8"));
const PUSH_MAIN = "github.event_name == 'push' && github.ref == 'refs/heads/main'";
const TRIGGERS = ["push", "pull_request", "schedule", "workflow_dispatch"];
const READ_ONLY = new Set(["read", "none"]);
const steps = (job) => job.steps || [];
const usesOf = (step) => String(step.uses || "").split("@")[0];

// rules for any workflow
export function workflowProblems(wf, name) {
  const out = [];
  const on = typeof wf.on === "string" ? [wf.on] : Array.isArray(wf.on) ? wf.on : Object.keys(wf.on || {});
  for (const t of on) if (!TRIGGERS.includes(t)) out.push(`${name}: trigger ${t} is not allowed`);
  if (JSON.stringify(wf.permissions) !== JSON.stringify({ contents: "read" })) out.push(`${name}: top-level permissions must be exactly { contents: read }`);
  for (const [id, job] of Object.entries(wf.jobs || {})) {
    if (!Number.isFinite(job["timeout-minutes"])) out.push(`${name}/${id}: no numeric timeout-minutes`);
    if (job.permissions === "write-all" || job.permissions === "read-all") out.push(`${name}/${id}: permissions ${job.permissions}`);
    for (const s of steps(job)) {
      if (usesOf(s) === "actions/checkout" && s.with?.["persist-credentials"] !== false) out.push(`${name}/${id}: a checkout keeps its credentials`);
      if (/\bgit\s+(push|commit)\b/.test(s.run || "")) out.push(`${name}/${id}: runs git push or commit`);
      if (/^\.\//.test(String(s.uses || ""))) out.push(`${name}/${id}: uses a local action`);
      // only GitHub's own actions, each pinned to a full commit SHA (round four)
      if (s.uses && !/^\.\//.test(s.uses)) {
        if (!/^actions\/[\w.-]+@[0-9a-f]{40}$/.test(String(s.uses))) out.push(`${name}/${id}: ${s.uses} is not an actions/* step pinned to a commit SHA`);
      }
    }
  }
  return out;
}

// rules for the jobs that build and publish the site
export function deployProblems(wf) {
  const out = [];
  const jobs = wf.jobs || {};
  const { build, deploy, smoke } = jobs;
  if (!build || !deploy) return ["site.yml needs a build and a deploy job"];
  for (const [id, job] of Object.entries(jobs)) {
    const p = job.permissions;
    if (!p || typeof p !== "object") continue;
    const writes = Object.entries(p).filter(([, v]) => !READ_ONLY.has(v)).map(([k]) => k);
    if (id === "deploy") {
      if (JSON.stringify(Object.keys(p).sort()) !== JSON.stringify(["id-token", "pages"]) || p.pages !== "write" || p["id-token"] !== "write") out.push("deploy permissions must be exactly pages: write and id-token: write");
    } else if (writes.length) out.push(`${id} has write permissions: ${writes.join(", ")}`);
  }
  for (const [id, job] of [["build", build], ["deploy", deploy]]) {
    if (job.if !== PUSH_MAIN) out.push(`${id} must run only on a push to main`);
    if (job.container || job.services) out.push(`${id} must not use a container or services`);
  }
  const needs = [].concat(build.needs || []);
  for (const gate of ["test", "lint", "e2e"]) if (!needs.includes(gate)) out.push(`build must need ${gate}`);
  if (JSON.stringify([].concat(deploy.needs || [])) !== JSON.stringify(["build"])) out.push("deploy must need exactly build");
  if (deploy.environment?.name !== "github-pages") out.push("deploy must use the github-pages environment");
  const ds = steps(deploy);
  if (ds.length !== 1 || usesOf(ds[0]) !== "actions/deploy-pages" || ds[0].run) out.push("deploy must have exactly one step: actions/deploy-pages");
  for (const s of steps(build)) if (/\bnpm (ci|install|i)\b/.test(s.run || "") && !/--ignore-scripts/.test(s.run)) out.push("build installs with lifecycle scripts");
  if (!steps(build).some((s) => /npm ci --ignore-scripts/.test(s.run || ""))) out.push("build must run npm ci --ignore-scripts");
  // the build job runs exactly these commands and actions, checks the artifact, and uploads dist
  const BUILD_RUNS = ["npm ci --ignore-scripts", "npm run docs:build", "node tests/site/post-build.mjs"];
  const BUILD_USES = ["actions/checkout", "actions/setup-node", "actions/upload-pages-artifact"];
  for (const s of steps(build)) {
    if (s.run && !BUILD_RUNS.includes(String(s.run).trim())) out.push(`build runs an unexpected command: ${String(s.run).trim().slice(0, 60)}`);
    if (s.uses && !BUILD_USES.includes(usesOf(s))) out.push(`build uses an unexpected action: ${s.uses}`);
  }
  if (!steps(build).some((s) => String(s.run || "").trim() === "node tests/site/post-build.mjs")) out.push("build must run the post-build checks on the artifact");
  const upload = steps(build).find((s) => usesOf(s) === "actions/upload-pages-artifact");
  if (upload?.with?.path !== ".vitepress/dist") out.push("build must upload .vitepress/dist");
  if (!smoke || JSON.stringify([].concat(smoke.needs || [])) !== JSON.stringify(["deploy"])) out.push("smoke must need exactly deploy");
  if (smoke && smoke.if && smoke.if !== PUSH_MAIN) out.push("smoke may only run on a push to main");
  return out;
}

const SITE = load("site.yml");
const CI = load("ci.yml");

test("the real workflows pass every rule", () => {
  assert.deepEqual(workflowProblems(SITE, "site.yml"), []);
  assert.deepEqual(workflowProblems(CI, "ci.yml"), []);
  assert.deepEqual(deployProblems(SITE), []);
});

// each mutation is a bypass the regex guards missed, or one they caught; all must now fail
const clone = () => structuredClone(SITE);
const MUTATIONS = {
  "deploy gains a run step": (w) => w.jobs.deploy.steps.push({ run: "node -e 1" }),
  "deploy runs only on push (not main)": (w) => { w.jobs.deploy.if = "github.event_name == 'push'"; },
  "deploy also runs on pull_request": (w) => { w.jobs.deploy.if = "github.event_name == 'push' || github.event_name == 'pull_request'"; },
  "build gets write-all": (w) => { w.jobs.build.permissions = "write-all"; },
  "build gets id-token and actions write": (w) => { w.jobs.build.permissions = { contents: "read", "id-token": "write", actions: "write" }; },
  "deploy gets contents write": (w) => { w.jobs.deploy.permissions.contents = "write"; },
  "a named checkout keeps credentials": (w) => { w.jobs.build.steps[0] = { name: "Checkout", uses: "actions/checkout@v7" }; },
  "a new job with write-all and no timeout": (w) => { w.jobs.late = { "runs-on": "ubuntu-latest", permissions: "write-all", steps: [{ run: "echo" }] }; },
  "pull_request_target trigger": (w) => { w.on.pull_request_target = null; },
  "workflow-level permissions removed": (w) => { delete w.permissions; },
  "environment removed from deploy": (w) => { delete w.jobs.deploy.environment; },
  "build installs with lifecycle scripts": (w) => { w.jobs.build.steps = w.jobs.build.steps.map((s) => (s.run === "npm ci --ignore-scripts" ? { run: "npm ci" } : s)); },
  "deploy no longer needs build": (w) => { w.jobs.deploy.needs = ["test"]; },
  "build skips the e2e gate": (w) => { w.jobs.build.needs = ["test", "lint"]; },
  "deploy runs in a container": (w) => { w.jobs.deploy.container = "node:22"; },
  "a step uses a local action": (w) => { w.jobs.build.steps.push({ uses: "./.github/actions/x" }); },
  // round four
  "a third-party action": (w) => { w.jobs.test.steps.push({ uses: "attacker/x@0123456789abcdef0123456789abcdef01234567" }); },
  "an action pinned to a tag": (w) => { w.jobs.build.steps[0].uses = "actions/checkout@v7"; },
  "an extra command in build": (w) => { w.jobs.build.steps.splice(3, 0, { run: "node -e 1" }); },
  "post-build removed from build": (w) => { w.jobs.build.steps = w.jobs.build.steps.filter((s) => s.run !== "node tests/site/post-build.mjs"); },
  "a different upload path": (w) => { w.jobs.build.steps.find((s) => String(s.uses).startsWith("actions/upload-pages-artifact")).with.path = "."; },
};
for (const [name, mutate] of Object.entries(MUTATIONS)) {
  test(`rejected: ${name}`, () => {
    const w = clone();
    mutate(w);
    assert.ok([...workflowProblems(w, "site.yml"), ...deployProblems(w)].length > 0, `${name} passed every rule`);
  });
}
