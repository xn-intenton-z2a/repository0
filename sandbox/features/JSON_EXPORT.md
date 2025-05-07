# Overview

This feature adds the ability to export computed plot data in JSON format. It complements existing CSV data export and HTML report features by providing a native JSON output. The feature extends the main library module, CLI, README, and unit tests to support JSON data export alongside existing SVG, CSV, and HTML outputs.

# Functionality

- Introduce function generateJsonForFunction(functionDefinition, options) that:
  - Samples the function over the specified domain using the existing generateDataPoints function or similar sampling logic.
  - Returns a JSON string representing an array of objects, each with x and y properties for each sampled point.
- Programmatic usage:
  - Export generateJsonForFunction from the main module alongside other data export functions.
- CLI integration:
  - Add a new flag --export-json=<file> to src/lib/main.js. When provided, the CLI writes the JSON string to the specified file instead of producing an SVG or CSV output.

# API

Exported function: generateJsonForFunction(functionDefinition, options)

- functionDefinition: a callback f(x) returning y.
- options: object with:
  - minX: number (inclusive lower bound).
  - maxX: number (inclusive upper bound).
  - steps: integer (number of sample points).
- returns: string containing a valid JSON array of objects with x and y keys.

# CLI Behavior

Extend src/lib/main.js to parse new flag:
- --export-json=<file> where <file> is the output path for the JSON report.

When invoked with:
  npm run start -- type quadratic 1 0 0 -10 10 200 --export-json data.json
The CLI will:
- Parse function type and parameters.
- Call generateJsonForFunction with the provided options.
- Write the resulting JSON string to data.json, creating or overwriting the file.

If --export-json is omitted, existing behavior for SVG plotting, CSV export, and HTML report remains unchanged.

# Testing

- Unit tests for generateJsonForFunction:
  - Validate that the returned string is valid JSON and parses to an array of the correct length.
  - Verify that for a simple function, e.g. f(x) = x, the array contains expected x and y values in proper order.
- CLI integration tests:
  - Simulate process.argv including --export-json flag and capture file output.
  - Verify that the file exists and contains a valid JSON array matching the sampled data.

# README Updates

- Document the new generateJsonForFunction API and its options under the API reference section.
- Provide CLI usage examples for exporting JSON data, including an example invocation and a sample of the generated JSON output.
