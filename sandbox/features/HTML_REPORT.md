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