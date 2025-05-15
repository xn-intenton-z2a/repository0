# CLI_RANGE_PARSING

# Purpose
Fix handling of negative values in the --range flag for the plot command so that users can generate plots over ranges that include negative bounds without misinterpretation by the CLI parser.

# CLI Behavior
- The --range <start,end> option must accept two comma-separated numbers, each of which may be negative or positive.
- When the flag is provided, parse the raw range argument, preserving negative signs instead of letting the parser treat them as separate flags.
- If --range is omitted, fall back to the default range of 0,10.
- If the provided range string does not split into exactly two valid numbers, print an error message `Invalid range format: <value>` and exit with code 1.

# Implementation Details
- In the handlePlot function in sandbox/source/main.js:
  - Locate the position of `--range` in the raw args array and extract the following element as the raw range string when minimist parses it as undefined or misinterprets negative values.
  - Pass this raw string to parsePair, which splits on comma, converts each part to a Number, and throws an error if the format is invalid or values are not numeric.
  - Replace silent fallback in parsePair with explicit error when the range string is malformed.
  - Ensure that negative start or end values are preserved in the numeric range before data generation.

# Testing
- Create sandbox/tests/cli-range-parsing.test.js with tests:
  - CLI: `--plot sine --range -5,5` writes plot.svg with first data point at x = -5 and last at x = 5.
  - CLI: `--plot quadratic --range -10,-1` writes plot.svg where all sampled x values are between -10 and -1.
  - CLI: `--plot sine --range 0,invalid` exits with code 1 and logs `Invalid range format: 0,invalid`.
  - CLI: `--plot sine --range -3.14` exits with code 1 and logs `Invalid range format: -3.14`.

# Documentation
- Update sandbox/docs/CLI_USAGE.md under plot options:
  - Clarify that --range supports negative values and give an example: `--range -3.14,3.14`.
- Update README.md features section to mention CLI Range Parsing Support.