import { describe, expect, test } from "bun:test";
import { cpSync, existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { $ } from "bun";

// The plugin cache ships the CLI source without node_modules. The launcher
// must install dependencies itself on first use so the first slipbox call in
// a fresh install works instead of failing on module resolution.
describe("slipbox launcher", () => {
  test("installs dependencies when node_modules is missing, then runs the command", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "slipbox-launcher-"));
    for (const f of ["slipbox", "package.json", "bun.lock", "tsconfig.json", "src"]) {
      cpSync(join(process.cwd(), f), join(tmp, f), { recursive: true });
    }
    expect(existsSync(join(tmp, "node_modules"))).toBe(false);
    const r = await $`${join(tmp, "slipbox")} --help`.nothrow().quiet();
    expect(r.exitCode).toBe(0);
    expect(r.stdout.toString()).toContain("Usage");
    expect(existsSync(join(tmp, "node_modules/gray-matter"))).toBe(true);
    expect(r.stderr.toString()).toContain("installing dependencies");
  }, 180000);

  test("does not reinstall when node_modules is present", async () => {
    const r = await $`${join(process.cwd(), "slipbox")} --help`.nothrow().quiet();
    expect(r.exitCode).toBe(0);
    expect(r.stderr.toString()).not.toContain("installing dependencies");
  }, 60000);
});
