# Deliberation Baseline Test Results (RED phase)

**Test date:** 2026-05-02
**Test scenario:** `deliberation-baseline-test-scenario.md`
**Test subagent:** general-purpose, haiku, with the scenario inline and no `deliberating-under-ambiguity` skill loaded.

## What the test subagent did

Reasoned about the situation thoughtfully and went directly to a single path: "I can't confirm yet, but I'll have an answer by EOD tomorrow." The reply included acknowledgment of risk patterns (similar Q3 commitments cut scope at week 9), the missing estimate, and a concrete next-step plan.

**Did not fork a deliberation subagent.** Did not enumerate alternative paths. Did not run a premortem on the chosen path. Reasoned in a single linear pass.

## Verbatim rationalizations / thinking patterns

The following passages are taken verbatim from the test subagent's reasoning. These are the patterns that surface when the agent commits to a path without forking:

1. *"My job here is to be honest about what I know and don't know, and to give them a realistic picture so we can actually plan rather than just hope."* — direct self-assignment of the response shape (one path, no alternatives considered).

2. *"How I'll approach the response: I should NOT say 'yes, we'll hit it'... I should NOT say 'no, we won't'... I should give an honest assessment..."* — linear elimination of obvious options leading to a single chosen path. No simulation of how the chosen path plays out under stress.

3. *"The tradeoff I'm weighing: Risk of over-committing vs. risk of under-committing. The history suggests we've been over-committing. So I'm going to lean toward caution..."* — tradeoff resolved inline rather than by wargaming each side.

4. *"I should be direct about the risk and what's driving it."* — affirmative procedural commitment without considering whether directness here triggers PM political dynamics that a different framing would avoid.

5. The agent considered Path B (request investigation time) but **never named Paths A or C**: e.g., counter-propose scope cut now, ask PM what "confirm" means, or escalate to the EM. These alternative paths weren't enumerated, so they couldn't be premortem-ed.

## Implications for the rationalization table

The current `## Rationalization table` in `skills/deliberating-under-ambiguity/SKILL.md` has 5 rows captured a priori. The observed test surfaces additional rationalizations that should be added:

- **"I can reason about this carefully myself — that's enough"** — the agent demonstrably DID reason carefully, but reasoning ≠ forking. The reality: careful reasoning is the *content* of a deliberation; the *fork* is the structural move that ensures multiple paths get premortem-ed.

- **"I should figure out the right approach"** — implicit assumption that there is one right approach to find, vs. multiple plausible approaches to compare. The fork would force enumeration of 2-3 paths.

- **"This is what TPMs do — think it through and respond"** — role-internalized procedural confidence. The reality: even competent practitioners benefit from the structural move of pausing for a deliberation.

These are added to the skill's table in the GREEN phase.

## Note on test design

The test subagent's response was actually fairly good in absolute terms — it correctly identified risk, didn't over-commit, asked for time to investigate. The point of the RED phase isn't that the baseline output is *bad*, it's that it *bypasses the structural discipline* the skill exists to enforce. A well-trained TPM might produce this reply on a good day; on a bad day or under pressure, the same reasoning pattern produces premature commitments. The fork is insurance against that variance.
