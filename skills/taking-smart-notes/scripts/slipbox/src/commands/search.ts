import { $ } from "bun";
import { discoverSlipbox } from "../discovery";
import { cosine, loadOrBuildIndex } from "../embedding/index_loader";
import { embedTexts } from "../embedding/model";
import { register } from "./index";

interface SearchArgs {
  query?: string;
  semantic: boolean;
  limit: number;
  json: boolean;
}

function parseArgs(args: string[]): SearchArgs {
  const out: SearchArgs = { semantic: false, limit: 10, json: false };
  for (const a of args) {
    if (a === "--semantic") out.semantic = true;
    else if (a === "--json") out.json = true;
    else if (a.startsWith("--limit=")) out.limit = Number(a.slice("--limit=".length));
    else if (!a.startsWith("--") && !out.query) out.query = a;
  }
  return out;
}

async function semanticSearch(query: string, limit: number, json: boolean): Promise<number> {
  const sb = discoverSlipbox(process.cwd());
  const idx = await loadOrBuildIndex(sb);
  const [qvec] = await embedTexts([query]);
  if (!qvec) {
    console.error("slipbox search: failed to embed query");
    return 1;
  }
  const scored: { slug: string; score: number }[] = [];
  for (let i = 0; i < idx.slugs.length; i++) {
    const slug = idx.slugs[i];
    const vec = idx.vectors[i];
    if (!slug || !vec || vec.length === 0) continue;
    scored.push({ slug, score: cosine(qvec, vec) });
  }
  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, limit);
  if (json) console.log(JSON.stringify(top, null, 2));
  else for (const { slug, score } of top) console.log(`${score.toFixed(2)} ${slug}`);
  return 0;
}

async function fullTextSearch(query: string, json: boolean): Promise<number> {
  const sb = discoverSlipbox(process.cwd());
  const hasRg = await $`which rg`
    .quiet()
    .nothrow()
    .then((r) => r.exitCode === 0);
  const res = await (hasRg
    ? $`rg -n --no-heading -i ${query} ${sb.zettelDir} ${sb.sourcesDir}`.nothrow()
    : $`grep -rni ${query} ${sb.zettelDir} ${sb.sourcesDir}`.nothrow());
  const text = res.stdout.toString();
  if (json) {
    const lines = text
      .split("\n")
      .filter((l) => l.length > 0)
      .map((l) => {
        const m = l.match(/^([^:]+):(\d+):(.*)$/);
        return m ? { file: m[1], line: Number.parseInt(m[2] as string, 10), match: m[3] } : null;
      })
      .filter((x) => x !== null);
    console.log(JSON.stringify(lines, null, 2));
  } else {
    process.stdout.write(text);
  }
  return res.exitCode === 1 ? 0 : res.exitCode;
}

register("search", async (args) => {
  const opts = parseArgs(args);
  if (!opts.query) {
    console.error("slipbox search: requires <query>");
    return 2;
  }
  return opts.semantic
    ? semanticSearch(opts.query, opts.limit, opts.json)
    : fullTextSearch(opts.query, opts.json);
});
