# EJS Template Rendering

This feature introduces a new CLI command `render` to process EJS templates with optional JSON data.

# CLI Behavior

The new command accepts a template file path and an optional data file path. It renders the template with EJS and outputs the result to stdout or writes to a file if an output path is provided.

Usage:

npm run start -- render <templateFile> [dataFile] [--output <outputFile>]

Examples:

npm run start -- render template.ejs
npm run start -- render template.ejs data.json
npm run start -- render template.ejs data.json --output result.html

# File Modifications

- **sandbox/source/main.js**: import `ejs` and add a `render` case in the CLI switch. Read files with `fs/promises`, call `ejs.render` or `ejs.renderFile`, and handle the `--output` flag to write to disk if provided.
- **sandbox/tests/render.test.js**: add a feature-level test that creates a temporary EJS template and data, invokes `node sandbox/source/main.js render`, and asserts the rendered output matches expectations.
- **README.md**: update the CLI Usage section to document the new `render` command with examples.
- **package.json**: verify that `ejs` is listed as a dependency (no change required if already present).

# Testing

Add tests to verify:

- Rendering a template without data outputs the correct static result.
- Rendering with a JSON data file interpolates variables correctly.
- The `--output` option writes the rendered result to the specified file.