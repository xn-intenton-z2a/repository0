# HTTP Preview Server

## CLI Behavior
Introduce a new top-level command serve to start an HTTP server that serves files from a directory and converts supported formats on the fly.

Usage:

npm run start -- serve [--port <port>] [--dir <directory>]

- --port: Port number to listen on; defaults to 3000.
- --dir: Directory path to serve; defaults to current working directory.

When running, the server resolves request paths under the served directory. Files with .md extensions are converted to HTML using markdown-it and markdown-it-github. Files with .ejs extensions are rendered using EJS, loading optional JSON data files of the same base name if present. All other files are served as static assets. Directory listings are generated as simple HTML with links to files and subdirectories.

## Implementation
- sandbox/source/main.js
  - Add imports for http, url, and path modules alongside existing MarkdownIt, markdown-it-github, and ejs imports.
  - In the main switch statement, add case "serve" to call `await doServeCommand(argv)`.
  - Implement `async function doServeCommand(argv)`:
    - Parse `argv.port` and `argv.dir`, applying defaults.
    - Create an HTTP server that on each request:
      - Resolves the request URL to a file path under the served directory.
      - If the path is a directory, generate an HTML index listing.
      - If the path is a file, detect its extension:
        - .md: read and convert to HTML, set Content-Type to text/html.
        - .ejs: read template and optional JSON data, render with EJS, set Content-Type to text/html.
        - Other: read as buffer and serve with appropriate Content-Type based on extension.
      - Handle errors by responding with 404 or 500.
    - Listen on the specified port and log a startup message.

## Testing
- sandbox/tests/serve.test.js
  - Use Vitest to spawn the serve command in a temporary directory with sample files:
    - Create a markdown file and request its HTML conversion.
    - Create an EJS template and an accompanying data JSON file and verify rendered output.
    - Create a plain text file and verify static serving.
    - Request a non-existent file and assert a 404 response.
    - Test custom port and directory flags.

## Documentation
- README.md and sandbox/docs/CLI_USAGE.md
  - Add a section under Commands Reference for serve with usage examples showing default and custom port and directory options, and describing live markdown and template previews.