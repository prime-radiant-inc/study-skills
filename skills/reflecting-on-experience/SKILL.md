---
name: reflecting-on-experience
description: Use at deliberate reflection moments — finishing significant work, unconsumed experience entries having accumulated in notes/experience/ since the last pass, a notable success or failure involving a skill, teaching forcing you to articulate what you do, or picking up a skill after time away.
---

# Reflecting on Experience

## Why this skill exists

`learning-from-experience` captures skill-relevant moments as lightweight evidence with no pre-classification. Without a deliberate-synthesis discipline, the experience log accumulates without ever feeding back into actual skill revisions — entropy. Real-time revision is the wrong mode for synthesis: doing-mode is too narrow a perspective to identify patterns; single-entry revisions overfit; procedure churn ossifies.

This skill is the synthesis half of a formation/synthesis pairing. Synthesis happens at deliberate reflection moments, not opportunistically. It's batched, narrative-first, and conservative. It also does the classification work that capture deferred: *which* skill (if any) each experience refines, which point at missing skills, which are one-off noise.

## The defining discipline: most synthesis sessions produce no change

This is the load-bearing stance, easy to get wrong. The natural mode under "reflection time" is *what should change?* The right default is *should anything change?* — and the right answer to that question, most of the time, is "no, not yet, more evidence."

Conservative-by-default means:
- A pattern surfacing at n=2 is a candidate, not a mandate to revise.
- The skill being right as written is the null hypothesis; the experience log has to overcome it.
- Proposing a change for *every* pattern in the log is a signal of overfitting, not thoroughness.
- "No change needed this session" is a valid and recordable outcome, not a failure of reflection.

If your synthesis pass routinely produces changes for every cluster, the discipline has slipped. Read the rationalization table.

## The procedure

### 1. Reload, don't pre-classify

Read everything before deciding anything.

- Read every entry in `notes/experience/` that doesn't already carry a `reflected-in:` frontmatter pointer (i.e., entries not yet consumed by prior synthesis).
- Read the bodies of the skills the entries plausibly relate to. Not just their descriptions — the actual procedures.
- If reflection is at a longer cadence (end-of-quarter, picking up a skill after time away), also read recent zettel additions and belief revision logs for context.
- Resist the urge to start writing the synthesis doc while reading. Let memory reload first.

### 2. Look for pattern, not single-entry fix

A single entry is rarely sufficient evidence to revise a skill — it's n=1 by construction. Patterns are what justify changes:

- **What's repeated across entries?** Multiple entries hitting the same cue or failure mode in the same skill.
- **What surprised you on re-read?** Things you'd forgotten happened, or that read differently a week later.
- **What had you forgotten you'd noticed?** Entries that landed since the last pass and got buried.

Single entries that point at the same skill but at *different* failure modes don't necessarily cluster. Two entries about `taking-smart-notes` may be one cluster (same underlying issue) or two singletons (different issues each at n=1). The slug-level test: would the same proposed skill revision address both? If yes, cluster. If the proposed revisions are different, two singletons.

### 3. Classify each pattern

For each pattern, name what it refines:

- **Existing skill refinement** — pattern points at an addition or sharpening of an existing skill's procedure.
- **Missing skill** — pattern points at procedural territory no current skill covers. Hand off to `writing-skills-from-learning` for the four-test gate.
- **Belief refinement** — pattern points at a position you hold (or should hold) rather than a procedure. Hand off to `holding-beliefs` — Trigger 4 (stale review on touch) for refinements of existing beliefs, or its formation moments for a new candidate.
- **One-off noise** — pattern doesn't generalize; the entry is interesting evidence but not actionable. Record explicitly that you considered it and concluded one-off.

Note: an entry's classification is *not* fixed at capture time (`learning-from-experience` explicitly defers this). Now is when classification happens. An entry may refine multiple skills, or point at a gap, or be classified as one-off — all of those are valid.

### 4. Narrative first, diff second

For each pattern that survives steps 1–3, write a one-paragraph *narrative* before drafting any procedural change.

The narrative is in your own voice and answers:
- What did I notice across these entries?
- What do I currently think it means?
- How might the relevant skill (or belief) need to change as a result?

**The narrative is the work.** The procedural diff is downstream of the narrative — derived from it, not arrived at directly. If you can't articulate the narrative cleanly, you don't yet have a synthesis; you have raw entries.

Anti-pattern: writing the proposed SKILL.md edit first and then writing the narrative as a justification. The narrative driving the diff is the discipline; the diff driving the narrative is rationalization. The order matters because the narrative forces you to say what you noticed in *your* voice, separate from the source's framing or the skill's existing vocabulary.

### 5. Adversarial step — mandatory per pattern

This is the load-bearing test that distinguishes synthesis from overfit-eager-revision.

For each pattern with a narrative, write the strongest argument that **the existing skill is right as written** and the pattern does not justify a change:

