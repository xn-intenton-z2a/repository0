# Overview
Add a new CLI command that generates a Table of Contents (TOC) for a Markdown file. The feature reads a Markdown document, extracts all heading levels, and outputs a nested markdown list reflecting the document structure. This helps users quickly navigate or include a TOC in their documentation.

# CLI Usage

toc <input.md> [-o <output.md>]
- The `toc` command must be the first argument.
- `<input.md>` is the path to the source Markdown file.
- Optional `-o <output.md>` writes the generated TOC to the specified file; otherwise the TOC is written to stdout.

# Implementation Details

1. Extend the main dispatch in `sandbox/source/main.js` to recognize the `toc` command.
2. Parse positional arguments and the optional `-o` flag using minimist.
3. Verify that `<input.md>` is provided; throw an error if missing.
4. Read the Markdown file asynchronously using `fs/promises`.
5. Import `MarkdownIt` from `markdown-it` and parse the file into tokens.
6. Iterate tokens to identify heading tokens (levels 1 through 6) and capture their text and depth.
7. Build a nested markdown list string where each heading is prefixed by indentation based on its level, e.g.:  
   - `- Heading 1`
     - `  - Subheading 1.1`
     - `  - Subheading 1.2`
8. Write the TOC string to the output file if `-o` is provided; otherwise return it for printing to stdout.
9. Use exit code 0 on success, non-zero on missing input, file I/O errors, or parsing errors.

# File Changes

- **sandbox/source/main.js**: Add dispatch logic for `toc`, argument parsing, file reading, heading extraction, TOC generation, and output handling.
- **sandbox/tests/toc.test.js**: Create unit tests covering a file with multiple heading levels, verifying correct nested list output, and testing both stdout and file write behavior.
- **sandbox/docs/README.md**: Document the new `toc` command under CLI Usage with examples.
- **package.json**: Ensure `markdown-it` remains listed and no new dependencies are required.