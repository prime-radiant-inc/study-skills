import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { $ } from "bun";

const skel = (title: string, links: string[] = []) =>
  `---\ntitle: ${title}\nsource: ../sources/x.md\ncreated: 2026-05-02\nschema_version: 1\nlinks: [${links.join(", ")}]\n---\n\n# ${title}\n`;

describe("slipbox link/unlink", () => {
  let tmp: string;
  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), "slipbox-test-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    mkdirSync(join(tmp, "notes/sources"), { recursive: true });
    writeFileSync(join(tmp, "notes/zettel/a.md"), skel("A"));
    writeFileSync(join(tmp, "notes/zettel/b.md"), skel("B"));
  });
  afterEach(() => rmSync(tmp, { recursive: true, force: true }));

  test("link adds bidirectional link", async () => {
    const cli = `${process.cwd()}/src/cli.ts`;
    await $`bun run ${cli} link a b`.cwd(tmp);
    expect(readFileSync(join(tmp, "notes/zettel/a.md"), "utf-8")).toContain("links: [b]");
    expect(readFileSync(join(tmp, "notes/zettel/b.md"), "utf-8")).toContain("links: [a]");
  });

  test("link is idempotent", async () => {
    const cli = `${process.cwd()}/src/cli.ts`;
    await $`bun run ${cli} link a b`.cwd(tmp);
    await $`bun run ${cli} link a b`.cwd(tmp);
    expect(readFileSync(join(tmp, "notes/zettel/a.md"), "utf-8")).toContain("links: [b]");
    expect(readFileSync(join(tmp, "notes/zettel/a.md"), "utf-8").match(/links:.*b.*b/)).toBeNull();
  });

  test("unlink removes bidirectional link", async () => {
    const cli = `${process.cwd()}/src/cli.ts`;
    await $`bun run ${cli} link a b`.cwd(tmp);
    await $`bun run ${cli} unlink a b`.cwd(tmp);
    expect(readFileSync(join(tmp, "notes/zettel/a.md"), "utf-8")).toContain("links: []");
    expect(readFileSync(join(tmp, "notes/zettel/b.md"), "utf-8")).toContain("links: []");
  });

  test("link to nonexistent slug fails", async () => {
    const cli = `${process.cwd()}/src/cli.ts`;
    const res = await $`bun run ${cli} link a nonexistent`.cwd(tmp).nothrow();
    expect(res.exitCode).not.toBe(0);
  });
});
