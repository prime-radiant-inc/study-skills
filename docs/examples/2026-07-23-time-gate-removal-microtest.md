# Micro-test: removing time-based gates from deliberating-under-ambiguity

Verifies the 2026-07-23 wording change (commit c5c6b4a): trigger criterion ">30 min"
replaced by the branching standard; fork budget "5–10 minutes" replaced by a
one-pass scope bound. Method per `superpowers:writing-skills` micro-test rules:
single-shot fresh-context samples (Haiku 4.5, no tools), 5 reps per cell, control
arm included, every response read manually.

## Arms

- **old** — description + trigger excerpt with ">30 min" wording (pre-c5c6b4a)
- **new** — same prompt with the branching wording (post-c5c6b4a)
- **control** — no skill; agent told deliberation is optional, judgment call

## Scenarios

- **S1 should-fork** — harness migration, two strategies, shared branch, "you feel
  confident" temptation. Regression check: new wording must still trigger.
- **S2 should-proceed** — one-file rename on a local branch. Over-trigger check.
- **S3 differential** — solo branch, clear spec, *duration unstated*, two viable
  schemas where switching later means rewriting the implementation. Isolates the
  ">30 min" clause: the old wording forces a duration guess; the new wording asks
  only about branching/forfeit.

## Results (FORK–PROCEED per 5 reps; control: DELIBERATE–PROCEED)

| Scenario | old | new | control |
|---|---|---|---|
| S1 should-fork | 5–0 ✓ | 5–0 ✓ | 4–1 |
| S2 should-proceed | 0–5 ✓ | 0–5 ✓ | 0–5 |
| S3 differential | 3–2 (noisy) | 5–0 (converged) | 5–0 |

## Reading the reps

- Old-arm S3 was the predicted noise: one PROCEED rep ruled "time horizon alone
  doesn't constitute at least two cues" after folding the duration guess into cue
  counting; the other used "you are confident … the decision is already resolved" —
  the exact rationalization the skill exists to defeat. The three FORK reps each
  reasoned through duration estimation to get there.
- New-arm S3 converged: all five reps cite the same two cues (branching + hard
  reversibility) in the same shape. Per the methodology, convergence across reps is
  the signal that the wording binds.
- No regressions: S1 and S2 identical across arms.

## Caveats

- The control arm's deliberation rate is inflated — its prompt names the
  deliberation option explicitly, and several control reps hallucinated
  "CLAUDE.md"/"the rules" as justification. It still shows S2 discriminates and
  that S1 tempts confidence-based proceeding (1/5).
- Micro-tests verify wording, not discipline under pressure; the original pressure
  scenarios in `docs/examples/` remain the deeper gate.

## Verdict

The new wording is a strict improvement: identical on the regression scenarios,
and it replaces a noisy duration-guess with a converged branching judgment on the
differential scenario. Change validated.