- Are there cases the existing skill handles correctly that the proposed change would break or complicate?
- Is the pattern the result of n=2 entries that share a confounder (same project, same source-shape, same time of day, same fatigue level) rather than a generalizable failure mode?
- Would a thoughtful reviewer reading the skill say "this case is already covered by the existing language, just less explicitly"?
- Is the proposed change adding complexity for a case rare enough that the discipline of the existing skill is cheaper to keep?

If the adversarial argument is **also defensible** — if a thoughtful person could read it and find it credible — the pattern does not yet warrant a change. Defer with a note: "Considered, deferred. Strongest counter: [X]. Wait for more evidence."

If the adversarial argument is **clearly weak** — the strongest opposite doesn't survive contact with the evidence — the pattern survives and the change is justified.

Skip this step and you will revise skills based on overfit signals.

### 6. Derive the diff from the narrative (only if pattern survived adversarial)

Now and only now, derive the specific SKILL.md change. The diff should:

- Be traceable to the narrative — a reader of the narrative + the diff should see how one produced the other.
- Be minimal. Add the smallest sentence(s) that close the failure mode. Don't restructure the skill around the pattern.
- Cite the originating experience entries in a comment or skill revision log.

If the SKILL.md is in a read-only plugin install (the common case when this plugin is installed from a marketplace rather than checked out for development), write the proposed diff to a sidecar file in your project — typically `notes/experience/reflections/proposed-skill-edits-<date>.md` — and flag it as proposed-pending-plugin-edit. Don't try to write to the plugin's source.

### 7. Archive consumed entries

For each experience entry consumed by this synthesis pass, add frontmatter pointers so future reflection can see what's already been processed:

```yaml
---
refines: <skill-slug>            # or "missing-skill" or "belief" or "one-off"
cluster: <pattern-slug>           # e.g., "distributed-argument-extraction"
reflected-in: reflections/<date>-reflection.md
---
```

This makes consumed entries queryable and lets the next reflection pass skip them by default (reading entries that *don't* have `reflected-in:` is the natural filter).

### 8. Record deferrals explicitly

For patterns that did not survive the adversarial step, or that are at n=1 and not yet actionable, write an explicit deferral note in the reflection doc:

- What pattern was considered
- What the strongest counter was (if adversarial step ran)
- What additional evidence would make it actionable next time

Silent deferral is worse than explicit deferral. The next reflection pass needs to know what's already been considered so it doesn't re-examine the same pattern from scratch.

## Conservative-by-default: read the room

A practical heuristic when in doubt: if you went into the reflection session expecting to find X changes and you came out proposing exactly X changes, something is off. The patterns in the experience log don't know how many changes you expected. A pass whose ships and deferrals each trace to how the adversarial argument held up is calibrated correctly. A pass that ships every candidate as a change is probably overfitting.

## Common rationalizations

| Rationalization | Reality |
|---|---|
| "I have an experience log; I should produce skill changes from it." | The log produces *evidence*. The synthesis produces *decisions*, most of which should be "not yet." Producing changes is not the goal; producing well-considered judgments is. |
| "n=2 is enough — both entries hit the same skill." | Same skill, same cluster: probably enough to consider. Same skill, different failure modes: two singletons, not a cluster. Run the slug-test (would the same proposed revision address both?) before accepting n=2. |
| "I'll skip the adversarial step — the pattern is obviously real." | If the pattern is obvious, the adversarial step is fast. If it's not fast, the pattern wasn't as obvious as you thought. Either way the step runs. |
| "Writing the narrative is just procedural overhead; I know what I'd change." | Then the narrative is one paragraph and takes two minutes. The reason for narrative-first isn't slowness — it's that the diff that comes out is different (sharper, more specific, less leakage of source vocabulary) when the narrative is the source instead of the destination. |
| "Most-sessions-produce-no-change is too conservative; I'd never ship anything." | If you'd never ship anything under this discipline, you're either (a) over-applying it to large-n clusters that genuinely justify changes, or (b) revealing that your experience log is mostly noise. Either way, the diagnosis is upstream of synthesis. |
| "The plugin is read-only so I'll just propose the edits as a list and stop." | A list of proposed edits without applying the procedure (narrative, adversarial, derivation) is just speculation. Run the procedure fully; the sidecar file is the artifact, but the procedure is the work. |
| "I already classified during capture so I don't need to reclassify now." | `learning-from-experience` explicitly does *not* classify at capture time. If your entries arrived with a `refines:` pointer, either someone pre-classified (against the discipline) or you're misreading. Classify now. |
| "This entry is so old it's not worth reflecting on." | Time-decayed entries are *better* evidence for "what generalizes" than fresh ones — distance from the moment is a feature for synthesis, not a bug. Read them. |
| "Every pattern I found justified a change." | Almost certainly overfitting. Re-run the adversarial step on each. |
| "I wrote the diff first; the narrative can justify it after." | Wrong order. Discard the diff. Re-derive it from a freshly-written narrative. |
| "The entries don't really cluster, but I want to ship something." | That's the rationalization. Ship deferrals. |
| "I'll file the proposed edits and leave the entries as they are." | Archive the entries (add frontmatter). Otherwise the next reflection pass re-considers them from scratch. |

