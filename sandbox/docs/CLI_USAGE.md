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
- `--serve [port]`        Start HTTP server (default: `4000`)

Plotting functions:

- `--plot <quadratic|sine>`
  - `--range <start,end>`       Specify X-axis range (default: `0,10`)
  - `--resolution <points>`     Number of sample points (default: `100`)
  - `--stroke-color <color>`    Stroke color (default: `black`)
  - `--stroke-width <width>`    Stroke width (default: `1`)
  - `--fill-color <color>`      Fill color for the polyline (default: `none`)
  - `--background-color <color>` Background color for SVG (optional)
  - `--title <text>`            Add title annotation to SVG
  - `--xlabel <text>`           X-axis label at bottom center
  - `--ylabel <text>`           Y-axis label along left side
  - `--output <filename>`       Output SVG filename (default: `plot.svg`)
  - `--export-data <filename>`  Export computed data to `.csv` or `.json`

Polar plots:

- `--polar <spiral|rose>`
  - `--radius-range <rStart,rEnd>`   Specify radius limits (default: `0,5`)
  - `--angle-range <thetaStart,thetaEnd>`  Specify angle range in radians (default: `0,6.28`)
  - `--resolution <points>`          Number of sample points (default: `100`)
  - `--stroke-color <color>`         Stroke color (default: `black`)
  - `--stroke-width <width>`         Stroke width (default: `1`)
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
  --fill-color blue --background-color yellow --title "MyPlot" --xlabel "X-Axis" --_ylabel "Y-Axis" \
  --output styled_plot.svg
```

Export rose polar plot data as JSON with custom settings:

```bash
node sandbox/source/main.js --polar rose --radius-range 0,1 --angle-range 0,6.28 --resolution 75 \
  --stroke-color purple --stroke-width 1.5 --fill-color cyan --title "PolarTitle" \
  --export-data data.json
```

Fetch sine plot data via HTTP (CSV format):

```bash
curl "http://localhost:4000/plot-data?function=sine&range=0,6.28&format=csv"
```
