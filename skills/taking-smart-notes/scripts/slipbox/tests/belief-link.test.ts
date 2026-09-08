import { describe, expect, test } from "bun:test";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { $ } from "bun";

async function setup() {
  const tmp = mkdtempSync(join(tmpdir(), "sb-blnk-"));
  mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
  const cli = `${process.cwd()}/src/cli.ts`;
  await $`bun run ${cli} belief new b1 --scope=personal --title="B1" --falsifier="F"`.cwd(tmp).quiet();
  await $`bun run ${cli} belief new b2 --scope=personal --title="B2" --falsifier="F"`.cwd(tmp).quiet();
  await $`bun run ${cli} new z1 --source=foo --title="Z1"`.cwd(tmp).quiet();
  return { tmp, cli };
}

describe("slipbox belief link", () => {
  test("belief → zettel: both endpoints updated", async () => {
    const { tmp, cli } = await setup();
    const r = await $`bun run ${cli} belief link b1 z1`.cwd(tmp).nothrow().quiet();
    expect(r.exitCode).toBe(0);
    const beliefText = readFileSync(join(tmp, "notes/beliefs/b1.md"), "utf-8");
    const zettelText = readFileSync(join(tmp, "notes/zettel/z1.md"), "utf-8");
    expect(beliefText).toContain("links: [z1]");
    expect(zettelText).toContain("Z1");
    expect(zettelText).toMatch(/links:.*b1/);
  });

  test("belief → belief: both endpoints updated", async () => {
    const { tmp, cli } = await setup();
    const r = await $`bun run ${cli} belief link b1 b2`.cwd(tmp).nothrow().quiet();
    expect(r.exitCode).toBe(0);
    const b1 = readFileSync(join(tmp, "notes/beliefs/b1.md"), "utf-8");
    const b2 = readFileSync(join(tmp, "notes/beliefs/b2.md"), "utf-8");
    expect(b1).toMatch(/links:.*b2/);
    expect(b2).toMatch(/links:.*b1/);
  });

  test("idempotent: linking twice does not duplicate", async () => {
    const { tmp, cli } = await setup();
    await $`bun run ${cli} belief link b1 z1`.cwd(tmp).quiet();
    await $`bun run ${cli} belief link b1 z1`.cwd(tmp).quiet();
    const text = readFileSync(join(tmp, "notes/beliefs/b1.md"), "utf-8");
    const occurrences = (text.match(/z1/g) || []).length;
    expect(occurrences).toBe(1);
  });

  test("error if first arg is not a belief", async () => {
    const { tmp, cli } = await setup();
    const r = await $`bun run ${cli} belief link z1 b1`.cwd(tmp).nothrow().quiet();
    expect(r.exitCode).toBe(2);
    expect(r.stderr.toString()).toMatch(/not a belief|first.+belief/i);
  });

  test("error if other endpoint not found", async () => {
    const { tmp, cli } = await setup();
    const r = await $`bun run ${cli} belief link b1 nonexistent`.cwd(tmp).nothrow().quiet();
    expect(r.exitCode).toBe(1);
    expect(r.stderr.toString()).toContain("not found");
  });

  test("belief → source: belief side updated, source untouched", async () => {
    const { tmp, cli } = await setup();
    // Hand-create a source note (no CLI command for sources yet)
    const sourceContent = "# A source note\n\nSome bibliographic content.\n";
    mkdirSync(join(tmp, "notes/sources"), { recursive: true });
    writeFileSync(join(tmp, "notes/sources/some-source.md"), sourceContent);

    const r = await $`bun run ${cli} belief link b1 some-source`.cwd(tmp).nothrow().quiet();
    expect(r.exitCode).toBe(0);
    const beliefText = readFileSync(join(tmp, "notes/beliefs/b1.md"), "utf-8");
    expect(beliefText).toContain("links: [some-source]");
    // Source file is byte-identical
    const afterSource = readFileSync(join(tmp, "notes/sources/some-source.md"), "utf-8");
    expect(afterSource).toBe(sourceContent);
    // Output should print only the forward arrow, no back-reference line
    const stdout = r.stdout.toString();
    expect(stdout).toMatch(/\+ b1 -> some-source/);
    expect(stdout).not.toMatch(/\+ some-source -> b1/);
  });
});
