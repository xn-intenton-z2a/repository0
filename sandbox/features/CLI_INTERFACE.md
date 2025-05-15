# CLI Interface

## Purpose
Unify all command-line interface functionality into the core library entrypoint in `src/lib/main.js`, consolidating sandbox-specific commands and flags so that both the library and the sandbox entrypoint behave identically and support the full feature set (config file, custom expression, data export, styling, resolution, demo, and HTTP server).

# CLI Behavior

- Support the following flags and subcommands in `src/lib/main.js`:
  - Global flags: `--help`/`-h`, `--version`/`-v`, `--mission`, `--mission-full`, `--config <path>`
  - Plot commands:
    - `--plot <quadratic|sine>`
      - `--range <start,end>` (default `0,10`)
      - `--resolution <points>` (default `100`)
      - `--expression <js expression>` to override named functions
      - `--export-data <file.csv|file.json>` to export raw data
      - `--stroke-color <color>`, `--stroke-width <number>`, `--fill-color <color>`, `--background-color <color>`
      - `--output <filename>` for SVG output
  - Polar commands:
    - `--polar <spiral|rose>`
      - `--radius-range <rStart,rEnd>` (default `0,5`)
      - `--angle-range <start,end>` (default `0,6.28`)
      - `--resolution <points>` (default `100`)
      - `--export-data <file.csv|file.json>`
      - Styling flags as above
      - `--output <filename>` for SVG output
  - Server command:
    - `--serve [port]` to start the HTTP server on the specified or default port (default `3000`)

- Process flag precedence: help > version > mission-full > mission > serve > polar > plot > demo.
- Merge configuration file defaults when `--config` is provided or discovered in current/home directory, allowing default values for all CLI options.

# Implementation Details

1. Consolidate CLI parsing, validation, data generation, SVG rendering, styling, and file writing logic in `src/lib/main.js` using `minimist`, `fs`, and core helpers.
2. Implement support for JSON/YAML config file parsing (leveraging `js-yaml`), merging with CLI flags, and honoring explicit flags over config defaults.
3. Compile and validate custom expressions with `new Function('x','return '+expression)` and sample evaluation to catch errors.
4. Branch on data export when `--export-data` is present to write CSV/JSON files and exit.
5. Integrate styling options by injecting `<rect>` for background and attributes on `<polyline>`.
6. Move HTTP server routing logic (serve, `/plot`, `/polar`, `/plot-data`, `/polar-data`, `/mission`, `/version`, `/help`) into core; reuse the same handlers for CLI.
7. In `sandbox/source/main.js`, delegate immediately to `main(args)` exported from `src/lib/main.js` after minimal setup (shebang, import, args slice).

# Testing

- Update and extend integration tests in `sandbox/tests/` to invoke `src/lib/main.js` directly for all CLI and HTTP behaviors.
- Ensure existing tests for help, version, mission, plot, polar, data export, expression, resolution, styling, config file, and server endpoints pass against the unified implementation.
- Add new tests for config file support and styling in both CLI and HTTP contexts.

# Documentation

- Update `README.md` to point to `src/lib/main.js` as the primary CLI entrypoint and list the full set of commands and flags.
- Update `sandbox/docs/CLI_USAGE.md` and `sandbox/docs/HTTP_SERVER.md` to reflect the unified CLI and HTTP API, including examples for config file, expression, styling, and export-data.
