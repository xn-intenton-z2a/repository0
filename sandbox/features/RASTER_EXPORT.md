# RASTER_EXPORT

# Purpose
Allow users to export generated SVG plots as raster images (PNG or JPEG) directly from the CLI tool or HTTP endpoints for easier integration into documents, presentations, and web pages without manual conversion.

# CLI Behavior
- Introduce a new --export-image <filename> flag. Supported file extensions are .png and .jpg/.jpeg.
- When --export-image is provided:
  - Generate the SVG plot or polar image as usual.
  - Convert the SVG to a raster image using the sharp library.
  - Write the resulting image to the specified filename.
  - On unsupported extensions or conversion errors, output a descriptive error message and exit with code 1.
- The new flag is mutually exclusive with --export-data but may be combined with --output for SVG; behavior precedence: --export-data > --export-image > --output.

# HTTP Endpoints
- Extend GET /plot and GET /polar to accept an imageFormat query parameter with values png or jpeg.
- When imageFormat is present:
  - Generate the SVG server-side.
  - Convert the SVG to the requested raster format using sharp.
  - Respond with Content-Type: image/png or image/jpeg and the binary image data.
  - On unsupported imageFormat values, respond with HTTP 400 and a descriptive error message.

# Implementation Details
- Add sharp as a new dependency in package.json.
- In handlePlot and handlePolar:
  1. Check for argv["export-image"].
  2. After generating the SVG string, if export-image is set:
     - Use sharp(Buffer.from(svg)) to create an image pipeline.
     - pipeline.toFormat(format) and pipeline.toFile(filename).
     - On success, exit code 0; on error, print error and exit with code 1.
- In startServer HTTP handlers for /plot and /polar:
  1. Read params.get('imageFormat').
  2. After generating the SVG string, if imageFormat is specified:
     - Use sharp(Buffer.from(svg)) to convert to binary.
     - Write response with appropriate headers and image buffer.
     - On error or unsupported value, set status 400 and end with error message.

# Testing
- Add sandbox/tests/raster-export.test.js covering:
  - CLI: --plot quadratic --export-image output.png produces a valid PNG file with proper signature.
  - CLI: --polar rose --export-image output.jpg produces a valid JPEG file.
  - CLI error when using unsupported extension (e.g., .gif) or conversion failure.
  - HTTP: GET /plot?function=sine&range=0,3&imageFormat=png returns 200 with image/png and buffer starting with PNG signature.
  - HTTP: GET /polar?...&imageFormat=gif returns 400 with descriptive message.

# Documentation
- Update sandbox/docs/CLI_USAGE.md under plot and polar sections to document --export-image usage with examples.
- Update sandbox/docs/HTTP_SERVER.md to include imageFormat query parameter examples.
- Update README.md features section to mention Raster Export Support.