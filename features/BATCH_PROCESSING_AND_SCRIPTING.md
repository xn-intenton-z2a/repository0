# Batch Processing and Scripting

Add batch processing capabilities and configuration file support to enable automated plot generation workflows and scripting integration.

## Purpose

Enable plot-code-lib to function as a powerful automation tool for mathematical visualization by supporting batch operations, configuration files, and integration with shell scripts and data processing pipelines.

## Acceptance Criteria

- Support configuration files in JSON format defining multiple plot jobs
- Add --config flag to CLI for batch processing multiple expressions
- Support variable substitution in configuration files for parameterized plots
- Add --batch flag for processing arrays of expressions from stdin
- Include template system for consistent plot styling across batch operations
- Support output directory organization with automatic file naming
- Add progress reporting and logging for long-running batch jobs
- Include dry-run mode for validating batch configurations before execution
- Support parallel processing of independent plot generation tasks
- Add watch mode for automatically regenerating plots when config changes

## Technical Implementation

Extend CLI interface to parse JSON configuration files and batch arrays. Create BatchProcessor class that coordinates multiple PlotRenderer instances. Add file system utilities for organized output management and template processing.

## Integration Points

- Builds on existing CLI interface and core plotting classes
- Uses current ExpressionParser, TimeSeriesGenerator, and PlotRenderer
- Compatible with existing single-expression CLI usage patterns
- Works with current file output system while adding batch organization
- Integrates with shell scripting workflows and automation tools

## Example Usage

Batch process from config: node src/lib/main.js --config batch-plots.json --output-dir ./generated-plots

Process expression array: echo '["y=sin(x)", "y=cos(x)", "y=tan(x)"]' | node src/lib/main.js --batch --range "x=-pi:pi" --format svg

Watch for changes: node src/lib/main.js --config plots.json --watch --output-dir ./live-plots