# HTTP_SERVER

# Description
When the --serve flag is provided to the CLI, the tool starts a lightweight HTTP server on a configurable port (default 3000). Users can monitor the tool’s status and options via HTTP requests.

# Endpoints

1. GET /health
   - Response: HTTP 200
   - Body: JSON object `{ status: "ok" }`

2. GET /options
   - Response: HTTP 200
   - Body: JSON object representing the current parsed CLI options

3. Any other path
   - Response: HTTP 404
   - Body: JSON object `{ error: "Not Found" }`

# Implementation

- In src/lib/main.js:
  1. Export function `startHttpServer(options, port = process.env.PORT || 3000)`:
     - Use Node’s built-in `http` module to create a server.
     - In the request handler, inspect `req.method` and `req.url`:
       * If GET `/health`: respond with status 200 and JSON `{ status: "ok" }`.
       * If GET `/options`: respond with status 200 and JSON of `options` object.
       * Otherwise: respond with status 404 and JSON `{ error: "Not Found" }`.
     - Call `server.listen(port)` and log `Server listening on port <port>`.
     - Return the `http.Server` instance for testing.
  2. In `main(args)` after parsing CLI flags:
     - If `options.serve` is true, call `startHttpServer(options)` and keep process alive.

# Testing

- In tests/unit/main.test.js:
  1. Unit test for `startHttpServer`:
     - Spy on `console.log` and call `startHttpServer({}, 0)`.
     - On the server’s `listening` event, assert `console.log` was called with the actual port.
     - Assert the returned instance is an `http.Server`.

  2. Endpoint tests using `http.get`:
     - `/health`: confirm status 200, `Content-Type: application/json`, body `{ status: "ok" }`.
     - `/options`: confirm status 200, content type JSON, body matching passed options.
     - Unknown path: confirm status 404 and body `{ error: "Not Found" }`.

# Documentation

- Update README.md under **HTTP Server**:
  * Describe `--serve` flag and default port.
  * Document `/health` and `/options` endpoints.
  * Provide inline `curl` examples without fenced code blocks:
    curl http://localhost:3000/health
    curl http://localhost:3000/options
