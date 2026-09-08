import { describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { findBelief, listBeliefs, saveBelief } from "../src/belief/io";
import { discoverSlipbox } from "../src/discovery";

function mkSlipbox(layout: "flat" | "trade"): {
  tmp: string;
  sb: ReturnType<typeof discoverSlipbox>;
} {
  const tmp = mkdtempSync(join(tmpdir(), "slipbox-bio-"));
  if (layout === "flat") {
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    mkdirSync(join(tmp, "notes/beliefs"), { recursive: true });
  } else {
    mkdirSync(join(tmp, "notes/trades/tpm/zettel"), { recursive: true });
    mkdirSync(join(tmp, "notes/trades/tpm/beliefs"), { recursive: true });
    mkdirSync(join(tmp, "notes/beliefs"), { recursive: true });
  }
  return { tmp, sb: discoverSlipbox(tmp) };
}

const minimalBelief = (title: string, scope: string) => ({
  frontmatter: {
    title,
    scope,
    status: "live" as const,
    created: "2026-05-03",
    last_reviewed: "2026-05-03",
    falsifier: "F",
    links: [],
    schema_version: 1,
  },
  body: "\n# Why I hold this\n\nBody.\n\n# Revision log\n## 2026-05-03 — created\nInitial.\n",
});

describe("belief io", () => {
  test("save then find a personal belief in flat layout", () => {
    const { sb } = mkSlipbox("flat");
    saveBelief(sb, "foo", "personal", minimalBelief("Foo", "personal"));
    const found = findBelief(sb, "foo");
    expect(found?.scope).toBe("personal");
    expect(found?.parsed.frontmatter.title).toBe("Foo");
  });

  test("save then find a trade-scoped belief", () => {
    const { sb } = mkSlipbox("trade");
    saveBelief(sb, "bar", "tpm", minimalBelief("Bar", "tpm"));
    const found = findBelief(sb, "bar");
    expect(found?.scope).toBe("tpm");
  });

  test("error on slug collision across scopes", () => {
    const { sb } = mkSlipbox("trade");
    saveBelief(sb, "dup", "personal", minimalBelief("Dup-personal", "personal"));
    saveBelief(sb, "dup", "tpm", minimalBelief("Dup-trade", "tpm"));
    expect(() => findBelief(sb, "dup")).toThrow(/ambiguous/);
  });

  test("returns null for missing slug", () => {
    const { sb } = mkSlipbox("flat");
    expect(findBelief(sb, "missing")).toBeNull();
  });

  test("listBeliefs returns all beliefs across scopes", () => {
    const { sb } = mkSlipbox("trade");
    saveBelief(sb, "p1", "personal", minimalBelief("P1", "personal"));
    saveBelief(sb, "t1", "tpm", minimalBelief("T1", "tpm"));
    const list = listBeliefs(sb);
    expect(list.length).toBe(2);
    expect(list.find((b) => b.slug === "p1")?.scope).toBe("personal");
    expect(list.find((b) => b.slug === "t1")?.scope).toBe("tpm");
  });
});
