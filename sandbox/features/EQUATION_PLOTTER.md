# Overview
This feature adds a plot command to the CLI tool that generates an SVG representation of a specified mathematical function. The initial implementations support quadratic and sine functions. Users can produce vector graphics output suitable for embedding in HTML, documentation, or further processing.

# CLI Usage
The plot command supports two function types:

- plot quadratic a b c [-o outputFile]
  Users supply three numeric coefficients a, b, and c. The command generates an SVG displaying y = a x^2 + b x + c over a fixed domain.

- plot sine amplitude frequency [-o outputFile]
  Users supply amplitude and frequency values. The command generates an SVG displaying y = amplitude * sin(frequency * x) over a fixed domain.

If outputFile is provided the SVG is written to that file. Otherwise the SVG is written to stdout.

# Implementation Details
1. Extend main(args) to detect the plot command and dispatch to a plotting function.
2. Parse and validate positional arguments using minimist. Provide clear error messages on missing or invalid parameters.
3. Compute a fixed number of sample points (for example 100 points) over a normalized x range such as -10 to +10.
4. Generate an SVG string with a polyline or path element that connects the computed points. Use a fixed viewport size (for example width 500 and height 300) and scale the computed values accordingly.
5. Import fs/promises to write the SVG string to a file if the -o flag is present, otherwise write to process.stdout.
6. Implement appropriate exit codes: zero on success, non-zero on argument parsing or file write errors.

# File Changes
- src/lib/main.js: Add dispatch for plot command, argument parsing, numeric validation, sample computation, SVG string generation, file I O, and error handling.
- sandbox/tests/plot.test.js: Create unit tests covering both quadratic and sine modes, verifying that the generated SVG string includes an opening svg tag and a path or polyline element, testing both stdout and file write behavior.
- README.md: Document the new plot command under CLI Usage with two examples: one for quadratic and one for sine, showing both stdout and file output.
- package.json: Ensure minimist dependency is used for argument parsing and no additional dependencies are added.