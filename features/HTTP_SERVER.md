# HTTP_SERVER

# Description
When the --serve flag is provided to the CLI, start a lightweight HTTP server for monitoring and integration. Provide two endpoints to check tool health and view parsed options.

# Endpoints
1. GET /health
   - Returns HTTP 200
   - Body: JSON { status: "ok" }
2. GET /options
   - Returns HTTP 200
   - Body: JSON of the current parsed CLI options
3. Any other path
   - Returns HTTP 404
   - Body: JSON { error: "Not Found" }

# Implementation
- In src/lib/main.js:
  * Export startHttpServer(options, port = process.env.PORT || 3000)
  * Use Node's http module to create server
  * In request handler, inspect method and url
  * Set Content-Type to application/json on responses
  * Dispatch to /health and /options, return proper JSON and status codes
  * Call server.listen(port) and log "Server listening on port <port>"
  * Return the server instance
- In main(args):
  * After parsing options, if options.serve is true, call startHttpServer(options) and keep process alive

# Testing
- In tests/unit/main.test.js:
  * Spy on console.log and call startHttpServer({}, 0)
  * On server listening event, assert console.log was called with the correct port
  * Assert returned value is an instance of http.Server
  * Use http.get on dynamic port to request /health and /options
    - Assert status codes, Content-Type header, and JSON body match expected values
  * Request unknown path and assert 404 and error JSON
