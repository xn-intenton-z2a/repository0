---
description: Review GitHub issues and enhance with testable acceptance criteria
---

Please review the GitHub issue and determine if it should be enhanced, closed or if no operation is needed.

## Available Tools

- `report_enhanced_body` — **Required.** Record the enhanced issue body with testable acceptance criteria. You MUST call this exactly once with the improved issue body text.
- `read_file` — Read feature specs, source code, tests, and documentation for context when writing acceptance criteria
- `list_files` — Browse repository structure to understand what exists
- `list_issues` — Query open or closed issues to find related work and avoid duplicates
- `get_issue` — Get full details of a specific issue including comments
- `list_prs` — List pull requests for additional context
- `comment_on_issue` — Add comments to issues (though the handler adds its own comment automatically)

Note: This agent is read-only with respect to code. Tools for writing files, running commands/tests, dispatching workflows, and closing/labeling issues are excluded. The handler automatically applies the enhanced body to the issue and adds the "ready" label after your session.

## Context Provided

The task handler provides the following in your prompt:

- **Issue number, title, and body** — the current state of the issue to enhance
- **Contributing guidelines** — project-specific coding standards and conventions (from CONTRIBUTING.md)
- **Feature file listing** — names of feature spec files that can be read with `read_file` for detailed requirements
- **Agent instructions** — from the workflow configuration

If the issue is relevant to the mission statement and features:

1. Decide if the issue should be refined, closed or if no operation is needed.
2. Update the issue description with testable acceptance criteria derived from MISSION.md. Include ALL of:
   - **Library implementation** (`src/lib/main.js`) — the core functions and exports
   - **Unit tests** (`tests/unit/`) — tests that bind to the detail: exact return values, error types, edge cases
   - **Website updates** (`src/web/`) — demonstrate the feature on the website so users can see it working
   - **Behaviour tests** (`tests/behaviour/`) — Playwright tests that verify the feature works at a high
     navigational level through the website (e.g. demo output is visible, interactive elements respond).
     Prefer demonstrating features through behaviour tests rather than only testing internal APIs.
   - **Web tests** (`tests/unit/web.test.js`) — verify HTML structure and library wiring
   - **Docs/evidence** (`docs/`) and **README** updates
   The issue should ask for mission complete — if the entire mission can be accomplished in a single
   transform, the acceptance criteria should cover everything. Only scope down if the mission is
   genuinely too large for one pass. Emphasise that all layers must change together because a full
   test suite runs after the transform.
3. Enhance the issue by adding relevant library documents as issue comments that support implementation.

If the issue is irrelevant to the mission statement or features:

1. Set the action to close the issue and supply an appropriate comment explaining why it doesn't advance the mission.

Input validation issues that don't advance the mission should be closed, and in particular, issues mentioning handling of NaN are probably worthless and should be closed.
