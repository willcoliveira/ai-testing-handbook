// Checks the built site in .vitepress/dist. Every internal href and src resolves, every #fragment
// exists, every citation hits a register row, every page sits in the sidebar exactly once,
// nothing loads from a third-party host, search index and JS stay under budget, and the
// forbidden-strings check passes on the HTML. Exits 1 on any failure.
import { parse } from "parse5";
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
// Structural checks on the parsed page (parse5, so `<svg/onload=`, unquoted URLs or a `</span>` that
// closes a label early cannot slip past a regex; adversarial re-test of the 2026-10-04 security review).
// A page fails on: any `on*` attribute; a javascript: URL; an element that loads from another host;
// an iframe, object, embed, frame or meta refresh; markup inside a label VitePress renders with v-html.
const LOAD_ATTRS = ["src", "srcset", "href", "poster", "data", "action", "formaction", "xlink:href"];
const BANNED = new Set(["iframe", "object", "embed", "frame", "frameset", "applet", "base"]);
const LABEL_TAGS = new Set(["p", "span", "h2", "h3", "label", "summary"]);
// inside page content, only the tags plain Markdown and VitePress code blocks produce (round-two
// re-test: a fence language emitted <script> into the content and nothing flagged it)
const CONTENT_TAGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6", "p", "a", "em", "strong", "del", "s", "code", "pre", "span", "div", "button",
  "ul", "ol", "li", "table", "thead", "tbody", "tr", "th", "td", "blockquote", "hr", "br", "img", "sup", "sub"]);
// a URL with any scheme (http:, data:, javascript:, ...) or a protocol-relative one
const EXTERNAL = /^\s*([a-z][a-z0-9+.-]*:|\/\/)/i;
const LABEL_CLASSES = /(^|\s)(text|title|custom-block-title)(\s|$)/;
export function domErrors(html) {
  const out = [];
  const walk = (node, inContent = false) => {
    if (node.tagName) {
      const tag = node.tagName;
      if (inContent && !CONTENT_TAGS.has(tag)) out.push(`<${tag}> is not allowed in page content`);
      const attrs = Object.fromEntries((node.attrs || []).map((a) => [a.name, a.value]));
      for (const name of Object.keys(attrs)) {
        if (/^on/i.test(name)) out.push(`inline event handler ${name} on <${tag}>`);
        // browsers drop tabs, newlines and control characters inside a URL scheme
        const bare = String(attrs[name]).replace(/[\u0000-\u0020]/g, "");
        if (LOAD_ATTRS.includes(name) && /^(javascript|vbscript|data):/i.test(bare)) out.push(`${bare.split(":")[0]}: URL in ${name} on <${tag}>`);
        if (name === "style" && /url\(\s*['"]?\s*([a-z][a-z0-9+.-]*:|\/\/)/i.test(attrs[name])) out.push(`style attribute loads a URL on <${tag}>`);
      }
      if (BANNED.has(tag)) out.push(`<${tag}> is not allowed`);
      if (attrs.target === "_blank" && !/\b(noopener|noreferrer)\b/.test(attrs.rel || "")) out.push(`<${tag} target=_blank> without rel=noopener or noreferrer`);
      if (tag === "meta" && /refresh/i.test(attrs["http-equiv"] || "")) out.push("meta refresh is not allowed");
      // anything but a link may only load from this site
      if (tag !== "a") {
        for (const name of LOAD_ATTRS) {
          const v = attrs[name];
          if (!v) continue;
          if (tag === "link" && name === "href" && !/(stylesheet|preload|modulepreload|icon|prefetch|manifest)/.test(attrs.rel || "")) continue;
          const urls = name === "srcset" ? v.split(",").map((s) => s.trim().split(/\s+/)[0]) : [v.trim()];
          for (const u of urls) if (EXTERNAL.test(u)) out.push(`<${tag}> loads from a third-party host: ${u}`);
        }
      }
      if (LABEL_TAGS.has(tag) && LABEL_CLASSES.test(attrs.class || "") && (node.childNodes || []).some((c) => c.nodeName !== "#text" && c.nodeName !== "#comment")) {
        out.push(`a sidebar, pager or block label contains markup: <${tag} class="${attrs.class}">`);
      }
    }
    const content = inContent || /(^|\s)hb-content(\s|$)/.test((node.attrs || []).find((a) => a.name === "class")?.value || "");
    for (const c of node.childNodes || []) walk(c, content);
    if (node.content) walk(node.content, content);
  };
  walk(parse(html));
  return out;
}

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
    for (const e of domErrors(text)) errors.push(`${here}: ${e}`);
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

  // only the files a VitePress build of this book produces; anything else was bundled from content
  // (round-three re-test: an image import copied a file from outside the repository into assets/)
  const ROOT_FILES = new Set(["vp-icons.css", "sitemap.xml", "hashmap.json"]);
  for (const f of files) {
    const rel = relative(dist, f).split("\\").join("/");
    const ok = rel.endsWith(".html") || ROOT_FILES.has(rel) || /^assets\/(chunks\/)?[\w.@-]+\.(js|css|woff2?)$/.test(rel);
    if (!ok) errors.push(`unexpected file in the built site: ${rel}`);
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
