import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { $ } from "bun";

describe("slipbox suggest-links (mocked judge)", () => {
  let tmp: string;
  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), "slipbox-sl-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    mkdirSync(join(tmp, "notes/sources"), { recursive: true });
    writeFileSync(join(tmp, "notes/sources/x.md"), "# X\n");
    writeFileSync(
      join(tmp, "notes/zettel/a.md"),
      "---\ntitle: a\nsource: ../sources/x.md\ncreated: 2026-05-02\nlinks: []\n---\n\nCoordination cost grows with team size.\n",
    );
    writeFileSync(
      join(tmp, "notes/zettel/b.md"),
      "---\ntitle: b\nsource: ../sources/x.md\ncreated: 2026-05-02\nlinks: []\n---\n\nCommunication overhead.\n",
    );
    process.env.SLIPBOX_LLM_JUDGE_CMD =
      'cat > /dev/null && echo \'[{"slug":"b","llm_score":0.9,"justification":"both about overhead"}]\'';
  });
  afterEach(() => {
    rmSync(tmp, { recursive: true, force: true });
    process.env.SLIPBOX_LLM_JUDGE_CMD = undefined;
  });

  test("returns LLM-curated suggestions", async () => {
    const cli = `${process.cwd()}/src/cli.ts`;
    const out = await $`bun run ${cli} suggest-links a --json`.cwd(tmp).text();
    const r = JSON.parse(out) as { slug: string; llm_score: number; justification: string }[];
    expect(r[0]?.slug).toBe("b");
    expect(r[0]?.llm_score).toBe(0.9);
  }, 180000);
});
