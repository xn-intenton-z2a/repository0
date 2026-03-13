# Multi-Expression Plotting

Enable plotting multiple mathematical expressions on the same coordinate system with distinct styling and legend support.

## Purpose

Allow users to compare and analyze multiple mathematical functions simultaneously, providing better insight into function relationships, transformations, and mathematical concepts through visual comparison.

## Acceptance Criteria

- Support multiple --expression flags in single CLI command
- Render each function with different colors from predefined palette
- Include automatic legend showing expressions and corresponding colors
- Support up to 6 simultaneous functions with distinct visual styling
- Auto-scale axes to encompass all plotted function domains
- Handle functions with different mathematical ranges gracefully
- Provide clear visual distinction in both SVG and PNG outputs
- Support line style variations (solid, dashed, dotted) for additional distinction
- Include function labels and mathematical notation in legend

## Technical Implementation

Modify CLI argument parsing to collect multiple expressions into array. Update PlotRenderer to handle multiple data series with color and style differentiation. Add legend generation to SVG and PNG outputs.

## Integration Points

- Extends existing CLI interface to handle multiple expressions
- Builds on current PlotRenderer with multi-series capabilities
- Uses existing TimeSeriesGenerator for each individual expression
- Maintains backward compatibility for single expression usage
- Works with current web interface for interactive multi-function plotting

## Example Usage

Plot trigonometric comparison: node src/lib/main.js --expression "y=sin(x)" --expression "y=cos(x)" --expression "y=tan(x/2)" --range "x=-pi:pi" --file trig-comparison.svg

Analyze polynomial degrees: node src/lib/main.js --expression "y=x" --expression "y=x^2" --expression "y=x^3" --range "x=-2:2" --file polynomials.png