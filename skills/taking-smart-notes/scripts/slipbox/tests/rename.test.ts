import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { $ } from "bun";

describe("slipbox rename", () => {
  let tmp: string;
  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), "slipbox-test-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    mkdirSync(join(tmp, "notes/sources"), { recursive: true });
    mkdirSync(join(tmp, "pieces"), { recursive: true });
    writeFileSync(
      join(tmp, "notes/zettel/old-name.md"),
      "---\ntitle: Old\nsource: ../sources/x.md\ncreated: 2026-05-02\nlinks: [other]\n---\n\nBody.\n",
    );
    writeFileSync(
      join(tmp, "notes/zettel/other.md"),
      "---\ntitle: Other\nsource: ../sources/x.md\ncreated: 2026-05-02\nlinks: [old-name]\n---\n\nBody.\n",
    );
    writeFileSync(join(tmp, "notes/sources/x.md"), "# X\n\n- [[old-name]] — annotation\n");
    writeFileSync(join(tmp, "pieces/p.md"), "Refers to [[old-name]] in body.\n");
  });
  afterEach(() => rmSync(tmp, { recursive: true, force: true }));

  test("renames file and updates all references", async () => {
    const cli = `${process.cwd()}/src/cli.ts`;
    await $`bun run ${cli} rename old-name new-name`.cwd(tmp);
    expect(existsSync(join(tmp, "notes/zettel/new-name.md"))).toBe(true);
    expect(existsSync(join(tmp, "notes/zettel/old-name.md"))).toBe(false);
    expect(readFileSync(join(tmp, "notes/zettel/other.md"), "utf-8")).toContain(
      "links: [new-name]",
    );
    expect(readFileSync(join(tmp, "notes/sources/x.md"), "utf-8")).toContain("[[new-name]]");
    expect(readFileSync(join(tmp, "pieces/p.md"), "utf-8")).toContain("[[new-name]]");
  });

  test("rename target collision fails", async () => {
    const cli = `${process.cwd()}/src/cli.ts`;
    const res = await $`bun run ${cli} rename old-name other`.cwd(tmp).nothrow();
    expect(res.exitCode).not.toBe(0);
  });
});
