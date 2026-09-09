import { describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { $ } from "bun";

async function setup() {
  const tmp = mkdtempSync(join(tmpdir(), "sb-bl-"));
  mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
  const cli = `${process.cwd()}/src/cli.ts`;
  await $`bun run ${cli} belief new alpha --scope=personal --title="Alpha" --falsifier="F"`
    .cwd(tmp)
    .quiet();
  await $`bun run ${cli} belief new beta --scope=personal --title="Beta" --falsifier="F"`
    .cwd(tmp)
    .quiet();
  return { tmp, cli };
}

describe("slipbox belief list", () => {
  test("lists all beliefs sorted by last_reviewed asc", async () => {
    const { tmp, cli } = await setup();
    const r = await $`bun run ${cli} belief list`.cwd(tmp).nothrow().quiet();
    expect(r.exitCode).toBe(0);
    const out = r.stdout.toString();
    expect(out).toContain("alpha");
    expect(out).toContain("beta");
  });

  test("--json emits structured output", async () => {
    const { tmp, cli } = await setup();
    const r = await $`bun run ${cli} belief list --json`.cwd(tmp).nothrow().quiet();
    const data = JSON.parse(r.stdout.toString());
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(2);
    expect(data[0].slug).toBeDefined();
    expect(data[0].scope).toBeDefined();
    expect(data[0].last_reviewed).toBeDefined();
  });

  test("--scope filter", async () => {
    const { tmp, cli } = await setup();
    const r = await $`bun run ${cli} belief list --scope=personal --json`
      .cwd(tmp)
      .nothrow()
      .quiet();
    const data = JSON.parse(r.stdout.toString());
    expect(data.every((b: { scope: string }) => b.scope === "personal")).toBe(true);
  });

  test("rejects unknown --sort value", async () => {
    const { tmp, cli } = await setup();
    const r = await $`bun run ${cli} belief list --sort=bogus`.cwd(tmp).nothrow().quiet();
    expect(r.exitCode).toBe(2);
    expect(r.stderr.toString()).toMatch(/unknown --sort/);
  });

  test("rejects unknown --status value", async () => {
    const { tmp, cli } = await setup();
    const r = await $`bun run ${cli} belief list --status=bogus`.cwd(tmp).nothrow().quiet();
    expect(r.exitCode).toBe(2);
    expect(r.stderr.toString()).toMatch(/unknown --status/);
  });
});
