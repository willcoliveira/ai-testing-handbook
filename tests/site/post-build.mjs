// Checks the built site in .vitepress/dist. Every internal href and src resolves, every #fragment
// exists, every citation hits a register row, every page sits in the sidebar exactly once,
// nothing loads from a third-party host, search index and JS stay under budget, and the
// forbidden-strings check passes on the HTML. Exits 1 on any failure.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, dirname, posix } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export const BUDGETS = {
  SEARCH_INDEX_MAX_BYTES: 3 * 1024 * 1024, // largest local search index file
  JS_MAX_BYTES: 2 * 1024 * 1024, // all JS that is not a page's own content chunk or the search index
  PAGE_CHUNK_MAX_BYTES: 512 * 1024, // one page's content chunk (*.md.*.js)
};

function walk(dir, out = []) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    statSync(p).isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
}
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

// site path (under base) -> file in dist, or null
function fileFor(dist, path) {
  const p = decodeURIComponent(path).replace(/^\//, "");
  const tries = p === "" || p.endsWith("/") ? [p + "index.html"] : [p, p + ".html", p + "/index.html"];
  for (const t of tries) if (existsSync(join(dist, t)) && statSync(join(dist, t)).isFile()) return join(dist, t);
  return null;
}

function sidebarLinks(items, out = []) {
  for (const it of items) {
    if (it.link) out.push(it.link);
    if (it.items) sidebarLinks(it.items, out);
  }
  return out;
}

// A SITE_TEST=1 build (visual tests) adds the type specimen, which is deliberately outside the book.
export const SPECIMEN_PAGE = "specimen.html";

export function check({ dist, base = "/ai-testing-handbook/", sidebar, budgets = BUDGETS, forbidden = true, root = process.cwd(), siteTest = false }) {
  const errors = [];
  const files = walk(dist);
  const html = files.filter((f) => f.endsWith(".html"));
  const ids = new Map();
  const idsOf = (file) => {
    if (!ids.has(file)) ids.set(file, new Set([...readFileSync(file, "utf8").matchAll(/\sid="([^"]+)"/g)].map((m) => decode(m[1]))));
    return ids.get(file);
  };
  const page = (f) => "/" + relative(dist, f).split("\\").join("/");
  let cites = 0;

  for (const f of html) {
    const text = readFileSync(f, "utf8");
    const here = page(f);
    // third-party hosts for anything the page loads
    for (const m of text.matchAll(/<(script|link|img|source|iframe|video|audio)\b[^>]*?\s(src|href)="([^"]*)"[^>]*>/g)) {
      const [tag, kind, attr, url] = [m[0], m[1], m[2], m[3]];
      if (kind === "link" && attr === "href" && !/rel="(stylesheet|preload|modulepreload|icon|prefetch|manifest)"/.test(tag)) continue;
      if (/^(https?:)?\/\//.test(url)) errors.push(`${here}: <${kind}> loads from a third-party host: ${url}`);
    }
    // labels VitePress renders with v-html (sidebar, prev/next) must be text, and no tag may carry
    // an inline event handler: either would mean a title or a page injected markup
    for (const m of text.matchAll(/<(p|span) class="(?:text|title)"[^>]*>([\s\S]*?)<\/\1>/g)) {
      if (/<[a-z!/]/i.test(m[2])) errors.push(`${here}: a sidebar or pager label contains markup: ${m[2].slice(0, 80)}`);
    }
    for (const m of text.matchAll(/<[a-z][a-z0-9-]*\b[^>]*?\son[a-z]+\s*=/gi)) errors.push(`${here}: inline event handler in ${m[0].slice(0, 80)}`);
    for (const m of text.matchAll(/<a\b([^>]*)>/g)) {
      const attrs = m[1];
      const hm = attrs.match(/\shref="([^"]*)"/);
      if (!hm) continue;
      const href = decode(hm[1]);
      if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith("//")) continue;
      const [path, frag = ""] = href.split("#");
      let target = f;
      if (path) {
        const abs = path.startsWith("/") ? path : posix.join(posix.dirname(here.replace(/^\//, base)), path);
        if (!abs.startsWith(base)) { errors.push(`${here}: href outside the base path: ${href}`); continue; }
        target = fileFor(dist, abs.slice(base.length - 1).split("?")[0]);
        if (!target) { errors.push(`${here}: dead internal href ${href}`); continue; }
      }
      if (frag && target.endsWith(".html") && !idsOf(target).has(decodeURIComponent(frag))) errors.push(`${here}: missing fragment ${href}`);
      if (/\sclass="cite"/.test(attrs)) {
        cites++;
        if (!/^\S*sources#s\d{3}$/.test(href) || !target.endsWith("sources.html")) errors.push(`${here}: citation does not point at a register row: ${href}`);
      }
    }
  }

  // no third-party url() or @import in built CSS
  for (const f of files.filter((x) => x.endsWith(".css"))) {
    for (const m of readFileSync(f, "utf8").matchAll(/(?:url\(\s*["']?|@import\s+["'])((?:https?:)?\/\/[^"')\s]+)/g)) errors.push(`${page(f)}: CSS loads from a third-party host: ${m[1]}`);
  }

  // every content page in the sidebar exactly once, every sidebar link a page
  if (sidebar) {
    const links = sidebarLinks(sidebar);
    const seen = new Map();
    for (const l of links) {
      const file = fileFor(dist, l);
      if (!file) { errors.push(`sidebar: ${l} has no built page`); continue; }
      seen.set(file, (seen.get(file) || 0) + 1);
    }
    for (const f of html) {
      if (relative(dist, f) === "404.html") continue;
      if (siteTest && relative(dist, f) === SPECIMEN_PAGE) continue;
      const n = seen.get(f) || 0;
      if (n !== 1) errors.push(`sidebar: ${page(f)} appears ${n} times (expected exactly once)`);
    }
  }

  // budgets
  const js = files.filter((f) => f.endsWith(".js"));
  const isIndex = (f) => /@localSearchIndex/.test(f);
  const isPage = (f) => /\.md\.[\w-]+(\.lean)?\.js$/.test(f);
  const size = (f) => statSync(f).size;
  const report = { searchIndex: 0, js: 0, largestPage: 0, totalJs: 0 };
  for (const f of js) {
    report.totalJs += size(f);
    if (isIndex(f)) report.searchIndex = Math.max(report.searchIndex, size(f));
    else if (isPage(f)) report.largestPage = Math.max(report.largestPage, size(f));
    else report.js += size(f);
  }
  if (report.searchIndex > budgets.SEARCH_INDEX_MAX_BYTES) errors.push(`budget: search index ${report.searchIndex} B > ${budgets.SEARCH_INDEX_MAX_BYTES} B`);
  if (report.js > budgets.JS_MAX_BYTES) errors.push(`budget: JS ${report.js} B > ${budgets.JS_MAX_BYTES} B`);
  if (report.largestPage > budgets.PAGE_CHUNK_MAX_BYTES) errors.push(`budget: page chunk ${report.largestPage} B > ${budgets.PAGE_CHUNK_MAX_BYTES} B`);

  if (forbidden) {
    const r = spawnSync(process.execPath, ["scripts/check-forbidden.mjs", "--dir", relative(root, dist) || "."], { cwd: root, encoding: "utf8" });
    if (r.status !== 0) errors.push(`forbidden strings in the built site:\n${(r.stdout + r.stderr).trim()}`);
  }
  return { errors, pages: html.length, cites, report };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
  const { buildSidebar } = await import("../../.vitepress/book.mjs");
  const dist = join(root, ".vitepress/dist");
  if (!existsSync(join(dist, "index.html"))) { console.error("post-build: no build in .vitepress/dist; run npm run docs:build"); process.exit(1); }
  const { errors, pages, cites, report } = check({ dist, sidebar: buildSidebar(root), root, siteTest: process.env.SITE_TEST === "1" });
  for (const e of errors) console.log(e);
  const kb = (b) => `${(b / 1024).toFixed(0)} KB`;
  console.log(`post-build: ${pages} pages, ${cites} citations; search index ${kb(report.searchIndex)}, JS ${kb(report.js)} (budget ${kb(BUDGETS.JS_MAX_BYTES)}), largest page chunk ${kb(report.largestPage)}, all JS incl. page content ${kb(report.totalJs)}; ${errors.length} problems`);
  process.exit(errors.length ? 1 : 0);
}
