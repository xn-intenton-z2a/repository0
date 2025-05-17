# Format Conversion

# CLI Behavior

Add a new command convert to handle bidirectional conversions between .env format, YAML, and JSON. By default it detects the input file extension and converts:

- From .env to JSON
- From .yaml or .yml to JSON

Use flags to override direction:

--to-env       Convert JSON to dotenv format
--to-yaml      Convert JSON to YAML format

The command writes the result to stdout or to a file when an --output flag is provided.

Usage:

npm run start -- convert <inputFile> [--to-env] [--to-yaml] [--output <outputFile>]

# File Modifications

- sandbox/source/main.js: import dotenv and js-yaml, add a convert case in the CLI switch. Read the input file using fs/promises, determine conversion direction based on file extension or flags. When converting to JSON parse .env files with dotenv.parse, parse YAML files with jsYaml.load, and parse JSON with JSON.parse. When converting to .env serialize key/value pairs as KEY=VALUE lines. When converting to YAML use jsYaml.dump. Handle the --output flag to write the result to the specified path or print to stdout.

- sandbox/tests/convert.test.js: create feature-level tests covering each conversion direction (env→JSON, JSON→env, yaml→JSON, JSON→yaml), verify correct parsing and serialization, test with --output to write a file, and assert file contents match expectations.

- README.md: update the CLI Usage section to document the convert command with examples demonstrating default behavior, --to-env, --to-yaml, and --output flag.

- package.json: verify that dotenv and js-yaml remain listed as dependencies (no new dependencies required).

# Testing

Add tests to verify:

- Converting a .env file yields valid JSON with correct key/value pairs
- Converting a JSON file with --to-env produces a dotenv formatted string where each line is KEY=VALUE
- Converting a YAML file produces valid JSON mirroring the original data structure
- Converting a JSON file with --to-yaml produces valid YAML syntax reflecting the original data
- The --output flag writes the converted result to the specified file path correctly