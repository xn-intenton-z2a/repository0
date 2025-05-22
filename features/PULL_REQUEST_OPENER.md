# PR_OPENER

## Overview
Provide a unified pull-request opener CLI feature that automates creating both individual and consolidated pull requests for the HTTP server and diagnostics features. This feature handles separate PRs per issue and a single consolidated PR, with clear usage, error handling, and CI integration.

## Behavior

### Separate PR mode (`--open-prs`)
- Verify GitHub CLI authentication by running `gh auth status`.
- For each issue in [2188, 2193]:
  • Create branch `pr-<issue>` via `git checkout -b pr-<issue>`.
  • Run `gh pr create --title "Implement feature for issue #<issue>" --body "Resolves issue #<issue>"`.
  • Log `Opened PR for issue #<issue>` on success.
- On error: log `PR opener error: <message>` to stderr and exit code 1.
- On success: exit code 0.

### Consolidated PR mode (`--open-prs-consolidated`)
- Verify GitHub CLI authentication by running `gh auth status`.
- Create branch `open-prs-http-diagnostics` via `git checkout -b open-prs-http-diagnostics`.
- Run `gh pr create --title "Merge HTTP server and diagnostics features" --body "- resolves #2188\n- resolves #2193"`.
- Log `Opened consolidated PR for HTTP server and diagnostics` on success.
- On error: log `Consolidated PR error: <message>` to stderr and exit code 1.
- On success: exit code 0.

## CLI Usage
```bash
npm run open-prs               # or node src/lib/main.js --open-prs
npm run open-prs-consolidated  # or node src/lib/main.js --open-prs-consolidated
```

## CI Integration
Add a job `open_consolidated_pr` in `.github/workflows/pr_opener.yml` that runs after build and test jobs:
```yaml
jobs:
  open_consolidated_pr:
    needs: [build]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm install
      - name: Open consolidated PR for HTTP server and diagnostics
        run: npm run open-prs-consolidated
```

## Tests
- Unit tests for `parseOpenPrsArg` and `parseConsolidatedPrArg` flag detection.
- Unit tests for `openPrs()` and `openConsolidatedPr()` mocking `child_process.exec`:
  • Verify command sequence and success logs.
  • Simulate errors and assert error logs and exit code 1.
- Integration tests for `main(["--open-prs"])` and `main(["--open-prs-consolidated"])`:
  • Stub `exec` and `process.exit`, capture logs and exit codes in success and failure scenarios.

## Implementation Details
- In `src/lib/main.js` export and implement:
  • `parseOpenPrsArg`, `parseConsolidatedPrArg` to detect flags.
  • `openPrs()`, `openConsolidatedPr()` using `child_process.exec`.
  • Wrap calls in `main(args)` with `try/catch` for clear errors and exit codes.
- Update `package.json` scripts:
```json
"open-prs": "node src/lib/main.js --open-prs",
"open-prs-consolidated": "node src/lib/main.js --open-prs-consolidated"
```