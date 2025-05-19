# JSON to YAML Conversion Command

## Overview

The CLI will support a --json2yaml <jsonPath> [--output <outputPath>] option (alias -j) that:

1. Reads a JSON file from the given path
2. Parses the JSON into a JavaScript object or array
3. Serializes the object to YAML using js-yaml with default settings
4. Outputs the YAML to stdout or writes it to the specified output file

## Implementation Details

- Extend minimist setup to recognize a json2yaml (string) option with alias j, and output (string) with alias o
- In main(), after existing commands, detect args.json2yaml and call a new convertJsonToYaml handler
- Handler convertJsonToYaml(jsonPath, outputPath) should:
  - Read the file at jsonPath using fs.promises.readFile
  - Parse the content with JSON.parse
  - Use js-yaml's dump method to convert the object to YAML
  - If outputPath is provided, write the YAML to that file and exit with status 0
  - Otherwise, console.log the YAML
  - On file read or parse errors, log an error message to stderr and exit with status 1

## Testing

- Add tests in sandbox/tests/json-yaml.test.js covering:
  - Conversion of a valid JSON file to YAML on stdout
  - Writing YAML output to a file when --output is used
  - Handling of invalid JSON input with appropriate error and exit code

## Documentation

- Update sandbox/docs/README.md to include the new command under Commands:
  --json2yaml <json> Convert JSON file to YAML printed to stdout
  -j <json> alias for --json2yaml
  --output <file> Write YAML output to the specified file