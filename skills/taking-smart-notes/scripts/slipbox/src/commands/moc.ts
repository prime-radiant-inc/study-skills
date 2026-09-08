import { discoverSlipbox } from "../discovery";
import { cosine, loadOrBuildIndex } from "../embedding/index_loader";
import { embedTexts } from "../embedding/model";
import { runJudge } from "../llm/judge";
import { loadZettel } from "../zettel";
import { register } from "./index";

register("moc", async (args) => {
  const json = args.includes("--json");
  const topic = args.filter((a) => !a.startsWith("--"))[0];
  if (!topic) {
    console.error("slipbox moc: requires <topic>");
    return 2;
  }
  const sb = discoverSlipbox(process.cwd());
  const idx = await loadOrBuildIndex(sb);
  const [tvec] = await embedTexts([topic]);
  if (!tvec) {
    console.error("slipbox moc: failed to embed topic");
    return 1;
  }
  const scored: { slug: string; score: number }[] = [];
  for (let i = 0; i < idx.slugs.length; i++) {
    const slug = idx.slugs[i];
    const vec = idx.vectors[i];
    if (!slug || !vec || vec.length === 0) continue;
    scored.push({ slug, score: cosine(tvec, vec) });
  }
  scored.sort((a, b) => b.score - a.score);
  const cluster = scored.slice(0, 15).filter((s) => s.score > 0.4);
  const withDegree = cluster
    .map((c) => {
      const z = loadZettel(sb, c.slug);
      return { ...c, degree: z.frontmatter.links.length };
    })
    .sort((a, b) => b.degree - a.degree);
  const prompt = `Generate one-line annotations tying each zettel to topic "${topic}". Return JSON array of {slug, annotation}.\n\n${withDegree
    .map((m) => `--- ${m.slug} ---\n${loadZettel(sb, m.slug).body.slice(0, 800)}`)
    .join("\n\n")}`;
  const llmOut = await runJudge(prompt);
  let annotations: { slug: string; annotation: string }[];
  try {
    annotations = JSON.parse(llmOut);
  } catch {
    annotations = withDegree.map((m) => ({ slug: m.slug, annotation: "" }));
  }
  const lines = [`# ${topic}`, "", `Cluster around: ${topic}`, ""];
  for (const m of withDegree) {
    const a = annotations.find((x) => x.slug === m.slug)?.annotation ?? "";
    lines.push(`- [[${m.slug}]] — ${a}`);
  }
  if (json) {
    console.log(JSON.stringify({ topic, members: withDegree, annotations }, null, 2));
  } else {
    console.log(lines.join("\n"));
  }
  return 0;
});
