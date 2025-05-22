# PULL_REQUEST_CLI_INTEGRATION

## Overview

Extend the CI workflows to automatically open a consolidated pull request that merges the completed HTTP server (issue #2188) and Diagnostics mode (issue #2193) feature branches. This leverages the existing `--open-prs-consolidated` CLI command and integrates it into GitHub Actions.

## Behavior

- Define a new CI job `open_consolidated_pr` in `.github/workflows/pr_opener.yml`:
  - Trigger on `workflow_dispatch` and on a daily schedule (e.g., `0 0 * * *`).
  - Declare dependency on existing build and test jobs (`needs: [build]`).
  - Steps:
    1. Checkout the repository using `actions/checkout@v3`.
    2. Set up Node.js using `actions/setup-node@v3` with `node-version: '20'`.
    3. Install dependencies with `npm install`.
    4. Run the CLI command `npm run open-prs-consolidated`.

- The CLI will:
  1. Authenticate with the GitHub CLI (`gh auth status`).
  2. Create branch `open-prs-http-diagnostics`.
  3. Open a pull request with:
     ```bash
     gh pr create \
       --title "Merge HTTP server and diagnostics features" \
       --body "- resolves #2188\n- resolves #2193"
     ```
  4. Log `Opened consolidated PR for HTTP server and diagnostics` on success.
  5. Exit with code 0 on success, or print an error and exit with code 1 on failure.

## Verification

1. Push the updated workflow file to a feature branch.
2. Trigger the `open_consolidated_pr` job manually or wait for the scheduled run.
3. Confirm logs show the sequence:
   - `gh auth status`
   - `git checkout -b open-prs-http-diagnostics`
   - `gh pr create --title "Merge HTTP server and diagnostics features" ...`
   - `Opened consolidated PR for HTTP server and diagnostics`
4. Verify the pull request appears on GitHub with correct branch, title, and body resolving issues #2188 and #2193.