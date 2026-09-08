import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import type { Slipbox } from "./discovery";

// Skills cite slip-box artifacts two ways: [[wikilinks]] anywhere, and — per
// the `## Deeper context` format — a backticked slug leading each bullet.
// Only the leading backticked token of a bullet inside that section is a
// reference; backticks elsewhere are code/tool names and must not be parsed.

export function listSkillMarkdownFiles(sb: Slipbox): string[] {
  const out: string[] = [];
  for (const dir of sb.skillsDirs) walk(dir, out);
  return out;
}

function walk(dir: string, out: string[]): void {
  if (!existsSync(dir)) return;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e.endsWith(".md")) out.push(p);
  }
}

const SECTION_HEADING = /^##\s+Deeper context/i;
const ANY_HEADING = /^##?\s/;
const BULLET_REF = /^\s*-\s[^`]*`([a-z0-9]+(?:-[a-z0-9]+)*)`/;

export function extractDeeperContextRefs(text: string): string[] {
  const refs: string[] = [];
  let inSection = false;
  for (const line of text.split("\n")) {
    if (ANY_HEADING.test(line)) {
      inSection = SECTION_HEADING.test(line);
      continue;
    }
    if (!inSection) continue;
    const m = line.match(BULLET_REF);
    if (m?.[1]) refs.push(m[1]);
  }
  return refs;
}
