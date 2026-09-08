import { describe, expect, test } from "bun:test";
import { mkdtempSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { $ } from "bun";

async function setup() {
  const tmp = mkdtempSync(join(tmpdir(), "sb-brv-"));
  mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
  const cli = `${process.cwd()}/src/cli.ts`;
  await $`bun run ${cli} belief new b1 --scope=personal --title="B" --falsifier="F"`.cwd(tmp).quiet();
  return { tmp, cli };
}

describe("slipbox belief revise", () => {
  test("appends refined entry, bumps last_reviewed", async () => {
    const { tmp, cli } = await setup();
    const r = await $`bun run ${cli} belief revise b1 --note="Brooks introduced X; now hold Y' instead of Y"`.cwd(tmp).nothrow().quiet();
    expect(r.exitCode).toBe(0);
    const text = readFileSync(join(tmp, "notes/beliefs/b1.md"), "utf-8");
    expect(text).toMatch(/— refined/);
    expect(text).toContain("Brooks introduced X");
  });

  test("--status=retired updates frontmatter and log", async () => {
    const { tmp, cli } = await setup();
    const r = await $`bun run ${cli} belief revise b1 --status=retired --note="No longer applies"`.cwd(tmp).nothrow().quiet();
    expect(r.exitCode).toBe(0);
    const text = readFileSync(join(tmp, "notes/beliefs/b1.md"), "utf-8");
    expect(text).toContain("status: retired");
    expect(text).toMatch(/— retired/);
  });

  test("--status=superseded requires --superseded-by", async () => {
    const { tmp, cli } = await setup();
    const r = await $`bun run ${cli} belief revise b1 --status=superseded --note="Replaced"`.cwd(tmp).nothrow().quiet();
    expect(r.exitCode).toBe(2);
    expect(r.stderr.toString()).toContain("superseded-by");
  });

  test("--superseded-by sets the field", async () => {
    const { tmp, cli } = await setup();
    await $`bun run ${cli} belief new b2 --scope=personal --title="B2" --falsifier="F"`.cwd(tmp).quiet();
    const r = await $`bun run ${cli} belief revise b1 --status=superseded --superseded-by=b2 --note="Replaced by b2"`.cwd(tmp).nothrow().quiet();
    expect(r.exitCode).toBe(0);
    const text = readFileSync(join(tmp, "notes/beliefs/b1.md"), "utf-8");
    expect(text).toContain("superseded_by: b2");
  });

  test("requires --note", async () => {
    const { tmp, cli } = await setup();
    const r = await $`bun run ${cli} belief revise b1`.cwd(tmp).nothrow().quiet();
    expect(r.exitCode).toBe(2);
  });

  test("--superseded-by must resolve to an existing belief", async () => {
    const { tmp, cli } = await setup();
    const r = await $`bun run ${cli} belief revise b1 --status=superseded --superseded-by=ghost --note="x"`.cwd(tmp).nothrow().quiet();
    expect(r.exitCode).toBe(1);
    expect(r.stderr.toString()).toContain("ghost");
  });

  test("rejects self-supersede", async () => {
    const { tmp, cli } = await setup();
    const r = await $`bun run ${cli} belief revise b1 --status=superseded --superseded-by=b1 --note="x"`.cwd(tmp).nothrow().quiet();
    expect(r.exitCode).toBe(2);
    expect(r.stderr.toString()).toMatch(/itself|self/i);
  });

  test("rejects unknown --status value", async () => {
    const { tmp, cli } = await setup();
    const r = await $`bun run ${cli} belief revise b1 --status=bogus --note="x"`.cwd(tmp).nothrow().quiet();
    expect(r.exitCode).toBe(2);
    expect(r.stderr.toString()).toMatch(/unknown --status/);
  });
});
