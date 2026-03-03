# Multi-Expression Plotting

## Overview
Enable simultaneous plotting of multiple mathematical expressions on the same coordinate system for comparative analysis. Essential for mathematical education, function comparison, and analytical workflows while maintaining command-line simplicity.

## Acceptance Criteria

### Multi-Expression Command Interface
CLI accepts comma-separated expressions: plot-code-lib plot -e "sin(x),cos(x),tan(x)" -r "x=-pi:pi" -o comparison.svg
Each expression automatically assigned unique color from predefined palette
Shared coordinate system with unified axis scaling encompassing all expression ranges
Individual expression validation with graceful failure handling for malformed expressions

### Legend and Visual Styling
Automatic legend generation showing expression text and corresponding line color
Legend positioned to avoid overlapping with plot data using intelligent placement algorithm
Consistent line styling with 2px stroke width and SVG anti-aliasing
Color palette optimized for accessibility and print compatibility

### Multi-Function Data Export
GeoJSON export returns FeatureCollection with separate Feature per expression
Each Feature includes expression metadata and color assignment in properties field
CSV export includes expression_name column for downstream analysis and processing
JSON export maintains array structure with expression metadata for programmatic access

### Command Enhancement
Extend existing plot command to detect comma-separated expressions in -e parameter
Maintain backward compatibility with single expression usage
Add --no-legend flag to disable legend generation for clean plots
Support expression aliasing via "label:expression" syntax for custom legend entries

## Technical Implementation
Modify ExpressionParser to validate array of expressions and return compilation results
Extend TimeSeriesGenerator.generate() to process expression array and return FeatureCollection
Enhance PlotGenerator.generateSVG() for multiple LineString features with automatic color assignment
Add LegendRenderer component with intelligent positioning and collision avoidance

## Mission Alignment
Core functionality for mathematical education and comparative analysis
Maintains jq philosophy with structured multi-expression output for data pipelines
Essential for scientific visualization workflows requiring function comparison
Builds upon existing single-expression foundation without breaking changes