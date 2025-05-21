# Overview
Extend the HTTP Face Service to expose Prometheus-compatible metrics at a new endpoint. Monitoring tools and operators can now scrape usage statistics, including total faces served and total HTTP requests broken down by endpoint and emotion label.

# CLI Interface
- No changes to existing invocation. The metrics endpoint is automatically available when the server is started with --serve and --port flags.

# HTTP Interface
- Existing endpoints remain unchanged:
  - GET / or /face?emotion=<emotion> returns ASCII face as plain text
  - GET /emotions returns JSON array of supported emotions
  - GET /random returns a random ASCII face as plain text
- New endpoint:
  - GET /metrics returns a 200 response with Content-Type: text/plain; charset=utf-8
  - The body is in Prometheus exposition format, including counters:
    - faces_served_total: the total number of face responses served
    - http_requests_total{endpoint="<path>",emotion="<emotion>"}: HTTP request counts labeled by endpoint path and emotion served (neutral for missing/unrecognized)

# Source Modifications
- In src/lib/main.js:
  - At top of server setup, initialize in-memory counters:
    - a simple object to track faces_served_total and a nested map for http_requests_total by endpoint and emotion
  - In each HTTP route handler (/, /face, /random, /emotions, 404), increment http_requests_total with appropriate labels
  - Before routing logic, add a handler for pathName === "/metrics" that:
    - Serializes counters into Prometheus exposition format lines
    - Emits faces_served_total and http_requests_total metrics
    - Sets response header Content-Type to text/plain; charset=utf-8
    - Ends response and returns without further routing

# Tests
- Add a new test suite "Metrics Interface" in tests/unit/main.test.js:
  - Start server on ephemeral port
  - Perform a sequence of requests to /, /face?emotion=happy, /random, /emotions, and an invalid path
  - Request /metrics and assert:
    - Status 200, Content-Type header matches text/plain
    - Response body contains lines starting with faces_served_total and http_requests_total
    - Label syntax is correct, e.g., http_requests_total{endpoint="/face",emotion="happy"} 1

# Documentation
- Update README.md under HTTP Server Mode to document the /metrics endpoint with example curl:
  curl -i "http://localhost:3000/metrics"
- Update docs/HTTP_FACE_SERVICE.md:
  - Add a section "Metrics Endpoint" describing the new /metrics route
  - Show sample Prometheus metrics output
  - Provide guidance on scraping metrics and using them in monitoring setups