import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { $ } from "bun";

describe("slipbox moc", () => {
  let tmp: string;
  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), "slipbox-moc-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    mkdirSync(join(tmp, "notes/sources"), { recursive: true });
    writeFileSync(join(tmp, "notes/sources/x.md"), "# X\n");
    writeFileSync(
      join(tmp, "notes/zettel/a.md"),
      "---\ntitle: a\nsource: ../sources/x.md\ncreated: 2026-05-02\nlinks: [b]\n---\n\nFirst topic point.\n",
    );
    writeFileSync(
      join(tmp, "notes/zettel/b.md"),
      "---\ntitle: b\nsource: ../sources/x.md\ncreated: 2026-05-02\nlinks: [a]\n---\n\nSecond topic point.\n",
    );
    process.env.SLIPBOX_LLM_JUDGE_CMD =
      'cat > /dev/null && echo \'[{"slug":"a","annotation":"first idea"},{"slug":"b","annotation":"second idea"}]\'';
  });
  afterEach(() => {
    rmSync(tmp, { recursive: true, force: true });
    process.env.SLIPBOX_LLM_JUDGE_CMD = undefined;
  });

  test("draft MoC includes annotated members", async () => {
    const cli = `${process.cwd()}/src/cli.ts`;
    const out = await $`bun run ${cli} moc topic`.cwd(tmp).text();
    expect(out).toContain("[[a]]");
    expect(out).toContain("first idea");
    expect(out).toContain("[[b]]");
  }, 180000);
});
