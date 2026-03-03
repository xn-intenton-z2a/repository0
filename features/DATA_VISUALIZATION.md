# Data File Visualization

## Overview
Enable plot-code-lib to read and visualize CSV and JSON data files, expanding from expression-only to real-world dataset visualization. Maintains mathematical focus while adding practical data analysis capabilities with Unix pipeline compatibility.

## Acceptance Criteria

### File Format Support
CSV file reading with automatic header detection and column type inference
JSON array-of-objects parsing with numeric column identification and validation
TSV and delimiter-auto-detection for common tabular formats
Clear error reporting for malformed files with line numbers and column information

### Column-Based Plotting
New data command: plot-code-lib data -f data.csv --xcol time --ycol temperature -o plot.svg
Multi-column Y-axis support: --ycol "temp,humidity,pressure" for overlaid series visualization
Automatic numeric conversion with skip-invalid-rows option for mixed-type data
Date/time parsing for temporal data with ISO 8601 and common date format recognition

### Mathematical Expression Enhancement
Expression overlay on data plots: plot-code-lib data -f data.csv --xcol x --ycol y --overlay "x^2" -o combined.svg
Statistical functions for data columns: mean(column_name), max(column_name) in expressions
Range auto-detection from data with optional manual override for expression overlay
Data-driven expression evaluation using column statistics for dynamic plotting

### Output and Export
Maintain existing GeoJSON export structure with data source attribution in properties
CSV re-export with computed columns and transformations applied
JSON export preserving original data structure with metadata and plot coordinates
Statistical summary generation: min, max, mean, count, std deviation per numeric column

## Technical Implementation
CSVParser and JSONParser classes extending existing data architecture
DataColumnProcessor for type inference, conversion, and statistical analysis
Integration with TimeSeriesGenerator for unified coordinate system management
Enhanced export system supporting both expression-generated and file-sourced data

## Mission Alignment
Natural extension of jq philosophy to real-world data processing workflows
Bridges gap between mathematical expressions and empirical data visualization
Maintains command-line simplicity while enabling practical scientific data analysis
Supports hybrid workflows combining theoretical models with observational data