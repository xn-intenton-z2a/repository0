# Multi Function Plotting  

Enable plotting multiple mathematical expressions on the same coordinate system with distinct visual styling to compare functions.

## Purpose

Extend the current single-expression plotting to support multiple functions on one plot. Users can compare mathematical relationships, visualize transformations, and analyze function behavior side-by-side.

## Acceptance Criteria

- Accept multiple --expression flags in CLI (currently only last one renders)
- Render each function with different colors from predefined palette
- Support up to 6 functions per plot with distinct line colors
- Include simple legend showing function expressions and colors  
- Auto-scale axes to encompass all plotted functions
- Handle functions with different mathematical domains gracefully
- Provide clear visual distinction in both SVG and PNG outputs

## Technical Implementation

Modify CLI argument parsing to collect multiple expressions into array. Update PlotRenderer.renderSVG to accept array of data series and render with color palette. Add legend generation to SVG output.

## Integration Points

- Extends existing CLI interface to handle multiple --expression flags
- Builds on current PlotRenderer class with multi-series support
- Uses existing TimeSeriesGenerator for each expression
- Maintains backward compatibility for single expressions

## Example Usage

Plot trigonometric functions together:
node src/lib/main.js --expression "y=sin(x)" --expression "y=cos(x)" --range "x=-pi:pi" --file trig.svg

Compare polynomial degrees:
node src/lib/main.js --expression "y=x" --expression "y=x^2" --expression "y=x^3" --range "x=-2:2" --file polynomials.png

## Visual Design

Use color palette: blue, red, green, orange, purple, brown for up to 6 functions. Position legend in upper-right corner to avoid plot area obstruction.