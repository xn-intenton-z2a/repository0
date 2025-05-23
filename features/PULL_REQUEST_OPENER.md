# PULL_REQUEST_OPENER

## Overview
Provide a unified pull-request opener CLI feature that supports both separate and consolidated modes via flags and integrates into CI workflows. Users can open individual pull requests per feature issue or a single consolidated pull request merging the HTTP server and diagnostics features.

## Behavior

### Separate PR mode (`--open-prs`)
- Verifies GitHub CLI authentication by running gh auth status
- For each issue in [2188, 2193]:
  • Create branch pr-<issue> via git checkout -b pr-<issue>
  • Run gh pr create --title "Implement feature for issue #<issue>" --body "Resolves issue #<issue>"
  • On success, log Opened PR for issue #<issue>
- On error: log PR opener error: <message> to stderr and exit code 1
- On success: exit code 0

### Consolidated PR mode (`--open-prs-consolidated`)
- Verifies GitHub CLI authentication by running gh auth status
- Create branch open-prs-http-diagnostics via git checkout -b open-prs-http-diagnostics
- Run gh pr create --title "Merge HTTP server and diagnostics features" --body "- resolves #2188\n- resolves #2193"
- On success, log Opened consolidated PR for HTTP server and diagnostics
- On error: log Consolidated PR error: <message> to stderr and exit code 1
- On success: exit code 0

## CLI Usage
```bash
npm run open-prs               # or node src/lib/main.js --open-prs
npm run open-prs-consolidated  # or node src/lib/main.js --open-prs-consolidated
```

## CI Integration
Add or update .github/workflows/pr_opener.yml to include a new job open_consolidated_pr that runs after build and test jobs and invokes `npm run open-prs-consolidated` to automate opening a consolidated PR.

## Tests
- Unit tests for parseOpenPrsArg and parseConsolidatedPrArg flag detection
- Unit tests for openPrs and openConsolidatedPr mocking child_process.exec to verify command sequence, success logs, and error handling
- Integration tests for main(["--open-prs"]) and main(["--open-prs-consolidated"]) stubbing exec and process.exit to capture logs and exit codes

## Implementation Details
- In src/lib/main.js export and implement:
  • parseOpenPrsArg(args: string[]): boolean
  • parseConsolidatedPrArg(args: string[]): boolean
  • openPrs(): Promise<void> and openConsolidatedPr(): Promise<void> using child_process.exec
  • Wrap calls in main(args) with try/catch for clear success and error exit codes
- Update package.json scripts with open-prs and open-prs-consolidated entries