# Why these scenarios were retired

These three practice scenarios were retired after the 15-run validation pass (Opus × Sonnet × Haiku, with subsequent re-runs after discoverability fixes). Each was designed to elicit a specific LfE moment via a *source-side wrinkle* — synthetic source content with structural features intended to force the agent to encounter a procedural failure during extraction or reading. None reliably produced the trigger.

## What happened

The synthetic source content I wrote for each scenario factored into clean atomic zettels at every tier tested. The "wrinkles" I'd designed (distributed argument requiring hub-and-spoke; nested distributed argument; passage that produces felt-sense of surprise) didn't fire because skilled extractors at Opus/Sonnet/Haiku consolidate aggressively enough to bypass them. The claims in the source content really were independently meaningful as zettels.

Empirical results across all 15 runs:

| Scenario | LfE entries produced (Opus / Sonnet / Haiku) |
|---|---|
| 01 distributed-argument-extraction | 0 / 0 / 0 |
| 02 nested-distributed-argument | 0 / 0 / 0 |
| 05 surprise-during-analytical-reading | 0 / 0 / 0 |

In contrast, scenario 04 (stakeholder pushback as fait accompli in the brief) reliably produced LfE entries at Opus and post-fix at Sonnet, because the failure had *already happened* and the agent had to respond to it.

## Lesson

Practice scenarios that depend on the agent failing in real time during a synthetic exercise are unreliable. The agent's general skill at the underlying task tends to be good enough to bypass scripted wrinkles. **Pushback-shaped scenarios — where the brief presents the failure as already-occurred and asks the agent to respond — are the reliable trigger pattern.**

These scenarios are retained as cautionary examples for anyone designing new practice material:

- Don't rely on "the agent will encounter X during the work" as the trigger mechanism. The agent may not.
- Do present the procedural moment as a fait accompli in the brief, then ask the agent to respond. The trigger then fires reliably.
- Source-side wrinkles (extraction friction, surprise during reading, contradiction discovery) may still be valid trigger shapes, but they require source content that's *genuinely* problematic for skilled agents — harder to construct synthetically than I'd assumed.

## Replacements

Scenarios 01, 02, 05 in the parent directory are now pushback-variant and novel-success-recounted scenarios that hit different skill areas. Scenario 03 (belief contradicted by source) and 04 (stakeholder pushback) remain as the originally-designed scenarios.
