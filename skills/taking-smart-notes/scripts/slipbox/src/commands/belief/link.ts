import { existsSync } from "node:fs";
import { join } from "node:path";
import { type Slipbox, discoverSlipbox } from "../../discovery";
import { type FoundBelief, findBelief, saveBelief } from "../../belief/io";
import { loadZettel, saveZettel, zettelPath } from "../../zettel";
import { registerBeliefSub } from "./dispatch";

type Endpoint =
  | { kind: "belief"; belief: FoundBelief }
  | { kind: "zettel" }
  | { kind: "source" };

function resolveEndpoint(sb: Slipbox, slug: string): Endpoint | null {
  const belief = findBelief(sb, slug);
  if (belief) return { kind: "belief", belief };
  if (existsSync(zettelPath(sb, slug))) return { kind: "zettel" };
  if (existsSync(join(sb.sourcesDir, `${slug}.md`))) return { kind: "source" };
  return null;
}

function addLink(links: string[], slug: string): string[] {
  if (links.includes(slug)) return links;
  return [...links, slug].sort();
}

registerBeliefSub("link", async (args) => {
  const [a, b] = args;
  if (!a || !b) {
    console.error("slipbox belief link: requires <belief-slug> <other-slug>");
    return 2;
  }
  const sb = discoverSlipbox(process.cwd());
  const beliefSide = findBelief(sb, a);
  if (!beliefSide) {
    console.error(`slipbox belief link: first arg must be a belief; ${a} is not a belief`);
    return 2;
  }
  const other = resolveEndpoint(sb, b);
  if (!other) {
    console.error(`slipbox belief link: ${b} not found (not a belief, zettel, or source)`);
    return 1;
  }

  // Update belief side: add other slug to belief.links
  beliefSide.parsed.frontmatter.links = addLink(beliefSide.parsed.frontmatter.links, b);
  saveBelief(sb, a, beliefSide.scope, beliefSide.parsed);

  // Update other side if applicable
  if (other.kind === "zettel") {
    const z = loadZettel(sb, b);
    z.frontmatter.links = addLink(z.frontmatter.links, a);
    saveZettel(sb, b, z);
  } else if (other.kind === "belief") {
    other.belief.parsed.frontmatter.links = addLink(other.belief.parsed.frontmatter.links, a);
    saveBelief(sb, b, other.belief.scope, other.belief.parsed);
  }
  // sources don't have structured links; belief-side update is enough

  console.log(`+ ${a} -> ${b}`);
  if (other.kind !== "source") console.log(`+ ${b} -> ${a}`);
  return 0;
});
