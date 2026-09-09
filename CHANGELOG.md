# Changelog

## Unreleased

- **`slipbox check --strict` catches silent review bumps.** A belief whose `last_reviewed` is newer than its latest revision-log entry is a schema issue: the date was edited by hand, since `belief review`/`revise` always write both. Found by the RED baseline below, where Haiku hand-edited the file in 1 of 20 runs and dropped the entry.

- **holding-beliefs loses its anti-performance section.** A 40-run RED baseline (Sonnet and Haiku, with and without the section, under authority and time pressure to "just bump it") never once produced the failure it forbade: every run loaded the belief body before touching it and every note named the case. Per writing-skills, guidance without a demonstrated failure goes; the section and the two rationalization rows the scenario exercised are deleted, and Trigger 3's contract stands alone. Evidence: `docs/examples/2026-09-09-anti-performance-red-baseline.md`, which also records the description micro-tests for the "your human partner" wording (48/48 unchanged).

## v0.8.1 — 2026-09-09

- **"The user" is gone from every skill.** The person you work with is your human partner, and the skills now say so (53 substitutions across nine files). Three description fields changed only in that word.

## v0.8.0 — 2026-09-08

### First-run experience (2026-09-08)

Found by a cold-start run of the marketplace-installed plugin, where the first `slipbox new` failed on module resolution and then pulled a multi-gigabyte model just to create a note.

- **The launcher installs its own dependencies.** The plugin ships CLI source without `node_modules`; `scripts/slipbox/slipbox` now runs `bun install --frozen-lockfile` when they are missing, and falls back to `~/.bun/bin` when `bun` is not on PATH (non-login shells).
- **`slipbox new` no longer loads the embedding model.** It used to embed the title-only skeleton, which went stale the moment the body was written; every semantic command already re-embeds stale zettels on demand. Creating a note is now instant and never triggers the model download.
- **Honest model size.** README and `taking-smart-notes` said ~600 MB on first `reindex`; the download is 2.2 GB and fires on the first semantic command of any kind.
- **Belief revision log no longer reads "After Spawned after …".** `slipbox belief new --note` is written verbatim as the created entry, matching `revise` and `review`; `holding-beliefs` documents the entry shape as `Spawned after <trigger>: <one-line reason>.`

### Skill-map consolidation and hardening (2026-07-28)

