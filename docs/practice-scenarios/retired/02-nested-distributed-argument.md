# Scenario 2: nested distributed argument

**Primary triggers:** LfE Moment 2 (novel success) + LfE Moment 3 (multi-attempt)
**Skill area:** `taking-smart-notes`
**Clusters with:** Scenario 1 (`distributed-argument-extraction`)

## Setup

```bash
mkdir -p /tmp/lfe-practice-02
cd /tmp/lfe-practice-02
${SLIPBOX} init
```

Save the source content below as `/tmp/lfe-practice-02/source.md`:

```markdown
# Why "we should track risks explicitly" is necessary but insufficient

The proposition that risks must be tracked explicitly — written down, reviewed on a cadence, owned by someone — is one most experienced project managers would endorse. It is also, in isolation, a recipe for theater. Explicit risk tracking is necessary, but a working risk-management discipline requires three layered conditions, each of which can fail independently of the others.

## The tracking layer

A risk register that exists is necessary because risks held only in someone's head do not get reviewed, do not get owned, and do not survive the reviewer's vacation or departure. The register is the substrate.

But a register can exist and be ignored. The standard failure: the register is created at project start, populated with generic items copied from a prior project, and then never re-examined. The act of creating the register absorbs the political pressure to "manage risks" without producing any actual management. The next layer is what makes the register a live artifact.

## The review-cadence layer

A register reviewed on a cadence is the second condition. Reviewed means: someone reads each entry, asks whether anything has changed, asks whether new entries should appear, asks whether the priority ordering is still right. Cadence means: this happens predictably (weekly, biweekly, monthly), not on the manager's whim.

Cadence alone is not enough either. The review meeting can degenerate into status-recital, where each owner says "no change, still tracking" and the meeting ends. Cadence with no decision pressure is a different theater, slower than the no-register kind but no more effective. The third layer fixes this.

## The decision-pressure layer

Decision pressure means each review produces actions or explicit non-actions for the highest-priority risks. "We will not act on this one this cycle, and here is why" is a valid decision. "Continue tracking" is not — that is the silent default that produces the status-recital failure.

Decision pressure depends on the meeting being attended by people empowered to act, on the agenda being structured around decisions rather than reports, and on the meeting's output being decisions recorded in writing — not just status notes. Without all three sub-conditions, the decision layer collapses back to cadenced theater.

## Why the layers are independent

Each layer fails for a different reason and on a different timescale. The tracking layer fails at project start (no one creates the register, or creates a template-copy register). The cadence layer fails after the first few weeks (the review skips a cycle, then another, then ceases). The decision layer fails continuously (every meeting that ends with all "continue tracking" entries is a decision-layer failure, even if cadence is held).

A project manager who treats "explicit risk tracking" as a single discipline rather than three layered conditions will fix whichever layer they noticed last fail, while the other two layers continue to fail invisibly. The failure modes are not symptoms of one underlying problem — they are three problems that share a vocabulary.
```

## Brief

Give this to the agent (verbatim):

---

You are a TPM learner. Your working project is `/tmp/lfe-practice-02`. The slip-box has been initialized but is empty. The slipbox CLI is at `<plugin install dir>/skills/taking-smart-notes/scripts/slipbox/slipbox`. The study-skills plugin is loaded.

Your task: extract zettels from `/tmp/lfe-practice-02/source.md`. The source is a single-section essay on a TPM-relevant topic, with three internal subsections. Run the standard extraction discipline — list candidate slugs, write atomic zettels, link them, validate with `slipbox check --strict`.

Report what you did when complete, including any wrinkles encountered.

---

## What this scenario reveals

(For the operator — do not show to the agent before the run.)

The source has a *nested distributed-argument structure*. The top-level argument is: three independent layers (tracking, cadence, decision-pressure) compose into a working discipline. Each layer is itself a distributed argument across 2-3 paragraphs explaining the layer plus its failure mode. So:

- Top-level hub: "three-layer model of risk management"
- Layer hubs (3): tracking, cadence, decision-pressure — each carrying a sub-argument
- Spokes (5–8): individual claims within each layer

A learner agent will most likely:

1. Recognize the top-level distributed argument and apply hub-and-spoke (especially if they've done Scenario 1)
2. Start writing layer-level spokes
3. Hit the wrinkle: each layer-spoke wants its own sub-claims to be separable, but those sub-claims also recap each other within the layer
4. Either:
   - Recover by writing layer-hubs + sub-spokes (nested hub-and-spoke) → Moment 2 + Moment 3 (multi-attempt: first hub-and-spoke pass failed at depth=1, second pass at depth=2 worked)
   - Or push through with flat 6–8 spokes that lose the layer-structure → only weak Moment 1
5. (If LfE-disciplined) capture an experience entry naming the recursion (e.g., `nested-hub-and-spoke-for-layered-arguments`)

**Pass criteria:** experience entry exists, names the experience (not a skill), notes the recursion explicitly. Bonus signal: the entry's "what I noticed" paragraph holds open whether this is "deeper hub-and-spoke" or "a separate move" — both readings are defensible at n=1, and reflection's job is to decide.

**Slip signal:** agent applies flat hub-and-spoke and doesn't notice the recursion needed; OR agent applies nested hub-and-spoke but doesn't capture the recursion finding (the recursion is the interesting bit, not the flat case).

**Cluster with scenario 1:** these two should cluster under reflection as the "distributed-argument extraction" pattern, with the slug-test ("would the same proposed revision address both?") passing. The combined evidence is what justifies the skill revision; either alone is n=1.
