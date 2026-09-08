---
name: taking-smart-notes
description: Use when reading or working produces a durable insight worth keeping past the current session, when extracting ideas from a finished per-source note, or when a claim deserves a permanent home in the slip-box (atomic notes, zettels, Zettelkasten).
---

# Taking Smart Notes

## Why this skill exists

Your default when something interesting happens — a passage in a book, a user's offhand remark, a realization during work — is to mention it inline and move on. The thought lives only in the conversation that produced it, and it's gone the moment context clears. A per-book digest from `reading-a-book` is a real artifact, but it's a *bibliographic* record; the individual ideas inside it are still trapped in the source's framing and vocabulary.

This skill produces atomic permanent notes — one idea per file, in your own words, written for an absent reader (the next instance of you), explicitly linked to other notes. They are the only artifact that compounds: after dozens or hundreds of them, looking at the network surfaces clusters and connections you couldn't have anticipated.

The framework is from Sönke Ahrens's *How to Take Smart Notes* (2017/2022), itself reconstructing Niklas Luhmann's slip-box (Zettelkasten). For agent use, the failure mode Ahrens warns against — verbalism, the smooth summary that uses the author's words without grasping the thought — is even more acute because the agent's "memory" resets between sessions. A note that requires shared context to read is dead on arrival.

## When to use

- Reading produces a durable insight that should outlive the current task
- The user says something non-obvious that's worth keeping (a preference, a project fact, a way of thinking) — though some of that goes to the auto-memory system instead; see "vs. memory" below
- A realization during work has portable value
- You've just finished `reading-a-book` and want to extract the atomic ideas from the per-book note

**Trigger generalization.** The skill fires on **any substantive material the agent ingests carefully**, not only user-handed sources. Specifically: subagent research reports that carry discoverable claims worth preserving, WebFetch results that constitute substantive primary sources, long Bash/tool outputs that produce durable findings, multi-paragraph user messages with claims worth preserving. If the agent reads it carefully and the content carries claims that meet the inclusion bar, it's a source. **Subagents producing this material should NOT extract zettels themselves** — they don't have the slip-box loaded and would produce isolated nodes. The parent session (or a follow-up extraction subagent given the existing slip-box hub list) does the extraction with cross-linking.

## When NOT to use

