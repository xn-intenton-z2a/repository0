# Data Export Formats

Extend plot-code-lib to export time series data in multiple structured formats including JSON and CSV, enabling data pipeline integration and analysis workflows.

## Purpose

Enable plot-code-lib to serve as both a visualization tool and a data generation tool by providing time series data export capabilities in standard formats that integrate with data analysis workflows and external tools.

## Status: FOUNDATION READY 🔄

Core time series generation is implemented with basic JSON/CSV export methods available. Missing CLI integration and file export functionality.

## Acceptance Criteria

- ✅ TimeSeriesGenerator includes exportJSON and exportCSV methods for data serialization
- ✅ Core mathematical expression evaluation and time series generation working correctly
- 🔲 Add --export-json flag to CLI for saving time series data as structured JSON files
- 🔲 Add --export-csv flag to CLI for saving time series data as comma-separated values
- 🔲 Support --data-only mode that exports data without generating plot visualization files
- 🔲 Implement automatic filename generation for export files based on plot filename
- 🔲 Add combined plotting and export workflows supporting multiple output formats simultaneously
- 🔲 Include data validation and formatting options for exported files
- 🔲 Support custom field names and data structure configuration for exports
- 🔲 Add web interface controls for downloading data in JSON/CSV formats from browser
- 🔲 Include comprehensive error handling for file system operations and data serialization
- 🔲 Support large dataset export with memory-efficient streaming for complex expressions

## Technical Implementation

Extend CLI argument parsing in main.js to recognize --export-json, --export-csv, and --data-only flags. Integrate with existing TimeSeriesGenerator exportJSON/exportCSV methods. Add filename auto-generation logic based on plot filename. Update web interface with data export controls and client-side download functionality.

## Integration Points

- Uses existing TimeSeriesGenerator exportJSON and exportCSV methods without modification
- Extends current CLI interface parsing logic with additional flag handling
- Integrates with existing file output system and path resolution
- Compatible with current mathematical expression parsing and time series generation
- Web interface uses same library methods for browser-based data export functionality
- Maintains backwards compatibility with existing CLI usage patterns

## Example Usage

Plot with JSON export: node src/lib/main.js --expression \"y=sin(x)\" --range \"x=-pi:pi\" --file sine.svg --export-json sine.json

Data only mode: node src/lib/main.js --expression \"y=cos(x)\" --range \"x=0:2*pi,step=0.1\" --data-only --export-csv cosine-data.csv

Auto filename: node src/lib/main.js --expression \"y=x^2\" --range \"x=-2:2\" --file parabola.png --export-json

Combined formats: node src/lib/main.js --expression \"y=log(x)\" --range \"x=0.1:10\" --file log.svg --export-json --export-csv