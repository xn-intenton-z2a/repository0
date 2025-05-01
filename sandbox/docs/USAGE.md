# CLI Usage

This repository template provides an enhanced command-line interface (CLI) that supports the following commands:

- **help**: Displays usage instructions including available commands and options.
- **version**: Outputs the current version of the application as specified in package.json.
- **echo [arguments]**: Echoes back the provided arguments verbatim.
- **Unrecognized Command**: If an unknown command is provided, the CLI will notify the user and display usage instructions.

## Usage

Run the CLI using Node.js as follows:

```
node src/lib/main.js <command> [arguments]
```

## Commands

### help
Displays this help message.

**Example:**

```
node src/lib/main.js help
```

**Output:**

```
Usage: node src/lib/main.js <command> [arguments]
Available Commands:
  help    Show usage instructions
  version Show version information
  echo    Echo the provided arguments
```

### version
Displays the version number from package.json.

**Example:**

```
node src/lib/main.js version
```

**Output:**

```
2.1.0-0
```
*(The version will match the version specified in package.json.)*

### echo
Echoes back the arguments provided after the command.

**Example:**

```
node src/lib/main.js echo Hello world!
```

**Output:**

```
Hello world!
```

### Unrecognized Command

If an unknown command is provided, the CLI will display the following message along with usage instructions:

**Example:**

```
node src/lib/main.js unknown
```

**Output:**

```
Unrecognized command: unknown
Usage: node src/lib/main.js <command> [arguments]
Available Commands:
  help    Show usage instructions
  version Show version information
  echo    Echo the provided arguments
```