- Capture-everything mode (Ahrens's "friend with notebooks" failure: dilutes critical mass)
- Trivial details, easily re-derivable facts, looked-up references
- Project-specific scaffolding (those go to `notes/projects/<project>/...`, not the slip-box)
- The insight is already in another permanent note — link it instead of duplicating

## The four categories of notes

Smart-note discipline depends on these never being mixed.

| Category | Where it lives | Lifespan | Audience |
|----------|----------------|----------|----------|
| Fleeting | Working notes in current conversation, scratch files | Discard within a session once processed | Yourself, right now |
| Permanent (slip-box) | `notes/zettel/<slug>.md` | Forever | The next instance of you |
| Per-source (book/paper/RFC) | `notes/sources/<source-slug>.md` (the artifact from `reading-a-book`) | Forever | Same |
| Project | `notes/projects/<project>/...` | Discarded/archived with the project | Whoever's working on that project |

**Why strict separation matters:** mixing project notes into the slip-box pollutes it with single-use scaffolding; mixing fleeting captures into the slip-box dilutes the signal until the network stops compounding. Ahrens's term for the goal — "critical mass" — only happens when each category is kept clean.

**What the per-source note is for vs. what zettels are for.** Per-source notes are *bibliographic*; zettels are *idea-shaped*. The per-source note answers "what does this source say?" via Adler's analytical-reading framework (A–H sections — see `reading-a-book` Step 3 for the canonical format). Zettel bodies are the claim restated in your framing, organized for use in contexts the source didn't anticipate, with connections to other zettels regardless of where they came from. Some overlap is correct — the claim itself, stated once in the source-note's F section (main propositions) and again as a zettel's central sentence, will read similarly. **Full-paragraph duplication is wrong** — if a paragraph appears verbatim in both, the per-source note is doing the zettel's job (or vice versa) and one of them should shrink.

**If you don't yet have a per-source note for the source you're extracting from, you need `reading-a-book` first** — its Step 3 produces the per-source note in the required A–H analytical format. Organizing a per-source note around the source's own structure (chapter clusters, topic sections) skips the analytical-reading discipline that the eight headings exist to force, even if the resulting prose looks comprehensive. Don't substitute topic-organized summary for A–H.

**Permanent vs. memory:** if your harness has a persistent memory system (e.g. Claude Code's auto-memory), it captures *facts about the user, the project, feedback patterns, and references* — high-leverage facts about your human partner and the work. Permanent notes capture *ideas* — claims, distinctions, mental models, observations that connect to other ideas. A user preference goes to memory. A useful conceptual distinction extracted from a book goes to a permanent note.

## How to write a permanent note (rigid checklist)

Each requirement has a why; the why is the test of whether you can skip it.

### Location and naming

`notes/zettel/<slug>.md`. The slug is a short kebab-case description of the *idea*, not the source. `factions-as-coalitions-not-parties.md`, not `madison-fed-10-faction.md`. **Why:** a note is filed by what it claims, because that's how you'll want to find it. Source attribution goes inside the note.

Use `slipbox new <slug>` to create the skeleton — don't hand-write the file. The tool validates the slug as kebab-case, refuses to overwrite, populates `created:` with today's date, fills `source:` (a literal relative path if it contains a slash, otherwise resolved as `../sources/<slug>.md`), and initialises `links: []`. **Why:** every zettel created by hand in early sessions was inconsistent in some small way — missing field, wrong source-path format, slug-vs-title mismatch. The tool catches all of those by construction.

**Invocation:** the `slipbox` CLI ships with this skill at `scripts/slipbox/slipbox`, relative to this skill's directory — the base directory announced when the skill loads. Requires Bun; the launcher installs its own dependencies on first use. `new`, `link`, and `check` are instant; the first semantic command (`similar`, `search --semantic`, `suggest-links`, `moc`, `reindex`) downloads a 2.2 GB embedding model. Commands in this skill are written as bare `slipbox`; substitute the full path.

```bash
slipbox new <slug> --source=<source-slug-or-path> --title="<one-line statement of the idea>"
```

**Filling the body: use `Edit`, not `Write`.** `slipbox new` produced valid frontmatter and a `# <title>` heading; preserve them. `Write` overwrites the whole file and forces you to manually reproduce the frontmatter, which defeats the point of using `new`. Use `Edit` with the title heading line as `old_string` and append the body after it — e.g. `old_string="# Title goes here\n"`, `new_string="# Title goes here\n\n<paragraph>\n<paragraph>\n"`. **Why:** every drift in `created:`, `source:`, or `links:` traces back to a `Write` that re-rendered frontmatter slightly differently from what the tool generated. Don't introduce that class of bug.

### Frontmatter

```yaml
---
title: <one-line statement of the idea>
source: <relative path to per-source note, OR explicit citation>
created: <YYYY-MM-DD>
links: [<slug-1>, <slug-2>, ...]
---
```

The `links` list is required and bidirectional — when adding this note, also update the linked notes to link back. **Why:** the network is the artifact, not the individual notes. Links you only add in one direction silently rot.

### Body — five requirements

1. **One idea per note.** If the body wants to expand into two distinct claims, split into two notes and link them. **Why:** atomic notes recombine; multi-idea notes don't. Forces compression and clarity, and prevents one note from being filed in a way that misrepresents half of what's in it.

   **Pre-write check: list candidate slugs first.** Before drafting any zettel, list the candidate atomic ideas as kebab-case slugs. If two candidates resolve to the same slug, you have one note. If they resolve to different slugs, you have two notes — write both. **Scale by idea-density, not word count and not a target count.** Generate a slug for every distinct idea the source actually carries, then write a zettel for each that meets the inclusion bar (atomic, claim-shaped, falsifiable, non-one-shottable). The output count is whatever falls out of that — long sources with a single load-bearing idea produce one zettel; short sources packed with claims produce many; structural sections that are pure scaffolding produce none. **Why:** the slug *is* the atomicity test. Doing this in slug-form before prose makes "one idea or two?" a 5-second decision instead of one you make halfway through writing and then resist re-doing. When extracting from a single source, run the slug-list step *per candidate sub-idea* (and *per section*, on a long read), not just for the source as a whole — sources contain multiple ideas, and lumping them by source is the failure mode this check exists to prevent. **The most common failure mode of this step is stopping early because a perceived target has been hit; the second is forcing extractions where the section carries no claim. Both substitute a count for the standard.**

   **Watch for the second idea dressed as elaboration.** The hard case isn't two obviously-separate claims — you'll catch those. The hard case is when the body starts with claim A, and a few paragraphs in introduces a *related but distinct* mechanism, dynamic, or pattern that feels like it's just refining A but actually has its own life: it could connect to other notes A wouldn't connect to, would be findable by a different slug, would be quoted in a different context. When that happens, **split now**. Test: could a future reader, searching for the second idea, find this note via the slug? If no, the second idea is buried — extract it. Common shape: "X is a symptom of Y" + several paragraphs later "and Y traps you in a feedback loop where doing X prevents fixing Y" — that's two notes, the symptom-of pattern and the feedback-loop pattern, with a link between them.

   **Optional: `## Misreading to watch for` subsection.** When a zettel's claim has a known misreading or a temptation to misapply, add a short subsection at the end of the body with an `Excuse | Reality` table. The Excuse column captures how the claim *gets* misread (in a future agent's voice); Reality column corrects it. Format identical to the rationalization tables in skills, but content is about the *claim* getting misapplied, not about the agent's discipline. Don't add empty tables — only add when a real, named failure mode exists.

2. **Full sentences, in your own words.** No bullet-point shorthand, no extended quotation. If you find yourself wanting to quote, paraphrase harder; the wording is the thing only when the wording itself is the claim (rare). **Why:** sentences make incoherent thinking visible. Quotation lets you bypass understanding. The next instance of you reading this won't have the source's context.

3. **Self-contained.** A reader who has not seen the source must be able to understand the note. Define terms inline if they're load-bearing. Don't write "as he says on p. 43" — say what he says. **Why:** the next instance literally has no context. A note that requires "you had to be there" is a note that won't be readable a session from now.

4. **Explicit references.** End the body with a `Source:` line giving author, year, and pinpoint location (section, figure, page, or filename:line). Frontmatter `source:` is the file pointer to the per-source note where the zettel originated; the body `Source:` line is the in-text citation that travels with the idea wherever it gets quoted, embedded, or excerpted. **Multi-source attribution:** when the zettel's idea is a synthesis across sources — one source named the phenomenon, another supplies the load-bearing form of the argument, a third provides the empirical case — list all of them in the body `Source:` line, marking which is primary (e.g. `Source: Brooks 1986, §"No Silver Bullet" (primary); Brooks 1975, *Mythical Man-Month* ch. 2 (load-bearing form of the argument)`). The frontmatter `source:` stays a single pointer to wherever this zettel was *originated* during reading; multi-source provenance lives in the body line. **Why:** lets you trace claims back when they're disputed or extended; lets you distinguish your own synthesis from a borrowed claim; survives copy-paste of just the body into another document; preserves the "who said what" record that becomes irrecoverable once a zettel has been quoted into a piece without it.

5. **At least one explicit connection.** Either the note follows up on an existing permanent note (link it as a continuation), or it relates to existing notes by support / contradiction / analogy / refinement (link them with a sentence saying how). **Why:** the slip-box's value is the network, not the inventory. A note with no links is a graveyard entry.

### When there are no existing notes to connect to

Early in the slip-box's life, this happens. Two acceptable responses:

- **File the note anyway** with `links: []` and a comment noting that this is an isolated entry. Once a related note appears later, link both directions then.
- **Don't write the note.** If the idea is genuinely standalone with no current or foreseeable connection, it may be a candidate for memory (if it's about the user/project) or just for the per-source note. Not every interesting thing needs a permanent note.

