import matter from "gray-matter";

export interface ZettelFrontmatter {
  title: string;
  source: string;
  created: string;
  schema_version?: number;
  links: string[];
}

export interface ParsedZettel {
  frontmatter: ZettelFrontmatter;
  body: string;
}

// Quote unquoted scalar values in YAML frontmatter that contain ': ' sequences,
// which js-yaml would otherwise parse as nested mappings.
function quoteColonValues(yamlText: string): string {
  return yamlText.replace(/^(title|source):\s+(.+)$/gm, (_match, key, value) => {
    if (value.includes(": ") && !value.startsWith('"') && !value.startsWith("'")) {
      return `${key}: "${value.replace(/"/g, '\\"')}"`;
    }
    return _match;
  });
}

// js-yaml auto-coerces ISO date strings to Date and bare booleans/numbers to
// their JS types. We want frontmatter values to round-trip as the strings the
// author wrote, so coerce back to strings here.
function coerceCreated(v: unknown): string {
  if (v == null) return "";
  if (v instanceof Date) {
    // Format as ISO yyyy-mm-dd in UTC. js-yaml parses bare ISO dates as
    // midnight UTC, so this is the inverse of its parse.
    const y = v.getUTCFullYear();
    const m = String(v.getUTCMonth() + 1).padStart(2, "0");
    const d = String(v.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return String(v);
}

// Emit a YAML double-quoted scalar. Per spec, only `"` and `\` need escaping
// inside double quotes (plus C0 control chars, which we don't expect in
// titles/sources). Always quoting is uglier than necessary for plain strings
// but eliminates an entire class of round-trip ambiguity (apostrophe-quoted
// substrings, leading colons, etc.).
function yamlDoubleQuoted(s: string): string {
  return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

export function parseFrontmatter(text: string): ParsedZettel {
  let parsed: ReturnType<typeof matter>;
  try {
    parsed = matter(text);
  } catch {
    // Re-try with colon-in-value quoting applied to the frontmatter block
    const fixed = text.replace(
      /^---\n([\s\S]*?)\n---/m,
      (_m, block) => `---\n${quoteColonValues(block)}\n---`,
    );
    parsed = matter(fixed);
  }
  const fm = parsed.data as Partial<ZettelFrontmatter>;
  return {
    frontmatter: {
      title: fm.title ?? "",
      source: fm.source ?? "",
      created: coerceCreated(fm.created),
      schema_version: fm.schema_version,
      links: Array.isArray(fm.links) ? fm.links : [],
    },
    body: parsed.content,
  };
}

export function serializeFrontmatter(fm: ZettelFrontmatter, body: string): string {
  const lines = ["---"];
  lines.push(`title: ${yamlDoubleQuoted(fm.title)}`);
  lines.push(`source: ${yamlDoubleQuoted(fm.source)}`);
  lines.push(`created: ${fm.created}`);
  if (fm.schema_version !== undefined) {
    lines.push(`schema_version: ${fm.schema_version}`);
  }
  lines.push(`links: [${fm.links.join(", ")}]`);
  lines.push("---");
  lines.push("");
  lines.push(body.replace(/^\n+/, ""));
  return lines.join("\n");
}
