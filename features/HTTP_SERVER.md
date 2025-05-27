# HTTP_SERVER

# Description
Implement an HTTP server behind the existing CLI that starts when the `--serve` flag is provided. Deliver a lightweight status API so users can monitor the tool’s health and current options.

# Endpoints
1. GET /health
   - Returns HTTP 200
   - JSON body: { status: "ok" }
2. GET /options
   - Returns HTTP 200
   - JSON body: the parsed CLI options object
3. Any other route
   - Returns HTTP 404
   - JSON body: { error: "Not Found" }

# Implementation
- In `src/lib/main.js`:
  - Export `startHttpServer(options, port = process.env.PORT || 3000)`:
    - Use Node’s `http.createServer`.
    - Set JSON content-type header.
    - Route requests by `req.method` and `req.url` as above.
    - Call `server.listen(port)` and log `Server listening on port <port>`.
    - Return the server instance for testing.
  - Modify `main()`:
    - After parsing args, if `options.serve` is true, call `startHttpServer(options)` and skip exit so the server remains running.

# Testing
- In `tests/unit/main.test.js`:
  - Unit test for `startHttpServer`:
    * Spy on `console.log` and use `server.address().port` to verify log.
    * Confirm returned instance is `http.Server`.
  - Endpoint tests:
    * Use `http.get` to request `/health` and `/options` on a dynamic port.
    * Assert status code, JSON content-type, and expected body.
    * Test unknown path yields 404 and error JSON.
  - In `main` tests:
    * Stub `parseArgs` to return `{ serve: true, ... }` and spy on `startHttpServer` to verify invocation.

# Documentation
- Update `README.md` under **HTTP Server**:
  * Describe `--serve` flag and default port.
  * List endpoints and sample inline `curl` commands:
    curl http://localhost:3000/health  
    curl http://localhost:3000/options