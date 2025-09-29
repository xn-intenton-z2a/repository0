# HTTP_SERVER

# Description
When the --serve flag is provided to the CLI, the tool starts a lightweight HTTP server on a configurable port (default 3000). Users can monitor the tool’s status and parsed options via HTTP requests.

# Endpoints

1. GET /health
   - Responds with HTTP 200 and JSON object { status: "ok" }.
2. GET /options
   - Responds with HTTP 200 and a JSON object of the current parsed CLI options.
3. Any other path
   - Responds with HTTP 404 and JSON object { error: "Not Found" }.

# Implementation

- In src/lib/main.js:
  1. Export function startHttpServer(options, port = process.env.PORT || 3000):
     - Create an HTTP server using Node’s built-in http module.
     - In the request handler, set Content-Type to application/json and route by req.method and req.url to the endpoints above.
     - On server.listen(port), log "Server listening on port <port>" and return the server instance.
  2. In main(args), after parsing flags:
     - If options.serve is true, call startHttpServer(options) and keep the process alive.

# Testing

- In tests/unit/main.test.js:
  1. Unit test for startHttpServer:
     - Spy on console.log and call startHttpServer({}, 0).
     - On the server’s listening event, assert console.log was called with the actual port.
     - Confirm the return value is an instance of http.Server.
  2. Endpoint behavior tests:
     - Use http.get to request /health and verify status code, Content-Type, and body { status: "ok" }.
     - Request /options and verify the returned JSON matches the passed options object.
     - Request an unknown path and verify status 404 and body { error: "Not Found" }.

# Documentation

- Add an **HTTP Server** section to README.md under **CLI Usage**:
  - Describe the --serve flag and default port.
  - List the /health and /options endpoints.
  - Provide inline curl examples:
    curl http://localhost:3000/health
    curl http://localhost:3000/options