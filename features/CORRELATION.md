# CORRELATION

## Overview
This feature introduces a Pearson correlation coefficient calculator into the CLI tool. It computes the linear correlation (r) between two datasets provided by the user. The calculation is useful in statistical analysis to determine the relationship between two numeric variables.

## CLI Integration
- **Command Flag:** Introduce a new flag `--correlation` to invoke the correlation calculator.
- **Usage Example:
  - Provide an even number of numeric inputs so that the first half forms the first dataset (X) and the second half forms the second dataset (Y).
  - For example, `node src/lib/main.js --correlation 1 2 3 4 5 6` calculates the Pearson correlation between X = [1,2,3] and Y = [4,5,6].
  - If the number of numeric inputs is not even, the tool returns a clear error message specifying the expected format.

## Implementation Details
- **Input Parsing & Validation:**
  - The feature expects a sequence of numeric tokens. It verifies that the total count of tokens is even and at least 2 (i.e. at least one paired observation).
  - The first half of the tokens are treated as values for dataset X, and the second half as dataset Y.
  - If the number of inputs is odd or either dataset is empty, an error is returned with a uniform error message consistent with other features.

- **Operation Logic:**
  - Compute the mean of both datasets.
  - Calculate the numerator: sum((xi - mean_X) * (yi - mean_Y)) for each pair (xi, yi).
  - Compute denominator: product of the square root of the sum of squares for each dataset: sqrt(sum((xi - mean_X)^2) * sum((yi - mean_Y)^2)).
  - The Pearson correlation coefficient is the numerator divided by the denominator.
  - If the denominator evaluates to zero (indicating no variability in one or both datasets), a clear error message is provided.

## Error Handling & Output
- If validation fails (e.g., odd number of tokens), the feature outputs a message like "Error: Provide an even number of numeric inputs to form two equal-length datasets.".
- The output supports both plain text and JSON modes (activatable with `--json` or `--json-pretty`), including metadata such as timestamp, version, execution duration, and input echo.

## Testing & Documentation
- **Unit Tests:** Add tests covering cases with valid paired datasets, cases with non-even numbers of inputs, and edge cases (e.g., constant datasets leading to zero variance).
- **Documentation:** Update usage guides and the README to include examples of correlation calculations, along with inline code comments explaining the statistical computation.

## Alignment with Repository Mission
The CORRELATION feature enhances the repository’s statistical toolset by providing users with an easy-to-use utility for measuring linear relationships between two sets of numbers. It continues the mission of promoting streamlined automation and healthy collaboration by offering a self-contained, modular utility that can be maintained within a single source file.