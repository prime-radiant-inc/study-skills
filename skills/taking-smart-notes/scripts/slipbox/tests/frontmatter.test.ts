import { describe, expect, test } from "bun:test";
import { parseFrontmatter, serializeFrontmatter } from "../src/frontmatter";

describe("frontmatter", () => {
  test("parses minimal v1 zettel", () => {
    const text = `---
title: Test idea
source: ../sources/foo.md
created: 2026-05-02
schema_version: 1
links: [a, b]
---

Body text.

Source: Author 2026.
`;
    const fm = parseFrontmatter(text);
    expect(fm.frontmatter.title).toBe("Test idea");
    expect(fm.frontmatter.schema_version).toBe(1);
    expect(fm.frontmatter.links).toEqual(["a", "b"]);
    expect(fm.body.trim().startsWith("Body text.")).toBe(true);
  });

  test("parses v0 zettel (no schema_version)", () => {
    const text = `---
title: Old
source: ../sources/x.md
created: 2026-05-01
links: []
---

Body.
`;
    const fm = parseFrontmatter(text);
    expect(fm.frontmatter.schema_version).toBeUndefined();
    expect(fm.frontmatter.links).toEqual([]);
  });

  test("serializes round-trip preserves links order", () => {
    const text = `---
title: T
source: ../sources/s.md
created: 2026-05-02
schema_version: 1
links: [c, a, b]
---

Body
`;
    const parsed = parseFrontmatter(text);
    const out = serializeFrontmatter(parsed.frontmatter, parsed.body);
    expect(out).toContain("links: [c, a, b]");
  });

  test("body excludes frontmatter delimiters", () => {
    const text = `---
title: T
links: []
---

Hello.
`;
    const fm = parseFrontmatter(text);
    expect(fm.body).not.toContain("---");
  });

  test("round-trips ISO date in created without coercing to Date", () => {
    const text = `---
title: T
source: ../sources/s.md
created: 2026-05-02
links: []
---

Body.
`;
    const parsed = parseFrontmatter(text);
    expect(typeof parsed.frontmatter.created).toBe("string");
    expect(parsed.frontmatter.created).toBe("2026-05-02");
    const out = serializeFrontmatter(parsed.frontmatter, parsed.body);
    expect(out).toContain("created: 2026-05-02");
    expect(out).not.toContain("GMT");
    expect(out).not.toContain("T00:00:00");
  });

  test("round-trips title with embedded apostrophes byte-stably", () => {
    const text = `---
title: "'X over Y, but Y still has value' is a portable template"
source: ../sources/s.md
created: 2026-05-01
links: [a, b]
---

Body.
`;
    const parsed = parseFrontmatter(text);
    expect(parsed.frontmatter.title).toBe(
      "'X over Y, but Y still has value' is a portable template",
    );
    const out = serializeFrontmatter(parsed.frontmatter, parsed.body);
    const reparsed = parseFrontmatter(out);
    expect(reparsed.frontmatter.title).toBe(parsed.frontmatter.title);
  });

  test("parses title containing a colon", () => {
    const text = `---
title: Buy versus build: do none of the work
source: ../sources/brooks.md
created: 2026-05-02
links: [foo, bar]
---

Body.
`;
    const fm = parseFrontmatter(text);
    expect(fm.frontmatter.title).toBe("Buy versus build: do none of the work");
    expect(fm.frontmatter.links).toEqual(["foo", "bar"]);
  });
});
