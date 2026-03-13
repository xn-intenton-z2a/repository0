# Core Functionality

Ensure robust mathematical expression parsing, time series generation, and plot rendering capabilities form the foundation of the plot-code-lib CLI and web interface.

## Purpose

Provide a rock-solid foundation for mathematical plotting by implementing comprehensive expression parsing, accurate time series data generation, and reliable plot rendering that handles edge cases gracefully and provides clear error messages for invalid inputs.

## Status: IMPLEMENTED ✅

Core functionality is complete and working. All tests pass (44/44), CLI interface functional, SVG/PNG output working.

## Acceptance Criteria

- ✅ Parse mathematical expressions with proper error handling for invalid syntax using Math.js
- ✅ Support comprehensive mathematical functions through Math.js (trigonometric, logarithmic, exponential, statistical)
- ✅ Support mathematical constants (pi, e) in expressions and ranges with proper evaluation
- ✅ Handle mathematical constants (pi, e) in expressions and ranges
- ✅ Render clean SVG plots with proper scaling, axes, labels, and grid lines
- ✅ Generate PNG plots with high quality anti-aliasing using Sharp library
- ✅ Provide helpful CLI interface with clear help text and usage examples
- ✅ Handle edge cases like division by zero, domain errors, and infinite values gracefully
- ✅ Support variable step sizes and automatic step size calculation for smooth curves
- ✅ Include proper axis labeling, tick marks, and plot titles in generated output

## Technical Implementation

ExpressionParser uses Math.js for robust mathematical expression compilation and evaluation. TimeSeriesGenerator handles range parsing with mathematical constants and generates coordinate data safely. PlotRenderer uses D3.js for SVG generation and Sharp for PNG conversion with proper scaling and formatting.

## Integration Points

- Forms the foundation layer that all other features depend on
- Web interface relies on these core classes for interactive plotting functionality  
- CLI interface directly uses these components to process command-line arguments
- All advanced features extend this core functionality rather than replacing it
- Test suite validates core behavior to ensure reliability and catch regressions

## Example Usage

Basic plot: node src/lib/main.js --expression "y=sin(x)" --range "x=-pi:pi" --file sine.svg

With constants: node src/lib/main.js --expression "y=exp(-x)*cos(2*pi*x)" --range "x=0:2" --file damped.png

Custom step: node src/lib/main.js --expression "y=x^3-3*x+1" --range "x=-2:2,step=0.05" --file cubic.svg

Error handling: Invalid expressions show clear error messages with suggestions for correction