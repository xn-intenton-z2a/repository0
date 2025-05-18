# CLI Tool Functionality

Enhance the main script to support a new CSV parsing option along with existing commands.

# Options
1. --help    : Display usage instructions and available commands.
2. --version : Print the package version from package.json.
3. --mission : Output the contents of MISSION.md.
4. --config <path> : Load configuration from the specified JSON or YAML file and output parsed result.
5. --env     : Load environment variables from a .env file and output key/value pairs as JSON.
6. --csv <path> : Read the specified CSV file, parse records using csv-parse, and output the result as a JSON array.
7. Default   : Echo the positional arguments in JSON format.

# Source File Changes
- Import the sync parser from csv-parse/sync alongside minimist, fs, path, dotenv, and js-yaml.
- Detect the --csv option in argument dispatch:
  - Resolve the CSV file path, read its content, parse using the sync CSV parser, then console.log the resulting array of record objects.
- Retain existing behavior for --help, --version, --mission, --config, --env, and default echo.

# Tests
- Add fixture file sandbox/tests/fixtures/sample.csv containing comma separated values with header row.
- Create sandbox/tests/csv.test.js:
  • When main is invoked with --csv against the sample.csv fixture, capture stdout and verify it prints the expected JSON array of records.
  • Ensure that invoking with other options still produces correct output and existing tests continue to pass.

# README Updates
- Update Usage section to document --csv option with example:
  npm run start -- --csv sandbox/tests/fixtures/sample.csv
- Provide sample output snippet showing a JSON array of records.

# Dependencies
- Ensure csv-parse is listed under dependencies in package.json (already present).