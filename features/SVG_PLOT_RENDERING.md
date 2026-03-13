# SVG Plot Rendering

Generate publication-ready SVG plots with professional styling, proper scaling, axes, and grid lines for mathematical visualization.

## Purpose

Create high-quality SVG plots that are suitable for academic, educational, and professional use by providing proper mathematical plot formatting with clear axes, readable labels, grid lines, and scalable vector graphics that look professional in any context.

## Acceptance Criteria

- Generate clean SVG plots with proper mathematical plot formatting and scaling
- Include labeled X and Y axes with automatic tick mark generation and scaling
- Add grid lines for easy value reading and professional appearance
- Support customizable plot dimensions with sensible defaults (800x600)
- Include plot titles derived from mathematical expressions for clarity
- Implement automatic axis scaling based on data range for optimal visualization
- Add proper margins and spacing for axis labels and plot titles
- Support mathematical notation in axis labels and titles where appropriate
- Generate valid, clean SVG markup compatible with web browsers and vector graphics software
- Include proper font selection and sizing for readability across different display sizes

## Technical Implementation

Enhance PlotRenderer class with comprehensive SVG generation using D3.js scales and axis utilities. Add automatic tick generation and formatting. Implement proper axis labeling with mathematical notation support. Create clean SVG markup with proper styling and structure. Add responsive sizing and professional typography.

## Integration Points

- Builds on existing PlotRenderer class with enhanced SVG generation capabilities
- Uses current D3.js integration for scales, axes, and line generation
- Integrates with TimeSeriesGenerator data output for seamless plotting workflow
- Works with existing mathematical expression parsing for plot titles and labeling
- Compatible with current CLI interface for file output and format specification

## Example Usage

Basic plot: node src/lib/main.js -e "y=sin(x)" -r "x=-pi:pi" -f sine.svg

Custom sizing: node src/lib/main.js -e "y=x^2" -r "x=-3:3" -f parabola.svg --width 1200 --height 800

Complex function: node src/lib/main.js -e "y=cos(x)*exp(-x/4)" -r "x=0:4*pi" -f damped-cosine.svg

Logarithmic scale: node src/lib/main.js -e "y=log10(x)" -r "x=1:100" -f log-plot.svg