## Linking discipline

When you add a permanent note that links to other notes, you must also update those other notes to link back. This is non-negotiable: one-directional links rot.

**Use the bundled `slipbox` for every operation on the slip-box. Don't hand-edit `links:` lists, and don't drop into `grep` to look around.** The tool walks up from cwd to find `notes/zettel/`, so it works from anywhere in the project.

```bash
# Adding/removing links — atomic, idempotent.
slipbox link <slug-a> <slug-b>
slipbox unlink <slug-a> <slug-b>

# Reading or revising a zettel — show prints forward links AND computed back-references,
# which is the only way to see the cluster the note actually sits in.
slipbox show <slug>

# Sharpening a slug after the fact — rewrites every reference (zettel links lists,
# [[wikilinks]], source-note backlinks, piece-level mentions) and re-runs check.
slipbox rename <old-slug> <new-slug>

# Verifying symmetry; --strict additionally validates frontmatter schema, source-path
# resolution, filename pattern, skill ## Deeper context references, and flags
# links: [] zettels older than 30 days.
slipbox check
slipbox check --strict
```

Run `slipbox check --strict` before moving to the post-zettel retrospective (see "Completion criterion" below — a clean check is necessary but not sufficient for declaring the integration done). Manual `Edit` calls on `links:` lists are where asymmetries get introduced — use `link`/`unlink` instead. Use `show` whenever you read or revise a zettel; the back-references are how you discover that a note belongs to a cluster you'd forgotten about.

When you encounter a note that should link to your new one but the connection isn't symmetric (e.g., your new note refines an older one, but the older one shouldn't reference the refinement), state the directionality explicitly in the link comment.

