# Data Export and Import

Add comprehensive data export capabilities and support for importing existing datasets for mathematical transformation and visualization.

## Purpose

Transform plot-code-lib into a versatile data processing tool by supporting multiple input and output formats, enabling integration with spreadsheets, databases, and scientific computing workflows.

## Acceptance Criteria

- Add CSV and JSON export formats to CLI output options
- Support reading CSV files as input data for transformation
- Include data import from JSON arrays with x,y coordinates
- Add --format flag accepting: svg, png, csv, json, txt
- Support --stdout flag for pipeline-friendly output
- Auto-detect format from file extension when format not specified
- Include metadata in exported files (expression, range, timestamp)
- Handle large datasets efficiently with streaming where applicable
- Support mathematical transformation of imported data columns

## Technical Implementation

Extend the existing CLI interface to accept --format and input file flags. Use current TimeSeriesGenerator export methods and add import capabilities. Maintain existing plotting functionality while adding data processing features.

## Integration Points

- Builds on existing CLI interface and argument parsing
- Uses current ExpressionParser for data transformation
- Leverages existing export methods in TimeSeriesGenerator
- Compatible with current PlotRenderer for visualization
- Maintains backward compatibility with existing usage patterns

## Example Usage

Export sine wave data to CSV: node src/lib/main.js --expression "y=sin(x)" --range "x=0:2*pi" --format csv --file data.csv

Import and transform existing data: node src/lib/main.js --input data.csv --expression "y=log(value)" --format json --stdout