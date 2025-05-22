# PR_OPENER

## Overview
Provide a unified pull-request opener feature that supports both separate and consolidated modes via CLI flags and integrates into the CI workflow. Users can open individual pull requests for each feature issue or a single consolidated pull request merging the HTTP server and diagnostics features.

## Behavior

### Separate PR mode (--open-prs)
- Verifies GitHub CLI authentication by running `gh auth status`.
- For each issue in [2188, 2193]:
  • Creates branch `pr-<issue>` using `git checkout -b pr-<issue>`
  • Opens a pull request: `gh pr create --title "Implement feature for issue #<issue>" --body "Resolves issue #<issue>"`
  • On success logs `Opened PR for issue #<issue>`
- On error logs `PR opener error: <message>` to stderr and exits with code 1
- On success exits with code 0

### Consolidated PR mode (--open-prs-consolidated)
- Verifies GitHub CLI authentication by running `gh auth status`.
- Creates branch `open-prs-http-diagnostics` with `git checkout -b open-prs-http-diagnostics`.
- Opens a single pull request: `gh pr create --title "Merge HTTP server and diagnostics features" --body "- resolves #2188\n- resolves #2193"`
- On success logs `Opened consolidated PR for HTTP server and diagnostics`
- On error logs `Consolidated PR error: <message>` to stderr and exits with code 1
- On success exits with code 0

## CI Integration
Add a CI job `open_consolidated_pr` in `.github/workflows/pr_opener.yml` that runs after build and test:
```yaml
jobs:
  open_consolidated_pr:
    runs-on: ubuntu-latest
    needs: [build]
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
This will automate creation of the branch and PR merging both feature branches.

## Tests
- Unit tests for flag parsing:
  • `parseOpenPrsArg([])` → false; `parseOpenPrsArg(["--open-prs"])` → true
  • `parseConsolidatedPrArg([])` → false; `parseConsolidatedPrArg(["--open-prs-consolidated"])` → true
- Unit tests for `openPrs()` and `openConsolidatedPr()` mocking `child_process.exec`:
  • Verify sequence of CLI commands and correct success logs
  • Simulate errors and assert error logs and exit code 1
- Integration tests for `main(["--open-prs"])` and `main(["--open-prs-consolidated"])`:
  • Stub `exec` and `process.exit`, capture logs and exit codes for both success and error scenarios

## Implementation Details
- In `src/lib/main.js`, export and implement:
  • `parseOpenPrsArg(args: string[]): boolean`
  • `parseConsolidatedPrArg(args: string[]): boolean`
  • `openPrs(): Promise<void>` and `openConsolidatedPr(): Promise<void>` using `child_process.exec`
  • Wrap invocations in `main(args)` with `try/catch` to handle errors and exit codes
- Update `package.json` scripts:
  ```json
  "open-prs": "node src/lib/main.js --open-prs",
  "open-prs-consolidated": "node src/lib/main.js --open-prs-consolidated"
  ```