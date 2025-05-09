# Plot Command Feature

## Overview

Extend the CLI to support a new `plot` command with subcommands for `quadratic` and `sine` equations. Users can generate a series of points for a specified equation over a defined range. Points are output as a JSON array to stdout and returned by the function for programmatic use.

## CLI Changes

- Parse positional arguments after flags.
- If the first positional argument is `plot`, treat the second positional argument as the equation type (`quadratic` or `sine`).
- Support optional flags:
  - `--start` (number, default `-10`): the start of the x range.
  - `--end` (number, default `10`): the end of the x range.
  - `--step` (number, default `1`): the increment between x values.
  - Equation-specific parameters:
    - For `quadratic`: `--a` (number, default `1`), `--b` (number, default `0`), `--c` (number, default `0`).
    - For `sine`: `--freq` (number, default `1`).

## Source Changes (src/lib/main.js)

- Import `minimist` to parse CLI flags and positionals.
- In `main(args)`:
  1. Parse the `args` array with `minimist`, separating `_.` for positionals.
  2. Detect if `_.[0]` equals `plot`. If not, preserve existing behavior.
  3. Determine equation type from `_.[1]`.
  4. Read range and equation parameters from parsed options.
  5. Generate an array of objects `{ x, y }` from `start` to `end` by `step`.
     - For `quadratic`, compute `y = a * x * x + b * x + c`.
     - For `sine`, compute `y = Math.sin(freq * x)`.
  6. Output the JSON stringified array of points to stdout and return it.

## Testing (tests/unit/main.test.js)

- Add unit tests for `main(['plot','quadratic'])`:
  - Verify returned array length matches default range and step.
  - Verify first and last points match expected values for default parameters.
- Add unit tests for `main(['plot','sine','--freq', '2', '--start', '0', '--end', '3.1416', '--step', '1.5708'])`:
  - Verify returned y values are approximately `[0, 1, 0]` within a small tolerance.
- Ensure existing tests still pass.

## Documentation (README.md)

- Under CLI Usage, add section:
  - `node src/lib/main.js plot quadratic --a 2 --b 3 --c 1 --start -5 --end 5 --step 0.5`
  - `node src/lib/main.js plot sine --freq 0.5`
- Include example outputs.

## Dependencies (package.json)

- No new dependencies required. Use built-in `Math.sin` and existing `minimist`.

## Value and Impact

This feature adds core functionality aligning with the repository’s narrative of equation plotting. It transforms the CLI into a simple plot-data generator, creating tangible, testable outputs and demonstrating the power of extensible CLI features within a single repository.