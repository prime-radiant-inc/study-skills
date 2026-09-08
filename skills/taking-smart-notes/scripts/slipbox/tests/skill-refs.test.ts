import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { $ } from "bun";

// Skills cite slip-box artifacts in a `## Deeper context` section: the first
// backticked slug of each bullet is a reference to a zettel, belief, or source.
// `check --strict` must validate those references; `rename` must rewrite them.

const cli = `${process.cwd()}/src/cli.ts`;

function scaffold(tmp: string) {
  mkdirSync(join(tmp, "notes/zettel"), { recursive: true });
  mkdirSync(join(tmp, "notes/sources"), { recursive: true });
}

function skillBody(refs: { belief: string; zettel: string; extra?: string }): string {
  return `# A Skill

Use \`slipbox check\` often. Body prose cites \`${refs.zettel}\` inline.

## Deeper context (load on demand)

- **Belief:** \`${refs.belief}\` — the operational commitment
- \`${refs.zettel}\` — load when \`some-other-token\` shows up in the annotation
${refs.extra ? `- \`${refs.extra}\` — load when testing\n` : ""}
## Unrelated section

Backticked \`not-a-slip-box-slug\` here must be ignored.
`;
}

describe("check --strict validates skill Deeper-context references", () => {
  let tmp: string;
  beforeEach(async () => {
    tmp = mkdtempSync(join(tmpdir(), "sb-skill-"));
    scaffold(tmp);
    writeFileSync(join(tmp, "notes/sources/some-source.md"), "# Source\n");
    await $`bun run ${cli} new real-zettel --source=some-source --title="Z"`.cwd(tmp).quiet();
    await $`bun run ${cli} belief new real-belief --scope=personal --title="B" --falsifier="F"`
      .cwd(tmp)
      .quiet();
  });
  afterEach(() => rmSync(tmp, { recursive: true, force: true }));

  test("resolvable refs pass (zettel, belief, and source)", async () => {
    mkdirSync(join(tmp, "skills/a-skill"), { recursive: true });
    writeFileSync(
      join(tmp, "skills/a-skill/SKILL.md"),
      skillBody({ belief: "real-belief", zettel: "real-zettel", extra: "some-source" }),
    );
    const r = await $`bun run ${cli} check --strict`.cwd(tmp).nothrow().quiet();
    expect(r.stdout.toString()).toContain("skill refs: 3");
    expect(r.exitCode).toBe(0);
  });

  test("broken ref fails strict check and names file and slug", async () => {
    mkdirSync(join(tmp, "skills/a-skill"), { recursive: true });
    writeFileSync(
      join(tmp, "skills/a-skill/SKILL.md"),
      skillBody({ belief: "real-belief", zettel: "real-zettel", extra: "missing-zettel" }),
    );
    const r = await $`bun run ${cli} check --strict`.cwd(tmp).nothrow().quiet();
    expect(r.exitCode).not.toBe(0);
    const out = r.stdout.toString() + r.stderr.toString();
    expect(out).toMatch(/skill-broken:.*a-skill\/SKILL\.md -> missing-zettel/);
  });

  test("backticked tokens outside Deeper context and non-leading tokens are ignored", async () => {
    mkdirSync(join(tmp, "skills/a-skill"), { recursive: true });
    // `slipbox`, `some-other-token`, `not-a-slip-box-slug` never resolve; only
    // the section's leading bullet tokens count, so this must pass.
    writeFileSync(
      join(tmp, "skills/a-skill/SKILL.md"),
      skillBody({ belief: "real-belief", zettel: "real-zettel" }),
    );
    const r = await $`bun run ${cli} check --strict`.cwd(tmp).nothrow().quiet();
    expect(r.exitCode).toBe(0);
  });

  test("SLIPBOX_SKILLS_DIRS overrides the default skills location", async () => {
    mkdirSync(join(tmp, "harness/skills/b-skill"), { recursive: true });
    writeFileSync(
      join(tmp, "harness/skills/b-skill/SKILL.md"),
      skillBody({ belief: "real-belief", zettel: "real-zettel", extra: "missing-zettel" }),
    );
    const r = await $`bun run ${cli} check --strict`
      .cwd(tmp)
      .env({ ...process.env, SLIPBOX_SKILLS_DIRS: "harness/skills" })
      .nothrow()
      .quiet();
    expect(r.exitCode).not.toBe(0);
    const out = r.stdout.toString() + r.stderr.toString();
    expect(out).toContain("missing-zettel");
  });

  test("non-strict check ignores skill references", async () => {
    mkdirSync(join(tmp, "skills/a-skill"), { recursive: true });
    writeFileSync(
      join(tmp, "skills/a-skill/SKILL.md"),
      skillBody({ belief: "real-belief", zettel: "real-zettel", extra: "missing-zettel" }),
    );
    const r = await $`bun run ${cli} check`.cwd(tmp).nothrow().quiet();
    expect(r.exitCode).toBe(0);
  });
});

describe("rename rewrites skill references", () => {
  let tmp: string;
  beforeEach(async () => {
    tmp = mkdtempSync(join(tmpdir(), "sb-skill-"));
    scaffold(tmp);
    writeFileSync(join(tmp, "notes/sources/some-source.md"), "# Source\n");
    await $`bun run ${cli} new old-name --source=some-source --title="Z"`.cwd(tmp).quiet();
  });
  afterEach(() => rmSync(tmp, { recursive: true, force: true }));

  test("backticked and wikilink refs in skill files are rewritten", async () => {
    mkdirSync(join(tmp, "skills/a-skill"), { recursive: true });
    writeFileSync(
      join(tmp, "skills/a-skill/SKILL.md"),
      "# A Skill\n\nBody cites `old-name` and [[old-name]].\n\n" +
        "## Deeper context (load on demand)\n\n- `old-name` — load when testing\n",
    );
    await $`bun run ${cli} rename old-name new-name`.cwd(tmp).quiet();
    const text = readFileSync(join(tmp, "skills/a-skill/SKILL.md"), "utf-8");
    expect(text).toContain("`new-name`");
    expect(text).toContain("[[new-name]]");
    expect(text).not.toContain("old-name");
  });

  test("unrelated backticked tokens are untouched", async () => {
    mkdirSync(join(tmp, "skills/a-skill"), { recursive: true });
    writeFileSync(
      join(tmp, "skills/a-skill/SKILL.md"),
      "# A Skill\n\nRun `slipbox check` and cite `old-name-extended` (a different slug).\n",
    );
    await $`bun run ${cli} rename old-name new-name`.cwd(tmp).quiet();
    const text = readFileSync(join(tmp, "skills/a-skill/SKILL.md"), "utf-8");
    expect(text).toContain("`slipbox check`");
    expect(text).toContain("`old-name-extended`");
  });
});
