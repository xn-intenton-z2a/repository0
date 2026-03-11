# EXAMPLES

# Summary

Add a small set of deterministic, runnable example scripts to the examples directory that demonstrate the library's public API: hammingDistance, hammingDistanceBits, and popcount. The examples serve both end users and automated tests: each script must produce a single-line, deterministic stdout output on success and a single-line stderr message on validation failure so behaviour tests and CI can assert exact outputs and exit codes.

# Motivation

Runnable examples make it trivial for users to see the library's behaviour without reading source or tests. They also provide stable, runnable artefacts that behaviour tests and README links can reference. Keeping examples minimal and deterministic ensures they remain useful in CI and documentation.

# Specification

1. Example scripts (examples/)
   - compare-strings.js
     - Imports named export hammingDistance from src/lib/main.js, calls hammingDistance with inputs karolin and kathrin, prints a single integer to stdout followed by a newline, and exits 0 on success.
     - For validation errors prints a single-line error message to stderr and exits 1.
   - compare-normalize.js
     - Imports hammingDistance and calls it twice for a composed vs decomposed example (a with combining acute versus á). When run without normalization, prints the numeric distance for the un-normalized comparison; when provided with normalization set to NFC prints the numeric distance after normalization. Scripts should be deterministic and designed so default invocation prints either 0 or 1 as described in acceptance criteria.
   - compare-bits.js
     - Imports hammingDistanceBits from src/lib/main.js, compares 1 and 4 (decimal) and prints a single integer (2) to stdout and exits 0 on success.
   - Each example is a tiny, dependency-free Node script that imports from src/lib/main.js using the package's main export path.

2. Behaviour and output rules
   - Successful run: print only the integer result and a trailing newline to stdout, exit code 0.
   - Failure/validation: print a concise single-line error to stderr that contains one of the canonical keywords used by the library (string, length, non-negative, options, normalize), exit code 1.
   - No multi-line output, no additional logging, no color codes; output must be byte-identical across Node versions supported by the repository.

3. Testability
   - Add unit tests under tests/unit/ that spawn node processes for each script and assert stdout, stderr, and exit code match acceptance criteria. Tests must be deterministic and fast.
   - Examples must be referenced from README.md with one-line usage examples so CI and users can run them easily.

4. Documentation
   - README.md should list the three example scripts with one-line commands showing expected stdout and exit codes. Keep README changes minimal and consistent with project style.

# Acceptance Criteria

- examples/compare-strings.js exists and running node examples/compare-strings.js prints 3 and exits 0.
- examples/compare-normalize.js exists and running node examples/compare-normalize.js (default invocation) demonstrates the normalization behaviour described: the pair that differs without normalization yields the expected non-zero distance and yields zero when normalization is applied as per README instructions.
- examples/compare-bits.js exists and running node examples/compare-bits.js prints 2 and exits 0.
- Each example prints only the expected integer on success or a single-line error containing a canonical keyword on failure, and the behaviour is asserted by unit tests in tests/unit/.
- README.md contains one-line usage examples referencing the example scripts and their expected outputs.

# Files touched (implementation plan)

- examples/compare-strings.js — small script that imports hammingDistance and prints 3 for karolin vs kathrin.
- examples/compare-normalize.js — small script demonstrating normalization behaviour for composed vs decomposed characters.
- examples/compare-bits.js — small script that imports hammingDistanceBits and prints 2 for inputs 1 and 4.
- tests/unit/examples.test.js — unit tests that spawn the example scripts and assert stdout, stderr, and exit codes.
- README.md — add one-line usage references to the examples.

# Notes

- Keep examples minimal: no argument parsing, no external dependencies, and exact output rules so behaviour tests remain stable.
- The examples intentionally import from src/lib/main.js so they exercise the exported API and its validation rules rather than reimplementing logic.
