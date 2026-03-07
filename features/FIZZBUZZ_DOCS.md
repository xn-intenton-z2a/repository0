# FIZZBUZZ_DOCS

Overview

Improve repository documentation and examples to clearly demonstrate the library API, CLI usage, and expected outputs so contributors and users can quickly validate behavior and run examples in the browser or locally.

Specification

- Update README.md to include usage examples for both fizzBuzz and fizzBuzzSingle with expected outputs, and a short section showing how to run the CLI with npm run start:cli.
- Add a concise examples section describing expected outputs for common inputs (3, 5, 15) and edge cases (0, negative, non-integer).
- Ensure package.json scripts reference the CLI appropriately and that the build:web script continues to copy src/web into docs/.
- Keep documentation focused on the mission and avoid extraneous content.

Testing

- Documentation changes do not require unit tests, but examples should be manually verifiable via npm run start:cli and npm test.

Acceptance Criteria

- README contains clear examples for fizzBuzz and fizzBuzzSingle.
- README documents how to run the CLI and shows example output for node src/lib/main.js 15.
- The docs build step continues to work (npm run build:web) and includes updated examples in docs/.

Implementation Notes

- Make minimal, focused edits to README.md only for usage examples and CLI instructions unless examples in src/web are added (see FIZZBUZZ_WEB).
- Keep examples concise and copyable so users can verify outputs locally.
