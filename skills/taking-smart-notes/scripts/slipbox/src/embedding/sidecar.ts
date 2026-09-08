import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Slipbox } from "../discovery";

export interface Sidecar {
  slug: string;
  embedding: number[];
  dim: number;
  model: string;
  content_sha256: string;
  mtime_ns: number;
  indexed_at: number;
}

export function sidecarPath(sb: Slipbox, slug: string): string {
  return join(sb.embeddingsDir, `${slug}.json`);
}

export function loadSidecar(sb: Slipbox, slug: string): Sidecar | null {
  const p = sidecarPath(sb, slug);
  if (!existsSync(p)) return null;
  try {
    return JSON.parse(readFileSync(p, "utf-8")) as Sidecar;
  } catch {
    return null;
  }
}

export function saveSidecar(sb: Slipbox, slug: string, sc: Sidecar): void {
  if (!existsSync(sb.embeddingsDir)) {
    mkdirSync(sb.embeddingsDir, { recursive: true });
  }
  const p = sidecarPath(sb, slug);
  const tmp = `${p}.tmp.${process.pid}.${Date.now()}`;
  writeFileSync(tmp, JSON.stringify(sc));
  renameSync(tmp, p);
}
