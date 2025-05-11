sandbox/features/CLI_PLOTTER.md
# sandbox/features/CLI_PLOTTER.md
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

sandbox/features/CSV_EXPORT.md
# sandbox/features/CSV_EXPORT.md
# Overview

Extend the CLI equation plotter to add support for exporting sampled data points as CSV files. When the `--csv` or `-c` flag is provided, the tool will compute the same points used for SVG generation and serialize them into a comma-separated values file.

# CLI Interface

The entrypoint remains `node src/lib/main.js` followed by a function type and named options:

Named options common to all types (in addition to existing ones):
  - `--csv` or `-c`: Boolean flag. When present, output will be in CSV format.
  - `--output` or `-o`: Path for the output file (default `data.csv` when `--csv` is used, otherwise `plot.svg`).

Usage examples:

  node src/lib/main.js quadratic --a 1 --b 0 --c 0 --csv -o quad_data.csv
  node src/lib/main.js sine --amplitude 2 --frequency 1 --csv

# Behavior

1. Parse CLI arguments, including the new `--csv` flag.  
2. Determine output format: if `--csv` is present, set format to CSV; otherwise, default to SVG.  
3. For supported function types (quadratic, sine), compute the sampling points the same way as existing plot functions:  
   - Quadratic: generate width + 1 x/y pairs.  
   - Sine: generate width + 1 x/y pairs.  
4. If format is CSV:  
   - Serialize points into a string with a header `x,y` on the first line, followed by one line per point: `xValue,yValue`.  
   - Write the CSV string to the output path, creating parent directories if needed.  
5. Exit with zero on success or non-zero on validation or file I/O errors.

# Testing

- Add a unit test file `sandbox/tests/csvExport.test.js`:
  - Test `exportQuadraticCSV(1,0,0,{width:10,xMin:-5,xMax:5})` returns a string starting with `x,y` and exactly 11 data lines.  
  - Test `exportSineCSV(2,1,{width:50, height:100})` returns correct header and line count.  
- Add CLI integration tests in `sandbox/tests/cliCsvExport.test.js` using Node’s `child_process`:
  - Run `node src/lib/main.js quadratic --a 1 --b 0 --c 0 --csv -o test.csv` and verify `test.csv` exists and its first line is `x,y`.  
  - Assert non-zero exit code when required parameters are missing alongside `--csv`.

# Documentation

- Update the top-level `README.md`:
  - Add a “CSV Export” section under Usage.  
  - Show examples for quadratic and sine exports.  
  - Document how `--csv` interacts with `--output`, and note the default filename when omitted.
sandbox/features/MULTI_PLOT.md
# sandbox/features/MULTI_PLOT.md
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
  - Document the `--func` syntax and available function types.sandbox/features/POLAR_PLOTTER.md
# sandbox/features/POLAR_PLOTTER.md
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
sandbox/features/HTTP_PLOTTER.md
# sandbox/features/HTTP_PLOTTER.md
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
- Document available query parameters for each plot type and describe how to run the server and override PORT.sandbox/features/EQUATION_PLOTTER.md
# sandbox/features/EQUATION_PLOTTER.md
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
sandbox/features/PARAMETRIC_PLOTTER.md
# sandbox/features/PARAMETRIC_PLOTTER.md
# Overview

Add support for generic parametric curve plotting to the existing CLI equation plotter. Users can define functions x(t) and y(t) as mathematical expressions, specify the parameter range and sampling steps, and generate an SVG visualization of the resulting parametric curve.

# CLI Interface

The script accepts a positional argument functionType with value parametric and named options:

- --output or -o: path for the output SVG file (default plot.svg)
- --width: canvas width in pixels (default 800)
- --height: canvas height in pixels (default 600)
- --steps: number of sample points to draw (default 100)
- Parametric-specific options:
  - --xExpr: mathematical expression for x(t), using any functions supported by mathjs (required)
  - --yExpr: mathematical expression for y(t), using any functions supported by mathjs (required)
  - --tMin: start value for parameter t (default 0)
  - --tMax: end value for parameter t (default 2*pi)

# Behavior

1. Parse and validate functionType and all provided options. Ensure xExpr and yExpr are provided and valid mathjs expressions.
2. Import mathjs and create compiled functions for x(t) and y(t).
3. Generate an array of t values evenly spaced from tMin to tMax with the given number of steps.
4. Evaluate x(t) and y(t) for each sample point.
5. Scale and translate the resulting coordinates into the SVG viewport based on width and height, centering the origin at the midpoint.
6. Construct an SVG path element connecting all calculated points and include optional reference axes.
7. Write the complete SVG document to the specified output file.

# Testing

- Unit tests should cover CLI argument parsing for parametric type and its required options.
- Tests should verify expression compilation and evaluation for simple expressions such as t and sin(t).
- Confirm the generated SVG contains a <path> element and correct number of coordinate pairs.
- Ensure errors are thrown for missing or invalid expressions.

# Documentation

- Update README to illustrate usage examples:
  Example for a circle using parametric: npm run start parametric --xExpr cos(t) --yExpr sin(t) -o circle.svg
  Example for a custom Lissajous curve: npm run start parametric --xExpr sin(3*t) --yExpr cos(2*t) --tMax 6.283 -o lissajous.svg
- Reference mathjs functions supported in expressions and link to mathjs documentation.