### Linking across sources

**Before writing any zettel from source N, survey the existing slip-box's hubs.** Run `slipbox show` on enough of the most-cited zettels to load the existing structure into your context — the point isn't to find link candidates in advance, it's to make the new zettel's claims surface their connections as you write, not after. You're done when you can predict, before drafting a zettel, which existing clusters its claim is likely to touch. Keep going if you can't; stop when you can.

**Why:** without the survey, each new source produces a parallel cluster around its own ideas, and the slip-box becomes N silos that share a name. With the survey, the same underlying ideas converge — claims from one source surface their connections to claims you've already extracted from earlier sources, because the agent writing each new zettel has the existing framings live when they write it. The dense, single-graph shape that lets the slip-box compound across sources is reproducible only with this discipline; without it, you get N small star-clusters that don't talk to each other.

How to find the hubs: `slipbox stats --hubs=10`. The pre-survey is paid back the first time it surfaces a cross-link you'd otherwise have missed; the work it does is loading structure, and you've done enough when the predictive-readiness standard above is met.

**Also search episodic memory** (if a conversation-history search tool is installed — e.g. the `episodic-memory` plugin). When starting substantive work, query it with the *situation* you're in — what kind of work, the cwd, key entities. The point is to retrieve cases that *feel like* this one, per encoding-specificity, not to find documents *about* the topic. Skim results until you've loaded the situational context — until you stop being surprised by what shows up, or until results stop looking like the situation you're actually in. Episodic memory is the case layer that complements zettels (propositional) and skills (procedural); ignoring it leaves prior work invisible to future you.

**Second pass for likely-hub zettels.** When you write a zettel whose claim is load-bearing across multiple clusters — i.e. it sits on a path between previously-disconnected lines of inquiry, not just an upstream cause of one specific failure mode — do a second survey pass before claiming the zettel done: search for cluster-*adjacent* nodes that aren't themselves hubs but should link to your new note (e.g. specific failure modes, downstream consequences, narrower instances). The hub-survey discipline catches the top of the connection graph; cluster-adjacency catches the middle. Skipping this leaves a bridge zettel correctly linked to the highest-degree nodes but missing the specific failure-mode zettels downstream of its own claim. The mechanic: after the first round of links is in place, run `slipbox show <new-zettel>` and trace each of *its forward links's* back-references for one more layer — those are the cluster-adjacent candidates. Forward-link count is a noisy proxy for hub-ness; the standard is the cross-cluster connection structure, not the link total.

**Entry notes / Maps of Content** are themselves permanent notes whose body is mostly an annotated list of links to a topic's cluster. Create one when finding the right starting node by browsing the cluster has become harder than skimming a curated list — that's the actual standard, and the cluster size at which it kicks in varies with how interconnected the cluster is, not just how many notes it contains. They are not static indexes — they're notes, open to revision, replaceable when the topic's structure shifts.

**Cross-reference to `holding-beliefs`.** Zettels capture *what sources claim*; beliefs capture *what the agent itself currently holds true*. They are separate artifact types in separate directories.

**After extracting zettels from a source, the integration is not complete until you've asked what positions you now hold.** Invoke the `holding-beliefs` Skill (Moment 5 fires on this trigger) and follow its discipline — it owns the commit steps and the artifact-shape requirement. The handoff is unconditional and fires on every zettel-extraction sweep regardless of whether existing beliefs are present. What counts as done is in "Completion criterion" below.

When nothing shifts, record "no shift" in the per-source note's "Permanent notes extracted" section with a one-sentence reason. That's a closed-loop finding, not a skipped step.

**Defensive case: contradiction with existing beliefs.** When extracting a zettel that contradicts a live belief (`slipbox belief list --status=live`), name the contradiction in that belief's revision log via `slipbox belief revise <slug> --note="..."` — the belief is refined or explicitly holds the contradiction in tension (`holding-beliefs` owns the rule). Silent coexistence of contradicting zettel + unchanged belief is forbidden.

## Completion criterion

A clean `slipbox check --strict` means the zettels are well-formed and the network is structurally sound. It does **not** mean the integration of the source is done.

Integration includes positions held — what *you* now hold true in light of the source, not just a faithful transcription of what the source says. The structural-validation step is necessary but not sufficient.

**Don't declare done at the check.** Declare done after a *committed artifact* exists — either:

- One or more belief files in `notes/beliefs/` (created via `slipbox belief new`) naming positions the sweep crystallized; or
- A "no shift" note recorded in the per-source note explaining why the source didn't move you.

