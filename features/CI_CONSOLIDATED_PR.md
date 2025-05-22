# CI_CONSOLIDATED_PR

## Overview
Integrate the existing consolidated PR opener CLI command into the repository’s CI workflows. This enables automated creation of a single pull request that merges both the HTTP server feature (issue #2188) and the Diagnostics Mode feature (issue #2193).

## Behavior
- Add a new CI job named `open_consolidated_pr` in the `.github/workflows/pr_opener.yml` file.
- The job runs after build and test jobs complete, on manual trigger or schedule.
- Steps:
  1. Checkout the repository.
  2. Set up Node.js (version 20).
  3. Install dependencies (`npm install`).
  4. Run `npm run open-prs-consolidated` to invoke the CLI and open a consolidated PR.
- The CLI will:
  - Authenticate with GitHub CLI (`gh auth status`).
  - Create branch `open-prs-http-diagnostics`.
  - Run `gh pr create --title "Merge HTTP server and diagnostics features" --body "- resolves #2188\n- resolves #2193"`.
  - Log `Opened consolidated PR for HTTP server and diagnostics` on success.
  - Exit with code 0 or print an error and exit with code 1 on failure.

## CI Workflow Example
```yaml
name: PR Opener
on:
  workflow_dispatch:
  schedule:
    - cron: '0 0 * * *'
jobs:
  build:
    # existing build and test jobs
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