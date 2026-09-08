# study-skills

Skills that let an agent learn durably instead of losing everything at context clear. An agent working with these skills reads sources analytically and leaves artifacts behind, extracts atomic cross-linked notes that compound across sessions, holds first-person beliefs with explicit falsifiers and revision logs, captures skill-relevant experience mid-task and synthesizes it conservatively, distills new skills only when they pass an earns-a-skill gate, and pauses to deliberate — via a read-only fork — before high-blast-radius decisions.

The disciplines are original, built against failure modes specific to agents: context evaporation (the insight that dies with the session), verbalism (the smooth summary that uses the author's words without the author's thought), harmonization-by-silent-absorption (new claims sliding in without your prior position noticing), and premature convergence (committing to the first path that looks right). They were developed with TDD-for-skills — baseline the failure without the skill, write the skill, verify compliance — and the repo keeps the practice scenarios and retirement data from that testing in `docs/practice-scenarios/`. The reading and note-taking foundations adapt Adler & Van Doren, Ahrens, Booth et al., and Klein, credited in the Foundations section below.

## The eight skills

**Reading and notes**

- `reading-a-book` — analytical reading of books, papers, RFCs, and long essays; produces a per-source note (eight required sections) plus atomic extractions. Adapts Adler/Van Doren with Booth's significance gate.
- `taking-smart-notes` — atomic permanent notes (zettels): one idea per file, your own words, bidirectional links, written for the next instance of you. Adapts Ahrens/Luhmann; adds the slug-first atomicity test, hub-survey linking discipline, and the bundled `slipbox` CLI.
- `writing-from-notes` — substantive writing that starts from the accumulated note cluster instead of a blank page; argument-vs-informational shape decision, gap-marked outlines, extraction back into the slip-box.

**Beliefs**

- `holding-beliefs` — the full belief lifecycle. *Formation*: five moments where positions form (load-bearing claim mid-work, pre-invocation articulation pause, pattern across your own work, felt resistance during reading, post-extraction retrospective), with an articulation move and an adversarial test that separates held positions from absorbed paraphrase. *Maintenance*: the artifact discipline (falsifier, stake, revision log, scope), five triggers, and the anti-performance rules that keep the record honest.

**Experience**

- `learning-from-experience` — mid-task capture of skill-relevant moments as lightweight entries; no pre-classification, no real-time skill editing.
- `reflecting-on-experience` — deliberate batched synthesis over the experience log: narrative first, mandatory adversarial step per pattern, conservative by default (most sessions produce no change). Its practice scenarios, validated across model tiers, live in `docs/practice-scenarios/` — including the retired ones with the data that retired them.

**Skill authoring and decisions**

- `writing-skills-from-learning` — when a source teaches a procedure or a reflection pass surfaces a missing skill: the four-test earns-a-skill gate, the diagnostic-then-dispatch pattern, source-grounding (skills invoke the slip-box, never duplicate it), and three-tier progressive disclosure. Ships the recognition-rubric section format (cues, atypical versions, novice errors, expert shortcuts) as a supporting reference.
- `deliberating-under-ambiguity` — at ambiguous decision points with non-trivial blast radius: fork a read-only subagent that runs vision + premortem + wargame across candidate paths and returns an advisory document.

## The slipbox CLI

`taking-smart-notes` ships a TypeScript CLI covering the slip-box loop: `new`, `link`/`unlink`, `show` (with computed back-references), `search` (full-text and `--semantic`), `rename`, `check [--strict]`, `stats`, `clusters`, `moc`, `audit`, `init`, `reindex`, plus the `belief` subcommand family (`new`/`list`/`show`/`link`/`review`/`revise`) used by `holding-beliefs`.

It lives at `scripts/slipbox/slipbox` inside the `taking-smart-notes` skill directory, wherever the plugin is installed — the skill's load-time base directory gives the absolute path. The shim wraps `bun run src/cli.ts` and installs the CLI's dependencies on first use.

