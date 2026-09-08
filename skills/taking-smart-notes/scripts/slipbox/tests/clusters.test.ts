import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { $ } from "bun";

describe("slipbox clusters", () => {
  let tmp: string;
  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), "slipbox-cl-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    mkdirSync(join(tmp, "notes/sources"), { recursive: true });
    writeFileSync(join(tmp, "notes/sources/x.md"), "# X\n");
    writeFileSync(
      join(tmp, "notes/zettel/a.md"),
      "---\ntitle: a\nsource: ../sources/x.md\ncreated: 2026-05-02\nlinks: [b]\n---\n\nA.\n",
    );
    writeFileSync(
      join(tmp, "notes/zettel/b.md"),
      "---\ntitle: b\nsource: ../sources/x.md\ncreated: 2026-05-02\nlinks: [a]\n---\n\nB.\n",
    );
    writeFileSync(
      join(tmp, "notes/zettel/c.md"),
      "---\ntitle: c\nsource: ../sources/x.md\ncreated: 2026-05-02\nlinks: [d]\n---\n\nC.\n",
    );
    writeFileSync(
      join(tmp, "notes/zettel/d.md"),
      "---\ntitle: d\nsource: ../sources/x.md\ncreated: 2026-05-02\nlinks: [c]\n---\n\nD.\n",
    );
  });
  afterEach(() => rmSync(tmp, { recursive: true, force: true }));

  test("connected components finds two clusters", async () => {
    const cli = `${process.cwd()}/src/cli.ts`;
    const out = await $`bun run ${cli} clusters --json`.cwd(tmp).text();
    const r = JSON.parse(out) as { clusters: { id: number; members: string[] }[] };
    expect(r.clusters.length).toBe(2);
  });
});
