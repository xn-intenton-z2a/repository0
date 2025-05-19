# YAML to JSON Conversion

This feature adds a new CLI command to convert YAML files into JSON format. It reads a YAML file from a specified path, parses it into a JavaScript object, and outputs a formatted JSON string either to stdout or to a user-specified file.

# Usage

--yaml2json <yamlPath> [--output <file>]

the user provides the path to an input YAML file. if the --output option is provided, the JSON result is written to the given file; otherwise it is printed to stdout. alias -y for --yaml2json.

# Implementation

import the js-yaml library. implement a convertYamlToJson function that:

1. reads the YAML file from the file system.
2. parses the YAML text using yaml.load, handling parse errors with exit code 1.
3. serializes the parsed data to JSON with 2-space indentation using JSON.stringify.
4. writes the JSON to stdout or to the output file path.

update the CLI dispatch in main to recognize --yaml2json and alias -y, calling convertYamlToJson. handle errors for missing files, invalid YAML, and write failures with appropriate exit codes and error messages.

# Tests

add unit and e2e tests in sandbox/tests:
- valid YAML mapping to JSON object conversion.
- YAML sequences and nested structures converted correctly.
- missing YAML path triggers error exit.
- invalid YAML triggers parse error exit.
- JSON output written correctly when --output is specified.
- alias -y for --yaml2json works the same.
