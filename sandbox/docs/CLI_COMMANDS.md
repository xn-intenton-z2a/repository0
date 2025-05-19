# CLI Commands

This CLI supports the following commands:

## help
Displays usage instructions and a summary of available commands.

## mission
Reads and prints the mission statement from `MISSION.md` file.

## version
Reads and prints the `version` field from `package.json`.

## echo
Prints any additional arguments passed after the echo command.

### Examples

    npm run start -- help
    npm run start -- mission
    npm run start -- version
    npm run start -- echo Hello World
