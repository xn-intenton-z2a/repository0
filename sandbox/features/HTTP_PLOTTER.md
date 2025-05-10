# Overview

Extend the repository to expose an HTTP API for generating SVG plots on demand. The new service will run an express server within main.js and allow users to request plots by sending HTTP GET calls, receiving SVG output directly in the response.

# API

Define an HTTP endpoint at GET /plot/:functionType where functionType can be any of the supported types such as quadratic, sine, polar, circle, ellipse, or parametric. Query string parameters will map to the existing plot functions:
- Common parameters: width, height
- Quadratic: a, b, c, xMin, xMax
- Sine: amplitude, frequency, xMin, xMax
- Polar: a, n, mode, steps
- Circle and Ellipse: radius or a and b, steps
- Parametric: xExpr, yExpr, tMin, tMax, steps

Responses are returned with content type image/svg+xml and the body is the generated SVG string.

# Behavior

1. Add express and supertest as dependencies in package.json.
2. In main.js import express and all plot functions from sandbox/source/plot.js.  
3. Initialize an express application and define a GET handler for /plot/:functionType.  
4. In the handler parse and validate query parameters according to the requested functionType.  
5. Invoke the matching plot function with numeric or expression parameters.  
6. On success return status 200 with content type image/svg+xml and the SVG markup.  
7. On validation failure return status 400 with a JSON error message.  
8. Start the server on the port from environment variable PORT or default to 3000.  

# Testing

- Create integration tests in sandbox/tests/httpPlotter.test.js using supertest.  
- Test that GET /plot/quadratic with a b c returns status 200, header content type image/svg+xml and response includes polyline element.  
- Test that GET /plot/sine with amplitude and frequency returns a path element.  
- Test error responses for missing required parameters.  
- Verify server starts on default and custom PORT values.

# Documentation

- Update README.md to add HTTP API section.  
- Include example curl commands for each functionType with sample parameter values.  
- Document available query parameters for each plot type and describe how to run the server and override PORT.