import { findBelief, listBeliefs } from "../../belief/io";
import { discoverSlipbox } from "../../discovery";
import { listZettels, loadZettel } from "../../zettel";
import { registerBeliefSub } from "./dispatch";

registerBeliefSub("show", async (args) => {
  const slug = args[0];
  if (!slug) {
    console.error("slipbox belief show: requires <slug>");
    return 2;
  }
  const sb = discoverSlipbox(process.cwd());
  const found = findBelief(sb, slug);
  if (!found) {
    console.error(`slipbox belief show: ${slug} not found`);
    return 1;
  }
  console.log(found.parsed.body.replace(/\n+$/, ""));
  console.log("");
  const fwd = found.parsed.frontmatter.links;
  console.log(`Forward links (${fwd.length}):`);
  for (const l of fwd) console.log(`  - ${l}`);

  const backrefs: string[] = [];
  for (const z of listZettels(sb)) {
    const zp = loadZettel(sb, z);
    if (zp.frontmatter.links.includes(slug)) backrefs.push(`zettel:${z}`);
  }
  for (const b of listBeliefs(sb)) {
    if (b.slug === slug) continue;
    if (b.frontmatter.links.includes(slug)) backrefs.push(`belief:${b.slug}`);
  }
  console.log(`Back-references (${backrefs.length}):`);
  for (const b of backrefs) console.log(`  <- ${b}`);
  return 0;
});
