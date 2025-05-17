# CLI Usage

The repository provides a simple CLI to echo arguments and display the project mission.

## Options

- `--mission`, `-m`  
  Print the project mission statement from `MISSION.md` and exit.

## Examples

# Show the mission statement
npm run start -- --mission

# Show the mission statement using shorthand flag
npm run start -- -m

# Default echo behavior (no flags)
npm run start -- hello world
# => Run with: ["hello","world"]

# Passing additional arguments (without mission flag)
npm run start -- foo bar baz
# => Run with: ["foo","bar","baz"]
