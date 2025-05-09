# Overview

Extend the CLI entry point to support custom mathematical expressions in addition to sine and quadratic functions. Leverage mathjs to parse and evaluate expressions over a defined range of x values and render the result as an SVG plot.

# CLI Usage

- --expression <expr>   Optional mathematical expression in terms of x (e.g. x^3 + 2*x - 5). Overrides --function when provided.
- --function <sine|quadratic>   Select a built-in function when --expression is not used.
- --range <min,max>     Optional numeric range for x values; defaults to -10,10.
- --points <n>          Number of sample points; defaults to 100.
- --output <file-path>  Optional path to write SVG file; defaults to printing SVG to stdout.

Examples:

npm run start -- --expression 'x^3 + 2*x - 5' --output graph.svg
npm run start -- --function sine --range -5,5 --points 200

# Source File Changes

Modify src/lib/main.js to:
1. Import minimist for argument parsing and mathjs for expression evaluation.
2. Parse flags: expression, function, range, points, output.
3. Validate expression syntax via mathjs; on error exit with code 1.
4. Generate an array of x values evenly spaced over the specified range.
5. Evaluate the chosen expression or built-in function at each sample point.
6. Build an SVG path string connecting computed points; ensure correct viewBox.
7. Write SVG string to stdout or to the specified file using fs.
8. Exit with code 0 on success.

# Tests

Add sandbox/tests/plot.test.js with feature-level tests:
- Invoke main with --expression and assert output contains valid SVG tags and expected path commands.
- Invoke main with invalid expression and assert non-zero exit code.
- Invoke main with built-in sine and quadratic and verify behavior unchanged.
- Test --range and --points flags adjust the SVG path complexity.

# Documentation

Update README.md to:
- Document new --expression, --range, and --points flags.
- Provide usage examples showing custom expressions and built-in functions.
- Include a note on adding mathjs to dependencies.