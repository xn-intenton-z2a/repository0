sandbox/features/DEPENDENCY_REPORTER.md
# sandbox/features/DEPENDENCY_REPORTER.md
# Overview

This feature adds the ability to generate a report of the project’s dependencies and devDependencies by reading the package.json file. It extends the main module to offer both a programmatic API and a CLI command to produce the report in JSON or Markdown format.

# Functionality

- Introduce function generateDependencyReport(options) that reads package.json and returns a formatted string.
- Accept options.format with values json or markdown (default markdown).
- Accept options.fields with values dependencies, devDependencies, or all (default all).
- Return a string containing either a JSON object or a Markdown table listing package names and versions.

# API

Exported function: generateDependencyReport(options)
- options: object with:
  - format: string (json or markdown)
  - fields: string (dependencies, devDependencies, or all)
- returns: string containing the formatted report

# CLI Behavior

Extend src/lib/main.js to parse new flags:
- --report-deps=<format> where format is json or markdown
- --report-fields=<fields> where fields is dependencies, devDependencies, or all
- --output=<file> optional file path to write the report; if omitted, output to stdout

When invoked with npm run start -- --report-deps=json --report-fields=all --output=deps.json, the CLI will:
- Call generateDependencyReport with appropriate options
- Write the resulting JSON string to deps.json or print to stdout

# Testing

- Add unit tests for generateDependencyReport:
  - Verify output JSON for a known package.json fixture
  - Verify output Markdown contains correct header and table rows
  - Test format and fields combinations
- Add CLI integration tests:
  - Invoke main with process.argv set to include report flags
  - Capture stdout or file output and verify content matches expected report

# README Updates

- Document new API function and its options
- Provide CLI usage examples for both JSON and Markdown output
- Show sample outputs in the README
sandbox/features/JSON_EXPORT.md
# sandbox/features/JSON_EXPORT.md
# Overview

This feature adds the ability to export computed plot data in JSON format. It complements existing CSV data export and HTML report features by providing a native JSON output. The feature extends the main library module, CLI, README, and unit tests to support JSON data export alongside existing SVG, CSV, and HTML outputs.

# Functionality

- Introduce function generateJsonForFunction(functionDefinition, options) that:
  - Samples the function over the specified domain using the existing generateDataPoints function or similar sampling logic.
  - Returns a JSON string representing an array of objects, each with x and y properties for each sampled point.
- Programmatic usage:
  - Export generateJsonForFunction from the main module alongside other data export functions.
- CLI integration:
  - Add a new flag --export-json=<file> to src/lib/main.js. When provided, the CLI writes the JSON string to the specified file instead of producing an SVG or CSV output.

# API

Exported function: generateJsonForFunction(functionDefinition, options)

- functionDefinition: a callback f(x) returning y.
- options: object with:
  - minX: number (inclusive lower bound).
  - maxX: number (inclusive upper bound).
  - steps: integer (number of sample points).
- returns: string containing a valid JSON array of objects with x and y keys.

# CLI Behavior

Extend src/lib/main.js to parse new flag:
- --export-json=<file> where <file> is the output path for the JSON report.

When invoked with:
  npm run start -- type quadratic 1 0 0 -10 10 200 --export-json data.json
The CLI will:
- Parse function type and parameters.
- Call generateJsonForFunction with the provided options.
- Write the resulting JSON string to data.json, creating or overwriting the file.

If --export-json is omitted, existing behavior for SVG plotting, CSV export, and HTML report remains unchanged.

# Testing

- Unit tests for generateJsonForFunction:
  - Validate that the returned string is valid JSON and parses to an array of the correct length.
  - Verify that for a simple function, e.g. f(x) = x, the array contains expected x and y values in proper order.
- CLI integration tests:
  - Simulate process.argv including --export-json flag and capture file output.
  - Verify that the file exists and contains a valid JSON array matching the sampled data.

# README Updates

- Document the new generateJsonForFunction API and its options under the API reference section.
- Provide CLI usage examples for exporting JSON data, including an example invocation and a sample of the generated JSON output.
sandbox/features/POLAR_PLOTTER.md
# sandbox/features/POLAR_PLOTTER.md
# Overview

This feature adds the capability to generate plots of functions defined in polar coordinates by sampling angles over a specified range and converting each point to Cartesian coordinates for SVG rendering. It extends the main library, CLI, README, and tests to support polar plot generation alongside existing Cartesian plotting functionality.

# Functionality

- Introduce function generatePolarPlot(functionDefinition, options) that:
  - Samples angles uniformly between options.minTheta and options.maxTheta (in radians).
  - Computes x = r * cos(theta) and y = r * sin(theta) for each sampled point where r = functionDefinition(theta).
  - Returns a string containing valid SVG markup of the polar curve path.
