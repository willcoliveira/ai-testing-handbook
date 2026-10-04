import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { tmp, ROOT } from "./helpers.mjs";

// an example-list pattern, assembled so this file does not trip the repo scan itself
const AWS = ["arn", "aws", ""].join(":");

const run = (...args) => spawnSync(process.execPath, ["scripts/check-forbidden.mjs", ...args], { cwd: ROOT, encoding: "utf8", env: { ...process.env, CI: "1" } });

test("--dir: a string from the example list exits 1", () => {
  const d = tmp({ "page.html": `<p>role ${AWS}iam::x</p>` });
  try {
    const r = run("--dir", d.dir);
    assert.equal(r.status, 1, r.stdout);
    assert.match(r.stdout, /page\.html:1: matches /);
  } finally { d.done(); }
});

test("--dir: a clean directory exits 0", () => {
  const d = tmp({ "page.html": "<p>nothing to see</p>" });
  try {
    const r = run("--dir", d.dir);
    assert.equal(r.status, 0, r.stdout);
    assert.match(r.stdout, /0 hits across 1 files/);
  } finally { d.done(); }
});

test("--dir: a missing directory exits 2", () => {
  assert.equal(run("--dir", "/no/such/dir").status, 2);
});

test("without --dir the repo scan is unchanged and clean", () => {
  const r = run();
  assert.equal(r.status, 0, r.stdout);
});

// bypasses found in the security review of 2026-10-04, built at runtime so this file stays clean
const ID = ["ACME", "4567"].join("-");
const BOT = ["noreply", "anthropic.com"].join("@");

test("--dir: an allowlisted token earlier on a line does not mask a later hit", () => {
  const d = tmp({ "page.html": `MATH-500 then ${ID}` });
  try {
    const r = run("--dir", d.dir);
    assert.equal(r.status, 1, r.stdout);
    assert.match(r.stdout, new RegExp(`\\(${ID}\\)`));
  } finally { d.done(); }
});

test("--dir: every hit on a one-line page is reported", () => {
  const d = tmp({ "page.js": `${ID} x ${ID.replace("4567", "8901")}` });
  try {
    const r = run("--dir", d.dir);
    assert.match(r.stdout, /^2 hits/m);
  } finally { d.done(); }
});

test("--dir: the noreply address no longer exempts the rest of its line", () => {
  const d = tmp({ "page.html": `${BOT} ${ID}` });
  try {
    const r = run("--dir", d.dir);
    assert.equal(r.status, 1, r.stdout);
  } finally { d.done(); }
});

test("--dir: the noreply address alone and whole allowlisted ids still pass", () => {
  const d = tmp({ "page.html": `${BOT} and BUG-123, (user@example.com)` });
  try {
    const r = run("--dir", d.dir);
    assert.equal(r.status, 0, r.stdout);
  } finally { d.done(); }
});

test("--dir: a longer id that starts like an allowlisted one is not exempt", () => {
  const d = tmp({ "page.html": `${["BUG", "1234"].join("-")} and ${["BUG", "4560"].join("-")}` });
  try {
    const r = run("--dir", d.dir);
    assert.equal(r.status, 1, r.stdout);
  } finally { d.done(); }
});
