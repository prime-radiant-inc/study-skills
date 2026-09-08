import matter from "gray-matter";

export type BeliefStatus = "live" | "superseded" | "retired";

export interface BeliefFrontmatter {
  title: string;
  scope: string; // "personal" or trade slug
  status: BeliefStatus;
  created: string;
  last_reviewed: string;
  falsifier: string;
  superseded_by?: string;
  links: string[];
  schema_version: number;
}

export interface ParsedBelief {
  frontmatter: BeliefFrontmatter;
  body: string;
}

const VALID_STATUSES: readonly BeliefStatus[] = ["live", "superseded", "retired"] as const;

function coerceDate(v: unknown): string {
  if (v == null) return "";
  if (v instanceof Date) {
    const y = v.getUTCFullYear();
    const m = String(v.getUTCMonth() + 1).padStart(2, "0");
    const d = String(v.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return String(v);
}

function yamlDoubleQuoted(s: string): string {
  return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function quoteColonValues(yamlText: string): string {
  return yamlText.replace(
    /^(title|falsifier|superseded_by):\s+(.+)$/gm,
    (_match, key, value) => {
      if (value.includes(": ") && !value.startsWith('"') && !value.startsWith("'")) {
        return `${key}: "${value.replace(/"/g, '\\"')}"`;
      }
      return _match;
    },
  );
}

export function parseBelief(text: string): ParsedBelief {
  let parsed: ReturnType<typeof matter>;
  try {
    parsed = matter(text);
  } catch {
    const fixed = text.replace(
      /^---\n([\s\S]*?)\n---/m,
      (_m, block) => `---\n${quoteColonValues(block)}\n---`,
    );
    parsed = matter(fixed);
  }
  const fm = parsed.data as Partial<BeliefFrontmatter>;
  const required: (keyof BeliefFrontmatter)[] = [
    "title",
    "scope",
    "status",
    "created",
    "last_reviewed",
    "falsifier",
  ];
  for (const k of required) {
    const v = fm[k];
    if (v === undefined || v === null || v === "") {
      throw new Error(`belief frontmatter missing required field: ${k}`);
    }
  }
  if (!VALID_STATUSES.includes(fm.status as BeliefStatus)) {
    throw new Error(`belief status must be one of ${VALID_STATUSES.join("|")}, got: ${fm.status}`);
  }
  return {
    frontmatter: {
      title: String(fm.title),
      scope: String(fm.scope),
      status: fm.status as BeliefStatus,
      created: coerceDate(fm.created),
      last_reviewed: coerceDate(fm.last_reviewed),
      falsifier: String(fm.falsifier),
      superseded_by: fm.superseded_by ? String(fm.superseded_by) : undefined,
      links: Array.isArray(fm.links) ? fm.links : [],
      schema_version: typeof fm.schema_version === "number" ? fm.schema_version : 1,
    },
    body: parsed.content,
  };
}

export function serializeBelief(fm: BeliefFrontmatter, body: string): string {
  const lines = ["---"];
  lines.push(`title: ${yamlDoubleQuoted(fm.title)}`);
  lines.push(`scope: ${fm.scope}`);
  lines.push(`status: ${fm.status}`);
  lines.push(`created: ${fm.created}`);
  lines.push(`last_reviewed: ${fm.last_reviewed}`);
  lines.push(`falsifier: ${yamlDoubleQuoted(fm.falsifier)}`);
  if (fm.superseded_by) {
    lines.push(`superseded_by: ${fm.superseded_by}`);
  }
  // Sort on write so concurrent edits and machine-generated ordering
  // produce stable diffs. The slug list is a set, not a sequence.
  lines.push(`links: [${[...fm.links].sort().join(", ")}]`);
  lines.push(`schema_version: ${fm.schema_version}`);
  lines.push("---");
  lines.push("");
  lines.push(body.replace(/^\n+/, ""));
  return lines.join("\n");
}
