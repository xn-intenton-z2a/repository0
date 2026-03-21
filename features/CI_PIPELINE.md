# CI_PIPELINE

Summary

Introduce a small, deterministic continuous integration workflow that runs the unit tests and verifies the repository meets the mission test expectations on Node >= 24. This feature documents the required CI job, acceptance criteria, and testable checks so the repository can reach mission completion reliably.

Motivation

Several mission acceptance criteria remain unchecked (tests passing in CI and overall acceptance). Adding a CI workflow ensures tests run consistently in a reproducible environment and surfaces any platform-specific failures early.

Scope

- Add a GitHub Actions workflow that runs on push and pull request and executes npm ci and npm test:unit on Node 24.
- Fail fast on test failures and produce machine-readable logs for debugging.
- Verify coverage thresholds are met when running unit tests.

Behavior and steps

- Workflow name: Repository tests
- Triggers: push and pull_request to main (and optionally to branches matching feature/*)
- Runner: ubuntu-latest
- Steps:
  - Checkout repository
  - Setup Node with version 24 (respect package.json engines)
  - Run npm ci
  - Run npm run test:unit (or npm test if configured to run unit tests)
  - Upload test logs and coverage artifacts

Acceptance criteria

- A workflow file exists at .github/workflows/test.yml that runs on push and pull_request.
- The workflow uses Node 24 and executes npm ci and npm run test:unit.
- When executed on the default branch, the workflow completes with status success and exit code 0 (indicating unit tests passed).
- Local execution on Node 24 of npm run test:unit exits 0 for the same commit that passed CI.
- Coverage reports are produced; the line coverage is at least the project minimum (50% by config) for main.

Implementation notes

- Use actions/checkout and actions/setup-node (v4+) with node-version: 24.
- Keep the workflow minimal and focused on running tests; avoid heavy caching or matrix configuration until stable.
- If flaky tests are present, mark them in tests and file a follow-up issue rather than silencing failures in CI.

Testing and verification

- Create a PR with the workflow and verify it runs and passes on GitHub Actions for the commit that already passes locally.
- If the repository cannot run Actions in the current environment, run the same script locally or in a reproducible container to verify behavior.

Notes

This feature is achievable within this repository by adding the workflow file and does not require code changes to the library itself. The goal is to operationalise existing unit tests so the mission acceptance criteria for tests passing can be validated by automation.