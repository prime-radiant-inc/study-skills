import { discoverSlipbox } from "../discovery";
import { listZettels, loadZettel } from "../zettel";
import { listBeliefs } from "../belief/io";
import { register } from "./index";

const DEFAULT_WINDOW_DAYS = 30;

function daysAgoIso(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

register("stats", async (args) => {
  const json = args.includes("--json");
  const hubsArg = args.find((a) => a.startsWith("--hubs="));
  const topN = hubsArg ? Number(hubsArg.slice("--hubs=".length)) : 10;
  const windowArg = args.find((a) => a.startsWith("--window="));
  const windowDays = windowArg ? Number(windowArg.slice("--window=".length)) : DEFAULT_WINDOW_DAYS;
  const sb = discoverSlipbox(process.cwd());
  const slugs = listZettels(sb);
  let forwardLinks = 0;
  let orphans = 0;
  const degree = new Map<string, number>();
  const sourceCounts = new Map<string, number>();
  let crossSourceLinks = 0;
  const zettels = new Map(slugs.map((s) => [s, loadZettel(sb, s)] as const));
  for (const [slug, z] of zettels) {
    forwardLinks += z.frontmatter.links.length;
    degree.set(slug, z.frontmatter.links.length);
    if (z.frontmatter.links.length === 0) orphans++;
    sourceCounts.set(z.frontmatter.source, (sourceCounts.get(z.frontmatter.source) ?? 0) + 1);
    for (const t of z.frontmatter.links) {
      const tz = zettels.get(t);
      if (tz && tz.frontmatter.source !== z.frontmatter.source) crossSourceLinks++;
    }
  }
  const topHubs = Array.from(degree.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([slug, d]) => ({ slug, degree: d }));

  const cutoff = daysAgoIso(windowDays);
  const beliefs = listBeliefs(sb);
  const beliefsByStatus = { live: 0, superseded: 0, retired: 0 };
  let formedInWindow = 0;
  let reviewedInWindow = 0;
  for (const b of beliefs) {
    const status = b.frontmatter.status as keyof typeof beliefsByStatus;
    if (status in beliefsByStatus) beliefsByStatus[status]++;
    if (b.frontmatter.status !== "live") continue;
    if (b.frontmatter.created >= cutoff) formedInWindow++;
    if (b.frontmatter.last_reviewed >= cutoff) reviewedInWindow++;
  }

  const result = {
    zettels: slugs.length,
    forwardLinks,
    orphans,
    topHubs,
    perSource: Object.fromEntries(sourceCounts),
    crossSourceLinkRatio: forwardLinks > 0 ? crossSourceLinks / forwardLinks : 0,
    beliefs: {
      total: beliefs.length,
      live: beliefsByStatus.live,
      superseded: beliefsByStatus.superseded,
      retired: beliefsByStatus.retired,
      windowDays,
      formedInWindow,
      reviewedInWindow,
    },
  };
  if (json) console.log(JSON.stringify(result, null, 2));
  else {
    console.log(`Zettels: ${result.zettels}`);
    console.log(`Forward links: ${result.forwardLinks}`);
    console.log(`Orphans (links: []): ${result.orphans}`);
    console.log(`Cross-source link ratio: ${(result.crossSourceLinkRatio * 100).toFixed(1)}%`);
    console.log(`\nTop ${result.topHubs.length} hubs:`);
    for (const h of result.topHubs) console.log(`  ${h.degree}  ${h.slug}`);
    console.log(`\nBeliefs: ${result.beliefs.total} (live: ${result.beliefs.live}, superseded: ${result.beliefs.superseded}, retired: ${result.beliefs.retired})`);
    console.log(`In last ${windowDays} days (live only): formed ${result.beliefs.formedInWindow}, reviewed ${result.beliefs.reviewedInWindow}`);
  }
  return 0;
});