**Requirements:** [Bun](https://bun.sh) on PATH or at `~/.bun/bin`. Embedding subcommands (`reindex`, `similar`, `search --semantic`, `suggest-links`, `moc`) download the BAAI/bge-m3 model — **2.2 GB**, into the CLI's `node_modules` — the first time any of them runs; `new`, `link`, `check`, and the rest never touch the model. `suggest-links` and `moc` use an LLM judge resolved from `SLIPBOX_LLM_JUDGE_CMD`, then `claude`, then `codex` on PATH.

The internal tooling roadmap is in `docs/TOOLS.md`.

## Artifact conventions

Applied in a project, the skills produce:

```
notes/
├── sources/<source-slug>.md   — per-source digests (reading-a-book)
├── zettel/<idea-slug>.md      — atomic permanent notes (taking-smart-notes)
├── beliefs/<slug>.md          — first-person held positions (holding-beliefs)
└── experience/<slug>.md       — skill-relevant moments captured mid-task (learning-from-experience)

pieces/<piece-slug>.md         — substantive written output (writing-from-notes)
```

Zettel frontmatter (`title`, `source`, `created`, `links`) is produced by `slipbox new` and validated by `slipbox check --strict`; belief frontmatter is a separate schema documented in `holding-beliefs` and validated the same way.

**Trades:** when one project holds knowledge for several distinct domains of practice ("trades" — e.g. technical program management, accounting, scriptwriting), beliefs and notes can be scoped per trade under `notes/trades/<trade>/`, with `notes/beliefs/` reserved for cross-trade positions. `slipbox` autodetects the layout; single-domain projects can ignore this entirely.

## Companions and optional integrations

- **[superpowers](https://github.com/obra/superpowers)** (recommended) — `writing-skills-from-learning` builds on `superpowers:writing-skills` for the general TDD-for-skills discipline and deliberately doesn't restate it.
- **[books-for-bots](https://github.com/prime-radiant-inc/books-for-bots)** (recommended for book-length reading) — converts EPUBs to a single markdown file with per-chapter line offsets in the frontmatter, so inspectional reading is one targeted `Read` per chapter. `pandoc` works as a fallback, without the navigation frontmatter.
- **episodic-memory** (optional) — where the skills say "search episodic memory," they mean a conversation-history search such as [obra/episodic-memory](https://github.com/obra/episodic-memory); skip those steps if you don't run one.

## Foundations

Provenance for the adapted frameworks lives here rather than in the skills themselves — a skill's body carries only what helps it run.

**Reading and notes**

- `reading-a-book` adapts the analytical-reading framework of Mortimer J. Adler & Charles Van Doren, *How to Read a Book: The Classic Guide to Intelligent Reading* (Simon & Schuster, rev. 1972). The four questions, the reading levels, the analytical-reading rules, and the four critical points (uninformed / misinformed / illogical / incomplete) are theirs; the artifact requirements, write-as-you-go persistence rules, and rationalization table are this plugin's. The significance gate ("I am reading X to find out Y, in order to understand Z") is from Booth et al. (below), chs. 3–4.
- `taking-smart-notes` adapts the slip-box method from Sönke Ahrens, *How to Take Smart Notes* (rev. 2022), itself reconstructing Niklas Luhmann's Zettelkasten as documented in Schmidt's research (2013, 2015). The note-category discipline, the permanent-note requirements, and the bottom-up structure are Ahrens's; the file layout, the "next instance of you" absent-reader framing, the relation to per-source notes and auto-memory, and the slipbox CLI are this plugin's.
- `writing-from-notes` takes the bottom-up writing procedure from Ahrens, chs. 12–13 (developing topics from clusters, writing from the slip-box). The five-element argument structure (claim, reasons, evidence, acknowledgment-and-response, warrants), the context-problem-response introduction pattern, and the point-first vs. point-last contract are from Wayne C. Booth, Gregory G. Colomb, Joseph M. Williams, Joseph Bizup & William T. FitzGerald, *The Craft of Research*, 4th ed. (2016), chs. 7–11 and 16. The gap-handling step, the extraction-back step, and the argument-vs-informational decision are this plugin's.

**Decisions**

- The recognition-rubric format (shipped as a reference with `writing-skills-from-learning`) derives from Klein's Cognitive Task Analysis Knowledge Audit (Militello & Hutton, 1998), the cleanest published schema for eliciting tacit recognition from experts. Supporting evidence that recognition-formatted prompts help on ambiguous decisions: a 2026 JMIR Biomedical Engineering study operationalized RPD-shaped prompts and measured a +16 percentage point lift on ambiguous medical cases vs. baseline.
- `deliberating-under-ambiguity` builds on Klein's Recognition-Primed Decision-making (Klein, *Sources of Power*, 1999; Klein & Klinger 1991). Premortem-as-prospective-hindsight is from Klein, "Performing a Project Premortem" (HBR, 2007); the ~30% figure Klein cites is Mitchell, Russo & Pennington (1989), "Back to the Future: Temporal Perspective in the Explanation of Events." The architectural fit — recognition rubrics in skills, mental simulation in a read-only deliberation fork — is this plugin's.

**Beliefs**

`holding-beliefs` synthesizes four literatures that converge on one mechanic — hold a falsifiable position, account for evidence against it, and leave the revision history on disk:

- **Posner, Strike, Hewson & Gertzog (1982), "Accommodation of a Scientific Conception: Toward a Theory of Conceptual Change."** The four conditions for conceptual change — dissatisfaction with the existing conception, intelligibility of the new one, plausibility, and fruitfulness — are why the revision log records *what triggered the change* and *what was held before vs. after*. Without dissatisfaction with the prior belief, new evidence is absorbed without revision; the log entry forces dissatisfaction to be visible. ([PDF](https://faculty.weber.edu/eamsel/Classes/Practicum/TA%20Practicum/papers/Posner%20et%20al.%20(1982).PDF))
- **Argyris, theories of action; double-loop learning.** The espoused-vs-in-use distinction names the failure mode the name-at-claim-time trigger fights: stated framework and enacted reasoning diverge silently unless something forces them onto the same record. ([infed.org overview](https://infed.org/dir/welcome/chris-argyris-theories-of-action-double-loop-learning-and-organizational-learning/))
- **Klein (2007), "Performing a Project Premortem."** The `falsifier:` field is the premortem at belief-scale: imagine the world in which this belief is wrong, name the kind of evidence you would see, and write it down before the evidence arrives. ([gary-klein.com](https://www.gary-klein.com/premortem))
- **Chi, Bassok, Lewis, Reimann & Glaser (1989/1994), self-explanation studies.** Articulating *why* a claim is true, in your own words, is what produces transferable understanding rather than recitation. The `# Why I hold this` body section is the self-explanation pass. ([PDF on Andy Matuschak's site](https://andymatuschak.org/files/papers/Chi%20et%20al%20-%201994%20-%20Eliciting%20self-explanations%20improves%20understanding.pdf))

Everything else — the belief artifact discipline, the experience capture/synthesis pairing, the earns-a-skill gate, the deliberation fork — is original to this plugin.

## Status

v0.8.0. Cold-start tested on Sonnet 4.6 and Haiku 4.5, re-validated against the consolidated eight-skill set (2026-07-28), and again on the marketplace install with Fable 5.1 (2026-09-08): a fresh agent with only this plugin and a generic "integrate this source" brief self-directs through reading → zettel extraction → belief formation, committing belief artifacts with substantive bodies and observable falsifiers, unsupervised — and captures its own mid-task procedural failures as experience entries. See `CHANGELOG.md` for version history and `docs/` for design specs, plans, and open architectural questions (`docs/IMPROVEMENTS.md`).

## License

MIT — see `LICENSE`.
