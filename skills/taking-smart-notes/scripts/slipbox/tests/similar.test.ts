import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { $ } from "bun";

describe("slipbox similar", () => {
  let tmp: string;
  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), "slipbox-sim-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    mkdirSync(join(tmp, "notes/sources"), { recursive: true });
    writeFileSync(join(tmp, "notes/sources/x.md"), "# X\n");
    writeFileSync(
      join(tmp, "notes/zettel/cats.md"),
      "---\ntitle: cats\nsource: ../sources/x.md\ncreated: 2026-05-02\nlinks: []\n---\n\nFelines as domestic pets.\n",
    );
    writeFileSync(
      join(tmp, "notes/zettel/feline.md"),
      "---\ntitle: feline\nsource: ../sources/x.md\ncreated: 2026-05-02\nlinks: []\n---\n\nMembers of the cat family.\n",
    );
    writeFileSync(
      join(tmp, "notes/zettel/sgd.md"),
      "---\ntitle: sgd\nsource: ../sources/x.md\ncreated: 2026-05-02\nlinks: []\n---\n\nStochastic gradient descent for optimization.\n",
    );
  });
  afterEach(() => rmSync(tmp, { recursive: true, force: true }));

  test("similar to cats ranks feline above sgd", async () => {
    const cli = `${process.cwd()}/src/cli.ts`;
    const out = await $`bun run ${cli} similar cats --json`.cwd(tmp).text();
    const result = JSON.parse(out) as { slug: string; score: number }[];
    const feline = result.find((r) => r.slug === "feline");
    const sgd = result.find((r) => r.slug === "sgd");
    expect(feline).toBeDefined();
    expect(sgd).toBeDefined();
    // biome-ignore lint/style/noNonNullAssertion: toBeDefined() guards above
    expect(feline!.score).toBeGreaterThan(sgd!.score);
  }, 180000);
});
