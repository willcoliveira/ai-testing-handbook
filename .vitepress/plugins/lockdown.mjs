// The book uses plain Markdown only. Everything else VitePress adds to Markdown is switched off,
// because each has emitted raw HTML or Vue template code that page content controls (adversarial
// re-test of the 2026-10-04 security review): custom containers (the code-group tab label is
// emitted raw), snippet imports (`<<< /abs/path` embedded a file from outside the repository), and
// Vue itself (any `{{ }}` or directive a plugin lets through). `markdown.attrs` and `gfmAlerts`
// are disabled in config.mjs; FRONTMATTER_KEYS (plus `editLink: false`, which the generated part
// pages set) is enforced in transformPageData.
export const FRONTMATTER_KEYS = ["id", "title", "area", "status", "last_reviewed", "sources", "related", "practices", "anonymisation", "search"];

// throws on any frontmatter key the book does not use (`editLink: false` is the one extra)
export function checkFrontmatter(fm, file) {
  const unknown = Object.keys(fm || {}).filter((k) => !FRONTMATTER_KEYS.includes(k) && !(k === "editLink" && fm[k] === false));
  if (unknown.length) throw new Error(`${file}: frontmatter key(s) not allowed: ${unknown.join(", ")} (allowed: ${FRONTMATTER_KEYS.join(", ")}, and editLink: false)`);
}

export default function lockdownPlugin(md) {
  const blockRules = md.block.ruler.__rules__.map((r) => r.name);
  md.block.ruler.disable(blockRules.filter((n) => n === "snippet" || n.startsWith("container_")));
  // every page's content inside v-pre: Vue compiles no interpolation, directive or component in it
  const render = md.render.bind(md);
  md.render = (src, env) => `<div class="hb-content" v-pre>${render(src, env)}</div>`;
}
