# ASCII Face Renderer

## Overview
Enhance the CLI face renderer to allow users to supply a custom configuration file defining their own emotion-to-ASCII mappings. Out of the box, default faces remain available, but advanced users can override or extend them by passing a JSON or YAML config file.

## CLI Interface
- Support existing positional and --emotion flag usage unchanged.
- Introduce --config <path> flag. When provided, load the file at <path> as JSON or YAML to obtain a mapping of emotion keywords to multi-line ASCII faces.
- Merge custom mappings with defaults: user definitions override defaults, and defaults fill in any missing emotions.
- If config is invalid (file not found, parse error, or schema mismatch), print a clear error message to stderr and exit with non-zero code.

## Source Modifications
- In src/lib/main.js, after parsing args, detect --config flag and read the following argument as file path.
- Use fs to read the file synchronously and use js-yaml to parse if it does not end in .json, otherwise use JSON.parse.
- Validate the parsed object with zod schema requiring keys of type string and values of type string containing newline-anchored frames.
- Merge validated custom faces into the default faces object before selecting the face to render.
- Ensure HTTP service (--serve) also uses the merged faces mapping for requests.

## Tests
- Create temporary config files in tests/unit/main.test.js: one JSON and one YAML defining at least one custom face (e.g. "confused": "\n  o_O\n").
- Test CLI mode:
  - Invoke main(args) with --config <path> and verify console.log uses the custom face for the new emotion and defaults for others.
  - Verify error behavior when config file is missing or invalid schema triggers process exit.
- Test HTTP mode:
  - Start server with --serve --config <path> --port 0 and confirm GET /?emotion=confused returns the custom face.

## Documentation
- Update README.md and docs/ASCII_FACE_RENDER.md to describe the --config flag, supported JSON and YAML formats, schema requirements, and examples showing custom config usage.
