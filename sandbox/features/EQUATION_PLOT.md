# Purpose

Implement a command line equation plotter that transforms mathematical expressions into SVG graphics.

# Behavior

The main script will parse command line options to select a function type and its parameters. Supported functions include quadratic and sine. The script computes a series of (x, y) points over a fixed domain, converts them into SVG path data, and outputs a complete SVG image.

The CLI accepts the following options:
  --type    Function type: "quadratic" or "sine".
  --a       Coefficient a for quadratic. Default 1.
  --b       Coefficient b for quadratic. Default 0.
  --c       Coefficient c for quadratic. Default 0.
  --amplitude Amplitude for sine. Default 1.
  --frequency Frequency for sine. Default 1.
  --phase   Phase shift for sine. Default 0.
  --output  File path to write SVG. If omitted, SVG is printed to stdout.

The SVG canvas is 500 by 500 pixels. The domain for x is 0 to 100. The computed y values are scaled to fit 0 to 100 then inverted for SVG coordinate space.

# CLI Usage

Run in terminal:

node src/lib/main.js --type quadratic --a 1 --b 0 --c 0 --output plot.svg

node src/lib/main.js --type sine --amplitude 1 --frequency 2 --phase 0

# Testing

Add unit tests for the generateSVG function. Tests should invoke the function with known parameters and assert that the returned string starts with <svg and contains path data commands. Include a test for writing to a file when the output option is provided.

# Documentation

Update the README to describe the new equation plot feature. Include usage examples for both quadratic and sine plots. Add a note on how to view the generated SVG file.
