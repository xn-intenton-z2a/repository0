# LEGEND

Support rendering a legend box on SVG outputs that identifies each polyline or data series with its label and style. The legend appears in the top-right corner of the plot and lists colored line markers alongside corresponding text labels for each series.

# CLI_INTEGRATION

Add a new flag --legend that accepts a comma-separated list of labels. When provided on the CLI with --plot, --polar, or multi-series commands, the labels are assigned in order to each polyline or data series. If the number of labels does not match the number of series, the CLI reports an error and exits. The legend group is appended after drawing the plot, with a light background rectangle and a vertical list of entries showing a small line swatch in each series color and the associated label.

# HTTP_ENDPOINT_SUPPORT

Extend the /plot, /polar, and multi-series HTTP endpoints to accept an optional query parameter legend containing comma-separated labels. When present, the server parses the legend labels, validates the count against series, and injects a <g> element in the SVG response containing the legend box and entries. If validation fails, respond with 400 Bad Request and an error message.

# IMPLEMENTATION_NOTES

Modify generatePlotSVG and generatePolarSVG signatures to accept an optional legend array and series styles. After rendering grid lines, data polylines, and annotations, append a <g> element positioned using viewBox margins. Draw a background <rect> sized to fit the number of entries and then, for each label, draw a short <line> segment with the series strokeColor and a <text> element beside it. Update sandbox/source/main.js CLI parser to split argv.legend into an array and include it when calling SVG generators. Extend HTTP handlers to parse params.get('legend') and pass legend array. Add unit tests in sandbox/tests/cli-interface.test.js to verify legend flag behavior and in sandbox/tests/data-export.test.js to verify the legend appears in HTTP SVG responses. Document the new option and examples in README.md, sandbox/docs/CLI_USAGE.md, and sandbox/docs/HTTP_SERVER.md.