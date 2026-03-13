# Multi-Expression Plotting

Enable plotting multiple mathematical expressions on a single graph with proper styling and legend support for comparative mathematical analysis.

## Purpose

Enhance plot-code-lib to handle multiple expressions simultaneously, creating overlay plots that enable mathematical comparison, relationship analysis, and comprehensive visualization in a single output file.

## Acceptance Criteria

- Support multiple --expression flags in a single command for overlay plotting
- Add automatic color coding and line styling for different expressions
- Include legend generation with expression labels and visual indicators
- Support --label flag for custom naming of each expression in the legend
- Add transparency and line style options for visual distinction between plots
- Include mathematical relationship highlighting (intersections, differences)
- Support expression comparison with automatic range optimization
- Add grid and axis labeling appropriate for multi-expression visualization
- Include plot title generation that summarizes the mathematical relationships
- Support selective expression visibility toggles for complex multi-plot analysis

## Technical Implementation

Extend PlotRenderer class to handle multiple data series with distinct visual styling. Create LegendGenerator class for automatic legend creation. Add color palette management and line style variation. Implement mathematical intersection detection for relationship analysis.

## Integration Points

- Builds on existing PlotRenderer with multi-series rendering capabilities
- Uses current ExpressionParser for parsing multiple mathematical expressions
- Extends existing CLI interface with multiple expression support
- Compatible with all current output formats and file saving functionality
- Works with existing TimeSeriesGenerator for multiple coordinate data series

## Example Usage

Compare functions: node src/lib/main.js -e "y=sin(x)" -e "y=cos(x)" -r "x=0:2*pi" -f trig.svg

Labeled comparison: node src/lib/main.js -e "y=x^2" --label "quadratic" -e "y=2*x+1" --label "linear" -r "x=-3:3" -f comparison.svg

Mathematical family: node src/lib/main.js -e "y=sin(x)" -e "y=sin(2*x)" -e "y=sin(3*x)" -r "x=0:2*pi" -f harmonics.svg