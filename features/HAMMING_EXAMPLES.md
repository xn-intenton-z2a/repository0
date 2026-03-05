# HAMMING_EXAMPLES

## Overview

Add a small examples collection demonstrating typical usages of hammingDistance and hammingDistanceBits. Examples should be tiny, executable snippets placed in the examples/ directory and referenced from the README. They must be realistic, runnable with node, and show both library and CLI usage.

## Motivation

Concrete examples lower the barrier to adoption and provide quick manual verification for contributors and users. Examples ease testing, documentation, and teaching by showing real invocations and expected outputs.

## Example list

- examples/strings.js
  - Import hammingDistance from src/lib/main.js and compute a few sample pairs, printing results.
  - Demonstrates Unicode handling (emoji, accented characters) and empty strings.

- examples/bits.js
  - Import hammingDistanceBits and show integer bit comparisons, including 0 vs 0 and numbers that differ in multiple bits.

- examples/cli-usage.sh
  - Small shell script showing how to call the CLI subcommands and check exit codes.

## Acceptance criteria

- README references the examples directory and describes how to run each example with node or via the CLI.
- Each example is a single-file snippet that runs without additional dependencies (using node only) and prints expected outputs for the scenarios documented in the README.
- Examples focus on small, clear demonstrations: Unicode differences, empty strings, bit differences including 1 vs 4.

## Implementation notes

- Keep examples minimal and focused on demonstration; do not attempt to exhaustively test all edge cases in examples.
- Examples should be in plain JavaScript with no shebang required, runnable by node examples/strings.js.
- Update README.md to show commands to run the examples and expected output lines for quick manual verification.