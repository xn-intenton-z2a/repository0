# Overview

Implement a command-line equation plotter that generates an SVG visualization of common mathematical functions. This feature extends the main script to parse a function type and output file path, produce an SVG string representing the plot, and write it to disk.

# CLI Interface

The script accepts positional and named arguments:

- Positional argument `functionType`: one of `quadratic` or `sine`.
- Named options:
  - `--output` (or `-o`): file path for the output SVG (default `plot.svg`).
  - `--width`: canvas width in pixels (default `800`).
  - `--height`: canvas height in pixels (default `600`).
  - `--steps`: number of sample points to plot (default `100`).

# Behavior

1. Validate `functionType` and options.
2. Generate coordinate samples:
   - For `quadratic`, plot y = x^2 over x in [-10, 10].
   - For `sine`, plot y = sin(x) over x in [-2π, 2π].
3. Scale and translate coordinates to SVG viewport size.
4. Construct an SVG path string connecting all sample points.
5. Write an SVG document with axes to the specified output file.

# Testing

- Unit tests verify:
  - Correct parsing of CLI arguments.
  - Generation of valid SVG string containing `<svg>` and `<path>` elements.
  - File is written to disk at the specified path.

# Documentation

Update README with new usage examples and describe the equation plotter API and CLI commands.
