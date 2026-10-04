// VitePress compiles every page as a Vue template, and `markdown.html: false` does not stop
// interpolation: `{{ 7*7 }}` in a paragraph, a table cell or inline code renders as 49, and an
// expression can reach the Function constructor in the browser and in Node during the build.
// Vue only recognises a literal `{{`, so every brace in text and inline code is emitted as an HTML
// entity. Done in the renderer, not per token: markdown can split `{{ 7*7 }}` across emphasis tokens.
// Fenced code already carries v-pre in VitePress.
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
export const braces = (s) => s.replace(/\{/g, "&#123;").replace(/\}/g, "&#125;");

export default function vueSafePlugin(md) {
  md.renderer.rules.text = (tokens, idx) => braces(esc(tokens[idx].content));
  md.renderer.rules.code_inline = (tokens, idx, options, env, self) =>
    `<code${self.renderAttrs(tokens[idx])}>${braces(esc(tokens[idx].content))}</code>`;
}
