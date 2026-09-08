import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { $ } from "bun";

describe("slipbox search --semantic", () => {
  let tmp: string;
  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), "slipbox-sem-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    mkdirSync(join(tmp, "notes/sources"), { recursive: true });
    writeFileSync(join(tmp, "notes/sources/x.md"), "# X\n");
    writeFileSync(
      join(tmp, "notes/zettel/cat.md"),
      "---\ntitle: cat\nsource: ../sources/x.md\ncreated: 2026-05-02\nlinks: []\n---\n\nFelines and house pets.\n",
    );
    writeFileSync(
      join(tmp, "notes/zettel/sgd.md"),
      "---\ntitle: sgd\nsource: ../sources/x.md\ncreated: 2026-05-02\nlinks: []\n---\n\nGradient descent.\n",
    );
  });
  afterEach(() => rmSync(tmp, { recursive: true, force: true }));

  test("query 'kitten' surfaces cat over sgd", async () => {
    const cli = `${process.cwd()}/src/cli.ts`;
    const out = await $`bun run ${cli} search "kitten" --semantic --json`.cwd(tmp).text();
    const r = JSON.parse(out) as { slug: string; score: number }[];
    expect(r[0]?.slug).toBe("cat");
  }, 180000);
});
