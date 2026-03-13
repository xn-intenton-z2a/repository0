# CLI Output Formats

Extend command-line interface to support multiple output formats including CSV data export, JSON time series, and stdout piping, making the library the "jq of formulae visualisations" for shell integration.

## Purpose

This feature completes the CLI to output mathematical data in various formats beyond SVG and PNG plots, enabling integration with spreadsheets, data analysis tools, and shell pipelines through standardized data formats.

## Acceptance Criteria

- Add --format flag for output type selection (svg, png, csv, json)
- CSV export includes x,y coordinate pairs with expression header comment
- JSON export follows structured time series format with metadata
- Support --stdout flag to pipe output directly for shell integration  
- Include expression and range metadata in all export formats
- Handle mathematical constants (pi, e) in range parsing correctly
- Provide concise output suitable for pipe workflows
- Support format auto-detection from file extension when --format omitted
- Enable jq-style data processing workflows for mathematical expressions
- Integrate seamlessly with existing CLI argument structure

## Technical Implementation

Extend CLI argument parsing in plotCLI function to support --format and --stdout flags. Use existing TimeSeriesGenerator.exportCSV and exportJSON methods. Add format detection logic and stdout output handling for shell pipeline integration.

## Integration Points

- Extends existing CLI interface with format control
- Uses current TimeSeriesGenerator export methods without modification
- Maintains backward compatibility with existing CLI usage
- Enables shell scripting and data pipeline workflows
- Supports the mission of being "jq of formulae visualisations"

## Example Usage

```
# Export as CSV
node src/lib/main.js --expression "y=sin(x)" --range "x=0:pi" --format csv --file sine.csv

# JSON to stdout for jq processing
node src/lib/main.js --expression "y=x^2" --range "x=-2:2" --stdout --format json | jq '.[] | select(.y > 1)'

# Auto-detect format from extension
node src/lib/main.js --expression "y=log(x)" --range "x=1:10" --file data.json

# Pipe CSV data to other tools
node src/lib/main.js --expression "y=e^x" --range "x=0:3" --stdout --format csv | tail -n +2 | sort -n
```

## Data Pipeline Integration

CSV format uses standard x,y columns. JSON format provides structured data for jq processing. Stdout output enables mathematical formula visualization to integrate into shell-based data analysis workflows.