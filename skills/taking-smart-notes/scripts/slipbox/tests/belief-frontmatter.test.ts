import { describe, expect, test } from "bun:test";
import { parseBelief, serializeBelief } from "../src/belief/frontmatter";

describe("belief frontmatter", () => {
  test("parses minimal live belief", () => {
    const text = `---
title: "Software estimation is forecasting under deep uncertainty"
scope: technical-pm
status: live
created: 2026-05-03
last_reviewed: 2026-05-03
falsifier: "I would be wrong if a domain emerged where requirements stabilize before implementation begins"
links: [spec-correctness-not-impl-correctness-is-the-hard-part]
schema_version: 1
---

# Why I hold this
Reasoning text.

# Revision log
## 2026-05-03 — created
After reading Brooks: initial belief.
`;
    const b = parseBelief(text);
    expect(b.frontmatter.title).toBe("Software estimation is forecasting under deep uncertainty");
    expect(b.frontmatter.scope).toBe("technical-pm");
    expect(b.frontmatter.status).toBe("live");
    expect(b.frontmatter.created).toBe("2026-05-03");
    expect(b.frontmatter.last_reviewed).toBe("2026-05-03");
    expect(b.frontmatter.falsifier).toContain("would be wrong");
    expect(b.frontmatter.links).toEqual(["spec-correctness-not-impl-correctness-is-the-hard-part"]);
    expect(b.frontmatter.superseded_by).toBeUndefined();
    expect(b.body).toContain("# Why I hold this");
  });

  test("parses superseded belief with superseded_by", () => {
    const text = `---
title: "Old position"
scope: personal
status: superseded
created: 2026-04-01
last_reviewed: 2026-05-03
falsifier: "X"
superseded_by: new-belief-slug
links: []
schema_version: 1
---

# Why I hold this
Body.

# Revision log
## 2026-04-01 — created
Initial.
## 2026-05-03 — superseded
Replaced by new-belief-slug.
`;
    const b = parseBelief(text);
    expect(b.frontmatter.status).toBe("superseded");
    expect(b.frontmatter.superseded_by).toBe("new-belief-slug");
  });

  test("round-trips ISO dates without coercing to Date", () => {
    const text = `---
title: "T"
scope: personal
status: live
created: 2026-05-03
last_reviewed: 2026-05-03
falsifier: "F"
links: []
schema_version: 1
---

Body.
`;
    const b = parseBelief(text);
    expect(typeof b.frontmatter.created).toBe("string");
    const out = serializeBelief(b.frontmatter, b.body);
    expect(out).toContain("created: 2026-05-03");
    expect(out).toContain("last_reviewed: 2026-05-03");
    expect(out).not.toContain("GMT");
  });

  test("round-trips title with embedded apostrophes", () => {
    const text = `---
title: "'X over Y' template applies beyond software"
scope: personal
status: live
created: 2026-05-03
last_reviewed: 2026-05-03
falsifier: "F"
links: []
schema_version: 1
---

Body.
`;
    const b = parseBelief(text);
    expect(b.frontmatter.title).toBe("'X over Y' template applies beyond software");
    const out = serializeBelief(b.frontmatter, b.body);
    const reparsed = parseBelief(out);
    expect(reparsed.frontmatter.title).toBe(b.frontmatter.title);
  });

  test("rejects invalid status", () => {
    const text = `---
title: "T"
scope: personal
status: bogus
created: 2026-05-03
last_reviewed: 2026-05-03
falsifier: "F"
links: []
schema_version: 1
---

Body.
`;
    expect(() => parseBelief(text)).toThrow(/status/);
  });

  test("rejects missing required fields", () => {
    const text = `---
title: "T"
scope: personal
status: live
created: 2026-05-03
links: []
schema_version: 1
---

Body.
`;
    // Missing last_reviewed and falsifier.
    expect(() => parseBelief(text)).toThrow();
  });
});
