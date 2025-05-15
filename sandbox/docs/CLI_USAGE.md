# CLI Usage

This document describes the command-line interface for `repository0`.

## Commands

### --help

Displays help information, including a summary of all available commands and example invocations.

Example:
```
$ node sandbox/source/main.js --help
Usage: node main.js [options]

Options:
  --help      Show help information
  --version   Show version number
  --mission   Show mission statement

Examples:
  $ node main.js --help
  $ node main.js --version
  $ node main.js --mission

For full mission statement see MISSION.md
```

### --version

Prints the current version of the tool, as specified in `package.json`.

Example:
```
$ node sandbox/source/main.js --version
2.1.0-0
```

### --mission

Shows the first header and paragraph from the project's `MISSION.md` file.

Example:
```
$ node sandbox/source/main.js --mission
# Mission Statement

`repository0` is a repository template that showcases the GitHub workflows imported from intentïon `agentic-lib`.
```

### --plot <function>

Generates an SVG plot for the specified mathematical function. Supported functions: `quadratic`, `sine`.

Optional flags:
- `--range <start,end>`: Defines the x-axis range for the plot (default: `0,10`).
- `--output <filename>`: Specifies the output filename for the SVG (default: `plot.svg`).

Examples:
```
$ node sandbox/source/main.js --plot quadratic
# Creates `plot.svg` with the quadratic curve
$ node sandbox/source/main.js --plot sine --range -3.14,3.14 --output sine.svg
# Creates `sine.svg` with the sine curve over the specified range
```

### --polar <function>

Generates an SVG polar plot for the specified function. Supported functions: `spiral`, `rose`.

Optional flags:
- `--radius-range <rStart,rEnd>`: Defines the radius range for the plot (default: `0,5`).
- `--angle-range <thetaStart,thetaEnd>`: Defines the angle range in radians (default: `0,6.28`).
- `--resolution <points>`: Number of sample points (default: `100`).
- `--output <filename>`: Specifies the output filename for the SVG (default: `polar.svg`).

Examples:
```
$ node sandbox/source/main.js --polar spiral
# Creates `polar.svg` displaying an Archimedean spiral with default settings
$ node sandbox/source/main.js --polar rose --radius-range 0,1 --angle-range 0,6.28 --resolution 200 --output rose.svg
# Creates `rose.svg` displaying a rose curve sampled at 200 points
```

### Default behavior

When no flags are provided, the CLI echoes all positional arguments as a JSON array:

Example:
```
$ node sandbox/source/main.js foo bar
Run with: ["foo","bar"]
```
