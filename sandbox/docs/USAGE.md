# CLI Usage

This repository provides a command-line interface (CLI) with options to display the mission statement, show the version, display help, or echo arguments.

## Display Mission Statement

Invoke the CLI with the `--mission` flag to print the contents of `MISSION.md`:

```bash
npm run start -- --mission
```

Example output:

```
# Mission Statement

`repository0` is a repository template that showcases the GitHub workflows imported from intentïon `agentic-lib`. Its primary purpose is to demonstrate these automated CI/CD workflows and provide a basis for further development. The mission of the contributors, human or automated, is to showcase the workflow capabilities of the repository.
```

## Display Version

Invoke the CLI with the `--version` flag to print the current package version:

```bash
npm run start -- --version
```

Example output:

```
2.1.0-0
```

## Default Behavior

Without any flags, the CLI will simply echo the provided arguments:

```bash
npm run start -- foo bar
```

Example output:

```
Run with: ["foo","bar"]
```

## Help

Invoke the CLI with the `--help` flag to print the help message:

```bash
npm run start -- --help
```

Example output:

```text
repository0: A CLI demo of our agentic workflows.

Usage: sandbox/source/main.js [options] [arguments]

Options:
  --help      Show this help message
  --mission   Print the repository mission statement
  --version   Print the package version

Examples:
  npm run start -- --help
  npm run start -- --mission
  npm run start -- foo bar
```
