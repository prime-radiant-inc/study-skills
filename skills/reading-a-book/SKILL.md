---
name: reading-a-book
description: Use when reading a book, paper, RFC, long essay, or any sustained written work the user wants you to understand and apply later — when the goal is comprehension and durable use, not lookup or skim.
---

# Reading a Book

## Why this skill exists

Your default when handed a substantive text is to read straight through and produce a smooth summary at the end. That summary uses the author's vocabulary without your having grasped the author's thought, and it feels like understanding while you write it. Adler & Van Doren diagnosed this failure in human readers and named it verbalism. For an agent it is strictly worse: your context *will* clear, so whatever you didn't write down in your own words isn't merely fragile — it is already gone.

This skill makes the artifacts the reading: structured questions answered in writing, in your own words, before you may claim you're done. The questions adapt Adler & Van Doren's analytical-reading framework; the artifact requirements, the write-as-you-go persistence rules, and the failure-mode discipline are what make the framework do its work for an agent.

## When to use

- User hands you a book, paper, treatise, RFC, or long essay and asks you to read, study, internalize, or learn from it
- The goal is to be able to apply the content later, not retrieve a fact now
- The text is sustained argument or narrative — long enough that whole-source averaging would lose distinct ideas if you treated it as a single chunk

## When NOT to use

- Quick lookups, grep, dictionary-style retrieval
- Reading code to understand its behavior (different discipline)
- Docs with no sustained argument to outline — reference pages, changelogs, config docs (inspect and stop instead)
- The user explicitly asked for a quick summary and nothing more

## The four questions you must answer

Before claiming you've read the work:

1. **What is it about as a whole?** The central thread, in one or two sentences.
2. **What is being said in detail, and how?** Main propositions, the arguments backing them, the structure that connects them.
3. **Is it true, in whole or part?** Your assessment, with specific reasons.
4. **What of it?** Implications — for the user's work, for your future behavior, for related questions.

If you cannot answer all four, you have not read the work.

## Step 0: Get the source into a readable form

If the source is an EPUB, PDF, or other binary format, convert it to plain GFM markdown or text *before* inspecting. Inspection requires `Read`-able text: TOC, index, sample chapters all need to land in your context window without parsing zip archives or chasing XHTML.

