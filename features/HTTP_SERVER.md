# HTTP_SERVER

# Description
When the --serve flag is provided to the CLI, start a HTTP server on a configurable port (default 3000). Provide two endpoints for monitoring:

# Endpoints
1. GET /health
   - Responds with HTTP 200 and JSON { status: "ok" }
2. GET /options
   - Responds with HTTP 200 and the current parsed CLI options as JSON
3. Any other path
   - Responds with HTTP 404 and JSON { error: "Not Found" }

# Implementation
- Add and export `startHttpServer(options, port = process.env.PORT || 3000)` in `src/lib/main.js`.
- Use Node’s built-in `http` module to create the server.
- In the request handler, inspect `req.method` and `req.url`:
  - If GET /health: writeHead 200 and end with JSON status object.
  - If GET /options: writeHead 200 and end with JSON options object.
  - Else: writeHead 404 and end with JSON error.
- Call `server.listen(port)` and log `Server listening on port <port>`.
- Return the `http.Server` instance so tests can hook into it.

# Testing
- In `tests/unit/main.test.js`:
  1. Spy on console.log and call `startHttpServer({serve:true}, 0)`:
     - Assert return is `http.Server`.
     - On `listening` event, confirm console.log was called with correct port.
  2. Simulate HTTP GET requests to the server:
     - GET /health: expect 200, Content-Type application/json, body { status: "ok" }.
     - GET /options: expect 200, body matching passed options object.
     - GET /unknown: expect 404, body { error: "Not Found" }.

# Documentation
- Update `README.md` under **HTTP Server**:
  - Describe the `--serve` flag and default port.
  - List endpoints and sample inline `curl` commands:
    curl http://localhost:3000/health
    curl http://localhost:3000/options
