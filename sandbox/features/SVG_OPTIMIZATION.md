# SVG Optimization

# Purpose
Integrate automatic SVG minification and optimization to reduce file size and improve rendering performance of generated plots.

# CLI Behavior
- Introduce a --minify-svg flag for plot and polar commands. When present, run optimization on the generated SVG before writing to disk.
- By default, SVG output remains unmodified.

# HTTP Behavior
- Accept a minify=true query parameter on /plot and /polar endpoints. When specified, optimize the SVG before responding.
- Respond with Content-Type image/svg+xml regardless of optimization.

# Implementation Details
- Add SVGO to dependencies and import its optimize function.
- After building the SVG string in handlePlot and handlePolar, check for the flag or query parameter.
- If optimization is requested, call optimize on the SVG string with default SVGO plugins.
- On optimization errors, emit a warning to stderr and fall back to the original SVG string.
- Apply the same logic for both file writing and HTTP responses.

# Testing
- Create sandbox/tests/svg-optimization.test.js covering:
  - CLI: --plot quadratic --minify-svg produces a file smaller than without the flag.
  - HTTP: GET /plot?function=quadratic&range=0,5&minify=true returns valid optimized SVG with expected tags.
  - Simulate SVGO failure and verify fallback to unoptimized SVG and warning logged.

# Documentation
- Update sandbox/docs/CLI_USAGE.md to document the --minify-svg flag under plot and polar sections.
- Update sandbox/docs/HTTP_SERVER.md to document the minify query parameter.
- Update README.md features section to describe SVG optimization.