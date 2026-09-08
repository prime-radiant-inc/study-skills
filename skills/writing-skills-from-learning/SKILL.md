---
name: writing-skills-from-learning
description: Use when you've just read a source (book, course, paper) that teaches a named procedure, technique, or move-sequence, and the procedural detail is fresh in working memory — or when a reflecting-on-experience pass has just concluded the experience log points at a missing skill.
---

# Writing Skills From Learning

## Overview

A procedure has surfaced that may earn its own `SKILL.md` file in your project's skills layer — either a source you just read teaches it (a named technique, a move-sequence, a how-to), or a `reflecting-on-experience` pass concluded the experience log points at a missing skill. Most procedures should NOT earn a skill file. This skill encodes the parts that learning-driven skill authors get wrong without instructions. The body speaks in source-reading terms; the "Practice-derived skills" section below maps the differences for the reflection-driven path.

**REQUIRED BACKGROUND:** `superpowers:writing-skills` — handles the general TDD-for-skills discipline (RED-GREEN-REFACTOR), frontmatter / CSO, naming, token efficiency, flowchart usage, anti-patterns, rationalization tables. Read it first. This skill does not restate any of it.

**Core principle:** A skill that encodes what a capable model would produce one-shot is decoration. Skills earn space only by encoding what an agent without the skill would get wrong.

## The earns-a-skill test (apply BEFORE drafting)

A procedure named in a source earns a `SKILL.md` only if it passes ALL FOUR:

| Test | Question | If fails, instead |
|------|----------|-------------------|
| **One-shottable** | If I dispatched a worker without this skill on a representative task, would they produce something close? | Capture as zettel supporting material. |
| **Generalizes** | Does the procedure apply across contexts, or only inside this source's framing? | Capture as zettel body content. |
| **Substantive** | More than a 2-step recognition rubric? | Capture as a `## Misreading to watch for` subsection in a zettel. |
| **Commits** | Does a *specific invoking* belief exist — one whose stake and falsifier directly call for this procedure as a requirement? Adjacent or topical beliefs do not count. | If the invoking belief doesn't exist, the skill is decoration. Either author the invoking belief first (preferred — fires `holding-beliefs` Trigger 1 / Trigger 1b), or defer the skill until the belief earns its way in. See "Test 4 in detail" below. |

Most well-known management / PM / communication procedures fail test 1: they are heavily represented in training data and a capable baseline model cold-produces a close approximation. **STATE / DACI / RACI / "ask open-ended questions" / "lead with facts" / "set SMART goals"** — all one-shottable in their general form.

The procedures that earn skills are the ones with **non-obvious specific failure modes, recognition rubrics, or move-sequences the source identifies but a baseline model would not generate cold**. The skill's value is the failure-mode catalog, not the procedure name. (Section format for recognition rubrics: `recognition-rubric-format.md` in this skill's directory.)

**The count is whatever the source produces.** Apply the four tests to every procedure the source names; the survivors become skills. Don't aim for a count, a ratio, or a "most candidates fail at least one test" expectation — those substitute targets for the standard, and the standard *is* the four tests. A procedure-dense source legitimately produces several skills; a structural source produces none. Both are correct outcomes. The only signal worth tracking is whether your rejection reasoning, written out, holds up: if you find yourself rejecting a candidate because "this round shouldn't produce many skills" rather than because it failed a specific named test, you're using the wrong standard.

## The architectural hierarchy

A source's content sorts into three layers, each a different artifact:

- **Structural insight** → zettel. Cross-domain claim. Sentence-shaped and falsifiable. ("Sellouts generate self-justifying stories, not the reverse.")
- **Procedure-justifying claim** → zettel. Why a specific procedure works. ("Facts-before-stories works because they pass the two-observer test, removing the ambiguity defensiveness feeds on.")
- **The procedure itself** → skill IF it passes the four tests. Step-shaped and instructable.

Do not collapse the layers. A procedure pasted into a zettel body flattens into prose and loses procedural fidelity; a structural insight rephrased as a skill loses its cross-domain reach.

**Slug shape disambiguates:** structural insights are sentence-shaped (`safety-not-content-determines-conversational-defensiveness`); procedures are imperative-shaped (`stating-your-path`). If your draft slug is a step-list or a verb-phrase, it is a skill candidate. If it's a claim sentence, it is a zettel candidate.

