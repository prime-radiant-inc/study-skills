import { describe, expect, test } from "bun:test";
import { $ } from "bun";

describe("CLI entry", () => {
  test("--version prints version", async () => {
    const out = await $`bun run src/cli.ts --version`.text();
    expect(out.trim()).toMatch(/^\d+\.\d+\.\d+/);
  });
});