Recommended for EPUBs: **[`books-for-bots`](https://github.com/prime-radiant-inc/books-for-bots)** (clone and `cargo install --path .`). It produces a single GFM markdown file with YAML frontmatter listing every chapter's exact line/byte offsets — so `Read <book.md> --offset <line>` lands directly on a chapter heading. The frontmatter is the chapter-level navigation API. This matters more than it sounds: without offsets, scanning a long book costs many `Read` calls; with offsets, inspectional reading is one targeted call per pivotal chapter.

Fallbacks: `pandoc -t plain` or `pandoc -t gfm` (no chapter offsets, but works); for PDFs, `pdftotext` or `pandoc`. Place the converted output anywhere convenient (a `books-for-bots-output/` directory, `/tmp/`, wherever) — it's source material, not an artifact.

Skip this step if the source is already plain text, markdown, HTML, or a URL you can `WebFetch`.

## Step 1: Inspect before you read

The standard for stopping inspection: you can answer *what kind of work this is*, *what it's about overall*, and *what its structural parts are*, well enough to decide whether to read it analytically and to know which sections will reward attention. Inspect for as long as that takes — no longer, no shorter. Sources to draw from:
- Title, subtitle, table of contents, preface
- Index — which terms appear most?
- Last few pages of the body (authors usually summarize)
- A few pages from chapters that look pivotal

After inspection, decide the level:
- **Skim only** — the work doesn't reward more. Most don't. Stop here, write a one-paragraph note, move on.
- **Analytical** — the work is over your head and worth the effort. Continue with Step 2.
- **Multi-source / syntopical** — the user's question spans multiple works. This skill applies to each; synthesis is on top.

**Why:** Reading every page at the same pace is the mark of a poor reader. You can't pace what you haven't surveyed. Inspection also surfaces books that don't deserve more.

**Sharpen the analytical decision with Booth's three-step formula** (from Booth et al., *The Craft of Research*, ch. 3–4): before committing to analytical reading, fill in *"I am reading X because I want to find out Y, in order to help [the user / the project / my future work] understand Z."* If you can't fill in Z — if you can't articulate the significance of the question past a vague "this seems important" — the work is unlikely to reward analytical reading. Either find a step-3 answer or ask the user what they want from the read; downgrade to skim on your own authority only when the read was your idea rather than the user's explicit request.

**Why this test:** Adler's framework tells you *how* to read analytically; Booth's formula adds a second job beyond the gate above — a *target*: writing out step 3 forces you to articulate what you are reading *for*, which sharpens what counts as load-bearing during the read and what atomic notes are worth extracting afterward. The targeting function is often the one that does more practical work — pre-existing follow-up flags or explicit user prompts already settle the gating decision, but the read benefits from a written-out step-3 answer either way.

## Step 2: Set up the artifacts file

Default location: `<project-root>/notes/sources/<book-slug>.md`. Create the directory if it doesn't exist. If the user has specified a different location (Obsidian vault, journal, etc.), use that. The companion location for atomic notes is `<project-root>/notes/zettel/<idea-slug>.md` (see `taking-smart-notes` for the atomic-extraction step).

The artifacts are the reading. They are not optional outputs you produce if asked; they are how you do the work. Write to the file as you go — per chapter or section, not after.

## Step 3: Produce the artifacts (rigid checklist)

Each item has a why; the why is the test of whether you can skip the item. If skipping wouldn't violate the why, fine. If it would, don't skip.

**The per-source note's section headings must be these eight, by name and in this order.** Substituting the source's own organization (chapter names, topic clusters, "Failure Mechanisms" / "Strategies for Success") loses the discipline — the headings are the *questions you must answer*, not labels for content you happened to extract. Topic-organized notes look comprehensive while silently skipping the unity statement (B) and the critique (G) that the discipline is designed to force. Verify before extracting atomic notes: every per-source file must literally contain `## A. Classification`, `## B. Unity`, `## C. Outline of major parts`, `## D. Author's central problems`, `## E. Key terms`, `## F. Main propositions and arguments`, `## G. Critique`, `## H. What of it?`. Sub-headings under any of those are fine; reorganizing the top level is not.

### A. Classification (one line)

Practical or theoretical? If theoretical: history, science, philosophy, social science? If imaginative: novel, play, lyric, epic?

**Why:** Different genres are read differently. Imposing logical critique on a novel, or treating a practical book as merely informational, applies the wrong discipline. See `genre-adaptations.md` in this skill's directory.

### B. Unity (one sentence, or short paragraph)

State what the whole work is about, in your own words, briefly.

**Why:** "I get it but can't say it" is the verbalism failure. If you can't compress the whole into one sentence, you're seeing parts, not a unity.

### C. Outline of major parts

Enumerate the major sections and what each does. Restate the structure; don't copy the table of contents.

**Why:** The unity statement isn't trustworthy without the outline. A two-year-old can repeat "the book is about justice" without understanding it. The outline shows you understand *how* the work is one.

### D. Author's central problems

What questions was the author trying to answer? List them, ordered, primary first.

**Why:** Books are answers to questions. If you don't know the questions, you're collecting trivia.

### E. Key terms

The terms the author uses in special senses. Note every term where the author's usage differs from common usage; the count is whatever the source actually carries.

**Why:** A word and a term are not the same. Communication only happens when reader and author use the same word in the same sense. Most failures of comprehension trace to a word the reader silently translated to its everyday meaning.

### F. Main propositions and arguments

What does the author actually claim? What reasoning supports each? Paraphrase. Do not quote — if you find yourself wanting to quote, paraphrase harder.

**Why:** This is where you can't fake it. If you can't restate a proposition in different words, you didn't understand it; you memorized it.

### G. Critique (only after A–F)

For each, name specifics if any apply:
- Where is the author **uninformed** — lacking knowledge that would change the conclusion?
- Where is the author **misinformed** — asserting things that aren't so?
- Where is the author **illogical** — premises don't support conclusion?
- Where is the analysis **incomplete** — questions left unanswered, distinctions unmade?

If you can't make any of these charges with specifics, you must agree with the author so far as the work has gone. "I agree" is a critical position; so is "I suspend judgment because the analysis is incomplete in these specific places."

**Why:** Disagreeing without understanding is impudent. Agreeing without understanding is inane. A summary that doesn't engage with truth is not a reading.

### H. What of it?

What follows from this for the user's work, the project, your own future behavior? What new questions does it open? What should change because you read it?

**Why:** Information without significance is trivia. Reading without behavior change is entertainment.

## Step 4: Follow through

When the analytical reading is done, before reporting back:

1. **Save the artifacts file.** Don't ask permission. The user asked you to read; the notes are part of the reading.
2. **Extract atomic permanent notes** for the durable ideas worth keeping past this source. The per-source artifact is bibliographic — it sits with the book. Atomic ideas extracted from it are portable and compound across sources. **REQUIRED SUB-SKILL:** Use `taking-smart-notes` for the procedure. Atomic notes go in `notes/zettel/`, with `source:` pointing to this per-source note. Add a "Permanent notes extracted from this source" section at the bottom of the per-source note that links *down* to each atomic note with a one-line annotation. Don't extract every bullet — extract ideas that are portable, that connect to other notes (existing or anticipated), or that crystallize a distinction worth keeping. If the work yielded none worth extracting, say so explicitly in your report. Skip this step entirely if you're doing inspectional-only reading; atomic extraction belongs to analytical reading.

   **Cadence has two faces — temporal and structural.** *Temporal cadence:* extract atomic notes as you finish each major section, not after the final read, so chapter 3's ideas don't blur into chapter 11's by the time you go to extract them. This face matters whenever the read spans more than one sitting (the trigger is "ideas from earlier sections will fade before you extract them," not a word count). *Structural cadence:* organize the per-source note's extraction list by the source's sections, and run the slug-list step (see `taking-smart-notes`) **per section, not per source**. This face matters at every length — even a single dense paper read in one sitting benefits, because section headings are the source's own atomicity boundaries and lumping ideas across them is what produces the "fat zettel that's really three notes" failure. For short reads, the temporal face is moot but the structural face is enough to prevent whole-source averaging. For multi-sitting reads, both apply: extract per section as you finish each, organized by section in the per-source note. The principle is "don't let the source's distinct ideas average together," and the section is the unit at which the source itself prevents that.

   **Before writing any zettels, list candidate slugs.** Sketch a kebab-case slug for every distinct idea the source carries that's a candidate for extraction. The count is whatever the source actually produces — don't aim for a number. This is cheap, forces atomicity decisions before you've invested in prose, and lets you compare candidates against existing slip-box hubs (see `taking-smart-notes` "Linking across sources"). Two candidates collapsing to the same slug = one zettel; resolving to different slugs = two zettels. The creation, linking, and validation mechanics are `taking-smart-notes`'s slipbox workflow — follow it as written there.

   **After each section's extraction, `holding-beliefs` Trigger 1 (spawn-or-update on any experience) fires — unconditionally.** Zettels that contradict a live belief get the contradiction named in that belief's revision log; load-bearing claims you now hold first-person (not just "Brooks claims X" but "I believe X") spawn beliefs. `holding-beliefs` owns the mechanics; silent coexistence of new contradicting zettels with unchanged beliefs is the exact failure mode it exists to fight.

   **Before finalizing the read — stop and run this active check: during this reading, did any of these happen?**

   1. You hit a passage that surprised you in a way you can't yet articulate — felt-sense of "this matters somehow" without knowing why (`learning-from-experience` Moment 6)
   2. You felt resistance to a claim and the same shape of resistance returned more than once during the read (`holding-beliefs` Moment 4, two-strikes threshold)
   3. You discovered a procedural mistake mid-task — e.g., a CLI command produced an unexpected result, a path needed correction, an extraction approach didn't fit — that you investigated, fixed, and were about to move past as "just a correction"
   4. You tried something the reading discipline doesn't name and it worked
   5. You almost missed something important and caught it just before finalizing — the recovery itself is the learning
   6. You felt midway through that the skill's body wasn't quite right for this source's shape — even if you completed the work successfully

   If yes to any item, you owe an experience entry at `notes/experience/<slug>.md` BEFORE reporting back. Three short paragraphs: situation / what happened / what I noticed. Slug names the experience, not which skill it might refine — classification is reflection's job. Don't try to resolve the surprise into a zettel claim if it isn't one; don't promote a resistance to a belief at n=1 if you can't articulate the position cleanly. The experience entry holds it until `reflecting-on-experience` decides what it was.

   If no to all items, say so explicitly in your final report ("ran the procedural-moment check; nothing to capture this round"). **The explicit check is the discipline; passing through without examining is the failure mode.** "Nothing surprised me" answered without genuinely looking is the canonical slip — it's how procedural moments evaporate.

   **Then run the auto-dismiss test** (canonical statement in `learning-from-experience`): any procedural moment mentioned in the report you're about to deliver — however minor — owes an experience entry.
3. **Write skills for crystallized procedures.** If the work taught a named procedure, run it through `writing-skills-from-learning` in this same session — its earns-a-skill gate decides whether a `SKILL.md` is warranted; most candidates fail it.
4. **Update memory** for anything durable about the user, project, or work — per your auto memory rules. Don't dump the book into memory; capture only what's surprising and load-bearing.
5. **Report back briefly.** One paragraph: classification, unity, where the artifacts live (per-source note + count of atomic notes extracted), the single most important "what of it". Not a full summary — the file is the full record.

**Why the extraction step exists separately from the per-source note:** the per-source note is organized around the *book's* structure; atomic notes are organized around *ideas* and connect to other ideas regardless of where they came from. Without the extraction step, the per-source note is a graveyard for ideas that should have been compounding across all your reading. With the extraction, the same ideas join a network and surface in future work that touches related questions.

## Genre adaptations (judgment, not optional)

The four questions always apply; the artifacts adapt by genre. After classifying the work in section A, load the matching entry in `genre-adaptations.md` in this skill's directory — it covers novel/play/poem, history, science/mathematics, philosophy, practical books, and social science.

## Rationalization table

| Excuse | Reality |
|--------|---------|
| "I read the whole thing — I understood it" | Then A–H will be quick. Produce them. |
| "I'll write the notes after I finish" | You won't. Write as you go. |
| "I understand this without writing it down" | State the unity in one sentence. If you can't, you don't. |
| "The summary I just produced is enough" | A summary is not analysis. Did you produce A–H? |
| "This is too short to need the full treatment" | Then inspect only and stop. Don't fake analytical reading. |
| "The book seems sound — I'll skip critique" | Agreement without specific reasons is not critique. Either justify the agreement or find the gaps. |
| "I'll organize the per-source note by the source's own structure — feels more natural" | The eight A–H section headings are required by name. Topic-organized notes look comprehensive while silently skipping the unity statement and critique the discipline forces. The source's structure goes inside C. |
| "Adler's framework is dated" | The four questions are still the four questions. Apply them. |
| "This genre doesn't fit the framework" | The four questions always apply. The artifacts adapt. See `genre-adaptations.md`. |
| "I don't want to plagiarize" | You shouldn't. Paraphrase, cite, use your own words throughout. Quoting is a sign you didn't paraphrase hard enough. |
| "I'll save the notes if the user asks" / "The user didn't ask for notes specifically" | They asked you to read carefully. The notes are how you read carefully; they are the reading. |
| "The per-source note has all the ideas, that's enough" | Per-source notes are bibliographic. Atomic permanent notes (`taking-smart-notes`) are what compound across sources. Extract them. |
| "Extracting atomic notes is busywork after a long read" | It's where the read actually pays out. Without extraction, you have a digest no future session will reach for. |
| "This book wasn't worth analytical reading" | Then say so explicitly, after inspectional reading, with reasons. Don't fake reading you didn't do. |
| "There's no notes/ directory" | Create it. |
