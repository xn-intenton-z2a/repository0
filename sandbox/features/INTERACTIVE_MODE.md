# INTERACTIVE_MODE

This feature enables generation of interactive HTML files that wrap SVG plots with basic pan and zoom capabilities, enhancing user exploration without external tools.

# CLI INTEGRATION

•  --interactive (boolean)
  When present on plot, plots, or polar commands, the tool:
  1. Generates the SVG as usual in memory using existing flags and options.
  2. Wraps the SVG markup in a minimal HTML scaffold including inline JavaScript for pan and zoom interactions.
  3. Writes the resulting HTML to the output path. If --output ends with .html or omitted, defaults to plot.html or polar.html.

# HTTP ENDPOINT SUPPORT

Extend the /plot and /polar endpoints to recognize query parameter html=true or format=html. When requested:
  1. Build the SVG response as before.
  2. Wrap SVG in HTML with inline JavaScript for client-side pan and zoom.
  3. Set Content-Type to text/html and send the HTML document.

# IMPLEMENTATION NOTES

1. In sandbox/source/main.js import no additional dependencies.  Implement an htmlTemplate(svgString) helper that returns a complete HTML document: a head with meta charset and style to size the SVG container, the inline script to capture wheel and pointer events, and the SVG inside a div.

2. In handlePlot and handlePolar, detect argv.interactive or params.get('html') or params.get('format') equals html. If true and not exporting data:
   • After generating svgString, call htmlTemplate(svgString).
   • Write HTML output instead of raw SVG or send with text/html.

3. JavaScript in template:
   • Support zoom by wheel: scale the SVG viewBox or apply CSS transform scale on container.
   • Support pan by pointer down, move, up events: translate container or adjust viewBox.
   • Keep controls minimal: no external libraries.

4. Tests:
   • Add unit tests in sandbox/tests/cli-interface.test.js to verify --interactive produces .html output with html, head, and script tags.
   • Add integration tests in sandbox/tests/data-export.test.js for HTTP /plot?function=quadratic&range=0,5&html=true returns text/html with html doctype and script.

5. Documentation:
   • Update sandbox/docs/CLI_USAGE.md and HTTP_SERVER.md with descriptions and examples of --interactive flag and html=true parameter.
   • Update README.md feature list to include INTERACTIVE_MODE.