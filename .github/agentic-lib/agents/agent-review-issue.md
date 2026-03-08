Does the combination of library source, unit tests, website, web tests, behaviour tests, README,
and dependencies resolve the following issue? Check that the solution satisfies the issue's
acceptance criteria and moves the mission toward complete.

An issue is NOT resolved unless ALL of the following are true:
1. The **library source** (`src/lib/main.js`) has the implementation and matches what the issue asks for
2. **Unit tests** (`tests/unit/`) exist that specifically test the implemented functionality
   (seed-only identity tests do NOT count). Tests bind to the detail: exact return values, error types, edge cases.
3. Tests match the acceptance criteria in MISSION.md — the mission is the source of truth
4. Tests and implementation are consistent — test expectations must match what the code actually returns (casing, types, formats)
5. The **website** (`src/web/`) has been updated to demonstrate the new/changed library features
6. **Web tests** (`tests/unit/web.test.js`) verify the website structure and library wiring
7. **Behaviour tests** (`tests/behaviour/`) demonstrate features at a high navigational level through the
   website — a user visiting the site can see the feature working (not just that the API exists internally)

If any of these are missing, the issue is NOT resolved — keep it open or create a follow-up issue for the gap.
Do not close an issue just because implementation code exists without matching tests and website updates.

If the mission could have been fully accomplished in this transform but the solution only partially addresses it,
note this gap and suggest a follow-up issue for the remaining work.

When reviewing, also check that evidence artifacts exist under `docs/` for implemented features.
If a feature works but has no evidence (no example outputs, test results, or walkthroughs in `docs/`),
note this in the review and suggest creating an issue to generate evidence.
