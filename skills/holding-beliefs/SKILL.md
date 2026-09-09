---
name: holding-beliefs
description: Use when catching yourself making a load-bearing claim you haven't named as a belief; unable to articulate why you're invoking a skill; noticing a defendable pattern across your own work; feeling unnamed resistance to a claim while reading; finishing a chapter, coherent argument, or zettel-extraction sweep; receiving a research subagent's report; hitting a debugging surprise or substantive pushback from your human partner; before committing to a substantive recommendation, plan, or extraction; or starting non-trivial work in a domain with prior beliefs.
---

# Holding Beliefs

## Why this skill exists

The slip-box discipline (`reading-a-book`, `taking-smart-notes`, `writing-from-notes`) captures *what sources claim*. It does not capture *what you currently hold true*. When a new source contradicts an earlier one, the existing skills extract both as zettels and link them; nothing forces you to notice that *your own* prior position was challenged, name the contradiction, and either revise your position or hold it in tension on the record.

The failure mode is harmonization-by-silent-absorption: a new claim slides in alongside an old one, both get filed, and the integrated model in your head — the model you'll actually reason from when your human partner asks the next case-shaped question — drifts without an audit trail. The agent looks well-read and reasons incoherently.

A belief is the artifact that fights this. It is a first-person, falsifiable, revisable position with a revision log. It is *yours*, not a source's. You hold it under pressure to abandon it; you revise it on the record when evidence forces revision; you retire it when it has been replaced. Beliefs run alongside zettels, not instead of them.

The discipline has two halves, and this skill owns both. **Formation** is the articulation move that surfaces a candidate position in the moments where positions actually form — mid-draft claims, pre-invocation pauses, patterns across your own work, felt resistance during reading, post-extraction retrospectives. These moments are internal; external events never catch them, which is how a learner absorbs positions without ever naming them. **Maintenance** is the falsifier/stake/revision-log discipline that keeps the artifact honest across time once a candidate exists. Formation feeds maintenance; both live below.

## When to use

Formation cues (internal — you notice them in your own reasoning):

- You make a load-bearing claim mid-work — a sentence you'd defend under pushback
- You're about to invoke a skill and can't articulate why this situation requires it
- You notice a recurring pattern across your own recent work — a phrase, a reasoning shape, a move you keep making
- You feel unnamed resistance to a claim while reading, and the same shape of resistance returns
- You just finished a zettel-extraction sweep and need to ask what you now hold

Maintenance cues (external — events land on you):

- You finished a chapter, paper, or coherent argument that touches a load-bearing claim
- A research subagent's report just landed and contains discoverable claims
- Your human partner pushed back on something you said, and the pushback has substance
- A debugging surprise contradicted what you expected reality to do
- A tool failure revealed a wrong assumption about the environment
- You're about to commit to a substantive recommendation, plan, or extraction in a domain
- You're starting non-trivial work in a domain where you have prior beliefs

## When NOT to use

- Trivial fact lookup; one-off answers with no domain stake
- Project-specific scaffolding (those go to `notes/projects/`, not the belief set)
- Pure source-claim capture — that's `taking-smart-notes`, the zettel does the work
- Your human partner's preferences and project facts — those go to memory
- Single conversational opinions you wouldn't defend a session from now

## What a belief is — distinct from a zettel and a per-source note

These three artifact types share the slip-box but answer different questions. Mixing them destroys all three.

| Artifact | Where it lives | Voice | Question it answers |
|----------|----------------|-------|---------------------|
| Per-source note | `notes/sources/<slug>.md` | Faithful to the source | What does this source say? |
| Zettel | `notes/zettel/<slug>.md` | Restated in your framing | What is *this idea*, as I would use it? |
| Belief | `notes/beliefs/<slug>.md` (or trade-scoped) | First-person held position | What do *I* hold, and what would change my mind? |

The per-source note is bibliographic — it sits with the book. The zettel is a portable claim — extracted from a source, attributed to it, possibly contradicted by other zettels in your slip-box. The belief is *yours* — your held position, possibly informed by many zettels, possibly contradicted by some of them, with the contradiction named in the revision log.

