import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { $ } from "bun";

describe("slipbox show", () => {
  let tmp: string;
  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), "slipbox-test-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    mkdirSync(join(tmp, "notes/sources"), { recursive: true });
    writeFileSync(
      join(tmp, "notes/zettel/a.md"),
      "---\ntitle: A\nsource: ../sources/x.md\ncreated: 2026-05-02\nlinks: [b]\n---\n\nBody A.\n",
    );
    writeFileSync(
      join(tmp, "notes/zettel/b.md"),
      "---\ntitle: B\nsource: ../sources/x.md\ncreated: 2026-05-02\nlinks: [a]\n---\n\nBody B.\n",
    );
    writeFileSync(
      join(tmp, "notes/zettel/c.md"),
      "---\ntitle: C\nsource: ../sources/x.md\ncreated: 2026-05-02\nlinks: [a]\n---\n\nBody C.\n",
    );
  });
  afterEach(() => rmSync(tmp, { recursive: true, force: true }));

  test("prints body and back-references", async () => {
    const cli = `${process.cwd()}/src/cli.ts`;
    const out = await $`bun run ${cli} show a`.cwd(tmp).text();
    expect(out).toContain("Body A.");
    expect(out).toContain("Forward links (1)");
    expect(out).toContain("- b");
    expect(out).toContain("Back-references (2)");
    expect(out).toContain("<- b");
    expect(out).toContain("<- c");
  });
});
