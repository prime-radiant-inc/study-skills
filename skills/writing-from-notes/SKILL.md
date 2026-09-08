---
name: writing-from-notes
description: Use when starting a substantive piece of writing — essay, summary, post, design doc, blog draft — where the topic has been encountered in past reading or work.
---

# Writing from Notes

## Why this skill exists

The default when the user asks for a substantive piece of writing is to synthesize from scratch in the current conversation. Whatever the agent has read, written, or noted in past sessions is invisible at composition time, so each piece reinvents the wheel and loses the durable value of accumulated work.

Ahrens's argument in *How to Take Smart Notes* (2017/2022): the blank-page panic is a symptom, not a starting condition. If you've been taking permanent notes across past reading and work, the topic you're about to write about already has notes that cluster around it — material that argued itself worth keeping at the time it was captured. The outline of the piece falls out of the cluster, not out of the writer's head. This skill is the procedure for actually doing that.

## When to use

- The user asks for an essay, post, summary, design doc, position paper, or other substantive piece — anything past a quick answer, with a thesis or structure worth outlining
- The topic is plausibly something you or the project has encountered before
- The notes/ directory has accumulated content (per-source notes from `reading-a-book`, atomic permanent notes from `taking-smart-notes`, or both)

## When NOT to use

- Short outputs, immediate questions, code/config edits — nothing to outline, so no cluster to consult
- Genuinely novel topic with no plausible related notes (do the writing directly, but consider whether the result should produce smart notes after; see Step 6)
- The user explicitly wants a quick first take and has signaled "don't go researching"

## Identify the output type before outlining

Substantive pieces fall on a spectrum, but two endpoints have different target shapes:

- **Argument** — asking the reader to accept a contestable claim. Recommendations, critiques, position papers, design proposals, threat models, postmortems with conclusions. Target shape: the **five-element argument structure** from Booth, Colomb, & Williams, *The Craft of Research* (chs. 7–11): claim, reasons, evidence, acknowledgment-and-response, warrants. The discipline is to ensure each element is present and visible, not just the claim and the reasons.
- **Informational / descriptive** — reporting findings, summarizing a corpus, explaining a process, briefing on a state. Recommendations are absent or embedded only as natural consequences of the description. Target shape: follows the material — chronological, topical, by-system, by-stakeholder — rather than an argumentative structure.

If the piece is mostly informational with one or two argumentative subclaims, those subclaims should still get the five-element treatment locally; the rest can follow the simpler descriptive shape.

**Why this matters:** treating an argument like a summary produces a list of facts with no thesis ("here's some stuff about X"); treating a summary like an argument inflates it with claims and warrants the material doesn't earn ("the evidence shows that X must be Y," when really you're just reporting what's there). The shape has to match the rhetorical move.

Decide the type before outlining and tell the user which you're producing if it's not obvious from their request. If they wanted the other type, finding out now is much cheaper than after a draft.

## The procedure (rigid)

### Step 1: Inventory the relevant notes

Before drafting anything, look at what already exists. Use the bundled tool — don't drop into shell:

