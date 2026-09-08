import { discoverSlipbox } from "../discovery";
import { listZettels, loadZettel } from "../zettel";
import { register } from "./index";

interface Finding {
  slug: string;
  findings: string[];
  severity: "low" | "medium" | "high";
}

function auditZettel(
  slug: string,
  body: string,
  frontmatter: { title: string; source: string },
): Finding {
  const findings: string[] = [];
  if (!/^Source:/m.test(body) && !body.includes("\nSource:")) {
    findings.push("missing-body-source-line");
  }
  if (!frontmatter.title) findings.push("missing-title");
  if (frontmatter.title && /^[A-Z][a-z]+ [a-z]+$/.test(frontmatter.title)) {
    findings.push("title-may-be-topic-not-idea");
  }
  if (body.trim().length < 50) findings.push("body-very-short");
  let severity: Finding["severity"] = "low";
  if (findings.includes("missing-body-source-line") || findings.includes("missing-title"))
    severity = "high";
  else if (findings.length > 1) severity = "medium";
  return { slug, findings, severity };
}

register("audit", async (args) => {
  const json = args.includes("--json");
  const sb = discoverSlipbox(process.cwd());
  const slugs = listZettels(sb);
  const results: Finding[] = [];
  for (const slug of slugs) {
    const z = loadZettel(sb, slug);
    const f = auditZettel(slug, z.body, z.frontmatter);
    if (f.findings.length > 0) results.push(f);
  }
  if (json) console.log(JSON.stringify(results, null, 2));
  else {
    for (const r of results) {
      console.log(`[${r.severity}] ${r.slug}`);
      for (const f of r.findings) console.log(`  - ${f}`);
    }
    console.log(`\n${results.length} zettels with findings (of ${slugs.length}).`);
  }
  return results.length > 0 ? 1 : 0;
});
