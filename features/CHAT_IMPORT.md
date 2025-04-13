# CHAT_IMPORT Feature Specification

This feature introduces the ability to import conversation history from various file formats back into the persistent storage file (`.chat_history.json`). It complements the existing CHAT_EXPORT feature by allowing users to restore or migrate conversation data, thereby enhancing data portability and backup capabilities.

# Overview

The CHAT_IMPORT feature empowers users to load conversation history from supported formats (e.g., Markdown and CSV) into the repository. Users will be able to specify the file path and format of the data to be imported. The feature is designed as a single module integrated into the CLI tool, leveraging existing validation, file handling libraries, and coding standards outlined in CONTRIBUTING.md. This enhancement aligns with our mission to offer handy CLI utilities in Node.js.

# Implementation Details

- Create a dedicated module (e.g., `src/lib/chat_import.js`) that reads a file in the chosen format and parses it into a structured JSON format that mirrors `.chat_history.json` structure.
- Support at least two import formats:
  - **Markdown:** Parse Markdown files containing formatted conversation history.
  - **CSV:** Read CSV files and convert rows into conversation entries.
- Use Zod for validating imported data structure and ensure consistency with the existing conversation history schema.
- Implement robust error handling and user feedback if the file is missing, corrupted, or does not match expected formats.
- The module should include an option for session titling and allow merging imported sessions with existing conversation history.

# CLI Integration & Testing

- Extend the main CLI (in `src/lib/main.js`) to add a new command, for example: `import`, where users can pass parameters such as `--format` and `--file`.
- Update unit tests in the appropriate test directory to cover multiple import formats and edge cases, ensuring a reliable import process.
- Provide clear documentation and examples in the README file on how to use the `CHAT_IMPORT` feature.

# Dependencies and Further Considerations

- No additional dependencies are required; rely on existing libraries such as Zod for validation and standard Node.js modules for file I/O.
- Maintain the consistent coding style with current features and ensure full test coverage as outlined in CONTRIBUTING.md.
- Future improvements may expand supported formats or provide interactive prompts for file import without CLI flags.
