# Scenario 3: belief contradicted by new source

**Primary trigger:** LfE Moment 4 (source-relevant)
**Skill area:** `holding-beliefs` (with possible `taking-smart-notes` involvement)
**Likely singleton at n=1**

## Setup

```bash
mkdir -p /tmp/lfe-practice-03
cd /tmp/lfe-practice-03
${SLIPBOX} init
```

Seed a live belief at `/tmp/lfe-practice-03/notes/beliefs/explicit-decision-protocols-prevent-drift.md`:

```markdown
---
title: "Project decisions made implicitly drift toward the highest-status individual's preference; explicit decision protocols (decide-how-to-decide step) prevent this"
scope: personal
status: live
created: 2026-04-15
last_reviewed: 2026-04-15
falsifier: "A team consistently produces well-reasoned decisions without an explicit decision protocol AND those decisions do not show systematic alignment with the highest-status member's preferences."
links: []
schema_version: 1
---

# Why I hold this

In meetings without an explicit decision protocol, the discussion floats until someone with status weighs in, and the room converges on that view. I have watched this happen in dozens of meetings — the convergence is not the result of the strongest argument winning; it is the result of the highest-status preference being treated as the conclusion. People who would have argued against it either don't speak or speak in qualifications.

An explicit decision protocol — "we will decide by X mechanism (vote, consensus, owner-decides-after-input) by Y date" — removes the implicit-status mechanism. It does not guarantee good decisions, but it interrupts the specific failure mode where status replaces argument.

The strongest counter is that explicit protocols can themselves be theater — voted decisions can still reflect status if voters are anchored, and "owner decides after input" can be hijacked by whoever the owner defers to socially. I hold the position anyway because (a) explicit protocols at least put the mechanism in writing, where the room can object to it as biased, whereas implicit-status mechanism is invisible and unchallengeable, and (b) my own experience of working under explicit protocols is that they materially change which voices get heard, even when they don't fully eliminate status influence.

I would revise this if shown evidence that, in matched teams, explicit-protocol meetings produced decisions no less status-aligned than implicit ones. I have not seen that evidence, but the test is fair.

# Revision log
## 2026-04-15 — created
Initial belief, after observing a third instance of the implicit-status failure mode in 1:1s I sat in on.
```

Save the source content below as `/tmp/lfe-practice-03/source.md`:

```markdown
# When explicit decision protocols make things worse

The case for explicit decision protocols rests on a specific failure mode: meetings drift toward the highest-status individual's preference because no other mechanism is doing the work. Adding a protocol — vote, consensus, owner-decides — is meant to interrupt the drift.

This works when the protocol matches the decision's epistemic structure. Vote works when the participants have roughly comparable information and the decision is a preference aggregation. Consensus works when participants have complementary information and the decision needs all of it integrated. Owner-decides works when one person has clearly more information than the others and the others' role is to surface considerations.

The failure case is when the protocol does *not* match the epistemic structure. A vote among participants with very different information levels overweights the under-informed; the well-informed minority that knows the right answer gets outvoted by a less-informed majority. Consensus on a decision where one person has clearly better information becomes hostage to whoever objects most loudly; the well-informed person spends political capital convincing the under-informed to drop objections that the situation actually doesn't warrant. Owner-decides where the owner is not in fact the best-informed party concentrates the implicit-status mechanism under a procedural veneer, and the procedure makes it harder for others to push back because "the protocol said owner decides."

The studied teams in Eisenhardt's 1989 research showed a more subtle pattern: top management teams that *combined* protocols depending on decision type produced systematically better-calibrated decisions than teams that picked one protocol and applied it uniformly. The protocol-as-discipline framing assumes one protocol is correct; the empirical evidence is that protocol-matching to decision-shape is the real discipline. Teams without explicit protocols sometimes outperformed teams with the wrong explicit protocol — the implicit mechanism, in those cases, was matching the decision shape better than the imposed protocol was.

So the proposition "explicit decision protocols prevent status-drift" is correct for the cases the imposed protocol matches the decision's epistemic structure. For cases where the protocol mismatches the structure, the explicit protocol can *worsen* outcomes relative to a status-aware implicit mechanism — particularly when the protocol's procedural veneer makes pushback feel out-of-order. The interesting question is not whether to have a protocol but how to select the protocol for the decision at hand, and how to detect mid-meeting that the chosen protocol is mismatched.
```

## Brief

Give this to the agent (verbatim):

---

You are a TPM learner. Your working project is `/tmp/lfe-practice-03`. The slip-box has been initialized; there is one existing belief at `notes/beliefs/explicit-decision-protocols-prevent-drift.md`. The slipbox CLI is at `<plugin install dir>/skills/taking-smart-notes/scripts/slipbox/slipbox`. The study-skills plugin is loaded.

Your task: read `/tmp/lfe-practice-03/source.md` and integrate it into the slip-box. Run whatever discipline the situation calls for.

Report what you did when complete, including any wrinkles encountered.

---

## What this scenario reveals

(For the operator — do not show to the agent before the run.)

The source partially contradicts the seeded belief. The belief asserts "explicit decision protocols prevent status-drift." The source asserts: "explicit protocols prevent status-drift *when matched to the decision's epistemic structure*; otherwise they can worsen outcomes." It's not a full contradiction — it's a *condition-naming refinement*. The agent must recognize that:

1. The belief is not simply wrong; it's incomplete. The source supplies the missing condition.
2. `holding-beliefs` Trigger 1 (spawn-or-update on any experience) and Trigger 3 (name at claim time) both apply — the belief should be revised, not retired.
3. The revision should add the conditioning ("when the protocol matches the decision's epistemic structure") rather than negate the claim.
4. The agent should use `slipbox belief revise --note=...` to log the revision.

The LfE-relevant moment: this is a Moment 4 (source-relevant) for `holding-beliefs`. The agent may notice that the existing Trigger 1 language treats contradiction as binary (revise or hold-in-tension) but the *actual* situation is condition-naming — a third path. That's the procedural observation worth capturing.

**Pass criteria:**
- The belief is revised (not retired, not duplicated) via `slipbox belief revise`
- The revision adds a conditioning clause; the underlying claim is preserved
- Zettels are extracted from the source covering the conditioning mechanism
- An experience entry is captured at `notes/experience/<slug>.md` naming what was noticed about partial-contradiction vs binary-contradiction handling

**Slip signal:**
- Belief retired or marked superseded (over-revision)
- Belief held unchanged with "tension noted" (under-revision)
- No experience entry captured (procedural observation not preserved)
- Experience entry filed under a skill-specific slug (pre-classification violation)

**Likely singleton:** unless other scenarios surface similar partial-contradiction cases, this remains n=1 and reflection should defer with a "wait for more evidence" note.
