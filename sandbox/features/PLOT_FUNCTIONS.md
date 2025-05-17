# Overview

Introduce a lightweight function plotter into the CLI that generates a simple SVG representation of mathematical functions. This feature extends the existing argument echo behavior to render curves for standard functions such as sine and quadratic equations directly in the terminal or as an output file.

# Functionality

- Accept a function type identifier (e.g., sine, quadratic) as the first CLI argument.
- Accept optional numeric parameters for range start, range end, and step size.
- Generate an SVG string depicting the function curve over the specified range.
- Output the SVG to stdout or write to an `output.svg` file when an `--output` flag is provided.
- Fallback to echoing the arguments if no recognized function type is supplied.

# CLI Usage

- `npm run start sine 0 6.28 0.1` renders one period of a sine wave.
- `npm run start quadratic -5 5 0.5` renders y = x² over the range -5 to 5.
- `npm run start sine 0 6.28 0.1 --output curve.svg` writes the SVG to curve.svg.

# Testing

- Validate that invoking the CLI with sine or quadratic outputs a string starting with `<svg` and containing the correct `<path` data.
- Test default behavior when no function type is provided: fallback to argument echo.
- Confirm that the `--output` flag creates a file with valid SVG content.

# Implementation Details

- Implement SVG generation in the single main source file using string concatenation and basic math.
- Leverage existing test framework (vitest) to add unit tests in sandbox/tests.
- Update README to include usage examples and describe the plot feature.