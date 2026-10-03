// The site reads the handbook in place. Run `node .vitepress/gen.mjs` first (the docs:* scripts do):
// it writes the part intro pages and the sources/ids data this config reads.
import { defineConfig } from "vitepress";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildSidebar, linkOf } from "./book.mjs";
import { titleOf, parseFlat } from "./read.mjs";
import citePlugin from "./plugins/cite.mjs";
import linksPlugin, { REPO } from "./plugins/links.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
export const BASE = "/ai-testing-handbook/";
export const SITE = `https://willcoliveira.github.io${BASE}`;
export const SRC_EXCLUDE = ["sources/**", "**/_TEMPLATE.md", "digests/*.draft.md", ".claude/**", "node_modules/**", "scripts/**", "tests/**",
  // Playwright output (error-context.md) would otherwise build as pages; found by tests/site/e2e after a failed run
  "test-results/**", "playwright-report/**", "blob-report/**"];
// reference tables: full width, no outline, tables scroll in their own box
export const WIDE = ["sources.md", "tools/README.md", "labs/README.md", "learning-path/knowledge-matrix.md"];
const DESCRIPTION = "Evals, guardrails, benchmarks and audits for LLM applications and agents: a sourced reference and a learning path for AI testing.";

function data(name) {
  const p = join(ROOT, ".vitepress/data", name);
  if (!existsSync(p)) throw new Error(`${p} is missing; run node .vitepress/gen.mjs first`);
  return JSON.parse(readFileSync(p, "utf8"));
}
const sources = data("sources.json");
const ids = data("ids.json");

const route = (relativePath) => relativePath.replace(/(^|\/)index\.md$/, "$1").replace(/\.md$/, "");

export default defineConfig({
  title: "AI Testing Handbook",
  description: DESCRIPTION,
  lang: "en",
  base: BASE,
  cleanUrls: true,
  lastUpdated: false,
  srcExclude: SRC_EXCLUDE,
  rewrites: {
    "README.md": "index.md",
    ":dir/README.md": ":dir/index.md",
    "practices/:part/_part.md": "practices/:part/index.md",
    "patterns/_part.md": "patterns/index.md",
    "practices/_part.md": "practices/index.md",
  },
  sitemap: { hostname: SITE },
  markdown: {
    html: false,
    // flat key: value frontmatter (see read.mjs); one title has a colon, which strict YAML rejects
    frontmatter: { grayMatterOptions: { engines: { yaml: (s) => parseFlat(s) } } },
    config(md) {
      md.use(citePlugin, { sources, base: BASE });
      md.use(linksPlugin, { root: ROOT, exclude: SRC_EXCLUDE });
    },
  },
  head: [["meta", { property: "og:site_name", content: "AI Testing Handbook" }]],
  transformHead({ pageData }) {
    if (pageData.isNotFound) return [];
    const url = SITE + route(pageData.relativePath);
    return [
      ["link", { rel: "canonical", href: url }],
      ["meta", { property: "og:type", content: "article" }],
      ["meta", { property: "og:title", content: pageData.title || "AI Testing Handbook" }],
      ["meta", { property: "og:description", content: pageData.description || DESCRIPTION }],
      ["meta", { property: "og:url", content: url }],
    ];
  },
  transformPageData(pageData) {
    const fm = pageData.frontmatter;
    if (WIDE.includes(pageData.filePath)) Object.assign(fm, { aside: false, outline: false, pageClass: "hb-wide" });
    // meta line: status · reviewed DATE · N sources, from whatever the frontmatter carries
    const n = Array.isArray(fm.sources) ? fm.sources.length : 0;
    const meta = [fm.status, fm.last_reviewed && `reviewed ${fm.last_reviewed}`, n && `${n} source${n === 1 ? "" : "s"}`].filter(Boolean).join(" · ");
    const see = [...(fm.related || []), ...(fm.practices || [])].map((id) => {
      if (!ids[id]) throw new Error(`${pageData.filePath}: related practice "${id}" is not a practice id`);
      return { text: titleOf(join(ROOT, ids[id])), link: linkOf(ids[id]) };
    });
    return { handbook: { meta, seeAlso: see } };
  },
  themeConfig: {
    nav: [
      { text: "Learning path", link: "/learning-path/" },
      { text: "Practices", link: "/practices/" },
      { text: "Playbooks", link: "/how-to/" },
      { text: "Sources", link: "/sources" },
    ],
    sidebar: buildSidebar(ROOT),
    outline: { level: [2, 3], label: "On this page" },
    socialLinks: [{ icon: "github", link: REPO }],
    editLink: { pattern: `${REPO}/edit/main/:path`, text: "Edit this page on GitHub" },
    docFooter: { prev: "Previous", next: "Next" },
    search: {
      provider: "local",
      options: {
        // the register and the digests stay out of the index
        _render(src, env, md) {
          const html = md.render(src, env);
          if (env.frontmatter?.search === false) return "";
          if (env.relativePath === "sources.md" || env.relativePath.startsWith("digests/")) return "";
          return html;
        },
      },
    },
  },
});
