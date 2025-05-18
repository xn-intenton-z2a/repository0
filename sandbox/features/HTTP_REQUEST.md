# HTTP Request

## CLI Behavior
Introduce a new top-level http command to perform HTTP requests with various methods.

Subcommands and options:

- http get <url> [--json] [--output <file>] [--headers <key:value> ...]
- http post <url> [--data <file>] [--json] [--output <file>] [--headers <key:value> ...]
- http put <url> [--data <file>] [--json] [--output <file>] [--headers <key:value> ...]
- http delete <url> [--json] [--output <file>] [--headers <key:value> ...]

Behavior:

- Validate that [method] and [url] are provided; exit with code 1 if missing.
- --data reads a request body from a local file for post and put operations.
- --json parses the response as JSON and pretty-prints it.
- --headers accepts multiple key:value pairs to set custom request headers.
- --output writes the response to a file instead of stdout.
- Exit with code 1 on network errors or non-2xx status codes, printing descriptive error messages.

## Implementation

- sandbox/source/main.js: import global fetch and add a new case "http" in the CLI switch to call await doHttpCommand(argv).
- Define async function doHttpCommand(argv):
  - Extract method from argv._[1] and URL from argv._[2]. Validate presence.
  - Collect flags: data, json, headers, output from argv.
  - If --data is present for post/put, read the specified file to use as request body.
  - Build a fetch options object with method, headers (parsed into an object), and body if provided.
  - Call fetch(url, options). On response.ok === false, read response text and print an error including status code.
  - On success, parse response via response.json() or response.text() based on --json, formatting JSON with two-space indentation.
  - Write the final output to stdout or to the file specified by --output.
  - Ensure all errors are caught and logged, and exit codes reflect success (0) or failure (1).

## Testing

- Create sandbox/tests/http-request.test.js to cover:
  - Starting a local HTTP server with endpoints for GET, POST, PUT, DELETE returning JSON or text.
  - Invoking each http subcommand with and without --data, with custom headers, and the --json flag.
  - Verifying that --output writes the correct content to a file.
  - Simulating non-2xx responses and invalid URLs to confirm exit code 1 and appropriate error messages.

## Documentation

- README.md: update the Commands Reference to include the http command with its usage and examples.
- sandbox/docs/CLI_USAGE.md: add a new section describing the http subcommands, flags, behavior, and examples.