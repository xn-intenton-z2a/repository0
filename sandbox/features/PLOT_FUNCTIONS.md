# Summary
Add a new CLI capability to compute and display data points for simple mathematical functions. The tool will accept options for function type, range, and step size, compute x/y pairs, and output the results as JSON.

# Implementation
- Update src/lib/main.js to:
  - Import minimist and parse options: function, from, to, step.
  - Define defaults: function is quadratic, from is -10, to is 10, step is 1.
  - Validate that function is one of quadratic or sine. On invalid name exit with code 1 and an error message.
  - Generate an array of points: for x starting at from and increasing by step until to (inclusive), compute y = x * x for quadratic or y = Math.sin(x) for sine.
  - Print the resulting array as JSON to stdout.

# README Updates
- Add a new Usage section describing how to invoke the plot feature:
  node src/lib/main.js
  node src/lib/main.js --function sine --from 0 --to 6.28 --step 0.1
- Document the default behavior and examples for overriding options.

# Testing Deliverables
1. Add unit tests in tests/unit/main.test.js to verify:
   - Running main with no arguments produces an array of 21 points for quadratic.
   - Running main with --function sine returns correct sine values at known points.
   - Providing an unsupported function name causes the process to exit with an error.
2. Ensure tests pass under the new behavior.