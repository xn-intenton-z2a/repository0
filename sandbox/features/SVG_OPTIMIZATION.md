# SVG Optimization

Enable minification and optimization of generated SVG outputs to reduce file size, remove unnecessary metadata, and accelerate client load times.

# CLI Integration

• --optimize-svg (boolean)
  When present on plot, plots, or polar commands:
  1. Generate the SVG string as usual in memory.
  2. Invoke SVGO to optimize and minify the SVG markup.
  3. Write the optimized SVG to the output path (default .svg filename or as specified by --output).
  4. If interactive HTML mode is requested, optimize only the SVG fragment before embedding in the HTML scaffold.

# HTTP Endpoint Support

Extend the /plot and /polar endpoints with query parameter:

• optimizeSvg=true
  When present:
  1. After building the SVG string (or before wrapping in HTML), run the optimizer.
  2. Send the optimized SVG with Content-Type image/svg+xml, or optimized SVG inlined within HTML when format=html.

# Implementation Notes

1. Add svgo to package.json dependencies (e.g., "svgo": "^3.0.0").
2. In sandbox/source/main.js import the optimize function from svgo.
3. In handlePlot and handlePolar (both CLI and HTTP paths), after constructing the svgString:
   • Detect argv["optimize-svg"] or params.get('optimizeSvg') === 'true'.
   • Call optimize(svgString, { multipass: true }) to obtain { data }.
   • Replace svgString with the optimized data before writing or sending.
4. Ensure that the HTML wrapper preserves the HTML scaffold and only replaces the inner SVG markup with the optimized version.
5. On optimization errors, report an error and exit with code 1 (CLI) or respond with HTTP 500 (server).

# Testing

Add unit tests in sandbox/tests/cli-interface.test.js:
  - Verify that --optimize-svg produces an SVG file that is valid but lacks redundant whitespace, comments, and metadata sections.
  - Test that combining --interactive with --optimize-svg yields an HTML file whose inline SVG is optimized.

Add integration tests in sandbox/tests/data-export.test.js:
  - Fetch /plot?function=quadratic&range=0,5&optimizeSvg=true and assert the response SVG size is smaller than without optimization and contains no <!-- --> comments.
  - Fetch /polar?function=rose&radius-range=0,1&angle-range=0,6.28&optimizeSvg=true&format=html and assert HTML contains optimized SVG fragment and script tag.

# Documentation

Update sandbox/docs/CLI_USAGE.md:
  - Add entry for --optimize-svg under SVG options.

Update sandbox/docs/HTTP_SERVER.md:
  - Add optimizeSvg parameter under /plot and /polar query parameters.

Update README.md feature list to include SVG_OPTIMIZATION.