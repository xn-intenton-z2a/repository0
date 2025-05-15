# DATA_MARKERS

# Purpose
Allow users to highlight individual data points by rendering markers (circles) at each sample point on both Cartesian and polar plots for improved readability and emphasis of discrete samples.

# CLI Behavior
- Introduce a boolean flag --markers to enable drawing markers on each data point.
- Add options --marker-size to specify marker radius in pixels (default: 3) and --marker-color to set marker fill color (default: uses stroke color).
- When --markers is present:
  - Parse marker-size and marker-color from argv.
  - After generating SVG polyline, append <circle> elements for each data point with coordinates x and y, r set to marker-size, and fill set to marker-color.
- Markers should be rendered on top of the polyline.

# HTTP Endpoints
- Extend GET /plot and GET /polar endpoints to accept query parameters markers=true, markerSize=<number>, markerColor=<string>.
- Validate markerSize is a positive number and markerColor is a non-empty string.
- When markers=true:
  - After generating the <polyline>, insert <circle> elements into the SVG response for each data point matching CLI behavior.
- Return 400 status on invalid markerSize or markerColor values.

# Implementation Details
- In handlePlot and handlePolar in sandbox/source/main.js:
  - Read argv.markers, argv['marker-size'], argv['marker-color'].
  - Pass marker settings into generatePlotSVG and generatePolarSVG style/config parameter.
- In generatePlotSVG and generatePolarSVG functions:
  1. Compute data array as before.
  2. Build polyline element.
  3. If markers enabled:
     - Iterate over data array and generate strings for each <circle cx="{x}" cy="{y}" r="{size}" fill="{color}"/>.
     - Insert marker elements immediately after polyline in SVG markup.
- Ensure ordering is correct: background <rect>, grid/axes, polyline, then markers.

# Testing
- Add sandbox/tests/markers.test.js covering:
  - CLI: --plot sine --markers generates SVG containing multiple <circle> elements at sample coordinates.
  - CLI: --polar rose --markers --marker-size 5 --marker-color red generates circles of radius 5 and fill red.
  - CLI error when marker-size is zero or negative exits with code 1 and descriptive message.
  - HTTP: GET /plot?function=quadratic&range=0,2&markers=true returns SVG with <circle> tags and correct attributes.
  - HTTP: invalid markerSize or markerColor returns 400 with descriptive message.

# Documentation
- Update sandbox/docs/CLI_USAGE.md under Cartesian and polar options to document --markers, --marker-size, and --marker-color with examples.
- Update sandbox/docs/HTTP_SERVER.md to document markers, markerSize, and markerColor query parameters.
- Update README.md features section to include Data Markers Support.