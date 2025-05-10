# Overview

Extend the existing CLI equation plotter to add support for polar coordinate functions. Enable users to generate r = a*sin(n*θ) and r = a*cos(n*θ) curves, such as rose curves, and output them as SVG visualizations.

# CLI Interface

The script accepts a positional argument `functionType` with value `polar` and named options:

- `--output` or `-o`: path for the output SVG file (default `polar.svg`).
- `--width`: canvas width in pixels (default `800`).
- `--height`: canvas height in pixels (default `600`).
- `--steps`: number of sample points to draw over θ in [0, 2π] (default `200`).
- Polar-specific options:
  - `--a`: amplitude or scale factor a (default `1`).
  - `--n`: petal count or frequency n for rose curves (default `1`).
  - `--mode`: polar function type, one of `sin` or `cos` (default `sin`).

# Behavior

1. Parse and validate `functionType` and all provided options.
2. For `polar` type, iterate θ from 0 to 2π in equal increments given by `steps`.
3. Compute r = a * sin(n * θ) or r = a * cos(n * θ) depending on `mode`.
4. Convert polar to Cartesian: x = r * cos(θ), y = r * sin(θ).
5. Scale and translate coordinates to the SVG viewport based on width and height.
6. Build an SVG path connecting all calculated points, include coordinate axes for reference.
7. Write the complete SVG document to the specified output file.

# Testing

- Unit tests should cover:
  - CLI argument parsing for `polar` type and its options.
  - Correct generation of SVG content containing `<svg>` and `<path>` elements.
  - Validation of default behavior when optional parameters are omitted.
  - Correct shape counts for known parameters, e.g., `n=2` yields a four-petal rose when mode=`sin`.
  - File creation at the chosen output path.

# Documentation

- Update README to illustrate usage examples for polar plots:
  - Example command for a four-petal rose: node src/lib/main.js polar --a 2 --n 2 --mode cos -o rose.svg
  - Example command for a simple sin rose: node src/lib/main.js polar -a 3 -n 3 -o rose3.svg
- Describe how `a`, `n`, and `mode` influence the resulting curve.
