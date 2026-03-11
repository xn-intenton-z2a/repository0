CLI_NORMALIZATION

# Summary

Combine an explicit Unicode normalization option for the hammingDistance API with an enhanced command-line interface so callers can compare strings either raw or normalized and use the library from the terminal. The change is focused, single-file friendly and includes unit tests and README examples.

# Motivation

The library currently compares Unicode code points correctly but lacks an explicit options parameter to opt into normalization and the CLI is minimal. Consumers benefit from one consistent API and a usable CLI that reuses the same validation and behaviour, including support for BigInt in bits mode. This feature unifies those needs into a single, testable change.

# Specification

1. API
   - Add an optional third parameter to hammingDistance: options where options may be omitted or an object.
   - options.normalize can be false, "NFC", or "NFD". Default behaviour when options is omitted or options.normalize is false is to compare raw code points.
   - hammingDistance remains synchronous and pure; only the third parameter is added.

2. Validation
   - If a or b is not a string, throw TypeError with the word string in the message.
   - If options is provided and is not an object (including null), throw TypeError mentioning options.
   - If options.normalize is provided and is not one of false, "NFC", or "NFD", throw TypeError mentioning normalize.
   - If post-normalization code-point lengths differ, throw RangeError mentioning length or equal.

3. Normalization behaviour
   - When options.normalize is "NFC" or "NFD", call String.prototype.normalize(form) on both inputs before converting to code-point arrays via Array.from.
   - Compare code points so surrogate pairs and astral characters are treated as single positions.

4. CLI
   - Extend the library script entry (src/lib/main.js) to act as a small CLI when executed directly.
   - Support modes via flag --mode or -m with values string or bits. Default mode selection: if --mode omitted, use string mode unless both positional args parse as non-negative integers or BigInt literals.
   - For string mode: accept two positional arguments for the strings. Add an optional flag --normalize with values NFC, NFD or false to pass through to the hammingDistance options.normalize parameter.
   - For bits mode: accept two positional arguments as non-negative integers or BigInt literals (accept trailing n). Parse using BigInt when the literal ends with n or number exceeds safe integer range.
   - Flags: --help/-h prints usage and exits 0; --version/-v prints library version and exits 0.

5. CLI behaviour and exit codes
   - On success print the numeric Hamming distance to stdout and exit 0.
   - On validation errors print a single-line error to stderr and exit with code 1.
   - Do not read/write files or perform network activity.

6. Tests
   - Add unit tests to tests/unit/main.test.js (or main.cli.test.js) that assert:
     - hammingDistance normal and normalization cases (including combining sequences vs precomposed forms)
     - hammingDistanceBits normal cases and BigInt support
     - CLI invocations for success and error cases asserting stdout/stderr and exit codes
   - Keep existing tests that assert karolin/kathrin, empty strings, unequal-length errors, bits examples.

# Acceptance Criteria

- hammingDistance accepts an optional options parameter with options.normalize true values NFC or NFD and behaves as specified.
- hammingDistance("karolin","kathrin") returns 3 and hammingDistance("","") returns 0.
- hammingDistance("a","bb") still throws RangeError for unequal lengths.
- hammingDistance("a\u0301","á") without normalization returns non-zero; with { normalize: "NFC" } returns 0.
- hammingDistanceBits(1,4) returns 2 and hammingDistanceBits(0,0) returns 0; BigInt inputs supported.
- Running node src/lib/main.js --mode string karolin kathrin prints 3 and exits 0; --mode bits 1 4 prints 2 and exits 0.
- --help and --version behave as described.
- Unit tests for API and CLI pass.

# Files to change

- src/lib/main.js: add options.normalize handling in hammingDistance and implement the small CLI parsing layer that reuses the same validation.
- tests/unit/main.test.js: add normalization tests and CLI tests (new file main.cli.test.js permitted under tests/unit/).
- README.md: add API docs for options.normalize and a CLI usage section with examples for string and bits modes.
- examples/hamming-demo.html: optional demo changes to expose normalize flag in the UI.

# Implementation notes

- Use Array.from for code-point iteration; use String.prototype.normalize when requested.
- For bit counting support Number and BigInt; reuse existing BigInt-based counting logic.
- Keep CLI dependency-free; use process.argv, console.log, console.error and process.exit only.
- Use concise error messages containing keywords to make tests robust: string, options, normalize, length, non-negative.
- Make the change minimal and surgical: extend hammingDistance to accept options and add a small, well-tested CLI wrapper.

# Rationale

Merges the normalization option and CLI improvements into a single, cohesive feature that is small, demonstrable, and directly advances the mission by making the library more usable and correct for Unicode inputs while providing a terminal-friendly interface.