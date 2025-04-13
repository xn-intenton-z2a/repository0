# CHAT_EXPORT Feature Specification

This feature will provide functionality to export persistent conversation history stored in the `.chat_history.json` file into multiple formats: Markdown, HTML, PDF, and CSV. The implementation will be a single-source module integrated into the CLI tool, following the repository's mission to deliver handy CLI utilities in Node.js.

# Overview

The CHAT_EXPORT feature enables users to convert their conversation history into portable formats for sharing, archival, or further processing. The export process will use existing dependencies (e.g., pdfkit for PDF generation and EJS for HTML templating) and enforce robust command input validation using Zod.

# Implementation Details

- Create a dedicated module (e.g., `src/lib/chat_export.js`) that handles reading from `.chat_history.json` and converts data into the desired format.
- Integrate with the main CLI tool to add a new command such as `export` that accepts parameters like `--format` and `--output`.
- Use Zod to validate incoming CLI parameters to ensure that the format specified is one of: `markdown`, `html`, `pdf`, or `csv`.
- Leverage existing libraries: 
  - Use `pdfkit` for generating PDFs.
  - Use `ejs` for HTML templating if needed.
  - Implement conversion logic for Markdown and CSV output directly.
- Implement error handling and clear user feedback in case of invalid parameters or missing conversation history.

# CLI Integration & Testing

- Extend the CLI in `src/lib/main.js` to handle the new `export` command, e.g., `node src/lib/main.js export --format=pdf --output=report.pdf`.
- Write unit tests in the appropriate test directory to cover each export format and edge cases.
- Update the documentation (README.md) with usage examples and instructions on how to use the `CHAT_EXPORT` feature.

# Dependencies and Further Considerations

- No additional dependencies are required beyond those already listed in `package.json`.
- Ensure that the export module maintains consistency with the existing coding style and is fully covered by tests.
- Future enhancements could include additional export options or custom templates for HTML exports.
