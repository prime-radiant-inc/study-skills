import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { $ } from "bun";

describe("slipbox init", () => {
  let tmp: string;
  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), "slipbox-init-"));
  });
  afterEach(() => rmSync(tmp, { recursive: true, force: true }));

  test("flat init creates expected structure", async () => {
    const cli = `${process.cwd()}/src/cli.ts`;
    await $`bun run ${cli} init`.cwd(tmp);
    expect(existsSync(join(tmp, "notes/sources"))).toBe(true);
    expect(existsSync(join(tmp, "notes/zettel"))).toBe(true);
    expect(existsSync(join(tmp, "notes/.embeddings"))).toBe(true);
    expect(existsSync(join(tmp, "pieces"))).toBe(true);
    expect(readFileSync(join(tmp, ".gitignore"), "utf-8")).toContain(".embeddings/");
  });

  test("trade init creates trade-namespaced structure", async () => {
    const cli = `${process.cwd()}/src/cli.ts`;
    await $`bun run ${cli} init --trade=pm`.cwd(tmp);
    expect(existsSync(join(tmp, "notes/trades/pm/zettel"))).toBe(true);
    expect(existsSync(join(tmp, "notes/trades/pm/sources"))).toBe(true);
  });

  test("refuses if structure already exists", async () => {
    const cli = `${process.cwd()}/src/cli.ts`;
    await $`bun run ${cli} init`.cwd(tmp);
    const res = await $`bun run ${cli} init`.cwd(tmp).nothrow();
    expect(res.exitCode).not.toBe(0);
  });
});
