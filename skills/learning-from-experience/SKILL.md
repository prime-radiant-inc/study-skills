---
name: learning-from-experience
description: Use mid-task when something procedurally interesting just happened — a skill's procedure didn't fit the situation, a novel approach worked, a failure-then-recovery taught something, a source or user critique bears on an existing skill, or a procedural surprise resists naming.
---

# Learning from Experience

## Why this skill exists

Skills currently revise either real-time (too disruptive — breaks task flow; the agent is in task-mode not author-mode; the insight is fresh but partial) or never (the observation evaporates). The bind is structural: in the moment, you don't have the perspective to know whether what you just learned generalizes, you don't have the bandwidth to apply the full skill-authoring discipline, and you don't yet know which skill (or skills, or no skill) the experience actually refines. So the default outcome is that procedural learning lives only in your transient context and disappears the moment context clears.

Beliefs solve the analogous problem inside one skill: `holding-beliefs` catches the moments of formation and owns the deliberate artifact discipline. Skills haven't had that pairing. This skill is the formation half. Its companion `reflecting-on-experience` is the synthesis half.

## The six learning moments

Each moment names a recognizable cue. None requires that you know what the experience *means* yet — only that something procedurally interesting happened and the observation is worth a structured record.

### Moment 1: invocation failure

You invoked a skill and its procedure didn't predict the situation cleanly. You may have improvised, or struggled, or finished correctly but felt the skill's body wasn't quite right for the case. The mismatch is the moment.

### Moment 2: novel success

You tried an approach no skill named. It worked. The novelty is the learning — either the situation didn't trigger any existing skill (gap), or it triggered one but you departed from it productively (refinement).

### Moment 3: multi-attempt

Your first approach failed; a second (or third) succeeded. The procedural learning is in the failure-and-recovery, not in the eventual success alone. If you only capture "this worked," you lose what made the first thing not work.

### Moment 4: source-relevant

You're reading a new source and the procedural content refines, contradicts, or completes a procedure an existing skill encodes. Most source reading doesn't fire this moment; the cue is when you read something and a specific existing skill comes to mind as needing the new content.

### Moment 5: user pushback

