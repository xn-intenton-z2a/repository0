# Data Import and Mathematical Operations

## Overview
Transform plot-code-lib into a comprehensive data analysis tool by adding CSV/JSON file reading capabilities with mathematical transformations. Enables real-world data visualization while maintaining the core mathematical expression focus and jq-like data processing philosophy.

## Acceptance Criteria

### File Format Support
CSV file reading with automatic header detection and delimiter inference
JSON array-of-objects parsing with numeric column identification
TSV support and custom delimiter specification via --delimiter flag
Streaming data processing for large files without memory constraints

### Column-Based Mathematical Operations
New data command: plot-code-lib data -f data.csv --xcol time --ycol temperature -o plot.svg
Mathematical transformations on columns: plot-code-lib data -f data.csv --xcol time --ycol "log(temperature)" -o plot.svg
Statistical functions in expressions: mean(column), max(column), min(column), std(column)
Column arithmetic: plot-code-lib data -f data.csv --xcol x --ycol "y1 + y2 * 0.5" for computed columns

### Data Filtering and Processing
Row filtering with mathematical expressions: --filter "temperature > 20 && humidity < 80"
Date/time column parsing and range selection: --date-range "2024-01-01:2024-12-31"
Missing value handling with interpolation options: --fill-missing linear, constant, or skip
Data sampling and downsampling for large datasets: --sample-rate 0.1 or --max-points 1000

### Enhanced Export Capabilities
CSV export with computed columns and transformations applied
JSON export preserving original structure with computed fields added
Statistical summary generation: count, mean, median, std deviation per numeric column
GeoJSON export with data source metadata and transformation history

## Technical Implementation
DataFileReader class supporting CSV, TSV, and JSON with automatic format detection
ColumnProcessor for mathematical transformations and statistical operations
DataFilter for row-based filtering using mathematical expressions
StreamingProcessor to handle large files efficiently without memory issues

## Mission Alignment
Bridges mathematical expressions with empirical data analysis workflows
Maintains jq philosophy for structured data processing and transformation
Essential for scientific data analysis combining theoretical and observational data
Enables command-line data science workflows with mathematical rigor