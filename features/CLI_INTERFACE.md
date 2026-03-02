# CLI_INTERFACE

## Overview

Provide a comprehensive command-line interface that orchestrates all plotting functionality through intuitive arguments and options.

## Acceptance Criteria

The CLI must support:
- Expression parameter: --expression "y=sin(x)"
- Range specification: --range "x=-10:10,y=-5:5"  
- Output file: --file "output.svg" or --file "output.png"
- Help documentation: --help or -h
- Version information: --version or -v
- Verbose output: --verbose or -v for debugging
- Dry run mode: --dry-run to show what would be generated
- Multiple output formats in single command

## Implementation Details

Parse command-line arguments using a robust argument parsing library, validate inputs, and coordinate between the expression parser, time series generator, and plot generator features.

## Integration Points

- Orchestrate EXPRESSION_PARSER for mathematical expression processing
- Configure TIME_SERIES_GENERATOR with range parameters
- Direct PLOT_GENERATOR for file output operations
- Provide unified error handling and user feedback

## Command Examples

Support command patterns like:
```
node src/lib/main.js --expression "y=sin(x)" --range "x=-pi:pi,y=-2:2" --file output.svg
node src/lib/main.js --expression "y=x^2" --range "x=-5:5" --file plot.png --verbose  
node src/lib/main.js --help
node src/lib/main.js --version
```

## Error Handling

Provide clear error messages for:
- Invalid expression syntax
- Invalid range specifications  
- File system permission issues
- Missing required parameters
- Unsupported file formats

## Help Documentation

Include comprehensive help text covering:
- Usage examples with common mathematical functions
- Supported expression syntax and functions
- Range specification format options
- Output format capabilities
- Troubleshooting common issues

## Testing Requirements

Integration tests should verify:
- End-to-end CLI workflows
- Parameter validation and error reporting
- Help and version command outputs
- File output generation across different scenarios
- Proper exit codes for success/failure conditions