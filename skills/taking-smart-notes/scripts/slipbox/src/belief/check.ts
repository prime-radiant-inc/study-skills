import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { Slipbox } from "../discovery";
import { parseBelief } from "./frontmatter";

export interface BeliefRecord {
  slug: string;
  scope: string;
  path: string;
  links: string[];
  status: string;
  superseded_by?: string;
}

export interface BeliefCheckCounters {
  beliefs: number;
  beliefSchemaIssues: number;
  beliefAsymmetric: number;
  beliefBroken: number;
}

export interface BeliefScanResult {
  records: Map<string, BeliefRecord>;
  details: string[];
  counters: BeliefCheckCounters;
}

interface BeliefDir {
  dir: string;
  scope: string;
}

function beliefDirs(sb: Slipbox): BeliefDir[] {
  const out: BeliefDir[] = [];
  if (sb.layout === "trade" && sb.trade) {
    out.push({ dir: sb.beliefsDir, scope: sb.trade });
  }
  out.push({ dir: sb.personalBeliefsDir, scope: "personal" });
  return out;
}

// Scans all belief files, parses each, and detects cross-scope slug
// collisions. Schema-broken files (parseBelief throws) are surfaced as
// findings rather than crashing the scan. The first occurrence of a
// colliding slug wins the records map; later occurrences are flagged.
export function scanBeliefs(sb: Slipbox): BeliefScanResult {
  const records = new Map<string, BeliefRecord>();
  const collidingScopes = new Map<string, string[]>();
  const seenDirs = new Set<string>();
  const details: string[] = [];
  const counters: BeliefCheckCounters = {
    beliefs: 0,
    beliefSchemaIssues: 0,
    beliefAsymmetric: 0,
    beliefBroken: 0,
  };

  for (const { dir, scope } of beliefDirs(sb)) {
    if (seenDirs.has(dir)) continue;
    seenDirs.add(dir);
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir)) {
      if (!f.endsWith(".md")) continue;
      const slug = f.slice(0, -3);
      const path = join(dir, f);
      counters.beliefs++;
      try {
        const parsed = parseBelief(readFileSync(path, "utf-8"));
        const existing = records.get(slug);
        if (existing) {
          const scopes = collidingScopes.get(slug) ?? [existing.scope];
          scopes.push(scope);
          collidingScopes.set(slug, scopes);
        } else {
          records.set(slug, {
            slug,
            scope,
            path,
            links: parsed.frontmatter.links,
            status: parsed.frontmatter.status,
            superseded_by: parsed.frontmatter.superseded_by,
          });
        }
      } catch (e) {
        counters.beliefSchemaIssues++;
        const msg = e instanceof Error ? e.message : String(e);
        details.push(`belief schema: ${slug}: ${msg}`);
      }
    }
  }

  for (const [slug, scopes] of collidingScopes) {
    counters.beliefSchemaIssues++;
    details.push(
      `belief schema: ${slug} exists in multiple scopes [${scopes.join(", ")}] — slugs must be unique across scopes`,
    );
  }

  return { records, details, counters };
}

// Validates the supersession graph and link symmetry for the scanned beliefs.
// Cross-type symmetry checks against the zettel set; sources are exempt.
// Mutates `details` and `counters` from the scan result.
export function validateBeliefs(
  sb: Slipbox,
  scan: BeliefScanResult,
  zettels: Map<string, { frontmatter: { links: string[] } }>,
): void {
  const { records: beliefs, details, counters } = scan;
  for (const b of beliefs.values()) {
    if (b.status === "superseded" && !b.superseded_by) {
      counters.beliefSchemaIssues++;
      details.push(`belief schema: ${b.slug} status=superseded but superseded_by not set`);
    }
    if (b.superseded_by && !beliefs.has(b.superseded_by)) {
      counters.beliefBroken++;
      details.push(`belief broken: ${b.slug} superseded_by ${b.superseded_by} (not found)`);
    }
    for (const target of b.links) {
      const targetBelief = beliefs.get(target);
      if (targetBelief) {
        if (!targetBelief.links.includes(b.slug)) {
          counters.beliefAsymmetric++;
          details.push(
            `belief asymmetric: ${b.slug} -> ${target} (belief has no return)`,
          );
        }
        continue;
      }
      const z = zettels.get(target);
      if (z) {
        if (!z.frontmatter.links.includes(b.slug)) {
          counters.beliefAsymmetric++;
          details.push(
            `belief asymmetric: ${b.slug} -> ${target} (zettel has no return)`,
          );
        }
        continue;
      }
      if (existsSync(join(sb.sourcesDir, `${target}.md`))) {
        // sources have no structured links; belief-side reference is enough
        continue;
      }
      counters.beliefBroken++;
      details.push(
        `belief broken: ${b.slug} -> ${target} (not a belief, zettel, or source)`,
      );
    }
  }
}
