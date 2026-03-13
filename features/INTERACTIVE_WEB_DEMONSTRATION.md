# Interactive Web Demonstration

Create a browser-based demonstration that showcases plot-code-lib core functionality with interactive forms, live plotting, and CLI command generation to highlight the library's capabilities.

## Purpose

Provide an accessible web demonstration of plot-code-lib functionality that allows users to experiment with mathematical expressions and see results instantly, while generating equivalent CLI commands that demonstrate the library's command-line capabilities.

## Acceptance Criteria

- Add interactive form with input fields for expression, range, and output format
- Include Generate Plot button that creates SVG visualization in browser using library functionality
- Support mathematical expression validation with clear error messaging for invalid input
- Add CLI command generator showing equivalent command-line usage for current inputs
- Include curated example expressions with one-click loading (sine, cosine, parabola, exponential)
- Support step size configuration through range input with preview of data point count
- Add plot preview area that displays generated SVG directly in browser
- Include example usage section with common mathematical functions and ranges
- Support responsive design that works on desktop and mobile devices
- Add copy-to-clipboard functionality for generated CLI commands

## Technical Implementation

Enhance existing web interface with interactive form controls and JavaScript event handling. Use browser-compatible subset of library functionality for client-side expression validation and plotting. Add example data and CLI command generation logic. Implement responsive CSS design for cross-device compatibility.

## Integration Points

- Builds on existing web interface in src/web/index.html with enhanced interactivity
- Uses browser-compatible parts of main library functionality for client-side operation
- Generates CLI commands that match actual CLI interface functionality and syntax
- Compatible with existing mathematical expression parsing and SVG rendering
- Demonstrates real library capabilities while keeping web demo lightweight and focused

## Example Usage

Interactive plotting: Enter "y=sin(x)", set range "x=-pi:pi", click Generate to see plot

CLI generation: Form automatically shows "node src/lib/main.js -e 'y=sin(x)' -r 'x=-pi:pi' -f output.svg"

Example loading: Click "Sine Wave" example to auto-populate form with working expression and range

Step size control: Adjust step size slider to see data point count update before plotting