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
