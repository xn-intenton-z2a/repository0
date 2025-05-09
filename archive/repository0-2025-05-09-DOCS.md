sandbox/docs/USAGE.md
# sandbox/docs/USAGE.md
# `repository0`

`repository0` is a CLI tool that calculates and prints the effective issue-to-code conversion rate based on a configurable conversion rate. It also supports generating SVG plots for built-in functions (`quadratic` and `sine`) and computing data points for simple mathematical functions and outputting them in JSON format.

Valid conversion rate values are numbers between `0` and `1` (inclusive). Invalid values will cause the application to error out with a clear message and exit with a non-zero status.

## What's Inside

- `sandbox/source/main.js` – Conversion-rate parsing, validation logic, and SVG plotting functionality.
- `src/lib/main.js` – Argument parsing and plot-functions logic (legacy).
- `sandbox/tests/*.test.js` – Tests for conversion-rate functionality and SVG plotting.
- `tests/unit/` – Tests for plot-functions and module behavior.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the full test suite:

```bash
npm test
```

Use the conversion-rate CLI:

- Default rate (from `package.json`, default `0.5`):

  ```bash
  npm run start -- --conversion-rate
  # Effective conversion rate: 0.5
  ```

- Override via flag:

  ```bash
  npm run start -- --conversion-rate 0.3
  # Effective conversion rate: 0.3
  ```

- Override via environment variable:

  ```bash
  ISSUE_TO_CODE_CONVERSION_RATE=0.7 npm run start
  # Effective conversion rate: 0.7
  ```

## SVG Plotting

Generate SVG plots for built-in functions:

Flags:

- `--function`, `-f`: The function to plot (`quadratic` or `sine`).
- `--output`, `-o`: Output filename for the SVG (default: `<function>.svg`).

Examples:

```bash
npm run start -- --function quadratic --output quadratic.svg
npm run start -- -f sine
```

## Plot Functions (JSON Output)

The CLI supports plotting mathematical functions and outputting the computed data points in JSON format. By default, it plots a quadratic function over the range `x = -10` to `10` with a step of `1`.

Flags:

- `--function`, `-f`: The function to plot. Supported values: `quadratic` (default), `sine`.
- `--from`, `-a`: Starting value of `x`. Default: `-10`.
- `--to`, `-b`: Ending value of `x`. Default: `10`.
- `--step`, `-s`: Step increment for `x`. Must be positive. Default: `1`.

### Examples

- Plot default quadratic:

  ```bash
  npm run start
  # [{"x":-10,"y":100},..., {"x":10,"y":100}]
  ```

- Plot sine from 0 to π in π/2 steps:

  ```bash
  npm run start -- --function sine --from 0 --to 3.1415926536 --step 1.5707963268
  # [{"x":0,"y":0},{"x":1.5707966537948966,"y":1},{"x":3.141592653589793,"y":0},{"x":4.71238898038469,"y":-1},{"x":6.2831853069794845,"y":0}]
  ```
