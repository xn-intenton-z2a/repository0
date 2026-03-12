# EXPORTS_DOCS

Summary

Clarify and document the library exports, provide JSDoc comments in src/lib/main.js, and update README usage examples to show both programmatic and CLI usage.

Motivation

Good documentation and typed JSDoc make the library discoverable and easy to use by other developers and by the website demo and tests.

Specification

- Update src/lib/main.js with succinct JSDoc for fizzBuzz and fizzBuzzSingle including parameter and error details
- README.md must include:
  - A short code example importing the named exports
  - CLI usage examples for single and range modes
  - A note on error behaviour for non-integers and negative numbers

Tests and Acceptance Criteria

- README contains exact examples that can be copy-pasted and executed
- Unit tests import named exports by name (not default import) to verify the public API surface

Notes

- Do not change package.json module type or add new dependencies; keep examples simple and accurate.

