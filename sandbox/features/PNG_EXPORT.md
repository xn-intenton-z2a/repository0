# PNG_EXPORT

Enable export of generated SVG plots as PNG raster images to support environments that require bitmap output.

# CLI INTEGRATION

Add a new boolean flag --export-png on plot, plots, and polar commands. When provided, the CLI will:

1. Generate the SVG as usual in memory using existing flags and style options.
2. Convert the SVG string to a PNG image using the sharp library.
3. Write the resulting PNG buffer to the output path. If --output ends with .png or no --output is provided, default to plot.png for Cartesian or polar.png for polar mode.
4. Preserve all styling, dimensions, grid, fill, annotations, legend, and other enabled features in the PNG output.

# HTTP ENDPOINT SUPPORT

Extend the /plot and /polar endpoints with an optional query parameter format=png or png=true. When this parameter is present, the server will:

1. Build the SVG response in memory as before.
2. Invoke sharp to convert the SVG buffer into PNG format.
3. Set the response Content-Type header to image/png.
4. Send the PNG binary in the HTTP response body.

When format is omitted or set to svg, the endpoint continues to return SVG with Content-Type image/svg+xml.

# IMPLEMENTATION NOTES

- Add sharp as a new dependency in package.json.
- Import sharp at the top of sandbox/source/main.js.
- In handlePlot and handlePolar, after constructing the SVG string, detect argv[format] or argv["export-png"].
- For CLI mode:
  • If export-png is true, pass the SVG string to sharp and await png buffer.
  • Write the PNG buffer to the filesystem at the specified output path.
  • Exit with code 0 on success, 1 on error.
- For HTTP mode:
  • In /plot and /polar route handlers, check params.get('format') or params.get('png').
  • If PNG requested, convert the SVG to PNG buffer and send with Content-Type image/png; otherwise proceed with SVG.
- Add unit tests in sandbox/tests/cli-interface.test.js to verify that invoking CLI with --export-png produces a file with PNG header signature and correct exit code.
- Add integration tests in sandbox/tests/data-export.test.js to fetch /plot?function=quadratic&range=0,5&format=png and /polar?function=rose&radius-range=0,1&angle-range=0,6.28&format=png and check response content-type and PNG signature bytes.
- Update sandbox/docs/CLI_USAGE.md and sandbox/docs/HTTP_SERVER.md with descriptions of --export-png flag and format=png parameter along with concise examples.
