# EXHAUSTIVE_TESTS

# Summary

Add a focused feature that implements exhaustive unit tests asserting the library preserves the round-trip property for the complete valid integer domain (1–3999). The tests ensure fromRoman(toRoman(n)) === n for every valid n and document execution considerations so maintainers can run or skip the suite as needed.

# Motivation

The library's core correctness requirement is the round-trip invariant across the full permitted range. Representative tests are valuable, but an exhaustive programmatic check provides the strongest guardrail against regressions, especially when automated agents or refactors modify conversion logic.

# Scope

- Create a single unit test file under tests/unit/exhaustive.test.js that:
  - Imports the named exports toRoman and fromRoman from src/lib/main.js (or the built docs lib-main.js helper when appropriate for the test runner environment).
  - Iterates integers 1 through 3999 and asserts fromRoman(toRoman(n)) === n.
  - Asserts toRoman throws RangeError for values 0 and 4000 and that fromRoman throws TypeError for a selection of malformed examples (e.g., IIII, VV, IL).
- Keep the test deterministic and reasonably fast. If necessary, provide a short note in the test to skip or gate the exhaustive loop with an environment variable (EXHAUSTIVE_TESTS=false) to avoid CI timeouts; default behaviour in CI should run the loop.
- Update tests only; no library code changes are required for this feature.

# Implementation notes

- Use the existing test runner (vitest) and project test conventions.
- Keep assertions simple and idiomatic: strict equality for round-trip checks and throws for error cases.
- If performance becomes an issue, the test may be guarded by process.env.EXHAUSTIVE_TESTS !== 'false'. Document this guard in the test file header comment.

# Acceptance criteria

- A new test file tests/unit/exhaustive.test.js exists and runs under npm test.
- The exhaustive round-trip assertion passes: fromRoman(toRoman(n)) === n for every n in 1..3999 when the guard is enabled.
- toRoman(0) and toRoman(4000) throw RangeError as expected.
- fromRoman rejects clearly malformed inputs by throwing TypeError for examples such as IIII, VV, IL.
- The test file documents how to disable the exhaustive loop via EXHAUSTIVE_TESTS=false if needed.

# Notes

This feature complements existing STRICT_VALIDATION and ensures the library's core invariant is continuously validated by unit tests without changing runtime behaviour of the library API.