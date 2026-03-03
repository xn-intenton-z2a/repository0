# Polar Coordinate Support

## Overview
Add polar coordinate plotting capability enabling visualization of mathematical expressions in polar form. Expand mathematical visualization scope with specialized polar plotting while maintaining existing interface simplicity.

## Acceptance Criteria

### Polar Command Interface
New polar command for polar expressions supporting natural polar syntax
Command syntax: plot-code-lib polar -e "1+cos(theta)" -r "theta=0:2*pi" -o cardioid.svg
Support for polar variables theta and r enabling intuitive polar expression specification
Range specification using theta parameter with automatic degree conversion support
Standard output formats SVG and PNG maintaining compatibility with existing plotting pipeline

### Polar-to-Cartesian Transformation
High-precision coordinate transformation using x = r*cos(theta), y = r*sin(theta) formulas
Automatic polar expression evaluation ensuring proper r-value calculation from theta input
Domain validation preventing invalid polar coordinates and handling mathematical edge cases
Coordinate system scaling ensuring proper aspect ratio and circular symmetry preservation

### Polar Grid Visualization
Concentric circle grid with radial angle lines providing polar coordinate reference system
Configurable polar grid density supporting precise coordinate reading and mathematical analysis
Angular axis labels with degree or radian notation based on input range specification
Grid styling consistent with existing plot aesthetics while highlighting polar coordinate nature

### Specialized Polar Functions
Support for common polar curves including cardioids, limaçons, rose curves, spirals, and lemniscates
Expression examples supporting "1+cos(theta)", "sin(2*theta)", "theta", "1/(1+cos(theta))"
Automatic range optimization for polar functions ensuring complete curve visualization
Mathematical constant support including pi, e, and other constants within polar expressions

## Technical Implementation
PolarPlotGenerator class extending existing PlotGenerator with polar-specific rendering capabilities
Coordinate transformation module ensuring mathematical precision in polar-to-Cartesian conversion
Polar grid rendering system using D3.js with specialized circular and radial line generation
Expression evaluation enhancement supporting theta variable and polar mathematical operations

## Mission Alignment
Expands mathematical visualization capabilities while maintaining core command-line interface simplicity
Supports educational and scientific applications requiring specialized polar coordinate visualization
Enables comprehensive mathematical curve analysis without compromising tool accessibility
Preserves jq philosophy with structured coordinate output suitable for further data processing