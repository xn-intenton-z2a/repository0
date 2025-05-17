# Overview
Enhance the main CLI entry point to include a repository summary command, giving users a concise overview of key project metadata alongside existing flags.

# Behavior
When the CLI is invoked with the following flags, it should exhibit these behaviors:

- `--help`    : Display usage instructions and available flags.
- `--version` : Read and display the version field from package.json.
- `--mission` : Read and display the full mission statement from MISSION.md.
- `--summary` : Analyze core repository files and output a structured summary including:
  - Total number of dependencies and devDependencies.
  - Count of defined npm scripts.
  - Number of source files under src/lib.
  - Number of test files under tests/unit and sandbox/tests.
  - Number of GitHub workflow files in .github/workflows.
- No recognized flag  : Fall back to echoing provided arguments as before.

# Implementation Details
1. Update src/lib/main.js:
   - Import `fs/promises`, `fileURLToPath`, `path`, and `url` utilities alongside `minimist`.
   - After parsing flags with minimist, add a `--summary` branch:
     1. Load and parse package.json to count dependencies, devDependencies, and scripts.
     2. Recursively list `.js` files in `src/lib` and both test directories, counting entries.
     3. List YAML files under `.github/workflows` to count workflow definitions.
     4. Format and print a multi-line summary report to stdout.
2. Update unit tests in tests/unit/main.test.js and add sandbox/tests/summary.test.js:
   - Test that `main(["--summary"])` prints lines containing expected headings and counts matching a sample fixture.
   - Preserve existing tests for help, version, mission, and echo behavior.
3. Update README.md:
   - Add a section for the summary flag with usage example:
     `npm run start -- --summary`
   - Include sample output snippet showing a formatted repository summary.
4. Ensure all new code adheres to ESM standards, Node 20 compatibility, and passes lint/format checks.