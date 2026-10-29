// Adversarial static-plus-Node review of 2026-10-28 (repo-audit-2026-10-28 in the plan records).
// Two gaps in the gates, both fixed with this file:
//
// 1. A symlink named *.md inside a content folder was followed everywhere (statSync in lintAll and
//    mdFiles, Vite's realpath in the build): `how-to/x.md -> ../tests/site/fixtures/specimen.md`
//    was linted, listed in the sidebar, built at /how-to/x and passed post-build with 0 problems,
//    so a srcExclude'd file (tests/**, .claude/**, digests/*.draft.md, sources/**) could be
//    published as a page, with a canonical URL for the real path. A symlink to a file outside the
//    repository failed the build only because Vite could not resolve `vue/server-renderer` from
//    the target's real path, which is incidental, not a gate. lintAll now rejects any symlink in a
//    content folder and mdFiles does not list one.
// 2. A root `404.md` is built by VitePress as a custom not-found page: its title and og:title
//    replaced the default, /404 was added to sitemap.xml and hashmap.json, and post-build exempts
//    404.html from the "every page in the sidebar exactly once" rule, so the page was published
//    unlisted, with content rendered only in the browser. lintAll now rejects a root 404.md, and
//    post-build fails on a built 404.md chunk (post-build.test.mjs).
import { test } from "node:test";
import assert from "node:assert/strict";
import { symlinkSync } from "node:fs";
import { join } from "node:path";
import { lintAll } from "../../../.vitepress/gen.mjs";
import { mdFiles } from "../../../.vitepress/read.mjs";
import { domErrors } from "../post-build.mjs";
import { tmp } from "./helpers.mjs";

function link(target, path, type) {
  try { symlinkSync(target, path, type); return true; } catch { return false; } // Windows without the privilege
}

test("a symlink in a content folder is rejected by the lint, not followed", (t) => {
  const d = tmp({ "ok.md": "# ok\n", "tests/fixtures/specimen.md": "# Specimen\n", "how-to/README.md": "# How\n" });
  try {
    if (!link("../tests/fixtures/specimen.md", join(d.dir, "how-to/x.md"), "file")) return t.skip("cannot create symlinks here");
    assert.throws(() => lintAll(d.dir), /how-to\/x\.md.*symlink/i, "file symlink");
    assert.deepEqual(mdFiles(join(d.dir, "how-to")), ["README.md"], "mdFiles does not list the symlink");
  } finally { d.done(); }
});

test("a symlinked folder in a content folder is rejected by the lint", (t) => {
  const d = tmp({ "ok.md": "# ok\n", "tests/fixtures/specimen.md": "# Specimen\n", "how-to/README.md": "# How\n" });
  try {
    if (!link("../tests/fixtures", join(d.dir, "how-to/extra"), "dir")) return t.skip("cannot create symlinks here");
    assert.throws(() => lintAll(d.dir), /how-to\/extra.*symlink/i, "dir symlink");
  } finally { d.done(); }
});

test("a top-level symlink to a skipped folder is still skipped (a developer's node_modules link)", (t) => {
  const d = tmp({ "ok.md": "# ok\n", "elsewhere/y.md": "# y\n" });
  try {
    if (!link("elsewhere", join(d.dir, "node_modules"), "dir")) return t.skip("cannot create symlinks here");
    assert.equal(lintAll(d.dir), 2, "ok.md and elsewhere/y.md, the link counted once as a skip");
  } finally { d.done(); }
});

test("a root 404.md (VitePress custom 404 page, outside the sidebar) is rejected by the lint", () => {
  const d = tmp({ "ok.md": "# ok\n", "404.md": "# Custom not found\n" });
  try { assert.throws(() => lintAll(d.dir), /404\.md/); } finally { d.done(); }
});

test("a 404.md below the root is an ordinary page name", () => {
  const d = tmp({ "ok.md": "# ok\n", "how-to/404.md": "# Not the not-found page\n" });
  try { assert.equal(lintAll(d.dir), 2); } finally { d.done(); }
});

// holds today: [[toc]] is still on and emits <nav class="table-of-contents"> inside the content; the
// post-build tag allowlist flags it (the build itself passes)
test("post-build flags the <nav> that [[toc]] emits inside page content", () => {
  const html = `<html><body><div class="hb-content"><h2 id="a">A</h2><nav class="table-of-contents"><ul><li><a href="#a">A</a></li></ul></nav></div></body></html>`;
  assert.deepEqual(domErrors(html), ["<nav> is not allowed in page content"]);
});
