import { discoverSlipbox } from "../../discovery";
import { findBelief, saveBelief } from "../../belief/io";
import type { BeliefStatus } from "../../belief/frontmatter";
import { registerBeliefSub } from "./dispatch";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

const VALID_STATUS: readonly BeliefStatus[] = ["live", "superseded", "retired"] as const;

interface Args {
  slug?: string;
  note?: string;
  status?: BeliefStatus;
  supersededBy?: string;
}

function parseArgs(args: string[]): Args | { error: string } {
  const out: Args = {};
  for (const a of args) {
    if (a.startsWith("--note=")) out.note = a.slice("--note=".length);
    else if (a.startsWith("--status=")) {
      const v = a.slice("--status=".length);
      if (!VALID_STATUS.includes(v as BeliefStatus)) {
        return { error: `unknown --status=${v} (valid: ${VALID_STATUS.join("|")})` };
      }
      out.status = v as BeliefStatus;
    } else if (a.startsWith("--superseded-by=")) {
      out.supersededBy = a.slice("--superseded-by=".length);
    } else if (!out.slug && !a.startsWith("--")) out.slug = a;
  }
  return out;
}

registerBeliefSub("revise", async (args) => {
  const parsed = parseArgs(args);
  if ("error" in parsed) {
    console.error(`slipbox belief revise: ${parsed.error}`);
    return 2;
  }
  const { slug, note, status, supersededBy } = parsed;
  if (!slug) {
    console.error("slipbox belief revise: slug required");
    return 2;
  }
  if (note === undefined || note.trim() === "") {
    console.error("slipbox belief revise: --note required and non-empty");
    return 2;
  }
  if (status === "superseded" && !supersededBy) {
    console.error("slipbox belief revise: --status=superseded requires --superseded-by=<slug>");
    return 2;
  }
  const sb = discoverSlipbox(process.cwd());
  const found = findBelief(sb, slug);
  if (!found) {
    console.error(`slipbox belief revise: ${slug} not found`);
    return 1;
  }
  if (supersededBy === slug) {
    console.error(`slipbox belief revise: ${slug} cannot supersede itself`);
    return 2;
  }
  if (supersededBy && !findBelief(sb, supersededBy)) {
    console.error(`slipbox belief revise: --superseded-by=${supersededBy} does not resolve to an existing belief`);
    return 1;
  }
  const today = todayIso();
  const heading =
    status === "retired" ? "retired" : status === "superseded" ? "superseded" : "refined";
  found.parsed.frontmatter.last_reviewed = today;
  if (status) found.parsed.frontmatter.status = status;
  if (supersededBy) found.parsed.frontmatter.superseded_by = supersededBy;
  const newEntry = `\n## ${today} — ${heading}\n${note}\n`;
  found.parsed.body = `${found.parsed.body.replace(/\s+$/, "")}${newEntry}`;
  saveBelief(sb, slug, found.scope, found.parsed);
  console.log(`revised ${slug} (status=${found.parsed.frontmatter.status})`);
  return 0;
});
