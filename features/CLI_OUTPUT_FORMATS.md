# CLI Output Formats

Add CSV and JSON export formats to the CLI, completing the data output capabilities for mathematical plotting and enabling shell pipeline integration.

## Purpose

Extend the existing CLI interface (which currently supports SVG and PNG) to output mathematical data in structured formats. This enables users to integrate mathematical plotting into data analysis workflows and supports the mission of being "jq of formulae visualisations."

## Acceptance Criteria

- Add --format flag accepting values: svg, png, csv, json
- CSV export generates x,y coordinate pairs with headers 
- JSON export uses existing TimeSeriesGenerator.exportJSON method
- Support --stdout flag to output data directly to console
- Auto-detect format from file extension when --format not specified
- Maintain backward compatibility with existing CLI usage
- Handle mathematical constants (pi, e) correctly in all export formats
- Include expression metadata in JSON output

## Technical Implementation

Extend the plotCLI function argument parsing to recognize --format and --stdout flags. Use existing TimeSeriesGenerator exportCSV and exportJSON methods. Add format detection from file extension and stdout output handling.

## Integration Points

- Builds on existing CLI interface without breaking changes
- Uses current TimeSeriesGenerator export methods  
- Maintains existing SVG/PNG plotting capabilities
- Enables shell scripting and data pipeline workflows

## Example Usage

Export mathematical data as CSV:
node src/lib/main.js --expression "y=sin(x)" --range "x=0:pi" --format csv --file sine.csv

Output JSON to stdout for jq processing:
node src/lib/main.js --expression "y=x^2" --range "x=-2:2" --stdout --format json

Auto-detect format from file extension:
node src/lib/main.js --expression "y=log(x)" --range "x=1:10" --file data.json