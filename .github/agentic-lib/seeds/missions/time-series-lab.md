# Mission

A JavaScript library that finds, normalises, refreshes, and analyses temporal data. The repo's `data/` directory accumulates CSV/JSON datasets over successive transform cycles.

This is an ongoing mission. Do not set schedule to off.

## Core Capabilities

- **Discover** — find publicly available time series data (APIs, open data portals) and fetch snapshots into `data/`.
- **Normalise** — parse heterogeneous date/time formats, resample to uniform intervals, handle missing values.
- **Refresh** — on each transform cycle, update existing datasets with newer observations (append, not replace).
- **Forecast** — implement basic forecasting: moving average, exponential smoothing, linear regression.
- **Correlate** — find relationships between datasets: cross-correlation, lag analysis.
- **Report** — generate a `REPORT.md` summarising datasets, trends, and discovered correlations.

## Core Functions

- `discover(sources?)` — search for and download time series data into `data/`.
- `load(file)` — load a CSV or JSON dataset, auto-detect date format.
- `normalise(dataset, interval)` — resample to uniform intervals, interpolate missing values.
- `refresh(file)` — update an existing dataset with newer data from its source.
- `forecast(dataset, method, horizon)` — predict future values using the specified method.
- `correlate(datasetA, datasetB)` — compute cross-correlation between two time series.
- `report(datasets)` — generate a markdown summary report.

## Requirements

- Export all functions as named exports from `src/lib/main.js`.
- Store datasets in `data/` as CSV or JSON with consistent schema.
- Each dataset file should include metadata (source URL, last updated, interval).
- Unit tests covering normalisation, forecasting accuracy, and correlation.
- README with usage examples.

## Acceptance Criteria

- [ ] Can load and normalise at least one real-world dataset
- [ ] Forecast produces reasonable predictions (tested against known data)
- [ ] `data/` directory contains at least one dataset
- [ ] `REPORT.md` is generated with dataset summaries
- [ ] All unit tests pass
- [ ] README documents the API with examples
