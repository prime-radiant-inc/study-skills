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
  console.log(`created ${zettelPath(sb, slug)}`);
  return 0;
});
