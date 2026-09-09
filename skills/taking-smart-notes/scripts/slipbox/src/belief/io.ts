import { existsSync, mkdirSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import type { Slipbox } from "../discovery";
import { writeAtomic } from "../zettel";
import { type ParsedBelief, parseBelief, serializeBelief } from "./frontmatter";

export interface BeliefSummary {
  slug: string;
  scope: string;
  path: string;
  frontmatter: ParsedBelief["frontmatter"];
}

export interface FoundBelief {
  scope: string;
  path: string;
  parsed: ParsedBelief;
}

function beliefDirs(sb: Slipbox): { dir: string; scope: string }[] {
  const out: { dir: string; scope: string }[] = [];
  if (sb.layout === "trade" && sb.trade) {
    out.push({ dir: sb.beliefsDir, scope: sb.trade });
  }
  // In flat layout, beliefsDir === personalBeliefsDir, so this single push
  // covers both. In trade layout, it adds the personal dir alongside the
  // trade dir already pushed above.
  out.push({ dir: sb.personalBeliefsDir, scope: "personal" });
  return out;
}

export function beliefPath(sb: Slipbox, scope: string, slug: string): string {
  if (scope === "personal") return join(sb.personalBeliefsDir, `${slug}.md`);
  // Trade-scoped: must equal active trade.
  if (sb.layout !== "trade") {
    throw new Error(
      `cannot create belief in trade scope '${scope}' on a flat slip-box. Either reinitialise with trade support (\`slipbox init --trade=${scope}\` from the slip-box root) or use --scope=personal.`,
    );
  }
  if (sb.trade !== scope) {
    throw new Error(
      `scope '${scope}' does not match active trade '${sb.trade}'. Either pass --trade=${scope} on the slipbox CLI invocation, or run \`slipbox init --trade=${scope}\` from the slip-box root to add a new trade.`,
    );
  }
  return join(sb.beliefsDir, `${slug}.md`);
}

export function findBelief(sb: Slipbox, slug: string): FoundBelief | null {
  const matches: FoundBelief[] = [];
  for (const { dir, scope } of beliefDirs(sb)) {
    const p = join(dir, `${slug}.md`);
    if (existsSync(p)) {
      matches.push({ scope, path: p, parsed: parseBelief(readFileSync(p, "utf-8")) });
    }
  }
  if (matches.length === 0) return null;
  if (matches.length > 1) {
    const scopes = matches.map((m) => m.scope).join(", ");
    throw new Error(`ambiguous belief slug ${slug}: exists in scopes [${scopes}]`);
  }
  return matches[0] as FoundBelief;
}

export function saveBelief(sb: Slipbox, slug: string, scope: string, parsed: ParsedBelief): void {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`invalid belief slug: ${slug} (must be kebab-case)`);
  }
  const text = serializeBelief(parsed.frontmatter, parsed.body);
  const path = beliefPath(sb, scope, slug);
  mkdirSync(dirname(path), { recursive: true });
  writeAtomic(path, text);
}

export function listBeliefs(sb: Slipbox): BeliefSummary[] {
  const out: BeliefSummary[] = [];
  const seen = new Set<string>();
  for (const { dir, scope } of beliefDirs(sb)) {
    if (seen.has(dir)) continue;
    seen.add(dir);
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir)) {
      if (!f.endsWith(".md")) continue;
      const slug = f.slice(0, -3);
      const path = join(dir, f);
      const parsed = parseBelief(readFileSync(path, "utf-8"));
      out.push({ slug, scope, path, frontmatter: parsed.frontmatter });
    }
  }
  return out;
}
