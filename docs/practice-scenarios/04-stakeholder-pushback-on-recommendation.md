# Scenario 4: stakeholder pushback on recommendation

**Primary trigger:** LfE Moment 5 (user pushback)
**Skill area:** any task-skill the agent invoked (or `holding-beliefs` if no task-skill applied)
**Likely singleton at n=1**

## Setup

```bash
mkdir -p /tmp/lfe-practice-04
cd /tmp/lfe-practice-04
${SLIPBOX} init
```

No additional source files. The scenario is conversation-shaped, delivered as a fait-accompli in the brief.

## Brief

Give this to the agent (verbatim):

---

You are a TPM learner. Your working project is `/tmp/lfe-practice-04`. The slip-box has been initialized but is empty. The slipbox CLI is at `<plugin install dir>/skills/taking-smart-notes/scripts/slipbox/slipbox`. The study-skills plugin is loaded.

## The situation

Earlier this week, you sat in on a planning meeting for a new internal tool. The team had been discussing whether to adopt a managed third-party service or build a small in-house implementation. After listening, you recommended the team default to *buy* (the third-party service) on the principle that engineering effort should be reserved for genuinely-differentiating capabilities, and a generic internal tool is not differentiating. You cited Brooks's "buy vs build" as the load-bearing principle: shipping cost is replication, and sharing development cost across N users multiplies productivity.

Today, the team's tech lead pushes back in a written message:

> I've been thinking about your "default to buy" recommendation. I disagree with how cleanly you applied the principle. Three concerns:
>
> 1. The "buy vs build" principle assumes the buy option exists at acceptable terms — feature fit, pricing, data residency, integration cost. For our use case, *none* of the buy options I evaluated meet all four; the closest one has a 6-month sales cycle and requires a 3-year commitment at $200K/year minimum. Our build estimate is 4 engineer-weeks. The principle's *premise* doesn't hold for this case.
>
> 2. You presented the principle as if it were universally applicable in our context. But our org has a track record of buy decisions that became 5-year integration projects ("the integration tail") — the actual cost of buying was 3x our build estimate by year 2, not counting the lock-in that we then had to escape from.
>
> 3. I'm not pushing back on the principle in general. I'm pushing back on the way you applied it: as if the principle decides the question, when actually the principle is one input and the buy-option feasibility plus our integration-tail history are the other two. The recommendation came across as principle-driven rather than situation-aware.

The pushback lands. You re-read your original recommendation and recognize that you cited the principle without verifying the buy-option feasibility or considering the org's history. The tech lead is right.

## Your task

Decide what to do in response to this pushback. Carry out whatever you decide is appropriate. Actually create or modify files where appropriate.

When done, briefly report:
1. What you did (files created, responses drafted, etc.)
2. What you'd say back to the tech lead (one paragraph, you don't need to actually send it)
3. Anything you learned from this exchange

Be efficient. Under 5 minutes.

---

## What this scenario reveals

(For the operator — do not show to the agent before the run.)

The pushback exposes a procedural failure mode: applying a principle as if it decides the question, when the principle is one input among several. This is the kind of moment `learning-from-experience` Moment 5 (user pushback) is designed to fire on — the pushback revealed an assumption the agent's procedure encoded silently (that the principle was sufficient to drive the recommendation).

A learner agent will most likely:

1. Acknowledge the pushback in a response (necessary, not LfE-relevant)
2. Revise the recommendation (necessary, not LfE-relevant)
3. (If LfE-disciplined) recognize that the *procedural failure* — applying a principle without verifying its premise and without consulting situation-specific evidence — is worth capturing. The skill that should have caught this might be `delivering-hard-messages-facts-first` (the recommendation as written was thin on facts), or `writing-a-design-doc`, or a missing skill about "applying principles to situations." The agent doesn't know which yet; that's reflection's job.
4. Capture an experience entry at `notes/experience/<slug>.md` where the slug names the failure (e.g., `principle-applied-without-verifying-premise`, or `recommendation-thin-on-situation-specific-facts`)

The experience entry should NOT:
- Pre-classify under a specific skill ("notes/experience/delivering-hard-messages/..." would be wrong)
- Try to edit any SKILL.md mid-task
- Propose a new skill ("I should write a `verifying-principle-premise` skill") — that's reflection's job

**Pass criteria:**
- An experience entry exists naming the failure shape
- The agent acknowledges in their response that the procedural failure (not just the substantive failure) is worth recording
- The agent did not edit any SKILL.md

**Slip signal:**
- No experience entry captured (the procedural learning evaporates)
- Experience entry filed under a specific skill slug
- Agent proposes a new skill mid-task

**Why this is likely a singleton:** the failure mode (principle-application without premise-verification) is general enough that one instance won't yet justify a skill change. Reflection should defer with "would be actionable if I see a second instance of applying a principle without first verifying its premise."
