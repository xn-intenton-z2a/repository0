# FILE_UTILS

## Overview
This feature introduces a set of file handling utilities for the CLI tool. FILE_UTILS provides users with lightweight operations for reading, writing, appending, and searching file contents. This utility helps automate common file operations and integrates well with the repository’s mission of fostering healthy collaboration and self-contained, modular CLI utilities.

## CLI Integration
- **Command Flag:** Introduce a new global flag `--file` to activate file operations.
- **Sub-Commands:** 
  - **read <filename>:** Reads and outputs the content of the specified file.
  - **write <filename> <content>:** Writes the provided content to the specified file, overwriting existing content.
  - **append <filename> <content>:** Appends the provided content to the specified file.
  - **count <filename>:** Counts and displays the number of lines, words, and characters in the file.
  - **search <filename> <pattern>:** Searches the file for the given regex pattern and outputs all matching lines.

## Implementation Details
- Utilize Node’s built-in `fs` module for asynchronous file I/O operations. 
- **Error Handling:** Provide descriptive error messages when files are not found or permissions are insufficient. Validate all inputs to ensure robust behavior.
- **Testing & Documentation:** 
  - Update unit tests to simulate file operations using temporary files. 
  - Include examples in the README and ensure the inline documentation (via comments) explains the command parsing and error handling for each sub-command.

## Alignment with Repository Mission
By adding FILE_UTILS, the repository extends its suite of CLI utilities to cover common file operations. This facilitates automation tasks such as processing logs, managing configuration backups, or handling text data, strengthening the repository’s commitment to functional, modular, single-source file utilities.
