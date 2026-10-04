// Shared fixture for security-build and security-control: a VitePress build of the payloads.
import { join } from "node:path";
import { readFileSync, readdirSync } from "node:fs";
import { build } from "vitepress";
import { escapeLabel } from "../../../.vitepress/book.mjs";
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
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

// bypasses from the adversarial re-test (B1 attrs, B2 GitHub alert title, B3 code-group label, B8
// snippet import of a file outside the repository); with the fixes they must render as inert text
export const OUTSIDE = join(tmpdir(), "hb-outside-marker.md");
const BYPASSES = (fence) => [
  "",
  "## Attrs {:data-pwn=\"6*7\"}",
  "",
  "para {:data-pwn10=\"[].constructor.constructor('return 6*7')()\"}",
  "",
  "click {@click=\"6*7\"}",
  "",
  "> [!NOTE] <img :data-pwn=\"6*7\" data-pwn2=alert>",
  "",
  "::: code-group",
  `${fence}js`,
  "a",
  fence,
  ":::",
  "",
  `<<< ${OUTSIDE}`,
  "",
].join("\n");

// a file outside the repository, large enough (8 KB) that Vite would emit it as an asset, not inline it
export const OUTSIDE_PNG = join(tmpdir(), "hb-outside-image.png");
export async function site({ safe, extra = "", head = "" }) {
  const plugin = JSON.stringify(join(ROOT, ".vitepress/plugins/vue-safe.mjs"));
  const lockdown = JSON.stringify(join(ROOT, ".vitepress/plugins/lockdown.mjs"));
  writeFileSync(OUTSIDE_PNG, Buffer.alloc(8192, 7));
  writeFileSync(OUTSIDE, "OUTSIDE-FILE-MARKER\n");
  const label = JSON.stringify(safe ? escapeLabel(XSS_TITLE) : XSS_TITLE);
  // with the fix, also a payload that markdown splits across emphasis tokens (it would not compile without it)
  const page = (safe ? PAGE + "\nSplit {{ 7*7 }} across emphasis {{ 2*2 }}.\n" + BYPASSES("```") : PAGE) + extra;
  const s = tmp({
    "index.md": head + page, "other.md": "# Other\n",
    ".vitepress/config.mjs": `import vueSafe from ${plugin};
import lockdown, { BLOCKED_ENGINES } from ${lockdown};
export default { base: "/b/", markdown: { html: false, ${safe ? "attrs: { disable: true }, gfmAlerts: false, frontmatter: { grayMatterOptions: { engines: BLOCKED_ENGINES } }," : ""} config: (md) => { ${safe ? "md.use(vueSafe); md.use(lockdown);" : ""} } },
  themeConfig: { sidebar: [{ text: ${label}, link: "/other" }] } };`,
  }, { inRepo: true });
  try { await build(s.dir, { outDir: join(s.dir, "dist") }); } catch (e) { s.done(); throw e; }
  const assets = readdirSync(join(s.dir, "dist/assets"), { recursive: true }).map(String);
  return { html: readFileSync(join(s.dir, "dist/index.html"), "utf8"), assets, done: s.done };
}

