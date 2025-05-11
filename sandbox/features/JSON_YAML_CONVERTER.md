# Overview
Add two new CLI commands to convert data between JSON and YAML formats. Leverage the existing js-yaml dependency to parse and serialize documents, enabling seamless round-trip conversion suitable for configuration files, data exchange, and documentation.

# CLI Usage

json2yaml <input.json> [-o <output.yaml>]
- `<input.json>` is the path to a JSON file to convert.
- Optional `-o <output.yaml>` writes the YAML output to the specified file; otherwise YAML is written to stdout.

yaml2json <input.yaml> [-o <output.json>]
- `<input.yaml>` is the path to a YAML file to convert.
- Optional `-o <output.json>` writes the JSON output to the specified file; otherwise JSON is written to stdout.

# Implementation Details
1. Extend main(args) in sandbox/source/main.js to detect the commands json2yaml and yaml2json.
2. Parse the positional input path and optional `-o` flag with minimist (alias o for output).
3. Read the input file asynchronously using fs/promises readFile.
4. For json2yaml:
   - Parse the file content with JSON.parse.
   - Serialize to YAML using jsYaml.dump.
5. For yaml2json:
   - Parse the file content with jsYaml.load.
   - Serialize to JSON with JSON.stringify(..., null, 2).
6. Write the serialized output to the output path if provided, else to stdout.
7. Use exit code 0 on success and non-zero on file I/O or parsing errors, printing descriptive messages to stderr.

# File Changes
- sandbox/source/main.js: Add dispatch and implementation for json2yaml and yaml2json commands, argument parsing, file I/O, and format conversion logic.
- package.json: Ensure js-yaml remains listed in dependencies (no new packages required).
- sandbox/tests/json-yaml.test.js: Create unit tests covering valid conversions, missing input, invalid syntax, file output, and stdout behavior.
- sandbox/docs/README.md: Document the new json2yaml and yaml2json commands under CLI Usage with examples.