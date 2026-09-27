// Report-only. For each practice file, counts which organisations its "Who does it (sourced)"
// section names, and warns when fewer than three are named or one takes more than half the
// bullets. The vendor-balance rule in CONTRIBUTING.md is the reason.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
const root = process.cwd();
const VENDORS = {
  Anthropic: /anthropic|claude/i, OpenAI: /openai|gpt-/i, Google: /google|deepmind|gemini|gemma/i,
  Meta: /\bmeta\b|llama/i, DeepSeek: /deepseek/i, Alibaba: /alibaba|qwen/i, Mistral: /mistral/i,
  xAI: /\bxai\b|grok/i, Microsoft: /microsoft|azure|phi-/i, Amazon: /amazon|bedrock|\bnova\b/i,
  NVIDIA: /nvidia|nemo|nemotron/i, Moonshot: /moonshot|kimi/i, Zhipu: /zhipu|z\.ai|glm-/i,
  Cohere: /cohere/i, "Hugging Face": /hugging ?face/i, EleutherAI: /eleuther/i, AI2: /\bai2\b|allen institute|olmo/i,
  METR: /\bmetr\b/i, AISI: /\baisi\b|security institute/i, MLCommons: /mlcommons/i, NIST: /\bnist\b/i, OWASP: /owasp/i,
};
function walk(dir, out = []) {
  for (const n of readdirSync(dir)) { const p = join(dir, n); statSync(p).isDirectory() ? walk(p, out) : (n.endsWith(".md") && !n.startsWith("_") && out.push(p)); }
  return out;
}
let warned = 0;
for (const f of walk(join(root, "practices"))) {
  const text = readFileSync(f, "utf8");
  const a = text.indexOf("## Who does it (sourced)"); const b = text.indexOf("## Pitfalls");
  if (a < 0 || b < 0) continue;
  const bullets = text.slice(a, b).split("\n").filter((l) => l.trim().startsWith("-"));
  const counts = {};
  for (const l of bullets) for (const [v, re] of Object.entries(VENDORS)) if (re.test(l)) counts[v] = (counts[v] || 0) + 1;
  const named = Object.keys(counts); const total = bullets.length;
  const top = Math.max(0, ...Object.values(counts));
  const flags = [];
  if (named.length < 3) flags.push(`only ${named.length} organisation(s) named`);
  if (total && top / total > 0.5 && named.length >= 2) flags.push(`one organisation in ${top}/${total} bullets`);
  const line = `${relative(root, f)}: ${total} bullets, ${named.length} orgs [${named.join(", ")}]`;
  if (flags.length) { warned++; console.log(`WARN ${line}: ${flags.join("; ")}`); } else console.log(`ok   ${line}`);
}
console.log(`${warned} practice files below the vendor-balance guideline (report only)`);
