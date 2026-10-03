import { test } from "node:test";
import assert from "node:assert/strict";
import { createMarkdownRenderer } from "vitepress";
import citePlugin from "../../../.vitepress/plugins/cite.mjs";

const sources = {
  S051: { title: "Judging LLM-as-a-judge", publisher: "Zheng et al.", date: "2023-06-09", url: "https://x" },
  S055: { title: "Graders", publisher: "OpenAI", date: "living", url: "https://x" },
  S061: { title: "Create strong empirical evaluations", publisher: "Anthropic", date: "living", url: "https://x" },
  S096: { title: "RSP", publisher: "Anthropic", date: "2026-07", url: "https://x" },
  S097: { title: "Risk \"report\" <v2>", publisher: "Anthropic", date: "2026-07", url: "https://x" },
};
const md = await createMarkdownRenderer(process.cwd(), { html: false, config: (m) => m.use(citePlugin, { sources, base: "/ai-testing-handbook/" }) }, "/ai-testing-handbook/");
const render = (src, relativePath = "practices/3-judging/x.md") => md.render(src, { relativePath });
const anchors = (html) => [...html.matchAll(/<a class="cite"[^>]*>(S\d{3})<\/a>/g)].map((m) => m[1]);

test("[S051] becomes a citation anchor with href, aria-label and data-tip", () => {
  const html = render("Agreement was 85% [S051].");
  assert.match(html, /<a class="cite" href="\/ai-testing-handbook\/sources#s051" aria-label="Source S051: Judging LLM-as-a-judge" data-tip="Judging LLM-as-a-judge. Zheng et al., 2023-06-09">S051<\/a>/);
});

test("adjacent [S096][S097] gives one anchor per id", () => {
  assert.deepEqual(anchors(render("Framework [S096][S097].")), ["S096", "S097"]);
});

test("space-separated [S061] [S055] gives one anchor per id, space kept", () => {
  const html = render("Code first [S061] [S055].");
  assert.deepEqual(anchors(html), ["S061", "S055"]);
  assert.match(html, /S061<\/a> <a class="cite"/);
});

test("titles are escaped in attributes", () => {
  assert.match(render("x [S097]"), /aria-label="Source S097: Risk &quot;report&quot; &lt;v2&gt;"/);
});

test("code spans, fences and existing link text are left alone", () => {
  assert.deepEqual(anchors(render("Use `[S051]` as the form.")), []);
  assert.deepEqual(anchors(render("```\n[S051]\n```\n")), []);
  const linked = render("See [[S051]](https://example.com/s051).");
  assert.deepEqual(anchors(linked), []);
  assert.match(linked, /<a href="https:\/\/example.com\/s051"[^>]*>\[S051\]<\/a>/);
});

test("negative: an unknown id [S999] throws naming S999 and the page", () => {
  assert.throws(() => render("Bad [S999].", "how-to/01-x.md"), /S999 in how-to\/01-x\.md/);
});

test("sources.md register rows get id=sNNN", () => {
  const table = "| id | title |\n|---|---|\n| S051 | Judging |\n| S055 | Graders |\n";
  const html = render(table, "sources.md");
  assert.match(html, /<tr id="s051">/);
  assert.match(html, /<tr id="s055">/);
  assert.doesNotMatch(render(table, "other.md"), /<tr id=/);
});

test("the `[S0nn]` placeholder links to the register, and to its first row on the register", () => {
  assert.match(render("Cite it as `[S0nn]`."), /<a class="cite-ref" href="\/ai-testing-handbook\/sources" aria-label="[^"]+"><code>\[S0nn\]<\/code><\/a>/);
  assert.match(render("Every `[S0nn]` resolves here.", "sources.md"), /<a class="cite-ref" href="\/ai-testing-handbook\/sources#s001"/);
  assert.doesNotMatch(render("`other code`"), /cite-ref/);
});
