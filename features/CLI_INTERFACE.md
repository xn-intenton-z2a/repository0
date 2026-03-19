# Command Line Interface

Provide command-line interface for generating plots from expressions and CSV data.

## Command Structure

Support multiple command formats:
- Expression plotting: --expression "y=Math.sin(x)" --range "-3.14:0.01:3.14" --file output.svg
- CSV plotting: --csv data.csv --file output.png
- Help information: --help

## Argument Parsing

Parse command line arguments using process.argv. Support both long form (--expression) and short form (-e) flags. Validate required combinations of arguments.

## Help System

Display comprehensive help information with --help flag. Include usage examples for both expression and CSV modes. Show available options and their descriptions.

## API Integration

Integrate all library functions (expression parsing, range evaluation, CSV loading, rendering, file output) into cohesive CLI workflow.

## Error Handling

Provide user-friendly error messages for invalid arguments. Validate file paths exist for CSV input. Check required arguments are provided before processing.

## Acceptance Criteria

- Support --expression and --range arguments for mathematical plots
- Support --csv argument for time series plots
- Support --file argument for output file specification
- Display help with --help flag
- Parse range format correctly from command line
- Integrate with all rendering and file output functions
- Provide clear error messages for invalid usage
- Exit with appropriate status codes