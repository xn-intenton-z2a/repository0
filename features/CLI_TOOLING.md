# CLI_TOOLING

Overview

Provide a small command-line interface that exposes core library functionality for human inspection and scripting. The CLI is a convenience surface that reuses the same encode/decode/registry logic as the library and should remain small, fast, and dependency-free.

Primary commands and options

- list-encodings [--json]
  - Prints a table of registered encodings with fields: name, charsetSize, bitsPerChar, and a short sample of the charset. When --json is provided, output a JSON array with the metadata objects.
- encode <encodingName> <hex-or-file>
  - Encodes binary data supplied as a 32-character hex string for UUIDs or as a file path; if the argument looks like 32 hex characters it is treated as raw hex bytes, otherwise as a path to read. Prints the encoded string to stdout.
- decode <encodingName> <text>
  - Decodes the supplied encoded text using the named encoding and prints hex bytes to stdout (lowercase, no dashes for UUID-sized output). For UUID-sized output, the CLI may support an option to print a dashed canonical UUID.
- compare-uuids
  - Generates the UUID comparison table used in the README across registered encodings and prints it in a compact tabular text format or JSON when --json is used.

Design constraints

- The CLI must be synchronous, fast to start and use only the library code and Node standard libs. Avoid adding heavy dependencies for formatting.
- The CLI must reuse the library API rather than reimplement encoding logic.
- Provide clear exit codes: 0 on success, non-zero on error and print descriptive errors to stderr.

Acceptance criteria

- Invoking the CLI with --help or without arguments prints a short usage summary and exits successfully.
- list-encodings --json prints valid JSON that parses to an array where each entry has name, charsetSize, and bitsPerChar fields.
- encode and decode commands perform correct round-trip transformations for at least one representative UUID and for a small binary file supplied as a path.
- compare-uuids reproduces the same comparison results used by the README generation script (examples/) so the table can be generated from the CLI as part of documentation workflows.

Implementation notes

- Implement command parsing with minimal logic; prefer small argument parsing rather than a full CLI library.
- Keep the CLI surface as a thin wrapper around existing named exports so tests can invoke the functions directly as well as via the CLI.
