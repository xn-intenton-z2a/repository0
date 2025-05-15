# NOISE_SUPPORT

# Purpose
Add optional random noise to generated data series to simulate measurement variations, stochastic processes, or measurement error in both Cartesian and polar plots.

# CLI Behavior
- Introduce flag --noise <stddev> to add Gaussian noise with standard deviation stddev to Y values of the data series before rendering or exporting.
- Support an optional --random-seed <integer> flag for deterministic noise generation; when provided, seed the pseudorandom generator for reproducible noise.
- Validate stddev is a non-negative number and random-seed is an integer; on invalid values, print descriptive error and exit with code 1.
- Apply noise after computing raw data points and before any transformations or styling.

# HTTP Endpoints
- Extend GET /plot and GET /polar to accept query parameters:
  noise=<number> and randomSeed=<integer>.
- Validate parameters; on invalid noise or seed, respond with HTTP 400 and descriptive error message.
- Apply Gaussian noise to the Y coordinates of each data point (using optional seed) before generating SVG or data export.

# Implementation Details
- In CLI handler (handlePlot and handlePolar), read argv.noise and argv['random-seed'] and validate.
- In HTTP handlers for /plot and /polar, use params.get('noise') and params.get('randomSeed') and validate.
- Implement a simple seeded PRNG (e.g., mulberry32) when randomSeed is provided; otherwise use Math.random.
- Implement Gaussian noise via Box-Muller transform: noise = stddev * sqrt(-2 * log(u1)) * cos(2*pi*u2).
- For each data point, set y = y + noise and proceed with transformations (e.g., log scale) and rendering.

# Testing
- Add sandbox/tests/noise-support.test.js covering:
  - CLI: --plot sine --noise 0.5 applies noise to Y values (assert distribution or count of modified values).
  - CLI: --noise -1 exits with code 1 and descriptive error.
  - CLI: --plot quadratic --noise 0.1 --random-seed 42 produces reproducible Y outputs in repeated runs.
  - HTTP: GET /plot?function=sine&range=0,6.28&noise=0.2 returns SVG with modified Y coordinates and proper Content-Type.
  - HTTP: invalid noise or randomSeed parameters result in 400 with descriptive message.

# Documentation
- Update sandbox/docs/CLI_USAGE.md to document --noise and --random-seed flags with examples.
- Update sandbox/docs/HTTP_SERVER.md to document noise and randomSeed query parameters with usage and error examples.
- Update README.md features section to include Noise Support.