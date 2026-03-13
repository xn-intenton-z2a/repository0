# Core CLI Interface

Provide a comprehensive command-line interface that makes plot-code-lib the jq of mathematical plotting with intuitive flags, error handling, and examples.

## Purpose

Establish plot-code-lib as an essential command-line tool for mathematical plotting by providing a robust, user-friendly CLI interface with clear syntax, helpful error messages, and comprehensive flag support that makes mathematical visualization as accessible as JSON processing with jq.

## Acceptance Criteria

- Support core plotting flags: --expression, --range, --file for basic functionality
- Add --version and --help flags with comprehensive usage information
- Include --verbose flag for detailed operation logging and debugging
- Support short flag aliases: -e for --expression, -r for --range, -f for --file, -v for --verbose
- Implement comprehensive error handling with specific error messages for common mistakes
- Add input validation for expressions, ranges, and file paths with helpful suggestions
- Support mathematical constants (pi, e) in range specifications
- Include step size configuration in range specification (x=-1:1,step=0.01)
- Add automatic file extension detection (.svg, .png) with format validation
- Support executable script usage with proper shebang and exit codes

## Technical Implementation

Enhance existing plotCLI function with comprehensive argument parsing and validation. Add detailed help text and usage examples. Implement proper error handling with specific error codes. Add support for mathematical constants in range parsing. Ensure cross-platform compatibility.

## Integration Points

- Builds on existing plotCLI function in src/lib/main.js with enhanced argument handling
- Uses current ExpressionParser, TimeSeriesGenerator, and PlotRenderer classes
- Maintains compatibility with existing plotting functionality while adding robustness
- Integrates with existing mathematical expression syntax and range specification formats
- Supports current SVG and PNG output formats with automatic format detection

## Example Usage

Basic plotting: node src/lib/main.js -e "y=sin(x)" -r "x=-pi:pi" -f sine.svg

Custom step size: node src/lib/main.js -e "y=x^2" -r "x=-2:2,step=0.05" -f parabola.png --verbose

Help display: node src/lib/main.js --help

Version check: node src/lib/main.js --version