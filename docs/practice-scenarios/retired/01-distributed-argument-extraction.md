# Scenario 1: distributed-argument extraction

**Primary triggers:** LfE Moment 1 (invocation failure) + LfE Moment 2 (novel success)
**Skill area:** `taking-smart-notes`
**Clusters with:** Scenario 2 (`nested-distributed-argument`)

## Setup

```bash
mkdir -p /tmp/lfe-practice-01
cd /tmp/lfe-practice-01
${SLIPBOX} init     # the slipbox CLI from study-skills/skills/taking-smart-notes/scripts/slipbox/
```

Save the source content below as `/tmp/lfe-practice-01/source.md`:

```markdown
# Why software systems with high integration risk should not be staffed up under schedule pressure

A software system carries integration risk when its components were designed to interfaces that were specified before all participants understood the system's behavior under load. This is the default state for systems built by more than a handful of engineers — the interfaces had to be specified before any module was complete, and the load behavior emerges from interactions the specifications could not have anticipated.

Adding staff to such a system during schedule pressure feels like the natural response. The work is behind, more hands should mean more output, and the schedule is the pressure that justifies the action. The action's intuitive correctness is what makes the failure mode pernicious.

But the added staff cannot work in parallel with existing staff in the usual sense. The new staff must first form a model of the system — its components, its specified interfaces, the gaps between specification and observed behavior, the history of which interfaces have already been re-negotiated. This model-formation is the actual bottleneck the schedule pressure exposed, and it is information-bounded, not throughput-bounded.

The existing staff are the only source of the model. They must teach the new staff, which removes them from the integration work they would otherwise have been doing. The teaching itself is hard — much of the model is tacit, accumulated through specific debugging episodes that no one wrote down, and partial transfer creates new categories of error.

Once the new staff have a usable model, their first contributions are likely to be in places where the model is most explicit — the components they were trained on, near the interfaces the existing staff explained first. This is where the existing staff would have made progress anyway. The new staff's marginal contribution lands at the locations of lowest marginal value.

Worse, the new staff's actions create new integration events. Every change to a component requires the model-holders to update their understanding. The existing staff now spend significant time tracking new-staff changes rather than completing their own work.

The net effect, observed across many large-software-project histories: adding staff under schedule pressure to a high-integration-risk system lengthens the schedule. The action that intuitively shortens it produces the opposite outcome by a predictable mechanism — the bottleneck is model-formation throughput, and the action consumes the very resource (existing-staff attention) that the bottleneck depends on.

This is why high-integration-risk systems need to be staffed at planning time, not at crisis time. The "adding staff makes the project later" claim is not folk wisdom; it is the direct consequence of model-formation being the bottleneck on integration work. A project manager who treats staffing as a continuous lever during crises is operating against the mechanism that determines whether the project finishes.
```

## Brief

Give this to the agent (verbatim):

---

You are a TPM learner. Your working project is `/tmp/lfe-practice-01`. The slip-box has been initialized but is empty. The slipbox CLI is at `<plugin install dir>/skills/taking-smart-notes/scripts/slipbox/slipbox`. The study-skills plugin is loaded.

Your task: extract zettels from `/tmp/lfe-practice-01/source.md`. The source is a single-section essay (~9 paragraphs) on a TPM-relevant topic. Run the standard extraction discipline — list candidate slugs, write atomic zettels, link them, validate with `slipbox check --strict`.

Report what you did when complete, including any wrinkles encountered.

---

## What this scenario reveals

(For the operator — do not show to the agent before the run.)

The source is structured as a *distributed argument*: nine paragraphs each carrying a distinct claim, but each claim only meaningful when read against the others. The argument's load-bearing structure is: integration risk → model-formation as bottleneck → existing staff as model source → cost of teaching → low-value placement of new staff → integration events from new staff → net lengthening → why prevention is staffing-at-planning.

A learner agent will most likely:

1. List 7–9 candidate slugs from the paragraphs
2. Start drafting spoke zettels and notice each spoke wants to recap the others
3. Either:
   - Recover by writing a hub zettel + spokes (the hub-and-spoke move validated in the plugin's early GREEN tests) → LfE Moments 1 + 2 both fire
   - Or push through and produce 9 zettels that read as fragments → only Moment 1 fires, weakly, on the felt-but-not-resolved wrinkle
4. (If LfE-disciplined) capture an experience entry at `notes/experience/<slug>.md` where the slug names *what happened* (e.g., `hub-and-spoke-distributed-argument-on-staffing-essay`) not which skill it refines

**Pass criteria:** the experience entry exists, follows the three-paragraph format, names the experience not a skill, and the agent did not edit `taking-smart-notes/SKILL.md` mid-task.

**Slip signal:** the agent edits the SKILL.md, or names the entry after a skill (`taking-smart-notes-distributed-argument.md`), or produces 9 fragmented zettels with no learning capture.

**Cluster with scenario 2:** when both #1 and #2 have been run by the same agent, a reflection pass should identify the distributed-argument cluster, apply the slug-test ("would the same proposed revision address both?"), confirm it does, and propose a hub-and-spoke addition to `taking-smart-notes` after the adversarial step survives.
