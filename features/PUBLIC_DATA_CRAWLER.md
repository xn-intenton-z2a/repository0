# PUBLIC_DATA_CRAWLER

## Overview
Implement a CLI subcommand fetch to retrieve data from a public API and output structured JSON suitable for constructing a knowledge graph of the physical world.

## CLI Usage
Run the action with start -- fetch. Supports options:

- endpoint: Custom URL to fetch from (default https://api.example.com/data)
- output: File path to write JSON output (default writes to stdout)

## Implementation
The main function should detect the fetch command, perform a GET request using global fetch with the specified endpoint, validate the JSON response against a zod schema, transform the payload into an array of nodes and edges, and write the resulting JSON to stdout or the output file. Errors should be handled gracefully and result in a nonzero exit code.

## Testing
Add unit tests in tests/unit/main.test.js that mock fetch to return a sample payload. Verify that main prints the expected JSON structure and that error handling works as specified.