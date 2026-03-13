# Data Export Integration

Expose JSON and CSV time series data export capabilities through CLI and web interface to enable data analysis workflows and integration with other tools.

## Purpose

Make plot-code-lib a complete data analysis tool by providing easy access to the underlying time series data in standard formats, enabling users to generate both visualizations and raw data for further analysis, spreadsheet import, or integration with other mathematical tools.

## Acceptance Criteria

- Add CLI flags --export-json and --export-csv to save time series data alongside plots
- Support combined output with --file plot.svg --export-json data.json for dual output
- Add data export options to web interface with download buttons for JSON and CSV
- Include data export in interactive web demo with preview of generated data points
- Support automatic filename generation for data exports based on plot filename
- Add --data-only flag to export time series without generating plots for pure data workflows
- Include proper headers and metadata in exported data files (expression, range, timestamp)
- Support step size and range information in data export metadata
- Add data validation and summary statistics in exported files (min, max, count, step)
- Enable bulk data export for multiple expressions with organized file naming

## Technical Implementation

Extend CLI argument parsing to support data export flags and integrate with existing TimeSeriesGenerator exportJSON and exportCSV methods. Add web interface controls for data export with client-side download functionality. Create combined workflow that generates both plots and data files in single operations. Add metadata enrichment to exported data files.

## Integration Points

- Builds on existing TimeSeriesGenerator exportJSON and exportCSV methods
- Extends current CLI interface with additional export functionality
- Integrates with web interface for browser-based data export downloads
- Works with existing mathematical expression parsing and time series generation
- Compatible with current file output system while adding data export capabilities
- Uses existing range specification and step size configuration

## Example Usage

Plot with data: node src/lib/main.js -e "y=sin(x)" -r "x=-pi:pi" -f sine.svg --export-json sine.json

Data only: node src/lib/main.js -e "y=cos(x)" -r "x=0:2*pi,step=0.1" --data-only --export-csv cosine-data.csv

Auto naming: node src/lib/main.js -e "y=x^2" -r "x=-2:2" -f parabola.png --export-json (creates parabola.json)

Web export: Click "Download Data as JSON" button after generating plot to save time series data