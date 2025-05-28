# HTTP_SERVER

# Description
When the `--serve` flag is provided, the CLI starts a simple HTTP server for monitoring and integration purposes.

# Endpoints
1. GET /health
   - Returns HTTP 200 with JSON `{ "status": "ok" }`
2. GET /options
   - Returns HTTP 200 with JSON containing the parsed CLI options
3. Any other path
   - Returns HTTP 404 with JSON `{ "error": "Not Found" }`

# Implementation
- In `src/lib/main.js`, export a function `startHttpServer(options, port = process.env.PORT || 3000)`.
- Use Node's built-in `http` module to create a server.
- In the request handler, inspect `req.method` and `req.url` to route to `/health` and `/options`, set `Content-Type: application/json`, and send appropriate JSON responses.
- Call `server.listen(port)` and log `Server listening on port <port>`.
- Ensure the process remains alive while the server is running.

# Testing
- In `tests/unit/main.test.js`:
  - Import and spy on `startHttpServer` to verify it returns an instance of `http.Server` and logs the listening message.
  - Use Vitest’s `http.get` or simulate requests to confirm:
    * `/health` responds with status 200, JSON content type, and body `{ status: "ok" }`.
    * `/options` responds with the parsed options object as JSON.
    * Unknown paths respond with status 404 and error JSON.

# Documentation
- Update `README.md` to include an **HTTP Server** section:
  - Describe the `--serve` flag and default port.
  - Document the available endpoints (`/health` and `/options`).
  - Provide inline `curl` examples:
    curl http://localhost:3000/health
    curl http://localhost:3000/options