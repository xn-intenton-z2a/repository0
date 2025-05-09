# Overview
Enhance the CLI entry point to generate and output SVG plots for common mathematical functions. By default the tool supports sine and quadratic functions and can be extended for more.

# CLI Usage
Use built-in argument parsing to specify the function and optional output path:
- --function <sine|quadratic>   Required function to plot
- --output <file-path>           Optional path to write SVG file; defaults to printing SVG to stdout

Examples:
npm run start -- --function sine
npm run start -- --function quadratic --output plot.svg

# Source File Changes
Modify src/lib/main.js to:
1. Use minimist to parse CLI arguments
2. Validate the --function flag and default to error on unsupported names
3. Generate an SVG string for sine or quadratic curves
4. Write the SVG string to stdout or to the specified file using fs
5. Exit with code 1 on invalid usage and 0 on success

# Tests
Add sandbox/tests/plot.test.js with feature-level tests:
- Programmatically invoke main with sine and capture SVG output, asserting it includes <svg and </svg>
- Invoke main with an output file path and assert the file is created containing valid SVG
- Assert that unsupported function names cause a thrown error or non-zero exit code

# Documentation
Update README.md to document the new CLI flags, examples of usage, and reference the generated SVG output.