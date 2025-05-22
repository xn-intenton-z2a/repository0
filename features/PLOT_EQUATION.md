# PLOT_EQUATION

# Overview
This feature integrates equation plotting into the main CLI, offering three modes: console plotting, HTTP server plotting, and a new end-to-end HTTP client test mode. It ensures mutual exclusivity of modes and preserves backward compatibility with the existing emotion display.

# Usage

## Console Mode

Run the CLI with the plot flag followed by an equation expression:

node src/lib/main.js --plot "<equation>"

Example:

node src/lib/main.js --plot "x^2 - 2*x + 1"

## HTTP Server Mode

Launch an HTTP server on a specified port (default 3000):

node src/lib/main.js --serve [--port <number>]

Example:

node src/lib/main.js --serve --port 4000

Then request a plot via:

curl http://localhost:4000/plot?equation=sin(x)*x

## E2E HTTP Client Test Mode

Run a full server lifecycle test by specifying an equation. The CLI starts a server on an ephemeral port, issues an HTTP request to `/plot`, prints response details, and shuts down.

node src/lib/main.js --test-http "<equation>"

Example:

node src/lib/main.js --test-http "x^2 - 2*x + 1"

# Implementation

1. **Argument Parsing**
   - Detect `--plot`, `--serve`, and `--test-http` flags alongside `--emotion`.
   - Enforce that only one of `--plot`, `--serve`, or `--test-http` may be used per invocation. On conflict, print an error and exit with code 1.

2. **Console Plotting Mode (`--plot`)**
   - Sample 80 points across the range [-10, 10], evaluate the equation, normalize to a 20-row grid, draw axes (`|`, `-`, `+`), mark data points with `*`, and print the ASCII grid. Exit code 0 on success, 1 on error or missing equation.

3. **HTTP Server Mode (`--serve`)**
   - Start an HTTP server on the specified port. Handle `GET /plot?equation=<expr>`, validate input, generate ASCII plot, wrap in HTML `<pre>`, and respond with status 200 or 400 on error. Do not exit process. Return code 0 after server start or 1 on invalid port.

4. **End-to-End HTTP Client Test Mode (`--test-http`)**
   - Start an HTTP server on port 0 (ephemeral) using the same handler as `--serve`.
   - Once the server is listening, determine the actual bound port.
   - Use Node’s built-in HTTP client to perform a `GET /plot?equation=<expr>` request.
   - Print the response status code and the first 200 characters of the HTML or error body to stdout.
   - Shut down the server cleanly and exit with code 0 on a successful request (status 200) or 1 on error or non-200 status.

5. **Emotion Mode (`--emotion`)**
   - Preserve existing behavior when neither `--plot`, `--serve`, nor `--test-http` flags are provided.

# Testing

- **Unit Tests** (`tests/unit/main.test.js`)
  - Verify console plotting: success and error cases.
  - Verify server startup: default and custom port, invalid port.
  - Verify end-to-end test mode:
    - Invocation `main(["--test-http","x+1"])` mocks server and HTTP client, asserts status 200 case prints details and returns 0.
    - Simulate non-200 or network error, assert return code 1 and error output.
  - Confirm mutual exclusivity rejects combined flags.
  - Ensure emotion tests remain unchanged and passing.

- **End-to-End HTTP Tests** (`tests/e2e/cli.test.js`)
  - Spawn the CLI in `--serve` mode, send real HTTP requests, assert status codes and HTML `<pre>` content.
  - Spawn the CLI with `--test-http`, assert printed status and body snippet.

# Documentation

- Update `README.md` and `docs/USAGE.md` with a new ``--test-http`` section under Usage, examples and expected output.
- Link to `features/PLOT_EQUATION.md` for full specification.
