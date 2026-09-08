# Tooling roadmap for `slipbox`

Tools the slip-box discipline wants, ranked by impact based on the failure modes observed in practice. Tiers 0 and 1 are shipped; Tier 2 onward is the roadmap.

The principle: **the user shouldn't need to know what grep is, where Python lives, or how the YAML frontmatter parser works.** The tool should expose verbs that match the discipline's vocabulary (link, search, show, ingest), and shell-out details should be invisible. Skills should reference `slipbox` operations by name, not inline shell commands.

The tool lives at `skills/taking-smart-notes/scripts/slipbox/slipbox` (skill collateral). When the plugin is installed, resolve it relative to the `taking-smart-notes` skill's base directory.

---

## Tier 0 — shipped

### `slipbox link <slug-a> <slug-b>`
Add a bidirectional link, atomic, idempotent. Updates both files' `links:` lists.
*Addresses:* asymmetric-link failure mode I introduced three times in a single session before this tool existed.

### `slipbox unlink <slug-a> <slug-b>`
Remove a bidirectional link from both files.

### `slipbox check`
Verify symmetry across the slip-box. Reports asymmetric and broken links. Non-zero exit on problems.
*Addresses:* the verification ritual that I wrote inline in Python three times before realizing it should be a tool.

---

## Tier 1 — shipped (daily-driver loop)

### `slipbox show <slug>`
Pretty-print a zettel *with computed back-references*. The file format stores forward links only; the cluster a note sits in requires walking the directory to compute who points to it. This is the most useful retrieval tool by far — every read of a zettel should include "what points to this" alongside "what does this point to."

Output sketch:
```
ZETTEL: structural-restraint-beats-virtue-restraint
Title: To keep a majority from oppressing a minority, design structures...
Source: notes/sources/federalist-10.md
Created: 2026-05-01

Forward links (14):
  -> faction-defined-by-injustice-not-size
  -> causes-of-faction-cannot-be-removed
  ...

Back-references (2):
  <- design-for-adversaries-generalizes-structural-restraint
  <- acknowledgment-and-response-builds-ethos

Body:
[full markdown body]
```

### `slipbox search <query> [--in=zettel|sources|both] [--limit=N]`
Full-text search across the slip-box. Wraps ripgrep (or grep) but presents structured output (project-relative path, line number, surrounding context). Scope defaults to both zettels and sources; `--in` narrows to one or the other. `--limit` caps the number of hits shown (default 50).

*Addresses:* `writing-from-notes` Step 1 used to say "use grep with multiple plausible terms" — that leaked implementation. The skill now says "use `slipbox search`" with a real tool behind it. The user (your human partner, the next agent, anyone) shouldn't need to know grep exists.

Output sketch:
```
search: "feedback loop"
notes/zettel/critical-mass-of-an-accumulating-system.md:14: ...feedback loops shape virtuous circles when...
notes/zettel/closure-via-externalization-frees-working-memory.md:18: ...the feedback-loop nature of ego depletion...
notes/sources/the-craft-of-research.md:142: ...Booth's feedback-loop framing of revision...
3 hits in 3 files
```

Implementation: ripgrep if available, else grep -rn.

### `slipbox new <slug> [--source=<path-or-slug>] [--title="<title>"]`
Create a zettel skeleton with valid frontmatter. Validates the slug (lowercase kebab-case), refuses to overwrite, populates `created:` with today's date, fills `source:` (a literal path if it contains a slash, otherwise resolved as `../sources/<slug>.md`), leaves `title:` and body for the user to fill, initialises `links: []`.

*Addresses:* frontmatter inconsistency. Every zettel created before this tool existed was hand-typed; the tool catches missing fields, wrong source-path format, and slug-vs-title mismatches by construction.

### `slipbox rename <old-slug> <new-slug>`
Rename a zettel and rewrite every reference: every other zettel's `links:` list, every `[[...]]` body link, every per-source note's "Permanent notes extracted from this source" section, every piece-level reference. Runs `check` automatically afterward and surfaces failure non-zero.

*Addresses:* the `structural-restraint-vs-virtue-restraint` → `structural-restraint-beats-virtue-restraint` typo I fixed twice with sed. Also handles the general case where a slug needs sharpening after the note exists.

