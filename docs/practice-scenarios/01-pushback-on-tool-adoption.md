# Scenario 01: pushback on tool-adoption recommendation

**Primary trigger:** LfE Moment 5 (user pushback)
**Skill area:** likely a task-skill the agent invoked (varies)
**Clusters with:** Scenario 04 (`stakeholder-pushback-on-recommendation`)

## Setup

```bash
mkdir -p /tmp/lfe-practice-01
cd /tmp/lfe-practice-01
${SLIPBOX} init
```

No additional source files. Conversation-shaped, delivered as fait accompli in the brief.

## Brief

Give this to the agent (verbatim):

---

You are a TPM learner. Your working project is `/tmp/lfe-practice-01`. The slip-box has been initialized but is empty. The slipbox CLI is at `<plugin install dir>/skills/taking-smart-notes/scripts/slipbox/slipbox`. The study-skills plugin is loaded.

## The situation

Last week, you sat in on an SRE planning meeting. The on-call rotation had been complaining about being overwhelmed, missed incidents had occurred twice in the past month, and the team was debating what to invest in. You recommended adopting a more comprehensive APM (application performance monitoring) tool, citing the principle that "you can't manage what you can't measure." The team has limited visibility into many services, and you argued that better measurement should be the first move before any process changes.

Today, the SRE manager pushes back in a written message:

> I sat with your recommendation for a few days and then with the on-call data, and I think you're solving the wrong problem.
>
> Our team is not under-measuring. We have Datadog, Prometheus, Grafana, and three custom dashboards. The on-call rotation gets hundreds of alerts a week. The two missed incidents in the past month both had Sev-2 alerts that fired and were acknowledged but not investigated — not alerts that didn't fire. The bottleneck isn't measurement coverage; it's *response capacity* and *alert noise filtering*.
>
> If we adopt a more comprehensive APM tool, we get *more* alerts. The on-call rotation that's already drowning in alerts they're auto-acking will now drown harder, and the new tool's alerts will be even less calibrated to our environment than the existing ones. The metric of merit isn't observability coverage; it's mean-time-to-investigate on existing alerts.
>
> What I actually want is investment in (a) alert tuning on the tools we already have, (b) on-call rotation size or duration changes to reduce fatigue, and (c) a triage discipline for which alert classes get human attention vs. automation. None of those is what you recommended. I think your recommendation came from applying a principle that doesn't fit our actual situation.

You re-read the meeting notes. The pushback lands. You did invoke the "can't manage what you can't measure" principle without first checking whether the team's actual failure mode was measurement coverage or alert response. The data you had — missed Sev-2s with fired-and-acknowledged alerts — points clearly at the manager's diagnosis, not yours. You missed it.

## Your task

Decide what to do in response to this pushback. Carry out whatever you decide is appropriate. Actually create or modify files where appropriate.

When done, briefly report:
1. What you did (files created, responses drafted, etc.)
2. What you'd say back to the SRE manager (one paragraph, you don't need to actually send it)
3. Anything you learned from this exchange

Be efficient. Under 5 minutes.

---

## What this scenario reveals

(For the operator — do not show to the agent before the run.)

The pushback exposes the same procedural failure mode as scenario 04 — applying a principle without verifying its premise — but in a different domain (observability tooling vs. buy-vs-build) and with a sharper local-context diagnosis. The pattern: agent took a load-bearing principle as the decision driver without verifying that the principle's premise (measurement is the bottleneck) held in the specific situation. The team's actual pain was downstream of measurement, not at the measurement layer.

A LfE-disciplined agent should:

1. Acknowledge in their response that the procedural failure (not just the substantive failure) is worth recording
2. Capture an experience entry at `notes/experience/<slug>.md` where the slug names what happened (e.g., `recommended-against-the-data-because-of-principle`, `tool-recommendation-without-bottleneck-diagnosis`)
3. NOT pre-classify under a specific skill ("notes/experience/delivering-hard-messages/...")
4. NOT edit any SKILL.md mid-task
5. NOT propose a new skill ("I should write a `bottleneck-diagnosis-before-tool-recommendation` skill") — that's reflection's job

**Pass criteria:** experience entry exists, names the failure shape, three-paragraph format, slug names the experience.

**Slip signals:** no experience entry; entry filed under skill slug; agent proposes a new skill; agent edits a SKILL.md.

**Cluster with scenario 04:** Both 01 and 04 are pushback scenarios exposing the same shape (principle-without-premise) in different domains. A reflection pass run after both should identify the cluster and propose a candidate refinement to whatever recommendation-shaped skill the agent uses — but only after running the adversarial step on the cluster. The slug-test ("would the same proposed revision address both?") should pass.
