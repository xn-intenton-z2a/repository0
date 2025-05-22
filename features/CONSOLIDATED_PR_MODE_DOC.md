# CONSOLIDATED_PR_MODE_DOC

## Overview
Add the consolidated pull request mode to the main README CLI Usage section so users can discover and use the --open-prs-consolidated command.

## Changes in README.md
- Under **CLI Usage**, immediately after the **PR opener mode** subsection, insert a **Consolidated PR mode** subsection:
  ```bash
  ### Consolidated PR mode
  ```bash
  npm run open-prs-consolidated  # or node src/lib/main.js --open-prs-consolidated
  ```
  Opens a single consolidated pull request resolving issues #2188 and #2193.

- Verify that the **Links to Detailed Docs** section still lists:
  - [PR Opener](docs/PR_OPENER.md)
  without altering other links.

## Verification
1. Open README.md and confirm the **Consolidated PR mode** section appears with the correct heading, code snippet, and description.
2. Run `npm run open-prs-consolidated` or `node src/lib/main.js --open-prs-consolidated` locally (with stubbed or real GH CLI) to ensure the usage example matches the documented command.
