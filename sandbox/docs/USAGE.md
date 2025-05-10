# Usage

This document describes how to use the plotting utilities provided in `sandbox/source/plot.js`.

## Installation

No installation is required. Ensure you have a modern Node.js environment that supports ES modules or run these in a browser that supports JavaScript modules.

## Importing

```javascript
import { plotQuadratic, plotSine } from '../source/plot.js';
```

## plotQuadratic(a, b, c, options)

Generates an SVG string that visualizes the quadratic function:

```
  y = a * x^2 + b * x + c
```

Parameters:

- `a`, `b`, `c` (number): Coefficients of the quadratic equation.
- `options` (object, optional): Configuration options:
  - `width` (number): SVG width in pixels (default 200).
  - `height` (number): SVG height in pixels (default 100).
  - `xMin` (number): Minimum x value (default -10).
  - `xMax` (number): Maximum x value (default 10).

Returns:

- A string containing an `<svg>` element with a `<polyline>` representing the curve.

Example:

```javascript
const svgQuad = plotQuadratic(1, 0, 0);
console.log(svgQuad);
// <svg width="200" height="100" xmlns="...">...<polyline points="..."/></svg>
```

## plotSine(amplitude, frequency, options)

Generates an SVG string that visualizes a sine wave:

```
  y = amplitude * sin(frequency * x)
```

Parameters:

- `amplitude` (number): Peak amplitude of the sine wave.
- `frequency` (number): Frequency multiplier for the sine wave.
- `options` (object, optional): Configuration options:
  - `width` (number): SVG width in pixels (default 200).
  - `height` (number): SVG height in pixels (default 100).
  - `xMin` (number): Minimum x value (default 0).
  - `xMax` (number): Maximum x value (default 2π).

Returns:

- A string containing an `<svg>` element with a `<path>` representing the wave.

Example:

```javascript
const svgSine = plotSine(1, 2);
console.log(svgSine);
// <svg width="200" height="100" xmlns="...">...<path d="..."/></svg>
```

## CLI Usage

```bash
npm install
npm run start -- --help
npm run start
```
