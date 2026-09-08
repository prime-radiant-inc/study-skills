import { describe, expect, test } from "bun:test";
import { $ } from "bun";

describe("dispatch", () => {
  test("unknown subcommand exits non-zero", async () => {
    const res = await $`bun run src/cli.ts notarealcommand`.nothrow();
    expect(res.exitCode).not.toBe(0);
  });

  test("--help lists subcommands", async () => {
    const out = await $`bun run src/cli.ts --help`.text();
    expect(out).toContain("new");
    expect(out).toContain("link");
    expect(out).toContain("check");
  });
});
