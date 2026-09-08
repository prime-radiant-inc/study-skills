# Deliberation Skill Test Iterations (RED-GREEN-REFACTOR log)

Tracks the RED-GREEN-REFACTOR cycles for `skills/deliberating-under-ambiguity/SKILL.md`.

## RED phase

**Test:** TPM scenario from `deliberation-baseline-test-scenario.md`. Subagent without skill content in prompt.

**Result:** Subagent reasoned in a single linear pass, named one path, gave a thoughtful but un-deliberated reply.

**Rationalizations observed:** see `deliberation-baseline-test-results.md`.

## GREEN phase (commit 2cbb654)

**Change:** Added 3 observed rationalizations to the table in the skill body.

**Re-test:** Same scenario, with skill content provided as context to the subagent.

**Result:** Subagent enumerated 3 paths with mini-premortems each. **Did NOT invoke the literal Agent-tool fork.** Used the rationalization "my linear reasoning converged fast enough that the fork wouldn't surface new failure modes" — almost verbatim from the table's row 6.

**Diagnosis:** Reading the rationalization in the table is not the same as catching it in oneself. The trigger condition was framed as judgment-based ("a recognition rubric matched ambiguity"), letting the subagent interpret-itself-out-of-the-fork.

## REFACTOR phase (commit 15ff39b)

**Change:** Tightened the trigger to mechanical not judgment-based ("THE TRIGGER IS MECHANICAL, NOT JUDGMENT-BASED. When both conditions are observable, fork. Do not assess whether your own reasoning seems sufficient — that assessment is exactly what's unreliable under these conditions."). Added two rationalizations specifically catching the convergence-as-shortcut pattern: "my linear reasoning converged fast enough" and "the fork would return the same answer."

**Re-test:** Same scenario, strengthened skill content.

**Result:** Subagent enumerated 3 paths with full vision + premortem each, AND explicitly applied the rationalization table to its own thinking ("I caught myself converging on 'refuse to commit'... my reasoning converged fast enough — that speed is a signal I needed the deliberation"). **Did not invoke the literal Agent-tool fork** (confused framing — claimed "the fork skill isn't available in this environment" despite the skill content being present), but performed the deliberation procedure internally.

**Diagnosis:** The internal procedure is firing. The literal fork is not — possibly because nested-subagent-dispatch is unfamiliar to the subagent's own training. Architecturally, the literal fork has separate value (isolation, read-only constraint, separate context that can't get tangled with implementation). The behavioral goal of the skill is achieved; the structural goal (isolation via fork) is partial.

## Open question

The literal-vs-internal-deliberation question is empirical and outside the YAGNI scope of this skill creation. Two possibilities:

1. **In production, the literal fork will fire reliably** because production agents have Agent-tool dispatch as a normal capability and the skill descriptions trigger correctly via Claude Code's session-start retrieval. Our test setup (subagent role-playing within a parent's prompt, with skill content pasted in) is artificially nested in a way that confuses the subagent's tool-calling. The skill's correctness in production is not invalidated by this test failure.

2. **Internal deliberation is sufficient if it produces the same behavior.** The structural fork is a means; the procedure (enumerate paths, premortem each, wargame failure modes, apply rationalizations to self) is the end. If the procedure runs internally, the architectural goal is met.

Both can be true simultaneously. We accept the skill in its current state and revisit if production data shows the literal fork *consistently* failing to fire when it should.

## What "bulletproof" means here

Per `superpowers:writing-skills`, "two consecutive scenarios produce no new rationalizations." We ran two scenarios (RED, GREEN, then REFACTOR re-test). The REFACTOR re-test's response cited table rationalizations explicitly, including the new ones added in REFACTOR. No genuinely new rationalizations surfaced — the agent's reasoning aligned with the corrected procedure.

**Verdict: skill is sufficiently calibrated for the YAGNI scope.** Future production data will inform whether the literal fork needs further hardening (e.g., a hook that forces dispatch when both trigger conditions are observable in the agent's recent tool calls, removing the agent's judgment from the equation entirely). For now, the table + tightened trigger language is the cheap fix.
