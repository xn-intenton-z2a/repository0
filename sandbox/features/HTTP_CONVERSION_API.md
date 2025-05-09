# Summary

Extend the conversion-rate CLI to serve the effective conversion rate over HTTP in addition to existing console output. Introduce a new --serve (alias -s) option that starts a lightweight HTTP server. Add a --port option to configure the listening port, defaulting to 3000.

# Implementation

1. Modify sandbox/source/main.js to:
   - Enhance minimist parsing to accept:
     • --serve (alias -s) boolean flag; when provided, run HTTP server instead of exiting immediately.
     • --port numeric option for server port; default 3000.
   - After computing and validating conversionRate:
     • If serve flag is true:
       - Import http from node built in modules.
       - Validate port is a positive integer. On invalid port, log error and throw.
       - Create HTTP server that handles GET requests on path / and responds with Content-Type application/json and body {"conversionRate": rate}.
       - Start listening on configured port and log message "Conversion API listening on port PORT".
       - Do not exit immediately; allow server to run until process termination.
     • Else (default behavior):
       - Log the conversion rate as before and return result.

# README Updates

Update sandbox/docs/USAGE.md in the section describing CLI usage to include:

- New option --serve (alias -s) to start HTTP server.
- New option --port to specify server port (default 3000).
- Examples:
  npm run start -- --serve
  npm run start -- --serve --port 8080

# Testing Deliverables

1. In sandbox/tests/main.test.js add tests to verify:
   • Starting main with serve and default port launches server responding to GET http://localhost:3000/ with expected JSON { conversionRate: rate }.
   • Starting with serve and custom port launches server on that port and returns correct JSON.
   • Invalid port values (negative or non numeric) cause process to throw error and not start server.
   • Existing tests for default console output continue to pass unmodified.
