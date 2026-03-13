# Mathematical Comparison Plotting

Enable comparative mathematical analysis through multi-expression plotting with automatic styling, legends, and relationship detection for comprehensive mathematical exploration.

## Purpose

Transform plot-code-lib into a powerful mathematical comparison tool that allows plotting multiple expressions simultaneously with intelligent visual differentiation, making it easy to explore mathematical relationships and function families like jq enables JSON comparison workflows.

## Acceptance Criteria

- Support multiple --expression flags in single commands for overlay plotting
- Add automatic color palette and line style differentiation for up to 8 expressions
- Include --labels flag for custom expression naming in legends
- Support --compare flag enabling mathematical relationship analysis (intersections, extrema)
- Add --family flag for plotting mathematical function families with parameter variation
- Include automatic legend generation with expression names and visual indicators
- Support --highlight flag for emphasizing specific expressions or relationships
- Add --combine flag for mathematical operations between expressions (sum, difference, ratio)
- Include smart axis scaling that accommodates all expressions optimally
- Support --annotate flag for automatic labeling of key points and intersections

## Technical Implementation

Extend PlotRenderer to handle multiple data series with distinct visual styling. Create automated color palette and line style assignment. Implement LegendRenderer for expression identification. Add mathematical analysis for intersection detection and relationship highlighting.

## Integration Points

- Extends existing PlotRenderer with multi-series rendering and legend capabilities
- Uses current ExpressionParser to handle array of mathematical expressions
- Builds on existing TimeSeriesGenerator for multiple coordinate data generation
- Compatible with all current output formats while supporting overlay visualizations
- Integrates with existing CLI argument parsing for seamless multi-expression workflow

## Example Usage

Function comparison: node src/lib/main.js -e "y=sin(x)" -e "y=cos(x)" -e "y=tan(x)" -r "x=-pi:pi" --labels "sine,cosine,tangent" -f trig-comparison.svg

Parameter family: node src/lib/main.js --family "y=x^n" --params "n=1,2,3,4" -r "x=-2:2" -f polynomials.svg

Relationship analysis: node src/lib/main.js -e "y=x^2" -e "y=2*x+3" -r "x=-3:3" --compare --annotate -f intersection-analysis.svg