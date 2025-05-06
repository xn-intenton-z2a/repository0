# Purpose
When the CLI is invoked with no subcommands or arguments, automatically run a demo sequence that generates SVG plots for both the quadratic and sine functions using default parameters. This provides an immediate showcase of the core plotting functionality when running npm run start.

# Behavior
1. Detect that main was called with an empty argument array.
2. Invoke the existing plot logic twice, once for quadratic and once for sine, using default values:
   - domainStart: -10  
   - domainEnd: 10  
   - width: 800  
   - height: 400
3. Receive two SVG strings and join them with line breaks.
4. Write the combined SVG output to stdout.
5. Return the combined SVG string from main so that tests or other callers can inspect the result programmatically.

# Tests
- In tests/unit/main.test.js, add a test that simulates calling main with no arguments (e.g., main([]) or resetting process.argv) and captures stdout. Assert:
  - The output contains exactly two <svg> tags.
  - No errors or exceptions are thrown.

# Files to Modify
- src/lib/main.js: implement detection of no-argument invocation and demo logic that calls the plot routines and outputs combined SVG.
- tests/unit/main.test.js: add a demo mode test capturing output and verifying two SVG documents.
- README.md: update Getting Started section to explain that npm run start will display demo SVGs for quadratic and sine functions.