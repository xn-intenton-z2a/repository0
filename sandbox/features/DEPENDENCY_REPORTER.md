# Overview

This feature adds the ability to generate a report of the project’s dependencies and devDependencies by reading the package.json file. It extends the main module to offer both a programmatic API and a CLI command to produce the report in JSON or Markdown format.

# Functionality

- Introduce function generateDependencyReport(options) that reads package.json and returns a formatted string.
- Accept options.format with values json or markdown (default markdown).
- Accept options.fields with values dependencies, devDependencies, or all (default all).
- Return a string containing either a JSON object or a Markdown table listing package names and versions.

# API

Exported function: generateDependencyReport(options)
- options: object with:
  - format: string (json or markdown)
  - fields: string (dependencies, devDependencies, or all)
- returns: string containing the formatted report

# CLI Behavior

Extend src/lib/main.js to parse new flags:
- --report-deps=<format> where format is json or markdown
- --report-fields=<fields> where fields is dependencies, devDependencies, or all
- --output=<file> optional file path to write the report; if omitted, output to stdout

When invoked with npm run start -- --report-deps=json --report-fields=all --output=deps.json, the CLI will:
- Call generateDependencyReport with appropriate options
- Write the resulting JSON string to deps.json or print to stdout

# Testing

- Add unit tests for generateDependencyReport:
  - Verify output JSON for a known package.json fixture
  - Verify output Markdown contains correct header and table rows
  - Test format and fields combinations
- Add CLI integration tests:
  - Invoke main with process.argv set to include report flags
  - Capture stdout or file output and verify content matches expected report

# README Updates

- Document new API function and its options
- Provide CLI usage examples for both JSON and Markdown output
- Show sample outputs in the README
