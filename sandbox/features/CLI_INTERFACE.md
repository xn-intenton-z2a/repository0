# CLI Interface

## Purpose
Unify the command-line interface in the core library so that src/lib/main.js provides all CLI commands currently implemented in sandbox/source/main.js. This eliminates duplication and ensures consistent behavior when users invoke the tool from either entrypoint.

## Implementation Details

- Refactor src/lib/main.js to import minimist and implement the same CLI flags and commands as sandbox/source/main.js:
  - --help, -h  Show usage guide
  - --version, -v  Show version from package.json
  - --mission    Show first header and paragraph of MISSION.md
  - --mission-full  Show full MISSION.md content
  - --plot <function>  Generate SVG plot for quadratic or sine with --range and --output flags
  - --polar <function>  Generate SVG polar plot for spiral or rose with --radius-range, --angle-range, --resolution and --output flags
- Move all CLI parsing, validation, SVG generation and file writing logic into src/lib/main.js. Ensure viewBox and polyline rendering match current sandbox behavior.
- Modify sandbox/source/main.js to delegate to the core implementation by calling main(args) exported from src/lib/main.js.

## Testing

- Update existing integration tests to invoke src/lib/main.js directly:
  - spawn node src/lib/main.js with each flag combination and validate stdout, stderr, output files.
- Ensure unit tests for main export still pass and reflect the new signature accepting argv and option callbacks.
- Retain and update sandbox/tests/cli-interface.test.js to validate delegation and backward compatibility.

## Documentation

- Update README.md to document src/lib/main.js as the primary CLI entrypoint and note that sandbox/source/main.js delegates to it.
- Update sandbox/docs/CLI_USAGE.md to reference core CLI commands under src/lib/main.js.
