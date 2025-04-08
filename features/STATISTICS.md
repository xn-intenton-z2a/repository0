# STATISTICS

## Overview
The STATISTICS feature is updated to not only compute measures such as median, mode, and standard deviation but also to support the sorting of numeric inputs. The new sub-command `--sort` will allow users to arrange a sequence of numbers in ascending or descending order. This extension leverages existing numeric parsing and error handling logic while maintaining the minimalist, modular approach of the repository.

## Implementation Details
- **Command Integration:**
  - Extend the STATISTICS feature to include a new flag `--sort` alongside the existing calculations for median (`--median`), mode (`--mode`), and standard deviation (`--stddev`).
  - The `--sort` command will accept a list of numeric inputs. By default, the sorting will be in ascending order. If an optional additional flag (e.g., `--desc`) is provided among the inputs, the command will sort the numbers in descending order.

- **Input Handling & Validation:**
  - Use the existing `parseNumbers` helper function for cleansing and validating inputs.
  - If no valid numeric inputs are provided, return a standardized error: "Error: No valid numeric inputs provided.".
  - If the `--desc` flag is detected among the input tokens, remove it from the numeric inputs and set the sorting order to descending.

- **Sorting Logic:**
  - For ascending order, sort the numbers in increasing order.
  - For descending order, sort in decreasing order.
  - Return the sorted list as a comma-separated string.

- **Error Handling & Warnings:**
  - Consistently issue warnings for any invalid tokens using the existing dynamic/fixed positional index mechanism.
  - Ensure that if invalid inputs are encountered, the overall command follows the repository's standard error reporting.

## Testing & Documentation
- **Unit Tests:**
  - Add tests simulating various valid and invalid scenarios for the `--sort` command:
    - Example: `node src/lib/main.js --sort 5 2 9` should output `2,5,9`.
    - Example with descending order: `node src/lib/main.js --sort 5 2 9 --desc` should output `9,5,2`.
  - Test error cases when no valid numbers are supplied.

- **Documentation:**
  - Update the README and CLI usage guides to include examples and explanations for the new sorting functionality.
  - Add inline code comments in `src/lib/main.js` where the branch logic for `--sort` is implemented, documenting the detection of the `--desc` flag and the sorting algorithm.

## Alignment with Repository Mission
By expanding the STATISTICS feature to include numeric sorting, this update reinforces the repository's mission of promoting healthy collaboration and practical automation. It provides users with a more comprehensive suite of numerical utilities in a modular, single-source file that supports both immediate results and further diagnostics.