- Options object includes:
  - minTheta: number (inclusive starting angle in radians).
  - maxTheta: number (inclusive ending angle in radians).
  - steps: integer (number of sample points, default 100).
  - width: integer (SVG canvas width in pixels, default 400).
  - height: integer (SVG canvas height in pixels, default 400).
  - strokeColor: string (SVG stroke color for the curve, default black).
  - strokeWidth: number (stroke width in pixels, default 2).

# API

Exported function: generatePolarPlot(functionDefinition, options)

- functionDefinition: a callback f(theta) returning radius r.
- options: object as defined above.
- returns: string containing an SVG document embedding the polar plot.

# CLI Behavior

Extend src/lib/main.js to parse new flags for polar plot:
- type polar minTheta maxTheta steps width height outputPath --stroke-color <color> --stroke-width <width>

When invoked with:
 npm run start -- type polar 0 6.283 200 600 600 polar.svg --stroke-color red --stroke-width 3

the CLI will:
- Call generatePolarPlot with the provided options.
- Write the resulting SVG string to polar.svg or stdout if no file is specified.

# Testing

- Add unit tests for generatePolarPlot:
  - Test a linear radial function (e.g., f(theta) = theta) and verify SVG path commands approximate the correct spiral.
  - Verify that width and height attributes match options.
  - Test custom strokeColor and strokeWidth appear correctly in the SVG output.
- Add CLI integration tests:
  - Simulate process.argv for the polar type and capture stdout or file output.
  - Verify the produced file starts with `<svg` and contains expected path `<path` elements.

# README Updates

- Document generatePolarPlot API and options in README.md under an API reference section.
- Provide CLI usage examples for polar plotting, including custom styling flags.
- Include a sample snippet of the generated SVG markup.sandbox/features/EQUATION_PLOTTER.md
# sandbox/features/EQUATION_PLOTTER.md
# Overview
This feature adds a library and command line interface for plotting mathematical functions as SVG images. It extends the main module to accept plot parameters, compute point samples, and render a complete SVG output.

# Functionality
It supports:
- Quadratic plots with coefficients a, b, c
- Sine wave plots with amplitude, frequency, and phase
- Custom domain bounds, resolution (number of steps), and SVG canvas size
- CLI invocation via the existing main entry point to write SVG output to a file
- Programmatic invocation via an exported generateSvgPlot function that returns a SVG string

# API
Exported function: generateSvgPlot(functionDefinition, options)
- functionDefinition: a callback f(x) returning y
- options: object with minX, maxX, steps, width, height
- returns a string containing valid SVG markup

CLI behavior in src/lib/main.js:
- Read arguments: type, coefficients or parameters, domain bounds, steps, width, height, output path
- Call generateSvgPlot with appropriate function and options
- Write SVG string to output file

# Usage
Use the CLI:
 npm run start -- type quadratic 1 0 0 -10 10 200 800 600 plot.svg
 npm run start -- type sine 5 2 0 -3.14 3.14 300 600 400 sine.svg

Use programmatically:
 import { generateSvgPlot } from src/lib/main.js
 const svg = generateSvgPlot(x => x * x, { minX: -5, maxX: 5, steps: 100, width: 500, height: 400 })

# Testing
Add unit tests that:
- Invoke generateSvgPlot for known functions and check that the returned string contains expected SVG path data
- Verify that SVG width and height attributes match options
- Test CLI invocation writes a file with correct SVG header and path elementsandbox/features/DATA_EXPORT.md
# sandbox/features/DATA_EXPORT.md
# Overview

This feature adds the ability to export the computed plot data points as CSV. It extends the library, CLI, README, and tests to support data point generation and CSV output alongside existing SVG plotting.

# Functionality

- Introduce function generateDataPoints(functionDefinition, options) that returns an array of objects with x and y values sampled over a domain.
- Introduce function generateCsvForFunction(functionDefinition, options) that returns a CSV string with header x,y and each row representing a sampled point.
- Extend the CLI in src/lib/main.js to accept an --export-csv flag with an output path. When provided, CSV is written instead of SVG.
- Programmatic usage: export generateDataPoints and generateCsvForFunction from main module.

# API

Exported functions:
- generateDataPoints(functionDefinition, options)
- generateCsvForFunction(functionDefinition, options)

Options object includes:
- minX: number (inclusive lower bound)
- maxX: number (inclusive upper bound)
- steps: integer (number of sample points)

# CLI Behavior

When invoked with:
 npm run start -- type quadratic 1 0 0 -10 10 200 --export-csv data.csv
The CLI will:
- Parse function type and parameters
- Call generateCsvForFunction with options
- Write the resulting CSV string to data.csv

If --export-csv is omitted, SVG plotting behavior remains unchanged.

# Testing

Add unit tests to:
- Verify generateDataPoints returns the correct number of points and correct values for simple functions.
- Verify generateCsvForFunction returns a well-formed CSV string with correct header and rows.
- Test CLI invocation with --export-csv writes a file containing the expected CSV content.

