# Overview

Implement a plot subcommand in the sandbox CLI to generate SVG visualizations for supported mathematical functions.

# Commands

- plot <functionName>: Render an SVG polyline of the specified function based on sampled data points.
- Flags:
  - --xmin <number> (default -10): Lower bound of the x-axis.
  - --xmax <number> (default 10): Upper bound of the x-axis.
  - --samples <number> (default 100): Number of intervals to sample.
  - --output <filepath>: Write the generated SVG to a file instead of stdout.

# Implementation Details

1. Extend sandbox/source/main.js to detect the plot subcommand and parse the functionName argument.
2. Validate that functionName is provided and that it belongs to the supported set [quadratic, sine].
3. Generate x and y coordinate arrays over [xmin, xmax] with the specified samples.
4. Transform data points into SVG coordinate space with fixed width, height, and margins.
5. Assemble an <svg> container and a <polyline> element with the computed points and an id attribute set to functionName.
6. On missing or unsupported functionName, output a descriptive error to stderr and exit with code 1.
7. Respect the --output flag to write the SVG to disk or emit it to stdout.

# Tests

- Add tests in sandbox/tests/cli.test.js for error conditions:
  - Missing functionName: expect exit status 1 and an error message indicating function name is required.
  - Unsupported functionName: expect exit status 1 and an error listing supported functions.
- Retain existing tests for successful plotting of quadratic and sine functions with defaults and custom flags.
- Verify exit codes and stderr content for error cases.

# Documentation

- Update README.md to include the plot subcommand under Usage with examples for each supported function and flag.