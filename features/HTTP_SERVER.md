# HTTP_SERVER

# Description
Integrate a lightweight HTTP server behind the existing CLI to allow monitoring and integration. When the --serve flag is provided, the tool will start a server on a configurable port and expose health and options endpoints.

# Endpoints
1. GET /health
   - Responds with HTTP 200 and JSON { status: "ok" }
2. GET /options
   - Responds with HTTP 200 and JSON of the current parsed CLI options
3. Any other request
   - Responds with HTTP 404 and JSON { error: "Not Found" }

# Implementation
- In src/lib/main.js:
  1. Export a function startHttpServer(options, port = process.env.PORT || 3000) that:
     - Uses Node’s http module to create a server.
     - Sets Content-Type to application/json.
     - Routes requests based on req.method and req.url to the above endpoints.
     - Calls server.listen(port) and logs "Server listening on port <port>".
     - Returns the http.Server instance for testing.
  2. In main(args): after parsing options, if options.serve is true, call startHttpServer(options) and keep the process alive.

# Testing
- In tests/unit/main.test.js:
  1. Test startHttpServer:
     - Spy on console.log and call startHttpServer({}, 0).
     - Confirm return is an http.Server instance.
     - On server listening event, assert that console.log was called with the correct port.
  2. Endpoint behavior:
     - Simulate HTTP GET requests to /health and /options on a dynamic port.
     - Assert status codes, Content-Type headers, and JSON bodies match expectations.
     - Test an unknown path yields 404 and the error JSON.

# Documentation
- Update README.md under **HTTP Server**:
  - Describe the --serve flag and default port.
  - Document the /health and /options endpoints.
  - Provide inline curl examples:
    curl http://localhost:3000/health
    curl http://localhost:3000/options