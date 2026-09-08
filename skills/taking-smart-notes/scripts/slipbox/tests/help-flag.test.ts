import { describe, expect, test } from "bun:test";
import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { $ } from "bun";

// `slipbox init --help` once ignored the flag and scaffolded a real slip-box
// into whatever cwd the shell happened to be in. Any command invoked with
// --help/-h must print usage and change nothing.

const cli = `${process.cwd()}/src/cli.ts`;

describe("--help on subcommands", () => {
  test("init --help prints usage and scaffolds nothing", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "sb-help-"));
    const r = await $`bun run ${cli} init --help`.cwd(tmp).nothrow().quiet();
    expect(r.exitCode).toBe(0);
    expect(r.stdout.toString()).toContain("Usage:");
    expect(existsSync(join(tmp, "notes"))).toBe(false);
    expect(existsSync(join(tmp, "pieces"))).toBe(false);
    expect(existsSync(join(tmp, ".gitignore"))).toBe(false);
  });

  test("new -h prints usage instead of erroring", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "sb-help-"));
    const r = await $`bun run ${cli} new -h`.cwd(tmp).nothrow().quiet();
    expect(r.exitCode).toBe(0);
    expect(r.stdout.toString()).toContain("Usage:");
  });

  test("belief --help keeps its own subcommand help", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "sb-help-"));
    const r = await $`bun run ${cli} belief --help`.cwd(tmp).nothrow().quiet();
    expect(r.stdout.toString()).toContain("slipbox belief");
    expect(r.stdout.toString()).toContain("falsifier");
  });
});
