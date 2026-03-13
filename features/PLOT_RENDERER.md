# Plot Renderer

Render mathematical plots as SVG and PNG files from time series coordinate data.

## Purpose

This feature transforms coordinate data into visual plots by rendering them as scalable vector graphics (SVG) or portable network graphics (PNG) files. The renderer should create publication-quality plots with proper axes, labels, and scaling.

## Acceptance Criteria

- Render coordinate data as line plots in SVG format
- Export SVG plots to PNG format with configurable resolution
- Generate proper coordinate axes with tick marks and labels
- Auto-scale plots to fit data range with appropriate margins
- Support customizable plot dimensions and styling
- Add grid lines for better readability
- Include axis labels and optional plot titles
- Handle multiple data series on same plot
- Support different line styles and colors for multiple functions

## Technical Implementation

The renderer should use D3.js for SVG generation (scales, axes, path generators) and Sharp for PNG export from SVG. D3.js provides professional visualization capabilities with proper coordinate scaling, axis generation, and path creation. Sharp enables high-performance image conversion from SVG to PNG format.

## Integration Points

- Receives coordinate data from Time Series Generator feature
- Provides final output files for CLI tool
- Integrates with web interface for live plot preview
- Supports both command-line and programmatic usage
- File output matches CLI --file parameter specification

## Example Usage

```
// Library API
const renderer = new PlotRenderer();
const svgContent = renderer.renderSVG(coordinateData, {
  width: 800,
  height: 600,
  title: "y = sin(x)"
});
await renderer.savePNG(svgContent, "plot.png");

// CLI usage
node src/lib/main.js --expression "y=cos(x)" --range "x=-2*pi:2*pi" --file output.svg
node src/lib/main.js --expression "y=x^3-x" --range "x=-2:2" --file plot.png
```

## Output Quality

Generated plots should be professional quality with clear lines, readable text, and proper proportions suitable for documentation, presentations, or scientific publication.