# HTTP_SERVER

# Description
When the serve flag is provided to the CLI, the tool starts an HTTP server on a configurable port and exposes health and options endpoints for monitoring and integration.

# Endpoints
1. GET /health
   - Returns HTTP 200 and JSON { status: "ok" }
2. GET /options
   - Returns HTTP 200 and JSON of the current parsed CLI options object
3. Any other path
   - Returns HTTP 404 and JSON { error: "Not Found" }

# Implementation
- Modify `src/lib/main.js`:
  1. Parse `--serve` flag in existing `parseArgs` function and set `options.serve = true` when present.
  2. Export a new function `startHttpServer(options, port = process.env.PORT || 3000)`:
     - Use Node's `http` module to create a server.
     - In the request handler, inspect `req.method` and `req.url`:
       * If GET `/health`: respond 200 with JSON `{ status: "ok" }`.
       * If GET `/options`: respond 200 with JSON of the `options` object.
       * Otherwise: respond 404 with JSON `{ error: "Not Found" }`.
     - Call `server.listen(port)` and log `Server listening on port <port>`.
     - Return the `http.Server` instance for testing.
  3. In `main(args)`:
     - After parsing flags, if `options.serve` is true, invoke `startHttpServer(options)` and do not exit immediately so the server remains running.

# Testing
- In `tests/unit/main.test.js`:
  1. Unit test for `startHttpServer`:
     - Spy on `console.log` and call `startHttpServer({}, 0)`.
     - Listen for the `listening` event and assert that `console.log` was called with `Server listening on port <port>`.
     - Assert the returned value is an instance of `http.Server`.
  2. Endpoint behavior tests:
     - Use Node’s `http.get` to request `/health` and assert status 200, `Content-Type: application/json`, and response body `{ status: "ok" }`.
     - Request `/options` and assert the response JSON matches the passed options object.
     - Request an unknown path and assert status 404 and body `{ error: "Not Found" }`.

# Documentation
- Update `README.md` to include an **HTTP Server** section:
  * Describe the `--serve` flag and default port.
  * Document the available endpoints (`/health`, `/options`).
  * Provide inline examples using `curl`:
    curl http://localhost:3000/health  
    curl http://localhost:3000/options