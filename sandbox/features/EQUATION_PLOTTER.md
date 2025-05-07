# Overview
This feature adds a library and command line interface for plotting mathematical functions as SVG images. It extends the main module to accept plot parameters, compute point samples, and render a complete SVG output.

# Functionality
It supports:
- Quadratic plots with coefficients a, b, c
- Sine wave plots with amplitude, frequency, and phase
- Custom domain bounds, resolution (number of steps), and SVG canvas size
- CLI invocation via the existing main entry point to write SVG output to a file
- Programmatic invocation via an exported generateSvgPlot function that returns a SVG string

# API
Exported function: generateSvgPlot(functionDefinition, options)
- functionDefinition: a callback f(x) returning y
- options: object with minX, maxX, steps, width, height
- returns a string containing valid SVG markup

CLI behavior in src/lib/main.js:
- Read arguments: type, coefficients or parameters, domain bounds, steps, width, height, output path
- Call generateSvgPlot with appropriate function and options
- Write SVG string to output file

# Usage
Use the CLI:
 npm run start -- type quadratic 1 0 0 -10 10 200 800 600 plot.svg
 npm run start -- type sine 5 2 0 -3.14 3.14 300 600 400 sine.svg

Use programmatically:
 import { generateSvgPlot } from src/lib/main.js
 const svg = generateSvgPlot(x => x * x, { minX: -5, maxX: 5, steps: 100, width: 500, height: 400 })

# Testing
Add unit tests that:
- Invoke generateSvgPlot for known functions and check that the returned string contains expected SVG path data
- Verify that SVG width and height attributes match options
- Test CLI invocation writes a file with correct SVG header and path element