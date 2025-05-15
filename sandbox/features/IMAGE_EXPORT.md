# IMAGE_EXPORT

# Purpose
Enable users to export generated plots as raster images (PNG or JPEG) in addition to SVG, facilitating integration into documents and presentations without external conversion tools.

# CLI Behavior
- Introduce a new flag --export-image that accepts a filename with .png or .jpeg/.jpg extension.
- When used with --plot or --polar commands:
  - Generate the SVG content as usual then convert to the requested raster format.
  - Determine format by file extension (.png or .jpg/.jpeg). Default to PNG if ambiguous.
  - Use the sharp library to convert the SVG to the specified format.
  - Write the resulting image file to disk. Exit with code 0 on success.
  - If both --export-image and --output or --export-data are provided, prioritize --export-image and ignore other output flags.
- Validate the file extension and exit with code 1 if unsupported or if conversion fails.

# HTTP Endpoints
- Add two new endpoints:
  - GET /plot-image?function=<quadratic|sine>&range=<start,end>&imageFormat=<png|jpeg>&[other styling and resolution parameters]
  - GET /polar-image?function=<spiral|rose>&radius-range=<rStart,rEnd>&angle-range=<thetaStart,thetaEnd>&imageFormat=<png|jpeg>&[other styling and resolution parameters]
- Validate required parameters. Respond with 400 status and descriptive error for missing or invalid parameters.
- Generate SVG internally then convert to raster using sharp.
- Respond with Content-Type image/png or image/jpeg and the binary image data in the HTTP response body.

# Implementation Details
- Add sharp as a production dependency in package.json.
- In sandbox/source/main.js:
  - Detect argv['export-image'] in handlePlot and handlePolar routines.
  - After generating SVG string, pass it to sharp(Buffer.from(svg)) and call .png() or .jpeg() based on extension.
  - Await the conversion and write to the specified file path.
  - In HTTP server block, extend request handling for /plot-image and /polar-image.
    - Parse query parameters, generate SVG via generatePlotSVG or generatePolarSVG.
    - Convert via sharp and stream the result with correct Content-Type header.
- Reuse existing style and resolution parsing logic for consistent visual output.

# Testing
- Add sandbox/tests/image-export-cli.test.js covering:
  - CLI: --plot quadratic --export-image plot.png produces a valid PNG file of expected size.
  - CLI: --polar rose --export-image polar.jpg produces a valid JPEG file.
  - Error case: unsupported extension .bmp exits code 1 with descriptive error.
- Add sandbox/tests/image-export-http.test.js covering:
  - GET /plot-image?function=sine&range=0,6.28&imageFormat=png returns status 200 with Content-Type image/png and non-empty body.
  - GET /polar-image?function=spiral&radius-range=0,1&angle-range=0,6.28&imageFormat=jpeg returns Content-Type image/jpeg.
  - Missing or invalid imageFormat parameter returns 400 with error message.

# Documentation
- Update sandbox/docs/CLI_USAGE.md under plot and polar sections to document --export-image flag with examples.
- Update sandbox/docs/HTTP_SERVER.md to document /plot-image and /polar-image endpoints and their parameters.
- Update README.md features section to mention Image Export Support.
