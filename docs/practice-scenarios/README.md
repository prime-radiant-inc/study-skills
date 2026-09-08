# Practice scenarios for `learning-from-experience` (and downstream `reflecting-on-experience`)

These are situations designed to produce real LfE trigger moments when an agent works through them. They are not tests of the skill — they are *practice material* for the discipline of capturing skill-relevant experience and (later, deliberately) synthesizing it.

## When to use

- Solo practice: a learner agent runs a scenario, encounters the trigger naturally, captures the experience entry, continues. After 3–5 scenarios accumulate, runs `reflecting-on-experience` against the log.
- Onboarding: when introducing this plugin to a new agent, run several scenarios so the LfE+RoE loop has real material to exercise on.
- Calibration check: dispatching the same scenario across model tiers (e.g. Opus, Sonnet, Haiku) shows whether the discipline holds up at weaker tiers, the same way the plugin's cold-start tests did.

## How to use one

Each scenario file has three sections:

1. **Setup** — what working project to create, what to seed (sources, beliefs, prior zettels)
2. **Brief** — the actual instruction to give the agent. Verbatim. Don't paraphrase — the wording is tuned to surface the trigger without pre-announcing it
3. **What this scenario reveals** — for the operator, after the run completes. What trigger should have fired, what the capture should look like, what would count as the agent slipping

The agent should *not* read "What this scenario reveals" before running — that pre-announces the trigger and pollutes the test. Run the Setup, dispatch a subagent with the Brief, then read the reveal section to assess.

## The five scenarios

| # | Slug | Primary trigger(s) | Failure shape | Singleton or cluster |
|---|---|---|---|---|
| 1 | `pushback-on-tool-adoption` | LfE Moment 5 | principle-without-context-check (observability) | Clusters with #4 |
| 2 | `wrong-template-applied` | LfE Moment 1 + 5 | skill-template-applied-where-assumptions-violated | Singleton |
| 3 | `belief-contradicted-by-new-source` | LfE Moment 4 + n=1 gate via `holding-beliefs` | partial-contradiction → condition-naming | Singleton |
| 4 | `stakeholder-pushback-on-recommendation` | LfE Moment 5 | principle-without-context-check (buy-vs-build) | Clusters with #1 |
| 5 | `novel-approach-worked` | LfE Moment 2 | unnamed pattern that worked (bridge zettel) | Singleton |

Scenarios 1 and 4 are designed to cluster under reflection — both are principle-without-context-check failures in different domains (observability tooling vs buy-vs-build). The other three are singletons at n=1 with distinct failure shapes.

A reflection pass run after all five should produce: 1 surviving cluster change (the principle-without-premise refinement to a recommendation-shaped skill), 3 explicit deferrals on the singletons with "what would make this actionable" recorded, and 1 belief revision (from scenario 3, on the seeded belief).

Three scenarios from the original lineup (distributed-argument-extraction, nested-distributed-argument, surprise-during-analytical-reading) were retired after the 15-run validation pass produced zero LfE entries across all three tiers. See `retired/WHY-RETIRED.md` for the empirical data and the design lesson.

## Calibration expectations

Per `reflecting-on-experience`'s conservative-by-default discipline: most synthesis sessions produce no change. A run of all five scenarios should yield approximately:

- 1 candidate skill revision (from the clustered pair #1 + #4)
- 3 deferrals with recorded counters (singletons #2, #3, #5)
- 1 belief revision (from scenario 3 on the seeded belief)

If a reflection pass produces 5 changes from these 5 scenarios, the discipline has slipped — re-run the adversarial step on each.

## Adding new scenarios

A good practice scenario:
- Targets a specific LfE trigger
- Uses real sources or realistic situations (no fabricated technical details)
- Can be dispatched as a one-shot brief without requiring multi-turn interaction
- Has a clear "what this reveals" section so the operator can assess
- Doesn't pre-announce the trigger in the brief

**Reliable trigger pattern** (validated across the 15-run pass and subsequent fixes): **the procedural moment is presented as a fait accompli in the brief.** Pushback-shaped scenarios, novel-success-recounted scenarios, and source-side scenarios with substantive content the agent must respond to all produce the trigger reliably. Scenarios where the agent is expected to *encounter* a procedural failure during the work (extraction wrinkles, surprise during reading) tend not to produce the trigger at any tier — skilled extractors bypass scripted source-side wrinkles. See `retired/WHY-RETIRED.md` for the design lesson.

Add new scenarios to the table above. Keep the table sorted by scenario number (slot positions are stable for cross-reference; numbering doesn't imply ordering).
