# HTTP Fetch

## CLI Behavior

Introduce a new CLI command `fetch` to retrieve the contents of a remote URL and output it to stdout or write it to a file. Supports plain text and JSON parsing.

Usage:

npm run start -- fetch <url> [--output <file>] [--json] [--timeout <ms>]

Options:
- `url`: The HTTP or HTTPS URL to fetch (required).
- `--output <file>`: Path to write the fetched content instead of printing to stdout.
- `--json`: Parse the response body as JSON and pretty-print with two-space indentation.
- `--timeout <ms>`: Maximum time in milliseconds to wait for the fetch; defaults to no timeout.

Examples:

npm run start -- fetch https://example.com/data.txt
npm run start -- fetch https://api.example.com/items --json
npm run start -- fetch https://example.com/image.png --output image.png
npm run start -- fetch https://api.example.com/items --json --output items.json --timeout 5000

# File Modifications

- **sandbox/source/main.js**: Add a new `fetch` case in the CLI switch that calls `doFetch(argv)`. Implement `async function doFetch(argv)` which:
  - Validates that `argv._[1]` is provided as the URL.
  - Uses the global `fetch` API to request the URL with an optional AbortController for timeout.
  - Checks for HTTP errors (response.ok) and prints an error message with status code on failure.
  - Reads the response body as text or JSON depending on the `--json` flag.
  - Writes the result either to stdout or to the file specified by `--output` using `fs/promises`.
  - Exits with status 0 on success or 1 on any error.

- **sandbox/tests/fetch.test.js**: Create feature-level tests that:
  - Start a temporary HTTP server returning plain text and JSON responses.
  - Invoke the CLI `node sandbox/source/main.js fetch <url>` and assert the stdout matches the expected content.
  - Test the `--json` flag by serving a JSON endpoint and verifying parsed output matches the pretty-printed JSON.
  - Test the `--output` flag writes the fetched content correctly to a file.
  - Test the `--timeout` flag aborts a slow endpoint and exits with code 1 and an appropriate error message.

- **README.md**: Update the **Commands Reference** section to document the `fetch` command with usage examples and descriptions.

- **package.json**: No new dependencies required. The global `fetch` API in Node 20 is used.

## Testing

Add tests to verify:
- Successful retrieval of plain text and JSON endpoints.
- Pretty-printed JSON output when `--json` is used.
- File creation and content when using `--output`.
- Proper error handling and exit code when fetching invalid URLs or when a timeout occurs.