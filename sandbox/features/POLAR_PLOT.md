# Overview

Add support for polar coordinate plotting so users can supply a polar function r(theta) and render the corresponding Cartesian curve as an SVG plot.

# CLI Usage

- --polar <expr>         Polar expression in terms of theta (e.g. 2*sin(3*theta)). Overrides --expression and --function flags.
- --theta-range <min,max>  Numeric range for theta values; defaults to 0,2*pi.
- --points <n>           Number of sample points; defaults to 100.
- --output <file-path>   Path to write SVG file; defaults to printing SVG to stdout.

Examples:

npm run start -- --polar '1+cos(theta)' --theta-range 0,6.283 --points 200 --output polar.svg

# Source File Changes

Modify src/lib/main.js to:
1. Import mathjs for parsing and evaluating polar expressions.
2. Recognize the --polar flag and parse theta-range, points, and output.
3. Validate the polar expression syntax via mathjs; exit with code 1 on error.
4. Generate an array of theta values evenly spaced over the specified range.
5. Evaluate r(theta) at each sample point and convert to x and y using x=r*cos(theta), y=r*sin(theta).
6. Build an SVG path string connecting the computed Cartesian points; adjust viewBox to include full curve.
7. Write the SVG string to stdout or to the specified file using fs.
8. Exit with code 0 on success.

# Tests

Add sandbox/tests/polar.test.js with tests that:
- Invoke main with --polar and assert output contains valid SVG tags and expected move and curve commands.
- Invoke main with invalid polar expression and assert non-zero exit code.
- Verify that theta-range and points flags adjust plot complexity.

# Documentation

Update README.md to:
- Document new --polar and --theta-range flags.
- Provide usage examples for polar plots.
- Note the addition of mathjs to dependencies.
