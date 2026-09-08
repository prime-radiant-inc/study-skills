import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { $ } from "bun";

// Creating a zettel must never load the embedding model: the skeleton body is
// stale the moment the real body is written, and every embedding consumer
// re-embeds stale zettels on demand through loadOrBuildIndex. A bogus model
// name makes any accidental model load fail loudly.
describe("slipbox new stays off the embedding model", () => {
  let tmp: string;
  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), "slipbox-auto-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    mkdirSync(join(tmp, "notes/sources"), { recursive: true });
    writeFileSync(join(tmp, "notes/sources/x.md"), "# X\n");
  });
  afterEach(() => rmSync(tmp, { recursive: true, force: true }));

  test("new succeeds without a usable model and writes no sidecar", async () => {
    const cli = `${process.cwd()}/src/cli.ts`;
    const r = await $`bun run ${cli} new foo --source=x --title="Foo idea"`
      .cwd(tmp)
      .env({ ...process.env, SLIPBOX_MODEL: "nonexistent/model-that-must-not-load" })
      .nothrow()
      .quiet();
    expect(r.exitCode).toBe(0);
    expect(existsSync(join(tmp, "notes/zettel/foo.md"))).toBe(true);
    expect(existsSync(join(tmp, "notes/.embeddings/foo.json"))).toBe(false);
  }, 60000);
});
