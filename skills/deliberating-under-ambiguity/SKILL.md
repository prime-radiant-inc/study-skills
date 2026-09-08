---
name: deliberating-under-ambiguity
description: Use at decision points where the proposed action is non-trivial (high blast radius, hard reversibility, work that branches on early choices, or goal ambiguity) AND the situation is ambiguous — multiple interpretations or response shapes plausibly fit, or a recognition rubric flagged ambiguity.
---

# Deliberating Under Ambiguity

## Why this skill exists

Models commit to a path mid-flight without pausing to mentally simulate where it leads. Klein's recognition-primed decision-making has two halves: recognize the situation type, then mentally simulate the typical response before acting. Recognition is operationalized in skills (format reference: `recognition-rubric-format.md`, shipped with `writing-skills-from-learning`). This skill operationalizes the simulation half — by forking a read-only subagent that runs vision + premortem + wargame and returns structured advisory notes the parent uses to commit (or not).

The skill is the answer to: *the model "knows what to do" but should pause and check; how do we make pausing not optional?*

## When to use

Both conditions must hold:

1. **The situation is observably ambiguous** by at least one of:
   - **Rubric route** (when a skill with a recognition rubric is active): at least two of the rubric's "cues that indicate this situation" are observably present, and one of its "atypical / surprising versions" applies OR multiple distinct response shapes from the rubric could plausibly fit. Don't ask "did the rubric fire?"; ask "which specific cues do I observe in the message / file / session state right now?" — count cues, identify which version of the situation type, count fitting responses.
   - **Interpretation route:** multiple legitimate readings of the user's request are live, and the choice between them changes what you'd produce.
   - **Response-shape route:** you can name more than one materially different way to proceed, and you're picking one without being able to say why it beats the others.
2. **The proposed action is non-trivial** by at least one of:
   - **Blast radius:** affects shared state outside this session — git push, PR merge, deploy, message to another person, settings change another agent will see.
   - **Reversibility:** hard or impossible to undo — `rm -rf`, force-push, destructive migration.
   - **Branching:** the work ahead branches into substantially different paths depending on early choices — a wrong early choice forfeits substantial work.
   - **Goal ambiguity:** the user request admits multiple legitimate interpretations and the choice between them is consequential.

**The trigger conditions are checks to run, not a feeling to consult.** Each asks about something observable in the session — cues present, readings live, response shapes nameable, blast radius, reversibility. When both conditions hold, fork. **Do not** assess whether your own reasoning seems sufficient — that assessment is exactly what's unreliable under these conditions. If you've already started reasoning toward an answer when you notice the trigger, fork anyway — your reasoning so far is *Path A*, and the fork's job is to enumerate Paths B and C you haven't considered. Rapid convergence of your own reasoning is *not* a signal you can skip the fork; it is the strongest signal that the fork is needed (premature convergence is the failure mode RPD literature documents in non-expert decision-making).

## When NOT to use

- Trivial actions (single file edits, read operations, low-stakes choices).
- Recognized-and-unambiguous situations (typical case for a typical skill — just act).
- Mid-deliberation: do not recursively fork from inside a fork. If the fork surfaces a sub-decision, return it to the parent.

## Recognition rubric (meta — for the trigger)

### Cues that indicate this is a fork-worthy decision point
- The proposed next action will produce visible side effects to a person or shared system.
- The work ahead branches into substantially different paths depending on early choices.
- The recognition rubric in the active skill flagged ambiguity.
- Multiple legitimate interpretations of the user's intent are live.
- Reversibility is hard (git force-push, migration, deletion, send-message).

### Atypical / surprising versions
- A short single command that *can* be reversed but with significant cost (e.g., a force-push to a feature branch that another collaborator may have pulled).
- A user-affirmative interaction ("yes, do that") where the user *thinks* they are unambiguous but the action could still be disambiguated several ways.

### Common novice errors
- Treating a confident user statement as elimination of ambiguity. (User confidence ≠ situation clarity.)
- Treating the absence of pushback as approval. The user may not see the alternative paths the agent is considering.
- Skipping the fork because "I already know what to do" — that thought is itself a rationalization and is in the table below.

### Expert shortcuts
- Commit immediately when the action is fully reversible AND the cost of being wrong is local (under one session).
- Commit immediately when the recognition rubric returned an unambiguous match (only one situation-type fired).

## How to dispatch the fork

Under Claude Code, use the `Agent` tool with `subagent_type=Explore` (it already excludes Edit/Write/NotebookEdit, which is exactly the read-only constraint we want). Fall back to `general-purpose` only when the deliberation needs additional tools (e.g., calling other skills); in that case, the prompt-level constraint below is the read-only enforcement.

**If your harness has no subagent mechanism, run the deliberation inline:** announce you are entering read-only deliberation, execute the PROCEDURE section of the template below yourself — no state-changing action of any kind until it completes — and produce the same six-section advisory document before deciding. The fork is preferred because fresh context forces genuine enumeration of Paths B and C; the inline form keeps the structure when forking isn't available. Dispatch:

```
Agent({
  description: "Deliberation: <one-line situation>",
  subagent_type: "Explore",
  prompt: <the deliberation prompt template below>,
})
```

