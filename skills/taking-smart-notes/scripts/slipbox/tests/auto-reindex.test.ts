import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { $ } from "bun";

describe("auto-reindex on writes", () => {
  let tmp: string;
  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), "slipbox-auto-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    mkdirSync(join(tmp, "notes/sources"), { recursive: true });
    writeFileSync(join(tmp, "notes/sources/x.md"), "# X\n");
  });
  afterEach(() => rmSync(tmp, { recursive: true, force: true }));

  test("new creates a sidecar", async () => {
    const cli = `${process.cwd()}/src/cli.ts`;
    await $`bun run ${cli} new foo --source=x --title="Foo idea"`.cwd(tmp);
    expect(existsSync(join(tmp, "notes/.embeddings/foo.json"))).toBe(true);
  }, 180000);
});
