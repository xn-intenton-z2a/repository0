# README_DOCS

# Summary

Provide a single, testable feature that ensures the project README fully documents the library API, the CLI, and the web demo, includes a clear conversion table and usage examples, and links to the canonical behaviour and validation rules. The README will be the authoritative quick-start and reference for users integrating or testing the roman numerals library.

# Motivation

The mission centers on a small but exact library: correct, well-specified conversions between integers and Roman numerals. A comprehensive README reduces user confusion, documents error behaviours (RangeError/TypeError), demonstrates round-trip correctness, and provides copy-paste examples for library, CLI, and web demo usage — increasing adoption and easing maintenance.

# Scope

- Update README.md to include:
  - A short project summary that mirrors MISSION.md intent.
  - Installation and quick-start code examples for library usage (toRoman and fromRoman named imports).
  - CLI usage examples demonstrating --to-roman and --from-roman and the --lenient/--strict flags where applicable.
  - Web demo section describing how to run the demo (npm run start) and the global demo wrapper functions.
  - A canonical conversion table with key example mappings and boundary examples (1, 4, 9, 40, 90, 400, 900, 1994, 3999).
  - Error handling notes documenting which errors are thrown (RangeError for out of range, TypeError for invalid roman strings in strict mode) and how to enable lenient parsing if STRICT_VALIDATION feature is present.
  - A short testing note describing the exhaustive check test (how to run and how to opt-out via EXHAUSTIVE_TESTS environment variable if present) and links to unit test files.

- Add short runnable examples in examples/ that are small JS files showing: import { toRoman, fromRoman } from 'src/lib/main.js' and using the CLI via npm run start:cli examples.

- Keep the README succinct and copyable: users should be able to run examples verbatim.

# API examples to include (exact text for README)

- Library usage

Import named exports and use them:

const { toRoman, fromRoman } = require('./src/lib/main.js');
console.log(toRoman(1994)); // MCMXCIV
console.log(fromRoman('MCMXCIV')); // 1994

- CLI usage

node src/lib/main.js --to-roman 1994
node src/lib/main.js --from-roman MCMXCIV
node src/lib/main.js --from-roman IIII --lenient

# Canonical conversion table (to show in README)

1 I
4 IV
9 IX
40 XL
90 XC
400 CD
900 CM
1994 MCMXCIV
3999 MMMCMXCIX

# Tests and behaviour notes

- Document where unit tests live (tests/unit/) and how to run them (npm test).
- Note the exhaustive round-trip test exists and how to skip it if needed (EXHAUSTIVE_TESTS=false). If the repo contains STRICT_VALIDATION feature, document default strict behaviour and the optional lenient mode option for fromRoman.

# Acceptance criteria

- README.md contains a Quick Start section showing both library and CLI examples that run without modification.
- README includes the canonical conversion table with the listed examples.
- README documents thrown error types and recommended handling (RangeError and TypeError) and the behaviour of lenient parsing if available.
- README links to the demo and describes how to start it (npm run start) and the CLI (npm run start:cli).
- Examples/ contains at least one small JS example that can be executed to demonstrate toRoman and fromRoman usages.
- Unit tests remain the authoritative checks: README references the tests and how to run them; no behavioural change to library is made by this feature.

# Implementation notes

- Make minimal, non-breaking text edits to README.md; include exact example commands and code blocks that are safe to copy.
- Add example files into examples/ that are short and reference relative path imports so they work locally in the repo.
- Keep language clear about strict vs lenient parsing; prefer explicit examples that show both behaviours.

# Deliverables

- Updated README.md with all sections described above.
- One or two example JS files in examples/ demonstrating library and CLI usage.
- A brief line in README referencing the exhaustive test and how to skip it with EXHAUSTIVE_TESTS=false if the exhaustive test file is present.

# Notes

This feature is documentation-first and small in code impact; it aids adoption, testing, and reduces support overhead by making the library behaviour explicit and demonstrable in a single repository.