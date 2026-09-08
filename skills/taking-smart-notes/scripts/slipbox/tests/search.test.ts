import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { $ } from "bun";

describe("slipbox search (full-text)", () => {
  let tmp: string;
  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), "slipbox-test-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    mkdirSync(join(tmp, "notes/sources"), { recursive: true });
    writeFileSync(
      join(tmp, "notes/zettel/a.md"),
      "---\ntitle: Coordination cost\nsource: ../sources/x.md\ncreated: 2026-05-02\nlinks: []\n---\n\nThe cost of coordination grows with team size.\n",
    );
    writeFileSync(
      join(tmp, "notes/zettel/b.md"),
      "---\ntitle: Other\nsource: ../sources/x.md\ncreated: 2026-05-02\nlinks: []\n---\n\nUnrelated content.\n",
    );
  });
  afterEach(() => rmSync(tmp, { recursive: true, force: true }));

  test("finds matching zettels", async () => {
    const cli = `${process.cwd()}/src/cli.ts`;
    const out = await $`bun run ${cli} search coordination`.cwd(tmp).text();
    expect(out).toContain("a.md");
    expect(out).not.toContain("b.md");
  });
});
