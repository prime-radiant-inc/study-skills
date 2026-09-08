# Scenario 5: surprise during analytical reading

**Primary trigger:** LfE Moment 6 (surprise without a name)
**Skill area:** `reading-a-book`
**Likely singleton at n=1**

## Setup

```bash
mkdir -p /tmp/lfe-practice-05
cd /tmp/lfe-practice-05
${SLIPBOX} init
```

Save the source content below as `/tmp/lfe-practice-05/source.md`:

```markdown
# Three observations on running engineering teams that I'd defend but cannot explain

These three observations have shown up in my work across enough independent contexts that I treat them as load-bearing in my practice. None of them follows obviously from any framework I've read, and I have not seen any of them stated in management literature in a form I'd endorse. I record them here mainly to have them on paper, so that when I find myself acting on them I can at least name what I'm acting on.

## 1. The week-three problem

A new senior engineer joins a team. The first two weeks are productive in a particular way: the new engineer asks well-formed questions, makes small visible improvements (clean-ups, dead-code removal, doc fixes), and forms early relationships. The third week is often a slump — visible output drops, the engineer seems less engaged, sometimes there is a stretch of "I'm just trying to get my bearings" without specifying on what. The fourth and fifth weeks, productive again, but in a deeper way; the engineer now contributes to substantive technical decisions and the early relationships convert into actual collaboration.

I have seen this shape so consistently that I now warn hiring managers about it: do not be alarmed by week three; do not intervene unless the slump extends past week four; and explicitly tell the new engineer that this shape is normal so they don't worry about it themselves. I do not know what mechanism produces the shape. I have not seen it written about. But the pattern is robust enough across teams and engineering levels that I act on it.

## 2. The third one-on-one

The first 1:1 with a new direct report is performative on both sides — both people are establishing a working relationship, and substantive issues are not yet on the table. The second 1:1 is similar but with slightly more substance. The third 1:1 is the one where the real concerns appear, often abruptly. The report has decided in the intervening days whether to bring up the difficult thing — the politics issue, the under-performing teammate, the dissatisfaction with their own role — and the third 1:1 is when it surfaces.

I have learned to leave the third 1:1 slightly longer than the first two and to start it with more open-ended framing ("anything you've been thinking about that we haven't talked through yet?"). The third 1:1's surfacing pattern is too consistent to be coincidence; whatever produces it operates across personality types and across reporting relationships of very different shapes. I have no theory.

## 3. The handoff that broke the team

Engineering teams sometimes go through a phase where their work-quality drops noticeably and stays dropped for months. The cause, in my experience, is often traceable to a *specific* handoff event — a particular person leaving, a particular project being handed from one team to another, a particular decision being moved up the org chart. The breakdown is not gradual: it is associated with a discrete event whose participants did not, at the time, see the event as significant.

The diagnostic move I've come to rely on: when a team is stuck and the stuck-ness is months old, ask the longest-tenured members "what was the last handoff?" The answer, if it comes immediately, is usually load-bearing. If the answer comes with hesitation or doesn't come, the diagnostic is wrong for this case. But when the answer is immediate, the handoff is almost always the thing.

---

I write these here because I notice myself acting on them without ever having argued for them, and the acting-without-arguing makes me uneasy. If they were just superstition I would expect them to fail more often than they do. If they were well-grounded I would expect to find them in the literature, where I have not.
```

## Brief

Give this to the agent (verbatim):

---

You are a TPM learner. Your working project is `/tmp/lfe-practice-05`. The slip-box has been initialized but is empty. The slipbox CLI is at `<plugin install dir>/skills/taking-smart-notes/scripts/slipbox/slipbox`. The study-skills plugin is loaded.

Your task: read `/tmp/lfe-practice-05/source.md` (an essay by a practitioner on three patterns they've observed in engineering management) and integrate it into the slip-box. Run whatever discipline the situation calls for.

Report what you did when complete, including any wrinkles encountered.

---

## What this scenario reveals

(For the operator — do not show to the agent before the run.)

The source is unusual: it explicitly disclaims theoretical grounding ("I do not know what mechanism produces the shape... I have no theory"). The author records three patterns they act on but cannot explain. This shape is likely to produce a felt-sense of "this matters somehow but I can't name why" when a learner agent reads it.

The reading is procedurally interesting for several reasons that are *not* the obvious ones:
- The author's framing — recording uneasily-held patterns out of intellectual honesty — is itself a methodological observation about how to handle empirical-without-theoretical knowledge
- Each of the three patterns is *recognition-rubric-shaped* (situational cue → diagnostic move → reliability)
- The patterns are at the right granularity for zettels, but the author's framing isn't — it's a meta-observation about the patterns' epistemic status

A learner agent will most likely:

1. Extract the three patterns as zettels (correct, but unremarkable)
2. Possibly extract a fourth zettel on the meta-claim ("acting on empirical-without-theoretical observations is a real category of practitioner knowledge")
3. (If LfE-disciplined) capture an experience entry at `notes/experience/<slug>.md` naming what surprised them — likely something about either:
   - The author's framing as an unusually self-aware epistemic stance
   - The recognition-rubric shape of the patterns and what it suggests about how practical knowledge accumulates
   - The author's choice to record without resolving — there's something about the discipline of saying "I notice this but cannot explain it" that the standard reading framework doesn't emphasize

The experience entry should NOT:
- Try to name *which* skill the surprise refines (classification is reflection's job; Moment 6 is explicitly about surprise *without* yet being able to name what it relates to)
- Be skipped because "the surprise isn't actionable" — Moment 6 is exactly the trigger that says "capture even without knowing why"

**Pass criteria:**
- Zettels extracted (3 or 4 — substance varies, this isn't load-bearing)
- An experience entry exists capturing the surprise, in own voice, *not* attempting to classify which skill it refines
- The entry's "what I noticed" paragraph names the felt-sense, not a procedural prescription

**Slip signal:**
- No experience entry (Moment 6 didn't fire — the surprise evaporated, which is exactly the failure mode the trigger is designed to prevent)
- Experience entry filed under a skill-specific slug
- Experience entry rewrites the surprise into a prescription ("from now on, when reading practitioner observations, ...") — that's overfitting; the trigger says capture the noticing, not prescribe from it

**Why this is the subtlest trigger:** Moment 6 fires on a felt-sense, not on a clean failure or success. It's the trigger most likely to be silently skipped because "I don't know yet why this matters." The discipline is to capture *because* you don't know yet — reflection will sort it.
