sandbox/features/FUNCTION_PLOT.md
# sandbox/features/FUNCTION_PLOT.md
# Overview

This feature adds mathematical function plotting capabilities to the CLI. It enables users to generate simple SVG plots for quadratic and sine functions over a predefined range, demonstrating how the template can be extended with real functionality.

# Behavior

- When no flags are provided, the CLI prints a help message describing available options and exits with code 0.
- Users can specify the function to plot using the `--function` flag with values `quadratic` or `sine`.
- Users can specify an output file path using the `--output` flag; defaults to `plot.svg` in the current directory.
- The CLI generates an SVG file containing the graph of the selected function over the range [-10, 10] with axes, written to the specified output path.

# Implementation Details

- In `src/lib/main.js`:
  - Parse flags using `minimist` for `function` and `output`.
  - Validate that the function name is either `quadratic` or `sine`; exit with an error code and message on invalid input.
  - Generate SVG markup using string templates: draw axes and a polyline representing y = x^2 or y = sin(x) scaled to fit a 500x300 viewBox.
  - Use the built-in `fs` module to write the SVG content to the specified file path.

- No new dependencies are required; `fs` is part of Node.js.

# CLI Usage

- Display help:
  npm run start

- Plot a quadratic function:
  npm run start -- --function quadratic --output quadratic.svg

- Plot a sine function:
  npm run start -- --function sine --output sine.svg

# Tests

- In `tests/unit/main.test.js`:
  - Stub `fs.writeFileSync` to capture output instead of writing to disk.
  - Invoke `main` with valid flags for `quadratic` and `sine`, and assert that the resulting SVG string includes `<svg`, `polyline`, and correct numeric values for function data.
  - Verify that invoking `main` without flags prints the help message and exits without error.
  - Verify that invalid `--function` values cause the process to exit with a descriptive error message.

# Documentation

- Update `README.md`:
  - Add a section “Function Plotting” describing the new feature and showing example commands.
  - Document the SVG output format and default output path.
sandbox/features/CONVERSION_RATE_RESEED.md
# sandbox/features/CONVERSION_RATE_RESEED.md
# Overview

This feature enhances how the repository demonstrates agentic-lib’s automated CI/CD workflows alongside updating and showcasing an improved issue-to-code conversion rate. It builds on the existing conversion rate override functionality and adds a CLI-driven summary of recent workflow executions to highlight the end-to-end automation flow.

# Behavior

- The default issue-to-code conversion rate is increased from 0.75 to 0.8.
- Users can still override the conversion rate via the `--rate` flag or `ISSUE_TO_CODE_CONVERSION_RATE` environment variable, with the CLI flag taking precedence.
- When `npm run start` is executed, the application:
  - Prints the applied conversion rate.
  - Fetches and prints a summary of the last successful runs of key agentic-lib workflows: Create Issue, Issue Worker, Automerge, and Review Issue.
  - Exits with code 0 after displaying the summary.

# Implementation Details

- Update `config.issueToCodeConversionRate` in `package.json` to 0.8.
- In `src/lib/main.js`:
  - Parse `--rate` flag using minimist and fall back to `process.env.ISSUE_TO_CODE_CONVERSION_RATE` or default rate.
  - Validate that the rate is a number between 0 and 1, exiting with an error on invalid input.
  - Use the GitHub Actions REST API (via the `@octokit/rest` library) to fetch the latest workflow runs for workflows named Create Issue, Issue Worker, Automerge, Review Issue on the current repository and branch.
  - Format and display a summary table including workflow name, status, conclusion, and run date.
- Add `@octokit/rest` to dependencies in `package.json`.

# CLI Usage

- Default: `npm run start`
- Override rate: `npm run start -- --rate 0.9`
- Override via environment: `ISSUE_TO_CODE_CONVERSION_RATE=0.85 npm run start`

# Tests

- In `tests/unit/main.test.js`:
  - Verify default rate output is 0.8 when no override.
  - Verify rate override by CLI flag and environment variable.
  - Stub GitHub API calls to return a fixed workflow run list and assert that the summary table is printed correctly.
  - Ensure invalid rate values exit with an error and descriptive message.

# Documentation

- Update `README.md`:
  - Document the new default rate and override options.
  - Add a new section “CI/CD Workflows Demonstration” showing sample output of the workflow summary.
  - Include instructions on setting a `GITHUB_TOKEN` environment variable for fetching workflow runs.
