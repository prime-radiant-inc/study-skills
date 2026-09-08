import { discoverSlipbox } from "../../discovery";
import { findBelief, saveBelief } from "../../belief/io";
import { registerBeliefSub } from "./dispatch";

const SLUG_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

interface Args {
  slug?: string;
  scope?: string;
  title?: string;
  falsifier?: string;
  note?: string;
}

function parseArgs(args: string[]): Args {
  const out: Args = {};
  for (const a of args) {
    if (a.startsWith("--scope=")) out.scope = a.slice("--scope=".length);
    else if (a.startsWith("--title=")) out.title = a.slice("--title=".length);
    else if (a.startsWith("--falsifier=")) out.falsifier = a.slice("--falsifier=".length);
    else if (a.startsWith("--note=")) out.note = a.slice("--note=".length);
    else if (!out.slug && !a.startsWith("--")) out.slug = a;
  }
  return out;
}

registerBeliefSub("new", async (args) => {
  const { slug, scope, title, falsifier, note } = parseArgs(args);
  if (!slug || !scope || !title || !falsifier) {
    console.error("slipbox belief new: --scope, --title, --falsifier all required");
    return 2;
  }
  if (!SLUG_REGEX.test(slug)) {
    console.error(`slipbox belief new: slug ${slug} is not kebab-case`);
    return 2;
  }
  const sb = discoverSlipbox(process.cwd());
  if (findBelief(sb, slug)) {
    console.error(`slipbox belief new: ${slug} already exists`);
    return 1;
  }
  const today = todayIso();
  const entry = note ?? "Initial belief; no trigger noted.";
  const body = `\n# Why I hold this\n\n(Reasoning, in your own voice.)\n\n# Revision log\n## ${today} — created\n${entry}\n`;
  saveBelief(sb, slug, scope, {
    frontmatter: {
      title,
      scope,
      status: "live",
      created: today,
      last_reviewed: today,
      falsifier,
      links: [],
      schema_version: 1,
    },
    body,
  });
  console.log(`created belief ${slug} (scope=${scope})`);
  return 0;
});
