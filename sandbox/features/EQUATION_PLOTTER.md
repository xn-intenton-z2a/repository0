# Overview
Extend the existing CLI equation plotter to add support for parametric curve types (circle and ellipse) alongside the current quadratic and sine functions. Enable users to specify curve parameters for radius or axis lengths, and produce SVG visualizations accordingly.

# CLI Interface

The script accepts a positional argument `functionType` and named options:

- Positional argument `functionType`: one of `quadratic`, `sine`, `circle`, or `ellipse`.
- Named options common to all types:
  - `--output` or `-o`: path for the output SVG file (default `plot.svg`).
  - `--width`: canvas width in pixels (default `800`).
  - `--height`: canvas height in pixels (default `600`).
  - `--steps`: number of sample points to draw (default `100`).
- Additional options for parametric types:
  - For `circle`:
    - `--radius` or `-r`: radius of the circle (default `1`).
  - For `ellipse`:
    - `--a`: semi-major axis length (default `2`).
    - `--b`: semi-minor axis length (default `1`).

# Behavior

1. Parse and validate `functionType` and all provided options.
2. Generate sample points:
   - `quadratic`: y = x^2 over x in [-10, 10].
   - `sine`: y = sin(x) over x in [-2π, 2π].
   - `circle`: x = radius * cos(t), y = radius * sin(t) for t in [0, 2π].
   - `ellipse`: x = a * cos(t), y = b * sin(t) for t in [0, 2π].
3. Scale and translate coordinates to the SVG viewport based on width and height.
4. Build an SVG path string connecting all sampled points, include axes for reference.
5. Write the complete SVG document to the specified output file.

# Testing

- Unit tests should cover:
  - CLI argument parsing for each function type and associated options.
  - Correct generation of SVG snippets containing `<svg>` and `<path>` elements.
  - File creation at the chosen output path.
  - Parameter handling for `radius`, `a`, and `b` options.

# Documentation

- Update README to illustrate usage examples for `circle` and `ellipse` types:
  - Example command for a unit circle: `node src/lib/main.js circle -r 5 -o circle.svg`
  - Example command for an ellipse: `node src/lib/main.js ellipse --a 3 --b 2 -o ellipse.svg`
- Document the extended API usage and describe how each parameter maps to the plotted curve.
