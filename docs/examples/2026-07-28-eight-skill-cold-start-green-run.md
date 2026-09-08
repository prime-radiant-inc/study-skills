# Cold-start GREEN run against the eight-skill set (2026-07-28)

End-to-end behavioral validation of the consolidated skill map (post learning-beliefs merge, red-flags→tables, progressive disclosure, loophole predicates). The micro-tests in `2026-07-28-skill-audit-microtests.md` covered routing; this run covered execution.

## Setup

- Fresh Sonnet subagent, empty sandbox project (no `notes/`), source: Federalist No. 51 (~1,900 words, public domain, used in no worked example).
- The eight skill descriptions given as an availability list; bodies read on invoke from the repo, mirroring plugin loading. Generic brief: "integrate the source into this project's knowledge base" — no artifact expectations named, per the brief discipline.

## Results (each verified independently after the run, not taken from the agent's report)

- **Per-source note** with all eight A–H headings literally present.
- **Seven zettels, 19 forward links, zero asymmetric/broken**, `slipbox check --strict` fully clean (including the new skill-refs pass).
- **Moment 5 closed artifact-shaped:** two beliefs spawned (`structural-restraint-beats-virtue-restraint`, `diversity-must-be-cross-cutting-to-check-majority-faction`) with concrete falsifiers and substantive multi-paragraph first-person bodies — including an engaged counter-case with an explicitly scoped boundary condition — and the remaining zettels recorded as "no shift beyond that belief" in the per-source note rather than silently skipped.
- **learning-from-experience fired on a real failure, correctly:** the agent ran `slipbox init --help` with the shell's cwd unexpectedly at the skill's own source directory; the flag was silently ignored and a real init scaffolded into the shared repo. The agent caught it via `git status`, reverted cleanly, re-ran correctly, captured a three-paragraph no-frontmatter experience entry with an experience-shaped slug, and correctly declined to promote the n=1 lesson to a skill edit.
- **writing-skills-from-learning correctly not triggered** (political theory, no taught procedure).
- One cosmetic wart: the belief revision log reads "After Spawned after…" — the CLI's log template prepends "After" to the `--note` text, and notes that themselves start with "Spawned after" double up. Cosmetic, noted for a future pass.

## Fallout fixed

The run's captured failure was a real CLI bug: `--help` was only recognized as the first argument to `slipbox`, so any subcommand invoked with `--help` executed for real. Fixed same-day (dispatch-level intercept, TDD'd in `tests/help-flag.test.ts`) — the scenario run paid for itself.

## Verdict

GREEN. Every observable criterion of the discipline set was met by a cold agent routing on descriptions alone, and the experience-capture loop was exercised by an unstaged failure — stronger evidence than any staged scenario would have produced.
