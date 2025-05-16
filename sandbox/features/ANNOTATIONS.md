# ANNOTATIONS

Provide options to include a title and axis labels in generated SVG plots to improve readability and context.

# CLI INTEGRATION

Add support in the CLI for three new flags: --title, --xlabel, --ylabel. These flags apply to both Cartesian and polar plots. When provided, the title text is centered at the top of the SVG, the X-axis label is centered at the bottom, and the Y-axis label is rotated and centered along the left side. All text elements inherit stroke color and size styles by default, with sensible fallbacks.

# HTTP ENDPOINT SUPPORT

Extend the /plot and /polar HTTP endpoints to accept optional query parameters: title, xlabel, ylabel. When these parameters are present, the server will inject the corresponding text annotations into the SVG response. The content type remains image/svg+xml.

# IMPLEMENTATION NOTES

Modify the generatePlotSVG and generatePolarSVG functions to append SVG text elements at calculated coordinates based on viewBox dimensions. Ensure text elements use appropriate font size and alignment attributes. Update unit and integration tests to verify that title and axis label text appears in both CLI-generated files and HTTP responses.