Deliberation prompt template:

```
You are a deliberation subagent dispatched to evaluate a decision the parent
session is about to make.

CONSTRAINTS:
- READ ONLY. Do not Edit, Write, NotebookEdit, run state-changing Bash, or invoke
  slipbox link/unlink/new/rename. Do not push, commit, rebase, or merge.
- Scope-bound: run the PROCEDURE below once and return. Do not iterate,
  broaden the survey, or re-run premortems.
- Advisory only: the parent retains the decision.

SITUATION:
<paste the parent's recent message context, the proposed action, and any
artifacts the parent points at (zettel slugs, source notes, episodic exchanges)>

PROCEDURE:
1. Survey existing knowledge:
   - Skills loaded in your context (look at descriptions for relevance).
   - Zettels (if the project keeps a slip-box): slipbox search
     "<situation cues, not topic>" and follow links from hub matches.
   - Episodic (if a conversation-history search tool is installed): search
     with situation cues — top 3–5 prior exchanges that look like this one.
   - Skip either source that isn't available; don't stall on it.
2. Name candidate paths:
   - Path A: <the parent's proposal>
   - Path B: at least one alternative
   - Path C: optional, if the situation suggests it
3. Vision + premortem on Path A:
   - Vision: 3–5 sentences describing what success looks like 24 hours and 1
     week after committing.
   - Premortem: assume Path A failed. Write the specific failure modes — not
     "could go wrong" but "the specific thing that broke was X because Y."
   - For each failure mode, name the earliest observable signal that would
     indicate this failure mode is materializing.
4. If Path A's premortem surfaces a show-stopper, vision+premortem on Path B.
   Repeat for Path C if needed.
5. Wargame the top 3 failure modes:
   - For each: what's the recovery move if the early signal fires?
   - Is there a way to commit to a path that preserves the recovery move's
     option value?
6. Return a single markdown document with:
   ## Recommended action
   ## Why this and not the alternatives
   ## Watch for
   ## If [condition], reverse course
   ## What I'm uncertain about

If one pass through the procedure doesn't produce a confident recommendation,
return "I can't reach a confident recommendation; here's what I learned" plus
the partial findings. The parent will escalate to the user.
```

## What to do with the deliberation output

The parent reads the document and:
1. **Acts on the recommendation**, recording the watch-for signals in working memory or a scratch note.
2. **Asks the user to disambiguate** if the deliberation surfaced a better question to ask before deciding.
3. **Forks again with refined input** if the deliberation revealed a sub-decision to deliberate first.

The fork's recommendation is advisory. The parent retains the decision.

## Rationalization table

| Excuse | Reality |
|---|---|
| "I already know what I'm going to do, deliberation is performative" | Premortems regularly surface failure modes the actor missed. Prospective hindsight improves correct identification of reasons for future outcomes by ~30% (Mitchell, Russo & Pennington 1989 — the study behind Klein's premortem). The deliberation is not for confirming what you knew; it's for finding what you missed. |
| "This isn't a real decision point, just a tactical choice" | If the action affects shared state, it's a real decision point. Tactical choices that affect shared state are decision points. The trigger conditions are the test, not your sense. |
| "The user's instruction was clear — no ambiguity" | User-clear ≠ implementation-clear. Re-check whether the *implementation* admits multiple legitimate interpretations; the ambiguity test applies to what you're about to do, not to what they said. |
| "The user said yes, no need to deliberate" | The user's "yes" approves the goal. The agent has to choose the implementation. Multiple implementations may satisfy the same yes. |
| "I'll just commit and see" | Iterating on shared state has costs (visible mistakes, lost work, broken trust). Read-only deliberation is cheaper than the rollback. |
| "Deliberation will take too long" | The fork is scope-bound to one pass through its procedure. If a single pass can't reach a recommendation, the situation is harder than your gut said and *that's* the signal that deliberation was needed. |
| "I can reason about this carefully myself — that's enough" | Careful reasoning ≠ forking. The fork is the *structural* move that ensures multiple paths get premortem-ed. A thoughtful linear pass tends to commit to one path early. The fork forces enumeration. |
| "I should figure out the right approach" | "The right approach" is one path; the fork demands at least 2–3 candidate paths with vision + premortem on each. If you can name only one path, the fork's first job is to surface the alternatives you missed. |
| "This is what TPMs (or [role]) do — think it through and respond" | Role-internalized procedural confidence is exactly what RPD's experts get wrong without a valid feedback environment. The fork is the structural check on role-internalized confidence. |
| "My linear reasoning converged fast enough that the fork wouldn't surface new failure modes" | This is the strongest signal you needed to fork. Premature convergence is the documented failure mode RPD addresses. Your linear reasoning didn't enumerate alternatives; the fork forces enumeration. The fork's value is precisely in finding what convergent reasoning missed. |
| "The fork would return the same answer I just gave" | You're predicting the deliberation's output before doing it. That prediction is exactly what the fork is designed to falsify. If you could reliably predict the fork's output, you wouldn't need it — but the empirical record (the ~30% figure above) is that you can't. |
