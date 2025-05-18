# HTTP Server

## CLI Behavior

Introduce a new CLI command `serve` to start a minimal HTTP server that serves static files from a directory.

Usage:

npm run start -- serve [directory] [--port <number>] [--open]

Options:
- `directory`: Path to the directory to serve. Defaults to the current working directory.
- `--port`: TCP port on which the server listens. Defaults to 3000.
- `--open`: If provided, automatically open the default browser to the server root.

## File Modifications

- **sandbox/source/main.js**: Import Node's `http`, `fs/promises`, and `url` modules. Add a `serve` case in the CLI switch that calls `doServe(argv)`. Implement `async function doServe(argv)` to:
  - Resolve the directory and port.
  - Create an HTTP server that on each request:
    - Maps the request URL pathname to a file under the serve directory.
    - Checks for directory requests by serving `index.html` when present.
    - Reads the file with `fs.readFile` and responds with content and correct `Content-Type` header based on file extension.
    - Handles 404 and 500 errors with appropriate status codes and messages.
  - Starts listening on the given port and logs a message including the port and serve directory.
  - If `--open` is provided, spawn the system’s default browser to `http://localhost:<port>`.

- **sandbox/tests/serve.test.js**: Add feature-level tests that:
  - Create a temporary directory with sample files (`index.html`, `test.txt`).
  - Launch the CLI with `serve` on a randomly assigned port using `--port` and `--open` suppressed.
  - Use Node’s built-in `fetch` API to request `/` and `/test.txt` and assert correct status codes, response bodies, and MIME types.
  - Ensure the server logs the listening message and the process exits cleanly when killed.

- **README.md**: Update the **Commands Reference** section to document the new `serve` command with usage examples.

- **package.json**: No new dependencies required.

## Testing

- Verify that requesting the root path returns `index.html` with `text/html` content type.
- Verify that requesting a nested file returns its contents with the correct `Content-Type`.
- Verify that requesting a non-existent path returns a 404 status and error message.
- Verify that the server listens on the specified port and logs the correct message.
- Verify that the `--open` flag invokes the system browser (mocked) without failing.
