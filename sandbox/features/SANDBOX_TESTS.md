# SANDBOX_TESTS

# Purpose
Add end-to-end sandbox tests to demonstrate core plotting functionality for both EQUATION_PLOTTER and HTTP_PLOT_SERVER features in isolation from the main test suite. These tests will serve as examples of how the features behave when invoked programmatically and via HTTP, and ensure the examples in the sandbox directory remain valid.

# Tests
1. Equation Plotter Sandbox Test
   - Use Node to import main from src/lib/main.js and invoke it with ["plot","quadratic","--width","200","--height","100","--domainStart","-5","--domainEnd","5"] under sandbox environment.
   - Capture the returned SVG string and assert it begins with an <svg> tag and contains at least one path element.
   - Invoke main with ["plot","sine","--width","300","--height","150"] and perform the same SVG assertions.

2. HTTP Plot Server Sandbox Test
   - Spawn the serve command in a child process: node src/lib/main.js serve 0 (ephemeral port).
   - Determine the bound port from stdout or logs.
   - Send HTTP GET request to /plot?functionType=quadratic&width=250&height=120 and assert:
     - Status 200
     - content-type header image/svg+xml
     - Body contains an <svg> element with a path tag
   - Send request to /plot?functionType=unsupported and assert:
     - Status 400
     - Response is valid JSON with error property.

# Files to Modify
- sandbox/tests/equation-plotter.test.js (add sandbox-level tests for CLI plot subcommand)
- sandbox/tests/http-plot-server.test.js (add sandbox-level HTTP endpoint tests)
- README.md (document how to run sandbox tests and reference sandbox/examples)
- package.json (ensure sandbox tests are included in test scripts under sandbox/tests/*.test.js)