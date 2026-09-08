import { existsSync } from "node:fs";
import { discoverSlipbox } from "../discovery";
import { SLUG_REGEX, saveZettel, zettelPath } from "../zettel";
import { register } from "./index";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function parseArgs(args: string[]): { slug?: string; source?: string; title?: string } {
  const out: { slug?: string; source?: string; title?: string } = {};
  for (const a of args) {
    if (a.startsWith("--source=")) out.source = a.slice("--source=".length);
    else if (a.startsWith("--title=")) out.title = a.slice("--title=".length);
    else if (!out.slug && !a.startsWith("--")) out.slug = a;
  }
  return out;
}

register("new", async (args) => {
  const { slug, source, title } = parseArgs(args);
  if (!slug) {
    console.error("slipbox new: slug required");
    return 2;
  }
  if (!SLUG_REGEX.test(slug)) {
    console.error(`slipbox new: slug ${slug} is not kebab-case`);
    return 2;
  }
  const sb = discoverSlipbox(process.cwd());
  if (existsSync(zettelPath(sb, slug))) {
    console.error(`slipbox new: ${slug} already exists`);
    return 1;
  }
  const sourceValue = source ? (source.includes("/") ? source : `../sources/${source}.md`) : "";
  const titleValue = title ?? "";
  saveZettel(sb, slug, {
    frontmatter: {
      title: titleValue,
      source: sourceValue,
      created: todayIso(),
      schema_version: 1,
      links: [],
    },
    body: `# ${titleValue}\n`,
  });
  // Auto-reindex
  const { embedTexts } = await import("../embedding/model");
  const { saveSidecar } = await import("../embedding/sidecar");
  const { hashBody } = await import("../embedding/staleness");
  const { statSync } = await import("node:fs");
  const body = `# ${titleValue}\n`;
  const [vec] = await embedTexts([body]);
  if (vec) {
    const stat = statSync(zettelPath(sb, slug));
    saveSidecar(sb, slug, {
      slug,
      embedding: Array.from(vec),
      dim: vec.length,
      model: process.env.SLIPBOX_MODEL ?? "BAAI/bge-m3",
      content_sha256: hashBody(body),
      mtime_ns: Number(stat.mtimeNs),
      indexed_at: Math.floor(Date.now() / 1000),
    });
  }
  console.log(`created ${zettelPath(sb, slug)}`);
  return 0;
});
