import { describe, expect, test } from "bun:test";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { $ } from "bun";

describe("slipbox check --strict for beliefs", () => {
  test("clean belief passes strict check", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "sb-bc-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    const cli = `${process.cwd()}/src/cli.ts`;
    await $`bun run ${cli} belief new b1 --scope=personal --title="B" --falsifier="F"`.cwd(tmp).quiet();
    const r = await $`bun run ${cli} check --strict`.cwd(tmp).nothrow().quiet();
    expect(r.exitCode).toBe(0);
  });

  test("missing required field flagged", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "sb-bc-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    mkdirSync(join(tmp, "notes/beliefs"), { recursive: true });
    // hand-write a malformed belief file (missing falsifier)
    writeFileSync(
      join(tmp, "notes/beliefs/bad.md"),
      `---
title: "T"
scope: personal
status: live
created: 2026-05-03
last_reviewed: 2026-05-03
links: []
schema_version: 1
---
Body.
`,
    );
    const cli = `${process.cwd()}/src/cli.ts`;
    const r = await $`bun run ${cli} check --strict`.cwd(tmp).nothrow().quiet();
    expect(r.exitCode).not.toBe(0);
    expect(r.stdout.toString() + r.stderr.toString()).toMatch(/falsifier|schema/);
  });

  test("asymmetric belief→zettel link flagged", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "sb-bc-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    mkdirSync(join(tmp, "notes/beliefs"), { recursive: true });
    const cli = `${process.cwd()}/src/cli.ts`;
    await $`bun run ${cli} belief new b1 --scope=personal --title="B" --falsifier="F"`.cwd(tmp).quiet();
    await $`bun run ${cli} new z1 --source=foo --title="Z"`.cwd(tmp).quiet();
    // Manually edit belief to add link without symmetry
    const bp = join(tmp, "notes/beliefs/b1.md");
    const t = readFileSync(bp, "utf-8");
    writeFileSync(bp, t.replace("links: []", "links: [z1]"));
    const r = await $`bun run ${cli} check --strict`.cwd(tmp).nothrow().quiet();
    expect(r.exitCode).not.toBe(0);
    expect(r.stdout.toString() + r.stderr.toString()).toMatch(/asymmetric/);
  });

  test("dangling superseded_by flagged", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "sb-bc-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    const cli = `${process.cwd()}/src/cli.ts`;
    await $`bun run ${cli} belief new b1 --scope=personal --title="B" --falsifier="F"`.cwd(tmp).quiet();
    // Manually set superseded_by to a non-existent slug, change status
    const bp = join(tmp, "notes/beliefs/b1.md");
    const t = readFileSync(bp, "utf-8");
    writeFileSync(
      bp,
      t.replace(
        "schema_version: 1",
        "schema_version: 1\nsuperseded_by: ghost",
      ).replace("status: live", "status: superseded"),
    );
    const r = await $`bun run ${cli} check --strict`.cwd(tmp).nothrow().quiet();
    expect(r.exitCode).not.toBe(0);
    expect(r.stdout.toString() + r.stderr.toString()).toMatch(/superseded_by|ghost/);
  });

  test("status=superseded without superseded_by flagged", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "sb-bc-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    const cli = `${process.cwd()}/src/cli.ts`;
    await $`bun run ${cli} belief new b1 --scope=personal --title="B" --falsifier="F"`.cwd(tmp).quiet();
    // Change status without setting superseded_by
    const bp = join(tmp, "notes/beliefs/b1.md");
    const t = readFileSync(bp, "utf-8");
    writeFileSync(bp, t.replace("status: live", "status: superseded"));
    const r = await $`bun run ${cli} check --strict`.cwd(tmp).nothrow().quiet();
    expect(r.exitCode).not.toBe(0);
    expect(r.stdout.toString() + r.stderr.toString()).toMatch(/superseded_by not set|schema/);
  });

  test("asymmetric belief→belief link flagged", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "sb-bc-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    const cli = `${process.cwd()}/src/cli.ts`;
    await $`bun run ${cli} belief new b1 --scope=personal --title="B1" --falsifier="F"`.cwd(tmp).quiet();
    await $`bun run ${cli} belief new b2 --scope=personal --title="B2" --falsifier="F"`.cwd(tmp).quiet();
    // Manually edit b1 to link to b2 without symmetry
    const bp = join(tmp, "notes/beliefs/b1.md");
    const t = readFileSync(bp, "utf-8");
    writeFileSync(bp, t.replace("links: []", "links: [b2]"));
    const r = await $`bun run ${cli} check --strict`.cwd(tmp).nothrow().quiet();
    expect(r.exitCode).not.toBe(0);
    expect(r.stdout.toString() + r.stderr.toString()).toMatch(/asymmetric.*b1.*b2|b1 -> b2/);
  });

  test("cross-scope slug collision flagged", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "sb-bc-"));
    mkdirSync(join(tmp, "notes/trades/tpm/zettel"), { recursive: true });
    mkdirSync(join(tmp, "notes/trades/tpm/beliefs"), { recursive: true });
    mkdirSync(join(tmp, "notes/beliefs"), { recursive: true });
    const minimal = (title: string, scope: string) =>
      `---\ntitle: ${JSON.stringify(title)}\nscope: ${scope}\nstatus: live\ncreated: 2026-05-03\nlast_reviewed: 2026-05-03\nfalsifier: "F"\nlinks: []\nschema_version: 1\n---\n\nBody.\n`;
    writeFileSync(join(tmp, "notes/beliefs/dup.md"), minimal("Personal version", "personal"));
    writeFileSync(join(tmp, "notes/trades/tpm/beliefs/dup.md"), minimal("Trade version", "tpm"));
    const cli = `${process.cwd()}/src/cli.ts`;
    const r = await $`bun run ${cli} check --strict`.cwd(tmp).nothrow().quiet();
    expect(r.exitCode).not.toBe(0);
    expect(r.stdout.toString() + r.stderr.toString()).toMatch(
      /multiple scopes|exists in.*personal.*tpm|exists in.*tpm.*personal/,
    );
  });

  test("zettel→belief asymmetry reported as asymmetric, not broken", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "sb-bc-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    const cli = `${process.cwd()}/src/cli.ts`;
    await $`bun run ${cli} belief new b1 --scope=personal --title="B" --falsifier="F"`.cwd(tmp).quiet();
    await $`bun run ${cli} new z1 --source=foo --title="Z"`.cwd(tmp).quiet();
    // Manually edit z1 to add a link to b1 without symmetry
    const zp = join(tmp, "notes/zettel/z1.md");
    const t = readFileSync(zp, "utf-8");
    writeFileSync(zp, t.replace("links: []", "links: [b1]"));
    const r = await $`bun run ${cli} check --strict`.cwd(tmp).nothrow().quiet();
    expect(r.exitCode).not.toBe(0);
    const out = r.stdout.toString() + r.stderr.toString();
    expect(out).toMatch(/asymmetric.*zettel:z1.*belief:b1|asymmetric.*z1 -> b1/);
    expect(out).not.toMatch(/broken: z1 -> b1/);
  });
});