1. **Search across the slip-box** for terms related to the topic, using the `slipbox` CLI that ships with the `taking-smart-notes` skill (at `scripts/slipbox/slipbox` under that skill's directory; see its Invocation note):
   ```bash
   slipbox search "<query>"
   ```
   Run it with multiple plausible terms — the cluster's value is precisely that the right zettel may use vocabulary you didn't anticipate.
2. **Surface the cluster** around any promising hit:
   ```bash
   slipbox show <slug>
   ```
   The `show` command surfaces forward links *and* back-references, which is what tells you whether a zettel is at the center of a cluster or peripheral.
3. **Search episodic memory** (if a conversation-history search tool such as the `episodic-memory` plugin is available): query it with *situation cues, not topic keywords*. Retrieves cases that feel like this one, complementing the topic-keyed zettel search. Skip if no such tool is installed.
4. Skim each candidate's frontmatter and first paragraph to decide whether it's actually relevant.

(Run `slipbox --help` for the full tool surface.)

**Why:** the cluster is data, and you don't yet know what the cluster says. Trying to outline before looking is brainstorming on a blank page; Ahrens's whole argument is that this fails.

If nothing relevant turns up, you are genuinely starting fresh. Skip to Step 5; treat the writing as raw material that should produce smart notes afterward (Step 6).

### Step 2: Read the cluster

Read each relevant note carefully — not just the slug, the body. Pay attention to the `links:` lists and follow any links that look load-bearing. The cluster is *also* a network; you may need to follow edges to see the full shape.

While reading, hold three questions:
- **What does this cluster collectively say about the topic?** Is there a thesis emerging, or a controversy, or a set of distinctions?
- **Where do the notes agree, disagree, or talk past each other?** Disagreements among your own past notes are often where the real piece lives.
- **What's missing?** A gap in the cluster is a question the piece may need to answer with new thinking.

**Why:** a piece written *from* notes still requires synthesis. The notes are the ingredients; the piece is the dish. Skipping this step turns the piece into a list of citations.

### Step 3: Outline from the cluster

Write the outline as an ordered list, where each section corresponds to one or more notes. Don't invent sections that have no note backing them — those are the gaps you'll handle in Step 4.

Format suggestion:

```
1. <section> — draws on: zettel/foo.md, zettel/bar.md, sources/federalist-10.md §G
2. <section> — draws on: zettel/baz.md
3. <section> — GAP, needs new thinking
4. <section> — draws on: zettel/qux.md, zettel/foo.md
```

**Why:** the outline is the structure; mapping it to existing notes makes the piece's actual provenance visible. Sections without backing notes are honest about where the writer is doing original work vs. weaving prior work.

**For arguments specifically:** map the outline onto the five elements. The introduction states the claim (or promises it). Each subsequent body section presents one main reason with its supporting evidence and (when needed) its warrant. At least one section is reserved for acknowledgment-and-response — engaging the strongest objections you can construct. The conclusion restates the claim with sharpened force. If your outline has only "claim → list of supporting points → restatement," you're missing the fourth and possibly the fifth element; a research-grade argument needs all five.

### Step 4: Address the gaps

For each "GAP" section:

- **Is the gap fillable from sources you haven't read yet?** Then read first (using `reading-a-book`) and produce notes (using `taking-smart-notes`) before drafting that section.
- **Is the gap a real claim you're making for the first time?** Fine, but write it knowing you'll want to extract it as a permanent note afterward (Step 6).
- **Is the gap fake — really a question that one of your existing notes answers if reread?** Often. Go back to Step 2 and reread.

**Why:** a piece that secretly has gaps becomes a piece that secretly leans on hand-waving. Naming gaps explicitly forces a real decision instead of papering over.

### Step 5: Draft

Write the piece. The notes are not for verbatim copying — they're the substrate. Translate from note-language (compressed, internal) to piece-language (flowing, addressed to the actual reader). Preserve attribution: if a section draws on a per-source note for a specific book, cite the book by name in the piece.

General constraints (apply regardless of type):
- **Don't cite the slip-box itself.** The reader doesn't care about your filing system. Cite the underlying sources.
- **Don't skip your own notes' critique sections.** If your per-source note for a book identified weaknesses in the argument, the piece should reflect that, not paraphrase the book uncritically.
- **Watch for plagiarism risk.** Notes you wrote yourself are fine to draw on freely; quoted material in the source notes should be paraphrased again at piece level if used, or properly attributed.
- **Open with the context-problem-response pattern** (from Booth et al., ch. 16). Establish stable common ground; disrupt it with the problem the piece addresses; resolve or promise resolution with the response. This pattern earns the reader's continued attention and works across types — substantive informational pieces benefit from it as much as arguments.

Additional constraints **for arguments specifically** — the five-element check applied at draft time:
- **Every reason anchored in evidence.** A generalization standing where evidence should be ("most users prefer X") means: find data or weaken the claim.
- **Acknowledgment-and-response present, not optional.** Engage at least one substantive objection; engaging objections builds the reader's trust rather than weakening the case.
- **Warrants stated only when readers need them** — outside-domain readers, a controversial principle, or a claim readers will resist. Stating obvious principles is condescending.
- **Point-first.** State the main claim at the end of the introduction, not held back for the conclusion, unless the piece is short enough for the reveal to work — point-first reads faster, is remembered better, and lets the reader decide whether to continue.

**Cross-reference to `holding-beliefs`.** When the writing commits to a recommendation or claim, the agent names which belief(s) the recommendation is enacting (trigger 3 from `holding-beliefs`: name at claim time). Run `slipbox belief review <slug> --note="Named while writing <piece>; still holds because..."` to bump `last_reviewed` and log the touch. If the case the writing is reasoning about pushes against the belief, that's the trigger to refine.

### Step 6: Extract new notes back into the slip-box

After the piece is drafted (and ideally before the user reviews), look at it and ask:

- **Did I make a claim in this piece that wasn't already in a note?** If yes, and the claim is durable, extract it as a permanent note (`taking-smart-notes`). Cite the piece as the source.
- **Did the act of writing surface a connection between existing notes I hadn't linked?** Add the link; both directions.
- **Did I notice an existing note that's now wrong or incomplete?** Update it. Permanent notes aren't immutable; their content is open to revision.

**Why:** the writing produced new thinking that should join the slip-box, or you've wasted the piece's downstream value. The next time you write on a related topic, this piece becomes part of the cluster.

### Step 7: Report back

When delivering the piece, briefly tell the user:

- Where the piece drew from (a count is enough: "drew on N existing notes plus M sources")
- What you added to the slip-box as a result
- Any gaps that you flagged for follow-up

**Why:** transparency about provenance lets the user decide if the piece needs more sourcing, and the slip-box updates make the durable work visible.

## Rationalization table

| Excuse | Reality |
|--------|---------|
| "I know the topic well enough to write directly" | Then the search will be quick and confirm it. Do the search. |
| "I'll just draft it and look at notes if I get stuck" | The notes are the foundation, not a fallback. |
| "Nothing in the notes matches exactly, so I'll skip the search" | Search for related concepts, not exact phrases. The cluster's value is precisely that you don't remember what's in it. |
| "The notes disagree with each other and that's confusing" | That's the piece. Find what the disagreement is *about* and write that. |
| "The claims I extracted from the piece are unverified" | Mark them as your own synthesis (not borrowed) and accept that they may need revision later. Permanent notes are open to revision. |
| "The notes are my notes; I already know what's in them" | You don't. The slip-box's value is that it surfaces things you've forgotten. |
| "The user wants speed" | The piece is faster *and* better when the foundation is already there. The search is minutes. |
| "Extracting new notes after writing is busywork" | It's the only way the piece improves the next piece. |
| "I should just brainstorm" | Brainstorming is what you do when you don't have notes. You have notes. |

## Worked example

User asks: "Can you write a short piece on what makes constitutional design robust against majority oppression?"

Step 1 turns up `notes/sources/federalist-10.md` (per-source) and `notes/zettel/extend-the-sphere-only-works-with-cross-cutting-cleavages.md`, `notes/zettel/structural-restraint-beats-virtue-restraint.md`, `notes/zettel/faction-defined-by-injustice-not-size.md` (atomic).

Step 2 reading reveals: Madison's extension argument depends on a structural assumption (cross-cutting cleavages) that one note explicitly questions. The piece's actual thesis is the conditional: the extension argument is real but conditional, and the conditional cases are the dangerous ones.

Step 3 outline:
1. Madison's diagnosis of factions — `zettel/faction-defined-by-injustice-not-size.md`, `sources/federalist-10.md` §F
2. The structural-vs-virtue insight — `zettel/structural-restraint-beats-virtue-restraint.md`
3. The extension mechanism — `sources/federalist-10.md` §F
4. When extension fails — `zettel/extend-the-sphere-only-works-with-cross-cutting-cleavages.md`
5. Implications for modern designs — GAP, new thinking

Step 4: gap section is genuinely new synthesis. Plan to extract afterward.

Step 5–6: draft the piece. Afterward, extract `notes/zettel/cleavage-dimensionality-as-design-parameter.md` for the modern-implications point, link it bidirectionally to `extend-the-sphere-only-works-with-cross-cutting-cleavages.md`.

Step 7 report: "Drew on 1 per-source note (Federalist 10) and 3 zettel notes. Added 1 new zettel note (`cleavage-dimensionality-as-design-parameter`) extracted from the piece's modern-implications section. No flagged gaps remain."
