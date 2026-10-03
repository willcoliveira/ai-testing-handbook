import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { frontmatter, parseTaxonomy, parseSources } from "../../../.vitepress/read.mjs";
import { ROOT } from "./helpers.mjs";

// A Windows checkout or editor can turn LF into CRLF; parsers must give the same result.
const crlf = (s) => s.replace(/\n/g, "\r\n");
const read = (p) => readFileSync(join(ROOT, p), "utf8");

test("CRLF: frontmatter parses the same", () => {
  const text = read("practices/3-judging/judge-calibration.md");
  assert.deepEqual(frontmatter(crlf(text)), frontmatter(text));
  assert.equal(frontmatter(crlf(text)).id, "judge-calibration");
});

test("CRLF: TAXONOMY parses the same", () => {
  const text = read("TAXONOMY.md");
  assert.deepEqual(parseTaxonomy(crlf(text)), parseTaxonomy(text));
});

test("CRLF: the sources register parses the same", () => {
  const text = read("sources.md");
  assert.deepEqual(parseSources(crlf(text)), parseSources(text));
});
