# VISUAL

## Overview
This feature unifies and extends data visualization capabilities in the CLI tool. In addition to the existing sparkline and histogram modes, a new sub-mode called **graph** has been added. The graph sub-mode allows users to plot mathematical functions over a specified range using ASCII art. This enhancement offers a more comprehensive suite of visualization tools, reinforcing the repository’s mission to foster healthy collaboration and streamlined automation via modular, single-source file utilities.

## CLI Integration
- **Command Flag:** The unified flag `--visual` is used to invoke the visualization module.
- **Sub-Modes:** Users must specify one of the following modes as the first argument:
  - **sparkline:** Generates a compact sparkline plotting the trend of numerical data using Unicode block characters.
  - **histogram:** Constructs an ASCII histogram representing the frequency distribution of a list of numbers. An optional flag (e.g., `--bins`) allows users to set the number of bins (default is 10).
  - **graph:** Plots a mathematical function over a specified range. This mode requires additional parameters.
    - **Parameters for Graph Mode:**
      - A mathematical function expressed in terms of `x` (e.g., `sin(x)`, `x^2 + 3*x - 5`).
      - Start and end values for the x-axis (e.g., `-3.14` and `3.14`).
      - An optional step size for sampling (default value is defined if omitted).

## Implementation Details
### Sparkline Mode
- Parse and validate numeric inputs.
- Map the numbers proportionally onto a series of block characters (e.g., `▁▂▃▄▅▆▇█`).
- Handle edge cases such as uniform data, producing a flat line.

### Histogram Mode
- Validate and parse numeric inputs to determine the data range.
- Calculate bin ranges either automatically or based on the user-specified `--bins` flag.
- Count frequencies and generate bars using ASCII characters (such as `*` or `#`).

### Graph Mode (New Sub-mode)
- **Input Parsing & Validation:**
  - Extract the function expression and ensure it is a valid mathematical expression in terms of `x`.
  - Validate that the provided start and end values are numeric and that the start is less than the end.
  - Optionally obtain a step size for sampling the function (defaulting if not provided).
- **Computation Logic:**
  - Use a safe evaluation mechanism (e.g., a sanitized Function constructor) to compute `f(x)` over the range from start to end in increments of the step size.
  - Determine the range of y-values from the computed points to create a scaled grid.
- **Graph Generation:**
  - Generate a coordinate grid displayed as ASCII art, plotting the computed points with an appropriate marker (e.g., `*`).
  - Optionally mark the axes and provide scale indicators for improved readability.

## Error Handling & Validation
- **Input Validation:**
  - Ensure the mode argument is one of `sparkline`, `histogram`, or `graph`.
  - Return clear error messages for invalid or insufficient parameters, such as an invalid function expression or improper range values in graph mode.
- **Robustness:**
  - Handle potential evaluation errors in graph mode by catching exceptions and providing guidance on correct input formats.

## Testing & Documentation
- **Unit Tests:**
  - Add tests for each sub-mode to verify correct output with valid inputs.
  - Specifically for graph mode, test common mathematical functions (`sin(x)`, polynomial expressions, etc.) over a defined range and validate that the ASCII plot reflects the expected trend.
- **Documentation:**
  - Update the README and CLI usage guides with examples:
    - Sparkline: `node src/lib/main.js --visual sparkline 3 5 9 12 7 5`
    - Histogram: `node src/lib/main.js --visual histogram 3 5 9 12 7 5 --bins 8`
    - Graph: `node src/lib/main.js --visual graph "sin(x)" -3.14 3.14 0.2`
  - Include inline comments in `src/lib/main.js` explaining the branching logic and computations for each visualization mode.

## Alignment with Repository Mission
Enhancing the VISUAL feature with a graph sub-mode extends the diagnostic and analytical capabilities of the CLI tool. This update supports practical automation tasks by enabling users to visualize mathematical functions, data trends, and distributions—all within a single, cohesive, and modular utility. This aligns with the repository’s mission of promoting healthy collaboration and streamlined, self-contained CLI tooling.