# Zod Integration

## CLI Behavior

Introduce two related commands for seamless Zod schema workflows:

### gen-schema
Read a JSON file and infer a Zod schema matching its structure. Output a JavaScript module exporting the generated schema.

Usage:

  npm run start -- gen-schema <inputJsonFile> [--output <schemaFile>]

- If --output is provided, write the generated schema module to the specified file. Otherwise print to stdout.

### validate
Validate a JSON data file against an existing Zod schema module.

Usage:

  npm run start -- validate <schemaModuleFile> <dataJsonFile> [--output <validatedFile>]

- Dynamically import the schema module (it must export a default Zod schema).
- On success, print "Valid JSON data" and, if --output is provided, write the parsed data to the specified file.
- On failure, print detailed Zod error messages and exit with a non-zero status.

## File Modifications

- sandbox/source/main.js:
  - Import { z } from "zod".
  - In the CLI switch, replace separate gen-schema and validate cases with combined handling:
    - For gen-schema: read input JSON, infer schema via helper inferZodSchema, wrap in module export, handle --output.
    - For validate: dynamic import of schema module, read and parse JSON data file, call schema.parse, handle success/failure and --output.
  - Implement helper inferZodSchema(data) that recursively builds Zod expressions for flat, nested, and array types.

- README.md:
  - Document both gen-schema and validate commands with usage examples for flat JSON objects, nested structures, and validation scenarios.

- package.json:
  - Ensure zod remains listed under dependencies.

## Testing

- sandbox/tests/gen-schema.test.js:
  - Create JSON fixtures for flat objects, nested objects, and arrays.
  - Invoke the CLI gen-schema command and assert the output or written file contains correct z.object, z.number, z.string, z.boolean, and z.array calls matching input structure.

- sandbox/tests/validate.test.js:
  - Write a temporary schema module exporting a Zod schema (e.g., z.object({ a: z.string(), b: z.number() })).
  - Create valid and invalid JSON data files.
  - Invoke node sandbox/source/main.js validate and assert valid data prints success and invalid data prints error messages and exits non-zero.
  - Test --output flag writes the parsed, type-safe object as JSON to the specified file.