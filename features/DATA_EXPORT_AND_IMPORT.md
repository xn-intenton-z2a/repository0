# Data Export and Import

Expose existing data export capabilities through CLI and add comprehensive data import functionality for processing external datasets.

## Purpose

Complete the data processing pipeline by exposing CSV/JSON export via CLI flags and enabling import of external datasets for mathematical transformation and visualization.

## Acceptance Criteria

- Add --format flag to CLI accepting: svg, png, csv, json
- Support --stdout flag for pipeline-friendly output to console
- Add --input flag for reading CSV/JSON data files
- Support mathematical transformation of imported data columns
- Auto-detect input format from file extension
- Include metadata headers in exported files (expression, range, timestamp)
- Handle column mapping for imported data (x,y coordinate specification)
- Support stdin input for pipeline workflows
- Maintain backward compatibility with existing file output behavior

## Technical Implementation

Extend CLI argument parsing to include --format, --stdout, and --input flags. The TimeSeriesGenerator class already has exportCSV() and exportJSON() methods that need CLI integration. Add data import parsing for CSV and JSON formats.

## Integration Points

- Builds on existing CLI interface and argument parsing
- Uses existing TimeSeriesGenerator exportCSV() and exportJSON() methods
- Compatible with current ExpressionParser for data transformation
- Works with existing PlotRenderer for visualization of imported data
- Maintains full backward compatibility with current usage patterns

## Example Usage

Export generated data to CSV: node src/lib/main.js --expression "y=sin(x)" --range "x=0:2*pi" --format csv --stdout

Import and transform dataset: node src/lib/main.js --input sales-data.csv --expression "y=log(revenue)" --format svg --file analysis.svg