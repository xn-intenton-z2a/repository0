# HTTP Server API

## CLI Behavior

Introduce a new CLI command `serve` to launch an HTTP server that exposes key CLI functionality via REST endpoints.  The command accepts an optional `--port` flag to specify the listening port (default: 3000).

Usage:

npm run start -- serve [--port <port>]

Endpoints:
- GET /help        Returns the CLI help text.
- GET /version     Returns the version string from package.json.
- GET /mission     Returns the contents of MISSION.md.
- GET /features    Returns a JSON array of available feature names.
- POST /echo       Accepts JSON `{ args: [string] }` and returns `{ result: string }` with joined arguments.
- POST /run        Accepts JSON `{ command: string, args: string[] }`, invokes the corresponding CLI command internally, and returns `{ stdout: string }`.

## File Modifications

- **sandbox/source/main.js**
  - Add `import express from "express"` to dependencies.
  - Add a new `serve` case in the main CLI switch that calls `startServer(argv)`.
  - Implement `async function startServer(argv)`:
    - Determine port from `argv.port` or default to 3000.
    - Create an Express app and define the endpoints above.
    - For each endpoint, invoke the existing helper functions (`showHelp`, `showVersion`, `showMission`, `showFeatures`, `doEcho`, and a generic `runCommand`) and capture their output or errors.
    - Listen on the configured port and log a startup message.
  - Refactor printing functions to return strings when called programmatically, while preserving stdout behavior for CLI.

- **sandbox/tests/serve.test.js**
  - Create tests that start the server on a random available port.
  - Use a HTTP client (e.g., `fetch` or `undici`) to send requests to each endpoint.
  - Verify that:
    - GET /help returns a string containing "Usage:" and command list.
    - GET /version returns the same version as `npm run start -- version`.
    - GET /mission returns text starting with `# Mission Statement`.
    - POST /echo with `{ args: ["a","b"] }` returns `{ result: "a b" }`.
    - POST /run for `{ command: "echo", args: ["x","y"] }` returns `{ stdout: "x y\n" }`.

## Documentation

- **README.md**: Add a new "HTTP Server API" section explaining the `serve` command, the `--port` option, and list of REST endpoints with examples.
- **package.json**: Add `express` under `dependencies` so the HTTP server can be run.
