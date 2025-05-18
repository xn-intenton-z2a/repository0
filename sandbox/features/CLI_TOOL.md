# CLI Tool Enhancements

# Options
1. --help                 : Display usage instructions and summary of available commands.
2. --version              : Print the package version from package.json.
3. --mission, -m          : Output the contents of MISSION.md.
4. --config <path>        : Read a JSON or YAML configuration file and output the parsed object as JSON.
5. --env                  : Load variables from a .env file and print key/value pairs as JSON.
6. --csv <path>           : Read and parse a CSV file using the synchronous csv-parse parser, then output an array of record objects as JSON.
7. --render <template> <data> : Render an EJS template with JSON or YAML data and print the rendered string to stdout.
8. echo <message>...      : Print any additional arguments passed after the echo command.

# Source File Changes
- In sandbox/source/main.js, import dotenv and the sync parser from csv-parse/sync alongside existing imports of minimist, fs, path, ejs, and js-yaml.
- Update argument dispatch in the main function to handle:
  - --config: resolve file path, read content, detect JSON or YAML by extension, parse accordingly, and console.log the resulting object.
  - --env: load environment variables using dotenv.config(), then console.log(process.env) filtered to loaded keys.
  - --csv: resolve CSV path, read file, parse with the sync CSV parser, and console.log the array of records.
  - --render: resolve template and data paths, read the files, parse data by extension, render via ejs.render, and console.log the result.
- Retain behavior for --help, --version, --mission, and default echo command.

# Tests
- Add fixture sandbox/tests/fixtures/sample.csv with a header row and sample records.
- Add sandbox/tests/csv.test.js to invoke main with --csv and verify JSON output matches expected records.
- Add render test in sandbox/tests/render.test.js to cover both JSON and YAML data as before.
- Add sandbox/tests/config.test.js to invoke main with --config for JSON and YAML fixtures and verify parsed output.
- Add sandbox/tests/env.test.js to create a temporary .env fixture, invoke main with --env, and verify printed environment variables.
- Ensure existing help, mission, version, and echo tests continue to pass unchanged.

# README Updates
- Update Usage section in sandbox/docs/README.md and top-level README.md to document all new options with examples:
  npm run start -- --config path/to/config.yaml
  npm run start -- --env
  npm run start -- --csv path/to/sample.csv
  npm run start -- --render path/to/template.ejs path/to/data.json
- Provide expected output snippets for each new option.

# Dependencies
- Ensure dotenv and csv-parse are listed under dependencies in package.json (dotenv may be added if missing).
- Verify ejs and js-yaml remain listed for rendering and YAML parsing.