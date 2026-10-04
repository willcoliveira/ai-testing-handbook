import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
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

// evasions found in the adversarial re-test of the fixes (2026-10-04); each must be reported
const [A, B] = ["AC", ["ME", "1234"].join("-")];
const ARN = ["arn", "aws", ""].join(":");
const evasions = {
  "markup split in HTML": { "page.html": `<p>${A}<strong>${B.slice(0, 2)}</strong>${B.slice(2)}</p>` },
  "emphasis split in Markdown": { "page.md": `${A}**${B.slice(0, 2)}**${B.slice(2)}` },
  "non-breaking hyphen": { "page.html": `${A}${B.replace("-", "‑")}` },
  "zero-width space in an ARN": { "page.html": `${ARN.replace(":aws", ":​aws")}iam::1:role/x` },
  "entity-encoded hyphen": { "page.html": `${A}${B.replace("-", "&#45;")}` },
  "UTF-16 file": { "page.txt": Buffer.concat([Buffer.from([0xff, 0xfe]), Buffer.from(`${A}${B}`, "utf16le")]) },
  "text file named .png": { "logo.png": `${A}${B}` },
  "string in a .CSS file": { "theme.CSS": `.x{content:"${A}${B}"}` },
  "address ending in the noreply address": { "page.html": `alice.${["noreply", "anthropic.com"].join("@")}` },
};
for (const [name, files] of Object.entries(evasions)) {
  test(`--dir: reported despite evasion: ${name}`, () => {
    const d = tmp(files);
    try {
      const r = run("--dir", d.dir);
      assert.equal(r.status, 1, r.stdout);
    } finally { d.done(); }
  });
}

test("--dir: a CSS selector that looks like a hostname is not a hit", () => {
  const d = tmp({ "theme.css": `.${"lo" + "cal"}{color:red}.x{content:"ok"}` });
  try { assert.equal(run("--dir", d.dir).status, 0); } finally { d.done(); }
});

// round four: a multi-word name wrapped across lines or spaced out, and a NUL byte in a text file
test("--dir: a multi-word name split across lines or spaces is reported", () => {
  const name = ["acme", "corp"].join(" ");
  const d = tmp({
    "privacy/forbidden-strings.example.txt": `${name}\n`,
    "site/a.md": "the acme\ncorp report\n",
    "site/b.html": "<p>ACME   corp</p>",
  });
  try {
    const r = spawnSync(process.execPath, [join(ROOT, "scripts/check-forbidden.mjs"), "--dir", "site"], { cwd: d.dir, encoding: "utf8", env: { ...process.env, CI: "1" } });
    assert.equal(r.status, 1, r.stdout);
    assert.match(r.stdout, /site\/a\.md: matches .* across lines/);
    assert.match(r.stdout, /site\/b\.html/);
  } finally { d.done(); }
});

test("--dir: a NUL byte does not hide a text file", () => {
  const d = tmp({ "notes.txt": Buffer.concat([Buffer.from("x\0y "), Buffer.from(`${A}${B}`)]) });
  try { assert.equal(run("--dir", d.dir).status, 1); } finally { d.done(); }
});
