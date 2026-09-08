import { createHash } from "node:crypto";
import { statSync } from "node:fs";
import type { Slipbox } from "../discovery";
import { loadZettel, zettelPath } from "../zettel";
import { type Sidecar, loadSidecar } from "./sidecar";

export function hashBody(body: string): string {
  return createHash("sha256").update(body.trim()).digest("hex");
}

export type Staleness = "fresh" | "needs-rehash" | "stale";

export function checkStaleness(
  sb: Slipbox,
  slug: string,
): {
  staleness: Staleness;
  sidecar: Sidecar | null;
  bodyHash?: string;
} {
  const sidecar = loadSidecar(sb, slug);
  if (!sidecar) return { staleness: "stale", sidecar: null };
  const stat = statSync(zettelPath(sb, slug));
  const mtime_ns = Number(stat.mtimeNs);
  if (mtime_ns === sidecar.mtime_ns) {
    return { staleness: "fresh", sidecar };
  }
  const z = loadZettel(sb, slug);
  const bodyHash = hashBody(z.body);
  if (bodyHash === sidecar.content_sha256) {
    return { staleness: "needs-rehash", sidecar, bodyHash };
  }
  return { staleness: "stale", sidecar, bodyHash };
}