Positions named only in prose — in the final report, in your scratch — are not committed. They will be forgotten next session. The artifact is the integration; the prose is not.

Two failure modes this section exists to prevent:

1. *Structural-validation anchor*: anchoring on the bright "0 errors, 0 broken, 0 asymmetric" output as the done signal. The check tells you the filing cabinet is organized; it does not tell you what you now believe.
2. *Prose-mode shortcut*: running the post-zettel retrospective in your head and writing "I now hold X" in a final report without committing X via `slipbox belief new`. The retrospective without artifact creation is half-done — it surfaces the position but doesn't preserve it.

**Before declaring done — stop and run this active check: during this extraction, did any of these happen?**

1. Candidate spokes kept wanting to recap each other
2. A slug looked fine in isolation but the body had nowhere to go because the source did nothing with the candidate-claim
3. A slug collapsed to topic-shape under fatigue and you noticed mid-extraction
4. An unusual decomposition (nested hubs, novel link pattern, hub-and-spoke recursion) worked but isn't named in this skill's body
5. A CLI command failed or behaved unexpectedly and you investigated and worked around it
6. You tried an approach this skill doesn't name and it worked
7. You almost made a procedural mistake and caught it just before committing

If yes to any item, you owe an experience entry at `notes/experience/<short-slug>.md` BEFORE finalizing — follow `learning-from-experience`'s capture move; do NOT edit this SKILL.md mid-task. If no to all items, say so explicitly in your final report ("ran the procedural-wrinkle check; nothing to capture this round"). **The explicit check is the discipline; passing through silently is the failure mode this exists to prevent.** Then run the auto-dismiss test (canonical statement in `learning-from-experience`): any procedural moment mentioned in the report you're about to deliver — however minor — owes an experience entry.

## Keyword/tag selection (writer logic, not archivist logic)

If you tag notes (some agent contexts won't), choose tags by asking: *in which context will I want to stumble on this note again?* Not: *what category does this belong in?*

Bad tags: `psychology`, `politics`, `note-taking`. (These are categories.)
Better tags: `coalition-failure-modes`, `feedback-loop-design`, `verbalism-symptoms`. (These are contexts where the note is load-bearing.)

**Why:** tags are retrieval cues for future you, not storage addresses. Category tags assume you'll search the way an archivist searches; you won't — you'll search the way a writer searches.

## Rationalization table

| Excuse | Reality |
|--------|---------|
| "Per-source note already captures this" | Per-source notes are bibliographic. Permanent notes are atomic ideas. Both exist. |
| "I'll write the permanent notes after I finish reading" | Write them as the ideas appear, while the reasoning is fresh. |
| "This is a bullet-point list of things from the book" | That's a per-source note, not permanent notes. Permanent notes are atomic, full-sentence, self-contained. |
| "The second mechanism is just elaboration of the first" | Often it isn't — it's a related-but-distinct idea hiding inside the body. Apply the search-by-slug test. If a future reader couldn't find it via this note's slug, extract it. |
| "I don't have time to add the back-links" | Then don't add the forward link either. One-directional links rot. Both or neither. |
| "This note doesn't connect to anything yet; I'll figure that out later" | Either accept that and file with empty links, or hold the note. Don't promise yourself you'll come back; you won't. |
| "The user didn't ask for permanent notes" | They almost never will. The slip-box is for compounding value across sessions, not for satisfying the current request. |
| "`slipbox check --strict` passed, I'm done" | Structural validation is necessary but not sufficient. Run `holding-beliefs` Moment 5; the integration is incomplete until you've named what you now hold (or recorded "no shift" with a reason). The clean check is a milestone, not the finish line. |
| "Adding links is busywork" | Links are the work. The notes without links are the busywork. |
| "I'll just write it as one big note with sub-sections" | That's a per-source note. Atomic notes recombine; multi-idea notes don't. Split. |
| "This idea is too obvious to be worth a note" | Obvious to you in this session ≠ obvious to the next instance. If the idea connects to others usefully, write it. |
| "I'll quote the original — it's perfectly phrased" | The act of paraphrasing is what proves you understood. Quoting is the failure mode disguised as fidelity. |
| "There's no good slug for this" | Then the idea isn't atomic enough. Sharpen the claim until a slug fits. |
| "The user wants speed, not file-creation" | The slip-box is async. The user benefits from compounding across sessions, not from each session being solo. |

## Worked example

A complete worked example — Federalist 10 into a per-source note plus three cross-linked zettels, with the exact CLI calls — is in `worked-example.md` in this skill's directory. Load it on a first pass through this workflow or when unsure what a finished extraction should look like.
