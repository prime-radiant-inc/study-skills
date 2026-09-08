import { existsSync } from "node:fs";
import { discoverSlipbox } from "../discovery";
import { loadZettel, saveZettel, zettelPath } from "../zettel";
import { register } from "./index";

function modifyLinks(slug: string, op: "add" | "remove", other: string): void {
  const sb = discoverSlipbox(process.cwd());
  const z = loadZettel(sb, slug);
  const set = new Set(z.frontmatter.links);
  if (op === "add") set.add(other);
  else set.delete(other);
  saveZettel(sb, slug, {
    ...z,
    frontmatter: { ...z.frontmatter, links: Array.from(set).sort() },
  });
}

register("link", async (args) => {
  if (args.length < 2) {
    console.error("slipbox link: requires <slug-a> <slug-b>");
    return 2;
  }
  const [a, b] = args;
  const sb = discoverSlipbox(process.cwd());
  for (const s of [a as string, b as string]) {
    if (!existsSync(zettelPath(sb, s))) {
      console.error(`slipbox link: zettel not found: ${s}`);
      return 1;
    }
  }
  modifyLinks(a as string, "add", b as string);
  modifyLinks(b as string, "add", a as string);
  console.log(`  + ${a} -> ${b}`);
  console.log(`  + ${b} -> ${a}`);
  return 0;
});

register("unlink", async (args) => {
  if (args.length < 2) {
    console.error("slipbox unlink: requires <slug-a> <slug-b>");
    return 2;
  }
  const [a, b] = args;
  const sb = discoverSlipbox(process.cwd());
  for (const s of [a as string, b as string]) {
    if (!existsSync(zettelPath(sb, s))) {
      console.error(`slipbox unlink: zettel not found: ${s}`);
      return 1;
    }
  }
  modifyLinks(a as string, "remove", b as string);
  modifyLinks(b as string, "remove", a as string);
  console.log(`  - ${a} -x- ${b}`);
  return 0;
});
