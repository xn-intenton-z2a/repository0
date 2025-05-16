# CLI Commands

Add support for common CLI commands to the main script so users can query usage, version, and mission directly from the terminal.

# Usage

The application should recognize the following flags:

- `--help` or `-h`: Print a help message showing available commands with descriptions and exit with code 0.
- `--version` or `-v`: Read the version field from package.json and print it.
- `--mission` or `-m`: Read the MISSION.md file and output its contents.
- No flags: Echo positional arguments as before.

# Behavior

1. When the user invokes `npm run start -- --help`, the script prints:
   Usage: main [options] [arguments]
   Options:
     -h, --help     Show help
     -v, --version  Show version number
     -m, --mission  Show mission statement

2. When the user invokes `npm run start -- --version`, the script reads the version from package.json and prints it, e.g., `2.1.0-0`.

3. When the user invokes `npm run start -- --mission`, the script loads MISSION.md from the project root and prints its full contents to stdout.

4. When no recognized flags are present, the script preserves current behavior: print `Run with: [...]` containing the positional arguments.

# Implementation Details

- Modify `src/lib/main.js` to parse `process.argv.slice(2)` and branch on flags.
- Use ESM imports to read package.json and MISSION.md (using `fs/promises`).
- Update tests in `tests/unit/main.test.js` and add new tests in `tests/unit/cli.test.js` to verify each command outputs expected content and exits without error.
- Update `README.md` to document the new CLI flags with usage examples.
- No changes to other code paths or external dependencies beyond `fs/promises` which is built-in.