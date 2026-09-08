import { discoverSlipbox } from "../discovery";
import { cosine, loadOrBuildIndex } from "../embedding/index_loader";
import { runJudge } from "../llm/judge";
import { loadZettel } from "../zettel";
import { register } from "./index";

interface Args {
  slug?: string;
  limit: number;
  candidateLimit: number;
  json: boolean;
}

function parseArgs(args: string[]): Args {
  const out: Args = { limit: 5, candidateLimit: 20, json: false };
  for (const a of args) {
    if (a.startsWith("--limit=")) out.limit = Number(a.slice("--limit=".length));
    else if (a.startsWith("--candidate-limit="))
      out.candidateLimit = Number(a.slice("--candidate-limit=".length));
    else if (a === "--json") out.json = true;
    else if (!a.startsWith("--") && !out.slug) out.slug = a;
  }
  return out;
}

function buildPrompt(
  sourceSlug: string,
  sourceBody: string,
  candidates: { slug: string; body: string; score: number }[],
): string {
  const parts = [
    "You are evaluating whether candidate zettels should be linked to a source zettel.",
    "Return a JSON array of objects {slug, llm_score, justification}, ranked by relevance.",
    "Only include candidates worth linking; omit weak ones.",
    "",
    `Source zettel (slug: ${sourceSlug}):`,
    sourceBody,
    "",
    "Candidates:",
  ];
  for (const c of candidates) {
    parts.push(`--- ${c.slug} (similarity ${c.score.toFixed(2)}) ---`);
    parts.push(c.body);
  }
  parts.push("");
  parts.push("Return ONLY a JSON array. No other text.");
  return parts.join("\n");
}

register("suggest-links", async (args) => {
  const opts = parseArgs(args);
  if (!opts.slug) {
    console.error("slipbox suggest-links: requires <slug>");
    return 2;
  }
  const sb = discoverSlipbox(process.cwd());
  const z = loadZettel(sb, opts.slug);
  const linked = new Set([opts.slug, ...z.frontmatter.links]);
  const idx = await loadOrBuildIndex(sb);
  const queryIdx = idx.slugs.indexOf(opts.slug);
  if (queryIdx === -1) {
    console.error(`slipbox suggest-links: ${opts.slug} not in index`);
    return 1;
  }
  const queryVec = idx.vectors[queryIdx];
  if (!queryVec) {
    console.error(`slipbox suggest-links: ${opts.slug} has no embedding`);
    return 1;
  }
  const scored: { slug: string; score: number }[] = [];
  for (let i = 0; i < idx.slugs.length; i++) {
    const slug = idx.slugs[i];
    const vec = idx.vectors[i];
    if (!slug || !vec || vec.length === 0 || linked.has(slug)) continue;
    scored.push({ slug, score: cosine(queryVec, vec) });
  }
  scored.sort((a, b) => b.score - a.score);
  const candidates = scored.slice(0, opts.candidateLimit).map((c) => ({
    slug: c.slug,
    score: c.score,
    body: loadZettel(sb, c.slug).body,
  }));
  const prompt = buildPrompt(opts.slug, z.body, candidates);
  const llmOut = await runJudge(prompt);
  let parsed: { slug: string; llm_score: number; justification: string }[];
  try {
    parsed = JSON.parse(llmOut);
  } catch {
    console.error("slipbox suggest-links: LLM did not return valid JSON");
    console.error(llmOut);
    return 1;
  }
  const top = parsed.slice(0, opts.limit).map((p) => {
    const c = candidates.find((x) => x.slug === p.slug);
    return { ...p, similarity: c?.score ?? 0 };
  });
  if (opts.json) console.log(JSON.stringify(top, null, 2));
  else {
    for (let i = 0; i < top.length; i++) {
      const t = top[i];
      if (!t) continue;
      console.log(
        `${i + 1}. ${t.slug} (similarity ${t.similarity.toFixed(2)}, llm ${t.llm_score.toFixed(2)})`,
      );
      console.log(`   ${t.justification}`);
    }
  }
  return 0;
});
