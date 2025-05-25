# Overview
This feature enables the CLI tool to fetch structured data from a public HTTP endpoint and stream the parsed JSON to standard output. It provides a foundation for crawling data sources and feeding records into the knowledge graph pipeline.

# CLI Options
--source-url    The HTTP URL of the public data source to fetch. Must return JSON.
--timeout       Optional fetch timeout in milliseconds. Defaults to 5000.
--format        Optional output format, either json or ndjson. Defaults to json.

# Implementation Details
1. Add axios as a dependency to perform HTTP GET requests.
2. Extend the main function to parse and validate CLI arguments.
3. Perform a GET request to source-url with the specified timeout.
4. On successful fetch, parse the JSON body and write it to stdout in the requested format.
5. Handle network and parse errors with clear exit codes and error messages.

# Testing
- Write unit tests that mock axios to simulate successful and failed HTTP responses.
- Verify that main prints the correct JSON or newline-delimited output based on format.
- Assert that exit codes are non-zero on error conditions.