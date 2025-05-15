# CLI Usage

`repository0` demonstrates automated CLI workflows and SVG plot generation.

## Overview

This command-line tool provides help, version, and mission information, and generates SVG plots of mathematical functions and polar plots.

## What’s Inside

- **CLI Entrypoint**: `sandbox/source/main.js`
- **Supported Commands & Flags:**
  - `--help`              Show help information.
  - `--version`           Show version number.
  - `--mission`           Show mission statement.
  - `--mission-full`      Show full mission statement.
  - `--plot <function>`   Generate an SVG plot. Supported functions: `quadratic`, `sine`.
    - `--range <start,end>`   X-axis range (default: `0,10`).
    - `--output <filename>`   Output filename (default: `plot.svg`).
  - `--polar <function>`  Generate an SVG polar plot. Supported functions: `spiral`, `rose`.
    - `--radius-range <rStart,rEnd>`   Radius range (default: `0,5`).
    - `--angle-range <thetaStart,thetaEnd>`  Angle range in radians (default: `0,6.28`).
    - `--resolution <points>`  Number of sample points (default: `100`).
    - `--output <filename>`   Output filename (default: `polar.svg`).

## Usage

### Installation

```bash
npm install
```

### Run CLI

```bash
npm run start
```

### Examples

```bash
# Display help
node sandbox/source/main.js --help

# Show version
node sandbox/source/main.js --version

# Show mission statement
node sandbox/source/main.js --mission

# Show full mission statement
node sandbox/source/main.js --mission-full

# Generate quadratic plot
node sandbox/source/main.js --plot quadratic --range 0,10 --output plot.svg

# Generate sine plot over -3.14 to 3.14
node sandbox/source/main.js --plot sine --range -3.14,3.14 --output sine.svg

# Generate spiral polar plot
node sandbox/source/main.js --polar spiral --radius-range 0,5 --angle-range 0,6.28 --resolution 100 --output polar.svg

# Generate rose polar plot
node sandbox/source/main.js --polar rose --radius-range 0,1 --angle-range 0,6.28 --resolution 200 --output rose.svg
```

## Data Export

- `--export-data <filename>`: Export computed plot data instead of SVG. The `<filename>` must end with `.csv` or `.json`. When used with `--plot` or `--polar`, data pairing of `x,y` points are exported.
  - For CSV: file includes header `x,y` and data rows.
  - For JSON: file is a JSON array of objects `{ x: number, y: number }`.

### Examples

```bash
node sandbox/source/main.js --plot quadratic --export-data data.csv
node sandbox/source/main.js --polar rose --export-data data.json
```

## Links

- [MISSION.md](../../MISSION.md)
- [CONTRIBUTING.md](../../CONTRIBUTING.md)
- [LICENSE.md](../../LICENSE.md)
- [agentic-lib GitHub repository](https://github.com/xn-intenton-z2a/agentic-lib)
