# PLOT_GENERATION

SVG and PNG plot generation system that transforms time series data into publication-ready visualizations with axes, grids, and styling.

## Overview

The plot generation feature converts mathematical data points into professional-quality vector and raster graphics. It handles coordinate transformation, axis generation, styling, and multiple output formats to serve both web and print applications.

## Key Capabilities

SVG plot generation:
- Generate publication-ready SVG plots from point data
- Automatic coordinate system transformation from data space to plot space
- Responsive viewBox system for scalable graphics
- Clean, semantic SVG structure for further customization

Visual elements and styling:
- Axis lines with automatic tick mark generation  
- Grid lines for easier value reading
- Customizable colors, stroke widths, and dimensions
- Professional typography with configurable fonts
- Background color and margin control
- Automatic data range padding for better visualization

PNG output capability:
- Convert SVG plots to PNG format using Sharp library
- Maintain high quality during raster conversion
- Support for different PNG compression settings
- Preserve aspect ratio and resolution

Advanced plotting features:
- Automatic data bounds calculation with outlier handling
- Smart axis labeling with appropriate decimal precision
- Title positioning and styling
- Multiple line styles and colors for future multi-series support
- Error handling for edge cases (empty data, extreme values)

## Technical Requirements  

Must generate valid, well-formed SVG that renders in all modern browsers
Must use Sharp library for reliable SVG to PNG conversion
Must handle data coordinate transformation mathematically correctly
Must generate readable axis labels with appropriate precision
Must support customizable dimensions from 100x100 to 2000x2000 pixels
Must include proper SVG namespace and encoding declarations
Must handle edge cases like single points, flat lines, or extreme ranges

## Acceptance Criteria

Generate valid SVG that passes W3C validation
Generate PNG files that open correctly in image viewers
Correctly transform data coordinates to plot coordinates
Generate appropriate axis tick marks and labels
Handle empty or single-point datasets gracefully
Support custom titles, colors, and dimensions
Maintain aspect ratios during format conversion
Generate plots with data ranges spanning multiple orders of magnitude
Performance: generate 800x600 SVG plot in under 50ms
Performance: convert SVG to PNG in under 200ms