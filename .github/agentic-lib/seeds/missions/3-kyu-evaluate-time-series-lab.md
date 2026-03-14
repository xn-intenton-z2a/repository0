# Mission

A JavaScript library for generating, normalising, forecasting, and correlating time series data. Uses deterministic data generators rather than external APIs, making results reproducible.

## Required Capabilities

- Generate a sine wave dataset with configurable periods, noise level, and sample rate. Returns an array of `{ time, value }` objects.
- Generate a seeded random walk for a given number of steps. Returns an array of `{ time, value }` objects.
- Load time series from a CSV file with columns `time,value`. Auto-detect ISO 8601 and Unix timestamp date formats.
- Normalise a dataset to uniform intervals using linear interpolation for missing values.
- Forecast future values using:
  - Simple moving average (window size N, horizon M).
  - Exponential smoothing (alpha 0.0–1.0, horizon M).
- Compute Pearson cross-correlation between two datasets for lags from -maxLag to +maxLag (default 20). Return an array of `{ lag, r }` objects.
- Generate a markdown report summarising datasets (row count, min, max, mean, trend direction).

## Requirements

- Export all public API as named exports from `src/lib/main.js`.
- No external runtime dependencies.
- All random generators must accept a seed for deterministic output.
- Comprehensive unit tests covering generation, normalisation, forecasting accuracy, and correlation.
- README with usage examples.

## Acceptance Criteria

- [ ] Generating a sine wave with 2 periods, 0 noise, 100 samples produces 200 data points tracing a clean sine wave
- [ ] Generating a random walk with seed 42 produces identical output on repeated calls (deterministic)
- [ ] Normalising fills gaps with linearly interpolated values
- [ ] Moving average forecast with window 10, horizon 20 returns 20 predicted values
- [ ] Forecast of a known sine wave has RMSE < 0.5 for a 10-point horizon
- [ ] Cross-correlation of two offset sine waves shows peak correlation at the correct lag
- [ ] Report produces a markdown string with dataset summaries
- [ ] All unit tests pass
- [ ] README documents the API with examples
