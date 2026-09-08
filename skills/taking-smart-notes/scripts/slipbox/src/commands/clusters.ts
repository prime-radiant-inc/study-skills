import { discoverSlipbox } from "../discovery";
import { connectedComponents, louvain } from "../graph";
import { listZettels, loadZettel } from "../zettel";
import { register } from "./index";

function hubOf(members: string[], adj: Map<string, string[]>): string {
  let bestSlug = members[0] ?? "";
  let bestDeg = -1;
  for (const m of members) {
    const d = (adj.get(m) ?? []).length;
    if (d > bestDeg) {
      bestDeg = d;
      bestSlug = m;
    }
  }
  return bestSlug;
}

register("clusters", async (args) => {
  const algo = args.includes("--algorithm=louvain") ? "louvain" : "connected";
  const json = args.includes("--json");
  const sb = discoverSlipbox(process.cwd());
  const slugs = listZettels(sb);
  const adj = new Map<string, string[]>();
  for (const slug of slugs) {
    const z = loadZettel(sb, slug);
    adj.set(slug, z.frontmatter.links);
  }
  let clusters: { id: number; members: string[]; hub: string }[];
  if (algo === "louvain") {
    const partition = louvain(adj);
    const groups = new Map<number, string[]>();
    for (const [n, c] of partition) {
      if (!groups.has(c)) groups.set(c, []);
      const arr = groups.get(c);
      if (arr) arr.push(n);
    }
    clusters = Array.from(groups.entries()).map(([id, members]) => ({
      id,
      members: members.sort(),
      hub: hubOf(members, adj),
    }));
  } else {
    const cc = connectedComponents(adj);
    clusters = cc.map((members, id) => ({
      id,
      members: [...members].sort(),
      hub: hubOf(members, adj),
    }));
  }
  if (json) console.log(JSON.stringify({ algorithm: algo, clusters }, null, 2));
  else {
    for (const c of clusters) {
      console.log(`Cluster ${c.id} (${c.members.length} nodes, hub: ${c.hub}):`);
      for (const m of c.members) console.log(`  - ${m}`);
    }
  }
  return 0;
});
