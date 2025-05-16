# TICK_FORMATTING

Allow users to specify custom formatting of axis tick labels for Cartesian and polar plots to improve readability and localization.

# CLI INTEGRATION

• --xtick-format <fmt>
  Define a format string for X-axis tick labels. Uses notation similar to d3-format, e.g., ".2f" for two decimal places, ",.0%" for percentage. Applies when tickLabels are enabled.

• --ytick-format <fmt>
  Define a format string for Y-axis tick labels using the same specifier syntax as xtick-format.

Behavior:
  - When provided, format each numeric tick label using the specified format before rendering.
  - If omitted, labels use default JavaScript toString of the tick value.

# HTTP ENDPOINT SUPPORT

Extend /plot and /polar endpoints with new query parameters:

• xtickFormat=<fmt>
• ytickFormat=<fmt>

Validate that format strings are non-empty strings. On invalid specifiers, respond with HTTP 400 Bad Request and an explanatory message.

# IMPLEMENTATION NOTES

1. In sandbox/source/main.js, extend CLI parser to accept xtickFormat and ytickFormat flags.
2. In HTTP handlers, read params.get('xtickFormat') and params.get('ytickFormat') and validate.
3. Refactor generatePlotSVG and generatePolarSVG signatures to accept tickFormat options:
   { xtickFormat, ytickFormat, /* existing tick and grid options */ }
4. After computing tick positions (xticks, yticks), use a lightweight formatting library (for example, a subset of d3-format implemented inline) or simple regex-based replacements for common specifiers to convert numeric values to strings.
5. Pass formatted labels into <text> elements for ticks instead of raw numbers.

# TESTING

- Add unit tests in sandbox/tests/cli-interface.test.js to verify parsing of --xtick-format and --ytick-format flags, correct application of format to sample ticks, and error handling on invalid specifiers.
- Add integration tests in sandbox/tests/data-export.test.js to request /plot?function=quadratic&range=0,5&xtickFormat=",.0f" and assert tick labels in SVG match formatted values.

# DOCUMENTATION

- Update sandbox/docs/CLI_USAGE.md and sandbox/docs/HTTP_SERVER.md with descriptions and examples of xtick-format and ytick-format parameters.
- Update README.md feature list to include TICK_FORMATTING.