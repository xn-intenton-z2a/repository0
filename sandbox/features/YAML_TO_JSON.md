# YAML to JSON Conversion Command

## Overview

The CLI will support a --yaml2json <yamlPath> [--output <outputPath>] option (alias -y) that:

1. Reads a YAML file from the given path using js-yaml
2. Parses the content into a JavaScript object
3. Converts the object into a formatted JSON string with two spaces indentation
4. Outputs the JSON to stdout or writes it to the specified output file

## Implementation Details

- Extend minimist setup to recognize yaml2json (string) with alias y and output (string) with alias o
- In main(), after existing commands, detect args.yaml2json and call a new convertYamlToJson handler
- Handler convertYamlToJson(yamlPath, outputPath) should:
  - Read yamlPath using fs.promises.readFile
  - Parse content using js-yaml.load
  - Serialize the object to JSON with two space indentation
  - If outputPath is provided, write the JSON to that file and exit with status 0
  - Otherwise, console.log the JSON and exit with status 0
  - On file read or parse errors, log error message to stderr and exit with status 1

## Testing

- Add tests in sandbox/tests/yaml-json.test.js covering:
  - Conversion of a valid YAML file to JSON on stdout
  - Writing JSON output to a file when --output is used
  - Handling of invalid YAML input with appropriate error message and exit code

## Documentation

- Update sandbox/docs/README.md to include the new command under Commands:
  --yaml2json <yaml> Convert YAML file to JSON printed to stdout
  -y <yaml> alias for --yaml2json
  --output <file> Write JSON output to the specified file