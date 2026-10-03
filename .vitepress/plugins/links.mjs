// Relative links as GitHub reads them, made to work on the site:
// x/README.md (and x/_part.md, x/) -> /x/, keeping #fragments; a file in the repo that is not
// a site page (LICENSE, .claude/...) -> its GitHub blob url. Anything else is left for
// VitePress, whose dead-link check stays strict.
import { existsSync, statSync, realpathSync } from "node:fs";
import { join, relative, posix } from "node:path";

export const REPO = "https://github.com/willcoliveira/ai-testing-handbook";

export function globToRe(glob) {
  const s = glob.replace(/[.+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*\//g, "\0").replace(/\*\*/g, "\x01").replace(/\*/g, "[^/]*")
    .replace(/\0/g, "(?:.*/)?").replace(/\x01/g, ".*");
  return new RegExp(`^${s}$`);
}

export function pageTest(root, exclude = []) {
  const res = exclude.map(globToRe);
  return (rel) => rel.endsWith(".md") && !res.some((r) => r.test(rel)) && existsSync(join(root, rel));
}

// returns the new href, or null to leave it alone
export function resolveHref(href, from, { root, isPage, repo = REPO }) {
  if (/^([a-z][a-z0-9+.-]*:|#|\/)/i.test(href)) return null;
  const [path, ...rest] = href.split("#");
  const hash = rest.length ? "#" + rest.join("#") : "";
  let target = posix.normalize(posix.join(posix.dirname(from), decodeURI(path)));
  if (target.startsWith("..")) return null;
  const abs = join(root, target);
  const isDir = path.endsWith("/") || path === "" || (existsSync(abs) && statSync(abs).isDirectory());
  const dir = isDir ? target.replace(/\/$/, "") : posix.dirname(target);
  const folderUrl = "/" + (dir === "." ? "" : dir + "/") + hash;
  if (isDir) {
    if (isPage(posix.join(dir, "README.md")) || isPage(posix.join(dir, "_part.md"))) return folderUrl;
    return existsSync(abs) ? `${repo}/tree/main/${target.replace(/\/$/, "")}` : null;
  }
  const name = posix.basename(target);
  if ((name === "README.md" || name === "_part.md") && isPage(target)) return folderUrl;
  if (existsSync(abs) && !isPage(target)) return `${repo}/blob/main/${target}${hash}`;
  return null;
}

export default function linksPlugin(md, { root, exclude = [], isPage = pageTest(root, exclude), repo = REPO }) {
  const realRoot = realpathSync(root);
  md.core.ruler.push("handbook_links", (state) => {
    const env = state.env || {};
    const from = env.realPath ? relative(realRoot, realpathSync(env.realPath)).split("\\").join("/") : env.relativePath || "index.md";
    for (const tok of state.tokens) {
      if (tok.type !== "inline" || !tok.children) continue;
      for (const child of tok.children) {
        if (child.type !== "link_open") continue;
        const href = child.attrGet("href");
        const next = href && resolveHref(href, from, { root, isPage, repo });
        if (next) child.attrSet("href", next);
      }
    }
  });
}
