# Process improvements — observed across the session

What I noticed working with the slip-box that isn't yet codified, ordered roughly by impact. These are upstream of any tooling decision; tooling encodes whichever choices we make here.

## High impact

1. ~~**Per-trade architecture is the biggest unmade decision.**~~ ✅ Decided. Domain separation: trade-namespacing deferred with a named trigger. Judgment-as-first-class-artifact: explicitly *rejected* as YAGNI — judgment lives as patterns inside existing artifacts (rationalization tables in skills, misreading tables in zettels, recognition rubrics in skills, narratives in episodic memory). Per-trade skill specialization: addressed via the recognition-rubric pattern (skills with `## Recognition rubric` sections, hand-curated per situation type). The decisions are made; the open growth-path triggers are listed below.

2. **Skills don't compose, they cross-reference textually.** `reading-a-book` Step 4 says "REQUIRED SUB-SKILL: taking-smart-notes" but that's just words. The agent has to remember to context-switch. At trade-specialized scale, this becomes a problem — composition without a mechanism means each agent re-derives the composition every time. Worth thinking about: skill-level "uses" frontmatter? A skill-load tool that resolves required-sub-skills?

## Medium impact

3. **Source-path discipline is brittle to restructures.** Today's directory cleanup needed a sed pass over 30 zettels because every `source:` line had a relative path. If we restructure again (we will, when adding `notes/trades/<trade>/`), we hit the same issue. Either: paths should be slugs not relative paths (and a tool resolves them), or the tool does the restructure including path migration. The second is cheaper to build but encodes the layout into the tool. (`slipbox check --strict` now validates that source paths resolve, which catches the broken-after-restructure case at session boundaries — but it doesn't fix the underlying brittleness.)

4. **The "what's portable enough to be a zettel" judgment is undocumented heuristic.** I extracted 30 zettels from 4 sources by repeatedly applying intuition. The closest the skill gets is "extract ideas that are portable, that connect to other notes (existing or anticipated), or that crystallize a distinction worth keeping." That's three vague tests OR'd together. A clearer heuristic would help: maybe "would this connect to ideas from a different domain than the source's?" as a portability test. At trade scale, the quality of this judgment is the binding factor on slip-box value.

5. **Skills don't have a "this is hand-wavy" marker.** The reading-a-book genre-adaptations section is necessarily vague ("for novels, replace propositions/arguments with plot/characters/themes"). That's fine when you know it's vague; less fine when you forget. An explicit `**Hand-wavy:**` marker on sections that are placeholders for later sharpening would help future-me know what to revise. Also helps the next agent calibrate confidence.

## Low impact / quality-of-life

6. **TaskCreate use was inconsistent.** I tracked sometimes, didn't others. The reminder system kept nudging. There's no clear principle for when to track. Provisional rule: track for any work that spans 5+ tool calls *and* has clearly-separable phases. Skip for sequences of similar small edits. Codify if it persists.

7. **Skill testing pattern (RED→GREEN→REFACTOR) was useful but heavy.** It caught real problems but spinning up a subagent for every skill amendment is expensive. A lighter "self-RED" check (write the skill, then *as a fresh reader* try to apply it without the rest of the conversation context) would catch most of what subagent testing catches at much lower cost.

## What's working that I want to keep explicit

- **The per-source + zettel + pieces split** is principled and survived this session's growth from 7 zettels to 30.
- **Skill citation discipline (paraphrase + cite)** prevented plagiarism cleanly across three substantive book-reads.
- **Skill dogfooding** — applying my own skill to read the next book — caught real loopholes that pure imagination wouldn't have.
- **The directory-layout invariant** ("everything in `notes/sources/` is a per-source digest, everything in `notes/zettel/` is an atomic claim") makes the architecture self-documenting without requiring skill text. More of this kind of invariant would be good.

## Top items to actually build/decide soon

1. ~~**Trade-namespaced directory migration**~~ — Deferred with a named trigger ("a second trade is being onboarded and the slip-boxes need to stay distinct"). The architecture doesn't depend on namespacing; trade-namespacing is a future scaling decision, not a blocking one.
2. ~~**Skill specialization mechanism**~~ — Addressed via the recognition-rubric pattern: trade-specific skills are hand-written with `## Recognition rubric` sections (see `skills/writing-skills-from-learning/recognition-rubric-format.md` for the format and `docs/examples/tpm-coordination-debt-detection.md` for an example). The "specialization mechanism" turned out to be a section-format convention, not a runtime feature.

The MCP-server question remains deferred. The architecture decisions above are made; their open growth-path triggers are named inline.

## Resolved since this was written

- **Bidirectional-link enforcement is now tooled.** `slipbox link`/`unlink`/`check` ship with the plugin and add/remove links atomically; asymmetric links can no longer be introduced through the tool. The original High-impact #1 entry was about wanting exactly this.
- **The verification ritual is a tool, not an inline script.** `slipbox check` (and `check --strict`) replace the ad-hoc Python the original Low-impact #8 entry pointed to. The skills now reference the tool by name; no inline script lives in `HANDOFF-technical-pm.md` or anywhere else.
- **Frontmatter consistency is enforced by construction.** `slipbox new <slug>` produces a skeleton with all required fields populated; `slipbox check --strict` validates the schema, source-path resolution, filename pattern, and stale isolates at session boundaries.
- **Per-trade architecture (High-impact #1) is decided.** Three sub-decisions: (1) judgment-as-first-class-artifact rejected — judgment patterns live inside existing artifacts (rationalization tables in skills, misreading tables in zettels, recognition rubrics in skills, narratives in episodic memory); (2) skill specialization via the recognition-rubric format — trade-specific skills are hand-written with `## Recognition rubric` sections; (3) trade-namespacing of `notes/` deferred with named growth-path trigger ("a second trade is being onboarded").
- **What's portable enough to be a zettel (Medium-impact #4) is partially codified.** The slug-density discipline (5-15 candidates per paper, 10-25 per major section, <3 candidates → maybe no zettel) plus the cross-source linking discipline ("survey existing slip-box hubs before drafting") together replace what was previously intuition. Recognition rubrics surface the situation-type test. Not fully closed (the case-typing problem remains open AI research), but the practical guidance is in place.
- **Choice under ambiguity has a capture-side architecture.** Recognition + deliberation, both hand-written in skills, no learned situation taxonomy yet. See `skills/writing-skills-from-learning/recognition-rubric-format.md`, `skills/deliberating-under-ambiguity/SKILL.md`, and `docs/examples/deliberation-test-iterations.md` for the RED-GREEN-REFACTOR validation.
