# Data Pipeline Integration

Enable plot-code-lib to work as a data pipeline component by adding comprehensive data import/export capabilities with standard format support and streaming interfaces.

## Purpose

Transform plot-code-lib into a powerful data pipeline tool that can consume data from various sources, apply mathematical transformations, and output results in multiple formats suitable for further processing or visualization.

## Acceptance Criteria

- Add --format flag supporting: svg, png, csv, json, tsv, parquet
- Support --stdout flag for pipeline-friendly streaming output
- Add --input flag for reading CSV, JSON, TSV, and Parquet data files
- Include column mapping with --x-column and --y-column flags for imported data
- Support mathematical transformation of imported data columns with expressions
- Add --filter flag for data filtering before transformation or plotting
- Include streaming data processing for large datasets that don't fit in memory
- Support data aggregation functions: sum, mean, median, percentiles
- Add data validation and error reporting for malformed input files
- Include metadata preservation through the transformation pipeline

## Technical Implementation

Create DataPipeline class that handles input parsing, transformation, and output formatting. Extend CLI to support data source flags and streaming operations. Add column mapping utilities and data validation functions. Integrate with existing plot generation for visual output.

## Integration Points

- Extends existing CLI interface with new data processing flags
- Uses current ExpressionParser for mathematical transformations on data
- Works with existing PlotRenderer when visual output is requested
- Compatible with TimeSeriesGenerator for coordinate data handling
- Maintains full backward compatibility with expression-based plotting

## Example Usage

Transform data pipeline: cat data.csv | node src/lib/main.js --input stdin --x-column time --y-column value --expression "y=log(value)" --format csv --stdout

Process and visualize: node src/lib/main.js --input measurements.json --filter "value > 0" --expression "y=sqrt(value)" --format svg --file analysis.svg