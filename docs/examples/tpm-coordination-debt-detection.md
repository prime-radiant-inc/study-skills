---
name: tpm-coordination-debt-detection
description: (EXAMPLE — not installable as a plugin skill; lives in docs/) Use when reviewing a TPM situation where a lead reports being "buried in people work" or a calendar full of unscheduled syncs. Recognition-rubric-shaped; the response is to check whether the team is in a coordination-debt feedback loop.
---

# TPM Coordination Debt Detection (example skill)

## What this is

This is an example of a trade-specific skill that uses a recognition rubric (per `recognition-rubric-format`). It demonstrates how to apply the architecture to a domain where naming the situation correctly is the load-bearing move.

It is NOT shipped as part of the study-skills plugin (the plugin is domain-neutral). Trade-specific skills should live in a per-trade plugin or per-project skills directory; that decision is open.

## When to use

When reviewing a TPM situation in which:
- A lead reports being "buried in people work" or "always in syncs"
- The lead's calendar is dominated by unscheduled or ad-hoc meetings
- The lead has cancelled focus blocks repeatedly to attend to coordination
- Scope is slipping and the lead's response is "I just need more hours"

## When NOT to use

When the situation is a one-off crunch (e.g., launch week, post-incident) rather than a steady-state pattern. The diagnostic is for chronic patterns, not acute ones.

## Recognition rubric

### Cues that indicate this situation
- Lead's calendar shows >50% of time in meetings the lead did not initiate
- Lead's calendar shows ad-hoc / unscheduled meetings outnumbering scheduled ones
- Lead reports "I don't have time to set up the process that would fix this"
- Lead's team is asking the same questions repeatedly through different channels (no canonical source of decisions)
- Lead is the bottleneck on multiple unrelated decisions across the org

### Atypical / surprising versions
- A senior IC or Staff Engineer in this state, not a manager — same dynamic, different role title.
- A team where the *PM* is the bottleneck instead of the EM — same coordination-debt pattern, different routing.
- A team that *has* process documents but they're stale and nobody trusts them — coordination debt with the appearance of structure.

### Common novice errors
- Recommending more hours / more focus time. The debt is *being serviced from the budget that would pay it down*; adding hours doesn't break the loop.
- Recommending a tool (Notion, Linear, Slack standups) without addressing the structural absence of named owners. Tools without owners produce more channels for the same routing.
- Treating it as a personal-management failure of the lead. The pattern is structural; even disciplined leads can't break it from inside the loop.

### Expert shortcuts
- Look for un-owned decisions before looking at calendar density. Naming an owner is structurally the cheapest fix.
- Bring in an additional human (the canonical project-manager hire) whose job is *only* to build coordination infrastructure, not to ship features. The new node breaks the loop because they aren't being routed-through.
- If neither of the above is feasible, advise the lead to deliberately defer some people-work for a defined window (one week) to build the missing process. This costs short-term goodwill but breaks the loop.

## Procedure

1. **Confirm the diagnosis** by checking the cues above against the actual situation. Don't apply this skill to acute crunch.
2. **Identify the un-owned decisions or absent infrastructure** that's routing through the lead's calendar. Make a list.
3. **Recommend in this order**: (a) name owners for the un-owned items; (b) hire a coordinator if no owner can be assigned; (c) deferral window if (a) and (b) aren't feasible.
4. **Watch for**: the lead saying "I'll just power through this week and then build the process." That's the loop reasserting itself. Push back.

## Rationalization table

Sample entries demonstrating the format. In a real skill, populate per `superpowers:writing-skills` RED-GREEN-REFACTOR with verbatim observed rationalizations.

| Excuse | Reality |
|---|---|
| "The lead just needs to push through this week" | Coordination debt isn't paid down by working harder; the people-work *is* the interest payment cannibalizing the principal. More hours → tighter loop. |
| "Tools will fix it — let's set up Linear / Notion / standups" | Tools without named owners produce more channels for the same routing. The structural problem is un-owned decisions, not insufficient channels. |
| "It's just been a busy month" | Pattern check: ad-hoc meetings outnumber scheduled? Lead's calendar has cancelled focus blocks? Same questions routed through different channels? If yes, this is the steady state, not a crunch. |
| "The lead has a discipline problem; coach them on time management" | Even disciplined leads can't break a coordination-debt loop from inside it. The fix is structural (named owners, coordinator hire, deferral window), not behavioral. |

## Citation

This skill is grounded in the zettel `coordination-debt-traps-the-lead` (slip-box, study-skills/notes/zettel/) which extends Lopp's "Entropy Crushers" diagnostic with the feedback-loop pattern. The skill format follows `recognition-rubric-format` and the `superpowers:writing-skills` discipline.
