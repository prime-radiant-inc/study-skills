import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { $ } from "bun";

describe("slipbox new", () => {
  let tmp: string;
  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), "slipbox-test-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    mkdirSync(join(tmp, "notes/sources"), { recursive: true });
  });
  afterEach(() => rmSync(tmp, { recursive: true, force: true }));

  test("creates skeleton with valid frontmatter", async () => {
    const cli = `${process.cwd()}/src/cli.ts`;
    await $`bun run ${cli} new my-slug --source=foo --title="My idea"`.cwd(tmp);
    const path = join(tmp, "notes/zettel/my-slug.md");
    expect(existsSync(path)).toBe(true);
    const text = readFileSync(path, "utf-8");
    expect(text).toContain('title: "My idea"');
    expect(text).toContain('source: "../sources/foo.md"');
    expect(text).toContain("schema_version: 1");
    expect(text).toContain("links: []");
    expect(text).toContain("# My idea");
  });

  test("rejects invalid slug", async () => {
    const cli = `${process.cwd()}/src/cli.ts`;
    const res = await $`bun run ${cli} new InvalidSlug`.cwd(tmp).nothrow();
    expect(res.exitCode).not.toBe(0);
    expect(res.stderr.toString()).toMatch(/kebab-case/);
  });

  test("refuses to overwrite existing", async () => {
    const cli = `${process.cwd()}/src/cli.ts`;
    await $`bun run ${cli} new dup --source=foo --title=One`.cwd(tmp);
    const res = await $`bun run ${cli} new dup --source=foo --title=Two`.cwd(tmp).nothrow();
    expect(res.exitCode).not.toBe(0);
    expect(res.stderr.toString()).toMatch(/exists/);
  });
});
