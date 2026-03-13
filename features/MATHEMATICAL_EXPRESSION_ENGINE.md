# Mathematical Expression Engine

Provide robust mathematical expression parsing and evaluation capabilities using Math.js to support comprehensive function libraries and ensure reliable computation for diverse plotting scenarios.

## Purpose

Deliver a solid foundation for mathematical plotting by leveraging Math.js's comprehensive function library and expression parsing capabilities, ensuring users can plot a wide variety of mathematical expressions reliably.

## Status: IMPLEMENTED ✅

Complete mathematical expression engine with comprehensive function support through Math.js integration.

## Acceptance Criteria

- ✅ Full Math.js integration providing extensive mathematical function library
- ✅ Support for common mathematical functions (sin, cos, tan, log, exp, sqrt, abs, pow)
- ✅ Advanced mathematical functions available through Math.js (gamma, combinations, statistics)
- ✅ Mathematical constants support (pi, e) with proper parsing and evaluation
- ✅ Robust expression parsing with comprehensive error handling and validation
- ✅ Support for complex mathematical expressions with proper operator precedence
- ✅ Variable substitution and evaluation for parametric plotting scenarios
- ✅ Domain error handling for mathematical operations (division by zero, domain restrictions)
- ✅ Comprehensive test coverage validating mathematical accuracy and edge cases
- ✅ Clean API design enabling easy extension and integration with plotting workflows

## Technical Implementation

ExpressionParser class leverages Math.js compile functionality for robust expression parsing and evaluation. TimeSeriesGenerator includes exportJSON and exportCSV methods for data access. Comprehensive error handling ensures graceful degradation for invalid mathematical operations.

## Integration Points

- Core foundation used by all plotting functionality in the library
- TimeSeriesGenerator relies on expression evaluation for coordinate generation
- PlotRenderer uses processed mathematical data for visualization creation
- CLI interface validates expressions through this engine before processing
- Web interface demonstrates mathematical capabilities through interactive forms
- Test suite validates mathematical accuracy and edge case handling comprehensively

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