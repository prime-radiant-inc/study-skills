import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { $ } from "bun";

describe("slipbox audit (heuristic)", () => {
  let tmp: string;
  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), "slipbox-au-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    mkdirSync(join(tmp, "notes/sources"), { recursive: true });
    writeFileSync(join(tmp, "notes/sources/x.md"), "# X\n");
  });
  afterEach(() => rmSync(tmp, { recursive: true, force: true }));

  test("flags missing body Source: line", async () => {
    writeFileSync(
      join(tmp, "notes/zettel/no-cite.md"),
      "---\ntitle: No cite\nsource: ../sources/x.md\ncreated: 2026-05-02\nlinks: []\n---\n\nBody without citation.\n",
    );
    const cli = `${process.cwd()}/src/cli.ts`;
    const out = await $`bun run ${cli} audit --json`.cwd(tmp).nothrow().text();
    const r = JSON.parse(out) as { slug: string; findings: string[] }[];
    expect(r.find((x) => x.slug === "no-cite")?.findings).toContain("missing-body-source-line");
  });

  test("clean zettel has no findings", async () => {
    writeFileSync(
      join(tmp, "notes/zettel/clean.md"),
      "---\ntitle: Clean\nsource: ../sources/x.md\ncreated: 2026-05-02\nlinks: []\n---\n\nThis zettel asserts a useful claim about the world.\n\nSource: Author 2026, §1.\n",
    );
    const cli = `${process.cwd()}/src/cli.ts`;
    const out = await $`bun run ${cli} audit --json`.cwd(tmp).nothrow().text();
    const r = JSON.parse(out) as { slug: string; findings: string[] }[];
    expect(r.find((x) => x.slug === "clean")?.findings.length ?? 0).toBe(0);
  });
});
