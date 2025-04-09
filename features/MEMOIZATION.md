# MEMOIZATION

## Overview
This feature introduces a simple in-memory caching mechanism to the CLI tool. It is designed to store and retrieve the results of expensive computations (for example, factorials, large Fibonacci numbers, and matrix operations) within a session. By caching these results, repeated invocations with identical inputs can return results instantly, reducing computation time and improving responsiveness.

## CLI Integration
- **Global Flag:** Introduce a new flag `--cache` that when enabled, uses cached results if available. 
- **Sub-Commands:**
  - **--cache-show:** Display all currently cached entries and their corresponding results.
  - **--cache-clear:** Clear the cache to reset stored computation results.

## Implementation Details
- **Cache Storage:** Utilize an in-memory JavaScript object to store results keyed by a normalized representation of the command and its arguments. 
- **Usage Trigger:** When a command is executed, check if caching is enabled via the `--cache` flag and if the result for the given inputs exists; if so, return the cached result. Otherwise, compute the result, store it in the cache, and output the result.
- **Session Scope:** The cache will persist for the duration of the CLI session and reset once the process terminates, ensuring simplicity in management.
- **Error Handling:** Ensure that failing computations do not populate the cache and that cache lookup failures fall back to a fresh computation seamlessly.

## Testing & Documentation
- **Unit Tests:** Develop tests to validate caching behavior, ensuring that repeated commands with identical inputs retrieve cached values and that commands producing new results correctly update the cache.
- **Documentation:** Update the CLI help documentation and README with examples demonstrating how to use `--cache`, `--cache-show`, and `--cache-clear`.
- **Inline Comments:** Include detailed comments in the source code to explain cache storage, lookup, and update logic.

## Alignment with Repository Mission
By implementing MEMOIZATION, this feature supports streamlined automation and healthy collaboration by improving the efficiency of the CLI tool. It ensures that frequently requested computations are handled quickly, enhancing user experience and operational performance—all within a single, self-contained repository module.