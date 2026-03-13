# Essential Output Formats

Add core output formats that make plot-code-lib versatile for common mathematical plotting workflows while maintaining jq-like simplicity and performance.

## Purpose

Expand plot-code-lib output capabilities with essential formats for mathematical visualization, data sharing, and integration workflows while keeping the tool lightweight and fast like jq for JSON processing.

## Acceptance Criteria

- Add --format flag supporting: svg, png, json, csv, stdout
- Support --stdout flag for pipeline-friendly text output
- Include JSON data export with coordinate arrays for programmatic use
- Add CSV export with x,y columns for spreadsheet compatibility
- Support --size flag with presets: small (400x300), medium (800x600), large (1200x900)
- Include basic styling options with --theme flag: light, dark
- Add data point export without plotting using --data-only flag
- Support Base64 encoded SVG output for web embedding with --base64 flag
- Include plot metadata in JSON output (expression, range, point count)
- Add silent mode with --quiet flag for pipeline usage

## Technical Implementation

Extend existing PlotRenderer class with additional output formats. Add data export functionality to TimeSeriesGenerator class. Create simple theme system with basic color schemes. Implement stdout streaming for pipeline integration.

## Integration Points

- Builds on existing PlotRenderer SVG and PNG functionality
- Uses current TimeSeriesGenerator for data export formats
- Extends existing CLI interface with format selection
- Compatible with all current expression parsing and range specification
- Maintains full backward compatibility with existing SVG/PNG workflow

## Example Usage

JSON export: node src/lib/main.js -e "y=sin(x)" -r "x=0:2*pi" --format json --stdout

CSV pipeline: node src/lib/main.js -e "y=x^2" -r "x=-2:2" --format csv | head -n 5

Data only: node src/lib/main.js -e "y=log(x)" -r "x=1:10" --data-only --format json

Web embed: node src/lib/main.js -e "y=cos(x)" -r "x=-pi:pi" --format svg --base64