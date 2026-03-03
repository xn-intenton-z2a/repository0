# Multi-Expression Plotting

## Overview
Enable simultaneous plotting of multiple mathematical expressions on the same coordinate system for comparative analysis. Transform plot-code-lib from single-function to multi-function comparison tool while preserving jq-style simplicity and structured data output.

## Acceptance Criteria

### Multi-Expression Command Interface
CLI accepts comma-separated expressions: plot-code-lib plot -e "sin(x),cos(x),tan(x)" -r "x=-pi:pi" -o comparison.svg
Each expression automatically assigned unique color from palette: blue, orange, green, red, purple, brown
Shared coordinate system with unified axis scaling encompassing all expression ranges
Individual expression validation with graceful failure handling for invalid expressions

### Legend and Visual Styling
Automatic legend generation in top-right corner with color-coded line samples
Legend entries show expression text exactly as provided without transformation
Optional legend positioning via --legend-position flag: top-left, top-right, bottom-left, bottom-right, none
Consistent line styling with 2px stroke width and anti-aliasing

### Multi-Function Data Export
GeoJSON export returns FeatureCollection with separate Feature per expression
Each Feature includes expression metadata in properties field
CSV export includes expression_name column for data identification
Maintains compatibility with existing single-expression export structure

### Error Handling and Robustness
Individual expression parsing errors logged as warnings without stopping execution
Domain errors for data points handled gracefully with coordinate skipping
Plot generation succeeds if at least one expression produces valid data
Clear error messages identifying problematic expressions with line numbers

## Technical Implementation
Extend TimeSeriesGenerator.generate() to accept expression array and return FeatureCollection
Enhance PlotGenerator.generateSVG() for multiple LineString features with color cycling
Add legend rendering component integrated with existing D3.js SVG pipeline
Implement robust expression validation preventing individual failures from affecting batch

## Mission Alignment
Enables mathematical function comparison essential for educational and analytical workflows
Preserves jq philosophy with structured multi-expression output for downstream processing
Maintains command-line simplicity while expanding core mathematical visualization capabilities
Supports comparative analysis without compromising performance or accessibility