- **Merged `learning-beliefs` into `holding-beliefs`.** Every formation path already ended in holding-beliefs, and the n=1 gate, four-question check, and commit mechanics were stated in both files (one had drifted once). The merged skill keeps the five formation moments and articulation move; the shared machinery is stated once (The commit / The n=1 gate / Trigger 1b).
- **`recognition-rubric-format` folded into `writing-skills-from-learning`** as a supporting reference file — it was authoring-time reference material, exactly the tier-2 case. Ten skills become eight.
- **`deliberating-under-ambiguity` can now fire without an active rubric.** The old trigger required a recognition rubric to have flagged ambiguity — a precondition most sessions never met. Ambiguity is now observable by three routes (rubric when present, live interpretations, competing response shapes).
- **`writing-skills-from-learning` covers practice-derived skills** — the path `reflecting-on-experience` hands it — and its false "flags as 'needs review' automatically" claim was replaced by real machinery: `slipbox check --strict` validates skill `## Deeper context` references and `slipbox rename` rewrites them (new `skill-refs` support in the CLI, TDD'd).
- **Red flags folded into rationalization tables** across eight skills (the sections duplicated the tables' Excuse columns); writing-skills-from-learning's structural red flags became a "Before shipping — verify" checklist.
- **Progressive disclosure applied to the plugin's own skills:** genre adaptations, the Federalist 10 walkthrough, and the Crucial Conversations / Allspaw / adjacent-belief case studies moved to tier-2 supporting files with load-trigger pointers.
- **Loopholes closed:** cost-benefit escape hatches replaced with observable predicates; "non-trivial work" defined; the ~500-word gate replaced with its standard; Booth's significance gate asks the user instead of silently skimming a requested read; reflection cadence given an owner (unconsumed experience entries at a natural pause).

### Publishability cleanup (2026-07-11 audit)

- **Repo split.** The personal working knowledge base (`notes/`, `pieces/`, corpus handoff) moved to a private workspace repo; this repo now ships only the plugin. `TOOLS.md` and `IMPROVEMENTS.md` demoted to `docs/` as internal material.
- **Packaging.** MIT `LICENSE` added; manifest moved to `.claude-plugin/plugin.json` with full metadata; description and README rewritten to lead with the plugin's original contributions (the derivative "paraphrases Adler/Ahrens/Booth" framing was underselling seven original skills); stale six-skill count and phantom `bin/` claim fixed.
- **Correctness.** Miscounted headings fixed (five learning moments, five triggers, four note categories); dangling `learning-skills-from-practice` references rerouted; the ~30% premortem figure re-attributed to Mitchell, Russo & Pennington (1989) — Klein cites them; a skill invocation formatted as a bash command fixed in `writing-from-notes`; `books-for-bots` linked as published.
- **Quality (verified).** `reading-a-book` intro reframed around the agent failure mode (context evaporation) with Adler as adapted foundation rather than "the framework is theirs"; the auto-dismiss test single-sourced in `learning-from-experience` with short active versions at both call sites; four description fields compressed/enriched (retrieval micro-probes: 20/20 identical routing old-vs-new); `holding-beliefs` redundancy trim 6,279 → 5,725 words with no named failure mode removed; `writing-from-notes` argument constraints compressed to a checklist (scenario-verified: all five elements still produced). Three GREEN scenario runs passed against the edited skills.
- **Portability.** slipbox invocation defined once per skill as a skill-relative path (bare `slipbox` thereafter); `${CLAUDE_PLUGIN_ROOT}` removed entirely — it is a config-substitution variable for hooks/MCP, not a shell env var, and skills get their base directory announced at load time; `deliberating-under-ambiguity` gains an inline read-only fallback for harnesses without a subagent mechanism; episodic-memory references conditional on tool availability; model-name and project-internal vocabulary ("curriculum", "rounds", tpm examples, personal names) generalized.

## v0.7.0 — 2026-05-09

### Added — `learning-from-experience` + `reflecting-on-experience` (formation/synthesis pairing for skills)

Skills previously had no formation/synthesis discipline analogous to `learning-beliefs` / `holding-beliefs`. The default behavior when a skill-relevant moment arose mid-task was either real-time SKILL.md revision (too heavy, breaks task flow, premature with n=1 evidence) or letting the observation evaporate. The new pair fills that gap.

**`learning-from-experience`** — capture, mid-task, lightweight. Six learning moments (invocation failure, novel success, multi-attempt, source-relevant, user pushback, surprise without a name) each fire a single capture move: write one file at `notes/experience/<short-slug>.md` with three short paragraphs (situation / what happened / what I noticed). Slug names the experience, *not* the skill it might refine — classification is explicitly deferred to reflection because at capture time the agent has n=1 evidence and partial insight, often doesn't yet know which skill (or skills, or no skill) the experience relates to. The skill body forbids editing any SKILL.md at capture time.

**`reflecting-on-experience`** — deliberate synthesis at reflection moments (end of significant work, routine cadence, teaching, picking up a skill after time away, etc.). Operates on the accumulated experience log. Four disciplines that TDD baseline testing showed agent intuition does not naturally enforce:

- **Adversarial step per pattern** — write the strongest argument that the existing skill is right as written. If the counter-argument is also defensible, the pattern does not justify a change; defer with the strongest counter and "what would make this actionable" recorded.
- **Conservative-by-default** — most synthesis sessions produce no change. The default is "should anything change?" not "what should change?" If every candidate pattern produces a change, the discipline has slipped.
- **Narrative-first, diff-second** — write the noticing in own voice before drafting any procedural change. The diff is downstream of the narrative.
- **Cluster-vs-singleton via slug-test** — would the same proposed revision address both entries? If yes, cluster. If the proposed revisions are different, two singletons.

The procedure also classifies each pattern (existing skill / missing skill / belief / one-off noise), archives consumed entries with `refines / cluster / reflected-in` frontmatter so future reflection skips them by default, and handles read-only plugin installs (writes proposed edits to a sidecar at `notes/experience/reflections/proposed-skill-edits-<date>.md` with `status: proposed-pending-plugin-edit`).

### Added — new artifact type: experience entries at `notes/experience/`

Parallel to zettels (source claims) and beliefs (held positions), experience entries record events the agent observed while practicing. Slug names what happened, not which skill applies. Reflection may add `links:` or `refines:` frontmatter during synthesis.

### Process — TDD-for-skills validated the architecture against subtler failure modes

The RED baseline for `reflecting-on-experience` was unexpectedly strong — without the skill, the agent improvised reasonable reflection (clusters identified, deferrals made, plugin-read-only handled correctly). The gaps the skill body needed to fix were subtle: skipping the adversarial step, defaulting to "what should change?" rather than "should anything change?", grouping two singletons as a cluster because they touched the same skill rather than running the slug-test. GREEN testing with the skill present produced a clean 75% defer rate (1 of 4 candidate patterns changed, 3 deferred with recorded counters) and explicit narrative-first ordering with adversarial steps run on every pattern.

### Architectural correction during design

Initial design filed experience entries under a specific skill (`notes/experience/<skill-slug>.md`). Corrected mid-build to slug-by-experience (`notes/experience/<short-slug>.md`) — pre-classifying by skill at capture time pushes a judgment call into the moment the agent is least equipped to make it (mid-task, n=1, partial insight), and forecloses the cases where an entry refines multiple skills, no current skill, or points at a missing skill. Classification is part of reflection's work, not capture's. The RED baseline for `learning-from-experience` independently validated this: the subagent's instinct was "journal, don't pre-commit," with explicit rejection of pre-classification on n=1 evidence grounds.

### Plugin counts

The plugin now ships ten skills (was eight).

## v0.6.0 — 2026-05-08

### Added — `learning-beliefs` skill (formation, paired with `holding-beliefs` for maintenance)

`holding-beliefs` is the artifact discipline once you've decided you hold a belief — falsifier, stake, revision log. It does not handle the *act of forming* a belief; its triggers fire on external events (chapter-finish, subagent-report, claim-time) and treat formation as already done. In practice, beliefs form in moments those triggers don't catch: a load-bearing claim mid-draft, a paraphrase failure when reaching for a skill, a pattern across recent work, a felt resistance during reading.

`learning-beliefs` catches the formation move. Five learning moments, each with the same articulation discipline (write the position in your own voice; if it survives the four-question check, hand off to `holding-beliefs`):

- **Moment 1** — substantive defendable claim mid-work
- **Moment 2** — pre-skill-invocation pause when you can't articulate why the skill applies
- **Moment 3** — pattern across your own recent work
- **Moment 4** — felt resistance during reading (two-strikes threshold)
- **Moment 5** — post-zettel-sweep retrospective: after extracting zettels from a source, ask what positions you now hold and commit them as artifacts

The anti-paraphrase test ("if you remove source attribution, would the sentence still feel like *yours*?") distinguishes formation from absorption.

### Changed — `holding-beliefs` refactored as maintenance, with formation handed off to `learning-beliefs`

Trigger 1b (territory audit on the cumulative corpus, added in v0.5.0) is now reframed as the *structural backstop* that catches what formation triggers missed — `learning-beliefs` is the primary mechanism. The handoff is documented at the top of `holding-beliefs` SKILL.md so an agent loading the maintenance skill knows where formation work happens.

### Changed — `taking-smart-notes` generative cross-reference to `learning-beliefs` + Completion criterion

Cold-start testing on Sonnet 4.6 and Haiku 4.5 (kata #7) found that fresh agents extracted zettels from a source and declared integration done without asking what positions they now held. Both invoked `taking-smart-notes` only; neither invoked the belief skills. The existing cross-reference in `taking-smart-notes` was framed *defensively* ("if a zettel contradicts a live belief..."); with an empty slip-box, the condition was N/A and the section was dismissed.

Two changes in `taking-smart-notes`:

- **Generative handoff** to `learning-beliefs` Moment 5, fired unconditionally after every zettel-extraction sweep regardless of existing beliefs. Defensive contradiction case preserved separately.
- **Completion criterion** section: a clean `slipbox check --strict` is necessary but not sufficient; the integration is incomplete until either (a) belief artifacts exist that name positions the sweep crystallized, or (b) a "no shift" note is recorded explaining why the source didn't move you.

### Changed — `learning-beliefs` Moment 5 specifies a three-part commit recipe

Validating the above on Haiku 4.5 surfaced two weaker-tier shortcuts:
- *Prose-mode shortcut*: agent ran the post-zettel retrospective in its head and wrote "I now hold X" in a final report without committing X via `slipbox belief new`.
- *Skeleton-without-body shortcut*: agent ran `slipbox belief new` but left the body as the auto-generated `(Reasoning, in your own voice.)` placeholder.

Moment 5's Position-crystallized outcome now names a three-part artifact requirement: (1) `slipbox belief new` with substantive title and falsifier; (2) `Edit` the body to substantive first-person reasoning (placeholder is a marker that the body isn't written yet, not a body); (3) `slipbox check --strict` re-validates. The `taking-smart-notes` cross-reference and Completion criterion were updated symmetrically.

### Process — three-tier cold-start as the GREEN test

Validation pattern: dispatch a fresh agent (no prior context, no supervision) with `--plugin-dir study-skills` only and a generic "integrate this source" brief at three tiers (Opus, Sonnet 4.6, Haiku 4.5). Cold-start RED on Sonnet+Haiku showed the discoverability gap; iterative tightening to GREEN required three passes on Haiku, each closing one minimum-acceptable shortcut Haiku found. Pattern that emerged: weaker tiers will accept any minimum the discipline doesn't explicitly forbid; naming each failure mode by name (prose-mode shortcut, placeholder-as-body) was what reached them.

### Plugin counts

The plugin now ships eight skills (was seven).

## v0.5.0 — 2026-05-07

### Added — `holding-beliefs` Trigger 1b: territory audit on the cumulative corpus

The previous four triggers were experience-driven (Trigger 1: spawn-or-update on any new experience; Trigger 2: load at task start; Trigger 3: name at claim time; Trigger 4: stale review on touch). Belief candidates earned by zettels accumulating across multiple sources were structurally invisible — no single experience contributed enough mass to fire Trigger 1, and the territory was never audited as a whole.

**Trigger 1b** is corpus-driven: before reporting that a session, round, or extraction produced "no new beliefs," and after any work that materially grew the slip-box, audit the cumulative corpus for territories whose mass now exceeds the inclusion threshold. The check is four questions in order — mass, stake, falsifier, non-adjacency — and explicitly forbids accepting an *adjacent* existing belief as covering the territory. Validated by RED-GREEN test: original skill caused agents to do per-zettel review only and miss the corpus's largest hub (`pm-deliverable-is-reduced-entropy`, 98 forward links, no committed belief); edited skill caused agents to run the audit explicitly, surface 11 territory candidates, and catch their own reluctance ("textbook reluctance per the skill").

### Added — `writing-skills-from-learning` Test 4 in detail + already-shipped recovery

Earns-a-skill test 4 ("Commits") previously asked "does the agent already hold a belief that operationally invokes this skill?" and accepted any belief in the same domain. Adjacent-but-not-invoking pairings were the failure mode. Concrete instance found in the corpus: `building-a-reference-class-estimate` paired with `risk-must-be-tracked-explicitly-not-discovered-in-meetings` — adjacent territory (risk management) but the belief commitment doesn't *require* reference-class anchoring as procedure.

**Test 4 in detail** adds the one-sentence discrimination test ("does the belief commitment *require* the procedure or merely *permit* it?") plus three named recovery moves. **Test 4 on already-shipped skills** extends recovery to skills that already shipped with adjacent pairings, including an `## Audit debt` marker pattern for cases where invoking-belief authoring must defer.

### Changed — descriptions trimmed to triggers-only across all six skills

Per `superpowers:writing-skills` CSO rule: descriptions describe WHEN to use, not WHAT the skill does. Workflow summaries in descriptions cause agents to follow the description and skip reading the skill body.

- `holding-beliefs`: dropped "to maintain a first-person, falsifiable, revisable belief set..." workflow summary.
- `writing-skills-from-learning`: dropped "Covers the learning-specific delta over `superpowers:writing-skills`..." description-of-content.
- `deliberating-under-ambiguity`: dropped "Forks a read-only subagent that runs vision + premortem + wargame..." workflow summary.
- `recognition-rubric-format`: rewritten from "Reference for..." to "Use when..."
- `taking-smart-notes`: dropped "captures atomic, cross-linked notes in your own words..." workflow summary.
- `writing-from-notes`: dropped "Look at accumulated notes first; outline emerges from clusters..." workflow summary.
- `reading-a-book`: unchanged (already triggers-only).

### Process

These edits followed `superpowers:writing-skills` RED-GREEN-REFACTOR. RED baseline dispatched a subagent against the original skill text under pressure scenarios (sunk cost + time pressure + brief-scoped restrictions); the agent missed the cumulative-corpus audit entirely while reasoning correctly on adjacent-pairing detection. GREEN with edits dispatched against the same scenarios produced explicit `slipbox stats --hubs` audit, named-rationalization spotting, and correct deferred-commit decision on the adjacent pairing. One refactor finding (already-shipped recovery moves) added between GREEN and final commit.

## v0.4.1 — undated (between v0.4.0 and v0.5.0)

### Added
- New skill: `writing-skills-from-learning`. The learning-specific delta over `superpowers:writing-skills` — discipline for distilling procedures from sources just read into curriculum-product SKILL.md while procedural detail is fresh in working memory. Includes the four-test earns-a-skill standard (one-shottable, generalizes, substantive, commits), the architectural hierarchy (structural insight → zettel; procedure-justifying claim → zettel; procedure → skill if it passes the four tests), the diagnostic-then-dispatch pattern for paired procedures, the source-grounding pattern (skills invoke slip-box, never duplicate), three-tier progressive disclosure, and the belief↔skill pairing requirement.

### Changed
- The plugin now ships seven skills (was six).

## v0.4.0 — 2026-05-03

### Added
- New skill: `holding-beliefs`. Maintains first-person, falsifiable, revisable beliefs distinct from source-claim zettels. Four triggers: spawn-or-update on any experience; load at task start; name at claim time; stale review on touch. The discipline that fights harmonization-by-silent-absorption — when new evidence quietly absorbs into existing beliefs without revision.
- New artifact type: belief notes at `notes/beliefs/<slug>.md` (personal) or `notes/trades/<trade>/beliefs/<slug>.md` (trade-scoped). Frontmatter schema: title, scope, status (live|superseded|retired), created, last_reviewed, falsifier, optional superseded_by, links, schema_version.
- New `slipbox belief` subcommand family: `new`, `list`, `show`, `link`, `review`, `revise`. The `review` and `revise` operations require a `--note` argument so silent date-bumps are mechanically impossible. `revise --status=superseded` requires `--superseded-by=<slug>` and verifies the target exists.
- `slipbox check --strict` now validates belief frontmatter, link symmetry (including belief↔zettel and belief↔belief), and supersession references.
- Cross-references in `reading-a-book`, `taking-smart-notes`, and `writing-from-notes` SKILL.md to invoke `holding-beliefs` triggers at the appropriate moments.

### Changed
- The plugin now ships six skills (was five).

## v0.3.0 — slipbox v1

- New CLI: `slipbox` (TypeScript) at `skills/taking-smart-notes/scripts/slipbox/bin/slipbox`. Replaces and extends Python `notes-tool`.
- Local embeddings via `@huggingface/transformers` + `bge-m3`.
- New subcommands: `init`, `similar`, `suggest-links`, `search --semantic`, `stats`, `clusters`, `moc`, `audit`, `reindex`.
- `--json` flag on every data-returning subcommand.
- Frontmatter `schema_version: 1` on new zettels (existing zettels remain valid).
- Trade-namespace autodetect.
- Python `notes-tool` continues to work; cutover is a separate phase.

### Known issues

- **Bun shutdown panic (exit 133)** after the test suite finishes. All 60 tests pass and report `0 fail` before Bun panics on ONNX-runtime native-addon teardown (`@huggingface/transformers` dependency). Tests are correct; the exit code is wrong. CI workaround: `bun test || [ $? -eq 133 ]`. Likely a Bun 1.2.22 + onnxruntime-node interaction; outside this codebase to fix.
