# HTTP_SERVER

# Description
When the `--serve` flag is provided to the CLI, start a lightweight HTTP server to expose health and options endpoints for monitoring and integration.

# Endpoints
1. GET /health
   - Responds with HTTP 200
   - JSON body: { status: "ok" }
2. GET /options
   - Responds with HTTP 200
   - JSON body: the parsed CLI options object
3. Any other path
   - Responds with HTTP 404
   - JSON body: { error: "Not Found" }

# Implementation
- In `src/lib/main.js`:
  1. Export `startHttpServer(options, port = process.env.PORT || 3000)`:
     - Use Node’s `http.createServer` to create a server.
     - Set header `Content-Type` to `application/json` on all responses.
     - In the request handler, route by `req.method` and `req.url` as described.
     - Call `server.listen(port)` and log `Server listening on port <port>`.
     - Return the `http.Server` instance.
  2. In `main(args)` after parsing flags:
     - If `options.serve` is true, call `startHttpServer(options)` and do not exit so the server remains running.

# Testing
- In `tests/unit/main.test.js`:
  1. Unit test for `startHttpServer`:
     - Spy on `console.log` and call `startHttpServer({}, 0)`.
     - On the `listening` event, verify that `console.log` was called with the correct port.
     - Assert the return value is an instance of `http.Server`.
  2. Endpoint behavior tests:
     - Use Node’s `http.get` to request `/health` and `/options` on a dynamic port.
     - Assert status codes, `Content-Type` headers, and JSON response bodies.
     - Test an unknown path returns 404 with the error JSON.

# Documentation
- Update `README.md` under **HTTP Server**:
  - Describe the `--serve` flag and default port.
  - Document the `/health` and `/options` endpoints.
  - Provide inline `curl` examples:
    curl http://localhost:3000/health
    curl http://localhost:3000/options