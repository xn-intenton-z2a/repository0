# Summary

Implement a yaml-validate command to parse and validate YAML files and emit JSON representation or errors via the CLI.

# Behavior

* When run with yaml-validate and one or more file paths, read each file.
* If a file contains valid YAML, serialize the parsed data to JSON and print the JSON to stdout.
* If a file cannot be read, print an error to stderr with the filename and exit with code 1.
* If a file contains invalid YAML, print the parse error to stderr and exit with code 1.
* When run with no file paths or with help, display usage instructions.

# Implementation

1. In src/lib/main.js import fs/promises and yaml from js-yaml.
2. Add a yaml-validate entry in the command router mapping.
3. In the handler, iterate over the provided file paths, read file content, and call yaml.load on the content.
4. Assemble the result or results and print the JSON string to stdout.
5. Catch file read or parse errors, print the error to stderr, and exit with code 1.

# Tests

* main(["yaml-validate","valid.yaml"]) prints the JSON representation of the file to stdout.
* main(["yaml-validate","missing.yaml"]) prints an error for missing file and exits with code 1.
* main(["yaml-validate","invalid.yaml"]) prints a parse error and exits with code 1.
* main(["yaml-validate"]) prints usage instructions and exits with code 1.

# Documentation

* Update README.md to include a Usage section for the yaml-validate command with examples.
* Add an entry for yaml-validate in the CLI reference section.