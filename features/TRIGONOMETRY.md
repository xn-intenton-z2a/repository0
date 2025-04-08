# TRIGONOMETRY

## Overview
This feature adds a new CLI command `--trig` that computes basic trigonometric functions. Users can calculate sine, cosine, and tangent values by specifying the function type and a numeric input. Optionally, users can indicate if the input angle is in degrees (default is radians) using a flag.

## Implementation Details
- **Command Integration:**
  - Add a new flag `--trig` to the CLI command mapping in `src/lib/main.js`.
  - The command expects at least two parameters: the trig function (e.g., `sin`, `cos`, or `tan`) and the angle value.
  - Optionally, a third parameter `--deg` can be provided to indicate the angle is in degrees. If `--deg` is present, convert the input angle from degrees to radians before computation.

- **Trigonometric Computation:**
  - Validate the input angle using the existing numeric parsing helper (`parseNumbers`).
  - Based on the function specified (case-insensitive comparison for `sin`, `cos`, and `tan`), compute the result using JavaScript's Math library:
    - `Math.sin(angle)`
    - `Math.cos(angle)`
    - `Math.tan(angle)`
  - If the function type is not recognized, output an error message: "Error: Unsupported trigonometric function. Use sin, cos, or tan."

- **Error Handling & Validation:**
  - If no valid numeric input is provided, return the standardized error: "Error: No valid numeric inputs provided.".
  - Check for invalid or extra parameters and output appropriate error messages, following the same patterns as existing commands.

## Testing & Documentation
- **Unit Tests:**
  - Create tests to verify that valid inputs produce correct results for each function.
  - Include tests with the `--deg` flag to confirm proper conversion from degrees to radians.
  - Test error handling when the function type or the numeric parameter is missing or invalid.

- **Documentation:**
  - Update the README and CLI usage documentation with examples:
    - `node src/lib/main.js --trig sin 1.57`
    - `node src/lib/main.js --trig cos 180 --deg`
    - `node src/lib/main.js --trig tan 45 --deg`
  - Add inline comments in `src/lib/main.js` where the new command is defined.

## Alignment with Repository Mission
This enhancement aligns with the repository's mission by expanding the modular CLI's mathematical capabilities, providing additional utility functions that are both practical for automation and useful for educational or diagnostic purposes.