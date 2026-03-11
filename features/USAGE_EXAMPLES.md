# USAGE_EXAMPLES

# Summary

Provide a concise, runnable set of usage examples and reference snippets that demonstrate the library API, CLI, normalization option and bitwise behaviour. Examples are small Node scripts and README examples that show exact inputs and outputs so users and automated tests can validate the behaviour without reading source code.

# Motivation

Good examples reduce onboarding friction and make acceptance criteria from the mission executable by humans and CI. They provide authoritative demonstrations for the README, for the web demo, and for behaviour tests and make it easy to check the canonical return values and error messages.

# Specification

1. README examples
   - Add or update the README to include a short "Examples" section with three concise examples: string mode, normalization example, and bits mode. Each example must show the exact call and the expected numeric result or thrown error keyword so maintainers can copy/paste and reproduce results quickly.

2. examples/ directory contents
   - Provide three small Node scripts under examples/: compare-strings.js, compare-normalize.js, compare-bits.js. Each script must import the library from src/lib/main.js and print a single integer or catch and print a single-line error message containing the keywords used by the library (string, length, non-negative, options, normalize) and exit with code 0.
   - compare-strings.js demonstrates hammingDistance with inputs karolin and kathrin and prints 3.
   - compare-normalize.js demonstrates hammingDistance with a combining sequence and precomposed character (for example a01 vs á) showing output 1 without normalization and 0 with NFC normalization; the script should accept an optional normalize argument.
   - compare-bits.js demonstrates hammingDistanceBits with inputs 1 and 4 and prints 2.

3. CLI alignment
   - Examples in README must include commands that invoke the existing CLI entrypoint node src/lib/main.js using --mode string and --mode bits and show expected stdout and exit codes consistent with HAMMING_CLI.md.

4. Testability
   - All examples must be deterministic and runnable with node examples/compare-*.js and produce the documented output when run with Node 24+.
   - Examples must not depend on external modules or network.

5. Documentation style
   - Keep examples compact (one- to three-line scripts) and avoid explanatory prose inside scripts; the README provides the human-facing explanation.

# Acceptance Criteria

- README contains an Examples section with three examples: string, normalization, bits, each showing exact invocation and expected numeric result or error keyword.
- The examples/ directory contains scripts compare-strings.js, compare-normalize.js, compare-bits.js that run with node and print only the expected integer or a single-line error message containing one of the canonical keywords.
- Running node examples/compare-strings.js prints 3 and exits 0.
- Running node examples/compare-bits.js prints 2 and exits 0.
- Running node examples/compare-normalize.js with inputs demonstrating combining sequence prints 1 when no normalization is applied and 0 when passing NFC as the normalize option.
- Examples do not add dependencies and run on Node 24+ without modifications.

# Files touched

- README.md (update Examples section)
- examples/compare-strings.js (new)
- examples/compare-normalize.js (new)
- examples/compare-bits.js (new)

# Implementation notes

- Keep scripts minimal and import the named exports from src/lib/main.js. Scripts should catch errors and print their message to stdout/stderr as a single line so CI can assert contains a keyword (string, length, non-negative, options, normalize).
- Prefer using process.exit(0) after printing the expected value to make scripts deterministic in test harnesses.
- If examples already exist that are similar, enhance them rather than duplicate.

# Testing guidance

- Add unit or CI checks that run node examples/compare-*.js and assert stdout and exit code where appropriate; these checks belong to the tasks that implement the examples.

