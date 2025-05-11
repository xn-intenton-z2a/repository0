# Overview
Extend the CLI to convert a Markdown file into HTML. Leverage the existing markdown-it and markdown-it-github dependencies to parse and render Markdown syntax, producing an HTML document suitable for further processing or preview.

# CLI Usage
Invoke the converter via the main script:

  node src/lib/main.js convert <input.md> [-o <output.html>]

- The `convert` command must be the first argument.
- `<input.md>` is the path to the source Markdown file.
- Optional `-o <output.html>` writes the HTML output to the specified file; otherwise, HTML is written to stdout.

# Implementation Details
1. Detect the `convert` command in `main(args)`.  
2. Parse and validate positional arguments: input path, optional `-o` flag and output path.  
3. Read the input file asynchronously.  
4. Instantiate `markdown-it` with `markdown-it-github` plugin.  
5. Render the Markdown content into HTML.  
6. Write the result to the output file if provided, or to stdout.  
7. Exit with status code 0 on success, non-zero on error.

# File Changes
- **src/lib/main.js**: Add command dispatch for `convert`, file I/O and Markdown rendering logic.  
- **package.json**: Ensure `markdown-it` and `markdown-it-github` are listed in dependencies.  
- **tests/unit/md-to-html.test.js**: Create unit tests to cover valid conversion, missing input, and error handling.  
- **README.md**: Document the new `convert` command under CLI Usage with examples.