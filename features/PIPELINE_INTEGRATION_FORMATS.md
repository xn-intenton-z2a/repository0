# Pipeline Integration Formats

Transform plot-code-lib into a truly pipeline-friendly tool like jq with flexible data export and streaming capabilities for mathematical workflows.

## Purpose

Enable plot-code-lib to integrate seamlessly with Unix pipelines and data processing workflows by providing multiple output formats and streaming options that make mathematical plotting as composable as JSON processing with jq.

## Acceptance Criteria

- Add --format flag supporting: svg, png, json, csv, stdout
- Support --stdout flag for pipeline-friendly text output to terminal
- Include JSON coordinate data export for programmatic integration
- Add CSV export with x,y columns for spreadsheet and data analysis tools
- Support --data-only flag to output pure coordinate data without plot generation
- Include --quiet flag to suppress all non-essential output for clean pipelines
- Add --size preset flag with values: small (400x300), medium (800x600), large (1200x900)
- Support Base64 encoded output with --base64 flag for web embedding workflows
- Include expression metadata in JSON exports (expression, range, point count, timestamp)
- Add short flag aliases: -f for --format, -q for --quiet, -s for --size

## Technical Implementation

Extend TimeSeriesGenerator class with exportJSON and exportCSV methods. Add format routing logic to plotCLI function. Implement stdout streaming with proper encoding. Create size presets for PlotRenderer. Add Base64 encoding for SVG output.

## Integration Points

- Builds on existing PlotRenderer SVG and PNG generation capabilities
- Extends current TimeSeriesGenerator with standardized data export methods
- Enhances existing CLI argument parsing with format selection logic
- Maintains full backward compatibility with current plotting workflow
- Uses existing expression parsing and coordinate generation infrastructure

## Example Usage

JSON pipeline: node src/lib/main.js -e "y=sin(x)" -r "x=0:2*pi" -f json -q | jq '.data[0:5]'

CSV analysis: node src/lib/main.js -e "y=x^2" -r "x=-2:2" -f csv | awk -F, '$2>1 {print $0}'

Pure data: node src/lib/main.js -e "y=log(x)" -r "x=1:10" --data-only --stdout

Web embed: node src/lib/main.js -e "y=cos(x)" -r "x=-pi:pi" -f svg --base64 | pbcopy