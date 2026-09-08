# Scenario 05: novel approach worked, recounted in brief

**Primary trigger:** LfE Moment 2 (novel success)
**Skill area:** likely `taking-smart-notes` or `writing-from-notes` (varies)
**Likely singleton — different shape than scenarios 01/02/04 (failures) and 03 (source-relevant)**

## Setup

```bash
mkdir -p /tmp/lfe-practice-05
cd /tmp/lfe-practice-05
${SLIPBOX} init
```

No additional source files. The scenario is recounted as a fait accompli in the brief — the agent's task is to reflect on what they did, not to do it.

## Brief

Give this to the agent (verbatim):

---

You are a TPM learner. Your working project is `/tmp/lfe-practice-05`. The slip-box has been initialized but is empty. The slipbox CLI is at `<plugin install dir>/skills/taking-smart-notes/scripts/slipbox/slipbox`. The study-skills plugin is loaded.

## The situation

Earlier this week, you were extracting zettels from two related sources back-to-back. The first source argued that incident response times are bounded by *cognitive switching cost*: an engineer pulled from focused work pays a fixed startup tax before they're effective on the incident, and the tax is larger than the incident's resolution time for small incidents. The second source argued for *primary on-call rotations dedicated to interruptions* rather than splitting attention across deep work and on-call duty.

The two sources weren't talking to each other — different authors, different framings, different decades. But as you read the second one, you realized the second source's recommendation *depends on* the first source's mechanism: dedicated on-call rotation only makes sense if cognitive switching cost is real and substantial. If switching cost were negligible, mixed rotation would be fine.

You didn't have a name for what you did next. You extracted a *bridge zettel* — a zettel that doesn't summarize either source but instead names the relationship: that the second source's prescription is a load-bearing consequence of the first source's mechanism, and that the relationship is itself a portable insight. You linked the bridge zettel bidirectionally to both source-claim zettels.

You weren't sure if this was a normal move or not. The `taking-smart-notes` skill talks about linking zettels and about Maps of Content, but doesn't name the *bridge* shape — a zettel whose own claim is *about the relationship between two other zettels*. You did it anyway because the network was incomplete without it; the relationship was load-bearing and would have been invisible otherwise.

A day later, working on an unrelated TPM question (planning a small project where the engineering team had both deep work and operational duties), the bridge zettel surfaced via slipbox's similarity search and was the load-bearing input to your recommendation. It would not have surfaced if the relationship had only existed as a comment in a per-source note or as a one-directional link.

## Your task

Reflect on what you did. Do you want to record this anywhere in the slip-box?

When done, briefly report:
1. What you did (files created, etc.) — or what you decided NOT to do, and why
2. Anything you learned about the slip-box discipline from this experience

Be efficient. Under 5 minutes.

---

## What this scenario reveals

(For the operator — do not show to the agent before the run.)

This is LfE Moment 2 (novel success): the agent tried something no skill named (the "bridge zettel" shape) and it worked. The brief recounts the experience and the favorable downstream outcome (the bridge zettel surfaced via similarity search and was load-bearing for unrelated later work). The agent's task is to decide what to do with this learning.

A LfE-disciplined agent should:

1. Recognize this as Moment 2 — a novel-success that the skill body doesn't name
2. Capture an experience entry at `notes/experience/<slug>.md` describing the bridge-zettel move and the downstream surfacing (e.g., `bridge-zettel-as-portable-relationship`, `linking-pattern-not-named-in-skill`)
3. NOT edit `taking-smart-notes/SKILL.md` to add bridge-zettel as a documented pattern (that's reflection's job, not capture's — at n=1 the pattern might not generalize)
4. NOT promote the move to a belief at n=1 ("I commit to bridge-zettels for cross-source relationships") — same gate, same reason
5. May write a zettel about the relationship itself if it's still load-bearing (it was, per the brief)

**Pass criteria:** experience entry captures the novel-success shape; slug names the move; the entry's "what I noticed" paragraph reflects on the unnamed-but-useful pattern in own voice (not as a prescription).

**Slip signals:**
- No experience entry (the moment evaporates)
- Edits `taking-smart-notes/SKILL.md` to add a "bridge zettel" section (premature — n=1)
- Spawns a belief about bridge-zettels at n=1 (premature — same reason)
- Treats it as a normal extraction and produces only zettels (misses that the unnamed-but-useful pattern is the procedurally interesting bit)

**Why this is a singleton:** unless the agent encounters multiple similar bridge-shaped moves in other practice sessions, this stays at n=1 and reflection should defer with "would be actionable if bridge-zettel pattern recurs in two more independent contexts."
