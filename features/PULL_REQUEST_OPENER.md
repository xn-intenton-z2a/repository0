# PULL_REQUEST_OPENER

## Overview
Provide a unified command and optional CI integration that automatically opens pull requests for completed features. This capability merges HTTP server and diagnostics feature branches either separately or in a single consolidated PR.

## Modes

### Separate PRs
- Flag: `--open-prs`
- For each issue (2188, 2193):
  - Authenticate with GitHub CLI (`gh auth status`).
  - Create branch `pr-<issue>`.
  - Run `gh pr create --title "Implement feature for issue #<issue>" --body "Resolves issue #<issue>"`.
  - Log `Opened PR for issue #<issue>` on success.
- On error: `console.error('PR opener error:', message)` and exit 1.
- On success: exit 0.

### Consolidated PR
- Flag: `--open-prs-consolidated`
- Authenticate with GitHub CLI.
- Create branch `open-prs-http-diagnostics`.
- Run `gh pr create --title "Merge HTTP server and diagnostics features" --body "- resolves #2188\n- resolves #2193"`.
- Log `Opened consolidated PR for HTTP server and diagnostics` on success.
- On error: `console.error('Consolidated PR error:', message)` and exit 1.
- On success: exit 0.

## CLI Usage
```
node src/lib/main.js --open-prs               # separate PRs
node src/lib/main.js --open-prs-consolidated  # single consolidated PR
```

## Tests
- Unit tests for `parseOpenPrsArg` and `parseConsolidatedPrArg`.
- Mocks for `openPrs` and `openConsolidatedPr` to verify command sequences and logs in both success and error cases.
- Integration tests for main invocation in both modes capturing logs and exit codes.

## Implementation Details
- In `src/lib/main.js`, export `parseOpenPrsArg`, `parseConsolidatedPrArg`, `openPrs`, and `openConsolidatedPr` using `child_process.exec`.
- In `main()`, detect flags first, wrap calls in `try/catch`, log or exit as specified.
- No new dependencies.