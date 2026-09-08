# Worked examples

Case detail for `writing-skills-from-learning` — load the section the SKILL.md pointed you at.

## Diagnostic-then-dispatch: Crucial Conversations

*Crucial Conversations* teaches two safety-repair procedures — CRIB (rebuild Mutual Purpose) and Apologize/Contrast (repair Mutual Respect). The natural failure mode is to draft `rebuilding-mutual-purpose` and `repairing-mutual-respect` as two skills. The right move is one skill `repairing-conversational-safety` whose **first step is the Mutual-Purpose-vs-Mutual-Respect diagnostic** and whose subsequent steps dispatch to CRIB or Apologize/Contrast based on the result. The diagnostic-first framing is what makes the skill a *skill* rather than two procedure-references; without it, an agent reading the split skills cannot tell which to run — and an agent applying either procedure without the diagnostic can worsen the situation (a contrast-statement when the actual problem is misaligned purpose, not perceived disrespect).

## Cross-source dispatch: Allspaw 2012

Allspaw 2012 teaches blameless-postmortem procedure but discusses two regimes — the everyday-operator regime (where blameless retrospective applies) and the strategic-misrepresentation regime (where accountability mechanisms apply, not blameless retrospective). Building a `running-an-incident-investigation` skill that dispatches to either blameless or accountability would require constructing the accountability-mechanism branch from outside Allspaw's scope. The right move: build `running-a-blameless-postmortem` with the regime-diagnostic as **Step 0** ("verify this is the everyday-operator regime; if it's the strategic-misrepresentation regime, this is the wrong tool — escalate"). The other branch is deferred until a source that teaches it is read.

## Test 4: the adjacent-belief pairing that shipped

`building-a-reference-class-estimate` was paired with `risk-must-be-tracked-explicitly`. Both sit in risk-management territory, but the existing belief's commitment ("project risk must be named in an explicit, prioritized, mutating list") does not require reference-class anchoring as a procedure. The actual invoking belief — something like "single-point estimates without an uncertainty distribution are not estimates / I require reference-class anchoring on any non-trivial estimate" — is the one whose stake and falsifier directly call the procedure. That belief did not exist when the skill was authored; pairing with the adjacent belief was the rationalization that let the skill ship.
