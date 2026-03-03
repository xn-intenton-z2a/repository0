# Multi-Expression Plotting

## Overview
Enable simultaneous plotting of multiple mathematical expressions on the same coordinate system for comparative analysis. Transform the current single-expression limitation into a multi-function visualization platform with automatic color differentiation and legend support.

## Acceptance Criteria

### Multi-Expression Command Interface
Enhanced plot command supporting comma-separated expressions: plot-code-lib plot -e "sin(x),cos(x),tan(x)" -r "x=0:2*pi" -o comparison.svg
Automatic color assignment from predefined palette ensuring distinct visualization of each function
Shared coordinate system with unified axis scaling accommodating all expression ranges automatically
Individual expression validation allowing partial success when some expressions have domain issues

### Legend and Function Identification
Automatic legend generation with expression labels positioned to avoid overlap with plot content
Color-coded legend entries matching corresponding function line colors for clear identification
Configurable legend position via --legend option: top-left, top-right, bottom-left, bottom-right, none
Mathematical expression formatting in legend labels preserving proper notation and readability

### Enhanced Data Export
Multi-expression export maintaining function separation in GeoJSON FeatureCollection format
CSV export with function identifier column allowing spreadsheet analysis of multiple datasets
Individual expression metadata preservation including source expression and evaluation parameters
Structured coordinate output enabling downstream analysis and processing workflows

### Error Handling and Robustness
Individual expression error isolation preventing single function failure from terminating entire plot
Warning messages for expressions producing no valid data points while continuing with successful ones
Domain validation across multiple expressions ensuring mathematical accuracy and completeness
Graceful handling of expression parsing errors with informative error messages and partial results

## Technical Implementation
TimeSeriesGenerator modification to accept expression arrays and return FeatureCollection format
PlotGenerator enhancement supporting multiple line rendering with automatic color palette cycling
Legend rendering system integrated with existing D3.js SVG generation maintaining plot quality
Expression validation pipeline ensuring individual error handling without affecting other functions

## Mission Alignment
Transforms basic single-function tool into comprehensive comparative analysis platform
Maintains command-line simplicity while significantly expanding analytical capabilities
Supports mathematical education and research requiring multi-function comparison workflows
Preserves jq philosophy with structured multi-function data suitable for pipeline processing