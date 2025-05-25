# Overview
This feature adds a JSON flattening capability to the CLI tool, enabling users to take deeply nested JSON structures and output flattened JSON objects. Flattened objects use a configurable delimiter to join nested key paths, facilitating downstream processing or ingestion into data pipelines for knowledge graph construction.

# CLI Options
--flatten                Activates the JSON flattening mode.
--input-file <path>      Optional path to read JSON from a file. Defaults to reading from stdin.
--output-format <fmt>    Specifies the output format: json or ndjson. Defaults to json.
--key-delimiter <char>   Character to use for joining nested keys. Defaults to '.'.
--preserve-arrays        If set, arrays are left as arrays; otherwise, array values are flattened with indices in key paths.
--timeout <ms>           Optional fetch timeout in milliseconds when used together with --source-url. Inherited from PUBLIC_DATA_CRAWLER. Defaults to 5000.

# Implementation Details
1. Extend src/lib/main.js to recognize the --flatten flag and associated options.
2. Implement a recursive flattenObject function that takes an object, a delimiter, and a flag for array preservation. Nested keys are joined into single-level property names.
3. In flatten mode, read input JSON from the specified file or stdin, parse it into an object or array of objects.
4. For each object, apply flattenObject and collect flattened results.
5. Serialize output according to the chosen format: a single JSON array when format=json, or newline-delimited JSON objects when format=ndjson.
6. Maintain existing functionality for PUBLIC_DATA_CRAWLER and other CLI options, merging behavior when both source-url and flatten are used.
7. Handle errors (file I/O, invalid JSON) with clear messages and non-zero exit codes.

# Testing
- Unit tests for flattenObject: nested objects, mixed arrays, empty objects, custom delimiters, array preservation.
- CLI integration tests: invoke main with --flatten and --input-file, capture stdout for both json and ndjson formats.
- Error handling tests: invalid JSON input, missing input file, invalid delimiter values.
- Ensure backward compatibility tests: PUBLIC_DATA_CRAWLER without --flatten remains unchanged.