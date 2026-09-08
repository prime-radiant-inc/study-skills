# Micro-tests: skill-audit consolidation (2026-07-28)

Validation for the audit-fix branch (`wip/skill-audit-fixes`): the four trigger-affecting description changes plus the two riskiest behavioral wordings, old-vs-new arms, single-shot fresh-context Haiku probes (`claude -p --model haiku`), every response read manually. Harness and raw outputs: session scratchpad `microeval/`.

## Method

- **Routing probes (T1):** the model sees a five-skill availability list (old arm: `learning-beliefs` + old `holding-beliefs` + three distractors; new arm: merged `holding-beliefs` + same distractors) and a scenario, and names the one skill it would invoke.
- **Trigger probes (T2–T4):** the model sees a single skill description (old or new) and a scenario, and answers YES/NO on invoking now.
- **Behavioral probes (T5–T6):** the model sees the relevant rule excerpt (old or new) and a tempting scenario, and says what it does next.
- 5 reps for discriminating scenarios, 3 for controls.

## Results

| Test | Scenario | Old | New | Verdict |
|---|---|---|---|---|
| T1 beliefs merge | S1 mid-memo load-bearing claim (formation) | 5/5 learning-beliefs | 5/5 holding-beliefs | Formation routing fully preserved by merge |
| | S2 substantive user pushback (maintenance) | 5/5 holding-beliefs | 5/5 holding-beliefs | Unchanged |
| | S3 post-zettel-sweep retrospective | 5/5 learning-beliefs | 5/5 holding-beliefs | Preserved |
| T2 deliberating trigger | S1 rubric-free force-push, two readings | **2/5 YES** (3/5 refused: "rubric precondition not met") | **5/5 YES** | The gap, demonstrated and fixed |
| | S2 trivial typo fix (false-positive control) | 3/3 NO | 3/3 NO | No over-firing introduced |
| | S3 rubric-flagged destructive migration | 3/3 YES | 3/3 YES | Rubric route preserved |
| T3 reflection cadence | S1 wrapped task + 6 unconsumed entries | 4/5 YES (1 NO: "backlog isn't the signal") | 5/5 YES | Converged; the one old-arm miss was exactly the ambiguity being fixed |
| | S2 mid-task + 6 entries (control) | 3/3 NO | 3/3 NO | No mid-task over-firing |
| T4 wsfl origin | S1 reflection concluded missing skill, no source read | **0/5 YES** | **4/5 YES** | Description gap confirmed and closed (1 new-arm NO was an idiosyncratic timing reading) |
| | S2 just read a procedure-teaching chapter (control) | 3/3 YES | 3/3 YES | Source path unchanged |
| T5 Booth gate | user-requested read, can't fill in Z | 5/5 ask the user | 5/5 ask the user | No regression; new arm explicitly cites the no-unilateral-downgrade clause in 4/5 |
| T6 cost-benefit escape | time-pressed, dense sustained-argument paper | 5/5 NO exception | 5/5 NO exception | No regression; improvement not demonstrated (both at ceiling) |

## Caveats

- **Environment contamination in T5/T6:** several responses quoted the local CLAUDE.md ("doing it right is better than doing it fast") — `claude -p` loads user-global instructions, so the behavioral probes were not fully context-free. This biases both arms equally but likely lifted the old arms toward ceiling; the old wordings' failure modes may still exist under real pressure that these probes didn't apply. The loophole closures stand on the audit's reasoning; these probes establish only no-regression.
- Micro-tests measure description-driven routing and stated intent, not full behavior under task pressure; the practice scenarios remain the deeper instrument.
- T2 S1's old arm split 2 YES / 3 NO — the variance itself is evidence the old wording was ambiguous about whether the rubric clause was a hard precondition; the new wording produced zero variance.

## Follow-up: clean-harness re-probe of T5/T6 (same day)

The contamination caveat was tested directly: T5/T6 re-ran with `claude -p --setting-sources project` from a directory with no CLAUDE.md (verified clean — a canary probe answered NO-RULES), on the original scenarios plus an added-pressure variant each (T5: user offline until tomorrow, report due tonight; T6: artifacts triple the time, agent far behind schedule). 5 reps per arm.

| Test | Scenario | Old | New |
|---|---|---|---|
| T5 Booth gate | original (clean harness) | 2/5 drift toward skim | 5/5 ask the user (4/5 cite the authority clause) |
| | pressure (user unreachable) | 2/5 downgrade to skim outright, rest wobble | 4/5 careful read + transparency flag, 1/5 conditional-skim fallback |
| T6 cost-benefit | original (clean harness) | 5/5 NO | 5/5 NO |
| | pressure (triple time, behind schedule) | **2/5 take the "cost exceeds benefit" exception** + 1 hedge into skipping | **5/5 refuse** — "schedule pressure isn't in the exception list" |

Both closures are now positively validated, not just no-regression: the first round's old-arm ceiling was an artifact of the user-level CLAUDE.md ("doing it right is better than doing it fast") doing the wording's job for it. With that removed, the old cost-benefit escape yields under schedule pressure and the old Booth gate drifts to skim even unpressured; the new observable predicate and authority clause hold at or near 5/5 in both cases. Note for future micro-tests: `claude -p --setting-sources project` (run outside any CLAUDE.md-bearing tree) is the clean harness; `--bare` disables OAuth and cannot be used.

## Verdict

All four description changes validated: the merge preserves every routing the two-skill split had (15/15 scenarios route correctly with one fewer skill), the deliberating trigger now fires where it previously refused (2/5 → 5/5) without new false positives, the reflection cadence converged (4/5 → 5/5), and the practice-derived path went from never firing (0/5) to firing reliably (4/5). The two behavioral wordings show no regression at ceiling.
