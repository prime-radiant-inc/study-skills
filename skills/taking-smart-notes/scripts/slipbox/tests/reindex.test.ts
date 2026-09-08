import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { $ } from "bun";

describe("slipbox reindex", () => {
  let tmp: string;
  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), "slipbox-rx-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    mkdirSync(join(tmp, "notes/sources"), { recursive: true });
    writeFileSync(
      join(tmp, "notes/zettel/a.md"),
      "---\ntitle: A\nsource: ../sources/x.md\ncreated: 2026-05-02\nlinks: []\n---\n\nCoordination cost grows with team size.\n",
    );
    writeFileSync(
      join(tmp, "notes/zettel/b.md"),
      "---\ntitle: B\nsource: ../sources/x.md\ncreated: 2026-05-02\nlinks: []\n---\n\nCommunication overhead in teams.\n",
    );
    writeFileSync(join(tmp, "notes/sources/x.md"), "# X\n");
  });
  afterEach(() => rmSync(tmp, { recursive: true, force: true }));

  test("creates sidecars for all zettels", async () => {
    const cli = `${process.cwd()}/src/cli.ts`;
    await $`bun run ${cli} reindex`.cwd(tmp);
    expect(existsSync(join(tmp, "notes/.embeddings/a.json"))).toBe(true);
    expect(existsSync(join(tmp, "notes/.embeddings/b.json"))).toBe(true);
  }, 180000);
});
