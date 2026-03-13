# Interactive Web Interface

Provide a functional web interface demonstrating plot-code-lib capabilities with working examples and interactive forms that showcase the library's mathematical plotting features.

## Purpose

Serve as the primary demonstration and testing interface for plot-code-lib, allowing users to experiment with mathematical expressions and see CLI command examples before using the command-line tool directly.

## Status: IMPLEMENTED ✅

Web interface is complete with working demonstration forms, examples, and CLI command generation.

## Acceptance Criteria

- ✅ Basic web interface with demonstration forms and examples
- ✅ Interactive forms for expression parsing, time series generation, and CLI interface testing
- ✅ Working examples showcasing core mathematical functions (sin, cos, polynomials)
- ✅ CLI command generation showing equivalent command-line usage for web interface inputs
- ✅ Expression parser demonstration with error handling and syntax validation
- ✅ Time series generator interface with configurable ranges and step sizes
- ✅ Clean, professional design that works on desktop and mobile devices
- ✅ Example usage section demonstrating multiple mathematical plotting scenarios
- ✅ Integration with the core library classes for actual functionality testing
- ✅ Responsive layout that adapts to different screen sizes effectively

## Technical Implementation

Enhance existing web interface JavaScript with debounced real-time expression evaluation and plot rendering. Add input validation using ExpressionParser error handling. Implement URL parameter encoding/decoding for shareable plots. Create responsive CSS layout with modern design patterns. Add preset expression library with categorized mathematical functions.

## Integration Points

- Builds on existing web interface foundation in src/web/ directory and index.html structure
- Uses current ExpressionParser, TimeSeriesGenerator, and PlotRenderer classes without modification
- Integrates with existing build system and static file serving through npm run start command
- Compatible with current SVG rendering while adding interactive preview and customization
- Works with existing CLI functionality by generating equivalent command examples for users
- Maintains existing behavior test compatibility while adding new interactive features

## Example Usage

Real-time preview: User types "y=sin(x*2)" and plot updates instantly without clicking generate button

Preset functions: Click "Trigonometric" → "Sine Wave" to auto-populate expression field with "y=sin(x)" and range "x=-pi:pi"

CLI generation: After customizing plot, click "Show CLI Command" displays: node src/lib/main.js --expression "y=sin(x)" --range "x=-pi:pi" --file plot.svg

URL sharing: Generated URLs like /plot?expr=y%3Dsin%28x%29&range=x%3D-pi%3Api for bookmarking and sharing specific plots