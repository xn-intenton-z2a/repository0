# CLI Utility Usage

This CLI utility provides enhanced command-line functionality through a set of subcommands. Below are the available commands and usage examples:

## Available Commands

- **diagnostics**
  - Description: Displays diagnostic information including a system check status.
  - Example: `node src/lib/main.js diagnostics`

- **version**
  - Description: Displays the current version of the repository. The version is read from the package.json file.
  - Example: `node src/lib/main.js version`

- **update**
  - Description: Initiates a simulated update process.
  - Example: `node src/lib/main.js update`

## Help Message

If no command or an invalid command is provided, the CLI will display a help message with usage instructions:

```
Usage: node src/lib/main.js <command>
Available commands:
  diagnostics - Display diagnostic information.
  version - Display current version information.
  update - Initiate update process.
```
