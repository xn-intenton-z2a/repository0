# DATA_PIPELINE

## Overview

Implement data pipeline capabilities to read, transform, and output mathematical data in standard formats, making the tool function as the jq of formulae visualisations for processing and transforming mathematical expressions and datasets.

## Acceptance Criteria

The data pipeline must support:
- JSON input/output for structured data processing
- CSV import/export for spreadsheet compatibility  
- Standard mathematical data formats (coordinate pairs, time series)
- Stdin/stdout operations for Unix pipeline integration
- Data transformation without plotting (computation only mode)
- Multiple expression evaluation in batch mode
- Data filtering and manipulation operations

## Implementation Details

Process data through standardized input/output formats, enabling users to chain operations, transform datasets, and integrate with existing data workflows. Support both plot generation and data-only operations.

## Integration Points

- CLI interface should accept --stdin and --output-format flags
- Work with EXPRESSION_PARSER to evaluate expressions on imported data
- Support TIME_SERIES_GENERATOR for creating datasets
- Enable PLOT_GENERATOR output or data-only operations
- Pipeline-friendly error handling and logging

## Data Input Formats

Support reading from:
- JSON arrays of coordinate objects: [{"x": 1, "y": 2}, ...]
- CSV files with x,y columns or custom column mapping
- Standard input with structured data formats
- Configuration files with multiple expressions and ranges

## Data Output Formats

Generate output in:
- JSON arrays for further processing
- CSV format for spreadsheet applications
- Plain text coordinate lists
- Mathematical data interchange formats
- Plot files (SVG, PNG) when visualization requested

## Pipeline Operations

Enable Unix-style pipeline operations:
```
cat data.json | plot-code-lib --transform "y=sin(x)" | plot-code-lib --plot --file output.svg
echo '{"range": "x=-pi:pi", "expr": "y=sin(x)"}' | plot-code-lib --eval-json
plot-code-lib --expression "y=x^2" --range "x=-5:5" --format csv > data.csv
```

## Batch Processing

Support processing multiple expressions:
- Read expression lists from files
- Generate multiple plots in single invocation  
- Combine multiple datasets into comparative plots
- Export datasets for different expressions simultaneously

## Testing Requirements

Unit tests should verify:
- JSON parsing and output formatting
- CSV import/export functionality
- Pipeline operations with stdin/stdout
- Batch processing multiple expressions
- Data transformation accuracy without plotting
- Integration with existing plotting features