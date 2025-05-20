# ASCII Face Renderer

## Overview
Extend the existing CLI face renderer to include a diagnostics mode that outputs runtime metadata as JSON. Users can inspect application version, loaded configuration path, lists of default and custom emotions, and mode flags, helping with troubleshooting and integration.

## CLI Interface
- Preserve all existing positional and flag usage for emotion rendering and configuration (--emotion, --config, --list-emotions, --serve, --port).
- Introduce --diagnostics flag. When provided, the application:
  - Ignores other flags and arguments except --config (to report path and count).
  - Gathers diagnostic data and prints it in JSON format to stdout.
  - Exits with code 0.
- Diagnostic JSON includes keys:
  - version: string (from package.json)
  - defaultEmotions: array of strings
  - customEmotionsCount: number
  - loadedConfigPath: string or null
  - serveMode: boolean
  - listMode: boolean

## Source Modifications
- In src/lib/main.js, before parsing emotion or serve/list logic, detect --diagnostics flag in args.
- Load version from package.json dynamically (e.g., import or read file) and assemble defaultEmotions from the defaultFaces object.
- If --config is provided, resolve its path and count custom keys; otherwise set loadedConfigPath to null and customEmotionsCount to 0.
- Determine serveMode and listMode from filtered arguments.
- Print JSON.stringify(diagnosticsObject, null, 2) to console.log and return immediately.
- Ensure diagnostics mode runs before any server start or file exit logic.

## Tests
- Add unit tests in tests/unit/main.test.js under a "Diagnostics" suite.
- Test main(["--diagnostics"]) writes a valid JSON string matching expected keys and default values (no config).
- Test main(["--config", jsonPath, "--diagnostics"]) reports loadedConfigPath equal to jsonPath and customEmotionsCount equal to number of mappings in the file.
- Mock console.log and process.exit where needed and parse output JSON for assertions.

## Documentation
- Update README.md under CLI Usage to document the --diagnostics flag with an example:
  npm run start -- --diagnostics
- Enhance docs/ASCII_FACE_RENDER.md to describe diagnostics mode, its JSON schema, and sample output.
- Provide guidance on interpreting each field in the diagnostics output.
