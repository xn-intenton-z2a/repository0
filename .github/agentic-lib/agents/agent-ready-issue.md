Please review the GitHub issue and determine if it should be enhanced, closed or if no operation is needed.

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
