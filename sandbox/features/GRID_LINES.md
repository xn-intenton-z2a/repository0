# GRID_LINES

Add support for drawing grid lines on both Cartesian and polar plots to improve readability and reference.

# CLI INTEGRATION

Introduce a new boolean flag `--grid`. When provided on the CLI for `--plot` or `--polar`, grid lines will be rendered behind the function polyline. Grid lines include evenly spaced horizontal and vertical lines for Cartesian plots and concentric circles plus radial lines for polar plots.

# HTTP ENDPOINT SUPPORT

Extend the `/plot` and `/polar` HTTP endpoints to accept an optional query parameter `grid=true`. When present, the server will inject grid line elements into the SVG response. The default behavior remains unchanged when the parameter is omitted.

# IMPLEMENTATION NOTES

Calculate major tick positions based on the provided range and resolution. For Cartesian plots, draw `<line>` elements at each tick with a light stroke. For polar plots, draw `<circle>` elements at radius ticks and `<line>` elements from center at angle ticks. Update `generatePlotSVG` and `generatePolarSVG` to accept a `grid` flag in their style parameters and insert grid elements before the polyline. Add unit and integration tests to verify grid lines appear when requested in both CLI and HTTP modes.