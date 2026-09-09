import { describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { $ } from "bun";

describe("slipbox belief dispatch", () => {
  test("no subcommand → usage, exit 2", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "sb-bd-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    const cli = `${process.cwd()}/src/cli.ts`;
    const result = await $`bun run ${cli} belief`.cwd(tmp).nothrow().quiet();
    expect(result.exitCode).toBe(2);
    expect(result.stderr.toString()).toContain("usage");
  });

  test("unknown subcommand → error, exit 2", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "sb-bd-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    const cli = `${process.cwd()}/src/cli.ts`;
    const result = await $`bun run ${cli} belief bogus`.cwd(tmp).nothrow().quiet();
    expect(result.exitCode).toBe(2);
    expect(result.stderr.toString()).toContain("unknown");
  });

  test("--help prints subcommand usage", async () => {
    const cli = `${process.cwd()}/src/cli.ts`;
    const result = await $`bun run ${cli} belief --help`.nothrow().quiet();
    expect(result.exitCode).toBe(0);
    expect(result.stdout.toString()).toContain("belief new");
    expect(result.stdout.toString()).toContain("belief list");
  });
});
