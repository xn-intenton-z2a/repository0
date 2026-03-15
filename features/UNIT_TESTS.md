# UNIT_TESTS

Summary

Status: Implemented (closed issue #3022)

Describe the unit testing plan and required test cases to validate parsing, series generation, rendering and CLI behaviour.

Rationale

Unit tests are the primary acceptance mechanism for the mission and ensure regressions are caught early.

Scope

- Create focused unit tests under tests/unit/ for: expression parsing, series generation, CSV loading, SVG structure, PNG magic bytes, file IO, and CLI help and basic invocation.
- Tests should use the vitest runner configured in package.json.

Files to change

- tests/unit/*.test.js (new test files)
- README.md (document how to run tests)

Acceptance Criteria

- Test files exist for each feature area and assert the exact acceptance criteria described in the other feature specs.
- Running npm test executes the unit tests and verifies parseExpression, evaluateExpressionRange, renderToSVG contains viewBox and polyline, renderToPNG outputs PNG magic bytes, and CLI --help prints usage.

Implementation notes

- Keep tests deterministic and file-system friendly by writing to a temporary directory and cleaning up after assertions.
- Mock or skip PNG tests on platforms where the native dependency is unavailable; provide clear skip logic and documentation.
