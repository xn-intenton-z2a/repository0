# Data Pipeline Integration

## Overview
Enable plot-code-lib to read CSV and JSON data files for visualization, transforming from expression-only tool to comprehensive data visualization platform. Maintain mathematical expression focus while adding real-world dataset support with Unix pipeline compatibility.

## Acceptance Criteria

### File Format Support
CSV file reading with automatic header detection and column type inference
JSON file parsing for array-of-objects format with numeric column identification
Basic error handling for malformed files with descriptive error messages including line numbers
Tab-separated values support via automatic delimiter detection

### Column-Based Plotting
Column selection syntax: plot-code-lib data -f data.csv --xcol time --ycol temperature -o plot.svg
Multi-series plotting: plot-code-lib data -f data.csv --xcol time --ycol "temp,humidity" creates overlaid series
Automatic numeric conversion with graceful handling of mixed-type columns
Date/time column recognition with ISO 8601 parsing for temporal data visualization

### Mathematical Expression Overlay
Hybrid plotting combining file data with mathematical expressions on same plot
Expression overlay syntax: plot-code-lib data -f data.csv --xcol x --ycol y --overlay "sin(x)" -o combined.svg
Unified coordinate system with automatic range detection from both data and expressions
Statistical summary output including min, max, mean, count for numeric columns

### Data Export Pipeline
Processed data export in CSV, JSON, and GeoJSON formats maintaining original structure
Column transformation support: moving averages, normalization, scaling via --transform flag
Missing data handling with options: skip-rows, interpolate-linear, fill-zero
Unix-style pipeline compatibility for chaining with awk, jq, and other data tools

## Technical Implementation
FileReader class with format detection supporting CSV and JSON parsing via standard libraries
DataProcessor module for column operations, filtering, and mathematical transformations  
Integration with existing TimeSeriesGenerator for unified coordinate generation
Enhanced PlotGenerator supporting both file data and expression-generated coordinates

## Mission Alignment
Extends jq philosophy to real-world data processing while preserving mathematical expression core
Enables practical applications combining empirical data with theoretical mathematical models
Maintains command-line simplicity and Unix composability for data analysis pipelines
Supports scientific workflows requiring both data visualization and mathematical modeling