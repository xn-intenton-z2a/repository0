# Polar Coordinate Support

## Overview
Add polar coordinate plotting capability enabling visualization of mathematical expressions in polar form. Expands mathematical visualization scope with specialized polar plotting while maintaining existing interface simplicity.

## Acceptance Criteria

### Polar Command Interface
New polar subcommand: plot-code-lib polar -e "1+cos(theta)" -r "theta=0:2*pi" -o cardioid.svg
Support theta variable in expressions with automatic recognition of polar coordinate context
Range specification accepts both radians and degree notation with automatic conversion
Compatible output formats SVG and PNG maintaining feature parity with standard plotting

### Coordinate Transformation
High-precision polar-to-cartesian conversion: x = r*cos(theta), y = r*sin(theta)
Automatic r-value calculation from theta input through expression evaluation
Domain validation prevents invalid polar coordinates and handles division by zero gracefully
Aspect ratio preservation ensures circular symmetry in rendered polar plots

### Polar Grid System
Concentric circle grid with radial lines at 30-degree intervals by default
Optional grid density control via --grid-density flag accepting values: sparse, normal, dense
Angular labels in radians by default with --degrees flag for degree notation
Grid styling matches existing cartesian grid aesthetics with polar-specific enhancements

### Polar Function Library
Built-in support for common polar curves: cardioids, rose curves, spirals, limacons
Expression examples: "1+cos(theta)" (cardioid), "sin(2*theta)" (rose), "theta" (spiral)
Automatic range optimization ensuring complete curve visualization within plot boundaries
Full MathJS constant support including pi, e, and mathematical functions in polar expressions

## Technical Implementation
Create PolarPlotGenerator extending PlotGenerator with polar-specific coordinate transformation
Implement theta variable recognition in ExpressionParser for polar coordinate context
Add polar grid rendering using D3.js with circular and radial line generation
Integrate polar coordinate transformation with existing SVG and PNG export pipeline

## Mission Alignment
Expands mathematical visualization capabilities supporting educational polar coordinate curriculum
Enables scientific applications requiring specialized polar plots while maintaining CLI simplicity
Preserves jq philosophy with GeoJSON coordinate output suitable for geographic analysis tools
Supports advanced mathematical curve analysis without compromising tool accessibility