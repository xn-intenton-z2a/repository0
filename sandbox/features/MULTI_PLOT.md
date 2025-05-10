# Overview

Extend the CLI and HTTP API to allow plotting multiple functions on a single SVG canvas. Users can specify several functions with individual parameters so they appear together for comparison or combined visualization.

# CLI Interface

The entrypoint remains `node src/lib/main.js` with a new positional type `multi` and repeated function definitions:

- Positional argument: `multi`
- Named options:
  - `--output` or `-o`: path for the output SVG file (default `plot.svg`)
  - `--width`: canvas width in pixels (default `800`)
  - `--height`: canvas height in pixels (default `600`)
  - `--func`: can be repeated to specify each plot. Each value is a comma separated list starting with `functionType` then key=value pairs. Example:
    - --func quadratic,a=1,b=0,c=0
    - --func sine,amplitude=2,frequency=1

# HTTP API

Add an endpoint at GET `/plot/multi` accepting repeated query parameter `func`. Each `func` value follows the same comma separated syntax. Clients receive a single SVG document combining all requested plots.

# Behavior

1. Parse and validate that the first positional argument is `multi` (for CLI) or path segment is `multi` (for HTTP).  
2. Collect all `func` definitions, parse each into function type and parameters.  
3. For each function entry, invoke the matching plot function with its parameters and canvas size.  
4. Strip each returned SVG wrapper, extract the inner `<polyline>` or `<path>` elements, and add a distinct stroke color from a predefined palette.  
5. Wrap all elements in a single `<svg>` element with width and height, preserve XML namespace.  
6. Write the combined SVG to the output file for CLI or return as response body for HTTP with content type image/svg+xml.

# Testing

- Create an integration test in `sandbox/tests/multiPlotter.test.js` using child_process for CLI:  
  - Run `node src/lib/main.js multi --func quadratic,a=1,b=0,c=0 --func sine,amplitude=1,frequency=1 -o combined.svg`  
  - Verify file exists and contains both `<polyline` and `<path` tags.  
- Create supertest tests for HTTP API:  
  - GET `/plot/multi?func=quadratic,a=1,b=0,c=0&func=sine,amplitude=1,frequency=1`  
  - Expect status 200, content type image/svg+xml, and body contains two distinct elements each with stroke attributes.

# Documentation

- Update `README.md`:  
  - Add CLI example for multi-plot usage.  
  - Add HTTP example curl command.  
  - Document the `--func` syntax and available function types.