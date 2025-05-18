# HTTP Request

## CLI Behavior

Introduce a unified http command to perform HTTP requests with various methods.

Subcommands and options:

- http get <url> [--json] [--output <file>] [--headers <key:value> ...]
- http post <url> [--data <file>] [--json] [--output <file>] [--headers <key:value> ...]
- http put <url> [--data <file>] [--json] [--output <file>] [--headers <key:value> ...]
- http delete <url> [--json] [--output <file>] [--headers <key:value> ...]

Behavior:

- Read URL and method from positional arguments.
- --data reads a request body from a local file.
- --json parses response as JSON and pretty-prints it.
- --headers accepts multiple key:value pairs to set request headers.
- --output writes the response to a file instead of stdout.
- Exit with code 1 on network errors or non-2xx status codes, printing descriptive messages.

## Implementation

- sandbox/source/main.js: import global fetch, add a new case http in the CLI switch that calls await doHttpCommand(argv).
- Implement async function doHttpCommand(argv):
  - Validate method and URL arguments; exit with error if missing.
  - Collect flags: data, json, headers, output.
  - Build a fetch options object with method, headers, and optional body from data file.
  - Await fetch call; on non-ok status, read text and print error with status code.
  - Read response as text or JSON based on --json, format accordingly.
  - Write result to stdout or file per --output.

## Testing

- sandbox/tests/http-request.test.js:
  - Start temporary HTTP server endpoints for GET, POST, PUT, DELETE, returning text or JSON.
  - Test each method with and without --data, with headers, and with --json flag.
  - Verify --output writes correct contents.
  - Simulate error responses (e.g., 500) and invalid URLs to confirm exit code and error messages.

## Documentation

- README.md: update Commands Reference with http command and examples.
- sandbox/docs/CLI_USAGE.md: add a new section describing http subcommands, flags, usage, and examples.