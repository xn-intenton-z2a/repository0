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
- `--serve [port]`        Start HTTP server (default: 4000)

Plotting functions:

- `--plot <quadratic|sine>`
  - `--range <start,end>`       Specify X-axis range (default: `0,10`)
  - `--output <filename>`       Output SVG filename (default: `plot.svg`)
  - `--export-data <filename>`  Export computed data to `.csv` or `.json`

Polar plots:

- `--polar <spiral|rose>`
  - `--radius-range <rStart,rEnd>`   Specify radius limits (default: `0,5`)
  - `--angle-range <thetaStart,thetaEnd>`  Specify angle range in radians (default: `0,6.28`)
  - `--resolution <points>`           Number of sample points (default: `100`)
  - `--output <filename>`             Output SVG filename (default: `polar.svg`)
  - `--export-data <filename>`        Export computed data to `.csv` or `.json`

## Examples

Generate a quadratic plot as SVG:

```bash
node sandbox/source/main.js --plot quadratic --range 0,10 --output plot.svg
```

Export rose polar plot data as JSON:

```bash
node sandbox/source/main.js --polar rose --radius-range 0,1 --angle-range 0,6.28 --export-data data.json
```

Fetch sine plot data via HTTP (CSV format):

```bash
curl "http://localhost:4000/plot-data?function=sine&range=0,6.28&format=csv"
```

## Links

- [Mission Statement](../../MISSION.md)
- [Contributing Guidelines](../../CONTRIBUTING.md)
- [License](../../LICENSE.md)
- [agentic-lib on GitHub](https://github.com/xn-intenton-z2a/agentic-lib)