### `slipbox check --strict`
Extends the standard `check` with frontmatter schema validation:
- every zettel has required fields (`title`, `source`, `created`, `links`)
- `source:` paths actually resolve (relative to the zettel file)
- `created:` is a valid YYYY-MM-DD date
- filename matches lowercase kebab-case slug pattern
- flags zettels with `links: []` older than 30 days as stale isolates — candidates for promotion to a cluster, for linking, or for deletion

This is the recommended end-of-session check: it catches schema problems and stale isolates that the symmetry-only check can't see.

---

## v0.3 — slipbox (TypeScript)

v0.3 supersedes the Python prototype with a TypeScript implementation invoked via the shim at `skills/taking-smart-notes/scripts/slipbox/slipbox`. The shim wraps `bun run src/cli.ts`. The Tier 0/1 surface above (`link`, `unlink`, `check`, `show`, `search`, `new`, `rename`, `check --strict`) ships unchanged in behavior; the following are added:

### `slipbox init [--trade=<name>]`
Scaffold a slip-box layout: flat (`notes/zettel/`, `notes/sources/`) or trade-namespaced (`notes/trades/<name>/zettel/`, etc.).

### `slipbox reindex [--force]`
Rebuild embedding sidecars for all zettels. Embedding model: `BAAI/bge-m3` (Apache 2.0, 1024-dim, multilingual). Override via `SLIPBOX_MODEL` env. First run downloads ~600 MB.

### `slipbox similar <slug> [--limit=N] [--min-score=S] [--json]`
Top-N cosine-similar zettels by embedding, excluding already-linked notes.

### `slipbox search <query> --semantic [--limit=N] [--json]`
Semantic full-corpus search. Full-text (ripgrep/grep) remains the default mode; `--semantic` switches to embedding search.

### `slipbox suggest-links <slug> [--limit=N] [--json]`
Runs `similar`, then passes candidates to an LLM judge for curation. LLM judge resolution order: `SLIPBOX_LLM_JUDGE_CMD` env, then `claude` on PATH, then `codex` on PATH.

### `slipbox stats [--hubs=N] [--json]`
Counts, top hubs, per-source distribution, cross-source link ratio.

### `slipbox clusters [--algorithm=connected|louvain] [--json]`
Cluster detection over the link graph.

### `slipbox moc <topic> [--json]`
Draft a Map of Content via semantic search + LLM annotation.

### `slipbox audit [--json]`
Heuristic zettel quality audit (stub density, isolates, frontmatter gaps, etc.).

**Invocation note:** use the shim at `skills/taking-smart-notes/scripts/slipbox/slipbox` for all subcommands — it wraps `bun run src/cli.ts` and works correctly with the embedding subcommands (`reindex`, `similar`, `suggest-links`, `search --semantic`, `moc`). The compiled binary at `bin/slipbox` (built via `bun run build`) is partial — `bun build --compile` does not bundle the ONNX runtime native addon, so embedding subcommands fail under the binary. Prefer the shim until that toolchain limitation is resolved.

---

## Tier 2 — build next (speeds up real work)

### `slipbox list --cluster=<slug> [--depth=N] [--format=tree|flat|json]`
Surface the cluster connected to a given slug within N hops (default 2). This is what `writing-from-notes` Step 1 actually wants: not grep-then-skim, but "give me everything within 2 hops of `argument-structure`."

Output for an agent should be JSON-shaped so it can branch on the structure. Output for a human should be a tree with titles.

*Addresses:* the manual cluster-walking I did in writing-from-notes Step 2. Gets more valuable as the slip-box grows past 50 notes.

### `slipbox ingest <epub-path> [--source-slug=<slug>]`
Wrap `books-for-bots`. Convert the EPUB, place output deterministically in `notes/sources/<slug>/<slug>.md`, generate the per-source skeleton with proper frontmatter, empty A–H sections, and a placeholder "Permanent notes extracted from this source" section at the bottom. Optionally accept a slug override.

*Addresses:* every book read currently starts with a multi-step shell incantation. Making this one command removes friction from the inbound side. Ten books per trade × five trades = 50 ingestion events; saving even a minute per ingestion is meaningful.

---

## Tier 3 — matters at scale

### `slipbox migrate-to-trade <trade> [--dry-run] [--scope=<file-pattern>]`
Move existing content into a trade-namespaced layout (`notes/trades/<trade>/`). Updates every relative source path. Runs `check` post-move. Refuses to proceed if `check` was failing before the migration.

