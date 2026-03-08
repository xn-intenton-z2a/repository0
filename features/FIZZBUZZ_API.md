FIZZBUZZ_API

# Summary

Add a small, dependency-free HTTP API demo mode to the canonical FizzBuzz library that can be started from the library entrypoint for lightweight programmatic exploration and behaviour tests. The API must be implemented using only Node's built-in http module and must reuse the exported canonical functions (fizzBuzz, fizzBuzzSingle and the additive helpers) rather than reimplementing logic.

# Specification

- Server mode is opt-in and only starts when a specific CLI flag is provided: --serve or an environment variable FIZZBUZZ_SERVE=1 is present; normal library imports must not start the server.
- The server listens on a configurable port via environment variable PORT (default 3000) and binds only to localhost by default.
- All responses are JSON and use content-type application/json. Error responses use appropriate HTTP status codes and return a JSON object with keys error and message.
- The server must not add new runtime dependencies or change existing package.json.

# Endpoints

- GET /fizzbuzz?n=NUMBER
  - Returns a 200 JSON response containing the canonical fizzBuzz array for n under the key result. Example response shape: { "result": [ ... ], "meta": { "n": 15 } }.
  - Validation follows canonical rules in FIZZBUZZ_CORE; invalid inputs return 400 with an error message describing the validation failure (type/finiteness/integer/range) using the same TypeError/RangeError semantics mapped to HTTP status 400 and text suitable for machines.

- GET /fizzbuzz/single?n=NUMBER
  - Returns a 200 JSON response containing a single canonical string for the requested integer under the key result. Validation applies as for fizzBuzzSingle.

- GET /fizzbuzz/with-words?n=NUMBER&fizz=WORD&buzz=WORD
  - Returns a 200 JSON response containing the display-oriented array produced by fizzBuzzWithWords(n, { fizz: fizz, buzz: buzz }). Missing fizz or buzz query parameters fall back to canonical words.

- GET /health
  - Returns 200 and a small JSON object { "status": "ok", "uptime": <seconds> } for health checks.

# Usage

- Start server manually via node src/lib/main.js --serve or NODE_ENV=development node src/lib/main.js --serve; process.argv parsing must detect the serve flag and use the exported functions to provide responses.
- The server must be safe to run in local CI: it should bind to localhost only and pick an available port, and must be stoppable by SIGINT/SIGTERM forwarded from the process.

# Testing guidance

- Unit tests should exercise the server logic by starting it in a child process or by importing a helper that constructs the HTTP handlers without listening; tests must assert exact JSON shapes and that canonical functions are used for computation.
- Behaviour tests may start the server with PORT set to an ephemeral port and use HTTP requests to assert:
  - GET /fizzbuzz?n=15 returns result array of length 15 whose last element equals "FizzBuzz".
  - GET /fizzbuzz/single?n=3 returns result "Fizz".
  - GET /fizzbuzz/with-words?n=15&fizz=Foo&buzz=Bar returns Foo, Bar and FooBar at the canonical positions.
  - Invalid inputs (missing n, non-integer, negative) return 400 with an error message containing the canonical validation substrings (number, finite, integer, >= 0).
- Tests must not rely on external network access and must cleanly stop the server process after assertions.

# Acceptance criteria

- Server mode can be started with the serve flag and does not start during normal imports.
- All endpoints return the canonical outputs computed by the library exports and follow the exact validation rules documented in FIZZBUZZ_CORE.
- Health endpoint returns status and uptime.
- No new dependencies are added to package.json.
- Behaviour and unit tests can run locally in CI using the existing npm scripts without network access beyond localhost.

# Implementation notes

- Implement the HTTP handlers as small pure functions that accept a parsed query object and return a serialisable result or throw the canonical errors; export the handler factory for unit testing to avoid spawning processes where possible.
- Use only Node built-in modules: http, url, and querystring or URLSearchParams.
- Map canonical TypeError and RangeError to HTTP 400 with machine-friendly messages that include substrings number, finite, integer, or ">= 0" as applicable so existing unit tests can assert message substrings.
- Keep server orchestration minimal: parse port from PORT env or default 3000, bind to 127.0.0.1, and handle SIGINT/SIGTERM for graceful shutdown.
- Reuse existing library exports for all computations; do not duplicate FizzBuzz logic in handlers.

# Backwards compatibility

- This feature must be additive and not change any existing library runtime behaviour when the server is not requested. The canonical functions must remain pure and unchanged.
