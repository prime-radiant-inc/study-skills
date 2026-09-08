import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { register } from "./index";

register("init", async (args) => {
  const tradeArg = args.find((a) => a.startsWith("--trade="));
  const trade = tradeArg ? tradeArg.slice("--trade=".length) : null;
  const cwd = process.cwd();
  if (trade) {
    const root = join(cwd, "notes/trades", trade);
    if (existsSync(root)) {
      console.error(`slipbox init: ${root} already exists`);
      return 1;
    }
    mkdirSync(join(root, "sources"), { recursive: true });
    mkdirSync(join(root, "zettel"), { recursive: true });
    mkdirSync(join(root, ".embeddings"), { recursive: true });
  } else {
    const notesDir = join(cwd, "notes");
    if (existsSync(notesDir)) {
      console.error(`slipbox init: ${notesDir} already exists`);
      return 1;
    }
    mkdirSync(join(cwd, "notes/sources"), { recursive: true });
    mkdirSync(join(cwd, "notes/zettel"), { recursive: true });
    mkdirSync(join(cwd, "notes/.embeddings"), { recursive: true });
  }
  if (!existsSync(join(cwd, "pieces"))) mkdirSync(join(cwd, "pieces"), { recursive: true });
  const gi = join(cwd, ".gitignore");
  const giLine = "**/.embeddings/\n";
  if (!existsSync(gi)) writeFileSync(gi, giLine);
  else {
    const existing = readFileSync(gi, "utf-8");
    if (!existing.includes(".embeddings")) appendFileSync(gi, giLine);
  }
  console.log(`slipbox: initialized at ${cwd}`);
  return 0;
});
