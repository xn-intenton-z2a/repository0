# PR_OPENING

## Overview
Provide a unified command and CI integration for opening both separate and consolidated pull requests for HTTP server (issue 2188) and Diagnostics mode (issue 2193). Users can choose to open individual PRs per feature or a single merged PR via CLI flags or automated CI.

## Behavior
- CLI accepts:
  • --open-prs: open separate PRs for each issue 2188 and 2193
  • --open-prs-consolidated: open a single consolidated PR merging both features
- Each mode:
  • Verifies GitHub CLI authentication (gh auth status)
  • Creates branches (pr-2188, pr-2193 or open-prs-http-diagnostics)
  • Runs `gh pr create` with appropriate title and body
  • Logs success messages or prints clear error messages and exits with code 1 on failure
- All other flags (--mission, --diagnostics, --serve, --help) remain available and unchanged

## CLI Usage
- `npm run open-prs` or `node src/lib/main.js --open-prs`
- `npm run open-prs-consolidated` or `node src/lib/main.js --open-prs-consolidated`

## CI Integration
Add a job `open_consolidated_pr` in .github/workflows/pr_opener.yml:
```yaml
jobs:
  open_consolidated_pr:
    runs-on: ubuntu-latest
    needs: [build]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with: {node-version: '20'}
      - run: npm install
      - run: npm run open-prs-consolidated
```
