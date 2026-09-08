import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { discoverSlipbox } from "../src/discovery";
import { SLUG_REGEX, listZettels, loadZettel, saveZettel } from "../src/zettel";

describe("zettel module", () => {
  let tmp: string;
  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), "slipbox-test-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    mkdirSync(join(tmp, "notes/sources"), { recursive: true });
  });
  afterEach(() => rmSync(tmp, { recursive: true, force: true }));

  test("SLUG_REGEX matches kebab-case", () => {
    expect(SLUG_REGEX.test("foo-bar-baz")).toBe(true);
    expect(SLUG_REGEX.test("foo")).toBe(true);
    expect(SLUG_REGEX.test("Foo")).toBe(false);
    expect(SLUG_REGEX.test("foo_bar")).toBe(false);
    expect(SLUG_REGEX.test("foo-")).toBe(false);
    expect(SLUG_REGEX.test("-foo")).toBe(false);
  });

  test("listZettels returns sorted slugs", () => {
    writeFileSync(join(tmp, "notes/zettel/b.md"), "---\ntitle: B\nlinks: []\n---\n");
    writeFileSync(join(tmp, "notes/zettel/a.md"), "---\ntitle: A\nlinks: []\n---\n");
    const sb = discoverSlipbox(tmp);
    expect(listZettels(sb)).toEqual(["a", "b"]);
  });

  test("loadZettel parses frontmatter and body", () => {
    writeFileSync(
      join(tmp, "notes/zettel/x.md"),
      "---\ntitle: X\nsource: ../sources/s.md\ncreated: 2026-05-02\nlinks: [y]\n---\n\nHello.\n",
    );
    const sb = discoverSlipbox(tmp);
    const z = loadZettel(sb, "x");
    expect(z.frontmatter.title).toBe("X");
    expect(z.body.trim()).toBe("Hello.");
    expect(z.frontmatter.links).toEqual(["y"]);
  });

  test("saveZettel writes atomically", () => {
    const sb = discoverSlipbox(tmp);
    saveZettel(sb, "newslug", {
      frontmatter: {
        title: "New",
        source: "../sources/s.md",
        created: "2026-05-02",
        schema_version: 1,
        links: [],
      },
      body: "# New\n\nBody.\n",
    });
    const z = loadZettel(sb, "newslug");
    expect(z.frontmatter.title).toBe("New");
    expect(z.frontmatter.schema_version).toBe(1);
  });
});
