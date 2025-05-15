# ANIMATION_SUPPORT

# Purpose
Allow users to animate the drawing of SVG plots and polar plots, giving dynamic visual feedback that illustrates how data series are constructed over time.

# CLI Behavior
- Introduce a flag --animate to enable animation of the polyline drawing sequence
- Add an option --duration to specify the animation length using CSS time units, for example 2s or 500ms (default: 1s)
- When --animate is present:
  - Generate SVG with embedded animation elements that progressively draw the polyline over the specified duration
  - Validate duration format; if invalid, print descriptive error and exit with code 1

# HTTP Endpoints
- Extend GET /plot and GET /polar to accept query parameters animate=true and duration=<time>
- Validate parameters; respond with HTTP 400 on missing or invalid values
- When animation is requested, include animation tags in the returned SVG so that clients see the drawing effect

# Implementation Details
- In handlePlot and handlePolar in sandbox/source/main.js:
  - Parse argv.animate and argv.duration or searchParams.get('animate') and searchParams.get('duration')
  - Add animate and duration fields to the style configuration object passed to SVG generators
- In generatePlotSVG and generatePolarSVG:
  - If animate is true:
    1. Add stroke-dasharray and stroke-dashoffset attributes to the <polyline>
    2. Insert an <animate attributeName=stroke-dashoffset from=fullLength to=0 dur=duration fill=freeze/> element immediately after the polyline definition

# Testing
- Create sandbox/tests/animation.test.js covering:
  - CLI: --plot sine --animate generates SVG containing animate tag with default duration
  - CLI: --polar rose --animate --duration 2s generates SVG with animate tag dur attribute set to 2s
  - CLI error when --duration given invalid value exits code 1 with descriptive message
  - HTTP: GET /plot?function=quadratic&range=0,5&animate=true returns SVG containing animate tag
  - HTTP: GET /polar?function=spiral&radius-range=0,1&angle-range=0,6.28&animate=true&duration=500ms returns SVG with proper dur
  - HTTP invalid duration returns 400 status and descriptive message

# Documentation
- Update sandbox/docs/CLI_USAGE.md to document --animate and --duration options with examples
- Update sandbox/docs/HTTP_SERVER.md to document animate and duration query parameters
- Update README.md feature list to include Animation Support