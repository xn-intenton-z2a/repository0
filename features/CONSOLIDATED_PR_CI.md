# CONSOLIDATED_PR_CI

## Overview
Integrate the consolidated PR opener mode into the CI workflow by adding a dedicated job that invokes the existing `--open-prs-consolidated` CLI command. This automates creation of a single branch and pull request that merges HTTP server (#2188) and diagnostics (#2193) feature branches.

## CI Behavior
- Define a new job `open_consolidated_pr` in `.github/workflows/pr_opener.yml`.
- Trigger on `workflow_dispatch` and a daily schedule (e.g., `0 0 * * *`).
- Require successful completion of existing build and test jobs (`needs: [build]`).
- Steps:
  - Checkout the repository using `actions/checkout@v3`.
  - Set up Node.js using `actions/setup-node@v3` with `node-version: '20'`.
  - Run `npm install` to install dependencies.
  - Run `npm run open-prs-consolidated` to trigger the consolidated PR opener CLI.

## Verification
1. After pushing the updated workflow, manually trigger or await the scheduled run.
2. Inspect the Actions log for commands:
   - `gh auth status`
   - `git checkout -b open-prs-http-diagnostics`
   - `gh pr create --title "Merge HTTP server and diagnostics features" --body "- resolves #2188\n- resolves #2193"`
   - `Opened consolidated PR for HTTP server and diagnostics`
3. Confirm exit code `0` and verify the new pull request on GitHub targets `open-prs-http-diagnostics` with correct title and body.