*Addresses:* the migration to trade-namespaced architecture. We'll need this exactly once when adopting the multi-trade layout; doing it manually would be the same kind of error-prone sed-pass we did for `sources/`.

### `slipbox stats [--by-trade] [--by-cluster]`
Counts and basic metrics: zettels by trade/cluster/source, average links per zettel, largest cluster, oldest unrevisited note, broken-link count over time. Useful for the status reports that `HANDOFF-technical-pm.md` asks the next agent to produce every 10–20 books.

### `slipbox find-similar <slug> [--method=overlap|tag-cosine]`
Surface zettels that *might* connect to a given one but don't currently. Cheap version: shared neighbors (zettels that link to two or more of the same notes the input does, but aren't linked to the input). Useful for catching the "I should have linked these" failure mode.

*Addresses:* the manual reading-and-noticing I did when writing zettels — looking through existing zettels to see which ones the new one connects to. A good find-similar surfaces candidates programmatically.

### `slipbox graph [--format=dot|json|ascii] [--cluster=<slug>] [--depth=N]`
Output the slip-box graph for visualization. DOT for graphviz, JSON for downstream tools, ASCII for terminal preview. At 30 notes you can hold the graph in your head; at 300 you can't, and seeing the clusters becomes a real navigation aid.

---

## Tier 4 — premature given current state

These are real options but the cost outweighs the benefit until the slip-box is at least 10× its current size or has multi-user/multi-device requirements.

- **Embedding-based semantic search.** *(Shipped in slipbox v0.3 — `slipbox search --semantic`, `slipbox similar`, `slipbox reindex`.)* Finds notes that *talk about* a topic without sharing keywords.
- **Web UI.** Reading and editing zettels through a browser instead of the filesystem. Useful for non-agent users; for an agent doing it programmatically, the filesystem is the better interface.
- **Multi-device sync.** When the slip-box exists on more than one machine. The current setup assumes single-host; multi-host adds conflict resolution complexity.
- **Auto-link suggestion via LLM.** *(Shipped in slipbox v0.3 — `slipbox suggest-links`.)* LLM-curated candidates from embedding similarity. Higher-quality than `find-similar` but requires a local or API-accessible judge.

---

## What the tools should *not* do

- **Enforce style or tone.** The skills already cover paraphrase-don't-quote and one-idea-per-zettel. Mechanizing that judgment would be both annoying and brittle.
- **Auto-extract zettels from per-source notes.** The extraction step is judgment-heavy and is exactly where the slip-box's quality compounds. Automating it would dilute the discipline.
- **Auto-summarize sources.** Same reason. Summarization is where verbalism creeps in; the discipline is to avoid it.
- **Define "the right" trade taxonomy.** That's an architectural decision the next agent will surface from real usage. Tools encode whichever architecture we settle on; they shouldn't pre-empt the decision.

---

## Order of operations

Shipped:

1. `link`, `unlink`, `check` (Tier 0) — the bidirectional-link primitives.
2. `show` — biggest improvement to retrieval; pretty-prints a zettel with computed back-references.
3. `search` — biggest improvement to discovery; wraps `rg` or `grep` with project-relative output.
4. `new` — frontmatter consistency by construction.
5. `rename` — fixes the typo failure mode; rewrites every cross-reference.
6. `check --strict` — extends `check` with schema, source-path, filename-pattern, and stale-isolate validation.

Tier 1 closed the gap between "this is a discipline I follow with effort" and "this is a discipline the tool helps me follow." Build to demand from here: don't add Tier 2/3 tools until they're surfaced by actual friction in real use.

Next up if/when friction appears:

7. `ingest` — wraps the books-for-bots boundary into a single command.
8. `list --cluster` — graph traversal for cluster surfacing.

---

## Why not an MCP server (yet)

The case for MCP becomes real when:

1. The structured outputs (e.g., `list --cluster --format=json`) are being consumed by agent tool-calls regularly enough that shell-quoting becomes friction.
2. Multi-step tool composition is happening that benefits from typed parameter passing.
3. The slip-box is large enough that *streaming* operations matter (e.g., walking a 1000-zettel graph with backpressure).

We're nowhere near any of these. The CLI form is correct for the current scale and remains correct until at least one of the above becomes a real problem. When that day comes, the verbs are already designed — wrap them in MCP and skills get typed tool surfaces. Until then, the CLI is what ships.
