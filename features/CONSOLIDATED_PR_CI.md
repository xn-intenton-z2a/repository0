# CONSOLIDATED_PR_CI

## Overview
Integrate the existing consolidated PR opener CLI command into the repository’s CI workflows so that a single pull request merging the HTTP server feature (issue #2188) and Diagnostics Mode feature (issue #2193) branches is created automatically.

## CI Behavior
- Add or update `.github/workflows/pr_opener.yml` to define a job `open_consolidated_pr`:
  • Trigger on `workflow_dispatch` and a daily schedule (cron: '0 0 * * *').
  • Declare dependency `needs: [build]` on existing build/test jobs.
  • Steps:
    1. Checkout repository: `actions/checkout@v3`.
    2. Set up Node.js v20: `actions/setup-node@v3` with `node-version: '20'`.
    3. Install dependencies: `npm install`.
    4. Run consolidated PR opener: `npm run open-prs-consolidated`.

## Verification
1. Push workflow changes and trigger `open_consolidated_pr` job manually or wait for schedule.
2. Confirm log sequence: `gh auth status`, `git checkout -b open-prs-http-diagnostics`, `gh pr create --title \"Merge HTTP server and diagnostics features\" --body \"- resolves #2188\n- resolves #2193\"`, and `Opened consolidated PR for HTTP server and diagnostics`.
3. Verify exit code 0 and that a new Pull Request appears on GitHub with the correct branch, title, and body.