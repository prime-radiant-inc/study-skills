import { existsSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { scanBeliefs, validateBeliefs } from "../belief/check";
import { discoverSlipbox } from "../discovery";
import { extractDeeperContextRefs, listSkillMarkdownFiles } from "../skills";
import { SLUG_REGEX, listZettels, loadZettel, zettelPath } from "../zettel";
import { register } from "./index";

interface CheckResult {
  zettels: number;
  forwardLinks: number;
  asymmetric: number;
  broken: number;
  schemaIssues: number;
  staleIsolates: number;
  beliefs: number;
  beliefSchemaIssues: number;
  beliefAsymmetric: number;
  beliefBroken: number;
  skillFiles: number;
  skillRefs: number;
  skillBroken: number;
  details: string[];
}

function runCheck(strict: boolean): CheckResult {
  const sb = discoverSlipbox(process.cwd());
  const slugs = listZettels(sb);
  const zettels = new Map(slugs.map((s) => [s, loadZettel(sb, s)]));
  const result: CheckResult = {
    zettels: slugs.length,
    forwardLinks: 0,
    asymmetric: 0,
    broken: 0,
    schemaIssues: 0,
    staleIsolates: 0,
    beliefs: 0,
    beliefSchemaIssues: 0,
    beliefAsymmetric: 0,
    beliefBroken: 0,
    skillFiles: 0,
    skillRefs: 0,
    skillBroken: 0,
    details: [],
  };

  // Load beliefs first when strict so the zettel pass can distinguish
  // zettel→belief asymmetry from a truly broken link.
  const beliefScan = strict ? scanBeliefs(sb) : null;

  for (const [slug, z] of zettels) {
    result.forwardLinks += z.frontmatter.links.length;
    for (const target of z.frontmatter.links) {
      const t = zettels.get(target);
      if (t) {
        if (!t.frontmatter.links.includes(slug)) {
          result.asymmetric++;
          result.details.push(`asymmetric: ${slug} -> ${target} (no return)`);
        }
        continue;
      }
      // Target isn't a zettel. In strict mode, check if it's a belief —
      // if so this is a cross-type asymmetry, not a broken link.
      const targetBelief = beliefScan?.records.get(target);
      if (targetBelief) {
        if (!targetBelief.links.includes(slug)) {
          result.asymmetric++;
          result.details.push(
            `asymmetric: zettel:${slug} -> belief:${target} (belief has no return)`,
          );
        }
        continue;
      }
      result.broken++;
      result.details.push(`broken: ${slug} -> ${target}`);
    }
    if (strict) {
      if (!SLUG_REGEX.test(slug)) {
        result.schemaIssues++;
        result.details.push(`schema: filename not kebab-case: ${slug}`);
      }
      if (!z.frontmatter.title) {
        result.schemaIssues++;
        result.details.push(`schema: missing title: ${slug}`);
      }
      if (!z.frontmatter.source) {
        result.schemaIssues++;
        result.details.push(`schema: missing source: ${slug}`);
      } else if (z.frontmatter.source.includes("/")) {
        const resolved = resolve(dirname(zettelPath(sb, slug)), z.frontmatter.source);
        if (!existsSync(resolved)) {
          result.schemaIssues++;
          result.details.push(
            `schema: source path does not resolve: ${slug} -> ${z.frontmatter.source}`,
          );
        }
      }
      if (z.frontmatter.links.length === 0) {
        const created = z.frontmatter.created;
        if (created) {
          const days = Math.floor((Date.now() - Date.parse(created)) / 86400000);
          if (days > 30) {
            result.staleIsolates++;
            result.details.push(`stale-isolate: ${slug} (created ${created}, ${days}d ago)`);
          }
        }
      }
    }
  }

  if (beliefScan) {
    validateBeliefs(sb, beliefScan, zettels);
    result.beliefs = beliefScan.counters.beliefs;
    result.beliefSchemaIssues = beliefScan.counters.beliefSchemaIssues;
    result.beliefAsymmetric = beliefScan.counters.beliefAsymmetric;
    result.beliefBroken = beliefScan.counters.beliefBroken;
    result.details.push(...beliefScan.details);

    // A skill's Deeper-context refs must resolve to a zettel, belief, or source.
    const skillFiles = listSkillMarkdownFiles(sb);
    result.skillFiles = skillFiles.length;
    for (const file of skillFiles) {
      for (const slug of extractDeeperContextRefs(readFileSync(file, "utf-8"))) {
        result.skillRefs++;
        const resolves =
          zettels.has(slug) ||
          beliefScan.records.has(slug) ||
          existsSync(join(sb.sourcesDir, `${slug}.md`));
        if (!resolves) {
          result.skillBroken++;
          result.details.push(`skill-broken: ${relative(sb.root, file)} -> ${slug}`);
        }
      }
    }
  }

  return result;
}

register("check", async (args) => {
  const strict = args.includes("--strict");
  const json = args.includes("--json");
  const r = runCheck(strict);
  if (json) {
    console.log(JSON.stringify(r, null, 2));
  } else {
    console.log(
      `Zettels: ${r.zettels} | Forward links: ${r.forwardLinks} | Asymmetric: ${r.asymmetric} | Broken: ${r.broken}`,
    );
    if (strict) {
      console.log(`Strict: schema issues: ${r.schemaIssues} | stale isolates: ${r.staleIsolates}`);
      console.log(
        `Beliefs: ${r.beliefs} | schema issues: ${r.beliefSchemaIssues} | asymmetric: ${r.beliefAsymmetric} | broken: ${r.beliefBroken}`,
      );
      console.log(
        `Skills: ${r.skillFiles} files | skill refs: ${r.skillRefs} | broken: ${r.skillBroken}`,
      );
    }
    if (r.details.length > 0) {
      console.log("");
      for (const d of r.details) console.log(`  ${d}`);
    }
  }
  if (
    r.asymmetric > 0 ||
    r.broken > 0 ||
    (strict &&
      (r.schemaIssues > 0 ||
        r.beliefSchemaIssues > 0 ||
        r.beliefAsymmetric > 0 ||
        r.beliefBroken > 0 ||
        r.skillBroken > 0))
  ) {
    return 1;
  }
  return 0;
});
