# PLOT FUNCTIONS

## Description
Extend the command line interface to support plotting mathematical functions into SVG format. Users can generate visual representations of quadratic and sine functions by providing parameters via flags.

## Implementation

- Update src/lib/main.js and sandbox/source/main.js to import minimist for parsing new flags.
- Recognize a new flag `plot` or `p` that takes a function name as its first positional argument: `quadratic` or `sine`.
- For `quadratic`, require a `--coefficients` flag with comma-separated values `a,b,c`.
- For `sine`, require `--amplitude` and `--frequency` flags.
- Support an optional `--output` or `-o` flag to specify an output file path. If omitted, print SVG to stdout.
- Compute function samples over a default domain [-10, 10] with fixed resolution (e.g., 200 points).
- Build an SVG string with a `<path>` element representing the function curve and include proper `viewBox` and styling attributes.
- Use Node fs module for writing output files synchronously when `--output` is provided.
- Ensure clear exit codes: zero on success, non-zero if required flags or parameters are missing or invalid.

## Testing

- Add sandbox/tests/plot_functions.test.js with tests that:
  * Invoke the CLI with `--plot quadratic --coefficients 1,0,0` and capture SVG output string.
  * Verify the output string begins with `<svg` and contains a single `<path` element.
  * Invoke the CLI with `--plot sine --amplitude 2 --frequency 0.5 --output test.svg` and confirm that `test.svg` is created and contains valid SVG content.
  * Test error cases: missing parameters or unrecognized function name exits with non-zero code.

## Documentation

- Update README.md to include a new "Plot Functions" section under "CLI Usage".
- Provide usage examples for both quadratic and sine plots, demonstrating both stdout and file output modes.
