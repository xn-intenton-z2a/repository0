# Overview

Extend the repository’s main script to serve as a command‐line plotting tool. Users will be able to invoke quadratic and sine function plotters via a unified CLI, supplying parameters and options to generate SVG files directly from the terminal.

# CLI Interface

The entrypoint is `node src/lib/main.js` followed by a function type and named options:

functionType (positional):
  - `quadratic` : plot y = a*x^2 + b*x + c
  - `sine`      : plot y = amplitude * sin(frequency * x)

Named options common to both types:
  - `--output` or `-o` : path for the output SVG file (default `plot.svg`)
  - `--width`          : canvas width in pixels (default `200`)
  - `--height`         : canvas height in pixels (default `100`)
  - `--xMin`           : minimum x value (quadratic only, default `-10`)
  - `--xMax`           : maximum x value (quadratic only, default `10`)

Quadratic-specific options:
  - `--a` : coefficient a (required)
  - `--b` : coefficient b (required)
  - `--c` : coefficient c (required)

Sine-specific options:
  - `--amplitude` or `-A` : wave amplitude (required)
  - `--frequency` or `-F` : wave frequency (required)

# Behavior

1. Parse CLI arguments using the existing minimist dependency.
2. Validate that functionType is one of the supported types and that required parameters are provided.
3. Import and invoke `plotQuadratic` or `plotSine` from `sandbox/source/plot.js` with parsed parameters and options.
4. Write the returned SVG string to the specified output file path. Create parent directories if needed.
5. Exit with a zero status code on success or non‐zero on validation or file I/O errors.

# Testing

- Add integration tests in `sandbox/tests/` to run the CLI script via Node’s child_process:
  - Generate a quadratic plot with known coefficients and verify the output file exists and contains `<polyline>`.
  - Generate a sine plot with known amplitude and frequency and verify output file exists and contains `<path>`.
  - Validate default option behavior by omitting optional parameters.
  - Assert error exit codes for missing required parameters or unsupported functionType.

# Documentation

- Update the top‐level `README.md` to include:
  - Usage examples for quadratic and sine commands.
  - Description of how each option affects the generated plot.
  - Instructions on installing any peer dependencies (minimist, fs comes from Node).

