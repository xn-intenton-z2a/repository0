# Markdown to HTML Conversion

## CLI Behavior

The new command markdown accepts a markdown file path and an optional output file path using the --output flag. It parses the markdown with markdown-it and the markdown-it-github plugin to produce HTML. The generated HTML is written to stdout or to the specified output file.

Usage:

npm run start -- markdown path/to/file.md
npm run start -- markdown path/to/file.md --output path/to/output.html

## File Modifications

- sandbox/source/main.js: import MarkdownIt from markdown-it and markdownItGithub from markdown-it-github, add a markdown case in the CLI switch. Read the markdown file with fs/promises, instantiate MarkdownIt with the github plugin, call render on the file content, and handle the --output flag to write the result when provided.
- sandbox/tests/markdown.test.js: add feature-level tests that create a temporary markdown file containing headings, links, code blocks, and tables, invoke node sandbox/source/main.js markdown, and assert that the HTML output contains the expected tags. Also verify that the --output option creates the output file with correct contents.
- README.md: update the CLI Usage section to document the markdown command with examples.
- package.json: verify that markdown-it and markdown-it-github are listed as dependencies (no change required if already present).

## Testing

Add tests to verify:

- Converting a markdown file with headings results in corresponding h1 and h2 tags in HTML.
- Links in markdown produce anchor tags with href attributes.
- Code blocks are wrapped in pre and code tags.
- The --output flag writes the HTML to the specified file path.