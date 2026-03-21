# README_AUDIT

Summary

Ensure the repository README documents usage examples for both core library functions and the CLI, and that the examples are accurate, minimal, and testable. This feature defines what must be present in README.md to satisfy mission acceptance criteria about documentation.

Motivation

The mission requires README examples showing canonical usage (fizzBuzz and fizzBuzzSingle) and demonstrating expected outputs. A short audit specification with explicit acceptance criteria makes the README verifiable and easy to test automatically.

Scope

- Confirm README.md contains an import example showing the named exports fizzBuzz and fizzBuzzSingle and an example invocation of each.
- Confirm README.md contains sample outputs for fizzBuzz(15) and fizzBuzzSingle for inputs 3, 5, 7, and 15.
- Confirm README.md documents CLI usage for --single and --fizz where the CLI exists.
- Confirm README.md links to the web demo and explains how to view it locally.

Acceptance criteria (explicit, testable)

- README.md contains the string fizzBuzz(15) and a nearby description stating the output ends with FizzBuzz.
- README.md contains the strings fizzBuzzSingle(3) and fizzBuzzSingle(5) with their expected textual results Fizz and Buzz respectively.
- README.md contains a short section describing CLI usage that mentions --single and --fizz and the expected behaviour (single-line output for --single, one-line-per-item for --fizz).
- README.md includes a link or path to src/web/index.html and a one-line instruction on how to view the web demo locally (start script or open file).
- A unit or integration test (tests/unit/readme.test.js or similar) is added or updated to assert the presence of the above strings in README.md; running that test passes.

Implementation notes

- The feature does not prescribe exact wording, only the presence of the required examples and links so they can be validated by a test.
- Prefer small, human-readable prose for examples rather than lengthy code blocks. Examples should be copy-paste friendly and unambiguous about expected outputs.

Testing and verification

- Add or update a small test that reads README.md contents and asserts the presence of required substrings and example outputs.
- Run npm run test:unit and ensure the README audit test passes.

Notes

This is a documentation-first feature: implementation is a documentation change plus a tiny test to assert examples exist and are correct. It helps satisfy the mission acceptance criterion that README documents usage with examples.