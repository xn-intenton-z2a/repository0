# HTTP Face Service

## Overview
Add HTTP API to serve ASCII faces over HTTP alongside the existing CLI behavior.

## CLI Interface
Support --serve and --port flags to start an HTTP server that returns faces based on emotion queries. If --port is omitted, default to 3000.

## HTTP Interface
Clients can request GET /?emotion=<emotion> or GET /face?emotion=<emotion> to receive the ASCII face as plain text. Missing or unknown emotion parameters return the neutral face.

## Source Modifications
- Update src/lib/main.js to detect the --serve flag and optional --port <number> argument.
- When --serve is present, launch a built-in HTTP server using Node’s http module.
- In the request handler, parse URL query for emotion, select the corresponding face from the existing mapping, and respond with header Content-Type: text/plain followed by the ASCII art.
- Preserve existing console output behavior when --serve is not used.

## Tests
- Extend tests/unit/main.test.js with a new suite "HTTP Interface".
- In beforeAll, start the HTTP server on an ephemeral port and capture its address.
- Use global fetch to send HTTP GET requests to endpoints / and /face with various emotion query parameters.
- Assert that the response text matches the expected ASCII faces for happy, sad, surprised, angry, and neutral fallback.
- In afterAll, close the server to clean up.

## Documentation
- Update README.md to document the new --serve and --port options under CLI usage.
- Provide curl examples showing how to request faces over HTTP, for example:
  curl "http://localhost:3000?emotion=happy"
  -> Displays ^_^
