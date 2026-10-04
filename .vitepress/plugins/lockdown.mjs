// The book uses plain Markdown only. Everything else VitePress adds to Markdown is switched off,
// because each has emitted raw HTML or Vue template code that page content controls (adversarial
// re-test of the 2026-10-04 security review): images, custom containers (the code-group tab label is
// emitted raw), snippet imports (`<<< /abs/path` embedded a file from outside the repository), and
// Vue itself (any `{{ }}` or directive a plugin lets through). `markdown.attrs` and `gfmAlerts`
// are disabled in config.mjs; FRONTMATTER_KEYS (plus `editLink: false`, which the generated part
// pages set) is enforced in transformPageData.
export const FRONTMATTER_KEYS = ["id", "title", "area", "status", "last_reviewed", "sources", "related", "practices", "anonymisation", "search"];

// a fence's info string is a plain language name: VitePress writes the language into the page as
// raw HTML (round-two re-test: a fence "language" of `<b></b>` became an element, a script ran)
export const FENCE_INFO = /^[A-Za-z0-9_+#.-]*$/;
// checks on the page source, before VitePress expands includes (run from gen.mjs on every page)
// VitePress expands `<!--@include: path-->` (its own pattern, with the colon) before rendering, and
// gray-matter picks an engine from the opening delimiter: `---js` runs the frontmatter through eval
// (round-three re-test: it read a file from outside the repository into the page)
export function lintSource(text, file) {
  if (/<!--\s*@include:/i.test(text)) throw new Error(`${file}: an @include directive is not allowed (it can read files outside the page)`);
  if (/^\uFEFF?---[^\S\r\n]*\S/.test(text)) throw new Error(`${file}: frontmatter must open with a plain --- line (no engine such as ---js or ---json)`);
}
// gray-matter engines other than the flat reader: each one throws, so no delimiter can select eval
export const NO_ENGINE = () => { throw new Error("frontmatter: only plain --- frontmatter is allowed"); };
export const BLOCKED_ENGINES = Object.fromEntries(["js", "javascript", "json", "coffee", "coffeescript", "cson", "toml"].map((k) => [k, NO_ENGINE]));

// throws on any frontmatter key the book does not use (`editLink: false` is the one extra)
const STRING_KEYS = ["id", "title", "area", "status", "last_reviewed", "anonymisation"];
const LIST_KEYS = ["sources", "related", "practices"];
export function checkFrontmatter(fm, file) {
  for (const k of STRING_KEYS) if (fm?.[k] !== undefined && typeof fm[k] !== "string") throw new Error(`${file}: frontmatter ${k} must be text`);
  for (const k of LIST_KEYS) if (fm?.[k] !== undefined && !(Array.isArray(fm[k]) && fm[k].every((v) => typeof v === "string"))) throw new Error(`${file}: frontmatter ${k} must be a list of ids`);
  if (fm?.search !== undefined && typeof fm.search !== "boolean") throw new Error(`${file}: frontmatter search must be true or false`);
  const unknown = Object.keys(fm || {}).filter((k) => !FRONTMATTER_KEYS.includes(k) && !(k === "editLink" && fm[k] === false));
  if (/[<>]/.test(String(fm?.title ?? ""))) throw new Error(`${file}: frontmatter title may not contain < or >`);
  if (unknown.length) throw new Error(`${file}: frontmatter key(s) not allowed: ${unknown.join(", ")} (allowed: ${FRONTMATTER_KEYS.join(", ")}, and editLink: false)`);
}

export default function lockdownPlugin(md) {
  md.core.ruler.push("hb_fence_info", (state) => {
    for (const tok of state.tokens) {
      if (tok.type === "fence" && !FENCE_INFO.test(tok.info.trim())) {
        throw new Error(`${state.env?.relativePath || "page"}: code fence info "${tok.info.trim().slice(0, 60)}" is not a plain language name`);
      }
    }
  });
  // no Markdown images: Vite bundles an image src as an asset, even from outside the repository
  // (round-three re-test); the book has none
  md.inline.ruler.disable(["image"]);
  const blockRules = md.block.ruler.__rules__.map((r) => r.name);
  md.block.ruler.disable(blockRules.filter((n) => n === "snippet" || n.startsWith("container_")));
  // every page's content inside v-pre: Vue compiles no interpolation, directive or component in it
  const render = md.render.bind(md);
  md.render = (src, env) => `<div class="hb-content" v-pre>${render(src, env)}</div>`;
}