A user critique exposed an assumption a skill encoded silently. The skill went forward as written; the assumption was wrong; the gap is procedural. (The pushback itself may also fire `holding-beliefs` Trigger 1 — they're not mutually exclusive.)

### Moment 6: surprise without a name

Something procedural happened that you'd defend articulating later but can't yet name. The cue is the felt sense of "I want to remember this" without yet knowing why. Don't ignore it; capture it and let reflection figure out what it meant.

## The capture move

The whole skill is one move done quickly, mid-task.

1. **Pause briefly. Do not revise any SKILL.md.** The SKILL.md edit is downstream of synthesis (`reflecting-on-experience`), not of capture. Skipping ahead to revision is the wrong mode and the most common rationalization the agent reaches for in the moment.
2. **Choose a slug naming the experience itself, not a skill it relates to.** Examples: `hub-and-spoke-distributed-argument`, `belief-formation-after-three-failed-extractions`, `pushback-on-the-decide-how-to-decide-bracketing`. The slug should describe what happened, not which procedure it refines. You don't know that yet.
3. **Write one file at `notes/experience/<slug>.md`.** Project-local, alongside `notes/zettel/` and `notes/beliefs/`. Three short paragraphs:
   - **Situation.** What were you doing? What skill (if any) were you invoking? What was the context? One paragraph.
   - **What happened.** The event itself: the surprise, the failure, the recovery, the novel move. Include what you tried and whether it worked. One paragraph.
   - **What I noticed.** The learning in your own voice — what surprised you, what you'd do differently, what assumption seemed to fail. Avoid prescribing a procedure; just describe the noticing. One paragraph.
4. **Continue with the task.** The capture does not block declaring the current work done.

The file format is journal-like. **No frontmatter at capture time.** Not even `date:`, `situation:`, `context:`, `refines:`, `cluster:`, `links:`, or any other field. The date is recoverable from the filesystem; the context belongs in the Situation paragraph. Reflection (`reflecting-on-experience`) is the *only* place where frontmatter gets added — typically `refines:` and `cluster:` and `reflected-in:` pointers added when an entry is consumed by a synthesis pass. If you write any frontmatter at capture, you are pre-classifying, which is reflection's job.

**Slug format.** Use a short kebab-case slug that names what happened. No date prefix (`2026-05-11-hub-and-spoke.md` is wrong; `hub-and-spoke-distributed-argument.md` is right). No skill-name prefix (`taking-smart-notes-wrinkle.md` is wrong; `recap-symptom-on-distributed-argument.md` is right). The slug is the noun of the experience itself — what you'd grep for next month when looking for "that thing where the slug-list step kept wanting to recap".

**Body structure is three paragraphs, not three named sections.** The headings are inline labels (**Situation.** ... **What happened.** ... **What I noticed.**), not `## Situation` / `## What happened` / `## What I noticed`. Don't add additional named sections (`## Pattern recognized`, `## Adversarial note`, `## What I'd do differently`, `## How to apply better`) — that structure is reflection's structure, not capture's. The third paragraph (What I noticed) absorbs all of it: the noticing, any tentative-pattern-naming, any adversarial uncertainty. Save the explicit sectioning for the synthesis doc that reflection produces.

## The auto-dismiss test

Run this whenever you're about to finalize work and report back — sibling skills invoke it by name at their capture checkpoints. Look at the report you're about to deliver: are you mentioning any procedural moment in your prose, even framed as "minor", "cosmetic", "I left it as-is", "I noticed but didn't act on it"? **If you mentioned it, you noticed it, and you owe an experience entry.** Dismissing an item at item-judgment time as "not worth capturing" is the second-order slip: an active check found something, you classified it as small enough to skip, and the observation evaporated anyway. The size of the moment isn't the test — the noticing is the test. Capture even the small ones; `reflecting-on-experience` decides later whether the pattern across small moments matters.

## Don't pre-classify by skill

The most tempting failure mode is to ask "which skill does this refine?" mid-capture and file the entry under that skill. Resist this.

At capture time you have n=1 evidence, partial insight, and a task to finish. The classification work — *which skill (if any) does this refine, does it point at a missing skill, does it apply to multiple skills, is it one-off noise* — requires the reflective mode `reflecting-on-experience` exists to provide. Filing the entry under a specific skill at capture time burns that work in prematurely and locks the entry into a single-skill frame it may not belong in.

The slug names what happened. The file goes in `notes/experience/`. That's it. Reflection takes it from there.

## Common rationalizations

| Rationalization | Reality |
|---|---|
| "I should edit the SKILL.md right now while it's fresh." | Editing is downstream of synthesis. n=1 is enough evidence to capture, not enough to revise. Capture preserves the freshness; revision needs reflective context the moment doesn't have. |
| "Let me at least decide which skill this is for." | The classification work is reflection's job. At capture time you don't yet know if it refines one skill, several, none, or points at a missing one. Filing by skill burns that work in prematurely. |
| "I'll add `refines:` / `cluster:` / `skill:` frontmatter to make this easier to find later." | That's reflection's classification, added during the synthesis pass when the entry is consumed. At capture you don't yet know which skill it refines or which cluster it belongs to. The `find` command and full-text search work fine on slug + body; you don't need frontmatter to make the entry retrievable. |
| "Date-prefixed slugs make timeline reconstruction easier." | The filesystem's mtime is the timeline. The slug is the *experience-shape*, not the date. Date-prefixed slugs collide with the file-shape every other artifact in the slip-box uses (zettels, beliefs) and import a journaling convention that doesn't fit this layer. |
| "I'll write it with `## Section` headings so each part is clearly delimited." | The three paragraphs *are* the delimitation. Headings impose synthesis-shape on capture, and capture isn't synthesis. If you find yourself wanting `## Pattern` or `## Adversarial note` headings, you're doing reflection's work at capture time — stop, write the three paragraphs, and let reflection produce the structured doc later. |
| "I'll just remember it." / "I'll come back to write this down later." | You won't, and coming back is the rationalization. The whole point of this skill is that procedural learning in transient context evaporates. The moment is now. |
| "This is too small to capture." | If you'd defend the noticing under pushback, it's not too small. Capture is cheap. |
| "It's just n=1; it probably doesn't generalize." | Capture doesn't claim generalization. The entry is *evidence* for reflection to consider, not a proposed procedural change. Withholding capture because n=1 is conflating the two modes. |
| "I'll mention it to the user instead." | Conversation isn't an artifact. The user can't remediate skills at every interaction, and the observation won't survive context clear. Capture it as a file, then mention it if you want. |
| "I don't have time mid-task." | Three short paragraphs. The flow recovery is faster than you expect. The alternative is the observation evaporating, which is the failure mode this skill exists to prevent. |
| "The wrinkle wasn't really a problem; the skill worked fine." | Then the entry's "what I noticed" paragraph says so. "The skill worked as written; the case I was worried about was handled cleanly" is a valid capture — it's evidence the skill generalizes, which reflection should also see. |

## Routing adjacent moments

- **Position-shaped moments go to `holding-beliefs`** (its formation moments) — "I commit to X" rather than "when Y happens, doing Z works better." Both skills can fire on the same moment; the discriminator is the shape of what you noticed.
- **Source claims go to `taking-smart-notes`** — a zettel captures what the source asserts; an experience entry captures what you encountered while practicing.
- **Synthesis happens in `reflecting-on-experience`** — it reads the accumulated log, finds patterns, classifies entries, and produces any actual skill or belief revisions. When it concludes the log shows a missing skill, `writing-skills-from-learning` does the drafting. Nothing else schedules reflection: when entries without a `reflected-in:` pointer have accumulated in `notes/experience/` and you're at a natural pause — significant work finished, session wrapping up — a reflection pass is owed.
