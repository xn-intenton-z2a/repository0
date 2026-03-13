# CLI Output Formats

Expand command-line interface to support multiple output formats including CSV data export, JSON time series, and different image formats, making the library more versatile for data analysis workflows.

## Purpose

This feature enhances the CLI to output mathematical data in various formats beyond SVG and PNG plots, enabling integration with spreadsheets, data analysis tools, and other mathematical software through standardized data formats.

## Acceptance Criteria

- Support --format flag for output type selection (svg, png, csv, json)
- CSV export includes x,y coordinate pairs with headers  
- JSON export follows time series format with metadata
- Support --data-only flag to output pure data without plots
- Include statistical metadata in JSON exports (min, max, mean, points)
- Support --precision flag for numerical precision control
- Handle large datasets efficiently for data export
- Provide --quiet flag to suppress progress output during data generation
- Include expression and range metadata in exported files
- Support piping output to stdout for shell integration

## Technical Implementation

Extend CLI argument parsing to include format and output control flags. Leverage existing TimeSeriesGenerator.exportCSV and exportJSON methods. Add metadata injection for self-documenting exports.

## Integration Points

- Integrates with existing CLI interface and argument parsing
- Uses current TimeSeriesGenerator export methods  
- Web interface provides download options for different formats
- Data exports include complete parameter information for reproducibility
- Shell integration enables pipe workflows with other tools

## Example Usage

```
# Export data as CSV
node src/lib/main.js --expression "y=sin(x)" --range "x=0:pi" --format csv --file sine.csv

# JSON with metadata
node src/lib/main.js --expression "y=x^2" --range "x=-2:2" --format json --file parabola.json

# Data to stdout for piping
node src/lib/main.js --expression "y=log(x)" --range "x=1:10" --format csv --data-only | head -20

# High precision export
node src/lib/main.js --expression "y=e^x" --range "x=0:5,step=0.01" --format csv --precision 6 --file exponential.csv
```

## Data Formats

CSV format includes x,y columns with expression and range as comment headers. JSON format follows time series standard with points array and comprehensive metadata for mathematical analysis and tool integration.