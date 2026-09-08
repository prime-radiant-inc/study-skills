import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { $ } from "bun";

describe("slipbox check", () => {
  let tmp: string;
  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), "slipbox-test-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    mkdirSync(join(tmp, "notes/sources"), { recursive: true });
  });
  afterEach(() => rmSync(tmp, { recursive: true, force: true }));

  test("clean slip-box reports zero asymmetric/broken", async () => {
    writeFileSync(
      join(tmp, "notes/zettel/a.md"),
      "---\ntitle: A\nsource: ../sources/x.md\ncreated: 2026-05-02\nlinks: [b]\n---\n\nBody.\n",
    );
    writeFileSync(
      join(tmp, "notes/zettel/b.md"),
      "---\ntitle: B\nsource: ../sources/x.md\ncreated: 2026-05-02\nlinks: [a]\n---\n\nBody.\n",
    );
    writeFileSync(join(tmp, "notes/sources/x.md"), "# X\n");
    const cli = `${process.cwd()}/src/cli.ts`;
    const out = await $`bun run ${cli} check`.cwd(tmp).text();
    expect(out).toMatch(/Asymmetric: 0/);
    expect(out).toMatch(/Broken: 0/);
  });

  test("detects asymmetric links", async () => {
    writeFileSync(
      join(tmp, "notes/zettel/a.md"),
      "---\ntitle: A\nsource: ../sources/x.md\ncreated: 2026-05-02\nlinks: [b]\n---\n\nBody.\n",
    );
    writeFileSync(
      join(tmp, "notes/zettel/b.md"),
      "---\ntitle: B\nsource: ../sources/x.md\ncreated: 2026-05-02\nlinks: []\n---\n\nBody.\n",
    );
    writeFileSync(join(tmp, "notes/sources/x.md"), "# X\n");
    const cli = `${process.cwd()}/src/cli.ts`;
    const res = await $`bun run ${cli} check`.cwd(tmp).nothrow();
    expect(res.exitCode).not.toBe(0);
    expect(res.stdout.toString()).toMatch(/Asymmetric: 1/);
  });

  test("--strict flags missing schema_version when set", async () => {
    writeFileSync(
      join(tmp, "notes/zettel/old.md"),
      "---\ntitle: Old\nsource: ../sources/x.md\ncreated: 2026-04-01\nlinks: []\n---\n\nBody.\n",
    );
    writeFileSync(join(tmp, "notes/sources/x.md"), "# X\n");
    const cli = `${process.cwd()}/src/cli.ts`;
    const out = await $`bun run ${cli} check --strict`.cwd(tmp).text();
    expect(out).toMatch(/stale isolates: 1/);
  });
});
