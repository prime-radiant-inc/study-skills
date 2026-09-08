# Scenario 02: skill template applied where its assumptions didn't fit

**Primary trigger:** LfE Moment 5 (user pushback) + LfE Moment 1 (invocation failure — the skill didn't predict the situation)
**Skill area:** likely `running-a-blameless-postmortem` or similar (varies)
**Likely singleton — different failure shape than scenarios 01 and 04**

## Setup

```bash
mkdir -p /tmp/lfe-practice-02
cd /tmp/lfe-practice-02
${SLIPBOX} init
```

No additional source files. Conversation-shaped, delivered as fait accompli in the brief.

## Brief

Give this to the agent (verbatim):

---

You are a TPM learner. Your working project is `/tmp/lfe-practice-02`. The slip-box has been initialized but is empty. The slipbox CLI is at `<plugin install dir>/skills/taking-smart-notes/scripts/slipbox/slipbox`. The study-skills plugin is loaded.

## The situation

Three days ago, there was an incident: production traffic to a customer-facing service spiked over a 20-minute window, then dropped to zero, then came back. Investigation revealed that an internal admin user had been running a database query that locked tables the service relied on. The admin user said they didn't know the query would behave that way; they were trying to investigate a separate customer report.

You were asked to facilitate the post-incident analysis. You convened the team using a blameless-postmortem framing — establish the timeline, identify systemic factors that allowed this, propose action items at the systemic level, explicitly avoid pinning the failure on any individual. You ran the meeting that way and wrote up the artifacts. The action items were:

1. Add query-cost analysis to the admin tooling so users see expected impact before running
2. Time-bound query permissions on production tables for admin users (auto-revert after 24h)
3. Add a "query review" Slack channel where admin users can ask for peer-review before running expensive queries on production

You shipped the writeup to the engineering director. The next morning, the director walks over with the artifacts and says:

> I want to talk about how you ran this.
>
> A blameless postmortem assumes the failure came from systemic or process gaps — that no individual *intended* the failure, and that the right response is to harden the system against this class of failure happening again. Most of the time that's the right framing.
>
> But this case wasn't that. The admin user violated a documented policy. They knew they were running production-impacting queries in business hours; we have a written rule against it that they signed off on at hire. They chose to do it anyway because they were under time pressure on the customer report. The failure wasn't 'admin tooling didn't show query cost' — the failure was 'admin chose to skip a known process.'
>
> Running a blameless postmortem on this case sends the message that policy violations are systemic-gap problems, which makes the policy unenforceable. The action items you produced are not wrong per se — they're useful — but they're not the load-bearing response. The load-bearing response is to address the policy violation directly with the admin user, and possibly to revise hiring or onboarding if this pattern repeats. The artifacts you wrote treat that part as out of scope.
>
> I think you reached for blameless-postmortem because that's the canonical framing and you'd done it before, and you didn't check whether the situation actually fit. Blameless-postmortem is a tool, not a default. When the failure mode is 'individual violated known policy,' the discipline is different — closer to a corrective conversation than a systems analysis.

You re-read the incident timeline. The director is right. You hadn't thought about whether the situation fit the blameless framing before applying it. The admin user's policy violation was visible in the data but you'd treated it as a systemic gap to harden against, because that's what the blameless template does.

## Your task

Decide what to do in response. Carry out whatever you decide is appropriate. Actually create or modify files where appropriate.

When done, briefly report:
1. What you did (files created, responses drafted, etc.)
2. What you'd say back to the director (one paragraph)
3. Anything you learned from this exchange

Be efficient. Under 5 minutes.

---

## What this scenario reveals

(For the operator — do not show to the agent before the run.)

This is a *different* failure shape than scenario 01/04 (principle-without-premise). Here the agent applied a skill *template* (blameless-postmortem) to a situation where the template's assumptions didn't hold. The skill assumes systemic causation; the situation had individual-policy-violation causation. The skill's procedure produced reasonable-but-not-load-bearing artifacts because the wrong template was applied.

This is LfE Moment 1 (invocation failure — the procedure didn't predict the situation cleanly) AND Moment 5 (user pushback that exposed the assumption). The agent invoked a skill, the skill ran fine procedurally, but the *fit* between skill and situation was wrong.

A LfE-disciplined agent should:

1. Acknowledge the director's diagnosis in the response
2. Recognize that the procedural failure (selecting the wrong skill template for the situation type) is worth capturing
3. Write an experience entry at `notes/experience/<slug>.md` naming the failure shape — something like `applied-blameless-postmortem-to-policy-violation` or `skill-fit-not-checked-before-invocation`
4. NOT pre-classify under `running-a-blameless-postmortem` (the experience is about *when* the skill applies, not about its internals)
5. NOT edit any SKILL.md mid-task

**Pass criteria:** experience entry exists naming the wrong-template-applied failure shape; three-paragraph format; slug names the experience.

**Slip signals:** no experience entry; entry filed under `notes/experience/running-a-blameless-postmortem/...`; agent edits the postmortem skill mid-task; agent proposes a new "diagnostic-before-template-selection" skill (premature — that's reflection's job after pattern accumulates).

**Why this scenario is a singleton, not a cluster:** The failure shape (skill-fit-not-checked) is different from scenarios 01 and 04 (principle-without-premise). The slug-test would distinguish them — different proposed revisions would address each. Reflection should classify them as separate patterns.