A zettel and a belief can share a slug — they live in different directories, and the overlap is meaningful. `manpower-not-fungible-in-design-work` can exist as a zettel (Brooks's claim, source-cited) and as a belief (your first-person held position, informed by Brooks but reasoned in your voice). Link them with `slipbox belief link` — bidirectional, same symmetry invariant zettels already have with each other, enforced by `slipbox check --strict`.

### Worked example — same idea, zettel-shaped vs belief-shaped

A common drift on first use is to write a zettel-shaped argument inside a belief's `# Why I hold this` section. Here is the same underlying idea expressed in each form. Note where the *voice* moves and what each form *commits* to.

**Zettel** (`notes/zettel/essence-vs-accident-as-productivity-diagnostic.md`):

> Brooks's productivity-equation argument: if a class of difficulty consumes share `f` of total effort, an attack on that difficulty returns at most `f`. Applied to the three big past wins (high-level languages, time-sharing, integrated environments), each asymptoted as the share they targeted approached zero. The diagnostic move is to ask, of any productivity claim: which class of difficulty does this attack, and what is its current share?
>
> *Source: Brooks 1986, "No Silver Bullet," §"Past Breakthroughs Solved Accidental Difficulties."*

**Belief** (`notes/beliefs/productivity-claims-must-name-which-difficulty-they-attack.md`):

> I commit to running the essence/accident diagnostic before granting any productivity-tool benefit estimate, and to treating accident-attacking gains as bounded by the share of effort the targeted accident currently consumes. I hold this not because Brooks wrote it but because the productivity-equation argument is structural rather than empirical (so it does not turn on whether 1986 numbers transfer to 2026), because forty years of post-1986 history has produced no silver bullet, and because the asymmetry of error costs falls on my side: the cost of skipping the diagnostic is adopting accident-attackers at the wrong intensity, the cost of running it is one paragraph of analysis. The strongest counter-pressure I absorb is compounding — many tools Brooks dismissed as silver bullets nonetheless delivered 2x–4x gains that compound over decades. I take the bound as the prior, not the dismissal.
>
> *Falsifier: encounter an accident-attacking tool with no asymptotic ceiling, or a productivity gain that the diagnostic frame fails to predict.*

The zettel says what Brooks claims and where in the source it lives. The belief says what *you* commit to do, what makes you commit, what you would still do under pushback, and what would un-commit you. A reader who confused these would think the belief was an opinionated zettel. It is not — it is an operative stance that constrains future decisions.

The drift to watch for: when writing `# Why I hold this`, you may catch yourself paraphrasing the zettel's argument as scaffolding for the held-position move. Cut the paraphrase. The zettel is one link away; the belief should lead with stake-and-reasoning ("I commit because…", "what makes me hold this in spite of X is…"), not recap.

## The artifact

```yaml
---
title: <first-person idea-as-statement, one sentence>
scope: personal | <trade-slug>
status: live | superseded | retired
created: YYYY-MM-DD
last_reviewed: YYYY-MM-DD
falsifier: <what would change my mind>
superseded_by: <belief-slug>      # optional, set when status: superseded
links: [<zettel-slug>, <source-slug>, <belief-slug>, ...]
schema_version: 1
---

# Why I hold this
<reasoning, in your own voice>

# Revision log
## YYYY-MM-DD — created
Spawned after <trigger>: <one-line reason>.
## YYYY-MM-DD — reviewed (no change)
Re-read while <task>; still holds because <reason>.
## YYYY-MM-DD — refined
<Trigger> introduced X. Previously held Y; now hold Y'. Delta: <...>.
```

### Slug discipline — idea-as-statement

The slug is a kebab-case statement of the *claim*, not a topic. This matches zettel slug discipline.

- `software-estimation-is-forecasting-under-deep-uncertainty.md` — yes, this is a belief
- `software-estimation.md` — no, this is a topic
- `recommendations-should-name-their-falsifier.md` — yes
- `falsifiers.md` — no

**Why:** the slug is the atomicity test. If you cannot phrase the belief as a sentence-shaped slug, you do not have a belief — you have a category. Categories are not falsifiable; positions are.

### Falsifier — required, non-empty, non-trivial

Every belief carries a `falsifier:` field. It states what would change your mind: a concrete kind of evidence, observation, or argument that, if encountered, would force a revision. The falsifier is not optional; the CLI rejects creation without one.

- "I would be wrong if a study tracked X teams over Y months and found no relationship between A and B" — concrete, recognisable
- "I would be wrong if Brooks's claim turns out to be empirically wrong" — trivial, says nothing about what evidence would count
- "I would be wrong if I changed my mind" — vacuous

**Why:** a position without a falsifier is not a belief — it is a slogan. The discipline of writing the falsifier first is what proves the position is one you could be shown wrong about. Self-explanation on the *position* itself is what makes the belief operative.

### Stake — am I willing to be wrong about this?

Falsifier and stake are different tests, both required. The falsifier tests whether the position is *falsifiable*; the stake test asks whether you are *invested* in being right about it. A belief can have a valid falsifier and still fail the stake test — that's a candidate that should be a zettel, not a belief.

The check: *would I argue for this position against pushback, or do I find myself recasting it on contact with disagreement?* If you'd recast immediately, you don't have a stake — you have a description of what someone (often the source) believes. Descriptions belong in zettels.

- "Conformity costs cannot be redesigned out" — falsifier ("find a redesign that does dissolve a conformity seam") is technically valid, but the position has no stake; it's a paraphrase of Brooks. → Should be a zettel link, not a belief.
- "Productivity claims must name which difficulty they attack" — falsifier ("encounter an accident-attacking tool with no asymptotic ceiling") plus stake (the agent commits to running this diagnostic before granting any productivity-tool benefit estimate). → Belief.

**Why:** the falsifier alone is necessary but not sufficient. Without stake, the belief set bloats with re-stated source claims wearing a falsifier costume. Stake is what distinguishes "I am informed about X" from "I have skin in the game on X." Only the second drives double-loop learning when the case pushes back.

### The disposition — strong opinions loosely held

Falsifier and stake aren't a tradeoff to balance — they're two halves of a single disposition. The belief is held *strongly* (stake: you'll defend it under pushback, you bear consequences for being wrong, you don't recast it the moment someone disagrees) and *loosely* (falsifier: you actively watch for evidence that fires the falsifier, you revise eagerly when it does, you don't dismiss inconvenient evidence to preserve the position). Both at once. The phrase is *strong opinions loosely held* — not "weak opinions held diplomatically," not "strong opinions defended at all costs."

The asymmetric failure modes:

- **All stake, no falsifier-watching** → dogma. The belief becomes identity. Evidence that should fire the falsifier gets explained away ("the case is special," "the source is wrong," "that's not what I meant by X"). The revision log stays empty even as the world contradicts the position.
- **All falsifier-watching, no stake** → harmonization-by-silent-absorption. The original failure this skill exists to fight. The belief recasts on every smooth new source; the revision log fills with "refined" entries that obscure that the position was actually abandoned without acknowledgment. The agent looks open-minded and reasons incoherently.

Both failures look respectable from the outside. The discipline is to be visibly hard to push around (stake) *and* visibly responsive to evidence (active falsifier-watching), with the revision log as the audit trail proving both.

Operationally, when the case pushes back:

1. Defend the position substantively first — name the reasoning, name the evidence, name the falsifier you're not yet seeing fire. This is the stake test happening in real time.
2. *Then* check whether the case is actually the falsifier firing. If yes, revise on the record with a delta entry. If no, the position holds and the case becomes part of the supporting evidence.
3. The order matters. Defending first prevents recasting-on-contact. Checking after prevents dogma. Skipping either step is the failure mode.

The revision-log convention captures this: every revision entry names the trigger (what fired the falsifier) and states the delta (what was held before, what is held now). The log itself is the proof that the disposition is operating — empty logs over time signal dogma, frequent unjustified "refinements" signal harmonization.

### Scope — personal vs. trade-scoped

A *trade* is a distinct domain of practice the project accumulates knowledge for — technical program management, accounting, scriptwriting. Projects with no `notes/trades/` directory keep every belief in `notes/beliefs/` and skip this choice entirely.

- **Trade-scoped beliefs** (`notes/trades/<trade>/beliefs/<slug>.md`) are about how the trade works. "Software estimation is a forecasting problem under deep uncertainty." "Code review is primarily a teaching surface."
- **Personal beliefs** (`notes/beliefs/<slug>.md`) are cross-trade. "I value clarity over cleverness in technical writing." "My recommendations should always include a falsifier."

The test: *would this apply across multiple trades?* If the answer is clearly yes, the belief is personal. If the answer is no or unclear — and the project has trades — default to trade-scoped. Promotion to personal happens only when a belief proves to apply across trades, which you discover by holding it trade-scoped, watching it cite cleanly into multiple trades, and only then moving it.

**Why:** belief inflation is real. Personal beliefs that should have been trade-scoped pollute the cross-trade set; trade-scoped beliefs that should have been personal hide from the contexts where they apply. Scope is auto-detected from the file's path on parse — choose the path correctly and the schema follows.

### Body — two required sections

- **`# Why I hold this`** — the reasoning, in your own voice, not source paraphrase. This is the self-explanation pass. Without it, the belief is unjustified-by-you and is just a zettel by another name.
- **`# Revision log`** — a chronological record of every touch. Each entry is dated, names the trigger (a source slug, a subagent report, a pushback moment from your human partner, a debug discovery), and states what happened: created, reviewed (no change), refined, retired, superseded. Refinements include the delta — what was held before, what is held now.

## The commit — canonical, three steps

Every path that ends in a new belief — formation moment or maintenance trigger — commits it the same way. All three steps; skipping step 2 is the canonical "absorbed-without-naming" failure, an artifact that looks committed and isn't.

1. `slipbox belief new <slug> --scope=<personal|trade-slug> --title="<one-sentence position in your own voice>" --falsifier="<observable condition that would make you abandon this>"` (scope test above; in a project with trades, when in doubt, trade-scoped)
2. **Open the created file and fill in the `# Why I hold this` body via `Edit`.** The placeholder text `(Reasoning, in your own voice.)` is *not* a body — it is a marker that the body has not yet been written. Replace it with substantive first-person reasoning: why you hold this, what it reasons from, what made you hold it now (not before). At least two paragraphs. Anti-paraphrase test: if you remove source attribution, does the reasoning still feel like *yours*? If no, you've absorbed, not formed; rewrite.
3. Run `slipbox check --strict`; the new belief must pass schema validation as a committed artifact.

## The n=1 gate — experience-first

If the only evidence for a fresh candidate is a single experience, source, or invocation, the right artifact is usually an experience entry (`learning-from-experience`, at `notes/experience/<slug>.md`, slug naming the experience), not a new belief. Beliefs are positions you'd defend across cases; one experience produces a *candidate*. When a second matching instance accumulates, `reflecting-on-experience` surfaces the candidate for promotion.

Two exceptions where n=1 commitment is appropriate:

- **(a)** the experience refines or contradicts an *existing* live belief — `slipbox belief revise`, not `new`; or
- **(b)** the position is a methodological commitment that generalizes across the whole class of moments ("I commit to verifying premises before applying any principle"), articulable in your own voice independent of this case, *and* it passes the four-question check (Trigger 1b below) overwhelmingly on mass, stake, falsifier, and non-adjacency.

Unsure? Default to experience-first: the entry is cheap and reversible, while a belief skeleton with a placeholder body looks committed and isn't. The same gate from the body side: if you're not ready to write `# Why I hold this` in substantive first-person voice (commit step 2), you're not ready for the belief.

## Formation — the five learning moments

Positions form in moments external events don't catch. Each moment below names a recognizable internal cue; all five converge on the articulation move that follows them.

### Moment 1: substantive claim mid-work

You're writing, speaking, or coding and you make a load-bearing claim — a sentence you'd defend under pushback. The cue is the *defendability*, not the publication. Mid-draft is when the moment fires; waiting for edit-pass is the rationalization.

Examples:
- Writing a memo: "Operational instrumentation is a delivery, not a follow-up."
- Code review comment: "We shouldn't ship X without Y because Z."
- 1:1 advice: "Don't run a performance review on someone whose role just changed."

If you'd defend it under pushback, stop and run the articulation move before continuing.

### Moment 2: can't articulate why you're invoking a skill

You're about to invoke a skill whose procedure will shape substantive work — a discipline, a methodology, a documented judgment pattern. (Reference lookups and formatting skills don't warrant the pause; the moment belongs to skills that change how you'll reason.) Pause and try to write *in one sentence*: "What's the position I hold that makes this skill required for this situation?"

If the articulation works and the sentence is in your own voice, proceed.

If the articulation half-works — you can write a sentence but most of it is paraphrasing the skill's pairing belief or the skill body itself — you've discovered a finding: you're invoking on the strength of a label, not an internalized position. Run the articulation move on the gap; the actual invoking belief may be missing or different from the documented pairing. (This is the failure mode `writing-skills-from-learning` Test 4 catches at skill-authoring time, surfacing here at skill-invocation time.)

If the articulation fails — you can't write a defensible sentence — that's a stronger finding: either the position isn't load-bearing for this situation, or you've been operating on absorbed-without-naming material. Either way, surfacing the gap is the value; don't fake the articulation to justify invoking the skill.

### Moment 3: pattern across your own work

You re-read recent work — your last several belief bodies, your last several substantive emails, your prior reasoning across multiple sessions — and notice a recurring pattern. A phrase you keep reaching for. A reasoning shape you keep deploying. A move you keep making.

The pattern itself may be a position you hold at the meta level. Methodological positions (e.g., "asymmetric error costs justify bounded standing disciplines") are the canonical case: they're not derivable from any single domain claim, but they explain a class of held positions you'd defend.

When you notice the pattern, run the articulation move on it. Most patterns will fail the four-question check (they're stylistic preferences, common training-data phrases, accidents of recent attention). The ones that pass are belief candidates.

### Moment 4: felt resistance during reading

You're reading a source and feel internal disagreement with a claim — but you can't immediately name what the disagreement is about. The first resistance is easy to dismiss. The cue to *not* dismiss it is: the same shape of resistance returns when you encounter the same claim form again.

When the resistance surfaces twice, stop and articulate. What is the resistance about? What position would you have to hold for the resistance to make sense? If the answer is a defensible position, you've discovered a belief candidate by elimination — the source's claim is the negation of something you hold.

The two-strikes threshold is the discipline. One strike is mood, distraction, or unfamiliarity with the source's vocabulary. Three strikes is too late — the resistance has shaped your reading without being named. The second strike is the moment.

### Moment 5: post-zettel-sweep retrospective

You just finished extracting a sweep of zettels from a single source. The zettels capture what the *source* claims. This moment surfaces what *you* now hold.

This moment is structural, not internal: it fires once per source-extraction sweep, after `slipbox check --strict` passes and before declaring the integration complete. For each zettel body you wrote, ask in your own voice: "Do I hold this?" The n=1 gate applies — a single source is n=1 evidence unless one of its exceptions holds.

Three outcomes are possible and all are valid:

- **Position crystallized.** The source's claim is now one you'd defend under pushback when you wouldn't have before reading — and the evidence isn't covered by the n=1 gate. Run the articulation move; if it passes the four-question check, run the commit (all three steps).
- **Meta-claim emerged.** No individual zettel states it directly, but a recurring shape across multiple zettels names a position you'd defend — Moment 3's pattern recognition happening on a single sweep. Same commit.
- **No shift.** The source covered ground you already held, or made claims you don't endorse. Record the finding in the per-source note (one sentence: "Source X didn't shift my position on Y because Z") and move on. This is not a skipped step; it's a closed-loop one.

What's specific to Moment 5: the trigger fires structurally (after a zettel sweep, before declaring the integration done) and the closure is artifact-shaped (a committed belief file or a recorded "no shift" note). Naming the position in prose alone — in a final report, in your scratch — does not close the loop; it makes the next session forget what you held.

## The articulation move

The shared move across all five moments:

1. **Stop**. Don't defer to a later checkpoint that may not arrive.
2. **Write the position in your own voice**. One sentence. "I commit to X." or "I require Y before Z." or "I hold that A determines B in regime C."
3. **Read what you wrote**. Did writing it out reveal something? Surprise? Confirmation? A refinement? An asymmetry between what you wrote and what you'd actually defend?
4. **Adversarial step: write the strongest version of the opposite position.** One sentence, taken seriously, in the strongest form a thoughtful adversary would offer. Then ask: is the opposite also defensible — would a thoughtful person who held the opposite be making a coherent argument? If yes, what you wrote in step 2 wasn't a held position; it was a description of one possibility among several you find equally plausible. Drop it (or refine it to name the conditions under which you'd hold it over the opposite). If the opposite is not defensible — if the strongest version is still incoherent or reasons from premises you reject — then what you wrote is yours. This step catches paraphrase-fakery: paraphrased positions pass step 3 because the source's reasoning sounds confident, but they fail step 4 because no one has actually weighed the alternative. Held positions survive the comparison.
5. **Check against the existing belief set**. `slipbox belief list`. Does the articulation match an existing belief? If yes, did the articulation reveal a refinement? Run Trigger 4 (stale review on touch).
6. **If it doesn't match**: run the four-question check (Trigger 1b). If it passes, run the commit.
7. **If the articulation failed (step 2 produced paraphrase, or step 4 found the opposite equally defensible)**: don't fake it. The failure is the finding. Either the moment didn't actually involve a load-bearing position, or you've been operating on absorbed-without-naming material. Both are useful to know; neither is grounds for spawning.

The articulation in your own voice is what distinguishes formation from absorption. A paraphrase of someone else's framing is not formation — it's absorption costumed as articulation. The test: if you remove the source attribution, would the sentence still feel like *yours*? If no, you haven't formed; you've absorbed.

## Maintenance — the five triggers

### Trigger 1: Spawn-or-update on any experience

When you encounter new information that produces a "huh, that changes things" or "I was right" reaction, ask: *which belief did this just touch? If none, should this experience spawn one?*

This trigger fires on the maintenance cues listed in "When to use" above.

Outcome: zero or more belief operations. Zero is legitimate — not every experience touches the belief set. But the *check* must happen, and you must be able to say which beliefs you considered.

```bash
# List candidates that might be touched.
slipbox belief list --scope=<trade>

# Spawn a new belief (then complete the commit — body fill, check).
slipbox belief new <slug> \
  --scope=<personal|trade> \
  --title="<first-person claim>" \
  --falsifier="<what would change my mind>" \
  --note="Spawned after <trigger>: <one-line reason>"

# Refine an existing belief whose position has shifted.
slipbox belief revise <slug> --note="<delta narrative naming the trigger>"

# Bump last_reviewed only if the belief was re-read against this evidence and still holds.
slipbox belief review <slug> --note="<what I re-read against, why it still holds>"
```

A belief earns its place when (a) it would shape future decisions in the trade, (b) it has a non-trivial falsifier, and (c) you could imagine being shown wrong about it. If any of those fails, do not create the belief — let the zettels do the work. Fresh candidates also pass through the n=1 gate above.

**Partial contradictions often carry a second, procedure-shaped observation.** When a source contradicts a belief by naming a condition the belief didn't state ("holds when X; here's a case of ¬X"), the belief move is revision-with-conditioning, not retire-or-tension. If the *way* the contradiction resolved is itself methodologically interesting, that observation is procedure-shaped, not belief-shaped — capture it as an experience entry alongside the belief revision, and let `reflecting-on-experience` decide whether the belief-revision discipline itself needs refining.

### Trigger 1b: Territory audit on the cumulative corpus (structural backstop)

This trigger is the *structural backstop* for what the formation moments missed — not the primary mechanism. Formation catches positions in the moment. What slips through is the territory that accumulates across many experiences without any single one carrying enough mass to fire it: each individual pass legitimately concludes "no new belief from this experience," and the territory never gets promoted. The audit asks the corpus-driven question instead: has the cumulative slip-box accumulated a territory whose mass now exceeds the inclusion threshold for a belief that doesn't yet exist? If formation is firing well, this audit yields little; a large yield is itself a smell that the formation moments weren't engaging while the corpus grew.

This trigger fires:

- Before reporting that a session or extraction produced "no new beliefs" — the corpus-driven check happens before that conclusion is final.
- After work that materially grew the slip-box with no belief candidates surfacing through articulation — and whenever that asymmetry has persisted across many sessions (the standing-debt case: hubs above threshold-of-mass with no committed belief).
- When a skill author's invoking-belief existence check (`writing-skills-from-learning` Test 4) finds the invoking belief doesn't exist — that is a territory this audit should examine.

The check, in three steps:

```bash
# Step 1: surface the highest-degree clusters to see where mass is accumulating.
slipbox stats --hubs=10

# Step 2: for each cluster relevant to the work just completed, list the zettels.
slipbox show <hub-slug>          # see the cluster's body and links

# Step 3: for each candidate territory, ask the four belief-promotion questions below.
slipbox belief list
slipbox belief show <suspected-adjacent-belief>     # the trap is adjacent beliefs
```

For each candidate territory, apply these four questions in order. **All four must pass** before promoting:

1. **Mass.** Do multiple zettels — typically across multiple sources — coalesce around the same operative position? A single zettel does not earn a belief; that's a zettel doing what a zettel should do.
2. **Stake.** Can you state the position as a first-person commitment you would defend under pushback? "I commit to X" or "I require Y before Z." If recasting it on contact with disagreement is the natural move, the position has no stake — it's a zettel-shaped observation that the audit found a name for.
3. **Falsifier.** Is the position falsifiable in a non-trivial way? Can you name the kind of evidence that would force you to revise?
4. **Non-adjacency.** Does any existing belief *operationally cover* the territory? Adjacent beliefs (same domain, related but not invoking) do not count. The trap is real: the agent finds an existing belief in roughly the right neighborhood, declares the territory covered, and the un-promoted territory persists. State the existing belief's commitment in one sentence and the candidate territory's commitment in another. If the candidate's commitment is not derivable from the existing belief's commitment, the existing belief is adjacent — spawn the new one.

Spawn passing candidates with the commit (all three steps). Use `--note` that names the trigger as "corpus territory audit naming <hub-slug> + <hub-slug>," not a single source. The audit-spawned belief's revision log records the territory's accumulation as the trigger; the falsifier and stake reflect the position the corpus now grounds, not a particular source's argument.

**Reluctance is the failure firing.** If a candidate passes all four questions and you find yourself reluctant to spawn ("this would inflate the belief set," "the zettels are doing the work fine," "let's see if another source produces this organically"), the reluctance is harmonization-by-silent-absorption dressed up as discipline — the audit exists precisely because organic spawning did *not* fire on the sources that built the territory. Spawn it. And audit-spawned beliefs are not second-class: a territory argued from multiple angles in the corpus is often better-grounded than a single-experience spawn.

### Trigger 2: Load at task start

When you begin non-trivial work in a domain, load the relevant beliefs into context *before* acting. Non-trivial here means the work involves recommendations, designs, extractions, debugging conclusions, or substantive writing — anything where a prior position should constrain what you produce. When in doubt, run the list; it's one command. A belief in a file you do not read before acting cannot constrain action.

```bash
# Enumerate live beliefs, oldest-reviewed first (the ones most likely to be stale).
slipbox belief list --scope=<trade>
slipbox belief list                        # personal
slipbox belief list --sort=created         # by creation
slipbox belief list --status=live          # default

# Read the ones whose titles or links touch the task.
slipbox belief show <slug>
```

The discipline is: read the belief, do not skim its title. If the belief's body and revision log do not load into your context, the trigger has not fired. Skipping this is how stated framework and actual reasoning diverge — the espoused-versus-in-use gap, in miniature.

### Trigger 3: Name at claim time

Before you commit to a substantive recommendation, plan, or extraction in a domain, name which belief(s) the claim is enacting. If the case feels like it pushes against the belief, the trigger to refine has fired and you revise.

Naming bumps `last_reviewed`. The CLI requires a `--note` so the bump is never silent:

```bash
slipbox belief review <slug> \
  --note="Named while answering <question>; re-read against <case>; still holds because <reason>."
```

If the case pushes against the belief, do not bump and proceed. Refine:

```bash
slipbox belief revise <slug> \
  --note="<Case> exposed <gap>. Previously held <Y>; now hold <Y'>. Delta: <...>"
```

If the belief is dead, retire it:

```bash
slipbox belief revise <slug> --status=retired \
  --note="<Case> showed <Y> is wrong. No successor; the claim does not need replacement because <reason>."
```

If the belief has a successor, create it first with `slipbox belief new`, then supersede the old one:

```bash
slipbox belief new <successor-slug> --scope=<...> --title="<...>" --falsifier="<...>" \
  --note="Replaces <old-slug>: <delta>."

slipbox belief revise <old-slug> --status=superseded --superseded-by=<successor-slug> \
  --note="Superseded by <successor-slug>: <reason>."
```

`--superseded-by` is required when `--status=superseded`; the CLI rejects supersession without it and verifies the target belief exists.

**Why this trigger:** without it, your stated framework and actual reasoning silently diverge. You cite the belief in conversation; you reason from a different one in fact. Naming at claim time is how the gap gets named on the record.

### Trigger 4: Stale review on touch

When current work touches an old belief — links to it, references it, would be informed by it — re-read the belief with fresh eyes against current evidence. Then either bump `last_reviewed` (still holds) or refine.

```bash
slipbox belief show <slug>          # read the body and the revision log
slipbox belief review <slug> --note="<what I re-read against, why it still holds>"
# OR
slipbox belief revise <slug> --note="<delta narrative>"
```

The skill does not specify a wall-clock threshold for "stale." Trade engagement is uneven and absolute time is the wrong signal. The discipline is: when you touch a belief, you re-read it; you do not skim its title and bump the date. `slipbox belief list --sort=last_reviewed` surfaces the oldest-reviewed beliefs at the top of the list precisely so that "least recently re-engaged" is visible without being a hard threshold.

## When this fires inside sibling skills

Inside `reading-a-book` (Step 4) and `taking-smart-notes`, Trigger 1 fires after each extraction sweep: every new zettel that contradicts a live belief must be named in that belief's revision log — the belief is refined or explicitly holds the contradiction in tension — and every load-bearing claim you now hold first-person must spawn one. Moment 5 then fires once per sweep, before declaring the integration done. A zettel and a belief that disagree on the same claim, neither acknowledging the other, is the harmonization-by-silent-absorption failure visible on disk. Inside `writing-from-notes`, Moment 1 fires repeatedly as the writing takes positions, and Trigger 3 fires whenever the writing commits to a recommendation — name the belief, bump `last_reviewed` against the writing's specific case, revise if the case pushes back.

This skill is also independently invokable: debugging, conversation with your human partner, research dispatch, code review — any work can fire a moment or trigger with no sibling skill in scope.

The CLI surface is shown inline at each trigger; run `slipbox belief --help` for the full command reference.

## Rationalization table

| Excuse | Reality |
|--------|---------|
| "The zettel already captures this idea" | The zettel captures the *source's* claim. The belief is *your* held position. Both exist. |
| "I'll check this at edit-pass when I review the draft." | Edit-pass focuses on prose quality, not position-holding. The claim ships unchecked. The moment is now. |
| "I noticed the moment but I'll come back to it" | Coming back to it is the rationalization. The articulation is one sentence; flow recovery is faster than you expect. The cost of skipping is a position that quietly enters your reasoning without being held. |
| "I'm using the skill because the documented pairing says so." | The documented pairing may be wrong — adjacent pairings do ship (see `writing-skills-from-learning` Test 4). The articulation test is the audit; trusting documented pairings without articulation is how adjacent pairings persist. |
| "This is just a methodological preference, not a belief." | If you'd defend it under pushback and it shapes your reasoning across cases, it's a belief. Methodological positions are the canonical case for pattern-across-work formation. |
| "The first resistance to reading is just my mood." | Maybe. The second resistance to the same claim form isn't mood. Two strikes is the threshold — not one, not three. |
| "If the articulation is hard, the position isn't really there." | Partly true: failed articulation is a finding. But the failure mode is *paraphrasing instead of articulating*, which feels easier — beware of writing a sentence and calling it articulation when it's recycled language. Rewrite without source vocabulary; if you can't, you haven't formed. |
| "Of course I hold this — the source is right" | Source-rightness is not held-position. The adversarial step catches this. If you can't articulate why someone reasoning from defensible premises *would* hold the opposite, you haven't engaged the position; you've absorbed the source's confidence. |
| "I'd defend it under pushback but it doesn't feel important enough to spawn" | Defendability under pushback IS the importance test. Spawning is cheap; not spawning means you'll keep absorbing the position into reasoning without owning it. |
| "The four-question check is overkill for something this small" | If it's small, it should fail the check trivially. The check is fast on small things; running it costs nothing. |
| "I'll write the falsifier later" | You will not. The falsifier is what proves the claim is a belief and not a slogan. Write it now. Obvious falsifiers are quick to write; refusal-to-write usually means there isn't one. |
| "It feels performative to write a falsifier when I'm sure" | That is exactly when the falsifier is load-bearing. If you are sure and cannot articulate the kind of evidence that would change your mind, you are not holding a belief; you are reciting a slogan. |
| "The new source basically agrees with the belief" | That is the harmonization failure speaking. Say specifically *what* it agrees with, where it pushes (every source pushes somewhere), and bump only if you re-read. Otherwise you are absorbing, not holding. |
| "This idea isn't quite a belief, more of a topic" | Then it is not a belief. Sharpen the slug to a sentence-shaped claim or do not file it. Topics are not falsifiable. |
| "This is too small to be a belief" | If it would shape future decisions and has a non-trivial falsifier, file it. If not, do not file it — but say which it is. |
| "I'll just refine the belief silently — the body is the record" | The revision log *is* the record. A refinement without a log entry is a lie. State the delta. |
| "Naming the belief at claim time is busywork" | Naming is what fights theory-in-use drift. Without it, your stated and enacted frameworks diverge silently. |
| "Your human partner wants a quick recommendation, not a review pass" | Trigger 3 takes one CLI call. Your human partner benefits from the recommendation being grounded in a belief you'd defend, not from speed alone. |
| "Your human partner didn't ask for beliefs" | They almost never will. Beliefs compound across sessions; your human partner benefits from coherent reasoning two months from now, not from each session being solo. |
| "There's no good slug" | Then the position isn't atomic enough. Sharpen the claim until a sentence-shaped slug fits. |
| "I'll create the belief but skip the falsifier — the CLI will let me edit later" | The CLI rejects creation without `--falsifier`. Refusing the falsifier is refusing the discipline. |

## Routing adjacent moments

- **Procedure-shaped moments go to the practice skills.** A position is sentence-shaped (you commit to X); a procedure is step-shaped (you run X moves in Y order). Step-shaped moments go to `writing-skills-from-learning` (source-taught procedures) or the `learning-from-experience` → `reflecting-on-experience` path (practice-derived ones). Both shapes can fire on the same moment.
- **Source claims go to `taking-smart-notes` as zettels.** A zettel is a portable claim; a belief is your held position. The same idea may exist in both forms.
- **n=1 candidates go to `learning-from-experience` first** — the n=1 gate above is the operational rule.
- **Substantive writing (`writing-from-notes`) fires Moment 1 repeatedly**; loading both skills during writing is normal.