# README Updates

Update README.md usage section to show examples of CSV export and describe the new programmatic APIs.
sandbox/features/PARAMETRIC_PLOTTER.md
# sandbox/features/PARAMETRIC_PLOTTER.md
# Overview

This feature adds the capability to generate plots from parametric equations by sampling parameters over a specified range and converting each point to Cartesian coordinates for SVG rendering. It extends the main library, CLI, README, and tests to support parametric plot generation alongside existing Cartesian and polar plotting functionality.

# Functionality

- Introduce function generateParametricPlot(xFunction, yFunction, options) that:
  - Samples parameter t uniformly between options.minT and options.maxT (inclusive).
  - Computes x = xFunction(t) and y = yFunction(t) for each sampled point.
  - Returns a string containing valid SVG markup of the parametric curve path.
- Options object includes:
  - minT: number (inclusive starting parameter value, default 0).
  - maxT: number (inclusive ending parameter value, default 1).
  - steps: integer (number of sample points, default 100).
  - width: integer (SVG canvas width in pixels, default 400).
  - height: integer (SVG canvas height in pixels, default 400).
  - strokeColor: string (SVG stroke color for the curve, default black).
  - strokeWidth: number (stroke width in pixels, default 2).

# API

Exported function: generateParametricPlot(xFunction, yFunction, options)

- xFunction: a callback f(t) returning x coordinate.
- yFunction: a callback f(t) returning y coordinate.
- options: object as defined above.
- returns: string containing an SVG document embedding the parametric plot.

# CLI Behavior

Extend src/lib/main.js to parse new flags for parametric plot:
- type parametric minT maxT steps width height outputPath --stroke-color <color> --stroke-width <width>

When invoked with:
  npm run start -- type parametric 0 6.28 200 600 600 parametric.svg --stroke-color blue --stroke-width 3

the CLI will:
- Call generateParametricPlot with xFunction and yFunction callbacks derived from argument definitions.
- Write the resulting SVG string to parametric.svg or stdout if no file is specified.

# Testing

- Add unit tests for generateParametricPlot:
  - Test simple linear parametric functions, e.g. x(t) = t, y(t) = t and verify SVG path commands form a straight line.
  - Verify width, height, strokeColor, and strokeWidth attributes match options.
- Add CLI integration tests:
  - Simulate process.argv for the parametric type with example functions provided as module imports or inline definitions in tests.
  - Capture stdout or file output and verify it starts with <svg and contains expected <path elements.

# README Updates

- Document generateParametricPlot API and options in README.md under an API reference section.
- Provide CLI usage examples for parametric plotting, including custom styling flags.
- Include a sample snippet of the generated SVG markup.sandbox/features/HTML_REPORT.md
# sandbox/features/HTML_REPORT.md
# Overview

This feature adds the capability to generate a self-contained HTML report that combines the SVG plot and a data table of sampled points for a given mathematical function. It extends the main library, CLI, README, and tests to support HTML report generation alongside existing CSV and SVG outputs.

# Functionality

- Introduce function generateHtmlReport(functionDefinition, options) that:
  - Samples the function over the specified domain using generateDataPoints.
  - Renders the SVG plot via generateSvgPlot.
  - Constructs an HTML document embedding the SVG and a table of x, y values.
- Options object includes:
  - minX: number (inclusive lower bound)
  - maxX: number (inclusive upper bound)
  - steps: integer (number of sample points)
  - width: integer (SVG canvas width)
  - height: integer (SVG canvas height)
  - title: string (optional HTML report title)
- Output is a string containing a complete HTML document with embedded styles.

# API

Exported function: generateHtmlReport(functionDefinition, options)
- functionDefinition: a callback f(x) returning y
- options: object with:
  - minX, maxX, steps, width, height as above
  - title: optional string
- returns: string containing valid HTML markup

# CLI Behavior

Extend src/lib/main.js to parse new flags:
- --report-html=<file> where <file> is the output path for the HTML report
When invoked with:
  npm run start -- type quadratic 1 0 0 -10 10 200 800 600 --report-html report.html
The CLI will:
- Parse function type and parameters
- Call generateHtmlReport with options
- Write the resulting HTML string to report.html
If --report-html is omitted, the CLI falls back to SVG or CSV behavior based on existing flags.

# Testing

- Add unit tests for generateHtmlReport:
  - Verify returned HTML contains html, head, body, svg, and table elements
  - Verify table rows match sampled x,y points for a simple function
- Add CLI integration test:
  - Invoke main with process.argv including --report-html flag
  - Capture file output and verify it begins with <!DOCTYPE html> and contains expected SVG and table markup

# README Updates

- Document the new generateHtmlReport API and its options in the API reference section
- Provide CLI examples showing how to generate an HTML report
- Include a sample snippet of the generated HTML structure