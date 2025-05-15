# MULTI_PLOT

# Purpose
Allow users to plot multiple functions or expressions on the same axes in a single SVG, with distinct styling and optional legend.

# CLI Behavior
- Accept multiple --plot or --expression flags in one command, for example --plot quadratic --plot sine --expression Math.cos(x).
- Combine series styling by repeating styling flags per series or use a style cycle when a single styling set is provided.
- Add --legend flag to render an SVG legend with labels for each series.
- If only one series is provided, fallback to existing single-plot behavior.

# HTTP Endpoints
- Extend GET /plot to accept multiple function or expression parameters, for example ?function=quadratic&function=sine&expression=x%2B1.
- Support ?legend=true to include a legend in the SVG response.

# Implementation Details
- In CLI parsing, collect all occurrences of plot and expression flags into arrays.
- In HTTP handler, use searchParams.getAll for function and expression parameters.
- Generate data series for each plot, assign distinct colors if not explicitly set, and render multiple <polyline> elements within one SVG.
- When legend is enabled, include a legend block at the top right listing each series label with its corresponding color swatch.

# Testing
- Add CLI tests for multiple named functions and expressions generating SVG with multiple polyline tags and an optional legend.
- Add HTTP tests for /plot with repeated function and expression parameters and legend query.
- Verify error handling when no series or invalid series are provided.

# Documentation
- Update CLI_USAGE.md, HTTP_SERVER.md, and README.md to describe multi-plot syntax, styling per series, and legend option.