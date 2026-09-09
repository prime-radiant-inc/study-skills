import { describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { $ } from "bun";

describe("slipbox belief review", () => {
  test("bumps last_reviewed and appends to revision log", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "sb-br-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    const cli = `${process.cwd()}/src/cli.ts`;
    await $`bun run ${cli} belief new b1 --scope=personal --title="B" --falsifier="F"`
      .cwd(tmp)
      .quiet();
    const r =
      await $`bun run ${cli} belief review b1 --note="Re-read while answering user question; still holds"`
        .cwd(tmp)
        .nothrow()
        .quiet();
    expect(r.exitCode).toBe(0);
    const text = readFileSync(join(tmp, "notes/beliefs/b1.md"), "utf-8");
    expect(text).toMatch(/— reviewed \(no change\)/);
    expect(text).toContain("Re-read while answering user question; still holds");
  });

  test("requires --note", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "sb-br-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    const cli = `${process.cwd()}/src/cli.ts`;
    await $`bun run ${cli} belief new b1 --scope=personal --title="B" --falsifier="F"`
      .cwd(tmp)
      .quiet();
    const r = await $`bun run ${cli} belief review b1`.cwd(tmp).nothrow().quiet();
    expect(r.exitCode).toBe(2);
    expect(r.stderr.toString()).toContain("--note");
  });

  test("rejects empty --note", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "sb-br-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    const cli = `${process.cwd()}/src/cli.ts`;
    await $`bun run ${cli} belief new b1 --scope=personal --title="B" --falsifier="F"`
      .cwd(tmp)
      .quiet();
    const r = await $`bun run ${cli} belief review b1 --note=`.cwd(tmp).nothrow().quiet();
    expect(r.exitCode).toBe(2);
  });
});
