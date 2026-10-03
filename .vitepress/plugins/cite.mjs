// [S051] in text -> <a class="cite" href="<base>sources#s051" aria-label="Source S051: title" data-tip>.
// Code spans, fences and text inside an existing link are left alone. An id missing from the
// register throws. On sources.md each register row gets id="sNNN" so the anchors resolve.
const CITE = /\[(S\d{3})\]/g;
const HAS = /\[S\d{3}\]/;
const PLACEHOLDER = /^\[S0nn\]$/;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function citeAnchor(id, src, base = "/") {
  const tip = [src.title, [src.publisher, src.date].filter(Boolean).join(", ")].filter(Boolean).join(". ");
  return `<a class="cite" href="${base}sources#${id.toLowerCase()}" aria-label="${esc(`Source ${id}: ${src.title}`)}" data-tip="${esc(tip)}">${id}</a>`;
}

export default function citePlugin(md, { sources, base = "/", registerPage = "sources.md" }) {
  md.core.ruler.after("text_join", "cite", (state) => {
    const page = state.env?.relativePath || "";
    for (let i = 0; i < state.tokens.length; i++) {
      const tok = state.tokens[i];
      if (page === registerPage && tok.type === "tr_open") {
        const cell = state.tokens[i + 2];
        const m = cell && cell.type === "inline" && cell.content.trim().match(/^S\d{3}$/);
        if (m) tok.attrSet("id", m[0].toLowerCase());
      }
      if (tok.type !== "inline" || !tok.children) continue;
      // the placeholder `[S0nn]` (any source id) links to the register; on the register, to its first row
      for (const child of tok.children) {
        if (child.type !== "code_inline" || !PLACEHOLDER.test(child.content)) continue;
        child.type = "html_inline";
        child.content = `<a class="cite-ref" href="${base}sources${page === registerPage ? "#s001" : ""}" aria-label="A source id: every one is listed in the sources register"><code>${esc(child.content)}</code></a>`;
      }
      const kids = [];
      let inLink = 0;
      for (const child of tok.children) {
        if (child.type === "link_open") inLink++;
        if (child.type === "link_close") inLink--;
        if (child.type !== "text" || inLink || !HAS.test(child.content)) { kids.push(child); continue; }
        let last = 0;
        for (const m of child.content.matchAll(CITE)) {
          const src = sources[m[1]];
          if (!src) throw new Error(`cite: unknown source id ${m[1]} in ${page || "(unknown page)"}; add it to sources.md`);
          if (m.index > last) kids.push(text(state, child.content.slice(last, m.index)));
          const a = new state.Token("html_inline", "", 0);
          a.content = citeAnchor(m[1], src, base);
          kids.push(a);
          last = m.index + m[0].length;
        }
        if (last < child.content.length) kids.push(text(state, child.content.slice(last)));
      }
      tok.children = kids;
    }
  });
}

function text(state, content) {
  const t = new state.Token("text", "", 0);
  t.content = content;
  return t;
}
