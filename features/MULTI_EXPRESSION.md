# Multi-Expression Plotting

## Overview
Enable simultaneous plotting of multiple mathematical expressions on the same coordinate system for comparative analysis. This enhancement transforms plot-code-lib from a single-function tool into a comprehensive comparative analysis platform while maintaining command-line simplicity.

## Acceptance Criteria

### Multi-Expression Command Interface
CLI accepts comma-separated expressions: plot-code-lib plot -e "sin(x),cos(x),x/2" -r "x=-pi:pi" -o comparison.svg
Each expression automatically assigned unique color from predefined palette: blue, orange, green, red, purple, brown
Shared coordinate system with unified axis scaling encompassing all expression ranges
Individual expression validation allowing partial success when some expressions have domain issues
Console warnings for failed expressions while continuing with successful ones

### Legend Generation
Automatic legend positioned by default in top-right corner avoiding plot content overlap
Optional legend positioning via --legend flag: top-left, top-right, bottom-left, bottom-right, none
Legend entries show expression text exactly as entered with color-coded line samples
Mathematical notation preserved in legend labels without escaping or transformation

### Multi-Function Data Export
GeoJSON export returns FeatureCollection with separate Feature per expression
CSV export includes expression_id column identifying which function generated each coordinate pair
JSON export preserves individual expression metadata including source text and evaluation parameters
Export format maintains compatibility with existing single-expression output structure

### Error Handling
Individual expression parsing errors logged as warnings without stopping execution
Invalid expressions skipped with clear error messages identifying problematic syntax
Domain errors for specific data points handled gracefully with coordinate skipping
Plot generation continues successfully if at least one expression produces valid data

## Technical Implementation
Enhance TimeSeriesGenerator.generate() to accept expression arrays and return FeatureCollection
Modify PlotGenerator.generateSVG() to render multiple LineString features with color cycling
Add legend rendering module integrated with D3.js SVG generation pipeline
Implement expression validation wrapper preventing individual failures from affecting others

## Mission Alignment
Supports mathematical comparison workflows essential for educational and research applications
Maintains jq philosophy with structured multi-function data output suitable for downstream processing
Preserves command-line simplicity while significantly expanding analytical capabilities
Enables complex mathematical analysis without compromising tool accessibility or performance