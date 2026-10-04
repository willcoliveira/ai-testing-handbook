// Shared fixture for security-build and security-control: a VitePress build of the payloads.
import { join } from "node:path";
import { readFileSync } from "node:fs";
import { build } from "vitepress";
import { escapeLabel } from "../../../.vitepress/book.mjs";
import { tmp, ROOT } from "./helpers.mjs";

export const XSS_TITLE = "Judge<img src=x onerror=alert(document.domain)>";
const PAGE = [
  "# Home",
  "",
  "Plain {{ 3*3 }} and {{ $emit.constructor('return 6+6')() }}.",
  "",
  "| a | b |", "|---|---|", "| cell {{ 5*5 }} | x |",
  "",
  "Inline `code {{ 8*8 }}`.",
  "",
].join("\n");

export async function site({ safe }) {
  const plugin = JSON.stringify(join(ROOT, ".vitepress/plugins/vue-safe.mjs"));
  const label = JSON.stringify(safe ? escapeLabel(XSS_TITLE) : XSS_TITLE);
  // with the fix, also a payload that markdown splits across emphasis tokens (it would not compile without it)
  const page = safe ? PAGE + "\nSplit {{ 7*7 }} across emphasis {{ 2*2 }}.\n" : PAGE;
  const s = tmp({
    "index.md": page, "other.md": "# Other\n",
    ".vitepress/config.mjs": `import vueSafe from ${plugin};
export default { base: "/b/", markdown: { html: false, config: (md) => { ${safe ? "md.use(vueSafe);" : ""} } },
  themeConfig: { sidebar: [{ text: ${label}, link: "/other" }] } };`,
  }, { inRepo: true });
  await build(s.dir, { outDir: join(s.dir, "dist") });
  return { html: readFileSync(join(s.dir, "dist/index.html"), "utf8"), done: s.done };
}

