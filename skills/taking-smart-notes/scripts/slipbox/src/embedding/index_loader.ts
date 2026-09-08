import { statSync } from "node:fs";
import type { Slipbox } from "../discovery";
import { listZettels, loadZettel, zettelPath } from "../zettel";
import { embedTexts } from "./model";
import { type Sidecar, saveSidecar } from "./sidecar";
import { checkStaleness, hashBody } from "./staleness";

export interface InMemoryIndex {
  slugs: string[];
  vectors: Float32Array[];
  dim: number;
  model: string;
}

export function cosine(a: ArrayLike<number>, b: ArrayLike<number>): number {
  let d = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    const ai = a[i] ?? 0;
    const bi = b[i] ?? 0;
    d += ai * bi;
    na += ai * ai;
    nb += bi * bi;
  }
  if (na === 0 || nb === 0) return 0;
  return d / (Math.sqrt(na) * Math.sqrt(nb));
}

export async function loadOrBuildIndex(
  sb: Slipbox,
  opts?: { reembedStale?: boolean },
): Promise<InMemoryIndex> {
  const reembedStale = opts?.reembedStale ?? true;
  const slugs = listZettels(sb);
  const vectors: Float32Array[] = [];
  let model = "";
  let dim = 0;
  const toEmbed: { slug: string; body: string }[] = [];
  for (const slug of slugs) {
    const stale = checkStaleness(sb, slug);
    if (stale.staleness === "fresh" && stale.sidecar) {
      vectors.push(new Float32Array(stale.sidecar.embedding));
      model = stale.sidecar.model;
      dim = stale.sidecar.dim;
    } else if (stale.staleness === "needs-rehash" && stale.sidecar) {
      const stat = statSync(zettelPath(sb, slug));
      const updated: Sidecar = {
        ...stale.sidecar,
        mtime_ns: Number(stat.mtimeNs),
      };
      saveSidecar(sb, slug, updated);
      vectors.push(new Float32Array(stale.sidecar.embedding));
      model = stale.sidecar.model;
      dim = stale.sidecar.dim;
    } else if (reembedStale) {
      const z = loadZettel(sb, slug);
      toEmbed.push({ slug, body: z.body });
      vectors.push(new Float32Array());
    } else {
      vectors.push(new Float32Array());
    }
  }
  if (toEmbed.length > 0) {
    const newVecs = await embedTexts(toEmbed.map((t) => t.body));
    for (let i = 0; i < toEmbed.length; i++) {
      const entry = toEmbed[i];
      const vec = newVecs[i];
      if (!entry || !vec) continue;
      const { slug, body } = entry;
      const stat = statSync(zettelPath(sb, slug));
      const sc: Sidecar = {
        slug,
        embedding: vec,
        dim: vec.length,
        model: process.env.SLIPBOX_MODEL ?? "BAAI/bge-m3",
        content_sha256: hashBody(body),
        mtime_ns: Number(stat.mtimeNs),
        indexed_at: Math.floor(Date.now() / 1000),
      };
      saveSidecar(sb, slug, sc);
      const idx = slugs.indexOf(slug);
      vectors[idx] = new Float32Array(vec);
      model = sc.model;
      dim = sc.dim;
    }
  }
  return { slugs, vectors, dim, model };
}
