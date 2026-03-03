# Multi-Expression Plotting

## Overview
Enable simultaneous plotting of multiple mathematical expressions on the same coordinate system for comparative analysis. This core enhancement transforms plot-code-lib from a single-function tool into a comprehensive comparative analysis platform.

## Acceptance Criteria

### Multi-Expression Command Interface
Enhanced plot command supporting comma-separated expressions enabling comparison workflows
Expression syntax: plot-code-lib plot -e "sin(x),cos(x),x/2" -r "x=-pi:pi" -o comparison.svg
Automatic color assignment from predefined palette ensuring distinct visualization per function
Shared coordinate system with unified axis scaling accommodating all expression ranges
Individual expression validation allowing partial success when expressions have domain issues

### Legend and Function Identification
Automatic legend generation with expression labels positioned to avoid plot content overlap
Color-coded legend entries matching corresponding function line colors for clear identification
Configurable legend positioning: --legend top-left, top-right, bottom-left, bottom-right, none
Mathematical expression formatting in legend preserving proper notation and readability

### Enhanced Data Export
Multi-expression export as GeoJSON FeatureCollection maintaining function separation
CSV export with function identifier column enabling spreadsheet analysis of multiple datasets
Individual expression metadata preservation including source expression and evaluation parameters
Structured coordinate output enabling downstream analysis and processing workflows

### Error Handling and Robustness
Individual expression error isolation preventing single function failure from terminating plot
Warning messages for expressions producing no valid data points while continuing with successful ones
Domain validation across multiple expressions ensuring mathematical accuracy and completeness
Graceful expression parsing error handling with informative messages and partial results

## Technical Implementation
TimeSeriesGenerator enhancement to accept expression arrays and return FeatureCollection format
PlotGenerator modification supporting multiple line rendering with automatic color palette cycling
Legend rendering system integrated with existing D3.js SVG generation maintaining plot quality
Expression validation pipeline ensuring individual error handling without affecting other functions

## Mission Alignment
Transforms single-function tool into comprehensive comparative analysis platform supporting mathematical education
Maintains command-line simplicity while significantly expanding analytical capabilities for research workflows
Supports multi-function comparison requirements while preserving jq philosophy with structured data output
Enables complex mathematical analysis workflows without compromising tool accessibility or performance