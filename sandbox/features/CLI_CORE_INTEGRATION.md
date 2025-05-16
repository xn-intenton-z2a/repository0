# CLI_CORE_INTEGRATION

Provide a unified integration of all sandbox plotting options into the core CLI entrypoint and update the README with clear usage examples.

## CLI Integration

Extend the CLI parser in sandbox/source/main.js to recognize and handle the existing sandbox feature flags and options as built-in options:

• grid: boolean flag to draw grid lines on Cartesian and polar plots (--grid)
• fill-area: boolean flag to shade area under curve (--fill-area)
• title, xlabel, ylabel: annotation flags for adding text labels
• expressions: single or comma-separated list of custom mathematical expressions (--expression, --expressions)
• width, height: SVG dimension flags (already present)
• log-scale: apply base-10 log scaling to x, y, or both
• xticks, yticks: specify number of ticks on axes
• tick-labels/no-tick-labels: enable or suppress numeric tick labels
• legend: comma-separated labels for data series (--legend)
• input-data and summary-output: flags to import external CSV/JSON data and generate summary statistics

In handlePlot and handlePolar:
  • Parse and validate each of these flags using minimist and custom validation logic.
  • Pass all recognized options as parameters into generatePlotSVG and generatePolarSVG.
  • Ensure --export-data and HTTP export logic remains unchanged in precedence.

In the HTTP server handlers (/plot, /polar):
  • Read the same query parameters (grid, fillArea, title, xlabel, ylabel, expressions, logScale, xticks, yticks, tickLabels, legend, inputData).
  • Validate and forward them to the SVG generator functions.
  • Return 400 Bad Request on invalid values.

## README Updates

Update the top-level README.md with examples demonstrating the combined usage of the new flags:

• Drawing grid lines with --grid
• Shading area using --fill-area
• Adding annotations (--title, --xlabel, --ylabel)
• Plotting custom functions and multiple series (--expression, --expressions)
• Adjusting dimensions (--width, --height)
• Applying log-scale transformations (--log-scale)
• Controlling tick marks and labels (--xticks, --yticks, --tick-labels, --no-tick-labels)
• Displaying legends (--legend)
• Importing external data and generating summaries (--input-data, --summary-output)

Include at least two combined examples in the usage section showing real-world command invocations.

## Implementation Notes

1. Add new flags to the minimist configuration in sandbox/source/main.js.
2. Update handlePlot() and handlePolar() functions to extract and validate new options and incorporate them into existing SVG generation calls.
3. Extend generatePlotSVG() and generatePolarSVG() signatures in sandbox/source/main.js to accept the new option parameters (grid, fillArea, annotations, multiSeries, tickOptions, legendOpts, dataImport).
4. Modify HTTP handlers in startServer() to parse the corresponding URL parameters and propagate to SVG generators.
5. Update sandbox/docs/CLI_USAGE.md and top-level README.md with combined usage examples and flag descriptions.
6. Add or update unit tests in sandbox/tests/cli-interface.test.js to cover CLI parsing of each new flag and integration tests in sandbox/tests/data-export.test.js to verify HTTP SVG endpoints respect the new options.