# Batch Processing

Enable efficient generation of multiple mathematical plots through batch file processing and scripting capabilities to support complex mathematical analysis workflows.

## Purpose

Extend plot-code-lib beyond single expression plotting to support research and analysis scenarios where multiple related mathematical functions need to be plotted together or in sequence, enabling users to generate comprehensive mathematical visualizations efficiently.

## Acceptance Criteria

- Add --batch flag to CLI that accepts JSON configuration files with multiple expressions and settings
- Support batch configuration files defining arrays of expressions, ranges, and output specifications
- Include template generation command --create-batch to generate example batch configuration files
- Add --output-dir flag to organize batch outputs into specified directory structures automatically
- Support concurrent plot generation for improved performance when processing multiple expressions
- Include progress reporting and summary statistics for batch operations showing completion status
- Add batch validation mode --validate-batch to check configuration files before execution
- Support variable substitution in batch files for parameterized expression generation
- Include error handling that continues batch processing even if individual expressions fail
- Add batch examples showing common use cases like function families and parameter sweeps

## Technical Implementation

Extend CLI argument parsing to support batch mode flags and configuration file loading. Create batch configuration JSON schema with expression arrays and output specifications. Add concurrent processing using Promise.all for parallel plot generation. Implement progress reporting with status updates and error collection for failed operations.

## Integration Points

- Uses existing ExpressionParser, TimeSeriesGenerator, and PlotRenderer classes without modification
- Extends current CLI interface with batch processing capabilities while maintaining single expression compatibility
- Compatible with existing file output system and path resolution for organized batch outputs
- Works with current error handling and validation logic extended to batch contexts
- Integrates with existing mathematical expression parsing and supports all current function capabilities
- Maintains compatibility with all existing CLI flags when used in batch configuration contexts

## Example Usage

Simple batch: node src/lib/main.js --batch functions.json --output-dir plots/

Create template: node src/lib/main.js --create-batch template.json

Validate first: node src/lib/main.js --validate-batch experiments.json && node src/lib/main.js --batch experiments.json

Progress reporting: Batch processing shows "Processing 5/10 expressions..." with individual success/failure status