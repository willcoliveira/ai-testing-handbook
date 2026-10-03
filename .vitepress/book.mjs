// The one sidebar, in reading order. Prev/next follows it, so it is the book's spine.
// Practice order comes from TAXONOMY.md; a practice file not listed there throws.
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { titleOf, mdFiles, partDirs, parseTaxonomy, roman } from "./read.mjs";

// source path -> site path: README.md and _part.md are their folder
export function linkOf(rel) {
  const m = rel.match(/^(.*?)(?:^|\/)(README|_part)\.md$/);
  if (m) return "/" + (m[1] ? m[1] + "/" : "");
  return "/" + rel.replace(/\.md$/, "");
}

// Sidebar and prev/next labels stay within two lines: a title over 46 characters loses its
// parenthetical detail, then its subtitle after ": ", then its last ", " clause. The page H1 keeps
// the full title; style.css clamps anything still longer to two lines.
export function shortLabel(t, max = 46) {
  if (t.length <= max) return t;
  let s = t.replace(/\s*\(([^()]*)\)/, (m, inner) => (inner.includes(": ") ? ` (${inner.split(": ")[0]})` : m));
  if (s.length > max) s = s.replace(/\s*\([^()]*\)/, "");
  const c = s.indexOf(": ");
  if (s.length > max && c >= 12) s = s.slice(0, c);
  const k = s.lastIndexOf(", ");
  if (s.length > max && k >= 12) s = s.slice(0, k);
  return s;
}

const LEARNING_TAIL = ["knowledge-matrix.md", "interview-questions.md", "ai-qa-requirements.md", "resources.md"];
const APPENDICES = [["Labs", "labs"], ["Tools", "tools"], ["Benchmarks", "benchmarks"], ["Datasets", "datasets"], ["Training", "training"]];

export function buildSidebar(root) {
  const page = (rel, text) => {
    if (!existsSync(join(root, rel))) throw new Error(`book: ${rel} does not exist`);
    return { text: text || shortLabel(titleOf(join(root, rel))), link: linkOf(rel) };
  };
  // a folder: README first, then its files (by name unless order is given)
  const folder = (text, dir, opts = {}) => {
    const files = mdFiles(join(root, dir)).filter((f) => f !== "README.md" && !(opts.skip || []).includes(f));
    const g = { text, link: linkOf(`${dir}/README.md`), collapsed: opts.collapsed ?? true, items: files.map((f) => page(`${dir}/${f}`)) };
    if (!existsSync(join(root, dir, "README.md"))) throw new Error(`book: ${dir}/README.md does not exist`);
    if (!g.items.length) { delete g.items; delete g.collapsed; }
    return g;
  };

  const lp = mdFiles(join(root, "learning-path")).filter((f) => f !== "README.md");
  const phases = lp.filter((f) => /^\d-/.test(f));
  const extra = lp.filter((f) => !phases.includes(f) && !LEARNING_TAIL.includes(f));
  if (extra.length) throw new Error(`book: learning-path/${extra[0]} has no place in the reading order (add it to LEARNING_TAIL in .vitepress/book.mjs)`);

  const areas = parseTaxonomy(readFileSync(join(root, "TAXONOMY.md"), "utf8"));
  const parts = partDirs(root).map((dir) => {
    const n = parseInt(dir);
    const area = areas.find((a) => a.n === n);
    if (!area) throw new Error(`book: practices/${dir} has no area ${n} in TAXONOMY.md`);
    const listed = area.practices.filter((p) => p.startsWith(`practices/${dir}/`));
    for (const f of mdFiles(join(root, "practices", dir))) {
      if (!listed.includes(`practices/${dir}/${f}`)) throw new Error(`book: practices/${dir}/${f} is not listed in TAXONOMY.md`);
    }
    return { text: `Part ${roman(n)}. ${area.name}`, link: `/practices/${dir}/`, collapsed: true, items: listed.map((p) => page(p)) };
  });

  const digests = mdFiles(join(root, "digests")).filter((f) => f !== "README.md" && !f.endsWith(".draft.md"));

  return [
    page("README.md", "Introduction"),
    { text: "Learning path", link: "/learning-path/", collapsed: false,
      items: [...phases, ...LEARNING_TAIL.filter((f) => lp.includes(f))].map((f) => page(`learning-path/${f}`)) },
    page("TAXONOMY.md", "Taxonomy"),
    { text: "Practices", link: "/practices/", collapsed: false, items: parts },
    folder("Playbooks", "how-to", { collapsed: true }),
    { text: "Patterns", link: "/patterns/", collapsed: true, items: mdFiles(join(root, "patterns")).map((f) => page(`patterns/${f}`)) },
    { text: "Appendices", collapsed: false, items: [
      ...APPENDICES.map(([t, d]) => folder(t, d)),
      page("GLOSSARY.md", "Glossary"),
      page("sources.md", "Sources register"),
    ] },
    { text: "About", collapsed: false, items: [
      page("ROADMAP.md", "Roadmap"),
      page("CHANGELOG.md", "Changelog"),
      { text: "Digests", link: "/digests/", collapsed: true, items: digests.map((f) => page(`digests/${f}`)) },
      page("PRIVACY.md", "Privacy"),
      page("CONTRIBUTING.md", "Contributing"),
      page("MAINTAINING.md", "Maintaining"),
    ] },
  ];
}

// every link in sidebar order, the sequence prev/next walks
export function flatten(items, out = []) {
  for (const it of items) {
    if (it.link) out.push(it.link);
    if (it.items) flatten(it.items, out);
  }
  return out;
}
