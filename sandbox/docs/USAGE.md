# Usage Guide

This document describes the available CLI commands for the demo application.

## Global Options

- `--help` (`-h`): Show help usage guide.
- `--version` (`-v`): Print the version number.
- `--mission`: Print the mission statement from MISSION.md.
- Default behavior: Echo arbitrary arguments.

### Examples

```bash
npm run start -- --help
```
Displays the help usage guide.

```bash
npm run start -- --version
```
Outputs the current version, e.g., `2.1.0-0`.

```bash
npm run start -- --mission
```
Prints the full mission statement.

```bash
npm run start -- foo bar
```
Outputs:
```
Run with: ["foo","bar"]
```

## `plot` Subcommand

Generate an SVG plot for a supported function and print it to stdout or write to a file.

### Supported Functions

- `quadratic`: Plot the function *y = x²* over the domain [-10, 10].
- `sine`: Plot the function *y = sin(x)* over the domain [-10, 10].

### Examples

#### Quadratic Plot

```bash
npm run start -- plot quadratic
```

This command will output an SVG string starting with:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200">
  <polyline id="quadratic" points="..." />
</svg>
```

#### Sine Plot

```bash
npm run start -- plot sine
```

This command will output an SVG string starting with:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200">
  <polyline id="sine" points="..." />
</svg>
```

### Optional Flags

| Flag                | Description                              | Default          |
|---------------------|------------------------------------------|------------------|
| `--xmin <number>`   | Lower bound of the x-axis                | `-10`            |
| `--xmax <number>`   | Upper bound of the x-axis                | `10`             |
| `--samples <number>`| Number of intervals/samples              | `100`            |
| `--output <filepath>`| Output file path to write SVG          | (stdout)         |

### Examples with Flags

Custom range and resolution:
```bash
npm run start -- plot sine --xmin -5 --xmax 5 --samples 50
```

Write output to file:
```bash
npm run start -- plot quadratic --output quad.svg
```