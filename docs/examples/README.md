# Sample CSV Data Files

This directory contains sample time series data files for testing the CSV loading functionality.

## data.csv

Simple time series with exponential growth pattern:

| Time | Value |
|------|-------|
| 0    | 1     |
| 1    | 4     |
| 2    | 9     |
| 3    | 16    |
| 4    | 25    |

This represents y = (x+1)² values.

## Usage

Load and plot this data using:

```bash
node src/lib/main.js --csv docs/examples/data.csv --file output.png
```

Or use the programmatic API:

```javascript
import { loadCSV, savePlot } from './src/lib/main.js';

const points = await loadCSV('docs/examples/data.csv');
await savePlot(points, 'output.svg');
```