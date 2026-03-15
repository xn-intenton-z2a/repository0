# FILE_IO

Summary

Implement file saving utilities that infer output format from file extension and correctly persist SVG and PNG outputs to disk.

Rationale

Users expect the CLI and library to save files by extension, e.g. .svg and .png, without requiring manual format selection.

Scope

- Add a named export savePlot in src/lib/main.js that accepts a target path and either a string (SVG) or Buffer (PNG) and writes the file.
- Infer format from the target file extension and return a promise that resolves when the file is written.

Files to change

- src/lib/main.js (add savePlot export)
- tests/unit/fileio.test.js (unit tests)

Acceptance Criteria

- savePlot writes an .svg file containing the provided SVG string and an .png file with PNG magic bytes at the start.
- Calling savePlot with an unsupported extension throws a clear error.
- Unit tests verify files written to a temp directory and the contents match expectations.

Implementation notes

- Use fs.promises for file operations and keep the behaviour synchronous in tests by awaiting the returned promise.
- Document behaviour in README, including extension handling and overwriting semantics.
