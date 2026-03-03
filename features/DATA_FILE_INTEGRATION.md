# Data File Integration

## Overview
Enable plot-code-lib to read and visualize data from external files supporting CSV, JSON, and TSV formats. Transform from expression-only tool into comprehensive data visualization platform supporting real-world datasets while maintaining mathematical expression capabilities.

## Acceptance Criteria

### File Format Support
CSV file reading with automatic header detection and numeric type inference
JSON file parsing supporting both array-of-objects and nested object structures
TSV file support with tab delimiter detection and configurable alternative separators via --delimiter flag
Basic error handling for malformed files with helpful error messages and line number reporting

### Column-Based Plotting
Column selection syntax: plot-code-lib data -f data.csv --xcol time --ycol temperature -o temp-plot.svg
Multi-column plotting: --ycol "temp,humidity,pressure" creates multiple series with automatic legend
Data filtering via --filter flag supporting simple expressions: "temperature > 20"
Automatic numeric conversion with fallback handling for mixed-type columns

### Data Processing Pipeline
Built-in transformations accessible via --transform flag: moving-average, normalize, scale
Date/time column recognition with automatic axis formatting for temporal data visualization
Missing data handling with options: skip-rows, interpolate-linear, fill-zero via --missing-data flag
Processed data export maintaining original format with computed columns added

### Mathematical Expression Integration
Hybrid plotting combining file data with mathematical expressions on same coordinate system
Expression evaluation using column data as variables: plot-code-lib data -f data.csv -e "sin(time)" --overlay
Automatic axis range detection from data bounds with optional manual override
Statistical summary output including basic descriptive statistics for numeric columns

## Technical Implementation
FileReader class with format detection supporting CSV, JSON, TSV parsing via standard libraries
DataProcessor module handling column operations, filtering, and transformation pipelines
Integration with existing TimeSeriesGenerator for unified coordinate data generation
Column mapping system compatible with current PlotGenerator multi-series rendering

## Mission Alignment
Extends jq philosophy to real-world data processing while preserving mathematical expression focus
Supports scientific workflow requirements combining empirical data with theoretical mathematical models
Maintains command-line simplicity and Unix tool composability for data pipeline integration
Enables practical applications requiring both data analysis and mathematical modeling capabilities