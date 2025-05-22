# PR_OPENER

## Overview
Extend and refine the pull request opener feature to automate creation of both individual and consolidated pull requests for the HTTP server and diagnostics features. The CLI will handle separate PRs for each issue or a single PR that merges both features, with clear usage guidance and error handling.

## Behavior
### Separate PR mode (`--open-prs`)
- Verify GitHub CLI authentication via `gh auth status`.
- For each issue in [2188, 2193]:
  • Create branch `pr-<issue>` using `git checkout -b pr-<issue>`.
  • Run `gh pr create --title "Implement feature for issue #<issue>" --body "Resolves issue #<issue>"`.
  • On success, log `Opened PR for issue #<issue>`.
- Exit with code 0 if all succeed; on any error log `PR opener error: <message>` and exit code 1.

### Consolidated PR mode (`--open-prs-consolidated`)
- Verify GitHub CLI authentication via `gh auth status`.
- Create branch `open-prs-http-diagnostics` using `git checkout -b open-prs-http-diagnostics`.
- Run `gh pr create --title "Merge HTTP server and diagnostics features" --body "- resolves #2188\n- resolves #2193"`.
- On success, log `Opened consolidated PR for HTTP server and diagnostics`.
- Exit with code 0 on success; on error log `Consolidated PR error: <message>` and exit code 1.

### Common CLI Details
- Mutually exclusive checks for `--open-prs`, `--open-prs-consolidated`, `--mission`, `--diagnostics`, `--serve`, `--help`.
- Provide `--help` usage output and enforce correct flag precedence.

## CLI Usage
```bash
node src/lib/main.js --open-prs               # opens separate PRs for issues 2188 and 2193
node src/lib/main.js --open-prs-consolidated  # opens a consolidated PR for both issues
``` 

## Tests
- Unit tests for `parseOpenPrsArg` and `parseConsolidatedPrArg` flag detection.
- Unit tests for `openPrs` and `openConsolidatedPr` mocking `child_process.exec`:
  • Verify command sequence and success logs.
  • Simulate errors and assert error logs and exit code 1.
- Integration tests for `main(["--open-prs"])` and `main(["--open-prs-consolidated"])`: stub `exec` and `process.exit`, capture logs and exit codes.

## Implementation Details
- In `src/lib/main.js`, export `parseOpenPrsArg`, `parseConsolidatedPrArg`, `openPrs`, `openConsolidatedPr` using Node’s built-in `child_process.exec`.
- Wrap invocations in `try/catch` within `main(args)` to handle errors and exit codes.
- Update `package.json` scripts: add `open-prs` and `open-prs-consolidated` entries.
