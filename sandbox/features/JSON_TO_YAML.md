# JSON to YAML Conversion

This feature adds a new CLI command to convert JSON files into YAML format. It reads a JSON file from a specified path, parses it into a JavaScript object, and outputs YAML with proper indentation either to stdout or to a user-specified file.

# Usage

--json2yaml <jsonPath> [--output <file>]

The user provides the path to an input JSON file. If the --output option is provided, the YAML result is written to the given file; otherwise it is printed to stdout.

# Implementation

Import js-yaml library. Implement a convertJsonToYaml function that:
1. Reads the JSON file from the file system.
2. Parses the JSON text into an object, handling parse errors with exit code 1.
3. Serializes the object to YAML using yaml.dump with 2-space indentation and no document start marker.
4. Writes the YAML to stdout or to the output file path.
Handle errors for missing files, invalid JSON, or write failures with appropriate exit codes and error messages.
Extend the CLI dispatch in main to recognize --json2yaml and alias -j, calling convertJsonToYaml.

# Tests

Add unit and E2E tests in sandbox/tests:
- Valid JSON with object converting to YAML sequence and mappings.
- JSON arrays and nested structures converted correctly.
- Missing JSON path triggers error exit.
- Invalid JSON triggers parse error exit.
- YAML output written correctly when --output is specified.
- Alias -j for --json2yaml works the same.