import { discoverSlipbox } from "../discovery";
import { listZettels, loadZettel } from "../zettel";
import { register } from "./index";

register("show", async (args) => {
  if (args.length < 1) {
    console.error("slipbox show: requires <slug>");
    return 2;
  }
  const slug = args[0] as string;
  const sb = discoverSlipbox(process.cwd());
  const z = loadZettel(sb, slug);
  console.log(z.body.replace(/\n+$/, ""));
  console.log("");
  console.log(`Forward links (${z.frontmatter.links.length}):`);
  for (const l of z.frontmatter.links) console.log(`  - ${l}`);
  const backRefs: string[] = [];
  for (const other of listZettels(sb)) {
    if (other === slug) continue;
    const o = loadZettel(sb, other);
    if (o.frontmatter.links.includes(slug)) backRefs.push(other);
  }
  console.log(`Back-references (${backRefs.length}):`);
  for (const b of backRefs) console.log(`  <- ${b}`);
  return 0;
});
