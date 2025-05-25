# CONSOLIDATED_PR_CI

## Overview
Integrate the existing consolidated PR opener CLI command into the repository’s CI workflows so that a single pull request merging the HTTP server (issue #2188) and Diagnostics Mode (issue #2193) branches is created automatically. This streamlines final review and release tagging.

## CI Behavior
- Add or update `.github/workflows/pr_opener.yml` to define a job `open_consolidated_pr`:
  • Trigger on `workflow_dispatch` and a daily schedule (cron: '0 0 * * *').
  • Declare dependency `needs: [build]` on existing build and test jobs.
  • Steps:
    1. Checkout the repository using `actions/checkout@v3`.
    2. Set up Node.js using `actions/setup-node@v3` with `node-version: '20'`.
    3. Install dependencies with `npm install`.
    4. Run `npm run open-prs-consolidated` to invoke the consolidated PR opener CLI.

## Verification
1. Push workflow changes and trigger the `open_consolidated_pr` job manually or wait for schedule.
2. Confirm Actions logs include:
   - `gh auth status`
   - `git checkout -b open-prs-http-diagnostics`
   - `gh pr create --title "Merge HTTP server and diagnostics features" --body "- resolves #2188\n- resolves #2193"`
   - `Opened consolidated PR for HTTP server and diagnostics`
3. Verify exit code 0 and that a new Pull Request appears on GitHub with the correct branch, title, and body.
