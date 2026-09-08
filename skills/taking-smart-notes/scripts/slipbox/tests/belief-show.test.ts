import { describe, expect, test } from "bun:test";
import { mkdtempSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { $ } from "bun";

describe("slipbox belief show", () => {
  test("prints belief body and link summaries", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "sb-bs-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    const cli = `${process.cwd()}/src/cli.ts`;
    await $`bun run ${cli} belief new b1 --scope=personal --title="B1" --falsifier="F"`.cwd(tmp).quiet();
    const r = await $`bun run ${cli} belief show b1`.cwd(tmp).nothrow().quiet();
    expect(r.exitCode).toBe(0);
    const out = r.stdout.toString();
    expect(out).toContain("# Why I hold this");
    expect(out).toContain("# Revision log");
    expect(out).toContain("Forward links (0)");
    expect(out).toContain("Back-references (0)");
    // Frontmatter must NOT leak into output
    expect(out).not.toContain('title: "B1"');
  });

  test("error on not-found slug (exit 1)", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "sb-bs-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    const cli = `${process.cwd()}/src/cli.ts`;
    const r = await $`bun run ${cli} belief show nope`.cwd(tmp).nothrow().quiet();
    expect(r.exitCode).toBe(1);
    expect(r.stderr.toString()).toContain("not found");
  });

  test("error on missing slug arg (exit 2)", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "sb-bs-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    const cli = `${process.cwd()}/src/cli.ts`;
    const r = await $`bun run ${cli} belief show`.cwd(tmp).nothrow().quiet();
    expect(r.exitCode).toBe(2);
    expect(r.stderr.toString()).toContain("requires");
  });
});
