# Command-Line Interface (CLI) Plotting Tool

A simple, standalone CLI utility for generating SVG plots of mathematical functions, exporting data, and serving data over HTTP.

## Installation

1. Clone the repository:

   ```bash
   git clone <repository_url>
   cd repository0
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the CLI tool:

   ```bash
   npm run start
   ```

4. Run tests:

   ```bash
   npm test
   ```

## Usage

All commands are invoked by running the entrypoint script `sandbox/source/main.js` with Node.js.

```bash
node sandbox/source/main.js [options]
```

Supported options:

- `--help`                Show help information
- `--version`             Show version number
- `--mission`             Show mission statement (brief)
- `--mission-full`        Show full mission statement
- `--features`            Show list of all available sandbox features (includes MISSION and MISSION-FULL)
- `--serve [port]`        Start HTTP server (default: `4000`)

Plotting functions:

- `--plot <quadratic|sine>`
- `--plots <fn1,fn2,...>`  Plot multiple built-in functions concurrently (e.g., `quadratic,sine`)
  - `--range <start,end>`       Specify X-axis range (default: `0,10`)
  - `--log-scale <x|y|both>`    Apply base-10 log scaling on X axis, Y axis, or both (requires strictly positive range values)
  - `--width <pixels>`          Specify SVG width in pixels (default: `800`)
  - `--height <pixels>`         Specify SVG height in pixels (default: `600`)
  - `--resolution <points>`     Number of sample points (default: `100`)
  - `--stroke-color <color>`    Stroke color (default: `black`)
  - `--stroke-width <width>`    Stroke width (default: `1`)
  - `--fill-color <color>`      Fill color for the polyline (default: `none`)
  - `--background-color <color>` Background color for SVG (optional)
  - `--title <text>`            Add title annotation to SVG
  - `--xlabel <text>`           X-axis label at bottom center
  - `--ylabel <text>`           Y-axis label along left side
  - `--output <filename>`       Output SVG filename (default: `plot.svg`)
  - `--export-data <filename>`  Export computed data to `.csv` or `.json` (single-series only)

Polar plots:

- `--polar <spiral|rose>`
  - `--radius-range <rStart,rEnd>`   Specify radius limits (default: `0,5`)
  - `--angle-range <thetaStart,thetaEnd>`  Specify angle range in radians (default: `0,6.28`)
  - `--width <pixels>`          Specify SVG width in pixels (default: `800`)
  - `--height <pixels>`         Specify SVG height in pixels (default: `600`)
  - `--resolution <points>`          Number of sample points (default: `100`)
  - `--stroke-color <color>`         Stroke color for the plot (default: `black`)
  - `--stroke-width <width>`         Stroke width for the plot (default: `1`)
  - `--fill-color <color>`           Fill color for the polyline (default: `none`)
  - `--background-color <color>`     Background color for SVG (optional)
  - `--title <text>`                 Add title annotation to SVG
  - `--xlabel <text>`                X-axis label at bottom center
  - `--ylabel <text>`                Y-axis label along left side
  - `--output <filename>`            Output SVG filename (default: `polar.svg`)
  - `--export-data <filename>`       Export computed data to `.csv` or `.json`

## Examples

Generate a quadratic plot as SVG with custom styling and annotations:

```bash
node sandbox/source/main.js --plot quadratic --range 0,10 --resolution 50 --stroke-color red --stroke-width 2 \
  --fill-color blue --background-color yellow --title "MyPlot" --xlabel "X-Axis" --ylabel "Y-Axis" \
  --output styled_plot.svg
```

Plot multiple functions in one SVG:

```bash
node sandbox/source/main.js --plots quadratic,sine --range 0,5 --output multi.svg
```

List all sandbox features:

```bash
node sandbox/source/main.js --features
```