## The diagnostic-then-dispatch pattern

When a source teaches **two procedures that pair via a diagnostic** (e.g., "if condition A is broken, run procedure X; if condition B is broken, run procedure Y"), do NOT split them into two separate skills. The diagnostic IS the load-bearing move; splitting it produces two skills that each assume the diagnostic happened upstream and consequently miss the structural insight.

Worked example: the Crucial Conversations case in `worked-examples.md` (this skill's directory) — two safety-repair procedures that must ship as one diagnostic-first skill.

**Recognition rubric for this pattern:**
- The source presents two procedures *together* and the choice between them depends on a diagnostic.
- Each procedure presupposes the diagnostic answer.
- An agent applying either procedure without the diagnostic would worsen the situation (e.g., contrast-statement when the actual problem is misaligned purpose, not perceived disrespect).

When you see this shape: merge into one diagnostic-first skill that dispatches.

## The source-grounding pattern (NON-NEGOTIABLE)

A skill **invokes** the slip-box. It does NOT **duplicate** it.

❌ **Wrong** — skill body restates the why:

```markdown
## Why this works
Facts pass the two-observer test — two reasonable observers watching
the same event would describe it the same way. This neutralizes the
ambiguity defensiveness feeds on.
```

✅ **Right** — skill body invokes:

```markdown
## Why this works
The two-observer property of facts is the load-bearing reason; see
`facts-before-stories-as-the-discipline-of-delivering-hard-messages`
and `safety-not-content-determines-conversational-defensiveness` for
the underlying claims.
```

**Why this matters:** without invocation, skills decay because zettel updates don't propagate. With invocation, the coupling is validated: `slipbox check --strict` fails when a skill's `## Deeper context` references don't resolve, and `slipbox rename` rewrites skill references when a slug changes. The slip-box becomes the source of truth for the *why*; the skill stays focused on the *how*. One thing the tooling cannot see: a revision to a cited zettel's *claim* (slug unchanged) — when you revise a zettel, re-read the skills that cite it.

**Required structure:** every skill ends with a deeper-context section pointing at the zettels and beliefs the skill is grounded in. See "Three-tier progressive disclosure" below for the format and load semantics — these references are tier 3.

If the skill cannot name a belief that the agent holds in this domain, the skill fails test 4 of the earns-a-skill test. Remove it. (The belief still exists in the slip-box; the agent simply has no operational commitment that *invokes* this procedure, so the skill has no caller.)

## Timing — write in-session

Write the skill in the SAME session as reading the source.

Procedural detail decays rapidly in working memory. Deferred skill-writing produces vague retrospective prose that loses the source's specific failure modes, the precise rationalization patterns, the recognition rubrics that distinguish a working application from a cargo-cult one. Same-session is non-negotiable.

**Apply the TDD baseline test in-session too** (per `superpowers:writing-skills`). Dispatch a worker WITHOUT the skill on a representative task; compare to what your draft prescribes. Anything close is one-shottable; trim. The trimming pass is also in-session — the source's specific failure-modes are still in your context.

## Practice-derived skills (via reflecting-on-experience)

When the origin is the experience log rather than a source, the four tests apply unchanged — Test 1's baseline dispatch is identical. What maps differently:

- **Grounding:** cite the experience entries and the reflection pass's narrative where a source-derived skill cites per-source notes and zettels. If the narrative surfaced a claim worth keeping, extract it as a zettel first and ground the skill in that — the source-grounding pattern holds, with the slip-box's practice-derived layer as the source.
- **Timing:** "same session" means the same session as the reflection pass. The synthesis narrative decays exactly like a source's procedural detail.
- **Failure modes:** the entries themselves are the failure-mode catalog — the recorded surprises, recoveries, and mismatches are what a baseline agent wouldn't generate cold. A practice-derived skill that doesn't encode any of them is one-shottable by construction.

## Belief↔skill pairing

Skills exist to operationalize beliefs. A position-shaped commitment is a belief; a procedure-shaped commitment is a skill. Beliefs that imply procedures should declare the skill they invoke; skills should declare the belief that invokes them.

When you write a skill, also update the linked belief's body to add:

```markdown
## Invokes skill
`<skill-slug>` — the procedural form of this commitment
```

If a belief has no associated skill, that's normal. Many positions are commitments without operational procedures (the position is to *recognize the situation*, not to *run a procedure*). If a skill has no associated belief, that's a failure mode — the skill is decoration.

### Test 4 in detail: the invoking belief is not the adjacent belief

Test 4 asks for *the invoking belief*, not "a belief in the same neighborhood." Adjacent beliefs are the failure mode this test exists to catch. The trap is structural: the skill author finds an existing belief in roughly the right domain, declares test 4 satisfied, and ships a skill whose actual invoking belief was never authored.

A real instance of the trap — an estimate-anchoring skill shipped against a merely-adjacent risk-tracking belief — is in `worked-examples.md` (this skill's directory).

**Detection** — the one-sentence test. State the linked belief's commitment in one sentence: "I commit to X." State the skill's procedure in one sentence: "Run procedure Y." Ask: does X *require* Y, or merely *permit* it? If "require" is a stretch, X is adjacent, not invoking.

| Invoking | Adjacent |
|----------|----------|
| Belief: "I require reference-class anchoring on any non-trivial estimate." | Belief: "Project risk must be named in an explicit list." |
| Skill: `building-a-reference-class-estimate`. | Skill: `building-a-reference-class-estimate`. |
| The belief *requires* the procedure. | The belief is in the same domain; the procedure is *one of many* that could satisfy it. |

**Recovery moves**, in order of preference:

1. **Best — author the invoking belief first.** This fires `holding-beliefs` Trigger 1 (the source's own argument may now carry it) or Trigger 1b (the cumulative corpus may already ground it). The invoking belief becomes the skill's caller; the skill earns its place. This is also the move that fixes the structural problem: an un-promoted territory the corpus has been accumulating gets surfaced and committed.
2. **Acceptable when belief authoring would be premature** — defer the skill. The procedure remains in the source's per-source note and zettel cluster; revisit when a belief actually earns its way in. No skill is better than a decoration skill.
3. **Wrong** — ship the skill paired with the adjacent belief and tell yourself test 4 passed "in spirit." This is the rationalization this section forbids. If you find yourself drafting a "but the belief is *related*" justification, you are about to ship decoration.

**The check is a hand-off to `holding-beliefs`.** When the invoking-belief existence check fires and the belief doesn't exist, the skill author's job is not to author the skill anyway with a near-miss pairing. It is to flag the missing belief and run `holding-beliefs` Trigger 1b — the territory may be belief-ripe in the cumulative corpus. The skill resumes only after the invoking belief is authored or after the author has decided to defer.

### Test 4 on already-shipped skills

The test fires equally on skills you are *currently authoring* and on skills *already shipped in the corpus*. Earlier rounds may have shipped skills paired with adjacent beliefs because the discipline wasn't yet specified — those skills have an open audit debt.

When you discover an adjacent pairing on a shipped skill (typically while running `holding-beliefs` Trigger 1b, or while reviewing the skill set for any reason), do not silently leave the existing pairing in place. The recovery moves are:

1. **Best — author the invoking belief, then re-pair the skill.** Same as draft-time recovery move 1. Update the skill's `## Deeper context` to point at the new invoking belief; update the new belief's `## Invokes skill` to name the skill. The original adjacent belief, if it's still live, may keep a *cross-reference* to the skill if the relationship is real, but it is no longer the pairing.
2. **Acceptable — flag the skill as audit-debt and continue.** If the cumulative-corpus territory audit doesn't fire (the territory hasn't accumulated mass yet, or the agent decides authoring the belief in this session is premature), record the audit debt explicitly: leave a `## Audit debt` line in the skill's body naming the missing invoking belief and the date the gap was identified. This is *not* a license to leave the gap indefinitely; it is the explicit acknowledgement that the skill is currently shipping in a state Test 4 forbids, with a marker so the next pass can find it.
3. **Wrong — discover the adjacency and move on without action.** Knowing the skill ships with an adjacent pairing and not at minimum recording the audit debt is the strongest form of the rationalization Test 4 fights. The discipline does not allow "I noticed but won't act."

The asymmetry between draft-time and already-shipped is small: same test, same recovery hierarchy, with the addition of the audit-debt marker for cases where the recovery itself must defer. The test does not weaken when the skill has already shipped — it strengthens, because the corpus has had time for the territory to accumulate mass that draft-time may not have had.

## Three-tier progressive disclosure

Skills exist in a three-tier disclosure hierarchy. Author tier 1 first, push tier 2 when tier 1 outgrows itself, and link tier 3 explicitly so the agent knows where to reach when the procedure isn't enough.

**Tier 1 — `SKILL.md`** (loaded automatically by the Skill tool when triggered):
- Frontmatter and the "Use when" description (the discovery surface)
- Overview / core principle
- The procedure itself (the move-sequence)
- The failure modes an agent hits first when running this procedure cold (whatever number of those exist for the procedure)
- References to tier 2 and tier 3 by file path and slug
- Tight: token-efficient because it loads every time the skill triggers

**Tier 2 — supporting files in the skill directory** (loaded on demand by the agent when the procedure needs deeper detail):
- Failure modes that exist but aren't among the ones an agent hits first — present at runtime only when the agent reaches for them
- Worked-example walkthroughs (full transcripts, before/after pairs)
- Reference tables, vocabulary lists, regime-gate decision trees with many branches
- Source-specific case detail (the *Allspaw 2012* incident-investigation example, the *BAE Denver* case study) that informs the procedure but doesn't need to load at trigger time
- Naming convention (per `superpowers:writing-skills` File Organization): `failure-modes.md`, `worked-example.md`, `regime-decision-tree.md`. Reference from SKILL.md with relative paths, never with `@` syntax (which force-loads and burns context).

**Tier 3 — linked zettels and beliefs in the slip-box** (loaded on demand when the agent needs to defend, explain, or extend the procedure beyond what tiers 1–2 cover):
- The belief that operationally invokes this skill — the agent's first-person commitment that makes the procedure required
- The zettels carrying the underlying claims that justify *why* the procedure works
- Links by slug, never by file path

Tier 3 is **not auto-loaded**. The agent reaches for it when:
- A user/skeptic challenges the procedure and the agent needs to defend it from first principles
- The procedure produces an outcome the SKILL.md text doesn't cover and the agent needs the underlying claim to reason from
- The agent is updating, refactoring, or stress-testing the skill (write-time)
- An edge case suggests the procedure may have changed since the skill was authored — pulling tier 3 surfaces whether the underlying claims still hold

Empirically, agents using a well-written skill rarely reach for tier 3 at runtime — the procedure is self-sufficient for most invocations. That's the design working. Tier 3 is the architectural backstop, not the everyday entry point.

**Required structure:** every skill ends with a deeper-context section using this format:

```markdown
## Deeper context (load on demand)

The agent's first-person commitment that invokes this skill:
- **Belief:** `<slug>` — the operational commitment

Underlying claims behind the procedure (load when defending the procedure, hitting an edge case the SKILL doesn't cover, or updating this skill):
- `<zettel-slug>` — the specific case this zettel addresses; load when <triggering condition>
- `<zettel-slug>` — same shape; load when <triggering condition>
```

Each zettel reference includes a **load trigger** — the specific case where the agent should reach for this zettel. "Load when defending facts-first to a recipient who claims facts are subjective" is a useful trigger; "for the why" is not. Load triggers are what make tier 3 actually usable rather than ornamental.

**Trigger to reach for tier 2 (vs. inline in tier 1):** push content to tier 2 when (a) the catalog has internal structure the agent will navigate selectively at runtime — regime branches, paired diagnostics, source-specific case detail — so the agent reaches for *parts* rather than the whole, AND (b) the content isn't among the failure modes the agent hits first when running the procedure cold. The trigger is the navigation pattern, not the SKILL.md length. Tier-1 content that's load-bearing for first-cold-run discipline stays in tier 1 even if it makes the file long.

## Cross-source vs. single-source dispatch

The diagnostic-then-dispatch pattern (above) assumes both branches of the diagnostic come from the same source. When one branch is **out of source** — i.e. the diagnostic identifies a regime that requires a procedure not taught by this source — the right move is **gate inline as a precondition**, not construct the out-of-scope branch.

Worked example: the Allspaw 2012 case in `worked-examples.md` — a two-regime source whose out-of-scope branch becomes a Step 0 gate, not a constructed procedure.

**Recognition rubric:**
- *Single-source dispatch* (merge into one diagnostic-first skill): both procedures come from the same source.
- *Cross-source dispatch* (gate inline; defer): one branch is out of the current source's scope.

In the cross-source case, the gate explicitly tells the agent **where to go instead** — escalate, defer, look for a different procedure — rather than silently failing.

## Common mistakes

| Excuse | Reality |
|--------|---------|
| "STATE/AMPP/DACI is a named procedure, so it earns a skill" | Test 1 (one-shottable). Most named procedures from popular books are heavily in training data; a baseline model cold-produces a close approximation. Earns a skill only if there's a non-obvious specific failure-mode catalog the source identifies. The skill's value is the catalog, not the name. |
| "The skill should be self-contained so future agents don't have to load other content" | Wrong abstraction. Skills load alongside slip-box content; duplicating slip-box content in the skill body inflates context and creates drift between layers. Reference, don't restate. |
| "I'll write the skill later when I have time to test properly" | Procedural detail decays fast. Defer = vague retrospective skill. Same-session draft is the discipline; same-session test is the calibration. |
| "Every procedure named in this source deserves a skill" | Most don't. The four-test criterion is the discipline. If you find yourself keeping a candidate that didn't pass each of the four tests on its merits, you're failing it. |
| "I'll find the belief that invokes this skill later" | If no belief currently exists that operationally invokes the skill, the skill is decoration. Defer until a belief actually exists. The belief-first ordering is structural — operations come from positions held, not from procedures available. |
| "The slip-box doesn't have a zettel for this why; I'll write the why into the skill body" | The right move is to write the zettel first, then write the skill that invokes it. Skill bodies that contain unique why-content indicate the slip-box is missing the corresponding zettel — fix that, don't paper over it. |

## Before shipping — verify

This checklist covers skills authored against your slip-box through this workflow; skills installed from elsewhere pair with their own grounding, not yours. Every item is a pass/fail check on the draft in front of you:

- [ ] Every keep/reject decision names the specific test it passed or failed — never how many skills this pass "should" produce
- [ ] Procedures that pair via a diagnostic shipped as ONE diagnostic-first skill that dispatches, not two skills presupposing the diagnostic
- [ ] Every why-claim in the skill body lives in the slip-box; the body invokes it by slug (missing zettel → write the zettel first)
- [ ] `## Deeper context` section present and names the invoking belief — one that *requires* the procedure by the one-sentence test, not one merely in the neighborhood
- [ ] Drafted in the same session as the source's read (or the reflection pass)
- [ ] If the name is a well-known industry framework (STATE, RACI, DACI, OKRs, KPIs), the body carries a specific failure-mode catalog a baseline model lacks — otherwise it failed Test 1
- [ ] Length within `superpowers:writing-skills` guidance — trim one-shottable content first; move selectively-navigated catalogs to supporting files second; accept length only when every remaining paragraph is load-bearing how-content

## Writing the dispatch brief that invokes this skill

A brief that asks an agent to apply this skill to a source must state the **inclusion standard** and let any count fall out of meeting that standard. Briefs that carry count targets, effort caps, recognition thresholds, or base-rate language ("0–3 expected," "8–15 zettels typical," "rejection ratio 50–80%," "most candidates fail") substitute targets for the standard — the agent hits the target and stops, regardless of whether the source had more material that met the inclusion bar.

A real instance from this plugin's development: a brief for a graduate systems-engineering course said "8–15 zettels for the whole course." The agent extracted 10 — hitting the range — and stopped, leaving four case studies and the procedure modules unexamined. The number had replaced the standard.

**Brief discipline:**

- State the inclusion standard from the invoked skill (atomic, claim-shaped, falsifiable, non-one-shottable for zettels; the four earns-a-skill tests for skills; falsifier + stake for beliefs). Do not restate the bar in count form.
- If naming areas of the source that may be under-represented in the existing slip-box, frame as a *prompt to look*, not a target. "Worth checking whether section X carries claim-shaped material" is fine; "expect 3 zettels from section X" is not.
- For survival-named candidates ("strong candidate to consider: X"), name the candidate and the test that would decide it. Don't predict the survival count.
- The diagnostic test before sending a brief: scan for numbers and base-rate language; for each one, ask "would the worker's behavior change if I removed this?" If yes, replace with the actual standard. If no, the number is decoration and shouldn't be there.

This rule applies recursively. A skill cleaned of anchors still fails if the brief that invokes it carries them. Brief discipline = skill discipline.
