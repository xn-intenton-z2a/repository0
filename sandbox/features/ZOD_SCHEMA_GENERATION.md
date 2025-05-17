# Zod Schema Generation

Introduce a new CLI command gen-schema that reads a JSON file and generates a corresponding Zod schema module.

# CLI Behavior

The new command accepts a JSON file path and an optional --output flag. It parses the JSON file, infers a Zod schema matching the structure of the data, and outputs JavaScript code exporting a default Zod schema. If --output is provided the code is written to the specified file; otherwise it is printed to stdout.

Usage:

 npm run start -- gen-schema <inputFile> [--output <schemaFile>]

# File Modifications

- sandbox/source/main.js: import { z } from "zod" and add a gen-schema case in the CLI switch. Read the input JSON file with fs/promises, parse it, call a helper function inferZodSchema(data) to build a Zod schema string, wrap the schema in a JavaScript module exporting default schema, and handle the --output flag to write or print the generated code.
- sandbox/tests/gen-schema.test.js: add feature-level tests that create temporary JSON files with flat objects, nested objects, and arrays, invoke node sandbox/source/main.js gen-schema, and assert that output or written file contains the expected Zod object definitions for each field type. Verify that the --output option writes a valid .js file exporting the schema.
- README.md: update the CLI Usage section to document the gen-schema command with examples for generating schemas from flat and nested JSON structures.
- package.json: no new dependencies required since zod is already listed.

# Testing

Add tests to verify:

- Generating a schema for a flat object with string, number, and boolean fields produces z.object entries with z.string, z.number, and z.boolean.
- Nested object properties are represented as nested z.object calls.
- Arrays of uniform types produce z.array with the correct element schema.
- The --output flag writes a JavaScript module exporting the default Zod schema to the specified file.