// Fixture VitePress builds with the links plugin. Own file (own process): VitePress keeps one
// markdown renderer per process, so this must not share one with links.test.mjs.
import { test } from "node:test";
import assert from "node:assert/strict";
import { join } from "node:path";
import { readFileSync, writeFileSync } from "node:fs";
import { build } from "vitepress";
import { REPO } from "../../../.vitepress/plugins/links.mjs";
import { tmp, ROOT } from "./helpers.mjs";

// a real VitePress build with the plugin: strict dead links must fail it
async function site(index) {
  const s = tmp({
    "index.md": index, "how-to/README.md": "# How\n", "LICENSE": "MIT\n",
    ".vitepress/config.mjs": `import links from ${JSON.stringify(join(ROOT, ".vitepress/plugins/links.mjs"))};
export default { base: "/b/", cleanUrls: true, rewrites: { ":dir/README.md": ":dir/index.md" }, markdown: { html: false, config: (md) => { md.use(links, { root: ${JSON.stringify("ROOTDIR")} }); } } };`,
  }, { inRepo: true });
  const cfg = join(s.dir, ".vitepress/config.mjs");
  writeFileSync(cfg, readFileSync(cfg, "utf8").replace('"ROOTDIR"', JSON.stringify(s.dir)));
  return s;
}

test("fixture build: README and LICENSE links build clean", { timeout: 120000 }, async () => {
  const s = await site("# Home\n\n[how](how-to/README.md) [mit](LICENSE)\n");
  try {
    await build(s.dir, { outDir: join(s.dir, "dist") });
    const html = readFileSync(join(s.dir, "dist/index.html"), "utf8");
    assert.match(html, /href="\/b\/how-to\/"/);
    assert.match(html, new RegExp(`href="${REPO}/blob/main/LICENSE"`));
  } finally { s.done(); }
});

test("negative fixture build: a dead link fails the build", { timeout: 120000 }, async () => {
  const s = await site("# Home\n\n[gone](missing-page.md)\n");
  try {
    await assert.rejects(build(s.dir, { outDir: join(s.dir, "dist") }), /dead link/i);
  } finally { s.done(); }
});
