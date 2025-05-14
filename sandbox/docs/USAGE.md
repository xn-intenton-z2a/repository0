# CLI Usage

This repository provides a command-line interface (CLI) demo powered by intentïon agentic-lib with options to display
the mission statement, show the version, display help, or echo arguments.

## Display Mission Statement

Invoke the CLI with the `--mission` flag:

```bash
npm run start -- --mission
```

Output:

```
# Mission Statement

repository0 is a repository template that showcases the GitHub workflows imported from intentïon `agentic-lib`. Its
primary purpose is to demonstrate these automated CI/CD workflows and provide a basis for further development.
```

### Error Case

```bash
npm run start -- --mission
```

Output (when mission file is missing or unreadable):

```
Error reading mission file: ENOENT: no such file or directory, open 'MISSION.md'
```

## Display Version

Invoke the CLI with the `--version` flag:

```bash
npm run start -- --version
```

Output:

```
2.1.0-0
```

## Display License

Invoke the CLI with the `--license` flag:

```bash
npm run start -- --license
```

Output (when license is set):

```
MIT
```

Output (when license is missing or empty):

```
No license specified in package.json.
```

## Default Behavior

Without any flags, the CLI will echo the provided arguments:

```bash
npm run start -- foo bar
```

Output:

```
Run with: ["foo","bar"]
```

## Help

Invoke the CLI with the `--help` flag:

```bash
npm run start -- --help
```

Output:

```
repository0: A CLI demo of our agentic workflows.

Usage: sandbox/source/main.js [options] [arguments]

Options:
  --help      Show this help message
  --mission   Print the repository mission statement
  --version   Print the package version
  --license   Print the package license

Examples:
  npm run start -- --help
  npm run start -- --mission
  npm run start -- --license
  npm run start -- foo bar
```
