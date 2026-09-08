import { statSync } from "node:fs";
import { discoverSlipbox } from "../discovery";
import { embedTexts } from "../embedding/model";
import { type Sidecar, loadSidecar, saveSidecar } from "../embedding/sidecar";
import { hashBody } from "../embedding/staleness";
import { listZettels, loadZettel, zettelPath } from "../zettel";
import { register } from "./index";

register("reindex", async (args) => {
  const force = args.includes("--force");
  const json = args.includes("--json");
  const sb = discoverSlipbox(process.cwd());
  const slugs = listZettels(sb);
  const stats = { embedded: 0, skipped: 0, total: slugs.length };
  const toEmbed: { slug: string; body: string }[] = [];
  for (const slug of slugs) {
    const z = loadZettel(sb, slug);
    if (!force) {
      const sidecar = loadSidecar(sb, slug);
      const bodyHash = hashBody(z.body);
      if (sidecar && sidecar.content_sha256 === bodyHash) {
        stats.skipped++;
        continue;
      }
    }
    toEmbed.push({ slug, body: z.body });
  }
  if (toEmbed.length > 0) {
    const vecs = await embedTexts(toEmbed.map((t) => t.body));
    for (let i = 0; i < toEmbed.length; i++) {
      const item = toEmbed[i];
      const vec = vecs[i];
      if (!item || !vec) continue;
      const stat = statSync(zettelPath(sb, item.slug));
      const sc: Sidecar = {
        slug: item.slug,
        embedding: Array.from(vec),
        dim: vec.length,
        model: process.env.SLIPBOX_MODEL ?? "BAAI/bge-m3",
        content_sha256: hashBody(item.body),
        mtime_ns: Number(stat.mtimeNs),
        indexed_at: Math.floor(Date.now() / 1000),
      };
      saveSidecar(sb, item.slug, sc);
      stats.embedded++;
    }
  }
  if (json) console.log(JSON.stringify(stats));
  else
    console.log(
      `reindex: embedded ${stats.embedded}, skipped ${stats.skipped}, total ${stats.total}`,
    );
  return 0;
});
