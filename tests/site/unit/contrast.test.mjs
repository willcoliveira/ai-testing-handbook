// Every grey token meets 4.5:1 on the backgrounds it sits on, light and dark.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./helpers.mjs";

const css = readFileSync(join(ROOT, ".vitepress/theme/style.css"), "utf8");
function tokens(selector) {
  const m = css.match(new RegExp(`(?:^|\\n)${selector.replace(".", "\\.")} \\{([^}]*)\\}`));
  assert.ok(m, `${selector} block`);
  return Object.fromEntries([...m[1].matchAll(/--hb-([a-z]+):\s*(#[0-9a-f]{6})/gi)].map((t) => [t[1], t[2]]));
}
const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
export const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

for (const [name, sel] of [["light", ":root"], ["dark", ".dark"]]) {
  test(`${name}: text and grey tokens >= 4.5:1`, () => {
    const t = tokens(sel);
    for (const k of ["bg", "fg", "muted", "rule", "soft"]) assert.ok(t[k], `--hb-${k} defined in ${sel}`);
    const pairs = [["fg", "bg"], ["muted", "bg"], ["fg", "soft"], ["muted", "soft"], ["rule", "bg"]];
    for (const [f, b] of pairs) {
      const r = ratio(t[f], t[b]);
      console.log(`${name} ${f} ${t[f]} on ${b} ${t[b]}: ${r.toFixed(2)}:1`);
      assert.ok(r >= 4.5, `${name} ${f} on ${b} is ${r.toFixed(2)}:1`);
    }
  });
}

test("negative: the ratio function rejects a low-contrast grey", () => {
  assert.ok(ratio("#999999", "#ffffff") < 4.5);
  assert.equal(ratio("#000000", "#ffffff").toFixed(0), "21");
});
