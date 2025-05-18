# HTTP GET Request

## CLI Behavior

Introduce a new command http-get that performs an HTTP GET request to a specified URL. It accepts a URL argument and the following options:

- --json: parse the response body as JSON and pretty-print it
- --output <file>: write the raw or parsed response to the specified file instead of stdout

Usage:

npm run start -- http-get <url>
npm run start -- http-get <url> --json
npm run start -- http-get <url> --output response.txt
npm run start -- http-get <url> --json --output data.json

## File Modifications

- sandbox/source/main.js: add a case http-get in the CLI switch and implement async function doHttpGet(argv).
  - Read the URL from argv._[1] and validate its presence
  - Use the built-in fetch API to perform the GET request
  - On --json flag, call response.json() and format the result with JSON.stringify(data, null, 2)
    Otherwise call response.text()
  - Handle non-OK HTTP status codes by printing an error and exiting with status 1
  - Write the result to stdout or, if --output is provided, write to the resolved file path
- sandbox/tests/http-get.test.js: add feature-level tests
  - Start a temporary HTTP server that responds with plain text or JSON
  - Invoke the CLI and verify the stdout contains expected text or pretty-printed JSON
  - Test that --output writes the response to the specified file
  - Test error behavior when the server returns a 500 or the URL is invalid
- README.md: update the CLI Usage section to document the http-get command with examples

## Testing

Add tests to verify:

- Fetching a plain text endpoint prints the exact response body to stdout
- Fetching a JSON endpoint with --json flag pretty-prints JSON output
- The --output option writes the fetched response to a file with correct contents
- Non-200 status codes and network errors produce descriptive error messages and exit code 1