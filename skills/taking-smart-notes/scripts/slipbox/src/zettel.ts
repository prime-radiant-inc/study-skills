import {
  closeSync,
  existsSync,
  openSync,
  readFileSync,
  readdirSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import type { Slipbox } from "./discovery";
import { type ParsedZettel, parseFrontmatter, serializeFrontmatter } from "./frontmatter";

export const SLUG_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function listZettels(sb: Slipbox): string[] {
  if (!existsSync(sb.zettelDir)) return [];
  return readdirSync(sb.zettelDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.slice(0, -3))
    .sort();
}

export function zettelPath(sb: Slipbox, slug: string): string {
  return join(sb.zettelDir, `${slug}.md`);
}

export function loadZettel(sb: Slipbox, slug: string): ParsedZettel {
  const p = zettelPath(sb, slug);
  if (!existsSync(p)) {
    throw new Error(`zettel not found: ${slug}`);
  }
  return parseFrontmatter(readFileSync(p, "utf-8"));
}

export function saveZettel(sb: Slipbox, slug: string, parsed: ParsedZettel): void {
  if (!SLUG_REGEX.test(slug)) {
    throw new Error(`invalid slug: ${slug} (must be kebab-case)`);
  }
  const text = serializeFrontmatter(parsed.frontmatter, parsed.body);
  writeAtomic(zettelPath(sb, slug), text);
}

export function writeAtomic(target: string, content: string): void {
  const tmp = `${target}.tmp.${process.pid}.${Date.now()}`;
  writeFileSync(tmp, content);
  // fsync via open/close for durability
  const fd = openSync(tmp, "r+");
  closeSync(fd);
  renameSync(tmp, target);
}
