# Overview

This feature adds mathematical function plotting capabilities to the CLI. It enables users to generate simple SVG plots for quadratic and sine functions over a predefined range, demonstrating how the template can be extended with real functionality.

# Behavior

- When no flags are provided, the CLI prints a help message describing available options and exits with code 0.
- Users can specify the function to plot using the `--function` flag with values `quadratic` or `sine`.
- Users can specify an output file path using the `--output` flag; defaults to `plot.svg` in the current directory.
- The CLI generates an SVG file containing the graph of the selected function over the range [-10, 10] with axes, written to the specified output path.

# Implementation Details

- In `src/lib/main.js`:
  - Parse flags using `minimist` for `function` and `output`.
  - Validate that the function name is either `quadratic` or `sine`; exit with an error code and message on invalid input.
  - Generate SVG markup using string templates: draw axes and a polyline representing y = x^2 or y = sin(x) scaled to fit a 500x300 viewBox.
  - Use the built-in `fs` module to write the SVG content to the specified file path.

- No new dependencies are required; `fs` is part of Node.js.

# CLI Usage

- Display help:
  npm run start

- Plot a quadratic function:
  npm run start -- --function quadratic --output quadratic.svg

- Plot a sine function:
  npm run start -- --function sine --output sine.svg

# Tests

- In `tests/unit/main.test.js`:
  - Stub `fs.writeFileSync` to capture output instead of writing to disk.
  - Invoke `main` with valid flags for `quadratic` and `sine`, and assert that the resulting SVG string includes `<svg`, `polyline`, and correct numeric values for function data.
  - Verify that invoking `main` without flags prints the help message and exits without error.
  - Verify that invalid `--function` values cause the process to exit with a descriptive error message.

# Documentation

- Update `README.md`:
  - Add a section “Function Plotting” describing the new feature and showing example commands.
  - Document the SVG output format and default output path.
