# Data Export Integration

Add CLI flags for JSON and CSV data export alongside plot generation to enable seamless data analysis workflows and integration with external tools.

## Purpose

Complete the CLI interface by adding data export capabilities that work alongside plot generation. The TimeSeriesGenerator exportJSON and exportCSV methods are implemented but not exposed through CLI flags, limiting users to programmatic access only.

## Status: PARTIALLY IMPLEMENTED 🔄

Backend methods exist in TimeSeriesGenerator class, but CLI flags are missing. Web interface lacks data export functionality.

## Acceptance Criteria

- 🔲 Add CLI flags --export-json and --export-csv to save time series data alongside plots
- 🔲 Support combined output: --file plot.svg --export-json data.json for dual plot and data generation
- 🔲 Add --data-only flag to export time series data without generating plots for pure data workflows  
- 🔲 Support automatic filename generation when data export flag is used without explicit filename
- 🔲 Include metadata in exported files (expression, range, timestamp, step size information)
- 🔲 Add data export options to web interface with download buttons for JSON and CSV formats
- 🔲 Display data preview in web interface showing generated coordinate points before download
- ✅ Backend methods: exportJSON and exportCSV exist in TimeSeriesGenerator
- 🔲 Handle file path resolution correctly for data export files relative to plot output location
- 🔲 Add help text documentation for all new CLI flags with clear usage examples

## Technical Implementation

Extend CLI argument parsing in main.js to recognize --export-json, --export-csv, and --data-only flags. Integrate with existing TimeSeriesGenerator exportJSON/exportCSV methods. Add filename auto-generation logic based on plot filename. Update web interface with data export controls and client-side download functionality using existing library methods.

## Integration Points

- Uses existing TimeSeriesGenerator exportJSON and exportCSV methods without modification
- Extends current CLI interface parsing logic with additional flag handling  
- Integrates with existing file output system and path resolution
- Compatible with current mathematical expression parsing and time series generation
- Web interface can use same library methods for browser-based data export functionality
- Maintains backwards compatibility with existing CLI usage patterns

## Example Usage

Plot with JSON export: node src/lib/main.js --expression "y=sin(x)" --range "x=-pi:pi" --file sine.svg --export-json sine.json

Data only mode: node src/lib/main.js --expression "y=cos(x)" --range "x=0:2*pi,step=0.1" --data-only --export-csv cosine-data.csv

Auto filename: node src/lib/main.js --expression "y=x^2" --range "x=-2:2" --file parabola.png --export-json (creates parabola.json)

Combined formats: node src/lib/main.js --expression "y=log(x)" --range "x=0.1:10" --file log.svg --export-json --export-csv