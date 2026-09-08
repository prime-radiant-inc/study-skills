import { existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

export interface Slipbox {
  root: string;
  layout: "flat" | "trade";
  trade?: string;
  zettelDir: string;
  sourcesDir: string;
  embeddingsDir: string;
  piecesDir: string;
  personalBeliefsDir: string; // always <root>/notes/beliefs
  beliefsDir: string;          // active scope's beliefs (flat: same as personal; trade: <trade-root>/beliefs)
  skillsDirs: string[];        // project skills layer; walkers no-op on missing dirs
}

// Default <root>/skills; SLIPBOX_SKILLS_DIRS (colon-separated, absolute or
// root-relative) overrides for harness-specific layouts.
function skillsDirsFor(root: string): string[] {
  const env = process.env.SLIPBOX_SKILLS_DIRS;
  if (env) {
    return env
      .split(":")
      .filter(Boolean)
      .map((p) => (p.startsWith("/") ? p : join(root, p)));
  }
  return [join(root, "skills")];
}

export function discoverSlipbox(startCwd: string, tradeOverride?: string): Slipbox {
  let cwd = resolve(startCwd);
  while (true) {
    const sb = tryAt(cwd, tradeOverride);
    if (sb) return sb;
    const parent = dirname(cwd);
    if (parent === cwd) break;
    cwd = parent;
  }
  throw new Error(`no slip-box found at ${startCwd} or any ancestor`);
}

function tryAt(dir: string, tradeOverride?: string): Slipbox | null {
  const flatZettel = join(dir, "notes/zettel");
  if (isDir(flatZettel)) {
    return {
      root: dir,
      layout: "flat",
      zettelDir: flatZettel,
      sourcesDir: join(dir, "notes/sources"),
      embeddingsDir: join(dir, "notes/.embeddings"),
      piecesDir: join(dir, "pieces"),
      personalBeliefsDir: join(dir, "notes/beliefs"),
      beliefsDir: join(dir, "notes/beliefs"),
      skillsDirs: skillsDirsFor(dir),
    };
  }
  const tradesDir = join(dir, "notes/trades");
  if (isDir(tradesDir)) {
    const trades = readdirSync(tradesDir).filter((t) => isDir(join(tradesDir, t, "zettel")));
    if (trades.length === 0) return null;
    let trade: string;
    if (tradeOverride) {
      if (!trades.includes(tradeOverride)) {
        throw new Error(`trade '${tradeOverride}' not found in ${tradesDir}`);
      }
      trade = tradeOverride;
    } else if (trades.length === 1) {
      // Safe: we just checked length === 1
      trade = trades[0] as string;
    } else {
      throw new Error(
        `multiple trade dirs found (${trades.join(", ")}); pass --trade <name> or set SLIPBOX_TRADE`,
      );
    }
    const tradeRoot = join(tradesDir, trade);
    return {
      root: dir,
      layout: "trade",
      trade,
      zettelDir: join(tradeRoot, "zettel"),
      sourcesDir: join(tradeRoot, "sources"),
      embeddingsDir: join(tradeRoot, ".embeddings"),
      piecesDir: join(dir, "pieces"),
      personalBeliefsDir: join(dir, "notes/beliefs"),
      beliefsDir: join(tradeRoot, "beliefs"),
      skillsDirs: skillsDirsFor(dir),
    };
  }
  return null;
}

function isDir(p: string): boolean {
  try {
    return existsSync(p) && statSync(p).isDirectory();
  } catch {
    return false;
  }
}
