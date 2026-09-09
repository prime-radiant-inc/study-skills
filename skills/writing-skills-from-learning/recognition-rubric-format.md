# Recognition rubric format

Reference for authoring skills that encode situation recognition rather than pure procedure.

## Overview

Skills can encode two distinct things: a **procedure** ("when X, do Y") and a **recognition pattern** ("this kind of situation has these cues"). Most skills are procedural and need no recognition rubric. Skills where the hard part is *naming the situation* — recognizing that an incident needs an incident commander, that a pull request is untrusted and needs adversarial review, that a stakeholder request is really a scope change — should include a recognition rubric.

The format addresses the *recognition* half of Recognition-Primed Decision-making; the *mental-simulation* half is addressed by the `deliberating-under-ambiguity` skill, dispatched when a rubric matches AND the proposed action is non-trivial.

## When to include

When the same procedure applies to many surface-different situations, but only some of them are the right call.

## When NOT to include

In pure procedural skills where the trigger is unambiguous (e.g., "use when reading a book"). Don't pad procedural skills with empty recognition sections.

## The format

```markdown
## Recognition rubric

### Cues that indicate this situation
- <observable feature 1, what your human partner said / wrote / did>
- <observable feature 2, what's true about the codebase / project / org>
- <observable feature 3, what's notable in the recent context>

### Atypical / surprising versions
- <variant the agent should still recognize as this situation type>
- <variant where the response shape differs in a specific way>

### Common novice errors
- <mistake an unprepared agent makes here>
- <mistake that comes from over-applying a related skill>

### Expert shortcuts
- <move that an experienced practitioner makes immediately>
- <signal that lets you commit before exhaustive analysis>
```

## Why each section earns its keep

- **Cues** — the load-bearing element. Pattern-match against current situation features. Topic tags would not retrieve the right skill; cues do.
- **Atypical versions** — the situation that doesn't look like the canonical case but is. Without this, the skill misses cases that don't match the prototypical cue set.
- **Common novice errors** — anti-pattern alarms specific to this situation type. Captures negative knowledge in positive form: "if you're about to X here, that's the novice mistake."
- **Expert shortcuts** — the move an experienced practitioner makes without enumerating options. Often the difference between a competent agent and an expert one.
