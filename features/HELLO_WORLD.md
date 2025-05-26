# Summary
The command line tool will print Hello World to standard output when run with no arguments. It will also support a diagnostics mode that prints Node version, platform, and process arguments and a serve mode that starts a minimal HTTP server responding with Hello World.

# CLI Behavior
When invoked without arguments via npm run start, the tool prints Hello World on a single line. When invoked via npm run diagnostics, it prints Hello World followed by Node version, platform, and the list of process arguments. When invoked via npm run serve, it listens on port 3000 and responds to HTTP GET requests on root with a plain text Hello World message.

# Testing
Add unit tests in tests/unit/main.test.js to cover default invocation, diagnostics output, and serve mode. Verify the serve mode responds with HTTP status 200 and body Hello World using Vitest and a lightweight HTTP client.

# Documentation
Update README.md to include usage examples for start, diagnostics, and serve commands. Document the new flags, expected console outputs, and instructions for running the HTTP server mode.