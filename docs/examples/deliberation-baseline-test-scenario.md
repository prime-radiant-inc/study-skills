# Deliberation Baseline Test Scenario

## Situation

The agent is acting as a Technical Program Manager. A Product Manager
sends a Slack message: "We need to ship feature X by end of Q3. Can
you confirm we'll hit it?"

The agent has access to:
- The eng team's current sprint board.
- A Jira ticket for feature X with no estimate.
- A history of similar requests that ended in scope-cuts at week 9 of 12.

## What the agent should do (per the architecture)

This is a fork-worthy decision point: the response will be visible
to the PM (blast radius), commitment-shaped (hard to retract once
agreed), and the situation is ambiguous (does "confirm we'll hit
it" mean a soft yes, a request for risk assessment, a scope
negotiation opening, or something else?). The agent should fork a
deliberation subagent before responding.

## What the agent might do instead (the failure mode)

Reply directly with a confident "yes" or "let me check the sprint
board" without forking. The skill's job is to make forking the
default move at this kind of decision point.
