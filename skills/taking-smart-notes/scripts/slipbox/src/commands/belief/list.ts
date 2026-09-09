import { listBeliefs } from "../../belief/io";
import { discoverSlipbox } from "../../discovery";
import { registerBeliefSub } from "./dispatch";

type SortKey = "last_reviewed" | "created" | "title";
const VALID_SORT: readonly SortKey[] = ["last_reviewed", "created", "title"] as const;
const VALID_STATUS: readonly string[] = ["live", "superseded", "retired"] as const;

interface Args {
  scope?: string;
  status?: string;
  sort: SortKey;
  json?: boolean;
}

function parseArgs(args: string[]): Args | { error: string } {
  const out: Args = { sort: "last_reviewed" };
  for (const a of args) {
    if (a.startsWith("--scope=")) out.scope = a.slice("--scope=".length);
    else if (a.startsWith("--status=")) {
      const v = a.slice("--status=".length);
      if (!VALID_STATUS.includes(v)) {
        return { error: `unknown --status=${v} (valid: ${VALID_STATUS.join("|")})` };
      }
      out.status = v;
    } else if (a.startsWith("--sort=")) {
      const v = a.slice("--sort=".length);
      if (!VALID_SORT.includes(v as SortKey)) {
        return { error: `unknown --sort=${v} (valid: ${VALID_SORT.join("|")})` };
      }
      out.sort = v as SortKey;
    } else if (a === "--json") out.json = true;
  }
  return out;
}

registerBeliefSub("list", async (args) => {
  const parsed = parseArgs(args);
  if ("error" in parsed) {
    console.error(`slipbox belief list: ${parsed.error}`);
    return 2;
  }
  const opts = parsed;
  const sb = discoverSlipbox(process.cwd());
  let beliefs = listBeliefs(sb);
  if (opts.scope) beliefs = beliefs.filter((b) => b.frontmatter.scope === opts.scope);
  if (opts.status) beliefs = beliefs.filter((b) => b.frontmatter.status === opts.status);
  // ISO-8601 yyyy-mm-dd dates sort lexicographically = chronologically;
  // titles sort lexicographically as plain strings.
  beliefs.sort((a, b) => {
    const av = a.frontmatter[opts.sort];
    const bv = b.frontmatter[opts.sort];
    return String(av).localeCompare(String(bv));
  });
  if (opts.json) {
    console.log(
      JSON.stringify(
        beliefs.map((b) => ({
          slug: b.slug,
          scope: b.frontmatter.scope,
          status: b.frontmatter.status,
          last_reviewed: b.frontmatter.last_reviewed,
          created: b.frontmatter.created,
          title: b.frontmatter.title,
        })),
        null,
        2,
      ),
    );
  } else {
    for (const b of beliefs) {
      const t =
        b.frontmatter.title.length > 60
          ? `${b.frontmatter.title.slice(0, 57)}...`
          : b.frontmatter.title;
      console.log(
        `${b.slug.padEnd(40)} [${b.frontmatter.scope}] ${b.frontmatter.status} ${b.frontmatter.last_reviewed}  ${t}`,
      );
    }
  }
  return 0;
});
