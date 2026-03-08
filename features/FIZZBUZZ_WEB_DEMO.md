# FIZZBUZZ_WEB_DEMO

## Summary

Add an interactive web demo and small CLI enhancement for the existing FizzBuzz library so users can try the functions in the browser and via the CLI. This feature keeps the core library API unchanged but provides a visible, testable demonstration on the website and a small example in README and examples/.

The feature aligns with the mission by making the FizzBuzz functions discoverable and easy to validate through an interactive web page and CLI examples.

## Goals

- Provide an interactive page in src/web/ that lets users enter a positive integer and shows the fizzBuzz result array as a formatted list and allows inspecting fizzBuzzSingle for a single number.
- Add a minimal CLI mode in src/lib/main.js to support running node src/lib/main.js --n 15 or --single 7 that prints results to stdout, without changing existing named exports.
- Add unit tests in tests/unit/ verifying the CLI output formatting for a few cases and that the web demo includes the expected DOM elements when built (behaviour tests can be added later).
- Update README.md with usage examples for the web demo and CLI flags.

## Acceptance Criteria

1. src/lib/main.js still exports named functions fizzBuzz and fizzBuzzSingle.
2. Running npm run build copies the web demo to docs/ so the interactive page is available at docs/index.html and includes an input for a number and buttons to run fizzBuzz and fizzBuzzSingle.
3. Running node src/lib/main.js --n 15 prints the 15-element fizzBuzz array to stdout in one-per-line format, with Fizz/Buzz/FizzBuzz replacements.
4. Running node src/lib/main.js --single 7 prints "7" and --single 15 prints "FizzBuzz".
5. README.md contains a short section demonstrating both the library usage, the CLI examples, and where to find the web demo.
6. Tests in tests/unit/ confirm the CLI produces the expected output for n=0, n=15, single=3 and that errors are thrown for negative or non-integer input when using library functions.

## Notes

- This feature must be implemented without changing the mission-specified behaviour of the exports; only augmentations are allowed.
- Keep changes minimal: only modify src/lib/main.js, tests/unit/, README.md, and src/web/ files as needed. Do not add or remove top-level repo files.
- Follow CONTRIBUTING.md testing and style guidance.

