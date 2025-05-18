# CLI Tool Functionality

Add a set of standard command-line options to the main script to transform it into a user-friendly CLI that demonstrates core repository capabilities.

1. --help    : Display usage instructions and available commands.
2. --version : Print the package version from package.json.
3. --mission : Output the contents of MISSION.md to show repository mission.
4. --config <path> : Load configuration from the specified JSON or YAML file and output the parsed content in JSON format.
5. --env     : Load environment variables from a .env file using dotenv and output key/value pairs as JSON.
6. Default   : Echo the positional arguments in JSON format.

# Source File Changes

- Update src/lib/main.js to import the following modules:
  • minimist for option parsing
  • fs and path for file system operations
  • js-yaml to parse YAML files
  • dotenv to load .env files
- Implement a dispatch on parsed options:
  • If --help, print usage text and exit.
  • If --version, read package.json and print version.
  • If --mission, read MISSION.md and print contents.
  • If --config, resolve file path, read file contents, use js-yaml for YAML or JSON.parse for JSON, then console.log the resulting object.
  • If --env, call dotenv.config(), then console.log the resulting process.env subset.
  • Otherwise, console.log the positional arguments as JSON.

# Tests

- Extend tests/unit/main.test.js to cover each new option:
  • When invoked with --config against a sample JSON file, verify printed JSON matches expected object.
  • When invoked with --config against a sample YAML file, verify printed JSON matches expected object.
  • When invoked with --env given a prepared .env file, verify output contains the right key/value pairs.
  • Ensure existing tests for --help, --version, --mission, and default echo still pass.
- Add sample fixture files under sandbox/tests/fixtures/ for config.json, config.yaml, and .env.

# README Updates

- Update the Usage section to document the new CLI options with examples:
    npm run start -- --config config.json
    npm run start -- --config config.yaml
    npm run start -- --env
- Provide sample output for each new option.

# Dependencies

- Ensure js-yaml and dotenv are listed under dependencies (already present).
- No new dependencies required.