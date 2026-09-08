import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { $ } from "bun";

describe("slipbox stats", () => {
  let tmp: string;
  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), "slipbox-stats-"));
    mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
    mkdirSync(join(tmp, "notes/sources"), { recursive: true });
    writeFileSync(join(tmp, "notes/sources/x.md"), "# X\n");
    writeFileSync(
      join(tmp, "notes/zettel/hub.md"),
      "---\ntitle: hub\nsource: ../sources/x.md\ncreated: 2026-05-02\nlinks: [a, b]\n---\n\nHub.\n",
    );
    writeFileSync(
      join(tmp, "notes/zettel/a.md"),
      "---\ntitle: a\nsource: ../sources/x.md\ncreated: 2026-05-02\nlinks: [hub]\n---\n\nA.\n",
    );
    writeFileSync(
      join(tmp, "notes/zettel/b.md"),
      "---\ntitle: b\nsource: ../sources/x.md\ncreated: 2026-05-02\nlinks: [hub]\n---\n\nB.\n",
    );
    writeFileSync(
      join(tmp, "notes/zettel/orphan.md"),
      "---\ntitle: orphan\nsource: ../sources/x.md\ncreated: 2026-05-02\nlinks: []\n---\n\nOrphan.\n",
    );
  });
  afterEach(() => rmSync(tmp, { recursive: true, force: true }));

  test("reports counts and hubs", async () => {
    const cli = `${process.cwd()}/src/cli.ts`;
    const out = await $`bun run ${cli} stats --json`.cwd(tmp).text();
    const r = JSON.parse(out);
    expect(r.zettels).toBe(4);
    expect(r.forwardLinks).toBe(4);
    expect(r.orphans).toBe(1);
    expect(r.topHubs[0]?.slug).toBe("hub");
    expect(r.topHubs[0]?.degree).toBe(2);
  });

  test("reports belief counts (formation vs maintenance)", async () => {
    mkdirSync(join(tmp, "notes/beliefs"), { recursive: true });
    const today = new Date().toISOString().slice(0, 10);
    const old = "2025-01-01";
    // Belief formed today (in window).
    writeFileSync(
      join(tmp, "notes/beliefs/formed-today.md"),
      `---\ntitle: "formed today"\nscope: personal\nstatus: live\ncreated: ${today}\nlast_reviewed: ${today}\nfalsifier: "F"\nlinks: []\nschema_version: 1\n---\n\n# Why I hold this\n\nReasoning.\n\n# Revision log\n## ${today} — created\nNote.\n`,
    );
    // Belief formed long ago, reviewed today (maintenance).
    writeFileSync(
      join(tmp, "notes/beliefs/old-reviewed-today.md"),
      `---\ntitle: "old, reviewed today"\nscope: personal\nstatus: live\ncreated: ${old}\nlast_reviewed: ${today}\nfalsifier: "F"\nlinks: []\nschema_version: 1\n---\n\n# Why I hold this\n\nReasoning.\n\n# Revision log\n## ${today} — review\nNote.\n`,
    );
    // Belief formed long ago, never reviewed (stale).
    writeFileSync(
      join(tmp, "notes/beliefs/stale.md"),
      `---\ntitle: "stale"\nscope: personal\nstatus: live\ncreated: ${old}\nlast_reviewed: ${old}\nfalsifier: "F"\nlinks: []\nschema_version: 1\n---\n\n# Why I hold this\n\nReasoning.\n\n# Revision log\n## ${old} — created\nNote.\n`,
    );
    // Retired belief — counted in totals, excluded from formation/maintenance windows.
    writeFileSync(
      join(tmp, "notes/beliefs/retired.md"),
      `---\ntitle: "retired"\nscope: personal\nstatus: retired\ncreated: ${old}\nlast_reviewed: ${old}\nfalsifier: "F"\nlinks: []\nschema_version: 1\n---\n\n# Why I hold this\n\nReasoning.\n\n# Revision log\n## ${old} — created\nNote.\n`,
    );

    const cli = `${process.cwd()}/src/cli.ts`;
    const out = await $`bun run ${cli} stats --json --window=30`.cwd(tmp).text();
    const r = JSON.parse(out);
    expect(r.beliefs).toBeDefined();
    expect(r.beliefs.total).toBe(4);
    expect(r.beliefs.live).toBe(3);
    expect(r.beliefs.retired).toBe(1);
    expect(r.beliefs.formedInWindow).toBe(1); // formed-today
    expect(r.beliefs.reviewedInWindow).toBe(2); // formed-today + old-reviewed-today
    expect(r.beliefs.windowDays).toBe(30);
  });

  test("default window is 30 days when --window not passed", async () => {
    mkdirSync(join(tmp, "notes/beliefs"), { recursive: true });
    const cli = `${process.cwd()}/src/cli.ts`;
    const out = await $`bun run ${cli} stats --json`.cwd(tmp).text();
    const r = JSON.parse(out);
    expect(r.beliefs.windowDays).toBe(30);
  });
});
