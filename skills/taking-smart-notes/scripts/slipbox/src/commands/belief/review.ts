import { findBelief, saveBelief } from "../../belief/io";
import { discoverSlipbox } from "../../discovery";
import { registerBeliefSub } from "./dispatch";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

registerBeliefSub("review", async (args) => {
  const slug = args.find((a) => !a.startsWith("--"));
  const noteArg = args.find((a) => a.startsWith("--note="));
  if (!slug) {
    console.error("slipbox belief review: slug required");
    return 2;
  }
  if (!noteArg) {
    console.error(
      "slipbox belief review: --note required (state what triggered the review and what re-reading produced)",
    );
    return 2;
  }
  const note = noteArg.slice("--note=".length);
  if (note.trim() === "") {
    console.error("slipbox belief review: --note must be non-empty");
    return 2;
  }
  const sb = discoverSlipbox(process.cwd());
  const found = findBelief(sb, slug);
  if (!found) {
    console.error(`slipbox belief review: ${slug} not found`);
    return 1;
  }
  const today = todayIso();
  found.parsed.frontmatter.last_reviewed = today;
  const newEntry = `\n## ${today} — reviewed (no change)\n${note}\n`;
  found.parsed.body = `${found.parsed.body.replace(/\s+$/, "")}${newEntry}`;
  saveBelief(sb, slug, found.scope, found.parsed);
  console.log(`reviewed ${slug} (last_reviewed=${today})`);
  return 0;
});
