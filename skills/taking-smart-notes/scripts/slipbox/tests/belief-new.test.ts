import { describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { $ } from "bun";

describe("slipbox belief new", () => {
  test("creates personal belief skeleton with valid frontmatter", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "sb-bn-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    const cli = `${process.cwd()}/src/cli.ts`;
    const r =
      await $`bun run ${cli} belief new my-belief --scope=personal --title="My belief" --falsifier="F"`
        .cwd(tmp)
        .nothrow()
        .quiet();
    expect(r.exitCode).toBe(0);
    const path = join(tmp, "notes/beliefs/my-belief.md");
    expect(existsSync(path)).toBe(true);
    const text = readFileSync(path, "utf-8");
    expect(text).toContain('title: "My belief"');
    expect(text).toContain("scope: personal");
    expect(text).toContain("status: live");
    expect(text).toContain('falsifier: "F"');
    expect(text).toContain("# Why I hold this");
    expect(text).toContain("# Revision log");
    expect(text).toContain("— created");
  });

  test("writes --note verbatim as the created entry, without prepending 'After'", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "sb-bn-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    const cli = `${process.cwd()}/src/cli.ts`;
    const r =
      await $`bun run ${cli} belief new b --scope=personal --title="B" --falsifier="F" --note="Spawned after reading X: the claim held up"`
        .cwd(tmp)
        .nothrow()
        .quiet();
    expect(r.exitCode).toBe(0);
    const text = readFileSync(join(tmp, "notes/beliefs/b.md"), "utf-8");
    expect(text).toContain("— created\nSpawned after reading X: the claim held up\n");
    expect(text).not.toContain("After Spawned");
  });

  test("without --note the created entry says so instead of inventing a trigger", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "sb-bn-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    const cli = `${process.cwd()}/src/cli.ts`;
    await $`bun run ${cli} belief new b --scope=personal --title="B" --falsifier="F"`
      .cwd(tmp)
      .nothrow()
      .quiet();
    const text = readFileSync(join(tmp, "notes/beliefs/b.md"), "utf-8");
    expect(text).toContain("— created\nInitial belief; no trigger noted.\n");
  });

  test("creates trade-scoped belief in trade-namespaced repo", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "sb-bn-"));
    mkdirSync(join(tmp, "notes/trades/tpm/zettel"), { recursive: true });
    const cli = `${process.cwd()}/src/cli.ts`;
    const r = await $`bun run ${cli} belief new b1 --scope=tpm --title="B1" --falsifier="F"`
      .cwd(tmp)
      .nothrow()
      .quiet();
    expect(r.exitCode).toBe(0);
    expect(existsSync(join(tmp, "notes/trades/tpm/beliefs/b1.md"))).toBe(true);
  });

  test("rejects invalid slug", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "sb-bn-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    const cli = `${process.cwd()}/src/cli.ts`;
    const r = await $`bun run ${cli} belief new BadSlug --scope=personal --title=X --falsifier=F`
      .cwd(tmp)
      .nothrow()
      .quiet();
    expect(r.exitCode).toBe(2);
    expect(r.stderr.toString()).toContain("kebab-case");
  });

  test("rejects existing slug in any scope", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "sb-bn-"));
    mkdirSync(join(tmp, "notes/trades/tpm/zettel"), { recursive: true });
    const cli = `${process.cwd()}/src/cli.ts`;
    await $`bun run ${cli} belief new dup --scope=tpm --title="A" --falsifier="F"`
      .cwd(tmp)
      .nothrow()
      .quiet();
    const r = await $`bun run ${cli} belief new dup --scope=personal --title="B" --falsifier="F"`
      .cwd(tmp)
      .nothrow()
      .quiet();
    expect(r.exitCode).toBe(1);
    expect(r.stderr.toString()).toContain("already exists");
  });

  test("requires --title and --falsifier", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "sb-bn-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    const cli = `${process.cwd()}/src/cli.ts`;
    const r = await $`bun run ${cli} belief new x --scope=personal`.cwd(tmp).nothrow().quiet();
    expect(r.exitCode).toBe(2);
  });

  test("rejects trade scope on flat slip-box with actionable error", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "sb-bn-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    const cli = `${process.cwd()}/src/cli.ts`;
    const r = await $`bun run ${cli} belief new b1 --scope=tpm --title="B1" --falsifier="F"`
      .cwd(tmp)
      .nothrow()
      .quiet();
    expect(r.exitCode).not.toBe(0);
    const stderr = r.stderr.toString();
    expect(stderr).toContain("flat slip-box");
    expect(stderr).toContain("slipbox init --trade=tpm");
  });

  test("rejects mismatched trade scope with actionable error", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "sb-bn-"));
    mkdirSync(join(tmp, "notes/trades/tpm/zettel"), { recursive: true });
    const cli = `${process.cwd()}/src/cli.ts`;
    const r = await $`bun run ${cli} belief new b1 --scope=accounting --title="B1" --falsifier="F"`
      .cwd(tmp)
      .nothrow()
      .quiet();
    expect(r.exitCode).not.toBe(0);
    const stderr = r.stderr.toString();
    expect(stderr).toContain("active trade 'tpm'");
    expect(stderr).toContain("--trade=accounting");
  });
});
