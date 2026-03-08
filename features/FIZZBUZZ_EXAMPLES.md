# FIZZBUZZ_README

Summary

Improve and standardise the project README so it documents the canonical library API, CLI usage, examples script, TypeScript note, and how to run tests and the web demo. The README must provide short, machine-findable substrings required by tests and human-friendly usage instructions that mirror the canonical behaviour in FIZZBUZZ_CORE.

Specification

- The README must include the substrings fizzBuzz(15) and fizzBuzzSingle(3) in plain prose and mention npm test.
- Provide one-line usage examples (not fenced code blocks) that reference node examples/simple-run.js and node src/lib/main.js 15 as runnable commands for the examples script and CLI respectively.
- Add a short sentence indicating that TypeScript declarations are available at src/lib/main.d.ts if present.
- Mention build:web as the command used to create a static docs/ site and that the web demo lives in src/web/ and is copied into docs/ by the build:web script.
- Keep the README changes minimal and machine-parseable: avoid long paragraphs and do not add code fences so automated substring checks remain simple and stable.

Acceptance criteria

- README.md contains the substrings fizzBuzz(15) and fizzBuzzSingle(3) and the tokens examples/simple-run.js or node src/lib/main.js 15 and npm test.
- README mentions build:web and src/web/ and includes a brief TypeScript note pointing at src/lib/main.d.ts when declarations are present.
- The README remains concise and does not introduce runtime changes or new dependencies.

Testing guidance

- Automated checks should locate the required substrings anywhere in README.md and assert they exist.
- Integration tests that spawn examples/simple-run.js and the CLI will use the commands referenced in README for human guidance; README updates do not affect program behaviour.

Notes

- This feature is documentation-only and must not change library code. Keep edits minimal and focused on the required substrings and a short usage paragraph.