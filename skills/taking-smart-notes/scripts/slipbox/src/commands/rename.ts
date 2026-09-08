import { existsSync, readFileSync, readdirSync, renameSync, statSync } from "node:fs";
import { join } from "node:path";
import { discoverSlipbox } from "../discovery";
import {
  SLUG_REGEX,
  listZettels,
  loadZettel,
  saveZettel,
  writeAtomic,
  zettelPath,
} from "../zettel";
import { register } from "./index";

function rewriteWikilinks(file: string, oldSlug: string, newSlug: string): boolean {
  if (!existsSync(file)) return false;
  const text = readFileSync(file, "utf-8");
  const re = new RegExp(`\\[\\[${oldSlug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\]\\]`, "g");
  if (!re.test(text)) return false;
  writeAtomic(file, text.replace(re, `[[${newSlug}]]`));
  return true;
}

// Skills cite slugs backticked (Deeper-context bullets, body citations), not
// only as wikilinks. Exact full-token match so `old-slug-extended` survives.
function rewriteBacktickRefs(file: string, oldSlug: string, newSlug: string): boolean {
  if (!existsSync(file)) return false;
  const text = readFileSync(file, "utf-8");
  const re = new RegExp(`\`${oldSlug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\``, "g");
  if (!re.test(text)) return false;
  writeAtomic(file, text.replace(re, `\`${newSlug}\``));
  return true;
}

function walkDir(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...walkDir(p));
    else if (e.endsWith(".md")) out.push(p);
  }
  return out;
}

register("rename", async (args) => {
  if (args.length < 2) {
    console.error("slipbox rename: requires <old> <new>");
    return 2;
  }
  const [oldSlug, newSlug] = args as [string, string];
  if (oldSlug === newSlug) {
    console.error("slipbox rename: old and new are identical");
    return 2;
  }
  if (!SLUG_REGEX.test(newSlug)) {
    console.error(`slipbox rename: ${newSlug} is not kebab-case`);
    return 2;
  }
  const sb = discoverSlipbox(process.cwd());
  if (!existsSync(zettelPath(sb, oldSlug))) {
    console.error(`slipbox rename: ${oldSlug} not found`);
    return 1;
  }
  if (existsSync(zettelPath(sb, newSlug))) {
    console.error(`slipbox rename: ${newSlug} already exists`);
    return 1;
  }
  for (const other of listZettels(sb)) {
    if (other === oldSlug) continue;
    const z = loadZettel(sb, other);
    if (z.frontmatter.links.includes(oldSlug)) {
      const newLinks = z.frontmatter.links.map((l) => (l === oldSlug ? newSlug : l));
      saveZettel(sb, other, { ...z, frontmatter: { ...z.frontmatter, links: newLinks } });
    }
  }
  renameSync(zettelPath(sb, oldSlug), zettelPath(sb, newSlug));
  for (const file of [
    ...walkDir(sb.zettelDir),
    ...walkDir(sb.sourcesDir),
    ...walkDir(sb.piecesDir),
  ]) {
    rewriteWikilinks(file, oldSlug, newSlug);
  }
  for (const file of sb.skillsDirs.flatMap(walkDir)) {
    rewriteWikilinks(file, oldSlug, newSlug);
    rewriteBacktickRefs(file, oldSlug, newSlug);
  }
  console.log(`renamed ${oldSlug} -> ${newSlug}`);
  return 0;
});
