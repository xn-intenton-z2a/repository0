# PLOT_CLI

## Summary

PLOT_CLI adds a focused, testable feature spec that defines a CLI-driven plotting workflow for the library entry point (src/lib/main.js). The feature specifies a compact API and CLI flags that parse a mathematical expression, generate a time series over a numeric range, and emit SVG and PNG plot files; it is scoped so implementation and unit tests can be completed entirely inside the repository.

## Motivation

This repository's mission is to be a go-to plot library with a CLI that transforms mathematical expressions into time series and produces SVG/PNG outputs. PLOT_CLI makes the core user-facing behaviour explicit and testable: parsing expressions, generating series, and writing image files from the library entry point and its CLI.

## Behaviour and API

- Library API (src/lib/main.js) exports core functions:
  - parseExpression(expressionString) -> { dependentVar, exprAst }
  - generateSeries(exprAst, { xMin, xMax, samples }) -> Array of { x, y }
  - renderSVG(series, options) -> string (SVG content)
  - renderPNG(svgContent, options) -> Buffer (PNG bytes)
  - cli(argv) -> Promise resolving after file write

- CLI flags (exact names to be supported):
  - --expression  Required. A simple mathematical expression in the form y=sin(x) or y=x^2+3.
  - --range       Optional. Range expressed as x=min:max or x=min:max:samples. Default: x=-10:10:200.
  - --file        Required. Output filename; extension .svg or .png determines format.
  - --format      Optional. svg or png. If omitted, infer from --file extension.
  - --samples     Optional numeric override for number of points.
  - --help        Show usage and exit.

- Range parsing semantics: x=min:max or x=min:max:samples. When samples absent default to 200. min and max are floating point values.

- Expression syntax: single equation assigning one dependent variable to an expression of a single independent variable (e.g., y=sin(x), f(x)=x*e^(-x)). Implementation may reuse an existing parser from library/ or a small expression evaluator dependency.

## Acceptance Criteria

1. Library-level functions exist and are exported from src/lib/main.js as described above.
2. parseExpression accepts common math functions (sin, cos, tan, exp, log, sqrt, pow) and basic arithmetic and returns a usable AST or compiled function.
3. generateSeries produces an array of numeric points covering xMin..xMax inclusive with exactly samples points.
4. renderSVG returns a valid SVG string that contains a visible polyline or path approximating the series.
5. renderPNG returns a Buffer with PNG bytes convertible to a file that image viewers can open (using an SVG-to-PNG converter if needed).
6. The CLI supports --expression, --range, --file, and --samples flags and writes the requested file in the requested format.
7. README.md includes at least two example commands demonstrating SVG and PNG output and a short description of the API.
8. Unit tests (tests/unit/) include deterministic tests for parseExpression, generateSeries (including edge case where xMin==xMax), and a CLI integration test that runs the cli function with simulated argv and verifies the file is created in a temporary directory.

## Testing and Validation

- Unit test examples to implement (test names only):
  - parseExpression.validExpressions parses common functions
  - generateSeries.samplesAndRange produces expected point counts and endpoints
  - renderSVG.containsPath verifies the returned string contains a path or polyline tag
  - cli.writesSvgFile verifies CLI writes an SVG file given arguments

- Behaviour tests (optional) may exercise the built website under src/web/ to show the generated SVG in the docs build.

## Implementation Notes

- Keep changes minimal and localised to src/lib/main.js and tests/unit/main.test.js.
- Prefer using an existing small expression parser library already allowed by the project dependencies, or implement a minimal safe evaluator limited to math functions.
- For PNG output, converting SVG to PNG may use a headless rendering approach or a small utility dependency; the spec allows implementing PNG via an SVG rasteriser but unit tests may stub rasterisation if adding a dependency is undesirable.
- Ensure CLI uses process.exit codes: 0 on success, non-zero on error, and prints concise errors to stderr.

## Backwards Compatibility and Migration

- If src/lib/main.js already exports other names, export the new functions without removing existing exports.
- Provide a README snippet showing CLI usage and linking to the library API for programmatic use.

## Security and Safety

- Do not evaluate arbitrary JavaScript from user input. Expression parsing must be restricted to math functions and operators only.
- Validate ranges and sample counts; error on invalid numeric input with a user-friendly message.

## Notes for Contributors

- Follow CONTRIBUTING.md guidelines for tests and minimal edits.
- Keep the feature confined to src/lib/main.js, README.md update for examples, and tests under tests/unit/.

