# Parametric and Polar Plotting

Extend plotting capabilities beyond Cartesian coordinates to support parametric equations and polar coordinate systems for comprehensive mathematical visualization.

## Purpose

Expand plot-code-lib visualization capabilities to handle parametric curves, polar coordinates, and 3D surface projections, enabling visualization of complex mathematical relationships that cannot be expressed as simple y=f(x) functions.

## Acceptance Criteria

- Add --mode flag supporting: cartesian, parametric, polar coordinate systems
- Support parametric equations with separate x(t) and y(t) expressions
- Include polar coordinate plotting with r=f(theta) expressions  
- Add parameter range specification for parametric equations (t=min:max)
- Support angle range specification for polar plots (theta=0:2*pi)
- Include 3D surface projection capabilities with z=f(x,y) expressions
- Add coordinate system grid overlays appropriate to each mode
- Support multiple parametric curves on the same plot with distinct styling
- Include coordinate transformation utilities between systems
- Add specialized axis labeling for polar and parametric coordinate systems

## Technical Implementation

Extend PlotRenderer class to handle multiple coordinate systems and projection modes. Create ParametricGenerator and PolarGenerator classes for specialized coordinate data generation. Add coordinate transformation utilities and appropriate grid rendering for each system.

## Integration Points

- Extends existing CLI interface with coordinate system mode selection
- Uses current ExpressionParser for all mathematical expression types
- Builds on existing PlotRenderer architecture with mode-specific rendering
- Compatible with current file output system for all coordinate modes
- Works with existing web interface for interactive coordinate system selection

## Example Usage

Parametric curve: node src/lib/main.js --mode parametric --expression "x=cos(t)" --expression "y=sin(t)" --range "t=0:2*pi" --file circle.svg

Polar plot: node src/lib/main.js --mode polar --expression "r=sin(3*theta)" --range "theta=0:2*pi" --file rose.png

3D surface: node src/lib/main.js --mode surface --expression "z=sin(x)*cos(y)" --range "x=-pi:pi,y=-pi:pi" --file surface.svg