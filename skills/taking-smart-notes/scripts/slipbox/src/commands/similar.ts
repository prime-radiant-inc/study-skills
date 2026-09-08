import { discoverSlipbox } from "../discovery";
import { cosine, loadOrBuildIndex } from "../embedding/index_loader";
import { loadZettel } from "../zettel";
import { register } from "./index";

interface SimilarArgs {
  slug?: string;
  limit: number;
  minScore: number;
  json: boolean;
}

function parseArgs(args: string[]): SimilarArgs {
  const out: SimilarArgs = { limit: 10, minScore: 0.3, json: false };
  for (const a of args) {
    if (a.startsWith("--limit=")) out.limit = Number(a.slice("--limit=".length));
    else if (a.startsWith("--min-score=")) out.minScore = Number(a.slice("--min-score=".length));
    else if (a === "--json") out.json = true;
    else if (!a.startsWith("--") && !out.slug) out.slug = a;
  }
  return out;
}

register("similar", async (args) => {
  const opts = parseArgs(args);
  if (!opts.slug) {
    console.error("slipbox similar: requires <slug>");
    return 2;
  }
  const sb = discoverSlipbox(process.cwd());
  const z = loadZettel(sb, opts.slug);
  const linkedSet = new Set(z.frontmatter.links);
  linkedSet.add(opts.slug);
  const idx = await loadOrBuildIndex(sb);
  const queryIdx = idx.slugs.indexOf(opts.slug);
  if (queryIdx === -1) {
    console.error(`slipbox similar: zettel ${opts.slug} not in index`);
    return 1;
  }
  const queryVec = idx.vectors[queryIdx];
  if (!queryVec) {
    console.error(`slipbox similar: ${opts.slug} has no embedding`);
    return 1;
  }
  const scored: { slug: string; score: number }[] = [];
  for (let i = 0; i < idx.slugs.length; i++) {
    const slug = idx.slugs[i];
    if (!slug || linkedSet.has(slug)) continue;
    const vec = idx.vectors[i];
    if (!vec || vec.length === 0) continue;
    const score = cosine(queryVec, vec);
    if (score >= opts.minScore) scored.push({ slug, score });
  }
  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, opts.limit);
  if (opts.json) {
    console.log(JSON.stringify(top, null, 2));
  } else {
    for (const { slug, score } of top) {
      console.log(`${score.toFixed(2)} ${slug}`);
    }
  }
  return 0;
});
